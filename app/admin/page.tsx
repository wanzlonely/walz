'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';

function IcoDashboard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  );
}
function IcoReceipt() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );
}
function IcoUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}
function IcoLogout() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}
function IcoRefresh() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15"/>
    </svg>
  );
}
function IcoLock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}
function IcoSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}
function IcoBroadcast() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}
function IcoTag() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  );
}
function IcoZap() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );
}
function IcoShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}
function IcoChat() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  );
}
function IcoSend() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}

function formatChatListTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }
  const y = new Date(now); y.setDate(now.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return 'Kemarin';
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
}

export default function AdminPage() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'users' | 'security' | 'chat'>('dashboard');
  const [userFilter, setUserFilter] = useState<'ALL' | 'FREE' | 'PREMIUM'>('ALL');
  const [data, setData] = useState<any>({ users: [], orders: [], redeemCodes: [], flashSale: null, auditLogs: [] });
  const [search, setSearch] = useState('');
  const [grantDays, setGrantDays] = useState<Record<string, string>>({});
  const [refreshing, setRefreshing] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const [pinInput, setPinInput] = useState('');
  const [pendingActionPayload, setPendingActionPayload] = useState<any>(null);
  const [pinModalOpen, setPinModalOpen] = useState(false);

  const [broadcastText, setBroadcastText] = useState('');
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<string | null>(null);

  const [newCodeName, setNewCodeName] = useState('');
  const [newCodeDays, setNewCodeDays] = useState('7');
  const [newCodeUses, setNewCodeUses] = useState('10');
  const [newCodeDailyLimit, setNewCodeDailyLimit] = useState('');

  const [flashPercentInput, setFlashPercentInput] = useState('25');
  const [flashHoursInput, setFlashHoursInput] = useState('24');

  type ChatFilter = 'all' | 'needs' | 'unread' | 'open' | 'closed';
  const [conversations, setConversations] = useState<any[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [conversationsError, setConversationsError] = useState<string | null>(null);
  const [convHasMore, setConvHasMore] = useState(false);
  const [convCursor, setConvCursor] = useState<string | null>(null);
  const [convLoadingMore, setConvLoadingMore] = useState(false);
  const [chatFilter, setChatFilter] = useState<ChatFilter>('all');
  const [chatSearch, setChatSearch] = useState('');
  const [chatSearchDebounced, setChatSearchDebounced] = useState('');
  const [chatStats, setChatStats] = useState({ total: 0, unread: 0, open: 0, closed: 0, needs: 0 });
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatMessagesLoading, setChatMessagesLoading] = useState(false);
  const [msgHasMore, setMsgHasMore] = useState(false);
  const [chatReplyInput, setChatReplyInput] = useState('');
  const [chatReplySending, setChatReplySending] = useState(false);
  const [chatToast, setChatToast] = useState<string | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [quickReplies, setQuickReplies] = useState<string[]>([
    'Halo kak 👋 Terima kasih sudah menghubungi WALZSHOP. Ada yang bisa kami bantu?',
    'Baik kak, mohon ditunggu ya, sedang kami cek 🙏',
    'Pembayaran sudah kami terima ✅ Paket VIP aktif sekarang.',
    'Mohon kirimkan bukti transfer & Telegram ID kakak ya 🙏',
    'Sudah selesai kak ✅ Jika ada kendala silakan chat lagi.',
  ]);
  const [quickOpen, setQuickOpen] = useState(false);
  const [newQuick, setNewQuick] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const chatUserNearBottomRef = useRef(true);
  const replyRef = useRef<HTMLTextAreaElement>(null);
  const activeIdRef = useRef<string | null>(null);
  const filterRef = useRef<ChatFilter>('all');
  const searchRef = useRef('');

  const fetchCore = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/admin?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const d = await res.json();
        setData({
          users: Array.isArray(d.users) ? d.users : [],
          orders: Array.isArray(d.orders) ? d.orders : [],
          redeemCodes: Array.isArray(d.redeemCodes) ? d.redeemCodes : [],
          flashSale: d.flashSale || null,
          auditLogs: Array.isArray(d.auditLogs) ? d.auditLogs : []
        });
        setAuth(true);
      } else {
        setAuth(false);
      }
    } catch {
      setAuth(false);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCore();
  }, [fetchCore]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', password, telegramId }),
    });
    if (res.ok) { setAuth(true); fetchCore(); } else alert('Akses Ditolak');
  };

  const showChatToast = (msg: string) => {
    setChatToast(msg);
    setTimeout(() => setChatToast(null), 2200);
  };

  const scrollChatToBottom = (smooth = true) => {
    const el = chatScrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  };

  const handleChatScroll = () => {
    const el = chatScrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    chatUserNearBottomRef.current = distanceFromBottom < 120;
  };

  const handleSessionExpired = () => {
    setAuth(false);
  };

  useEffect(() => { activeIdRef.current = activeConversationId; }, [activeConversationId]);
  useEffect(() => { filterRef.current = chatFilter; }, [chatFilter]);
  useEffect(() => { searchRef.current = chatSearchDebounced; }, [chatSearchDebounced]);

  useEffect(() => {
    const t = setTimeout(() => setChatSearchDebounced(chatSearch.trim()), 350);
    return () => clearTimeout(t);
  }, [chatSearch]);

  const fetchChatStats = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/chat?stats=1&t=${Date.now()}`, { cache: 'no-store' });
      if (res.status === 401) return handleSessionExpired();
      if (res.ok) setChatStats(await res.json());
    } catch {}
  }, []);

  const fetchConversations = useCallback(async (opts?: { append?: boolean; cursor?: string | null }) => {
    const append = !!opts?.append;
    if (append) setConvLoadingMore(true);
    else { setConversationsLoading(true); setConversationsError(null); }
    try {
      const params = new URLSearchParams({ filter: filterRef.current, t: String(Date.now()) });
      if (searchRef.current) params.set('search', searchRef.current);
      if (append && opts?.cursor) params.set('cursor', opts.cursor);
      const res = await fetch(`/api/admin/chat?${params.toString()}`, { cache: 'no-store' });
      const d = await res.json();
      if (res.status === 401) return handleSessionExpired();
      if (!res.ok) throw new Error(d.error || 'Gagal memuat daftar chat');
      const list = Array.isArray(d.conversations) ? d.conversations : [];
      setConversations((prev) => {
        if (!append) return list;
        const seen = new Set(prev.map((c) => c.id));
        return [...prev, ...list.filter((c: any) => !seen.has(c.id))];
      });
      setConvHasMore(!!d.hasMore);
      setConvCursor(d.nextCursor || null);
    } catch (err: any) {
      if (!append) setConversationsError(err?.message || 'Gagal memuat daftar chat');
    } finally {
      setConversationsLoading(false);
      setConvLoadingMore(false);
    }
  }, []);

  const markConversationRead = async (conversationId: string) => {
    try {
      await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_read', conversationId }),
      });
    } catch {}
    setConversations((prev) => prev.map((c) => (c.id === conversationId ? { ...c, unread_by_owner: 0 } : c)));
    fetchChatStats();
  };

  const openConversation = async (conversationId: string) => {
    const preview = conversations.find((c) => c.id === conversationId) || null;
    setActiveConversationId(conversationId);
    setActiveConversation(preview);
    setChatMessages([]);
    setMsgHasMore(false);
    setChatMessagesLoading(true);
    try {
      const res = await fetch(`/api/admin/chat?conversationId=${conversationId}&t=${Date.now()}`, { cache: 'no-store' });
      const d = await res.json();
      if (res.status === 401) return handleSessionExpired();
      if (!res.ok) throw new Error(d.error || 'Gagal memuat pesan');
      setChatMessages(d.messages || []);
      setMsgHasMore(!!d.hasMore);
      if (d.conversation) setActiveConversation(d.conversation);
      chatUserNearBottomRef.current = true;
      setTimeout(() => scrollChatToBottom(false), 60);
      if ((preview?.unread_by_owner || d.conversation?.unread_by_owner || 0) > 0) {
        await markConversationRead(conversationId);
      }
    } catch (err: any) {
      showChatToast(err?.message || 'Gagal memuat pesan');
    } finally {
      setChatMessagesLoading(false);
    }
  };

  const loadOlderMessages = async () => {
    if (!activeConversationId || chatMessages.length === 0) return;
    const el = chatScrollRef.current;
    const prevHeight = el?.scrollHeight || 0;
    try {
      const before = encodeURIComponent(chatMessages[0].created_at);
      const res = await fetch(`/api/admin/chat?conversationId=${activeConversationId}&before=${before}&t=${Date.now()}`, { cache: 'no-store' });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Gagal memuat');
      setChatMessages((prev) => [...(d.messages || []), ...prev]);
      setMsgHasMore(!!d.hasMore);
      setTimeout(() => {
        if (el) el.scrollTop = el.scrollHeight - prevHeight;
      }, 30);
    } catch (err: any) {
      showChatToast(err?.message || 'Gagal memuat pesan lama');
    }
  };

  const sendChatReply = async (overrideText?: string) => {
    const text = (overrideText ?? chatReplyInput).trim();
    if (!text || chatReplySending || !activeConversationId) return;
    setChatReplySending(true);
    if (overrideText === undefined) {
      setChatReplyInput('');
      if (replyRef.current) replyRef.current.style.height = 'auto';
    }
    try {
      const res = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: activeConversationId, text }),
      });
      const d = await res.json();
      if (res.status === 401) { handleSessionExpired(); throw new Error('Sesi admin habis. Silakan login ulang.'); }
      if (!res.ok) throw new Error(d.error || 'Gagal mengirim balasan');
      chatUserNearBottomRef.current = true;
      if (d.message) {
        setChatMessages((prev) => (prev.some((m) => m.id === d.message.id) ? prev : [...prev, d.message]));
        setTimeout(() => scrollChatToBottom(true), 30);
      }
      setQuickOpen(false);
    } catch (err: any) {
      showChatToast(err?.message || 'Gagal mengirim balasan');
      if (overrideText === undefined) setChatReplyInput(text);
    } finally {
      setChatReplySending(false);
    }
  };

  const setAiHandling = async (mode: 'takeover' | 'handback') => {
    if (!activeConversationId) return;
    try {
      const res = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: mode, conversationId: activeConversationId }),
      });
      if (!res.ok) throw new Error();
      const patch: any = mode === 'takeover'
        ? { handled_by: 'owner', needs_owner: false }
        : { handled_by: 'ai', needs_owner: false, ai_reason: null };
      setActiveConversation((p: any) => (p ? { ...p, ...patch } : p));
      setConversations((prev) => prev.map((c) => (c.id === activeConversationId ? { ...c, ...patch } : c)));
      showChatToast(mode === 'takeover' ? 'Anda mengambil alih percakapan' : 'Percakapan diserahkan ke AI');
      fetchChatStats();
    } catch {
      showChatToast('Gagal mengubah penanganan');
    }
  };

  const toggleConversationStatus = async () => {
    if (!activeConversationId) return;
    const nextStatus = activeConversation?.status === 'closed' ? 'open' : 'closed';
    const closing = nextStatus === 'closed';
    try {
      const res = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set_status', conversationId: activeConversationId, status: nextStatus }),
      });
      if (!res.ok) throw new Error();
      const extra: any = closing ? { needs_owner: false, handled_by: 'ai', ai_reason: null } : {};
      setActiveConversation((p: any) => (p ? { ...p, status: nextStatus, ...extra } : p));
      setConversations((prev) => prev.map((c) => (c.id === activeConversationId ? { ...c, status: nextStatus, ...extra } : c)));
      showChatToast(nextStatus === 'closed' ? 'Percakapan ditandai selesai' : 'Percakapan dibuka lagi');
      fetchChatStats();
    } catch {
      showChatToast('Gagal mengubah status');
    }
  };

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const exitSelectMode = () => { setSelectMode(false); setSelectedIds([]); setBulkOpen(false); setBulkText(''); };

  const sendBulkReply = async () => {
    const text = bulkText.trim();
    if (!text || selectedIds.length === 0) return;
    setChatReplySending(true);
    try {
      const res = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bulk_reply', conversationIds: selectedIds, text }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Gagal mengirim');
      showChatToast(`Terkirim ke ${d.sent} percakapan`);
      exitSelectMode();
      fetchConversations();
      fetchChatStats();
    } catch (err: any) {
      showChatToast(err?.message || 'Gagal mengirim');
    } finally {
      setChatReplySending(false);
    }
  };

  const bulkSetStatus = async (status: 'open' | 'closed') => {
    if (selectedIds.length === 0) return;
    try {
      const res = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bulk_status', conversationIds: selectedIds, status }),
      });
      if (!res.ok) throw new Error();
      showChatToast(status === 'closed' ? `${selectedIds.length} percakapan diselesaikan` : `${selectedIds.length} percakapan dibuka`);
      exitSelectMode();
      fetchConversations();
      fetchChatStats();
    } catch {
      showChatToast('Gagal memproses');
    }
  };

  const markAllRead = async () => {
    try {
      const res = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_all_read' }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error();
      showChatToast(`${d.count} percakapan ditandai dibaca`);
      fetchConversations();
      fetchChatStats();
    } catch {
      showChatToast('Gagal menandai dibaca');
    }
  };

  const addQuickReply = () => {
    const t = newQuick.trim();
    if (!t) return;
    const next = [t, ...quickReplies.filter((q) => q !== t)].slice(0, 15);
    setQuickReplies(next);
    setNewQuick('');
    try { localStorage.setItem('walz_quick_replies', JSON.stringify(next)); } catch {}
  };

  const removeQuickReply = (t: string) => {
    const next = quickReplies.filter((q) => q !== t);
    setQuickReplies(next);
    try { localStorage.setItem('walz_quick_replies', JSON.stringify(next)); } catch {}
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem('walz_quick_replies');
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length) setQuickReplies(arr);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (activeTab === 'chat' && auth) {
      fetchConversations();
      fetchChatStats();
    }
  }, [activeTab, auth, chatFilter, chatSearchDebounced, fetchConversations, fetchChatStats]);

  useEffect(() => {
    if (auth) fetchChatStats();
  }, [auth, fetchChatStats]);

  useEffect(() => {
    if (!auth) return;

    const channel = supabase
      .channel('owner-chat-inbox')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload: any) => {
        const m = payload.new;
        if (m.conversation_id === activeIdRef.current) {
          setChatMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
          if (m.sender_type === 'user') {
            markConversationRead(m.conversation_id);
          }
          if (chatUserNearBottomRef.current) setTimeout(() => scrollChatToBottom(true), 30);
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_conversations' }, (payload: any) => {
        const row = payload.new;
        if (!row?.id) return;
        const isOpenNow = row.id === activeIdRef.current;
        const merged = isOpenNow ? { ...row, unread_by_owner: 0 } : row;
        if (isOpenNow) setActiveConversation((p: any) => ({ ...(p || {}), ...merged }));

        setConversations((prev) => {
          const f = filterRef.current;
          const q = searchRef.current.toLowerCase();
          const matches =
            (f === 'all' || (f === 'needs' && merged.needs_owner === true && merged.status === 'open') || (f === 'unread' && merged.unread_by_owner > 0) || f === merged.status) &&
            (!q || (merged.user_name || '').toLowerCase().includes(q) || String(merged.telegram_id || '').includes(q));
          const exists = prev.some((c) => c.id === row.id);
          if (!matches) return exists ? prev.filter((c) => c.id !== row.id) : prev;
          const next = exists
            ? prev.map((c) => (c.id === row.id ? { ...c, ...merged, user_name: merged.user_name || c.user_name } : c))
            : [{ ...merged, user_name: merged.user_name || `User ${merged.telegram_id}` }, ...prev];
          return next.sort((a, b) => {
            const ta = new Date(a.last_message_at || a.updated_at || 0).getTime();
            const tb = new Date(b.last_message_at || b.updated_at || 0).getTime();
            return tb - ta;
          });
        });
        fetchChatStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auth]);

  const totalUnreadChats = chatStats.unread;
  const filteredConversations = conversations;

  const requestProtectedAction = (payload: any) => {
    setPendingActionPayload(payload);
    setPinInput('');
    setPinModalOpen(true);
  };

  const confirmPinAndExecute = async () => {
    if (!pendingActionPayload || !pinInput.trim()) return;
    const body = { ...pendingActionPayload, adminPin: pinInput };

    if (pendingActionPayload.action === 'broadcast') {
      setSendingBroadcast(true);
    }

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const resData = await res.json();
      if (res.ok) {
        setPinModalOpen(false);
        setPendingActionPayload(null);
        setPinInput('');
        fetchCore();
        if (pendingActionPayload.action === 'broadcast') {
          setBroadcastResult(resData.message || 'Broadcast terkirim!');
          setBroadcastText('');
        }
      } else {
        alert(resData.error || 'PIN Salah atau Gagal memproses aksi');
      }
    } finally {
      setSendingBroadcast(false);
    }
  };

  const directAction = async (body: any) => {
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    fetchCore();
  };

  if (auth === null) return (
    <div className="min-h-screen bg-[#04060C] flex flex-col items-center justify-center p-4 selection:bg-emerald-500/30">
      <div className="relative flex flex-col items-center gap-4 p-8 bg-[#0B0F1A]/90 border border-emerald-500/30 rounded-3xl backdrop-blur-3xl shadow-[0_0_60px_rgba(16,185,129,0.15)] animate-[scaleIn_0.3s_ease-out]">
        <div className="relative flex items-center justify-center w-16 h-16">
          <div className="absolute inset-0 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/40">
            W
          </div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs font-black tracking-[0.25em] text-emerald-400 uppercase">WALZSHOP HQ</p>
          <p className="text-[10px] text-slate-400 font-medium tracking-wider">Verifikasi Otorisasi Owner...</p>
        </div>
      </div>
    </div>
  );

  if (!auth) return (
    <div className="min-h-screen bg-[#04060C] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-emerald-500/30">
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <form onSubmit={login} className="w-full max-w-[360px] relative z-10">
        <div className="glass-card border border-white/10 p-8 rounded-[36px] shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-500 rounded-2xl mx-auto flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-emerald-500/30 ring-1 ring-white/20">
              W
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white">WALZSHOP HQ</h1>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Tactical Owner Command Center</p>
              <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-[9px] font-extrabold tracking-widest text-emerald-300 uppercase">Secure Portal</span>
              </div>
            </div>
          </div>

          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-1">Telegram ID Owner</label>
              <input
                type="text"
                required
                placeholder="Masukkan Telegram ID"
                value={telegramId}
                onChange={e => setTelegramId(e.target.value)}
                className="w-full bg-[#050811] border border-white/10 text-white placeholder-slate-600 px-4 py-3.5 rounded-2xl text-xs font-medium focus:outline-none focus:border-emerald-500/60 transition-all shadow-inner"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-1">Password Access</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#050811] border border-white/10 text-white placeholder-slate-600 px-4 py-3.5 rounded-2xl text-xs font-medium focus:outline-none focus:border-emerald-500/60 transition-all shadow-inner"
              />
            </div>
          </div>

          <button type="submit" className="w-full py-4 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-slate-950 font-black rounded-2xl text-xs tracking-wider uppercase active:scale-[0.98] shadow-lg shadow-emerald-500/30 hover:brightness-110 transition-all">
            Otorisasi Masuk
          </button>

          <p className="text-center text-[10px] text-slate-500 font-medium">Hanya untuk owner terverifikasi • Encrypted Session</p>
        </div>
      </form>
    </div>
  );

  const pending = (data.orders || []).filter((o: any) => o.status === 'PENDING');
  const approved = (data.orders || []).filter((o: any) => o.status === 'APPROVED');
  const premium = (data.users || []).filter((u: any) => u.status === 'ACTIVE' && u.expiredAt && new Date(u.expiredAt).getTime() > Date.now());
  const freeUsers = (data.users || []).filter((u: any) => !(u.status === 'ACTIVE' && u.expiredAt && new Date(u.expiredAt).getTime() > Date.now()));
  const rev = approved.reduce((s: any, o: any) => s + (o.amount || 0), 0);
  const topReferrers = [...(data.users || [])]
    .filter((u: any) => (u.referralCount || 0) > 0)
    .sort((a: any, b: any) => (b.referralCount || 0) - (a.referralCount || 0))
    .slice(0, 5);

  const isFlashActive = data.flashSale && data.flashSale.active && new Date(data.flashSale.expiresAt).getTime() > Date.now();

  const filteredUsers = (data.users || []).filter((u: any) => {
    const isPrem = u.status === 'ACTIVE' && u.expiredAt && new Date(u.expiredAt).getTime() > Date.now();
    if (userFilter === 'FREE' && isPrem) return false;
    if (userFilter === 'PREMIUM' && !isPrem) return false;
    return u.telegramId?.includes(search) ||
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.profile?.firstName?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#04060C] text-slate-100 font-sans relative overflow-x-hidden pb-36 selection:bg-emerald-500/30">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/12 rounded-full blur-[120px] animate-[pulseGlow_4s_infinite_ease-in-out]" />
        <div className="absolute top-1/3 -right-24 w-[320px] h-[320px] bg-teal-500/8 rounded-full blur-[110px]" />
        <div className="absolute top-2/3 -left-24 w-[300px] h-[300px] bg-violet-600/8 rounded-full blur-[110px]" />
      </div>

      <header className="sticky top-0 z-30 glass bg-[#04060C]/85 border-b border-white/10 px-4 py-3.5 max-w-md mx-auto flex items-center justify-between shadow-xl shadow-black/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/30 ring-1 ring-white/20">
              W
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#04060C] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs font-black tracking-tight text-white leading-none">WALZSHOP HQ</h1>
              <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">OWNER</span>
            </div>
            <p className="text-[9px] text-emerald-400 font-extrabold tracking-wider mt-0.5">Tactical Command Center</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCore}
            disabled={refreshing}
            className={`w-9 h-9 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-white/10 active:scale-90 transition-all shadow-md ${refreshing ? 'animate-spin text-emerald-400' : ''}`}
          >
            <div className="w-4 h-4"><IcoRefresh/></div>
          </button>
          <button
            onClick={() => directAction({ action: 'logout' })}
            className="w-9 h-9 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-300 hover:bg-rose-500/25 active:scale-90 transition-all shadow-md"
          >
            <div className="w-4 h-4"><IcoLogout/></div>
          </button>
        </div>
      </header>

      <main className="px-4 pt-3.5 max-w-md mx-auto space-y-3.5 relative z-10">

        {activeTab === 'dashboard' && (
          <div className="space-y-3.5 animate-[fadeIn_0.25s_ease-out]">

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 glass-card border border-emerald-500/30 p-5 rounded-[28px] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Omset Sukses</p>
                    <p className="text-2xl font-black text-white mt-1 tracking-tight font-mono">
                      Rp {rev.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-black">
                    ↗ {approved.length} Trx
                  </span>
                </div>
                <div className="mt-3.5 pt-2.5 border-t border-white/10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-slate-400 font-medium">Laporan transaksi terverifikasi sistem</span>
                </div>
              </div>

              <div className="glass-card border border-white/10 p-4 rounded-2xl shadow-lg flex flex-col justify-between">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total User</p>
                  <p className="text-xl font-black text-white mt-1 font-mono">{(data.users || []).length}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-bold text-slate-400">
                  <span>{freeUsers.length} Free</span>
                  <span className="text-emerald-400">{premium.length} VIP</span>
                </div>
              </div>

              <div className="glass-card border border-amber-500/30 p-4 rounded-2xl shadow-lg flex flex-col justify-between">
                <div>
                  <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest">VIP Member</p>
                  <p className="text-xl font-black text-amber-300 mt-1 font-mono">{premium.length}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[9px] font-extrabold text-amber-300 uppercase">Aktif Berlangganan</span>
                </div>
              </div>

              <div className={`col-span-2 border p-4 rounded-[28px] shadow-lg transition-all flex items-center justify-between ${
                pending.length > 0 ? 'bg-rose-950/30 border-rose-500/40 shadow-rose-950/30' : 'glass-card border-white/10'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                    pending.length > 0 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-white/5 text-slate-400'
                  }`}>
                    <div className="w-5 h-5"><IcoReceipt/></div>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Pesanan Pending</p>
                    <p className="text-base font-black text-white font-mono">{pending.length} <span className="text-xs text-slate-400 font-sans font-normal">Transaksi</span></p>
                  </div>
                </div>
                {pending.length > 0 ? (
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="px-4 py-2 bg-rose-500 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-500/30 animate-pulse active:scale-95 transition-all"
                  >
                    Periksa
                  </button>
                ) : (
                  <span className="text-[10px] text-emerald-400 font-bold px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                    Selesai ✓
                  </span>
                )}
              </div>
            </div>

            <div className="glass-card border border-rose-500/30 p-5 rounded-[28px] shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shadow-md">
                    <div className="w-5 h-5"><IcoZap/></div>
                  </div>
                  <div>
                    <h2 className="text-xs font-black text-white">Flash Sale Event</h2>
                    <p className="text-[10px] text-slate-400">Atur diskon batas waktu tertentu</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border tracking-wider ${
                  isFlashActive ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' : 'bg-white/5 text-slate-400 border-white/10'
                }`}>
                  {isFlashActive ? 'LIVE' : 'OFFLINE'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase ml-1">Diskon (%)</label>
                  <input
                    type="number"
                    value={flashPercentInput}
                    onChange={e => setFlashPercentInput(e.target.value)}
                    className="w-full bg-[#050811] border border-white/10 text-white px-3.5 py-2.5 rounded-2xl text-xs font-bold text-center focus:outline-none focus:border-rose-500/50 transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase ml-1">Durasi (Jam)</label>
                  <input
                    type="number"
                    value={flashHoursInput}
                    onChange={e => setFlashHoursInput(e.target.value)}
                    className="w-full bg-[#050811] border border-white/10 text-white px-3.5 py-2.5 rounded-2xl text-xs font-bold text-center focus:outline-none focus:border-rose-500/50 transition-all shadow-inner"
                  />
                </div>
              </div>

              <button
                onClick={() => requestProtectedAction({
                  action: 'toggle_flash_sale',
                  flashActive: !isFlashActive,
                  flashPercent: flashPercentInput,
                  flashHours: flashHoursInput
                })}
                className={`w-full py-3.5 font-black text-xs uppercase tracking-wider rounded-2xl active:scale-[0.98] transition-all shadow-lg ${
                  isFlashActive 
                    ? 'bg-white/10 text-rose-300 border border-rose-500/30 hover:bg-white/15' 
                    : 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-rose-500/30 hover:brightness-110'
                }`}
              >
                {isFlashActive ? 'Matikan Flash Sale' : 'Aktifkan Flash Sale'}
              </button>
            </div>

            {topReferrers.length > 0 && (
              <div className="glass-card border border-white/10 p-4.5 rounded-[28px] shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                    <div className="w-4 h-4"><IcoUsers/></div>
                  </div>
                  <div>
                    <h2 className="text-xs font-black text-white">Top Referrer Leaderboard</h2>
                    <p className="text-[10px] text-slate-400">Pengguna paling aktif mengundang</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {topReferrers.map((u: any, idx: number) => (
                    <div key={u.telegramId} className="flex items-center gap-3 p-3 bg-[#050811] border border-white/5 rounded-2xl">
                      <span className={`text-xs font-black w-5 text-center ${idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-slate-300' : 'text-slate-600'}`}>
                        #{idx + 1}
                      </span>
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-md">
                        {(u.telegramId || '?').toString()[0]}
                      </div>
                      <p className="text-[11px] font-bold text-slate-200 font-mono truncate flex-1">{u.telegramId}</p>
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30">
                        {u.referralCount} Undangan
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="glass-card border border-white/10 p-4.5 rounded-[28px] shadow-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <div className="w-4 h-4"><IcoBroadcast/></div>
                </div>
                <div>
                  <h2 className="text-xs font-black text-white">Broadcast Massal</h2>
                  <p className="text-[10px] text-slate-400">Kirim notifikasi ke {(data.users || []).length} pengguna</p>
                </div>
              </div>

              <textarea
                rows={3}
                placeholder="Tulis pesan broadcast resmi..."
                value={broadcastText}
                onChange={e => setBroadcastText(e.target.value)}
                className="w-full bg-[#050811] border border-white/10 text-white placeholder-slate-600 p-3.5 rounded-2xl text-xs font-medium focus:outline-none focus:border-emerald-500/50 resize-none transition-all shadow-inner"
              />

              <button
                onClick={() => requestProtectedAction({ action: 'broadcast', broadcastMessage: broadcastText })}
                disabled={sendingBroadcast || !broadcastText.trim()}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl active:scale-[0.98] disabled:opacity-40 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
              >
                <div className="w-4 h-4"><IcoBroadcast/></div>
                {sendingBroadcast ? 'Mengirim...' : 'Kirim Broadcast (PIN)'}
              </button>

              {broadcastResult && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[11px] font-semibold text-emerald-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {broadcastResult}
                </div>
              )}
            </div>

            <div className="glass-card border border-white/10 p-4.5 rounded-[28px] shadow-xl space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <div className="w-4 h-4"><IcoTag/></div>
                </div>
                <div>
                  <h2 className="text-xs font-black text-white">Kode Promo & Redeem</h2>
                  <p className="text-[10px] text-slate-400">Buat & kelola voucher eksklusif</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase ml-1">Kode Voucher</label>
                  <input type="text" placeholder="Contoh: VIP2026" value={newCodeName} onChange={e => setNewCodeName(e.target.value)} className="w-full bg-[#050811] border border-white/10 text-white px-3.5 py-2.5 rounded-2xl text-xs font-mono font-black uppercase tracking-wider focus:outline-none focus:border-amber-500/50 transition-all shadow-inner" />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase ml-1">Durasi (Hari)</label>
                    <input type="number" placeholder="7" value={newCodeDays} onChange={e => setNewCodeDays(e.target.value)} className="w-full bg-[#050811] border border-white/10 text-white px-3 py-2.5 rounded-2xl text-xs font-bold text-center focus:outline-none focus:border-amber-500/50 transition-all shadow-inner" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase ml-1">Total Kuota</label>
                    <input type="number" placeholder="10" value={newCodeUses} onChange={e => setNewCodeUses(e.target.value)} className="w-full bg-[#050811] border border-white/10 text-white px-3 py-2.5 rounded-2xl text-xs font-bold text-center focus:outline-none focus:border-amber-500/50 transition-all shadow-inner" />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase ml-1">Limit Harian (Opsional)</label>
                  <input type="number" placeholder="Kosongkan jika tanpa batas harian" value={newCodeDailyLimit} onChange={e => setNewCodeDailyLimit(e.target.value)} className="w-full mt-1 bg-[#050811] border border-white/10 text-white px-3.5 py-2.5 rounded-2xl text-xs font-semibold focus:outline-none focus:border-amber-500/50 transition-all shadow-inner" />
                </div>

                <button onClick={() => requestProtectedAction({ action: 'create_redeem_code', code: newCodeName, days: newCodeDays, usesLeft: newCodeUses, dailyLimit: newCodeDailyLimit })} disabled={!newCodeName.trim()} className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl active:scale-[0.98] disabled:opacity-40 transition-all shadow-lg shadow-amber-500/20">
                  + Buat Voucher Baru
                </button>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Daftar Voucher Aktif ({(data.redeemCodes || []).length})</p>
                {(data.redeemCodes || []).length === 0 ? (
                  <div className="py-6 text-center border border-dashed border-white/10 rounded-2xl">
                    <p className="text-[11px] text-slate-500 font-medium">Belum ada kode voucher aktif</p>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {(data.redeemCodes || []).map((c: any) => (
                      <div key={c.code} className="bg-[#050811] border border-white/5 p-3.5 rounded-2xl flex justify-between items-center">
                        <div className="space-y-0.5">
                          <p className="font-mono font-black text-amber-300 text-xs tracking-wider">{c.code}</p>
                          <p className="text-[10px] text-slate-400">+{c.days} Hari VIP • {c.usesLeft} sisa kuota</p>
                          {c.dailyLimit ? (
                            <div className="mt-1 flex items-center gap-2">
                              <div className="w-20 h-1 rounded-full bg-white/10 overflow-hidden">
                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.min(((c.usedToday || 0) / c.dailyLimit) * 100, 100)}%` }} />
                              </div>
                              <span className="text-[9px] font-extrabold text-amber-400">{c.usedToday || 0}/{c.dailyLimit} hari ini</span>
                            </div>
                          ) : null}
                        </div>
                        <button onClick={() => requestProtectedAction({ action: 'delete_redeem_code', code: c.code })} className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-center justify-center transition-all active:scale-90">
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-3.5 animate-[fadeIn_0.25s_ease-out]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-black text-white">Antrean Transaksi</h2>
                <p className="text-[10px] text-slate-400">Verifikasi pembayaran yang masuk</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-[9px] font-black text-rose-300">
                {pending.length} Perlu Tindakan
              </span>
            </div>

            {pending.length === 0 ? (
              <div className="glass-card border border-white/10 p-8 text-center rounded-[28px] space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto text-xl font-black shadow-inner">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-black text-white">Semua Transaksi Selesai</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Tidak ada pesanan pending saat ini</p>
                </div>
              </div>
            ) : pending.map((o: any) => (
              <div key={o.orderId} className="glass-card border border-white/10 p-4.5 rounded-[28px] space-y-3 shadow-xl">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-black text-emerald-300 text-[10px] tracking-wider bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                    #{o.orderId}
                  </span>
                  <span className="text-slate-400 text-[10px] font-medium bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                    {new Date(o.createdAt).toLocaleTimeString('id-ID')}
                  </span>
                </div>

                <div className="bg-[#050811] p-3.5 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-black text-white text-xs">{o.displayName || o.username}</p>
                      <p className="text-slate-400 text-[10px] font-mono mt-0.5">ID: {o.telegramId}</p>
                    </div>
                    <span className="text-[9px] font-black px-2.5 py-1 rounded-full bg-white/10 text-slate-200 border border-white/10">
                      {o.durationDays} Hari VIP
                    </span>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-medium">Total Pembayaran:</span>
                    <span className="text-emerald-400 font-black text-sm font-mono">
                      Rp {o.amount?.toLocaleString('id-ID')}
                    </span>
                  </div>

                  {o.proofNote && (
                    <p className="text-slate-300 italic text-[10px] bg-white/5 p-2 rounded-xl border border-white/5 leading-relaxed">
                      &quot;{o.proofNote}&quot;
                    </p>
                  )}
                </div>

                {o.proofImage && (
                  <div className="relative group w-full h-36 bg-[#050811] rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-emerald-500/50 transition-all" onClick={() => setPreviewImg(o.proofImage)}>
                    <img src={o.proofImage} alt="Bukti Transfer" className="w-full h-full object-contain p-2" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-[9px] font-black uppercase tracking-wider text-white bg-black/60 px-3 py-1.5 rounded-full border border-white/20">
                        Klik Memperbesar
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button onClick={() => directAction({ action: 'order_action', orderId: o.orderId, decision: 'approve' })} className="py-3 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl active:scale-[0.98] shadow-lg shadow-emerald-500/25 hover:brightness-110 transition-all">
                    Approve
                  </button>
                  <button onClick={() => directAction({ action: 'order_action', orderId: o.orderId, decision: 'reject' })} className="py-3 bg-white/5 border border-white/10 text-slate-300 font-extrabold text-xs uppercase tracking-wider rounded-2xl active:scale-[0.98] hover:bg-rose-500/10 hover:text-rose-400 transition-all">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-3.5 animate-[fadeIn_0.25s_ease-out]">

            <div className="glass-card border border-white/10 p-1 rounded-2xl flex gap-1">
              {[
                {k:'ALL', label:`Semua`, count:(data.users || []).length},
                {k:'FREE', label:`Free`, count:freeUsers.length},
                {k:'PREMIUM', label:`VIP`, count:premium.length},
              ].map(tab => (
                <button
                  key={tab.k}
                  onClick={() => setUserFilter(tab.k as any)}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                    userFilter === tab.k ? 'bg-white text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label} <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${userFilter===tab.k?'bg-slate-950/10 font-mono':'bg-white/10'}`}>{tab.count}</span>
                </button>
              ))}
            </div>

            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500">
                <IcoSearch/>
              </div>
              <input
                type="text"
                placeholder="Cari Telegram ID, username, nama..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#050811] border border-white/10 text-white pl-10 pr-4 py-3 rounded-2xl text-xs font-medium placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner"
              />
            </div>

            <div className="space-y-2.5">
              {filteredUsers.map((u: any) => {
                const isBannedUser = u.status === 'BANNED';
                const isPrem = u.status === 'ACTIVE' && u.expiredAt && new Date(u.expiredAt).getTime() > Date.now();
                const currentVal = grantDays[u.telegramId] ?? '30';
                const daysNumber = parseInt(currentVal) || 30;
                const risk = u.riskScore || 0;

                return (
                  <div key={u.telegramId} className="glass-card border border-white/10 p-4 rounded-[28px] space-y-3 shadow-lg">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black shrink-0 shadow-md ${
                          isBannedUser ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 
                          isPrem ? 'bg-gradient-to-tr from-emerald-400 to-teal-500 text-slate-950' : 
                          'bg-white/10 text-slate-300 border border-white/10'
                        }`}>
                          {(u.profile?.firstName?.[0] || u.telegramId?.[0] || 'U').toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-white text-xs truncate max-w-[120px]">{u.profile?.firstName || u.telegramId}</span>
                            {risk > 15 && <span className="px-2 py-0.5 bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[8px] font-black rounded-full">RISK {risk}</span>}
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {u.telegramId} • {u.points || 0} Pts</p>
                        </div>
                      </div>
                      <span className={`shrink-0 text-[8px] font-black px-2.5 py-1 rounded-full tracking-wider uppercase border ${
                        isBannedUser ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 
                        isPrem ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 
                        'bg-white/5 text-slate-400 border-white/10'
                      }`}>
                        {isBannedUser ? 'BANNED' : isPrem ? 'VIP' : 'FREE'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex items-center gap-1 bg-[#050811] border border-white/10 rounded-xl px-2.5 py-2">
                        <input type="text" value={currentVal} onChange={e => setGrantDays(prev => ({ ...prev, [u.telegramId]: e.target.value }))} className="w-8 bg-transparent text-center font-bold text-xs text-white focus:outline-none" />
                        <span className="text-[8px] text-slate-500 font-extrabold">HARI</span>
                      </div>
                      <button onClick={() => requestProtectedAction({ action: 'user_action', userAction: 'grant_premium', targetTelegramId: u.telegramId, durationDays: daysNumber })} className="flex-1 py-2.5 bg-white text-slate-950 font-black text-xs rounded-xl active:scale-95 transition-all shadow-md">
                        +{daysNumber}D VIP
                      </button>
                      {isPrem && (
                        <button onClick={() => requestProtectedAction({ action: 'user_action', userAction: 'revoke_premium', targetTelegramId: u.telegramId })} className="px-3 py-2.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-[10px] rounded-xl active:scale-95 transition-all">
                          Cabut
                        </button>
                      )}
                      <button onClick={() => requestProtectedAction({ action: 'user_action', userAction: isBannedUser ? 'unban' : 'ban', targetTelegramId: u.telegramId })} className={`px-3 py-2.5 font-bold text-[10px] rounded-xl active:scale-95 border transition-all ${
                        isBannedUser ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                      }`}>
                        {isBannedUser ? 'Unban' : 'Ban'}
                      </button>
                    </div>
                  </div>
                );
              })}
              {filteredUsers.length === 0 && (
                <div className="py-8 text-center glass-card border border-white/10 rounded-[28px]">
                  <p className="text-xs text-slate-500 font-medium">Tidak ada pengguna ditemukan</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-3.5 animate-[fadeIn_0.25s_ease-out]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-200">Audit Security Logs</h2>
                <p className="text-[10px] text-slate-400">Riwayat aksi sensitif sistem</p>
              </div>
              <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                {(data.auditLogs || []).length} Log Activity
              </span>
            </div>

            <div className="relative">
              <div className="absolute left-[13px] top-3 bottom-3 w-[2px] bg-white/10" />
              <div className="space-y-3">
                {(data.auditLogs || []).length === 0 ? (
                  <div className="glass-card border border-white/10 p-8 text-center rounded-[28px]">
                    <p className="text-xs text-slate-500">Belum ada catatan aktivitas keamanan</p>
                  </div>
                ) : (
                  (data.auditLogs || []).map((l: any) => (
                    <div key={l.id} className="relative pl-8">
                      <div className="absolute left-0 top-3.5 w-7 h-7 rounded-full bg-[#050811] border border-white/20 flex items-center justify-center shadow-md">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      </div>
                      <div className="glass-card border border-white/10 p-3.5 rounded-2xl space-y-1.5 shadow-md">
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-bold text-emerald-300 text-[9px] tracking-wider bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            {l.action}
                          </span>
                          <span className="text-slate-500 text-[9px] font-medium">{new Date(l.timestamp).toLocaleTimeString('id-ID')}</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-200 leading-relaxed">{l.detail}</p>
                        <p className="text-[9px] text-slate-500 font-mono">Telegram ID: {l.telegramId}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="animate-[fadeIn_0.25s_ease-out] relative h-[calc(100dvh-210px)] min-h-[420px] flex flex-col glass-card border border-white/10 rounded-[32px] overflow-hidden shadow-xl">
            {chatToast && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-3.5 py-2 rounded-full bg-[#050811]/95 border border-white/15 text-[10px] font-bold text-white shadow-xl max-w-[90%] text-center">
                {chatToast}
              </div>
            )}

            {!activeConversationId ? (
              <div className="flex flex-col h-full min-h-0">
                <div className="p-3.5 border-b border-white/10 space-y-2.5 shrink-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="text-xs font-black uppercase tracking-wider text-slate-200">Inbox Support</h2>
                      <p className="text-[10px] text-slate-400 truncate">
                        {chatStats.total.toLocaleString('id-ID')} percakapan
                        {chatStats.unread > 0 ? ` · ${chatStats.unread.toLocaleString('id-ID')} belum dibaca` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {chatStats.unread > 0 && !selectMode && (
                        <button onClick={markAllRead} className="h-8 px-2.5 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-wide text-slate-300 active:scale-95 transition-all">
                          Baca semua
                        </button>
                      )}
                      <button
                        onClick={() => (selectMode ? exitSelectMode() : setSelectMode(true))}
                        className={`h-8 px-2.5 rounded-xl border text-[9px] font-black uppercase tracking-wide active:scale-95 transition-all ${selectMode ? 'bg-violet-500/20 border-violet-400/40 text-violet-200' : 'bg-white/5 border-white/10 text-slate-300'}`}
                      >
                        {selectMode ? 'Batal' : 'Pilih'}
                      </button>
                      <button
                        onClick={() => { fetchConversations(); fetchChatStats(); }}
                        className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 active:scale-95 transition-all"
                      >
                        <div className={`w-3.5 h-3.5 ${conversationsLoading ? 'animate-spin' : ''}`}><IcoRefresh/></div>
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500"><IcoSearch/></div>
                    <input
                      type="text"
                      placeholder="Cari nama, @username, atau Telegram ID..."
                      value={chatSearch}
                      onChange={(e) => setChatSearch(e.target.value)}
                      className="w-full bg-[#050811] border border-white/10 text-white placeholder-slate-600 pl-9 pr-3 py-2 rounded-xl text-[11px] focus:outline-none focus:border-violet-500/50 transition-all"
                    />
                  </div>

                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-0.5 px-0.5">
                    {([
                      { id: 'all', label: 'Semua', n: chatStats.total },
                      { id: 'needs', label: 'Butuh Owner', n: chatStats.needs || 0 },
                      { id: 'unread', label: 'Belum dibaca', n: chatStats.unread },
                      { id: 'open', label: 'Aktif', n: chatStats.open },
                      { id: 'closed', label: 'Selesai', n: chatStats.closed },
                    ] as { id: ChatFilter; label: string; n: number }[]).map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setChatFilter(f.id)}
                        className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-black border transition-all active:scale-95 ${
                          chatFilter === f.id
                            ? 'bg-white text-slate-950 border-white'
                            : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        {f.label}
                        <span className={`ml-1.5 ${chatFilter === f.id ? 'text-slate-600' : 'text-slate-500'}`}>
                          {f.n > 999 ? '999+' : f.n}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
                  {conversationsLoading && conversations.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-500">
                      <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                      <p className="text-xs font-medium">Memuat percakapan...</p>
                    </div>
                  ) : conversationsError ? (
                    <div className="h-full flex flex-col items-center justify-center gap-3 text-center px-6">
                      <p className="text-xs text-rose-300 font-semibold">{conversationsError}</p>
                      <button onClick={() => fetchConversations()} className="px-4 py-2 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-bold rounded-xl active:scale-95 transition-all">
                        Coba Lagi
                      </button>
                    </div>
                  ) : filteredConversations.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center gap-2 text-center px-6">
                      <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-violet-400 flex items-center justify-center">
                        <div className="w-6 h-6"><IcoChat/></div>
                      </div>
                      <p className="text-xs text-slate-300 font-bold">
                        {chatSearchDebounced || chatFilter !== 'all' ? 'Tidak ada hasil' : 'Belum ada percakapan'}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {chatSearchDebounced || chatFilter !== 'all' ? 'Coba ubah filter atau kata kunci.' : 'Pesan dari user akan muncul di sini secara realtime.'}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {filteredConversations.map((c) => {
                        const selected = selectedIds.includes(c.id);
                        const unread = c.unread_by_owner > 0;
                        return (
                          <button
                            key={c.id}
                            onClick={() => (selectMode ? toggleSelect(c.id) : openConversation(c.id))}
                            className={`w-full px-3.5 py-3 flex items-center gap-3 active:bg-white/10 transition-all text-left ${selected ? 'bg-violet-500/10' : unread ? 'bg-white/[0.03]' : ''}`}
                          >
                            {selectMode && (
                              <span className={`w-5 h-5 rounded-md border shrink-0 flex items-center justify-center text-[11px] font-black ${selected ? 'bg-violet-500 border-violet-400 text-white' : 'border-white/20 text-transparent'}`}>✓</span>
                            )}
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-black shrink-0 shadow-md relative">
                              {(c.user_name || '?').replace('@', '')[0]?.toUpperCase()}
                              {c.needs_owner && c.status !== 'closed' && (
                                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-[#04060C] animate-pulse" />
                              )}
                              {c.status === 'closed' && (
                                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 border-2 border-[#04060C] flex items-center justify-center text-[8px]">✓</span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className={`text-xs truncate ${unread ? 'font-black text-white' : 'font-bold text-slate-200'}`}>{c.user_name || `User ${c.telegram_id}`}</p>
                                {c.last_message_at && (
                                  <span className={`text-[9px] shrink-0 ${unread ? 'text-violet-300 font-bold' : 'text-slate-500'}`}>
                                    {formatChatListTime(c.last_message_at)}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <p className={`text-[10.5px] truncate flex-1 ${unread ? 'text-slate-200' : 'text-slate-400'}`}>
                                  {c.last_sender_type === 'owner' && <span className="text-violet-300">Anda: </span>}
                                  {c.last_sender_type === 'ai' && <span className="text-cyan-300">AI: </span>}
                                  {c.last_message || 'Belum ada pesan'}
                                </p>
                                {unread && (
                                  <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-[9px] font-black flex items-center justify-center shadow-[0_0_8px_rgba(244,63,94,0.6)]">
                                    {c.unread_by_owner > 99 ? '99+' : c.unread_by_owner}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                      {convHasMore && (
                        <div className="p-3">
                          <button
                            onClick={() => fetchConversations({ append: true, cursor: convCursor })}
                            disabled={convLoadingMore}
                            className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold text-slate-300 active:scale-95 disabled:opacity-50 transition-all"
                          >
                            {convLoadingMore ? 'Memuat...' : 'Muat lebih banyak'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {selectMode && (
                  <div className="shrink-0 border-t border-white/10 bg-[#050811] p-3 space-y-2">
                    {bulkOpen ? (
                      <>
                        <textarea
                          value={bulkText}
                          onChange={(e) => setBulkText(e.target.value)}
                          placeholder={`Pesan untuk ${selectedIds.length} percakapan...`}
                          rows={3}
                          maxLength={2000}
                          className="w-full bg-[#050811] border border-white/10 text-white placeholder-slate-600 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-violet-500/50 resize-none"
                        />
                        <div className="flex gap-2">
                          <button onClick={() => setBulkOpen(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-black text-slate-300 active:scale-95">Kembali</button>
                          <button onClick={sendBulkReply} disabled={!bulkText.trim() || chatReplySending} className="flex-[1.5] py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-[11px] font-black active:scale-95 disabled:opacity-40">
                            {chatReplySending ? 'Mengirim...' : `Kirim ke ${selectedIds.length}`}
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-[10.5px] font-bold text-slate-300 mr-auto">{selectedIds.length} dipilih</span>
                        <button
                          onClick={() => setSelectedIds(filteredConversations.map((c) => c.id))}
                          className="px-2.5 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-slate-300 active:scale-95"
                        >Semua</button>
                        <button
                          onClick={() => bulkSetStatus('closed')}
                          disabled={selectedIds.length === 0}
                          className="px-2.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-black text-emerald-300 active:scale-95 disabled:opacity-40"
                        >Selesaikan</button>
                        <button
                          onClick={() => setBulkOpen(true)}
                          disabled={selectedIds.length === 0}
                          className="px-3 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-[10px] font-black text-white active:scale-95 disabled:opacity-40"
                        >Balas</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col h-full min-h-0">
                <div className="px-3 py-3 border-b border-white/10 flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => { setActiveConversationId(null); setActiveConversation(null); setQuickOpen(false); fetchConversations(); fetchChatStats(); }}
                    className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 active:scale-95 transition-all shrink-0"
                  >
                    ←
                  </button>
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                    {(activeConversation?.user_name || '?').replace('@', '')[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{activeConversation?.user_name || `User ${activeConversation?.telegram_id}`}</p>
                    <p className="text-[9.5px] text-slate-500 font-mono truncate">ID: {activeConversation?.telegram_id}</p>
                  </div>
                  {activeConversation?.status !== 'closed' && (
                    <button
                      onClick={() => setAiHandling(activeConversation?.handled_by === 'owner' ? 'handback' : 'takeover')}
                      className={`shrink-0 px-2.5 py-1.5 rounded-xl text-[9.5px] font-black uppercase tracking-wider border transition-all active:scale-95 ${
                        activeConversation?.handled_by === 'owner'
                          ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                          : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                      }`}
                    >
                      {activeConversation?.handled_by === 'owner' ? 'Serahkan ke AI' : 'Ambil Alih'}
                    </button>
                  )}
                  <button
                    onClick={toggleConversationStatus}
                    className={`shrink-0 px-2.5 py-1.5 rounded-xl text-[9.5px] font-black uppercase tracking-wider border transition-all active:scale-95 ${
                      activeConversation?.status === 'closed'
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                        : 'bg-white/5 border-white/10 text-slate-300'
                    }`}
                  >
                    {activeConversation?.status === 'closed' ? 'Buka Lagi' : 'Selesai ✓'}
                  </button>
                </div>

                {activeConversation?.needs_owner && activeConversation?.status !== 'closed' && (
                  <div className="shrink-0 px-3.5 py-2 bg-amber-500/15 border-b border-amber-500/25">
                    <p className="text-[10px] font-black text-amber-300 uppercase tracking-wider">Butuh Owner</p>
                    <p className="text-[10.5px] text-amber-100/90 leading-snug mt-0.5">{activeConversation?.ai_reason || 'AI meneruskan percakapan ini ke Anda.'}</p>
                  </div>
                )}
                {activeConversation?.status !== 'closed' && activeConversation?.handled_by !== 'owner' && !activeConversation?.needs_owner && (
                  <div className="shrink-0 px-3.5 py-1.5 bg-cyan-500/10 border-b border-cyan-500/20">
                    <p className="text-[10px] font-bold text-cyan-300">Asisten AI sedang menangani percakapan ini</p>
                  </div>
                )}

                <div
                  ref={chatScrollRef}
                  onScroll={handleChatScroll}
                  className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3.5 py-3.5 space-y-2 bg-[#04060C]"
                >
                  {msgHasMore && (
                    <div className="flex justify-center pb-1">
                      <button onClick={loadOlderMessages} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300 active:scale-95">
                        Muat pesan sebelumnya
                      </button>
                    </div>
                  )}
                  {chatMessagesLoading && chatMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-500">
                      <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                      <p className="text-xs font-medium">Memuat pesan...</p>
                    </div>
                  ) : chatMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center gap-2 text-center px-6">
                      <p className="text-xs text-slate-500">Belum ada pesan di percakapan ini.</p>
                    </div>
                  ) : (
                    chatMessages.map((m: any, i: number) => {
                      const isAi = m.sender_type === 'ai';
                      const isOwner = m.sender_type === 'owner' || isAi;
                      const prev = chatMessages[i - 1];
                      const newDay = !prev || new Date(prev.created_at).toDateString() !== new Date(m.created_at).toDateString();
                      return (
                        <React.Fragment key={m.id}>
                          {newDay && (
                            <div className="flex justify-center py-1">
                              <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-[9px] font-bold text-slate-500">
                                {new Date(m.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                          )}
                          <div className={`flex ${isOwner ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.25s_ease-out]`}>
                            <div className={`relative max-w-[80%] px-4 py-2.5 text-[12.5px] leading-relaxed ${
                              isAi
                                ? 'bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-600 text-white rounded-2xl rounded-br-md shadow-[0_4px_16px_-4px_rgba(6,182,212,0.5)] ring-1 ring-cyan-300/20'
                                : isOwner
                                ? 'bg-gradient-to-br from-violet-600 via-fuchsia-600 to-purple-600 text-white rounded-2xl rounded-br-md shadow-[0_4px_16px_-4px_rgba(168,85,247,0.5)] ring-1 ring-fuchsia-300/20'
                                : 'bg-gradient-to-br from-[#121828] to-[#0A0E18] text-slate-100 rounded-2xl rounded-bl-md shadow-[0_4px_14px_-6px_rgba(0,0,0,0.6)] ring-1 ring-white/[0.08]'
                            }`}>
                              {isAi && (
                                <p className="flex items-center gap-1 text-[8.5px] font-black uppercase tracking-widest text-cyan-50/90 mb-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-200 shadow-[0_0_6px_rgba(165,243,252,0.9)]" />
                                  Asisten AI
                                </p>
                              )}
                              <p className="whitespace-pre-wrap break-words">{m.message}</p>
                              <p className={`text-[9px] mt-1 font-medium text-right ${isAi ? 'text-cyan-50/75' : isOwner ? 'text-fuchsia-50/75' : 'text-slate-500'}`}>
                                {new Date(m.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })
                  )}
                </div>

                {quickOpen && (
                  <div className="shrink-0 border-t border-white/10 bg-[#050811] max-h-[42%] overflow-y-auto overscroll-contain p-2.5 space-y-1.5">
                    {quickReplies.map((q) => (
                      <div key={q} className="flex items-stretch gap-1.5">
                        <button
                          onClick={() => sendChatReply(q)}
                          disabled={chatReplySending}
                          className="flex-1 text-left px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-200 leading-snug active:scale-[0.98] disabled:opacity-50"
                        >
                          {q}
                        </button>
                        <button
                          onClick={() => { setChatReplyInput(q); setQuickOpen(false); setTimeout(() => replyRef.current?.focus(), 30); }}
                          className="w-9 rounded-xl bg-white/5 border border-white/10 text-[10px] text-slate-400 active:scale-95"
                        >✎</button>
                        <button
                          onClick={() => removeQuickReply(q)}
                          className="w-8 rounded-xl bg-rose-500/15 border border-rose-500/30 text-[10px] text-rose-300 active:scale-95"
                        >✕</button>
                      </div>
                    ))}
                    <div className="flex gap-1.5 pt-1">
                      <input
                        value={newQuick}
                        onChange={(e) => setNewQuick(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') addQuickReply(); }}
                        placeholder="Tambah template balasan..."
                        className="flex-1 bg-[#050811] border border-white/10 text-white placeholder-slate-600 px-3 py-2 rounded-xl text-[11px] focus:outline-none focus:border-violet-500/50"
                      />
                      <button onClick={addQuickReply} disabled={!newQuick.trim()} className="px-3 rounded-xl bg-white text-slate-950 text-[10px] font-black active:scale-95 disabled:opacity-40">Simpan</button>
                    </div>
                  </div>
                )}

                <div className="shrink-0 p-2.5 border-t border-white/10 flex items-end gap-2 bg-[#0B0F1A]">
                  <button
                    onClick={() => setQuickOpen((v) => !v)}
                    className={`w-10 h-10 shrink-0 rounded-2xl border flex items-center justify-center text-base active:scale-95 transition-all ${quickOpen ? 'bg-violet-500/20 border-violet-400/40' : 'bg-white/5 border-white/10'}`}
                  >
                    ⚡
                  </button>
                  <textarea
                    ref={replyRef}
                    value={chatReplyInput}
                    onChange={(e) => {
                      setChatReplyInput(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && window.matchMedia('(min-width: 768px)').matches) {
                        e.preventDefault();
                        sendChatReply();
                      }
                    }}
                    placeholder="Balas pesan..."
                    rows={1}
                    maxLength={2000}
                    disabled={chatReplySending}
                    className="flex-1 min-w-0 bg-[#050811] border border-white/10 text-white placeholder-slate-600 px-3.5 py-2.5 rounded-2xl text-xs focus:outline-none focus:border-violet-500/50 transition-all shadow-inner resize-none max-h-24 disabled:opacity-60"
                  />
                  <button
                    onClick={() => sendChatReply()}
                    disabled={chatReplySending || !chatReplyInput.trim()}
                    className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white flex items-center justify-center active:scale-95 disabled:opacity-40 transition-all shadow-lg shadow-violet-500/20"
                  >
                    <div className="w-4 h-4">{chatReplySending ? '···' : <IcoSend/>}</div>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-sm">
        <div className="glass bg-[#080D1A]/90 rounded-full p-2 border border-white/15 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.9)] gap-1">
          {[
            {id:'dashboard', label:'Dashboard', Icon:IcoDashboard, dot:false},
            {id:'orders', label:'Orders', Icon:IcoReceipt, dot:pending.length>0},
            {id:'users', label:'Users', Icon:IcoUsers, dot:false},
            {id:'chat', label:'Chat', Icon:IcoChat, dot:totalUnreadChats>0},
            {id:'security', label:'Audit', Icon:IcoShield, dot:false},
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative flex-1 py-2.5 rounded-full flex flex-col items-center justify-center gap-1 text-[9px] font-black transition-all active:scale-95 ${
                activeTab === tab.id ? 'bg-white text-slate-950 shadow-md shadow-white/20' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="w-4 h-4 relative">
                <tab.Icon/>
                {tab.dot && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-[#04060C] animate-pulse" />}
              </div>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {pinModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#04060C]/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease-out]" onClick={() => setPinModalOpen(false)}>
          <div className="max-w-xs w-full bg-[#0B0F1A] border border-emerald-500/30 p-6 rounded-[32px] space-y-4 text-center shadow-2xl animate-[scaleIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <div className="w-7 h-7"><IcoLock/></div>
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Verifikasi Security PIN</h3>
              <p className="text-xs text-slate-400 mt-1">Otorisasi tindakan sensitif owner</p>
            </div>

            <input 
              type="password" 
              maxLength={6} 
              placeholder="••••••" 
              value={pinInput} 
              onChange={e => setPinInput(e.target.value)} 
              className="w-full bg-[#050811] border border-white/10 text-center font-mono text-xl font-black tracking-[0.5em] text-white py-3.5 rounded-2xl focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner" 
            />

            <div className="grid grid-cols-[0.8fr_1.4fr] gap-2.5">
              <button onClick={() => setPinModalOpen(false)} className="py-3 bg-white/5 border border-white/10 text-slate-300 font-extrabold rounded-2xl text-xs uppercase tracking-wider active:scale-95 transition-all">
                Batal
              </button>
              <button onClick={confirmPinAndExecute} disabled={!pinInput.trim()} className="py-3 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl active:scale-95 disabled:opacity-40 shadow-lg shadow-emerald-500/25 transition-all">
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

      {previewImg && (
        <div className="fixed inset-0 z-50 bg-[#04060C]/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease-out]" onClick={() => setPreviewImg(null)}>
          <div className="max-w-sm w-full bg-[#0B0F1A] border border-white/15 p-4 rounded-[32px] space-y-3 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-black text-white">Pratinjau Bukti Transfer</span>
              <button onClick={() => setPreviewImg(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 transition-all">
                ✕
              </button>
            </div>
            <div className="bg-[#050811] rounded-2xl overflow-hidden border border-white/10 p-2">
              <img src={previewImg} alt="Bukti Transfer" className="w-full max-h-[70vh] object-contain rounded-xl" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}