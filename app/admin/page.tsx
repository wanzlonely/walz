'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';

const Ico = {
  Dashboard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/></svg>,
  Receipt: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v8h6"/><path d="M16 13H8M16 17H8"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full"><path d="M16 21v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1"/><circle cx="9" cy="7" r="3.5"/><path d="M22 21v-1a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 6.9"/></svg>,
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full"><path d="M12 3l7 3v6c0 4.5-2.8 7.9-7 9-4.2-1.1-7-4.5-7-9V6l7-3z"/><path d="M9 12l2 3 3-4"/></svg>,
  Chat: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H10l-4 2.5 1.5-4.5A8.5 8.5 0 0 1 21 11.5z"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full"><circle cx="11" cy="11" r="6"/><path d="M21 21l-3.5-3.5"/></svg>,
  Zap: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/></svg>,
  Tag: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full"><path d="M20 12l-8 8-8-8V4h8l8 8z"/><circle cx="8" cy="8" r="1"/></svg>,
  Send: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-full h-full"><path d="M5 12l5 5L20 7"/></svg>,
};

export default function AdminPremium() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'users' | 'security' | 'chat'>('dashboard');
  const [userFilter, setUserFilter] = useState<'ALL' | 'FREE' | 'PREMIUM'>('ALL');
  const [data, setData] = useState<any>({ users: [], orders: [], redeemCodes: [], flashSale: null, auditLogs: [] });
  const [search, setSearch] = useState('');
  const [grantDays, setGrantDays] = useState<Record<string, string>>({});
  const [flashPercentInput, setFlashPercentInput] = useState('25');
  const [flashHoursInput, setFlashHoursInput] = useState('6');
  const [newCodeName, setNewCodeName] = useState('');
  const [newCodeDays, setNewCodeDays] = useState('');
  const [newCodeUses, setNewCodeUses] = useState('');
  const [newCodeDailyLimit, setNewCodeDailyLimit] = useState('');
  const [broadcastText, setBroadcastText] = useState('');
  const [broadcastResult, setBroadcastResult] = useState('');
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [pinModal, setPinModal] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [pendingActionPayload, setPendingActionPayload] = useState<any>(null);
  // chat states
  const [conversations, setConversations] = useState<any[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [conversationsError, setConversationsError] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatMessagesLoading, setChatMessagesLoading] = useState(false);
  const [chatFilter, setChatFilter] = useState<'all' | 'unread' | 'open' | 'closed'>('all');
  const [chatSearch, setChatSearch] = useState('');
  const [chatSearchDebounced, setChatSearchDebounced] = useState('');
  const [chatStats, setChatStats] = useState({ total: 0, unread: 0, open: 0 });
  const [chatReplyText, setChatReplyText] = useState('');
  const [chatReplySending, setChatReplySending] = useState(false);
  const [chatToast, setChatToast] = useState<string | null>(null);
  const [convHasMore, setConvHasMore] = useState(false);
  const [convCursor, setConvCursor] = useState<string | null>(null);
  const [convLoadingMore, setConvLoadingMore] = useState(false);
  const [msgHasMore, setMsgHasMore] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [quickReplies, setQuickReplies] = useState<string[]>(['Terima kasih sudah menghubungi kami 🙏','Mohon tunggu, kami cek dulu ya','Bisa kirim bukti pembayarannya?','VIP kamu sudah kami aktifkan ✅']);
  const [newQuick, setNewQuick] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const chatUserNearBottomRef = useRef(true);
  const activeIdRef = useRef<string | null>(null);
  const filterRef = useRef(chatFilter);
  const searchRef = useRef(chatSearchDebounced);

  const fetchCore = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin?data=1&t=${Date.now()}`, { cache: 'no-store' });
      if (res.status === 401) { setAuth(false); return; }
      const d = await res.json();
      if (res.ok) { setData(d); setAuth(true); }
    } catch { setAuth(false); }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setChatSearchDebounced(chatSearch.trim()), 350);
    return () => clearTimeout(t);
  }, [chatSearch]);
  useEffect(() => { activeIdRef.current = activeConversationId; }, [activeConversationId]);
  useEffect(() => { filterRef.current = chatFilter; }, [chatFilter]);
  useEffect(() => { searchRef.current = chatSearchDebounced; }, [chatSearchDebounced]);

  useEffect(() => { fetchCore(); }, [fetchCore]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'login', password, telegramId }) });
    if (res.ok) { setAuth(true); fetchCore(); } else alert('Akses Ditolak');
  };

  const requestProtectedAction = (payload: any) => { setPendingActionPayload(payload); setPinModal(true); };
  const confirmPinAction = async () => {
    if (!pendingActionPayload) return;
    setSendingBroadcast(true);
    try {
      const res = await fetch('/api/admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...pendingActionPayload, pin: pinValue, broadcastMessage: broadcastText }) });
      const resData = await res.json();
      if (res.ok) { setPinModal(false); setPinValue(''); fetchCore(); if (pendingActionPayload.action === 'broadcast') { setBroadcastResult(resData.message || 'Broadcast terkirim!'); setBroadcastText(''); } }
      else alert(resData.error || 'PIN Salah');
    } finally { setSendingBroadcast(false); }
  };

  const fetchChatStats = useCallback(async () => {
    try { const res = await fetch(`/api/admin/chat?stats=1&t=${Date.now()}`, { cache: 'no-store' }); if (res.ok) setChatStats(await res.json()); } catch {}
  }, []);
  const fetchConversations = useCallback(async (opts?: { append?: boolean; cursor?: string | null }) => {
    const append = !!opts?.append;
    if (append) setConvLoadingMore(true); else { setConversationsLoading(true); setConversationsError(null); }
    try {
      const params = new URLSearchParams({ filter: filterRef.current, t: String(Date.now()) });
      if (searchRef.current) params.set('search', searchRef.current);
      if (append && opts?.cursor) params.set('cursor', opts.cursor);
      const res = await fetch(`/api/admin/chat?${params.toString()}`, { cache: 'no-store' });
      const d = await res.json(); if (!res.ok) throw new Error(d.error);
      const list = Array.isArray(d.conversations) ? d.conversations : [];
      setConversations(prev => { if (!append) return list; const seen = new Set(prev.map(c=>c.id)); return [...prev, ...list.filter((c:any)=>!seen.has(c.id))]; });
      setConvHasMore(!!d.hasMore); setConvCursor(d.nextCursor || null);
    } catch (e:any) { if (!append) setConversationsError(e?.message); }
    finally { setConversationsLoading(false); setConvLoadingMore(false); }
  }, []);
  const openConversation = async (id: string) => {
    setActiveConversationId(id); setActiveConversation(conversations.find(c=>c.id===id)||null); setChatMessages([]); setChatMessagesLoading(true);
    try {
      const res = await fetch(`/api/admin/chat?conversationId=${id}&t=${Date.now()}`, { cache: 'no-store' });
      const d = await res.json(); if (!res.ok) throw new Error(d.error);
      setChatMessages(d.messages || []); if (d.conversation) setActiveConversation(d.conversation);
      setTimeout(()=>chatScrollRef.current?.scrollTo({ top: 99999, behavior: 'auto' }),50);
    } catch (e:any) { setChatToast(e?.message); } finally { setChatMessagesLoading(false); }
  };
  const sendReply = async () => {
    if (!chatReplyText.trim() || !activeConversationId) return;
    setChatReplySending(true);
    try {
      const res = await fetch('/api/admin/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reply', conversationId: activeConversationId, text: chatReplyText }) });
      const d = await res.json(); if (!res.ok) throw new Error(d.error);
      setChatMessages(prev=>[...prev, d.message]); setChatReplyText(''); setTimeout(()=>chatScrollRef.current?.scrollTo({ top: 99999, behavior: 'smooth' }),30);
    } catch (e:any) { setChatToast(e?.message); } finally { setChatReplySending(false); }
  };

  useEffect(() => { if (activeTab==='chat' && auth) { fetchConversations(); fetchChatStats(); } }, [activeTab, auth, chatFilter, chatSearchDebounced]);
  useEffect(() => { if (auth) fetchChatStats(); }, [auth, fetchChatStats]);

  if (auth === null) return (
    <div className="min-h-screen bg-[#05070E] flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-violet-500 animate-spin"/>
    </div>
  );
  if (!auth) return (
    <div className="min-h-screen bg-[#05070E] text-white flex items-center justify-center p-5 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-violet-500/20 rounded-full blur-[120px]"/>
        <div className="absolute bottom-1/4 -right-40 w-[600px] h-[600px] bg-fuchsia-500/15 rounded-full blur-[120px]"/>
      </div>
      <form onSubmit={login} className="w-full max-w-[380px] relative z-10 rounded-[32px] bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] p-8 space-y-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
        <div className="text-center">
          <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-violet-500 to-fuchsia-500 mx-auto flex items-center justify-center font-black text-xl shadow-[0_0_30px_rgba(139,92,246,0.5)]">W</div>
          <h1 className="mt-4 text-[18px] font-bold tracking-tight">WALZSHOP ADMIN</h1>
          <p className="text-[12px] text-white/40 mt-1">Owner Command Center • Encrypted</p>
        </div>
        <div className="space-y-3">
          <input value={telegramId} onChange={e=>setTelegramId(e.target.value)} placeholder="Telegram ID" className="w-full h-12 rounded-full bg-black border border-white/10 px-5 text-[13px] focus:outline-none focus:border-violet-500/50"/>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full h-12 rounded-full bg-black border border-white/10 px-5 text-[13px] focus:outline-none focus:border-violet-500/50"/>
        </div>
        <button className="w-full h-12 rounded-full bg-white text-black font-bold text-[13px]">Masuk Secure</button>
      </form>
    </div>
  );

  const pending = (data.orders || []).filter((o:any)=>o.status==='PENDING');
  const approved = (data.orders || []).filter((o:any)=>o.status==='APPROVED');
  const premium = (data.users || []).filter((u:any)=>u.status==='ACTIVE' && u.expiredAt && new Date(u.expiredAt).getTime()>Date.now());
  const rev = approved.reduce((s:any,o:any)=>s+(o.amount||0),0);
  const filteredUsers = (data.users || []).filter((u:any)=>{
    const isPrem = u.status==='ACTIVE' && u.expiredAt && new Date(u.expiredAt).getTime()>Date.now();
    if (userFilter==='FREE' && isPrem) return false;
    if (userFilter==='PREMIUM' && !isPrem) return false;
    return !search || u.telegramId?.includes(search) || u.username?.toLowerCase().includes(search.toLowerCase());
  });
  const isFlashActive = data.flashSale && data.flashSale.active && new Date(data.flashSale.expiresAt).getTime()>Date.now();

  return (
    <div className="min-h-screen bg-[#05070E] text-white antialiased selection:bg-violet-500/30 pb-[120px]">
      {/* BG */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-[radial-gradient(ellipse_at_center,_rgba(120,80,255,0.18),_transparent_60%)] blur-[50px]"/>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_rgba(236,72,153,0.12),_transparent_60%)] blur-[60px]"/>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-2xl bg-[#05070E]/70 border-b border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto px-5 h-[68px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-[12px] bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-black">W</div>
            <div>
              <p className="text-[13px] font-bold tracking-tight leading-none">WALZSHOP • ADMIN</p>
              <p className="text-[11px] text-white/40 mt-1 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/> Live • {data.users?.length || 0} users • {pending.length} pending</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>fetchCore()} className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center"><div className="w-4 h-4"><Ico.Dashboard/></div></button>
            <button onClick={()=>setAuth(false)} className="h-9 px-4 rounded-full bg-white/[0.06] border border-white/[0.08] text-[12px] font-bold flex items-center gap-2"><div className="w-4 h-4"><Ico.Logout/></div> Logout</button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1200px] mx-auto px-5 pt-6">
        {/* Stats Premium */}
        {activeTab==='dashboard' && (
          <div className="space-y-6 animate-[fadeIn_0.3s]">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-[24px] bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.08] p-5 backdrop-blur-xl">
                <p className="text-[10px] tracking-widest font-bold text-white/30 uppercase">Total Revenue</p>
                <p className="text-[22px] font-bold tracking-tight mt-2 font-mono">Rp {rev.toLocaleString('id-ID')}</p>
                <p className="text-[11px] text-emerald-300 mt-2">↑ 12% minggu ini</p>
              </div>
              <div className="rounded-[24px] bg-[#10131D] border border-white/[0.06] p-5">
                <p className="text-[10px] tracking-widest font-bold text-white/30 uppercase">Total User</p>
                <p className="text-[22px] font-bold tracking-tight mt-2 font-mono">{data.users?.length || 0}</p>
                <div className="mt-2 flex gap-2 text-[11px]"><span className="text-white/40">{(data.users?.length||0)-premium.length} free</span><span className="text-amber-300">{premium.length} VIP</span></div>
              </div>
              <div className="rounded-[24px] bg-[#10131D] border border-amber-500/20 p-5">
                <p className="text-[10px] tracking-widest font-bold text-amber-300/60 uppercase">VIP Active</p>
                <p className="text-[22px] font-bold tracking-tight mt-2 font-mono text-amber-300">{premium.length}</p>
                <p className="text-[11px] text-white/40 mt-2">Aktif berlangganan</p>
              </div>
              <div className={`rounded-[24px] border p-5 ${pending.length>0 ? 'bg-rose-500/10 border-rose-500/20' : 'bg-[#10131D] border-white/[0.06]'}`}>
                <p className="text-[10px] tracking-widest font-bold uppercase" style={{color: pending.length>0 ? '#fda4af' : 'rgba(255,255,255,0.3)'}}>Pending Orders</p>
                <p className="text-[22px] font-bold tracking-tight mt-2 font-mono">{pending.length}</p>
                {pending.length>0 ? <button onClick={()=>setActiveTab('orders')} className="mt-3 h-8 px-4 rounded-full bg-rose-500 text-white text-[11px] font-bold">Periksa →</button> : <p className="text-[11px] text-white/40 mt-2">Clear ✓</p>}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              {/* Flash Sale Control */}
              <div className="rounded-[28px] bg-[#10131D] border border-white/[0.06] p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center"><div className="w-5 h-5"><Ico.Zap/></div></div>
                    <div><p className="text-[14px] font-bold">Flash Sale</p><p className="text-[11px] text-white/40">Kontrol diskon event</p></div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${isFlashActive ? 'bg-rose-500 text-white' : 'bg-white/10 text-white/40'}`}>{isFlashActive ? 'LIVE' : 'OFF'}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input value={flashPercentInput} onChange={e=>setFlashPercentInput(e.target.value)} placeholder="% diskon" className="h-11 rounded-full bg-black border border-white/10 px-4 text-[13px] text-center"/>
                  <input value={flashHoursInput} onChange={e=>setFlashHoursInput(e.target.value)} placeholder="Durasi jam" className="h-11 rounded-full bg-black border border-white/10 px-4 text-[13px] text-center"/>
                </div>
                <button onClick={()=>requestProtectedAction({ action: 'toggle_flash_sale', flashActive: !isFlashActive, flashPercent: flashPercentInput, flashHours: flashHoursInput })} className={`w-full mt-4 h-12 rounded-full font-bold text-[13px] ${isFlashActive ? 'bg-white/10 text-white border border-white/10' : 'bg-gradient-to-r from-rose-500 to-orange-500 text-white'}`}>{isFlashActive ? 'Matikan Flash Sale' : 'Aktifkan Flash Sale'}</button>
              </div>

              {/* Voucher Creator */}
              <div className="rounded-[28px] bg-[#10131D] border border-white/[0.06] p-6">
                <p className="text-[13px] font-bold mb-4 flex items-center gap-2"><div className="w-5 h-5 text-amber-300"><Ico.Tag/></div> Buat Voucher</p>
                <div className="grid grid-cols-2 gap-3">
                  <input value={newCodeName} onChange={e=>setNewCodeName(e.target.value)} placeholder="KODEVIP" className="col-span-2 h-11 rounded-full bg-black border border-white/10 px-4 text-[12px] font-mono uppercase tracking-wider"/>
                  <input value={newCodeDays} onChange={e=>setNewCodeDays(e.target.value)} placeholder="Hari" className="h-11 rounded-full bg-black border border-white/10 px-4 text-[13px] text-center"/>
                  <input value={newCodeUses} onChange={e=>setNewCodeUses(e.target.value)} placeholder="Kuota" className="h-11 rounded-full bg-black border border-white/10 px-4 text-[13px] text-center"/>
                  <input value={newCodeDailyLimit} onChange={e=>setNewCodeDailyLimit(e.target.value)} placeholder="Limit/hari (opsional)" className="col-span-2 h-11 rounded-full bg-black border border-white/10 px-4 text-[12px]"/>
                </div>
                <button onClick={()=>requestProtectedAction({ action: 'create_redeem_code', code: newCodeName, days: newCodeDays, usesLeft: newCodeUses, dailyLimit: newCodeDailyLimit })} className="w-full mt-4 h-11 rounded-full bg-white text-black font-bold text-[12px]">+ Buat Voucher</button>
                <div className="mt-4 space-y-2 max-h-[120px] overflow-y-auto">
                  {(data.redeemCodes||[]).map((c:any)=><div key={c.code} className="flex justify-between items-center p-2.5 rounded-full bg-white/[0.04] border border-white/[0.06]"><span className="font-mono text-[11px] font-bold text-amber-300">{c.code}</span><span className="text-[10px] text-white/40">{c.usesLeft} left</span></div>)}
                </div>
              </div>
            </div>

            {/* Broadcast */}
            <div className="rounded-[24px] bg-white/[0.03] border border-white/[0.06] p-5 flex gap-3">
              <input value={broadcastText} onChange={e=>setBroadcastText(e.target.value)} placeholder="Broadcast pesan ke semua user..." className="flex-1 h-11 rounded-full bg-black border border-white/10 px-5 text-[13px]"/>
              <button onClick={()=>requestProtectedAction({ action: 'broadcast' })} className="h-11 px-6 rounded-full bg-white text-black font-bold text-[12px]">Kirim</button>
            </div>
            {broadcastResult && <p className="text-[12px] text-emerald-300">{broadcastResult}</p>}
          </div>
        )}

        {activeTab==='orders' && (
          <div className="space-y-4">
            <h2 className="text-[16px] font-bold">Pending Transactions • {pending.length}</h2>
            <div className="grid gap-3">
              {pending.length===0 ? <div className="rounded-[24px] bg-[#10131D] border border-white/10 p-12 text-center text-white/30">Semua clear ✓</div> :
                pending.map((o:any)=><div key={o.orderId} className="rounded-[24px] bg-[#10131D] border border-white/[0.06] p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2"><span className="font-mono text-[11px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">#{o.orderId}</span><span className="text-[11px] text-white/40">{new Date(o.createdAt).toLocaleString('id-ID')}</span></div>
                    <p className="mt-2 font-bold text-[14px]">{o.displayName || o.username} • {o.telegramId}</p>
                    <p className="text-[12px] text-white/50">Rp {o.amount?.toLocaleString('id-ID')} • {o.durationDays} hari • {o.proofNote || '-'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>requestProtectedAction({ action: 'approve_order', orderId: o.orderId })} className="h-10 px-5 rounded-full bg-emerald-500 text-black font-bold text-[12px]">Approve</button>
                    <button onClick={()=>requestProtectedAction({ action: 'reject_order', orderId: o.orderId })} className="h-10 px-5 rounded-full bg-white/10 border border-white/10 text-[12px] font-bold">Reject</button>
                  </div>
                </div>)
              }
            </div>
          </div>
        )}

        {activeTab==='users' && (
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-3 justify-between">
              <div className="relative flex-1 max-w-[360px]">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"><Ico.Search/></div>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari ID, username..." className="w-full h-11 rounded-full bg-[#10131D] border border-white/10 pl-11 pr-4 text-[13px] focus:outline-none"/>
              </div>
              <div className="flex gap-1.5 p-1 rounded-full bg-white/[0.06] border border-white/[0.06] w-fit">
                {(['ALL','FREE','PREMIUM'] as const).map(f=><button key={f} onClick={()=>setUserFilter(f)} className={`px-4 h-8 rounded-full text-[11px] font-bold ${userFilter===f ? 'bg-white text-black' : 'text-white/50'}`}>{f}</button>)}
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-3">
              {filteredUsers.map((u:any)=>{
                const isPrem = u.status==='ACTIVE' && u.expiredAt && new Date(u.expiredAt).getTime()>Date.now();
                return (
                  <div key={u.telegramId} className="rounded-[20px] bg-[#10131D] border border-white/[0.06] p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold text-[12px]">{(u.profile?.firstName?.[0]||'U').toUpperCase()}</div>
                      <div>
                        <p className="text-[13px] font-bold">{u.profile?.firstName || u.telegramId} <span className={`ml-2 text-[9px] px-2 py-0.5 rounded-full ${isPrem ? 'bg-amber-400 text-black' : 'bg-white/10 text-white/40'}`}>{isPrem ? 'VIP' : 'FREE'}</span></p>
                        <p className="text-[11px] text-white/40 font-mono">{u.telegramId} • {u.points||0} pts</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <input value={grantDays[u.telegramId]||'7'} onChange={e=>setGrantDays(prev=>({...prev,[u.telegramId]:e.target.value}))} className="w-10 h-8 rounded-full bg-black border border-white/10 text-center text-[11px] font-bold"/>
                      <button onClick={()=>requestProtectedAction({ action: 'user_action', userAction: 'grant_premium', targetTelegramId: u.telegramId, durationDays: grantDays[u.telegramId]||'7' })} className="h-8 px-3 rounded-full bg-white text-black text-[10px] font-bold">+VIP</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab==='chat' && (
          <div className="rounded-[28px] bg-[#10131D] border border-white/[0.06] overflow-hidden flex h-[70vh] min-h-[500px]">
            <div className="w-[320px] border-r border-white/[0.06] flex flex-col">
              <div className="p-4 border-b border-white/[0.06] space-y-3">
                <div className="flex justify-between items-center"><p className="font-bold text-[13px]">Inbox Support</p><span className="text-[10px] px-2 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold">{chatStats.unread} unread</span></div>
                <div className="relative"><div className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30"><Ico.Search/></div><input value={chatSearch} onChange={e=>setChatSearch(e.target.value)} placeholder="Cari user..." className="w-full h-9 rounded-full bg-black border border-white/10 pl-9 pr-3 text-[12px]"/></div>
                <div className="flex gap-1"><button onClick={()=>setChatFilter('all')} className={`flex-1 h-7 rounded-full text-[10px] font-bold ${chatFilter==='all' ? 'bg-white text-black' : 'bg-white/5 text-white/50'}`}>All</button><button onClick={()=>setChatFilter('unread')} className={`flex-1 h-7 rounded-full text-[10px] font-bold ${chatFilter==='unread' ? 'bg-white text-black' : 'bg-white/5 text-white/50'}`}>Unread</button></div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.map(c=><button key={c.id} onClick={()=>openConversation(c.id)} className={`w-full text-left p-4 border-b border-white/[0.04] hover:bg-white/[0.04] ${activeConversationId===c.id ? 'bg-white/[0.06]' : ''}`}><div className="flex justify-between"><p className="text-[12px] font-bold truncate">{c.user_display_name || c.telegram_id}</p>{c.unread_by_owner>0 && <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">{c.unread_by_owner}</span>}</div><p className="text-[11px] text-white/40 truncate mt-1">{c.last_message || 'Belum ada pesan'}</p></button>)}
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              {!activeConversationId ? <div className="flex-1 flex items-center justify-center text-white/20 text-[13px]">Pilih percakapan</div> : <>
                <div className="h-[60px] border-b border-white/[0.06] px-5 flex items-center justify-between"><p className="font-bold text-[13px]">{activeConversation?.user_display_name || activeConversationId}</p><span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">{activeConversation?.status || 'open'}</span></div>
                <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-5 space-y-2">
                  {chatMessages.map((m:any)=><div key={m.id} className={`flex ${m.sender_type==='user' ? 'justify-start' : 'justify-end'}`}><div className={`max-w-[70%] px-4 py-2.5 rounded-[18px] text-[12px] ${m.sender_type==='user' ? 'bg-white/[0.06] border border-white/[0.08]' : 'bg-white text-black'}`}>{m.message}</div></div>)}
                </div>
                <div className="p-4 border-t border-white/[0.06] flex gap-2">
                  <input value={chatReplyText} onChange={e=>setChatReplyText(e.target.value)} onKeyDown={e=>{if(e.key==='Enter') sendReply();}} placeholder="Balas pesan..." className="flex-1 h-11 rounded-full bg-black border border-white/10 px-5 text-[13px]"/>
                  <button onClick={sendReply} disabled={chatReplySending} className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center"><div className="w-5 h-5"><Ico.Send/></div></button>
                </div>
              </>}
            </div>
          </div>
        )}

        {activeTab==='security' && (
          <div className="rounded-[24px] bg-[#10131D] border border-white/[0.06] p-6">
            <p className="font-bold text-[13px] mb-4">Security Audit Logs • {(data.auditLogs||[]).length}</p>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {(data.auditLogs||[]).map((l:any)=><div key={l.id} className="flex gap-3 p-3 rounded-[16px] bg-white/[0.03] border border-white/[0.04]"><div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0"/><div className="flex-1"><p className="text-[11px] font-mono font-bold text-emerald-300">{l.action}</p><p className="text-[12px] mt-1">{l.detail}</p><p className="text-[10px] text-white/30 mt-1">{new Date(l.timestamp).toLocaleString('id-ID')} • {l.telegramId}</p></div></div>)}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Nav Admin - Floating */}
      <div className="fixed bottom-0 left-0 right-0 z-30 pb-[max(14px,env(safe-area-inset-bottom))] pt-5 bg-gradient-to-t from-[#05070E] via-[#05070E] to-transparent pointer-events-none">
        <div className="pointer-events-auto mx-auto max-w-[560px] px-5">
          <div className="flex items-center justify-between p-1.5 rounded-full bg-[#12151F]/90 backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">
            {[
              {id:'dashboard', icon:Ico.Dashboard, label:'Dashboard'},
              {id:'orders', icon:Ico.Receipt, label:'Orders'},
              {id:'users', icon:Ico.Users, label:'Users'},
              {id:'chat', icon:Ico.Chat, label:'Chat'},
              {id:'security', icon:Ico.Shield, label:'Security'},
            ].map(tab=>{
              const active = activeTab===tab.id;
              return (
                <button key={tab.id} onClick={()=>setActiveTab(tab.id as any)} className={`relative h-11 rounded-full flex items-center justify-center transition-all ${active ? 'bg-white text-black px-5 shadow' : 'text-white/40 w-11 hover:text-white'}`}>
                  <div className="w-[18px] h-[18px]"><tab.icon/></div>
                  {active && <span className="ml-2 text-[12px] font-bold">{tab.label}</span>}
                  {tab.id==='orders' && pending.length>0 && !active && <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">{pending.length}</span>}
                  {tab.id==='chat' && chatStats.unread>0 && !active && <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">{chatStats.unread}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* PIN Modal */}
      {pinModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-5">
          <div className="w-full max-w-[360px] rounded-[28px] bg-[#12151F] border border-white/[0.08] p-6 space-y-4">
            <p className="font-bold text-[14px]">Konfirmasi PIN Owner</p>
            <input type="password" value={pinValue} onChange={e=>setPinValue(e.target.value)} placeholder="PIN" className="w-full h-12 rounded-full bg-black border border-white/10 px-5 text-center text-[14px] tracking-widest"/>
            <div className="flex gap-2"><button onClick={()=>setPinModal(false)} className="flex-1 h-11 rounded-full bg-white/10 border border-white/10 text-[12px] font-bold">Batal</button><button onClick={confirmPinAction} className="flex-1 h-11 rounded-full bg-white text-black font-bold text-[12px]">Konfirmasi</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
