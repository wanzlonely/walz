import { NextResponse } from 'next/server';
import { verifyTelegramInitData } from '@/lib/utils';
import { supabaseAdmin } from '@/lib/supabase-admin';

type TgUser = { id: number | string; first_name?: string; username?: string };

function displayNameFrom(tgUser: TgUser, telegramId: string) {
  return tgUser.username ? `@${tgUser.username}` : tgUser.first_name || `User ${telegramId}`;
}

async function getOrCreateConversation(telegramId: string) {
  const { data: existing, error: findErr } = await supabaseAdmin
    .from('chat_conversations')
    .select('*')
    .eq('telegram_id', telegramId)
    .maybeSingle();

  if (findErr) throw findErr;
  if (existing) return existing;

  const { data: created, error: createErr } = await supabaseAdmin
    .from('chat_conversations')
    .insert({
      telegram_id: telegramId,
      status: 'open',
    })
    .select('*')
    .single();

  if (createErr) throw createErr;
  return created;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const initData = searchParams.get('initData') || '';

    const tgUser = verifyTelegramInitData(initData);
    if (!tgUser || !tgUser.id) {
      return NextResponse.json({ error: 'Akses tidak sah. Buka melalui Telegram.' }, { status: 401 });
    }

    const telegramId = tgUser.id.toString();
    const conversation = await getOrCreateConversation(telegramId);

    const { data: messages, error: msgErr } = await supabaseAdmin
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true })
      .limit(200);

    if (msgErr) throw msgErr;

    const unreadCount = (messages || []).filter((m) => m.sender_type === 'owner' && !m.read_at).length;

    return NextResponse.json({
      conversation: {
        ...conversation,
        user_name: displayNameFrom(tgUser, telegramId),
        unread_by_user: unreadCount,
      },
      messages: messages || [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Gagal memuat chat' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { initData, action, text } = body;

    const tgUser = verifyTelegramInitData(initData);
    if (!tgUser || !tgUser.id) {
      return NextResponse.json({ error: 'Akses tidak sah. Buka melalui Telegram.' }, { status: 401 });
    }

    const telegramId = tgUser.id.toString();
    const conversation = await getOrCreateConversation(telegramId);

    if (action === 'mark_read') {
      const { error } = await supabaseAdmin
        .from('chat_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversation.id)
        .eq('sender_type', 'owner')
        .is('read_at', null);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // default action: send message
    const trimmed = typeof text === 'string' ? text.trim() : '';
    if (!trimmed) {
      return NextResponse.json({ error: 'Pesan tidak boleh kosong' }, { status: 400 });
    }
    if (trimmed.length > 2000) {
      return NextResponse.json({ error: 'Pesan terlalu panjang (maks 2000 karakter)' }, { status: 400 });
    }

    const { data: message, error: sendErr } = await supabaseAdmin
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

    const { error: updateErr } = await supabaseAdmin
      .from('chat_conversations')
      .update({
        status: 'open',
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversation.id);

    if (updateErr) throw updateErr;

    return NextResponse.json({ success: true, message });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Gagal mengirim pesan' }, { status: 500 });
  }
}
