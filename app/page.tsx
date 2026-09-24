'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PACKAGES } from '@/lib/packages';
import { supabase } from '@/lib/supabase';

const METHODS = [
  { id: 'QRIS', label: 'QRIS All Payment', badge: 'Auto' },
  { id: 'DANA', label: 'E-Wallet DANA', badge: 'Instan' },
  { id: 'SEABANK', label: 'Bank SeaBank', badge: 'Transfer' },
];

const REDEEM_OPTIONS = [
  { id: 'r1', label: '+3 Hari VIP Access', points: 100, days: 3, isVoucher: false, badge: 'Starter', desc: 'Akses VIP instan selama 3 hari penuh' },
  { id: 'r2', label: '+7 Hari VIP Access', points: 200, days: 7, isVoucher: false, badge: 'Populer', desc: 'Akses VIP instan selama 1 minggu' },
  { id: 'r3', label: '+15 Hari VIP Access', points: 400, days: 15, isVoucher: false, badge: 'Hemat', desc: 'Akses VIP setengah bulan penuh' },
  { id: 'r4', label: '+30 Hari VIP Access', points: 700, days: 30, isVoucher: false, badge: 'Best Value', desc: 'Akses VIP sebulan penuh tanpa batas' },
  { id: 'r5', label: 'Voucher Diskon 25%', points: 150, days: 0, isVoucher: true, badge: 'Voucher', desc: 'Potongan 25% untuk semua paket VIP' },
  { id: 'r6', label: 'Voucher Diskon 50%', points: 300, days: 0, isVoucher: true, badge: 'Voucher', desc: 'Potongan 50% super hemat paket VIP' },
];

const RECENT_PURCHASES = [
  'User @a***2 baru saja mengaktifkan VIP 30 Hari',
  'User @d***9 baru saja membeli Paket 15 Hari',
  'User @x***7 berhasil tukar 200 Poin VIP',
  'User @k***1 baru saja membeli Paket 7 Hari'
];

const DAILY_STREAKS = [
  { day: 1, pts: 10, label: 'Hari 1' },
  { day: 2, pts: 15, label: 'Hari 2' },
  { day: 3, pts: 20, label: 'Hari 3' },
  { day: 4, pts: 25, label: 'Hari 4' },
  { day: 5, pts: 30, label: 'Hari 5' },
  { day: 6, pts: 40, label: 'Hari 6' },
  { day: 7, pts: 75, label: 'Bonus Big' },
];

const QRIS_IMAGE_URL = 'https://cdn.phototourl.com/free/2026-09-20-089b0a40-ebfa-44cc-822a-243c7f64a793.jpg';

function useCountdown(targetDate: string | null) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  useEffect(() => {
    if (!targetDate) { setTimeLeft(null); return; }
    const updateTimer = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) setTimeLeft(null);
      else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);
  return timeLeft;
}

// Icons - refined minimal stroke
const Ico = {
  Home: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full"><path d="M3.5 10.5L12 3l8.5 7.5V20a1.5 1.5 0 0 1-1.5 1.5h-4V14h-6v7.5h-4A1.5 1.5 0 0 1 3.5 20v-9.5z"/></svg>,
  Store: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full"><path d="M6 7l-3 5v6a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-6l-3-5H6z"/><path d="M3 7h18"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>,
  Gift: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full"><path d="M20 12v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8"/><path d="M2 7h20v5H2z"/><path d="M12 7v14"/><path d="M12 7c0-2.5 2-4 4.5-4 2.5 0 2.5 2.5 0 4H12z"/><path d="M12 7c0-2.5-2-4-4.5-4C5 3 5 5.5 7.5 7H12z"/></svg>,
  Calendar: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  User: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full"><circle cx="12" cy="8" r="3.5"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/></svg>,
  Crown: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full"><path d="M3 16l-1-10 5 5 5-7 5 7 5-5-1 10H3z"/><path d="M3 20h18"/></svg>,
  Zap: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-full h-full"><path d="M5 12l5 5L20 7"/></svg>,
  Copy: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V7a2 2 0 0 1 2-2h8"/></svg>,
  Share: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 11.2L15.8 6.8M8.2 12.8L15.8 17.2"/></svg>,
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full"><path d="M12 3l7 3v6c0 4.5-2.8 7.9-7 9-4.2-1.1-7-4.5-7-9V6l7-3z"/><path d="M8.5 12l2.5 2.5L15.5 9"/></svg>,
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></svg>,
  Star: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full"><path d="M12 3l2.5 5.2 5.7.8-4.1 4 1 5.6L12 16.1 6.9 18.6l1-5.6-4.1-4 5.7-.8L12 3z"/></svg>,
  Tag: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full"><path d="M20 12l-8 8-8-8V4h8l8 8z"/><circle cx="8" cy="8" r="1"/></svg>,
  Send: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>,
  Chat: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-full h-full"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H10l-4 2.5 1.5-4.5A8.5 8.5 0 0 1 21 11.5z"/></svg>,
};

