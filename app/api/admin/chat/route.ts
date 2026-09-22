import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

const PAGE_SIZE = 30;
const MSG_PAGE = 60;

const CONV_COLS =
  'id, telegram_id, user_name, status, created_at, updated_at, last_message, last_message_at, last_sender_type, unread_by_owner, handled_by, needs_owner, ai_reason';

export async function GET(req: Request) {
  const ok = await verifyAdminSession();

  if (!ok) {
    return NextResponse.json(
      { error: 'Sesi admin habis. Silakan login ulang.' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    if (conversationId) {
      const before = searchParams.get('before');

      let q = supabaseAdmin
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(MSG_PAGE + 1);

      if (before) {
        q = q.lt('created_at', before);
      }

      const { data, error } = await q;

      if (error) throw error;

      const rows = data || [];
      const hasMore = rows.length > MSG_PAGE;
      const messages = rows.slice(0, MSG_PAGE).reverse();

      let conversation: any = null;

      if (!before) {
        const { data: conv } = await supabaseAdmin
          .from('chat_conversations')
          .select(CONV_COLS)
          .eq('id', conversationId)
          .maybeSingle();

        conversation = conv;
      }

      return NextResponse.json({
        messages,
        hasMore,
        conversation,
      });
    }

    if (searchParams.get('stats') === '1') {
      const [all, unread, open, closed, needs] =
        await Promise.all([
          supabaseAdmin
            .from('chat_conversations')
            .select('id', { count: 'exact', head: true }),

          supabaseAdmin
            .from('chat_conversations')
            .select('id', { count: 'exact', head: true })
            .gt('unread_by_owner', 0),

          supabaseAdmin
            .from('chat_conversations')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'open'),

          supabaseAdmin
            .from('chat_conversations')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'closed'),

          supabaseAdmin
            .from('chat_conversations')
            .select('id', { count: 'exact', head: true })
            .eq('needs_owner', true)
            .eq('status', 'open'),
        ]);

      return NextResponse.json({
        total: all.count || 0,
        unread: unread.count || 0,
        open: open.count || 0,
        closed: closed.count || 0,
        needs: needs.count || 0,
      });
    }

    const filter = searchParams.get('filter') || 'all';
    const search = (searchParams.get('search') || '').trim();
    const cursor = searchParams.get('cursor');

    let q = supabaseAdmin
      .from('chat_conversations')
      .select(CONV_COLS)
      .order('last_message_at', {
        ascending: false,
        nullsFirst: false,
      })
      .limit(PAGE_SIZE + 1);

    if (filter === 'needs') {
      q = q.eq('needs_owner', true).eq('status', 'open');
    } else if (filter === 'unread') {
      q = q.gt('unread_by_owner', 0);
    } else if (filter === 'open') {
      q = q.eq('status', 'open');
    } else if (filter === 'closed') {
      q = q.eq('status', 'closed');
    }

    if (search) {
      const safe = search.replace(/[%,()*\\]/g, ' ').trim();

      if (safe) {
        q = q.or(
          `user_name.ilike.%${safe}%,telegram_id.ilike.%${safe}%`
        );
      }
    }

    if (cursor) {
      q = q.lt('last_message_at', cursor);
    }

    const { data, error } = await q;

    if (error) throw error;

    const rows = data || [];
    const hasMore = rows.length > PAGE_SIZE;

    const conversations = rows
      .slice(0, PAGE_SIZE)
      .map((c: any) => ({
        ...c,
        user_name:
          c.user_name || `User ${c.telegram_id}`,
        last_message_at:
          c.last_message_at || c.updated_at,
      }));

    return NextResponse.json({
      conversations,
      hasMore,
      nextCursor: hasMore
        ? conversations[conversations.length - 1]?.last_message_at
        : null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Gagal memuat chat' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const ok = await verifyAdminSession();

  if (!ok) {
    return NextResponse.json(
      { error: 'Sesi admin habis. Silakan login ulang.' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { action, conversationId, text, status } = body;

    if (action === 'bulk_reply') {
      const ids: string[] = Array.isArray(
        body.conversationIds
      )
        ? body.conversationIds.slice(0, 200)
        : [];

      const t =
        typeof text === 'string'
          ? text.trim()
          : '';

      if (!ids.length || !t) {
        return NextResponse.json(
          {
            error:
              'Pilih percakapan dan isi pesan',
          },
          { status: 400 }
        );
      }

      if (t.length > 2000) {
        return NextResponse.json(
          {
            error:
              'Pesan terlalu panjang (maks 2000 karakter)',
          },
          { status: 400 }
        );
      }

      const rows = ids.map((id) => ({
        conversation_id: id,
        sender_type: 'owner',
        sender_id: 'owner',
        message: t,
      }));

      const { error } = await supabaseAdmin
        .from('chat_messages')
        .insert(rows);

      if (error) throw error;

      await supabaseAdmin
        .from('chat_conversations')
        .update({
          handled_by: 'owner',
          needs_owner: false,
          ai_paused_at: new Date().toISOString(),
        })
        .in('id', ids);

      return NextResponse.json({
        success: true,
        sent: ids.length,
      });
    }

    if (action === 'bulk_status') {
      const ids: string[] = Array.isArray(
        body.conversationIds
      )
        ? body.conversationIds.slice(0, 500)
        : [];

      if (
        !ids.length ||
        (status !== 'open' && status !== 'closed')
      ) {
        return NextResponse.json(
          { error: 'Data tidak valid' },
          { status: 400 }
        );
      }

      const patch: any = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (status === 'closed') {
        patch.unread_by_owner = 0;
      }

      const { error } = await supabaseAdmin
        .from('chat_conversations')
        .update(patch)
        .in('id', ids);

      if (error) throw error;

      if (status === 'closed') {
        await supabaseAdmin
          .from('chat_messages')
          .update({
            read_at: new Date().toISOString(),
          })
          .in('conversation_id', ids)
          .eq('sender_type', 'user')
          .is('read_at', null);
      }

      return NextResponse.json({
        success: true,
      });
    }

    if (action === 'mark_all_read') {
      const { data: unread, error: uErr } =
        await supabaseAdmin
          .from('chat_conversations')
          .select('id')
          .gt('unread_by_owner', 0)
          .limit(1000);

      if (uErr) throw uErr;

      const ids = (unread || []).map(
        (c: any) => c.id
      );

      if (ids.length) {
        await supabaseAdmin
          .from('chat_messages')
          .update({
            read_at: new Date().toISOString(),
          })
          .in('conversation_id', ids)
          .eq('sender_type', 'user')
          .is('read_at', null);

        await supabaseAdmin
          .from('chat_conversations')
          .update({
            unread_by_owner: 0,
          })
          .in('id', ids);
      }

      return NextResponse.json({
        success: true,
        count: ids.length,
      });
    }

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId wajib diisi' },
        { status: 400 }
      );
    }

    if (action === 'mark_read') {
      const { error } = await supabaseAdmin
        .from('chat_messages')
        .update({
          read_at: new Date().toISOString(),
        })
        .eq('conversation_id', conversationId)
        .eq('sender_type', 'user')
        .is('read_at', null);

      if (error) throw error;

      await supabaseAdmin
        .from('chat_conversations')
        .update({
          unread_by_owner: 0,
        })
        .eq('id', conversationId);

      return NextResponse.json({
        success: true,
      });
    }

    if (action === 'set_status') {
      if (
        status !== 'open' &&
        status !== 'closed'
      ) {
        return NextResponse.json(
          { error: 'Status tidak valid' },
          { status: 400 }
        );
      }

      const patch: any = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (status === 'closed') {
        patch.needs_owner = false;
        patch.handled_by = 'ai';
        patch.ai_reason = null;
        patch.ai_paused_at = null;
        patch.ai_turns = 0;
      }

      const { error } = await supabaseAdmin
        .from('chat_conversations')
        .update(patch)
        .eq('id', conversationId);

      if (error) throw error;

      return NextResponse.json({
        success: true,
      });
    }

    if (action === 'takeover') {
      const { error } = await supabaseAdmin
        .from('chat_conversations')
        .update({
          handled_by: 'owner',
          needs_owner: false,
          ai_paused_at: new Date().toISOString(),
        })
        .eq('id', conversationId);

      if (error) throw error;

      return NextResponse.json({
        success: true,
      });
    }

    if (action === 'handback') {
      const { error } = await supabaseAdmin
        .from('chat_conversations')
        .update({
          handled_by: 'ai',
          needs_owner: false,
          ai_reason: null,
          ai_paused_at: null,
          ai_turns: 0,
        })
        .eq('id', conversationId);

      if (error) throw error;

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

    const {
      data: conversation,
      error: convErr,
    } = await supabaseAdmin
      .from('chat_conversations')
      .select('id')
      .eq('id', conversationId)
      .maybeSingle();

    if (convErr) throw convErr;

    if (!conversation) {
      return NextResponse.json(
        {
          error:
            'Percakapan tidak ditemukan',
        },
        { status: 404 }
      );
    }

    const {
      data: message,
      error: sendErr,
    } = await supabaseAdmin
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        sender_type: 'owner',
        sender_id: 'owner',
        message: trimmed,
      })
      .select('*')
      .single();

    if (sendErr) throw sendErr;

    await supabaseAdmin
      .from('chat_conversations')
      .update({
        handled_by: 'owner',
        needs_owner: false,
        ai_paused_at: new Date().toISOString(),
      })
      .eq('id', conversationId);

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error:
          err?.message ||
          'Gagal mengirim pesan',
      },
      { status: 500 }
    );
  }
}