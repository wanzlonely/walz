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

    const { data: conversations, error } = await supabaseAdmin
      .from('chat_conversations')
      .select('*')
      .order('last_message_at', { ascending: false, nullsFirst: false });

    if (error) throw error;
    return NextResponse.json({ conversations: conversations || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Gagal memuat chat' }, { status: 500 });
  }
}

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
        .from('chat_conversations')
        .update({ unread_by_owner: 0 })
        .eq('id', conversationId);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === 'set_status') {
      if (status !== 'open' && status !== 'closed') {
        return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 });
      }
      const { error } = await supabaseAdmin
        .from('chat_conversations')
        .update({ status })
        .eq('id', conversationId);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    const trimmed = typeof text === 'string' ? text.trim() : '';
    if (!trimmed) {
      return NextResponse.json({ error: 'Pesan tidak boleh kosong' }, { status: 400 });
    }
    if (trimmed.length > 2000) {
      return NextResponse.json({ error: 'Pesan terlalu panjang (maks 2000 karakter)' }, { status: 400 });
    }

    const { data: conversation, error: convErr } = await supabaseAdmin
      .from('chat_conversations')
      .select('unread_by_user')
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
        sender: 'owner',
        text: trimmed,
      })
      .select('*')
      .single();

    if (sendErr) throw sendErr;

    const { error: updateErr } = await supabaseAdmin
      .from('chat_conversations')
      .update({
        last_message: trimmed,
        last_message_at: new Date().toISOString(),
        status: 'open',
        unread_by_user: (conversation.unread_by_user || 0) + 1,
      })
      .eq('id', conversationId);

    if (updateErr) throw updateErr;

    return NextResponse.json({ success: true, message });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Gagal mengirim pesan' }, { status: 500 });
  }
}