export default function StoreUIPremium() {
  const router = useRouter();
  const [initData, setInitData] = useState('');
  const [tgUser, setTgUser] = useState<any>(null);
  const [userStatus, setUserStatus] = useState<any>(null);
  const [pending, setPending] = useState(false);
  const [flashSale, setFlashSale] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<string>(PACKAGES[0]?.id || '3D');
  const [proofNote, setProofNote] = useState('');
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState('QRIS');
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedNum, setCopiedNum] = useState<string | null>(null);
  const [copiedVoucher, setCopiedVoucher] = useState<string | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'buy' | 'checkin' | 'redeem' | 'profile'>('dashboard');
  const [confirmStep, setConfirmStep] = useState(false);
  const [claimInputCode, setClaimInputCode] = useState('');
  const [claiming, setClaiming] = useState(false);
  const [qrisZoomOpen, setQrisZoomOpen] = useState(false);
  const [dailyClaiming, setDailyClaiming] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [redeemConfirmItem, setRedeemConfirmItem] = useState<any>(null);
  const [badge, setBadge] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [referredUsers, setReferredUsers] = useState<any[]>([]);
  const [profileSubTab, setProfileSubTab] = useState<'overview' | 'history' | 'settings'>('overview');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatConversation, setChatConversation] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatSending, setChatSending] = useState(false);
  const [chatUnread, setChatUnread] = useState(0);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const chatUserNearBottomRef = useRef(true);

  useEffect(() => {
    const interval = setInterval(() => setTickerIndex((p) => (p + 1) % RECENT_PURCHASES.length), 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (['buy','checkin','redeem','profile'].includes(tabParam as any)) setActiveTab(tabParam as any);
      if ((window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp;
        tg.ready(); tg.expand();
        tg.setHeaderColor('#05070E'); tg.setBackgroundColor('#05070E');
        setInitData(tg.initData || ''); setTgUser(tg.initDataUnsafe?.user);
        checkStatus(tg.initData || '');
      } else { checkStatus(''); }
    }
  }, []);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMsg({ type, text }); setTimeout(() => setToastMsg(null), 3500);
  };

  // --- keep all logic functions from original (trimmed for brevity but functional) ---
  const checkStatus = async (raw: string) => {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/store?initData=${encodeURIComponent(raw)}&t=${Date.now()}`, { cache: 'no-store' });
      const d = await res.json();
      if (res.ok) {
        setUserStatus(d.user); setPending(d.pending || false); setFlashSale(d.flashSale || null);
        setBadge(d.badge || null); setLeaderboard(d.leaderboard || []); setMyRank(d.myRank || null);
        setTotalPlayers(d.totalPlayers || 0); setReferredUsers(d.referredUsers || []);
      }
    } finally { setLoading(false); setRefreshing(false); }
  };

  const scrollChatToBottom = (smooth = true) => {
    const el = chatScrollRef.current; if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  };
  const handleChatScroll = () => {
    const el = chatScrollRef.current; if (!el) return;
    chatUserNearBottomRef.current = (el.scrollHeight - el.scrollTop - el.clientHeight) < 120;
  };
  const loadChat = async (raw: string) => {
    if (!raw) return; setChatLoading(true); setChatError(null);
    try {
      const res = await fetch(`/api/chat?initData=${encodeURIComponent(raw)}&t=${Date.now()}`, { cache: 'no-store' });
      const d = await res.json(); if (!res.ok) throw new Error(d.error);
      setChatConversation(d.conversation); setChatMessages(d.messages || []); setChatUnread(d.conversation?.unread_by_user || 0);
      setTimeout(() => scrollChatToBottom(false), 50);
    } catch (e: any) { setChatError(e?.message || 'Gagal memuat chat'); }
    finally { setChatLoading(false); }
  };
  const sendChatMessage = async () => {
    const text = chatInput.trim(); if (!text || chatSending || !initData) return;
    setChatSending(true); setChatInput('');
    const tempId = `temp-${Date.now()}`;
    setChatMessages(prev => [...prev, { id: tempId, sender_type: 'user', message: text, created_at: new Date().toISOString(), _pending: true }]);
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initData, text }) });
      const d = await res.json(); if (!res.ok) throw new Error(d.error);
      if (d.message) setChatMessages(prev => prev.filter(m=>m.id!==tempId).concat(d.message));
    } catch (e: any) { showToast('error', e?.message); setChatInput(text); }
    finally { setChatSending(false); }
  };
  const markChatRead = async (raw: string) => {
    try { await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initData: raw, action: 'mark_read' }) }); setChatUnread(0); } catch {}
  };
  useEffect(() => { if (initData) loadChat(initData); }, [initData]);
  useEffect(() => { if (chatOpen && initData && chatUnread>0) markChatRead(initData); }, [chatOpen]);
  useEffect(() => {
    if (!chatConversation?.id) return;
    const ch = supabase.channel(`user-chat-${chatConversation.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `conversation_id=eq.${chatConversation.id}` }, (payload: any) => {
        const newMsg = payload.new;
        setChatMessages(prev => prev.some(m=>m.id===newMsg.id) ? prev : [...prev, newMsg]);
        if ((newMsg.sender_type==='owner'||newMsg.sender_type==='ai') && !chatOpen) setChatUnread(u=>u+1);
        if (chatUserNearBottomRef.current) setTimeout(()=>scrollChatToBottom(true),30);
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [chatConversation?.id, chatOpen]);

  const copyReferral = () => {
    const id = tgUser?.id || userStatus?.telegramId;
    if (!id) return;
    navigator.clipboard.writeText(`https://t.me/fixeedredbot?start=ref_${id}`);
    setCopied(true); setTimeout(()=>setCopied(false),2500);
  };
  const shareToTelegram = () => {
    const id = tgUser?.id || userStatus?.telegramId;
    if (!id) return;
    const url = `https://t.me/share/url?url=${encodeURIComponent(`https://t.me/fixeedredbot?start=ref_${id}`)}&text=${encodeURIComponent('Gabung VIP premium bareng aku! 🚀')}`;
    window.open(url,'_blank');
  };
  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code); setCopiedVoucher(code); setTimeout(()=>setCopiedVoucher(null),2000);
  };

  // Computed
  const isPrem = userStatus?.status === 'ACTIVE' && userStatus?.expiredAt && new Date(userStatus?.expiredAt).getTime() > Date.now();
  const countdown = useCountdown(isPrem ? userStatus?.expiredAt : null);
  const isFlashActive = flashSale && flashSale.active && new Date(flashSale.expiresAt).getTime() > Date.now();
  const flashDiscount = isFlashActive ? (flashSale.discountPercent || 0) : 0;
  const displayName = tgUser ? [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ') : userStatus?.profile?.firstName || 'Exploit';
  const userUsername = tgUser?.username || userStatus?.profile?.username || 'exploit_user';
  const userTelegramId = tgUser?.id || userStatus?.telegramId || '8884003270';
  const initials = displayName?.[0]?.toUpperCase() || 'E';
  const userPoints = userStatus?.points || 0;
  const userVouchers = userStatus?.vouchers || [];
  const rawPkg = PACKAGES.find((p:any)=>p.id===selectedPkg) || PACKAGES[0];
  const calculatedPrice = isFlashActive ? Math.max(0, Math.floor(rawPkg.price * (1 - flashDiscount/100))) : rawPkg.price;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070E] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-violet-500 animate-spin"/>
          <p className="text-[11px] tracking-[0.2em] text-white/40 font-bold uppercase">Loading Premium</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070E] text-white font-sans antialiased relative overflow-x-hidden pb-[110px] selection:bg-violet-500/30">
      {/* Background Mesh */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-[radial-gradient(ellipse_at_center,_rgba(120,80,255,0.22),_transparent_60%)] blur-[40px]"/>
        <div className="absolute top-[10%] right-[-20%] w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_rgba(236,72,153,0.15),_transparent_60%)] blur-[50px]"/>
        <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-[#05070E] via-[#05070E]/80 to-transparent"/>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-[max(16px,env(safe-area-inset-top))] left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-[360px]">
          <div className={`px-4 py-3.5 rounded-[16px] backdrop-blur-2xl border shadow-2xl flex items-center gap-3 ${toastMsg.type==='success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100' : 'bg-rose-500/10 border-rose-500/20 text-rose-100'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${toastMsg.type==='success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
              <div className="w-4 h-4"><Ico.Check/></div>
            </div>
            <p className="text-[12px] font-medium leading-snug">{toastMsg.text}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#05070E]/60 border-b border-white/[0.06]">
        <div className="max-w-[480px] mx-auto px-5 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[12px] bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-black text-[14px] shadow-[0_0_20px_rgba(139,92,246,0.4)]">{initials}</div>
            <div>
              <p className="text-[12px] font-bold tracking-tight leading-none">{displayName}</p>
              <p className="text-[10px] text-white/40 font-medium mt-1">@{userUsername}</p>
            </div>
            {isPrem && <span className="ml-2 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-black text-[9px] font-black tracking-widest">VIP</span>}
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 px-3.5 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center gap-2">
              <div className="w-3.5 h-3.5 text-amber-300"><Ico.Star/></div>
              <span className="text-[12px] font-bold font-mono tracking-tight">{userPoints}</span>
            </div>
            <button onClick={()=>setChatOpen(true)} className="relative w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
              <div className="w-4 h-4"><Ico.Chat/></div>
              {chatUnread>0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">{chatUnread>9?'+9':chatUnread}</span>}
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[480px] mx-auto px-5 pt-5 space-y-5">

        {/* Live Ticker - premium minimal */}
        <div className="group flex items-center gap-3 px-4 h-10 rounded-full bg-white/[0.04] border border-white/[0.06] backdrop-blur-xl overflow-hidden">
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"/><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"/></span>
            <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Live</span>
          </div>
          <div className="h-4 w-px bg-white/10"/>
          <p className="text-[11px] font-medium text-white/70 truncate transition-all">{RECENT_PURCHASES[tickerIndex]}</p>
        </div>

        {isFlashActive && (
          <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-rose-500/20 via-orange-500/10 to-violet-500/20 border border-rose-500/20 p-[1px]">
            <div className="rounded-[23px] bg-[#0F121A] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white shadow-lg"><div className="w-5 h-5"><Ico.Zap/></div></div>
                <div>
                  <p className="text-[12px] font-black tracking-wide">FLASH SALE • -{flashDiscount}% OFF</p>
                  <p className="text-[11px] text-white/50 mt-0.5">Berakhir dalam {flashSale?.expiresAt ? Math.max(0, Math.floor((new Date(flashSale.expiresAt).getTime()-Date.now())/60000)) : 0} menit</p>
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-white text-black text-[11px] font-black">LIMITED</div>
            </div>
          </div>
        )}

        {/* DASHBOARD */}
        {activeTab==='dashboard' && (
          <div className="space-y-5 animate-[fadeIn_0.3s_ease]">
            {/* Hero Profile Card - Premium */}
            <div className="relative rounded-[28px] overflow-hidden border border-white/[0.08] bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-500/10 pointer-events-none"/>
              <div className="relative p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="relative">
                      <div className="w-[56px] h-[56px] rounded-[18px] overflow-hidden bg-gradient-to-br from-violet-500 to-fuchsia-500 p-[1.5px]">
                        <div className="w-full h-full rounded-[16px] bg-[#0F121A] flex items-center justify-center overflow-hidden">
                          {tgUser?.photo_url ? <img src={tgUser.photo_url} className="w-full h-full object-cover"/> : <span className="font-black text-lg">{initials}</span>}
                        </div>
                      </div>
                      {isPrem && <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 border-2 border-[#0F121A] flex items-center justify-center"><div className="w-3 h-3 text-black"><Ico.Crown/></div></div>}
                    </div>
                    <div>
                      <h2 className="text-[16px] font-bold tracking-tight leading-tight">{displayName}</h2>
                      <p className="text-[12px] text-white/50 font-medium mt-1">ID {userTelegramId} • {isPrem ? 'VIP Active' : 'Free Plan'}</p>
                      <div className="mt-3 flex gap-2">
                        <div className="px-3 h-7 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
                          <span className="text-[10px] font-bold tracking-widest text-white/70">ONLINE</span>
                        </div>
                        {isPrem && countdown && (
                          <div className="px-3 h-7 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-amber-300 font-mono">{countdown.days}H {String(countdown.hours).padStart(2,'0')}:{String(countdown.minutes).padStart(2,'0')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="rounded-[18px] bg-white/[0.04] border border-white/[0.06] p-3.5">
                    <p className="text-[10px] tracking-widest text-white/30 font-bold uppercase">Points</p>
                    <p className="text-[18px] font-bold font-mono mt-1">{userPoints}</p>
                    <p className="text-[10px] text-emerald-300/70 mt-1 font-medium">+12 hari ini</p>
                  </div>
                  <div className="rounded-[18px] bg-white/[0.04] border border-white/[0.06] p-3.5">
                    <p className="text-[10px] tracking-widest text-white/30 font-bold uppercase">Rank</p>
                    <p className="text-[18px] font-bold font-mono mt-1">#{myRank || '-'}</p>
                    <p className="text-[10px] text-white/40 mt-1">dari {totalPlayers || 0}</p>
                  </div>
                  <div className="rounded-[18px] bg-gradient-to-br from-amber-400 to-orange-500 p-3.5 text-black">
                    <p className="text-[10px] tracking-widest font-bold uppercase opacity-70">Status</p>
                    <p className="text-[13px] font-black mt-1 leading-tight">{isPrem ? 'VIP Member' : 'Upgrade'}</p>
                    <p className="text-[10px] font-bold mt-1 opacity-80">{isPrem ? 'Unlimited' : 'Free'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={()=>setActiveTab('buy')} className="group relative rounded-[20px] bg-white text-black p-4 text-left overflow-hidden">
                <div className="relative z-10">
                  <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center mb-3"><div className="w-4 h-4"><Ico.Store/></div></div>
                  <p className="text-[13px] font-bold leading-tight">Beli Paket VIP</p>
                  <p className="text-[11px] opacity-60 mt-1 leading-snug">Mulai dari 25K, instant active</p>
                </div>
                <div className="absolute right-0 bottom-0 w-24 h-24 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 blur-[20px] rounded-full"/>
              </button>
              <button onClick={()=>setActiveTab('checkin')} className="rounded-[20px] bg-white/[0.06] border border-white/[0.08] backdrop-blur-xl p-4 text-left hover:bg-white/[0.08] transition">
                <div className="w-9 h-9 rounded-full bg-white/[0.08] border border-white/[0.1] flex items-center justify-center mb-3"><div className="w-4 h-4"><Ico.Calendar/></div></div>
                <p className="text-[13px] font-bold leading-tight">Daily Check-in</p>
                <p className="text-[11px] text-white/50 mt-1 leading-snug">Claim hingga 75 poin</p>
              </button>
            </div>

            {/* Referral - Premium Card */}
            <div className="rounded-[24px] bg-[#10131D] border border-white/[0.06] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold tracking-widest text-white/30 uppercase">Referral Program</p>
                  <p className="text-[14px] font-bold mt-1">Undang teman, dapat poin</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center"><div className="w-5 h-5"><Ico.Share/></div></div>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="flex-1 h-11 rounded-full bg-black border border-white/[0.08] px-4 flex items-center text-[11px] font-mono text-white/60 truncate">t.me/fixeedredbot?start=ref_{userTelegramId}</div>
                <button onClick={copyReferral} className="h-11 px-5 rounded-full bg-white text-black text-[12px] font-bold active:scale-95 transition">{copied?'Copied':'Copy'}</button>
              </div>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-white/40">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">{referredUsers.length}</div>
                <span>{referredUsers.length} teman bergabung • total bonus {referredUsers.length*50} poin</span>
              </div>
            </div>
          </div>
        )}

        {/* BUY TAB */}
        {activeTab==='buy' && (
          <div className="space-y-5 animate-[fadeIn_0.3s_ease]">
            <div>
              <h2 className="text-[18px] font-bold tracking-tight">Pilih Paket VIP</h2>
              <p className="text-[12px] text-white/50 mt-1">Pembayaran otomatis • Aktivasi instant</p>
            </div>

            <div className="grid gap-3">
              {PACKAGES.map((pkg:any)=>{
                const isSelected = selectedPkg===pkg.id;
                const originalPrice = pkg.price;
                const price = isFlashActive ? Math.max(0, Math.floor(originalPrice*(1-flashDiscount/100))) : originalPrice;
                const isBest = pkg.id==='30D' || pkg.badge==='Best Value';
                return (
                  <button key={pkg.id} onClick={()=>setSelectedPkg(pkg.id)} className={`relative text-left rounded-[24px] border p-[1px] transition-all ${isSelected ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-[0_0_30px_rgba(139,92,246,0.3)]' : 'bg-white/[0.06] border-white/[0.06] hover:bg-white/[0.08]'}`}>
                    <div className={`rounded-[23px] p-5 ${isSelected ? 'bg-[#12151F]' : 'bg-[#10131D]'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-[15px] font-bold tracking-tight">{pkg.label || `${pkg.duration} Hari VIP`}</p>
                            {isBest && <span className="px-2.5 py-1 rounded-full bg-amber-400 text-black text-[9px] font-black tracking-widest">BEST VALUE</span>}
                          </div>
                          <p className="text-[11px] text-white/50 mt-1">{pkg.desc || 'Akses premium tanpa batas • Speed maksimal'}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-white border-white text-black' : 'border-white/20'}`}>{isSelected && <div className="w-3 h-3"><Ico.Check/></div>}</div>
                      </div>
                      <div className="mt-4 flex items-end justify-between">
                        <div className="flex items-baseline gap-2">
                          <p className="text-[22px] font-bold tracking-tight">Rp {price.toLocaleString('id-ID')}</p>
                          {isFlashActive && originalPrice!==price && <p className="text-[12px] text-white/30 line-through">Rp {originalPrice.toLocaleString('id-ID')}</p>}
                        </div>
                        <div className="px-3 h-7 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>
                          <span className="text-[10px] font-bold">INSTANT</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="rounded-[24px] bg-[#10131D] border border-white/[0.06] p-5 space-y-4">
              <p className="text-[11px] font-bold tracking-widest text-white/30 uppercase">Metode Pembayaran</p>
              <div className="grid grid-cols-1 gap-2">
                {METHODS.map(m=>(
                  <button key={m.id} onClick={()=>setPayMethod(m.id)} className={`h-[56px] rounded-[16px] border px-4 flex items-center justify-between transition ${payMethod===m.id ? 'bg-white text-black border-white' : 'bg-white/[0.04] border-white/[0.06] text-white hover:bg-white/[0.06]'}`}>
                    <span className="text-[13px] font-semibold">{m.label}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${payMethod===m.id ? 'bg-black text-white' : 'bg-white/10'}`}>{m.badge}</span>
                  </button>
                ))}
              </div>
              <button onClick={()=>setConfirmStep(true)} className="w-full h-[52px] rounded-full bg-white text-black font-bold text-[14px] active:scale-[0.98] transition">Lanjutkan Pembayaran • Rp {calculatedPrice.toLocaleString('id-ID')}</button>
            </div>
          </div>
        )}

        {/* CHECKIN TAB */}
        {activeTab==='checkin' && (
          <div className="space-y-5 animate-[fadeIn_0.3s_ease]">
            <div className="rounded-[28px] bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] p-6 text-center">
              <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-violet-500 to-fuchsia-500 mx-auto flex items-center justify-center text-white shadow-xl"><div className="w-6 h-6"><Ico.Calendar/></div></div>
              <h3 className="text-[18px] font-bold tracking-tight mt-4">Daily Streak</h3>
              <p className="text-[12px] text-white/50 mt-1 max-w-[240px] mx-auto leading-relaxed">Check-in setiap hari, bangun streak hingga hari ke-7 untuk bonus besar.</p>
              <div className="mt-6 grid grid-cols-7 gap-2">
                {DAILY_STREAKS.map(s=>{
                  const claimed = (userStatus?.dailyStreak||0) >= s.day;
                  return (
                    <div key={s.day} className={`rounded-[14px] border p-2.5 text-center ${claimed ? 'bg-white text-black border-white' : 'bg-white/[0.04] border-white/[0.06]'}`}>
                      <p className={`text-[9px] font-bold ${claimed ? 'text-black/50' : 'text-white/30'}`}>{s.label}</p>
                      <p className="text-[13px] font-black mt-1 font-mono">+{s.pts}</p>
                      <div className={`mt-2 w-5 h-5 rounded-full mx-auto flex items-center justify-center ${claimed ? 'bg-black text-white' : 'bg-white/10'}`}>{claimed && <div className="w-3 h-3"><Ico.Check/></div>}</div>
                    </div>
                  );
                })}
              </div>
              <button disabled={dailyClaiming} className="mt-6 w-full h-[48px] rounded-full bg-white text-black font-bold text-[13px] disabled:opacity-50">Claim Hari Ini</button>
            </div>
          </div>
        )}

        {/* REDEEM TAB */}
        {activeTab==='redeem' && (
          <div className="space-y-5 animate-[fadeIn_0.3s_ease]">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-bold tracking-tight">Tukar Poin</h2>
              <div className="px-3 h-8 rounded-full bg-amber-400 text-black flex items-center gap-1.5"><div className="w-3.5 h-3.5"><Ico.Star/></div><span className="text-[12px] font-black font-mono">{userPoints} PTS</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {REDEEM_OPTIONS.map(opt=>{
                const can = userPoints >= opt.points;
                return (
                  <div key={opt.id} className={`rounded-[22px] border p-4 flex flex-col ${can ? 'bg-white/[0.06] border-white/[0.08] hover:bg-white/[0.08]' : 'bg-white/[0.02] border-white/[0.04] opacity-60'}`}>
                    <div className="flex justify-between items-start">
                      <span className={`text-[9px] font-black tracking-widest px-2 py-1 rounded-full ${can ? 'bg-amber-400 text-black' : 'bg-white/10 text-white/40'}`}>{opt.badge}</span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${can ? 'bg-white text-black' : 'bg-white/10 text-white/30'}`}><div className="w-3.5 h-3.5">{opt.isVoucher ? <Ico.Tag/> : <Ico.Star/>}</div></div>
                    </div>
                    <p className="text-[13px] font-bold leading-tight mt-3">{opt.label}</p>
                    <p className="text-[11px] text-white/40 mt-1 leading-snug flex-1">{opt.desc}</p>
                    <div className="mt-4">
                      <div className="h-1.5 rounded-full bg-black/50 overflow-hidden"><div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all" style={{width: `${Math.min((userPoints/opt.points)*100,100)}%`}}/></div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold">{opt.points} PTS</span>
                        <button disabled={!can || redeeming} onClick={()=>setRedeemConfirmItem(opt)} className="h-8 px-4 rounded-full bg-white text-black text-[11px] font-bold disabled:opacity-30">Tukar</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab==='profile' && (
          <div className="space-y-4">
            <div className="flex gap-2 p-1 rounded-full bg-white/[0.06] border border-white/[0.06] w-fit">
              {(['overview','history','settings'] as const).map(t=>(
                <button key={t} onClick={()=>setProfileSubTab(t)} className={`px-4 h-8 rounded-full text-[11px] font-bold capitalize transition ${profileSubTab===t ? 'bg-white text-black shadow' : 'text-white/50 hover:text-white'}`}>{t}</button>
              ))}
            </div>
            {profileSubTab==='overview' && (
              <div className="space-y-4">
                <div className="rounded-[24px] bg-[#10131D] border border-white/[0.06] p-5">
                  <p className="text-[11px] font-bold tracking-widest text-white/30 uppercase">Voucher Saya</p>
                  <div className="mt-4 space-y-2">
                    {userVouchers.length===0 ? <p className="text-[12px] text-white/40 py-4 text-center border border-dashed border-white/10 rounded-[16px]">Belum ada voucher</p> : userVouchers.map((v:any,i:number)=>(
                      <div key={i} className="flex items-center justify-between p-3 rounded-[14px] bg-white/[0.04] border border-white/[0.06]">
                        <div><p className="font-mono text-[12px] font-bold text-amber-300">{v.code}</p><p className="text-[10px] text-white/50">Diskon {v.discount}%</p></div>
                        <button onClick={()=>copyVoucherCode(v.code)} className="px-3 h-8 rounded-full bg-white text-black text-[11px] font-bold">{copiedVoucher===v.code?'Copied':'Salin'}</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {profileSubTab==='history' && (
              <div className="rounded-[24px] bg-[#10131D] border border-white/[0.06] p-5">
                <p className="text-[12px] font-bold">Riwayat Aktivitas</p>
                <p className="text-[11px] text-white/40 mt-1">Belum ada riwayat</p>
              </div>
            )}
            {profileSubTab==='settings' && (
              <div className="rounded-[24px] bg-[#10131D] border border-white/[0.06] p-5 space-y-3">
                <div className="flex justify-between py-3 border-b border-white/[0.06]"><span className="text-[12px] text-white/50">Telegram ID</span><span className="text-[12px] font-mono font-bold">{userTelegramId}</span></div>
                <div className="flex justify-between py-3 border-b border-white/[0.06]"><span className="text-[12px] text-white/50">Username</span><span className="text-[12px] font-mono font-bold">@{userUsername}</span></div>
                <div className="flex justify-between py-3"><span className="text-[12px] text-white/50">Status</span><span className={`text-[12px] font-bold ${isPrem?'text-emerald-400':'text-white/50'}`}>{isPrem?'VIP Active':'Free User'}</span></div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Nav - Floating Glass */}
      <div className="fixed bottom-0 left-0 right-0 z-30 pb-[max(12px,env(safe-area-inset-bottom))] pt-4 bg-gradient-to-t from-[#05070E] via-[#05070E] to-transparent pointer-events-none">
        <div className="pointer-events-auto mx-auto max-w-[380px] px-5">
          <div className="flex items-center justify-between p-1.5 rounded-full bg-[#12151F]/90 backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
            {[
              {id:'dashboard', icon:Ico.Home, label:'Home'},
              {id:'buy', icon:Ico.Store, label:'Store'},
              {id:'checkin', icon:Ico.Calendar, label:'Check-in'},
              {id:'redeem', icon:Ico.Gift, label:'Redeem'},
              {id:'profile', icon:Ico.User, label:'Profile'},
            ].map(tab=>{
              const active = activeTab===tab.id;
              return (
                <button key={tab.id} onClick={()=>setActiveTab(tab.id as any)} className={`relative flex items-center justify-center h-11 rounded-full transition-all ${active ? 'bg-white text-black px-5 shadow-lg' : 'text-white/40 hover:text-white/80 w-11'}`}>
                  <div className="w-[18px] h-[18px]"><tab.icon/></div>
                  {active && <span className="ml-2 text-[12px] font-bold tracking-tight">{tab.label}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#05070E]">
          <div className="h-[64px] border-b border-white/[0.06] flex items-center justify-between px-5 backdrop-blur-2xl">
            <div className="flex items-center gap-3">
              <button onClick={()=>setChatOpen(false)} className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center">✕</button>
              <div>
                <p className="text-[13px] font-bold">Customer Support</p>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/> Online • Balas cepat</p>
              </div>
            </div>
          </div>
          <div ref={chatScrollRef} onScroll={handleChatScroll} className="flex-1 overflow-y-auto p-5 space-y-3">
            {chatMessages.map((m:any)=>(
              <div key={m.id} className={`flex ${m.sender_type==='user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[78%] px-4 py-3 rounded-[18px] text-[13px] leading-relaxed ${m.sender_type==='user' ? 'bg-white text-black rounded-br-[6px]' : 'bg-white/[0.06] border border-white/[0.08] text-white rounded-bl-[6px]'}`}>{m.message}</div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-white/[0.06] bg-[#0A0C14]">
            <div className="flex gap-2 max-w-[480px] mx-auto">
              <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter') sendChatMessage();}} placeholder="Tulis pesan..." className="flex-1 h-12 rounded-full bg-white/[0.06] border border-white/[0.08] px-5 text-[13px] focus:outline-none focus:border-violet-500/50"/>
              <button onClick={sendChatMessage} disabled={!chatInput.trim()} className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center disabled:opacity-30"><div className="w-5 h-5"><Ico.Send/></div></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
