import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: Request) {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    if (conversationId) {
      const { data: messages, error } = await supabaseAdmin
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(200);

      if (error) throw error;
      return NextResponse.json({ messages: messages || [] });
    }

    const { data: conversations, error: convErr } = await supabaseAdmin
      .from('chat_conversations')
      .select('*');
    if (convErr) throw convErr;

    const list = conversations || [];
    if (list.length === 0) {
      return NextResponse.json({ conversations: [] });
    }

    const ids = list.map((c) => c.id);
    const { data: allMessages, error: msgErr } = await supabaseAdmin
      .from('chat_messages')
      .select('*')
      .in('conversation_id', ids)
      .order('created_at', { ascending: true });
    if (msgErr) throw msgErr;

    const byConversation = new Map<string, any[]>();
    for (const m of allMessages || []) {
      const arr = byConversation.get(m.conversation_id) || [];
      arr.push(m);
      byConversation.set(m.conversation_id, arr);
    }

    const enriched = list.map((c) => {
      const msgs = byConversation.get(c.id) || [];
      const last = msgs[msgs.length - 1];
      const unreadByOwner = msgs.filter((m) => m.sender_type === 'user' && !m.read_at).length;
      return {
        ...c,
        user_name: `User ${c.telegram_id}`,
        last_message: last ? last.message : null,
        last_message_at: last ? last.created_at : c.updated_at,
        unread_by_owner: unreadByOwner,
      };
    });

    enriched.sort((a, b) => {
      const ta = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
      const tb = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
      return tb - ta;
    });

    return NextResponse.json({ conversations: enriched });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Gagal memuat chat' }, { status: 500 });
  }
}

// POST: kirim balasan owner, tandai read, atau ubah status conversation
export async function POST(req: Request) {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { action, conversationId, text, status } = body;

    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId wajib diisi' }, { status: 400 });
    }

    if (action === 'mark_read') {
      const { error } = await supabaseAdmin
        .from('chat_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('sender_type', 'user')
        .is('read_at', null);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === 'set_status') {
      if (status !== 'open' && status !== 'closed') {
        return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 });
      }
      const { error } = await supabaseAdmin
        .from('chat_conversations')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', conversationId);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // default action: send reply
    const trimmed = typeof text === 'string' ? text.trim() : '';
    if (!trimmed) {
      return NextResponse.json({ error: 'Pesan tidak boleh kosong' }, { status: 400 });
    }
    if (trimmed.length > 2000) {
      return NextResponse.json({ error: 'Pesan terlalu panjang (maks 2000 karakter)' }, { status: 400 });
    }

    const { data: conversation, error: convErr } = await supabaseAdmin
      .from('chat_conversations')
      .select('id')
      .eq('id', conversationId)
      .maybeSingle();
    if (convErr) throw convErr;
    if (!conversation) {
      return NextResponse.json({ error: 'Percakapan tidak ditemukan' }, { status: 404 });
    }

    const { data: message, error: sendErr } = await supabaseAdmin
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

    const { error: updateErr } = await supabaseAdmin
      .from('chat_conversations')
      .update({
        status: 'open',
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversationId);

    if (updateErr) throw updateErr;

    return NextResponse.json({ success: true, message });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Gagal mengirim pesan' }, { status: 500 });
  }
}
