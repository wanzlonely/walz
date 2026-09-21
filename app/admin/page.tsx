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

  // --- Customer Support Chat state (Owner side) ---
  const [conversations, setConversations] = useState<any[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [conversationsError, setConversationsError] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatMessagesLoading, setChatMessagesLoading] = useState(false);
  const [chatReplyInput, setChatReplyInput] = useState('');
  const [chatReplySending, setChatReplySending] = useState(false);
  const [chatSearch, setChatSearch] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const chatUserNearBottomRef = useRef(true);

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

  // --- Customer Support Chat logic (Owner side) ---
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

  const fetchConversations = useCallback(async () => {
    setConversationsLoading(true);
    setConversationsError(null);
    try {
      const res = await fetch(`/api/admin/chat?t=${Date.now()}`, { cache: 'no-store' });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Gagal memuat daftar chat');
      setConversations(Array.isArray(d.conversations) ? d.conversations : []);
    } catch (err: any) {
      setConversationsError(err?.message || 'Gagal memuat daftar chat');
    } finally {
      setConversationsLoading(false);
    }
  }, []);

  const openConversation = async (conversationId: string) => {
    setActiveConversationId(conversationId);
    setChatMessagesLoading(true);
    try {
      const res = await fetch(`/api/admin/chat?conversationId=${conversationId}&t=${Date.now()}`, { cache: 'no-store' });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Gagal memuat pesan');
      setChatMessages(d.messages || []);
      setTimeout(() => scrollChatToBottom(false), 50);

      const conv = conversations.find((c) => c.id === conversationId);
      if (conv && conv.unread_by_owner > 0) {
        await fetch('/api/admin/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'mark_read', conversationId }),
        });
        setConversations((prev) => prev.map((c) => (c.id === conversationId ? { ...c, unread_by_owner: 0 } : c)));
      }
    } catch (err: any) {
      alert(err?.message || 'Gagal memuat pesan');
    } finally {
      setChatMessagesLoading(false);
    }
  };

  const sendChatReply = async () => {
    const text = chatReplyInput.trim();
    if (!text || chatReplySending || !activeConversationId) return;
    setChatReplySending(true);
    setChatReplyInput('');
    try {
      const res = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: activeConversationId, text }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Gagal mengirim balasan');
      chatUserNearBottomRef.current = true;
    } catch (err: any) {
      alert(err?.message || 'Gagal mengirim balasan');
      setChatReplyInput(text);
    } finally {
      setChatReplySending(false);
    }
  };

  const toggleConversationStatus = async () => {
    if (!activeConversationId) return;
    const current = conversations.find((c) => c.id === activeConversationId);
    const nextStatus = current?.status === 'closed' ? 'open' : 'closed';
    try {
      await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set_status', conversationId: activeConversationId, status: nextStatus }),
      });
      setConversations((prev) => prev.map((c) => (c.id === activeConversationId ? { ...c, status: nextStatus } : c)));
    } catch {}
  };

  // Load conversation list when chat tab opened
  useEffect(() => {
    if (activeTab === 'chat' && auth) fetchConversations();
  }, [activeTab, auth, fetchConversations]);

  // Realtime: listen for any new message / conversation update to refresh the sidebar list
  useEffect(() => {
    if (!auth) return;

    const channel = supabase
      .channel('owner-chat-conversations')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'chat_conversations' },
        (payload: any) => {
          setConversations((prev) => {
            const exists = prev.some((c) => c.id === payload.new.id);
            const updated = exists
              ? prev.map((c) => (c.id === payload.new.id ? { ...c, ...payload.new } : c))
              : [payload.new, ...prev];
            return [...updated].sort((a, b) => {
              const ta = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
              const tb = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
              return tb - ta;
            });
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_conversations' },
        (payload: any) => {
          setConversations((prev) => (prev.some((c) => c.id === payload.new.id) ? prev : [payload.new, ...prev]));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auth]);

  // Realtime: messages for the currently open conversation
  useEffect(() => {
    if (!activeConversationId) return;

    const channel = supabase
      .channel(`owner-chat-messages-${activeConversationId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `conversation_id=eq.${activeConversationId}` },
        (payload: any) => {
          const newMsg = payload.new;
          setChatMessages((prev) => (prev.some((m) => m.id === newMsg.id) ? prev : [...prev, newMsg]));

          if (newMsg.sender_type === 'user') {
            if (chatUserNearBottomRef.current) {
              setTimeout(() => scrollChatToBottom(true), 30);
            }
            fetch('/api/admin/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'mark_read', conversationId: activeConversationId }),
            }).catch(() => {});
            setConversations((prev) => prev.map((c) => (c.id === activeConversationId ? { ...c, unread_by_owner: 0 } : c)));
          } else if (chatUserNearBottomRef.current) {
            setTimeout(() => scrollChatToBottom(true), 30);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConversationId]);

  const totalUnreadChats = conversations.reduce((sum, c) => sum + (c.unread_by_owner || 0), 0);
  const activeConversation = conversations.find((c) => c.id === activeConversationId) || null;
  const filteredConversations = conversations.filter((c) => {
    if (!chatSearch.trim()) return true;
    const q = chatSearch.toLowerCase();
    return (c.user_name || '').toLowerCase().includes(q) || (c.telegram_id || '').toString().includes(q);
  });

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
    <div className="min-h-screen bg-[#060810] flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4 p-8 bg-[#0D121F]/80 border border-emerald-500/20 rounded-3xl backdrop-blur-2xl shadow-[0_0_50px_rgba(16,185,129,0.1)]">
        <div className="relative flex items-center justify-center w-14 h-14">
          <div className="absolute inset-0 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-emerald-500/30">
            W
          </div>
        </div>
        <div className="text-center">
          <p className="text-[11px] font-black tracking-[0.25em] text-emerald-400 uppercase">WALZSHOP COMMAND</p>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">Verifikasi Otorisasi Owner...</p>
        </div>
      </div>
    </div>
  );

  if (!auth) return (
    <div className="min-h-screen bg-[#060810] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <form onSubmit={login} className="w-full max-w-[360px] relative z-10">
        <div className="bg-[#0E131F]/80 backdrop-blur-3xl border border-white/10 p-8 rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(255,255,255,0.1)] space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 rounded-2xl mx-auto flex items-center justify-center text-white font-black text-2xl shadow-[0_10px_30px_-8px_rgba(16,185,129,0.5)] ring-1 ring-white/20">
              W
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">WALZSHOP</h1>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Tactical Owner Command Center</p>
              <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-[9px] font-extrabold tracking-widest text-emerald-300 uppercase">Secure Portal</span>
              </div>
            </div>
          </div>

          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-1">Telegram ID</label>
              <input
                type="text"
                required
                placeholder="Masukkan ID Telegram"
                value={telegramId}
                onChange={e => setTelegramId(e.target.value)}
                className="w-full bg-[#070A12] border border-white/10 text-white placeholder-slate-600 px-4 py-3.5 rounded-2xl text-[13px] font-medium focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-1">Password Owner</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#070A12] border border-white/10 text-white placeholder-slate-600 px-4 py-3.5 rounded-2xl text-[13px] font-medium focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner"
              />
            </div>
          </div>

          <button type="submit" className="w-full py-4 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-500 text-slate-950 font-black rounded-2xl text-[13px] tracking-wider uppercase active:scale-[0.98] shadow-[0_10px_25px_-5px_rgba(16,185,129,0.5)] hover:brightness-110 transition-all">
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
    <div className="min-h-screen bg-[#060810] text-slate-100 font-sans relative overflow-x-hidden pb-[110px] selection:bg-emerald-500/30 selection:text-emerald-200">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass { backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Ambient Ambient Dynamic Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 -right-20 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 glass bg-[#060810]/80 border-b border-white/10 px-4 py-3.5 max-w-[430px] mx-auto flex items-center justify-between shadow-lg shadow-black/40">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 flex items-center justify-center text-white font-black text-base shadow-[0_4px_16px_-2px_rgba(16,185,129,0.6)] ring-1 ring-white/20">
              W
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#060810] shadow-[0_0_8px_rgba(52,211,153,1)]" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
              WALZSHOP <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">HQ</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[10px] text-emerald-400 font-bold tracking-wider">OWNER COMMAND CENTER</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCore}
            disabled={refreshing}
            title="Refresh Data"
            className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-white/10 hover:border-white/20 active:scale-90 transition-all shadow-sm"
          >
            <div className={`w-4 h-4 ${refreshing ? 'animate-spin text-emerald-400' : ''}`}><IcoRefresh/></div>
          </button>
          <button
            onClick={() => directAction({ action: 'logout' })}
            title="Logout"
            className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 hover:bg-rose-500/20 active:scale-90 transition-all shadow-sm"
          >
            <div className="w-4 h-4"><IcoLogout/></div>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="px-4 pt-4 max-w-[430px] mx-auto space-y-4 relative z-10">

        {activeTab === 'dashboard' && (
          <div className="space-y-4 animate-[fadeIn_0.25s_ease-out]">

            {/* Metrics Dashboard Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Omset Card */}
              <div className="col-span-2 group relative overflow-hidden bg-gradient-to-br from-[#0E1424] via-[#0C101B] to-[#080B12] border border-emerald-500/20 p-4 rounded-3xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Omset Sukses</p>
                    <p className="text-2xl font-black text-white mt-1.5 tracking-tight font-mono">
                      Rp {rev.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <span className="p-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                    ↗ {approved.length} Trx
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 pt-2 border-t border-white/5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-slate-400 font-medium">Laporan transaksi terverifikasi sistem</span>
                </div>
              </div>

              {/* Total User */}
              <div className="bg-[#0D121F] border border-white/10 p-4 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total User</p>
                  <p className="text-xl font-black text-white mt-1 font-mono">{(data.users || []).length}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                  <span className="text-slate-400">{freeUsers.length} Free</span>
                  <span className="text-amber-400">{premium.length} VIP</span>
                </div>
              </div>

              {/* VIP Member */}
              <div className="bg-[#0D121F] border border-amber-500/20 p-4 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-between">
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
                <div>
                  <p className="text-[10px] font-black text-amber-400/90 uppercase tracking-widest">VIP Member</p>
                  <p className="text-xl font-black text-amber-300 mt-1 font-mono">{premium.length}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[9px] font-extrabold text-amber-300/80 uppercase tracking-wider">Aktif Berlangganan</span>
                </div>
              </div>

              {/* Pending Transactions */}
              <div className={`col-span-2 border p-4 rounded-3xl shadow-lg transition-all flex items-center justify-between ${
                pending.length > 0 ? 'bg-rose-950/20 border-rose-500/40 shadow-rose-950/20' : 'bg-[#0D121F] border-white/10'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                    pending.length > 0 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-white/5 text-slate-400 border border-white/10'
                  }`}>
                    <div className="w-5 h-5"><IcoReceipt/></div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pesanan Pending</p>
                    <p className="text-lg font-black text-white font-mono">{pending.length} <span className="text-xs text-slate-400 font-sans font-normal">Transaksi</span></p>
                  </div>
                </div>
                {pending.length > 0 ? (
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="px-3.5 py-2 bg-rose-500 text-white font-black text-[11px] rounded-2xl shadow-lg shadow-rose-500/30 animate-pulse active:scale-95 transition-all"
                  >
                    Periksa Sekarang
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-500 font-medium px-3 py-1 bg-white/5 rounded-full border border-white/5">
                    Clear ✓
                  </span>
                )}
              </div>
            </div>

            {/* Flash Sale Banner Control */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#1C1218] via-[#140E16] to-[#0A070D] border border-rose-500/25 p-5 rounded-3xl shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/30">
                      <div className="w-5 h-5"><IcoZap/></div>
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-white">Flash Sale Event</h2>
                      <p className="text-[10px] text-slate-400 font-medium">Diskon khusus dalam batas waktu tertentu</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border ${
                    isFlashActive ? 'bg-rose-500 text-white border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'bg-white/5 text-slate-400 border-white/10'
                  }`}>
                    {isFlashActive ? '● LIVE' : 'OFFLINE'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase ml-1">Diskon (%)</label>
                    <input
                      type="number"
                      value={flashPercentInput}
                      onChange={e => setFlashPercentInput(e.target.value)}
                      className="w-full bg-[#070A12] border border-white/10 text-white px-3.5 py-3 rounded-2xl text-xs font-bold text-center focus:outline-none focus:border-rose-500/50 transition-all shadow-inner"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase ml-1">Durasi (Jam)</label>
                    <input
                      type="number"
                      value={flashHoursInput}
                      onChange={e => setFlashHoursInput(e.target.value)}
                      className="w-full bg-[#070A12] border border-white/10 text-white px-3.5 py-3 rounded-2xl text-xs font-bold text-center focus:outline-none focus:border-rose-500/50 transition-all shadow-inner"
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
                      : 'bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white shadow-rose-500/30 hover:brightness-110'
                  }`}
                >
                  {isFlashActive ? 'Matikan Flash Sale' : '⚡ Aktifkan Flash Sale Now'}
                </button>
              </div>
            </div>

            {/* Top Referrer Board */}
            {topReferrers.length > 0 && (
              <div className="bg-[#0D121F] border border-white/10 p-5 rounded-3xl shadow-xl space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                    <div className="w-4 h-4"><IcoUsers/></div>
                  </div>
                  <div>
                    <h2 className="text-xs font-black text-white">Top Referrer Top Leaderboard</h2>
                    <p className="text-[10px] text-slate-400">Pengguna dengan Referral Terbanyak</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {topReferrers.map((u: any, idx: number) => (
                    <div key={u.telegramId} className="flex items-center gap-3 p-3 bg-[#070A12] border border-white/5 rounded-2xl">
                      <span className={`text-xs font-black w-5 text-center ${idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-slate-600'}`}>
                        #{idx + 1}
                      </span>
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-md">
                        {(u.telegramId || '?').toString()[0]}
                      </div>
                      <p className="text-[11px] font-bold text-slate-200 font-mono truncate flex-1">{u.telegramId}</p>
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                        {u.referralCount} Undangan
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Broadcast Massal */}
            <div className="bg-[#0D121F] border border-white/10 p-5 rounded-3xl shadow-xl space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
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
                className="w-full bg-[#070A12] border border-white/10 text-white placeholder-slate-600 p-3.5 rounded-2xl text-xs font-medium focus:outline-none focus:border-emerald-500/50 resize-none leading-relaxed transition-all shadow-inner"
              />

              <button
                onClick={() => requestProtectedAction({ action: 'broadcast', broadcastMessage: broadcastText })}
                disabled={sendingBroadcast || !broadcastText.trim()}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl active:scale-[0.98] disabled:opacity-40 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <div className="w-4 h-4"><IcoBroadcast/></div>
                {sendingBroadcast ? 'Mengirim...' : 'Kirim Broadcast (Konfirmasi PIN)'}
              </button>

              {broadcastResult && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[11px] font-semibold text-emerald-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {broadcastResult}
                </div>
              )}
            </div>

            {/* Promo Voucher Codes */}
            <div className="bg-[#0D121F] border border-white/10 p-5 rounded-3xl shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
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
                  <input type="text" placeholder="Contoh: VIP2026" value={newCodeName} onChange={e => setNewCodeName(e.target.value)} className="w-full bg-[#070A12] border border-white/10 text-white px-3.5 py-3 rounded-2xl text-xs font-mono font-black uppercase tracking-wider focus:outline-none focus:border-amber-500/50 transition-all shadow-inner" />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase ml-1">Durasi (Hari)</label>
                    <input type="number" placeholder="7" value={newCodeDays} onChange={e => setNewCodeDays(e.target.value)} className="w-full bg-[#070A12] border border-white/10 text-white px-3 py-3 rounded-2xl text-xs font-bold text-center focus:outline-none focus:border-amber-500/50 transition-all shadow-inner" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase ml-1">Total Kuota</label>
                    <input type="number" placeholder="10" value={newCodeUses} onChange={e => setNewCodeUses(e.target.value)} className="w-full bg-[#070A12] border border-white/10 text-white px-3 py-3 rounded-2xl text-xs font-bold text-center focus:outline-none focus:border-amber-500/50 transition-all shadow-inner" />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase ml-1">Limit Harian (Opsional)</label>
                  <input type="number" placeholder="Kosongkan jika tanpa batas harian" value={newCodeDailyLimit} onChange={e => setNewCodeDailyLimit(e.target.value)} className="w-full mt-1 bg-[#070A12] border border-white/10 text-white px-3.5 py-3 rounded-2xl text-xs font-semibold focus:outline-none focus:border-amber-500/50 transition-all shadow-inner" />
                  <p className="text-[9.5px] text-slate-500 mt-1.5 ml-1 leading-relaxed">
                    💡 <span className="text-slate-400 font-medium">Batas klaim per hari direset otomatis setiap jam 00:00 (1 user max 1x/hari).</span>
                  </p>
                </div>

                <button onClick={() => requestProtectedAction({ action: 'create_redeem_code', code: newCodeName, days: newCodeDays, usesLeft: newCodeUses, dailyLimit: newCodeDailyLimit })} disabled={!newCodeName.trim()} className="w-full py-3.5 bg-white text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl active:scale-[0.98] disabled:opacity-40 hover:bg-slate-200 transition-all shadow-lg shadow-white/10">
                  + Buat Voucher Baru
                </button>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daftar Voucher Aktif ({(data.redeemCodes || []).length})</p>
                {(data.redeemCodes || []).length === 0 ? (
                  <div className="py-6 text-center border border-dashed border-white/10 rounded-2xl">
                    <p className="text-[11px] text-slate-500 font-medium">Belum ada kode voucher aktif</p>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {(data.redeemCodes || []).map((c: any) => (
                      <div key={c.code} className="bg-[#070A12] border border-white/10 p-3.5 rounded-2xl flex justify-between items-center group hover:border-amber-500/30 transition-colors">
                        <div className="space-y-0.5">
                          <p className="font-mono font-black text-amber-300 text-xs tracking-wider">{c.code}</p>
                          <p className="text-[10px] text-slate-400">+{c.days} Hari VIP • {c.usesLeft} sisa kuota</p>
                          {c.dailyLimit ? (
                            <div className="mt-1 flex items-center gap-2">
                              <div className="w-20 h-1 rounded-full bg-white/10 overflow-hidden">
                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.min(((c.usedToday || 0) / c.dailyLimit) * 100, 100)}%` }} />
                              </div>
                              <span className="text-[9px] font-extrabold text-amber-400/90">{c.usedToday || 0}/{c.dailyLimit} hari ini</span>
                            </div>
                          ) : null}
                        </div>
                        <button onClick={() => requestProtectedAction({ action: 'delete_redeem_code', code: c.code })} className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 flex items-center justify-center transition-all active:scale-90">
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
          <div className="space-y-4 animate-[fadeIn_0.25s_ease-out]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-white">Antrean Transaksi</h2>
                <p className="text-[10px] text-slate-400">Verifikasi pembayaran yang masuk</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[10px] font-black text-rose-300">
                {pending.length} Perlu Tindakan
              </span>
            </div>

            {pending.length === 0 ? (
              <div className="bg-[#0D121F] border border-white/10 p-10 text-center rounded-3xl space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl font-black">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-black text-white">Semua Transaksi Selesai</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Tidak ada pesanan pending saat ini</p>
                </div>
              </div>
            ) : pending.map((o: any) => (
              <div key={o.orderId} className="bg-[#0D121F] border border-white/10 p-4.5 rounded-3xl space-y-3.5 shadow-xl hover:border-emerald-500/30 transition-all">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-black text-emerald-300 text-[11px] tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    #{o.orderId}
                  </span>
                  <span className="text-slate-400 text-[10px] font-medium bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                    {new Date(o.createdAt).toLocaleTimeString('id-ID')}
                  </span>
                </div>

                <div className="bg-[#070A12] p-4 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-black text-white text-sm">{o.displayName || o.username}</p>
                      <p className="text-slate-400 text-[11px] font-mono mt-0.5">ID: {o.telegramId}</p>
                    </div>
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-white/10 text-slate-200 border border-white/10">
                      {o.durationDays} Hari VIP
                    </span>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Total Pembayaran:</span>
                    <span className="text-emerald-400 font-black text-base font-mono">
                      Rp {o.amount?.toLocaleString('id-ID')}
                    </span>
                  </div>

                  {o.proofNote && (
                    <p className="text-slate-300 italic text-[11px] bg-white/5 p-2.5 rounded-xl border border-white/5 leading-relaxed">
                      &quot;{o.proofNote}&quot;
                    </p>
                  )}
                </div>

                {o.proofImage && (
                  <div className="relative group w-full h-40 bg-[#070A12] rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-emerald-500/50 transition-all" onClick={() => setPreviewImg(o.proofImage)}>
                    <img src={o.proofImage} alt="Bukti Transfer" className="w-full h-full object-contain p-2" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-[10px] font-black uppercase tracking-wider text-white bg-black/60 px-3 py-1.5 rounded-full border border-white/20">
                        Klik untuk Memperbesar
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button onClick={() => directAction({ action: 'order_action', orderId: o.orderId, decision: 'approve' })} className="py-3.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl active:scale-[0.98] shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all">
                    Approve
                  </button>
                  <button onClick={() => directAction({ action: 'order_action', orderId: o.orderId, decision: 'reject' })} className="py-3.5 bg-white/5 border border-white/10 text-slate-300 font-extrabold text-xs uppercase tracking-wider rounded-2xl active:scale-[0.98] hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 transition-all">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4 animate-[fadeIn_0.25s_ease-out]">

            {/* Filter Pills */}
            <div className="bg-[#0D121F] border border-white/10 p-1 rounded-2xl flex gap-1">
              {[
                {k:'ALL', label:`Semua`, count:(data.users || []).length},
                {k:'FREE', label:`Free`, count:freeUsers.length},
                {k:'PREMIUM', label:`VIP`, count:premium.length},
              ].map(tab => (
                <button
                  key={tab.k}
                  onClick={() => setUserFilter(tab.k as any)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                    userFilter === tab.k ? 'bg-white text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label} <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${userFilter===tab.k?'bg-slate-950/10 font-mono':'bg-white/10'}`}>{tab.count}</span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500">
                <IcoSearch/>
              </div>
              <input
                type="text"
                placeholder="Cari Telegram ID, username, nama..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#0D121F] border border-white/10 text-white pl-11 pr-4 py-3.5 rounded-2xl text-xs font-medium placeholder-slate-500 focus:outline-none focus:border-white/20 transition-all shadow-inner"
              />
            </div>

            {/* User Items */}
            <div className="space-y-2.5">
              {filteredUsers.map((u: any) => {
                const isBannedUser = u.status === 'BANNED';
                const isPrem = u.status === 'ACTIVE' && u.expiredAt && new Date(u.expiredAt).getTime() > Date.now();
                const currentVal = grantDays[u.telegramId] ?? '30';
                const daysNumber = parseInt(currentVal) || 30;
                const risk = u.riskScore || 0;

                return (
                  <div key={u.telegramId} className="bg-[#0D121F] border border-white/10 p-4 rounded-3xl space-y-3 shadow-lg hover:border-white/20 transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black shrink-0 shadow-md ${
                          isBannedUser ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 
                          isPrem ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950' : 
                          'bg-white/10 text-slate-300 border border-white/10'
                        }`}>
                          {(u.profile?.firstName?.[0] || u.telegramId?.[0] || 'U').toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-xs truncate max-w-[130px]">{u.profile?.firstName || u.telegramId}</span>
                            {risk > 15 && <span className="px-2 py-0.5 bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[8px] font-black rounded-full">RISK {risk}</span>}
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {u.telegramId} • {u.points || 0} Pts</p>
                        </div>
                      </div>
                      <span className={`shrink-0 text-[8px] font-black px-2.5 py-1 rounded-full tracking-wider uppercase border ${
                        isBannedUser ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 
                        isPrem ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 
                        'bg-white/5 text-slate-400 border-white/10'
                      }`}>
                        {isBannedUser ? 'BANNED' : isPrem ? 'VIP' : 'FREE'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex items-center gap-1 bg-[#070A12] border border-white/10 rounded-xl px-2.5 py-2">
                        <input type="text" value={currentVal} onChange={e => setGrantDays(prev => ({ ...prev, [u.telegramId]: e.target.value }))} className="w-8 bg-transparent text-center font-bold text-xs text-white focus:outline-none" />
                        <span className="text-[9px] text-slate-500 font-extrabold">HARI</span>
                      </div>
                      <button onClick={() => requestProtectedAction({ action: 'user_action', userAction: 'grant_premium', targetTelegramId: u.telegramId, durationDays: daysNumber })} className="flex-1 py-2.5 bg-white text-slate-950 font-black text-xs rounded-xl active:scale-95 hover:bg-slate-200 transition-all shadow-md">
                        +{daysNumber}D VIP
                      </button>
                      {isPrem && (
                        <button onClick={() => requestProtectedAction({ action: 'user_action', userAction: 'revoke_premium', targetTelegramId: u.telegramId })} className="px-3 py-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold text-[10px] rounded-xl active:scale-95 hover:bg-amber-500/20 transition-all">
                          Cabut
                        </button>
                      )}
                      <button onClick={() => requestProtectedAction({ action: 'user_action', userAction: isBannedUser ? 'unban' : 'ban', targetTelegramId: u.telegramId })} className={`px-3 py-2.5 font-bold text-[10px] rounded-xl active:scale-95 border transition-all ${
                        isBannedUser ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20 text-rose-300 hover:bg-rose-500/20'
                      }`}>
                        {isBannedUser ? 'Unban' : 'Ban'}
                      </button>
                    </div>
                  </div>
                );
              })}
              {filteredUsers.length === 0 && (
                <div className="py-12 text-center bg-[#0D121F] border border-white/10 rounded-3xl">
                  <p className="text-xs text-slate-500 font-medium">Tidak ada pengguna ditemukan</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4 animate-[fadeIn_0.25s_ease-out]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-200">Audit Security Logs</h2>
                <p className="text-[10px] text-slate-400">Riwayat aksi sensitif sistem</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                {(data.auditLogs || []).length} Log Activity
              </span>
            </div>

            <div className="relative">
              <div className="absolute left-[13px] top-3 bottom-3 w-[2px] bg-white/10" />
              <div className="space-y-3">
                {(data.auditLogs || []).length === 0 ? (
                  <div className="bg-[#0D121F] border border-white/10 p-8 text-center rounded-3xl">
                    <p className="text-xs text-slate-500 italic">Belum ada catatan aktivitas keamanan</p>
                  </div>
                ) : (
                  (data.auditLogs || []).map((l: any) => (
                    <div key={l.id} className="relative pl-8">
                      <div className="absolute left-0 top-3.5 w-7 h-7 rounded-full bg-[#0D121F] border border-white/20 flex items-center justify-center shadow-md">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      </div>
                      <div className="bg-[#0D121F] border border-white/10 p-3.5 rounded-2xl space-y-1.5 shadow-md hover:border-white/20 transition-all">
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-bold text-emerald-300 text-[10px] tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            {l.action}
                          </span>
                          <span className="text-slate-500 text-[10px] font-medium">{new Date(l.timestamp).toLocaleTimeString('id-ID')}</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-200 leading-relaxed">{l.detail}</p>
                        <p className="text-[9.5px] text-slate-500 font-mono">Telegram ID: {l.telegramId}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: CUSTOMER SUPPORT CHAT */}
        {activeTab === 'chat' && (
          <div className="animate-[fadeIn_0.25s_ease-out] h-[calc(100dvh-190px)] min-h-[420px] flex flex-col bg-[#0D121F] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
            {!activeConversationId ? (
              // --- Conversation List ---
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-white/10 space-y-3 shrink-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-widest text-slate-200">Customer Support</h2>
                      <p className="text-[10px] text-slate-400">{conversations.length} percakapan{totalUnreadChats > 0 ? ` · ${totalUnreadChats} belum dibaca` : ''}</p>
                    </div>
                    <button
                      onClick={fetchConversations}
                      className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 active:scale-95 transition-all"
                    >
                      <div className={`w-3.5 h-3.5 ${conversationsLoading ? 'animate-spin' : ''}`}><IcoRefresh/></div>
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500"><IcoSearch/></div>
                    <input
                      type="text"
                      placeholder="Cari nama atau Telegram ID..."
                      value={chatSearch}
                      onChange={(e) => setChatSearch(e.target.value)}
                      className="w-full bg-[#070A12] border border-white/10 text-white placeholder-slate-600 pl-9 pr-3 py-2 rounded-xl text-[11px] focus:outline-none focus:border-violet-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {conversationsLoading && conversations.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-500">
                      <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                      <p className="text-xs font-medium">Memuat percakapan...</p>
                    </div>
                  ) : conversationsError ? (
                    <div className="h-full flex flex-col items-center justify-center gap-3 text-center px-6">
                      <p className="text-xs text-rose-300 font-semibold">{conversationsError}</p>
                      <button onClick={fetchConversations} className="px-4 py-2 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-bold rounded-xl active:scale-95 transition-all">
                        Coba Lagi
                      </button>
                    </div>
                  ) : filteredConversations.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center gap-2 text-center px-6">
                      <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-violet-400 flex items-center justify-center">
                        <div className="w-6 h-6"><IcoChat/></div>
                      </div>
                      <p className="text-xs text-slate-300 font-bold">Belum ada percakapan</p>
                      <p className="text-[10px] text-slate-500">Percakapan user akan muncul di sini secara realtime.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {filteredConversations.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => openConversation(c.id)}
                          className="w-full p-3.5 flex items-center gap-3 hover:bg-white/5 active:bg-white/10 transition-all text-left"
                        >
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-black shrink-0 shadow-md relative">
                            {(c.user_name || '?')[0]?.toUpperCase()}
                            {c.status === 'closed' && (
                              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-700 border-2 border-[#0D121F] flex items-center justify-center text-[7px]">✓</span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-bold text-slate-100 truncate">{c.user_name || `User ${c.telegram_id}`}</p>
                              {c.last_message_at && (
                                <span className="text-[9px] text-slate-500 shrink-0">
                                  {new Date(c.last_message_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              )}
                            </div>
                            <p className="text-[10.5px] text-slate-400 truncate mt-0.5">{c.last_message || 'Belum ada pesan'}</p>
                          </div>
                          {c.unread_by_owner > 0 && (
                            <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-[9px] font-black flex items-center justify-center shadow-[0_0_8px_rgba(244,63,94,0.6)]">
                              {c.unread_by_owner > 9 ? '9+' : c.unread_by_owner}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // --- Active Conversation ---
              <div className="flex flex-col h-full">
                <div className="p-3.5 border-b border-white/10 flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setActiveConversationId(null)}
                    className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 active:scale-95 transition-all shrink-0"
                  >
                    ←
                  </button>
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                    {(activeConversation?.user_name || '?')[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{activeConversation?.user_name || `User ${activeConversation?.telegram_id}`}</p>
                    <p className="text-[9.5px] text-slate-500 font-mono">ID: {activeConversation?.telegram_id}</p>
                  </div>
                  <button
                    onClick={toggleConversationStatus}
                    className={`shrink-0 px-2.5 py-1.5 rounded-xl text-[9.5px] font-black uppercase tracking-wider border transition-all active:scale-95 ${
                      activeConversation?.status === 'closed'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-white/5 border-white/10 text-slate-300'
                    }`}
                  >
                    {activeConversation?.status === 'closed' ? 'Buka Lagi' : 'Tutup Chat'}
                  </button>
                </div>

                <div
                  ref={chatScrollRef}
                  onScroll={handleChatScroll}
                  className="flex-1 overflow-y-auto px-3.5 py-3.5 space-y-2.5"
                >
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
                    chatMessages.map((m: any) => {
                      const isOwner = m.sender_type === 'owner';
                      return (
                        <div key={m.id} className={`flex ${isOwner ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                            isOwner
                              ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-br-md'
                              : 'bg-[#070A12] border border-white/10 text-slate-200 rounded-bl-md'
                          }`}>
                            <p className="whitespace-pre-wrap break-words">{m.message}</p>
                            <p className={`text-[9px] mt-1 font-medium ${isOwner ? 'text-violet-200/80' : 'text-slate-500'}`}>
                              {new Date(m.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="shrink-0 p-3 border-t border-white/10 flex items-end gap-2">
                  <textarea
                    value={chatReplyInput}
                    onChange={(e) => setChatReplyInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendChatReply();
                      }
                    }}
                    placeholder="Balas pesan..."
                    rows={1}
                    maxLength={2000}
                    disabled={chatReplySending}
                    className="flex-1 bg-[#070A12] border border-white/10 text-white placeholder-slate-600 px-3.5 py-2.5 rounded-2xl text-xs focus:outline-none focus:border-violet-500/50 transition-all shadow-inner resize-none max-h-24 disabled:opacity-60"
                  />
                  <button
                    onClick={sendChatReply}
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

      {/* Floating Modern Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 pb-[max(14px,env(safe-area-inset-bottom))] pt-2">
        <div className="max-w-[430px] mx-auto px-4">
          <div className="glass bg-[#0D121F]/90 backdrop-blur-3xl border border-white/10 rounded-3xl p-1.5 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            {[
              {id:'dashboard', label:'Dashboard', Icon:IcoDashboard, dot:false},
              {id:'orders', label:'Orders', Icon:IcoReceipt, dot:pending.length>0},
              {id:'users', label:'Users', Icon:IcoUsers, dot:false},
              {id:'chat', label:'Chat', Icon:IcoChat, dot:totalUnreadChats>0},
              {id:'security', label:'Audit Log', Icon:IcoShield, dot:false},
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative flex-1 py-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 text-[10px] font-black transition-all active:scale-95 ${
                  activeTab === tab.id ? 'bg-white text-slate-950 shadow-lg shadow-white/10' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-4 h-4 relative">
                  <tab.Icon/>
                  {tab.dot && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-[#0D121F] animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]" />}
                </div>
                <span className="tracking-wide">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* PIN Verification Modal */}
      {pinModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#060810]/85 backdrop-blur-xl flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease-out]">
          <div className="max-w-[340px] w-full bg-[#0D121F] border border-white/15 p-6 rounded-[32px] space-y-5 shadow-[0_25px_70px_rgba(0,0,0,0.9)] animate-[scaleIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <div className="w-7 h-7"><IcoLock/></div>
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Verifikasi Security PIN</h3>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">Otorisasi tindakan sensitif owner</p>
              </div>
            </div>

            <input 
              type="password" 
              maxLength={6} 
              placeholder="••••••" 
              value={pinInput} 
              onChange={e => setPinInput(e.target.value)} 
              className="w-full bg-[#070A12] border border-white/10 text-center font-mono text-xl font-black tracking-[0.5em] text-white py-4 rounded-2xl focus:outline-none focus:border-emerald-500/50 transition-all placeholder:tracking-[0.5em] shadow-inner" 
            />

            <div className="grid grid-cols-[0.8fr_1.4fr] gap-2.5">
              <button onClick={() => setPinModalOpen(false)} className="py-3.5 bg-white/5 border border-white/10 text-slate-300 font-extrabold rounded-2xl text-xs uppercase tracking-wider active:scale-[0.97] hover:bg-white/10 transition-all">
                Batal
              </button>
              <button onClick={confirmPinAndExecute} disabled={!pinInput.trim()} className="py-3.5 bg-white text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl active:scale-[0.97] disabled:opacity-40 shadow-lg shadow-white/10 hover:bg-slate-200 transition-all">
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImg && (
        <div className="fixed inset-0 z-50 bg-[#060810]/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease-out]" onClick={() => setPreviewImg(null)}>
          <div className="max-w-[380px] w-full bg-[#0D121F] border border-white/15 p-4 rounded-3xl space-y-3 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-black text-white">Pratinjau Bukti Transfer</span>
              <button onClick={() => setPreviewImg(null)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-all">
                ✕
              </button>
            </div>
            <div className="bg-[#070A12] rounded-2xl overflow-hidden border border-white/10 p-2">
              <img src={previewImg} alt="Bukti Transfer" className="w-full max-h-[70vh] object-contain rounded-xl" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
