import { NextResponse, after } from 'next/server';
import { verifyTelegramInitData } from '@/lib/utils';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { handleAiSupport } from '@/lib/ai-support';

export const maxDuration = 60;

type TgUser = {
  id: number | string;
  first_name?: string;
  username?: string;
};

function displayNameFrom(tgUser: TgUser, telegramId: string) {
  return tgUser.username
    ? `@${tgUser.username}`
    : tgUser.first_name || `User ${telegramId}`;
}

async function getOrCreateConversation(
  telegramId: string,
  userName: string
) {
  const { data: existing, error: findErr } = await supabaseAdmin
    .from('chat_conversations')
    .select('*')
    .eq('telegram_id', telegramId)
    .maybeSingle();

  if (findErr) throw findErr;

  if (existing) {
    if (existing.user_name !== userName) {
      await supabaseAdmin
        .from('chat_conversations')
        .update({ user_name: userName })
        .eq('id', existing.id);

      existing.user_name = userName;
    }

    return existing;
  }

  const { data: created, error: createErr } = await supabaseAdmin
    .from('chat_conversations')
    .insert({
      telegram_id: telegramId,
      status: 'open',
      user_name: userName,
    })
    .select('*')
    .single();

  if (createErr) {
    const { data: again } = await supabaseAdmin
      .from('chat_conversations')
      .select('*')
      .eq('telegram_id', telegramId)
      .maybeSingle();

    if (again) return again;

    throw createErr;
  }

  return created;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const initData = searchParams.get('initData') || '';

    const tgUser = verifyTelegramInitData(initData);

    if (!tgUser || !tgUser.id) {
      return NextResponse.json(
        { error: 'Akses tidak sah. Buka melalui Telegram.' },
        { status: 401 }
      );
    }

    const telegramId = tgUser.id.toString();
    const userName = displayNameFrom(tgUser, telegramId);

    const conversation = await getOrCreateConversation(
      telegramId,
      userName
    );

    const { data: messages, error: msgErr } = await supabaseAdmin
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: false })
      .limit(200);

    if (msgErr) throw msgErr;

    const ordered = (messages || []).slice().reverse();

    const unreadCount = ordered.filter(
      (m) =>
        (m.sender_type === 'owner' ||
          m.sender_type === 'ai') &&
        !m.read_at
    ).length;

    return NextResponse.json({
      conversation: {
        ...conversation,
        user_name: userName,
        unread_by_user: unreadCount,
      },
      messages: ordered,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Gagal memuat chat' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { initData, action, text } = body;

    const tgUser = verifyTelegramInitData(initData);

    if (!tgUser || !tgUser.id) {
      return NextResponse.json(
        { error: 'Akses tidak sah. Buka melalui Telegram.' },
        { status: 401 }
      );
    }

    const telegramId = tgUser.id.toString();
    const userName = displayNameFrom(tgUser, telegramId);

    const conversation = await getOrCreateConversation(
      telegramId,
      userName
    );

    if (action === 'mark_read') {
      const { error } = await supabaseAdmin
        .from('chat_messages')
        .update({
          read_at: new Date().toISOString(),
        })
        .eq('conversation_id', conversation.id)
        .in('sender_type', ['owner', 'ai'])
        .is('read_at', null);

      if (error) throw error;

      await supabaseAdmin
        .from('chat_conversations')
        .update({
          unread_by_user: 0,
        })
        .eq('id', conversation.id);

      return NextResponse.json({
        success: true,
      });
    }

    const trimmed =
      typeof text === 'string'
        ? text.trim()
        : '';

    if (!trimmed) {
      return NextResponse.json(
        { error: 'Pesan tidak boleh kosong' },
        { status: 400 }
      );
    }

    if (trimmed.length > 2000) {
      return NextResponse.json(
        {
          error:
            'Pesan terlalu panjang (maks 2000 karakter)',
        },
        { status: 400 }
      );
    }

    const { data: message, error: sendErr } =
      await supabaseAdmin
        .from('chat_messages')
        .insert({
          conversation_id: conversation.id,
          sender_type: 'user',
          sender_id: telegramId,
          message: trimmed,
        })
        .select('*')
        .single();

    if (sendErr) throw sendErr;

    if (conversation.status === 'closed') {
      await supabaseAdmin
        .from('chat_conversations')
        .update({
          handled_by: 'ai',
          needs_owner: false,
          ai_reason: null,
          ai_paused_at: null,
          ai_turns: 0,
        })
        .eq('id', conversation.id);
    }

    after(async () => {
      try {
        await handleAiSupport(
          conversation.id,
          message.id
        );
      } catch {}
    });

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error:
          err?.message || 'Gagal mengirim pesan',
      },
      { status: 500 }
    );
  }
}