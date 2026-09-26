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
    'Halo kak 👋 Terima kasih sudah menghubungi WALZSHOP.',
    'Baik kak, mohon ditunggu ya, sedang kami cek 🙏',
    'Pembayaran sudah kami terima ✅ Paket aktif sekarang.',
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
    } fontally {
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

  const sendChatReply = async (overrideText?: string) => {
    const text = (overrideText ?? chatReplyInput).trim();
    if (!text || chatReplySending || !activeConversationId) return;
    setChatReplySending(true);
    if (overrideText === undefined) {
      setChatReplyInput('');
    }
    try {
      const res = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: activeConversationId, text }),
      });
      const d = await res.json();
      if (res.status === 401) { handleSessionExpired(); throw new Error('Sesi admin habis. Silakan login.'); }
      if (!res.ok) throw new Error(d.error || 'Gagal balasan');
      chatUserNearBottomRef.current = true;
      if (d.message) {
        setChatMessages((prev) => (prev.some((m) => m.id === d.message.id) ? prev : [...prev, d.message]));
        setTimeout(() => scrollChatToBottom(true), 30);
      }
    } catch (err: any) {
      showChatToast(err?.message || 'Gagal kirim');
    } finally {
      setChatReplySending(false);
    }
  };

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
        alert(resData.error || 'PIN Salah');
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
    <div className="min-h-screen bg-[#04060C] flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-3 p-6 bg-[#0B0F1A] border border-emerald-500/30 rounded-3xl">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-bold">Verifikasi Otorisasi Owner...</p>
      </div>
    </div>
  );

  if (!auth) return (
    <div className="min-h-screen bg-[#04060C] text-white flex items-center justify-center p-4">
      <form onSubmit={login} className="w-full max-w-[340px]">
        <div className="glass-card border border-white/10 p-6 rounded-[32px] space-y-4 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-2xl mx-auto flex items-center justify-center text-slate-950 font-black text-xl">
              W
            </div>
            <h1 className="text-sm font-black text-white">WALZSHOP OWNER HQ</h1>
          </div>

          <div className="space-y-2.5">
            <input
              type="text"
              required
              placeholder="Telegram ID Owner"
              value={telegramId}
              onChange={e => setTelegramId(e.target.value)}
              className="w-full bg-[#050811] border border-white/10 text-white px-3.5 py-3 rounded-2xl text-xs font-medium focus:outline-none"
            />
            <input
              type="password"
              required
              placeholder="Password Access"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#050811] border border-white/10 text-white px-3.5 py-3 rounded-2xl text-xs font-medium focus:outline-none"
            />
          </div>

          <button type="submit" className="w-full py-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider">
            Login Portal
          </button>
        </div>
      </form>
    </div>
  );

  const pending = (data.orders || []).filter((o: any) => o.status === 'PENDING');
  const approved = (data.orders || []).filter((o: any) => o.status === 'APPROVED');
  const premium = (data.users || []).filter((u: any) => u.status === 'ACTIVE' && u.expiredAt && new Date(u.expiredAt).getTime() > Date.now());
  const freeUsers = (data.users || []).filter((u: any) => !(u.status === 'ACTIVE' && u.expiredAt && new Date(u.expiredAt).getTime() > Date.now()));
  const rev = approved.reduce((s: any, o: any) => s + (o.amount || 0), 0);

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
    <div className="min-h-screen bg-[#04060C] text-slate-100 font-sans pb-28">
      <header className="sticky top-0 z-30 glass bg-[#04060C]/85 border-b border-white/10 px-4 py-3.5 max-w-md mx-auto flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black text-sm">
            W
          </div>
          <div>
            <h1 className="text-xs font-black text-white">WALZSHOP HQ</h1>
            <p className="text-[9px] text-emerald-400 font-extrabold">Tactical Command Center</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={fetchCore} disabled={refreshing} className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
            <div className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-400' : ''}`}><IcoRefresh/></div>
          </button>
          <button onClick={() => directAction({ action: 'logout' })} className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-300">
            <div className="w-3.5 h-3.5"><IcoLogout/></div>
          </button>
        </div>
      </header>

      <main className="px-4 pt-3.5 max-w-md mx-auto space-y-3.5">
        {activeTab === 'dashboard' && (
          <div className="space-y-3.5">
            <div className="glass-card border border-emerald-500/30 p-4 rounded-[28px] space-y-2">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Omset Sukses</p>
              <p className="text-xl font-black text-white font-mono">Rp {rev.toLocaleString('id-ID')}</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="glass-card p-3.5 rounded-2xl border border-white/10">
                <p className="text-[9px] font-black text-slate-400 uppercase">Total Users</p>
                <p className="text-base font-black text-white font-mono mt-0.5">{(data.users || []).length}</p>
                <p className="text-[8px] text-slate-400 mt-1">{freeUsers.length} Free • {premium.length} VIP</p>
              </div>

              <div className="glass-card p-3.5 rounded-2xl border border-rose-500/30">
                <p className="text-[9px] font-black text-rose-400 uppercase">Pending Orders</p>
                <p className="text-base font-black text-white font-mono mt-0.5">{pending.length}</p>
                <button onClick={() => setActiveTab('orders')} className="text-[8px] text-amber-400 font-bold underline mt-1 block">Periksa Sekarang →</button>
              </div>
            </div>

            <div className="glass-card p-4 rounded-[28px] border border-rose-500/30 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-white uppercase">Flash Sale Control</span>
                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${isFlashActive ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-white/5 text-slate-400'}`}>
                  {isFlashActive ? 'LIVE' : 'OFFLINE'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Diskon %" value={flashPercentInput} onChange={e => setFlashPercentInput(e.target.value)} className="bg-[#050811] border border-white/10 text-white p-2.5 rounded-xl text-xs text-center font-bold" />
                <input type="number" placeholder="Durasi Jam" value={flashHoursInput} onChange={e => setFlashHoursInput(e.target.value)} className="bg-[#050811] border border-white/10 text-white p-2.5 rounded-xl text-xs text-center font-bold" />
              </div>

              <button
                onClick={() => requestProtectedAction({ action: 'toggle_flash_sale', flashActive: !isFlashActive, flashPercent: flashPercentInput, flashHours: flashHoursInput })}
                className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black text-xs uppercase rounded-xl"
              >
                {isFlashActive ? 'Matikan Flash Sale' : 'Aktifkan Flash Sale'}
              </button>
            </div>

            <div className="glass-card p-4 rounded-[28px] border border-white/10 space-y-2.5">
              <p className="text-xs font-black text-white uppercase">Broadcast Massal</p>
              <textarea rows={2} placeholder="Tulis pesan resmi..." value={broadcastText} onChange={e => setBroadcastText(e.target.value)} className="w-full bg-[#050811] border border-white/10 text-white p-2.5 rounded-xl text-xs focus:outline-none" />
              <button onClick={() => requestProtectedAction({ action: 'broadcast', broadcastMessage: broadcastText })} disabled={sendingBroadcast || !broadcastText.trim()} className="w-full py-2.5 bg-emerald-500 text-slate-950 font-black text-xs uppercase rounded-xl">
                {sendingBroadcast ? 'Mengirim...' : 'Kirim Broadcast (PIN)'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-3">
            {pending.length === 0 ? (
              <p className="text-xs text-center text-slate-500 py-8">Tidak ada pesanan pending</p>
            ) : pending.map((o: any) => (
              <div key={o.orderId} className="glass-card p-4 rounded-2xl border border-white/10 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-emerald-400 font-mono">#{o.orderId}</span>
                  <span className="text-white">Rp {o.amount?.toLocaleString('id-ID')}</span>
                </div>
                <p className="text-[10px] text-slate-400">User ID: {o.telegramId} • {o.durationDays} Hari VIP</p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button onClick={() => directAction({ action: 'order_action', orderId: o.orderId, decision: 'approve' })} className="py-2 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl">Approve</button>
                  <button onClick={() => directAction({ action: 'order_action', orderId: o.orderId, decision: 'reject' })} className="py-2 bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs rounded-xl">Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-3">
            <input type="text" placeholder="Cari ID/Name..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-[#050811] border border-white/10 text-white px-3.5 py-2.5 rounded-xl text-xs" />
            <div className="space-y-2">
              {filteredUsers.map((u: any) => (
                <div key={u.telegramId} className="glass-card p-3 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">{u.profile?.firstName || u.telegramId}</p>
                    <p className="text-[9px] text-slate-400 font-mono">ID: {u.telegramId}</p>
                  </div>
                  <button onClick={() => requestProtectedAction({ action: 'user_action', userAction: 'grant_premium', targetTelegramId: u.telegramId, durationDays: 30 })} className="px-3 py-1.5 bg-white text-slate-950 font-black text-[10px] rounded-xl">
                    +30D VIP
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-sm">
        <div className="glass bg-[#080D1A]/90 rounded-full p-1.5 border border-white/15 flex justify-around">
          <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 text-xs font-black rounded-full ${activeTab === 'dashboard' ? 'bg-white text-slate-950' : 'text-slate-400'}`}>Dashboard</button>
          <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 text-xs font-black rounded-full ${activeTab === 'orders' ? 'bg-white text-slate-950' : 'text-slate-400'}`}>Orders ({pending.length})</button>
          <button onClick={() => setActiveTab('users')} className={`px-4 py-2 text-xs font-black rounded-full ${activeTab === 'users' ? 'bg-white text-slate-950' : 'text-slate-400'}`}>Users</button>
        </div>
      </nav>

      {pinModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#04060C]/85 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="max-w-xs w-full bg-[#0B0F1A] border border-emerald-500/30 p-5 rounded-[28px] space-y-3 text-center">
            <h3 className="text-xs font-black text-white">PIN Keamanan Owner</h3>
            <input type="password" maxLength={6} placeholder="••••••" value={pinInput} onChange={e => setPinInput(e.target.value)} className="w-full bg-[#050811] border border-white/10 text-center font-mono text-lg font-black text-white py-2 rounded-xl" />
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setPinModalOpen(false)} className="py-2 bg-white/5 text-slate-300 font-bold text-xs rounded-xl">Batal</button>
              <button onClick={confirmPinAndExecute} className="py-2 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl">Konfirmasi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
