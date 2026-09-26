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
      if (diff <= 0) { setTimeLeft(null); } else {
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

function IcoHome() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>); }
function IcoStore() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="2" x2="12" y2="22"/></svg>); }
function IcoGift() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>); }
function IcoCopy() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>); }
function IcoCheck() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>); }
function IcoLock() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>); }
function IcoShare() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>); }
function IcoRefresh() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15"/></svg>); }
function IcoUpload() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>); }
function IcoTag() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>); }
function IcoStar() { return (<svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>); }
function IcoZap() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>); }
function IcoZoom() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>); }
function IcoDownload() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>); }
function IcoShieldCheck() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>); }
function IcoCalendar() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>); }
function IcoCrown() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M2 4l3 12h14l3-12-6 7-4-8-4 8-6-7z"/><path d="M3 20h18"/></svg>); }
function IcoTrophy() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M17 5h3a2 2 0 0 1 2 2 5 5 0 0 1-5 5M7 5H4a2 2 0 0 0-2 2 5 5 0 0 0 5 5"/></svg>); }
function IcoUsers() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>); }
function IcoClock() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>); }
function IcoTarget() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>); }
function IcoSend() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M22 2 11 13" /><path d="M22 2 15 22 11 13 2 9z" /></svg>); }
function IcoChat() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>); }
function IcoUserCircle() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M6.5 19a5.5 5.5 0 0 1 11 0"/></svg>); }

export default function StoreUI() {
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
    const interval = setInterval(() => { setTickerIndex((prev) => (prev + 1) % RECENT_PURCHASES.length); }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam === 'buy') setActiveTab('buy');
      else if (tabParam === 'checkin') setActiveTab('checkin');
      else if (tabParam === 'redeem') setActiveTab('redeem');
      else if (tabParam === 'profile') setActiveTab('profile');
      if ((window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp;
        tg.ready(); tg.expand();
        tg.setHeaderColor('#07050F');
        tg.setBackgroundColor('#07050F');
        const raw = tg.initData || '';
        const user = tg.initDataUnsafe?.user;
        setInitData(raw); setTgUser(user);
        checkStatus(raw);
      } else { checkStatus(''); }
    }
  }, []);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3800);
  };

  const scrollChatToBottom = (smooth = true) => {
    const el = chatScrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  };

  const handleChatScroll = () => {
    const el = chatScrollRef.current;
    if (!el) return;
    chatUserNearBottomRef.current = (el.scrollHeight - el.scrollTop - el.clientHeight) < 120;
  };

  const loadChat = async (raw: string) => {
    if (!raw) return;
    setChatLoading(true); setChatError(null);
    try {
      const res = await fetch(`/api/chat?initData=${encodeURIComponent(raw)}&t=${Date.now()}`, { cache: 'no-store' });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Gagal memuat chat');
      setChatConversation(d.conversation);
      setChatMessages(d.messages || []);
      setChatUnread(d.conversation?.unread_by_user || 0);
      setTimeout(() => scrollChatToBottom(false), 50);
    } catch (err: any) { setChatError(err?.message || 'Gagal memuat chat. Coba lagi.'); }
    finally { setChatLoading(false); }
  };

  const sendChatMessage = async () => {
    const text = chatInput.trim();
    if (!text || chatSending || !initData) return;
    setChatSending(true); setChatInput('');
    const tempId = `temp-${Date.now()}`;
    setChatMessages((prev) => [...prev, { id: tempId, sender_type: 'user', message: text, created_at: new Date().toISOString(), _pending: true }]);
    chatUserNearBottomRef.current = true;
    setTimeout(() => scrollChatToBottom(true), 30);
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initData, text }) });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Gagal mengirim pesan');
      if (d.message) {
        setChatMessages((prev) => {
          const withoutTemp = prev.filter((m) => m.id !== tempId);
          return withoutTemp.some((m) => m.id === d.message.id) ? withoutTemp : [...withoutTemp, d.message];
        });
      }
    } catch (err: any) {
      showToast('error', err?.message || 'Gagal mengirim pesan');
      setChatMessages((prev) => prev.map((m) => (m.id === tempId ? { ...m, _failed: true, _pending: false } : m)));
      setChatInput(text);
    } finally { setChatSending(false); }
  };

  const markChatRead = async (raw: string) => {
    if (!raw) return;
    try {
      await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initData: raw, action: 'mark_read' }) });
      setChatUnread(0);
    } catch {}
  };

  useEffect(() => { if (initData) loadChat(initData); }, [initData]);
  useEffect(() => { if (chatOpen && initData && chatUnread > 0) markChatRead(initData); }, [chatOpen]);

  useEffect(() => {
    if (!chatConversation?.id) return;
    const channel = supabase.channel(`user-chat-${chatConversation.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `conversation_id=eq.${chatConversation.id}` }, (payload: any) => {
        const newMsg = payload.new;
        setChatMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          if (newMsg.sender_type === 'user') {
            const tempIdx = prev.findIndex((m) => m._pending && m.sender_type === 'user' && m.message === newMsg.message);
            if (tempIdx !== -1) { const next = prev.slice(); next[tempIdx] = newMsg; return next; }
          }
          return [...prev, newMsg];
        });
        if (newMsg.sender_type === 'owner' || newMsg.sender_type === 'ai') {
          if (chatOpen && chatUserNearBottomRef.current) { setTimeout(() => scrollChatToBottom(true), 30); markChatRead(initData); }
          else if (!chatOpen) setChatUnread((u) => u + 1);
        } else if (chatUserNearBottomRef.current) setTimeout(() => scrollChatToBottom(true), 30);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chat_conversations', filter: `id=eq.${chatConversation.id}` }, (payload: any) => {
        setChatConversation((prev: any) => ({ ...prev, ...payload.new }));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [chatConversation?.id, chatOpen]);

  const checkStatus = async (raw: string) => {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/store?t=${Date.now()}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store', body: JSON.stringify({ initData: raw, action: 'check_status' }) });
      const d = await res.json();
      if (res.ok) {
        if (d.isAdmin) { router.push('/admin'); return; }
        setUserStatus(d.user); setPending(d.pendingOrder); setFlashSale(d.flashSale); setBadge(d.badge || null);
      } else if (res.status === 403) { showToast('error', d.error || 'Akun Anda telah diblokir!'); setUserStatus({ status: 'BANNED' }); }
    } finally { setLoading(false); setRefreshing(false); }
  };

  const claimDailyBonus = async () => {
    if (dailyClaiming) return;
    setDailyClaiming(true);
    try {
      const res = await fetch('/api/store', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initData, action: 'daily_checkin' }) });
      const d = await res.json();
      if (res.ok) { showToast('success', d.message || 'Berhasil klaim bonus harian +10 Poin!'); checkStatus(initData); }
      else showToast('error', d.error || 'Gagal klaim bonus harian');
    } finally { setDailyClaiming(false); }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { showToast('error', 'Ukuran foto maksimal 10MB'); return; }
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas'); const maxDim = 800;
          let width = img.width; let height = img.height;
          if (width > height && width > maxDim) { height = Math.round((height * maxDim) / width); width = maxDim; }
          else if (height > maxDim) { width = Math.round((width * maxDim) / height); height = maxDim; }
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext('2d'); ctx?.drawImage(img, 0, 0, width, height);
          setProofImage(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const submit = async () => {
    if (!proofImage || !proofNote.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/store', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initData, action: 'submit_order', packageId: selectedPkg, proofNote, proofImage }) });
      const data = await res.json();
      if (res.ok) { setPending(true); setActiveTab('dashboard'); setConfirmStep(false); setProofNote(''); setProofImage(null); showToast('success', 'Pesanan dikirim! Admin akan memverifikasi.'); checkStatus(initData); }
      else showToast('error', data.error || 'Gagal mengirim pesanan');
    } finally { setSubmitting(false); }
  };

  const handleClaimVoucher = async () => {
    if (!claimInputCode.trim() || claiming) return;
    setClaiming(true);
    try {
      const res = await fetch('/api/store', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initData, action: 'claim_voucher', voucherCode: claimInputCode }) });
      const data = await res.json();
      if (res.ok) {
        const quotaNote = data.dailyLimit ? ` (Sisa kuota hari ini: ${data.remainingToday}/${data.dailyLimit})` : '';
        showToast('success', (data.message || 'Kode promo berhasil diklaim!') + quotaNote); setClaimInputCode(''); checkStatus(initData);
      } else showToast('error', data.error || 'Kode promo tidak valid');
    } finally { setClaiming(false); }
  };

  const executeRedeem = async () => {
    if (!redeemConfirmItem || redeeming) return;
    const { points, days, isVoucher } = redeemConfirmItem;
    if ((userStatus?.points || 0) < points) { showToast('error', 'Poin Anda tidak mencukupi untuk item ini'); setRedeemConfirmItem(null); return; }
    setRedeeming(true);
    try {
      const res = await fetch('/api/store', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initData, action: 'redeem_points', pointsToRedeem: points, daysToAdd: days, isVoucher }) });
      if (res.ok) { showToast('success', isVoucher ? 'Voucher diskon berhasil dibuat!' : `Masa VIP bertambah +${days} Hari!`); setRedeemConfirmItem(null); checkStatus(initData); }
      else { const err = await res.json(); showToast('error', err.error || 'Gagal menukarkan poin'); }
    } finally { setRedeeming(false); }
  };

  const copyReferral = () => {
    const telegramUserId = tgUser?.id || userStatus?.telegramId;
    if (!telegramUserId) return;
    navigator.clipboard.writeText(`https://t.me/fixeedredbot?start=ref_${telegramUserId}`);
    setCopied(true); setTimeout(() => setCopied(false), 3000);
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/store', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initData, action: 'get_history' }) });
      const d = await res.json();
      if (res.ok) setHistory(d.history || []);
    } finally { setHistoryLoading(false); }
  };

  const fetchLeaderboard = async () => {
    setLeaderboardLoading(true);
    try {
      const res = await fetch('/api/store', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initData, action: 'get_leaderboard' }) });
      const d = await res.json();
      if (res.ok) { setLeaderboard(d.leaderboard || []); setMyRank(d.myRank || null); setTotalPlayers(d.totalPlayers || 0); }
    } finally { setLeaderboardLoading(false); }
  };

  const fetchReferrals = async () => {
    try {
      const res = await fetch('/api/store', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initData, action: 'get_referrals' }) });
      const d = await res.json();
      if (res.ok) setReferredUsers(d.referredUsers || []);
    } catch {}
  };

  useEffect(() => {
    if (activeTab === 'profile' && initData) { fetchReferrals(); if (profileSubTab === 'history') fetchHistory(); }
  }, [activeTab, profileSubTab, initData]);

  useEffect(() => { if (activeTab === 'dashboard' && initData) fetchLeaderboard(); }, [activeTab, initData]);

  const shareToTelegram = () => {
    const telegramUserId = tgUser?.id || userStatus?.telegramId;
    if (!telegramUserId) return;
    const refUrl = `https://t.me/fixeedredbot?start=ref_${telegramUserId}`;
    window.open(`https://t.me/share/url?url=${refUrl}&text=${encodeURIComponent(`Nikmati VIP Store & Bonus Poin Gratis di WALZSHOP! ${refUrl}`)}`, '_blank');
  };

  const copyVoucherCode = (code: string) => { navigator.clipboard.writeText(code); setCopiedVoucher(code); setTimeout(() => setCopiedVoucher(null), 3000); };
  const copyPayNumber = (text: string) => { navigator.clipboard.writeText(text); setCopiedNum(text); setTimeout(() => setCopiedNum(null), 3000); };
  const downloadQrisImage = () => {
    const link = document.createElement('a'); link.href = QRIS_IMAGE_URL; link.download = 'QRIS_WALZSHOP.jpg'; link.target = '_blank';
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    showToast('success', 'Membuka gambar QRIS untuk diunduh...');
  };

  const isBanned = userStatus?.status === 'BANNED';
  const isPrem = userStatus?.status === 'ACTIVE' && userStatus?.expiredAt && new Date(userStatus?.expiredAt).getTime() > Date.now();
  const countdown = useCountdown(isPrem ? userStatus?.expiredAt : null);
  const isFlashActive = flashSale && flashSale.active && new Date(flashSale.expiresAt).getTime() > Date.now();
  const flashDiscount = isFlashActive ? (flashSale.discountPercent || 0) : 0;
  const lastCheckinTime = userStatus?.lastCheckin ? new Date(userStatus.lastCheckin).getTime() : 0;
  const canCheckin = Date.now() - lastCheckinTime >= 24 * 60 * 60 * 1000;
  const rawStreak = userStatus?.checkinStreak || 0;
  const checkinStreak = !canCheckin ? Math.max(1, rawStreak) : rawStreak;

  // ────────────────────────── LOADING ──────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-[#07050F] flex flex-col items-center justify-center p-4">
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-violet-500/20 border-t-violet-400 animate-spin" style={{ animationDuration: '1s' }} />
          <div className="absolute inset-2 rounded-full border border-fuchsia-500/15 border-b-fuchsia-400 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-violet-700 flex items-center justify-center text-white font-black text-lg shadow-[0_0_30px_rgba(139,92,246,0.6)]">W</div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs font-black tracking-[0.25em] uppercase grad-violet">WALZSHOP</p>
          <p className="text-[10px] text-violet-400/60 font-medium">Memuat portal...</p>
        </div>
        <div className="flex gap-1.5 mt-1">
          {[0,1,2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-500/60 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </div>
    </div>
  );

  // ────────────────────────── BANNED ──────────────────────────
  if (isBanned) return (
    <div className="min-h-screen bg-[#07050F] text-slate-100 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-[#1A0910] to-[#0F0508] p-6 rounded-[28px] max-w-xs w-full text-center space-y-4 border border-rose-500/30 shadow-[0_0_60px_rgba(244,63,94,0.15)]">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(244,63,94,0.2)]">
          <div className="w-7 h-7"><IcoLock/></div>
        </div>
        <div>
          <h2 className="text-sm font-black text-white uppercase tracking-wider">Akun Diblokir</h2>
          <p className="text-[11px] text-slate-400 leading-relaxed mt-1.5">Akun Telegram Anda telah diblokir. Hubungi admin jika terjadi kesalahan.</p>
        </div>
      </div>
    </div>
  );

  const rawPkg = PACKAGES.find((p: any) => p.id === selectedPkg) || PACKAGES[0] || { id: '3D', days: 3, price: 2000, label: '3 Hari' };
  const calculatedPrice = isFlashActive ? Math.max(0, Math.floor(rawPkg.price * (1 - flashDiscount / 100))) : rawPkg.price;
  const pkg = { ...rawPkg, price: calculatedPrice };
  const displayName = tgUser ? [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ') : userStatus?.profile?.firstName || 'Exploit';
  const userUsername = tgUser?.username || userStatus?.profile?.username || 'exploit_user';
  const userTelegramId = tgUser?.id || userStatus?.telegramId || '8884003270';
  const initials = displayName?.[0]?.toUpperCase() || 'E';
  const userPoints = userStatus?.points || 0;
  const userVouchers = userStatus?.vouchers || [];

  // ────────────────────────── MAIN UI ──────────────────────────
  return (
    <div className="min-h-screen bg-[#07050F] text-slate-100 font-sans relative overflow-x-hidden pb-36 selection:bg-violet-500/30">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass { backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes toastSlide {
          0% { transform: translateY(-100%) scale(0.9); opacity: 0; }
          60% { transform: translateY(6px) scale(1.02); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.88) translateY(8px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes orb1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(3%,5%) scale(1.08); }
          66% { transform: translate(-2%,2%) scale(0.96); }
        }
        @keyframes orb2 {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(-4%,-3%) scale(1.06); }
          66% { transform: translate(2%,-2%) scale(0.97); }
        }
        @keyframes orb3 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(4%,-4%) scale(1.05); }
        }
        @keyframes shimSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        @keyframes tickIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes navPop {
          0% { transform: scale(0.9); }
          60% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        .ticket-divider { border-top: 2px dashed rgba(139,92,246,0.25); }
        .ticket-notch { width: 14px; height: 14px; background-color: #07050F; border-radius: 50%; position: absolute; top: 50%; transform: translateY(-50%); }
        .ticket-notch.left { left: -7px; }
        .ticket-notch.right { right: -7px; }
        .grad-text-v { background: linear-gradient(135deg,#C4B5FD,#F0ABFC); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
        .grad-text-g { background: linear-gradient(135deg,#FDE68A,#F59E0B); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
        .grad-text-e { background: linear-gradient(135deg,#6EE7B7,#10B981); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
      `}</style>

      {/* ── Ambient Orbs ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[15%] w-[80vw] h-[80vw] bg-violet-700/10 rounded-full blur-[130px]" style={{ animation: 'orb1 12s ease-in-out infinite' }} />
        <div className="absolute -bottom-[25%] -right-[15%] w-[70vw] h-[70vw] bg-fuchsia-700/8 rounded-full blur-[130px]" style={{ animation: 'orb2 15s ease-in-out infinite' }} />
        <div className="absolute top-[35%] right-[5%] w-[50vw] h-[50vw] bg-cyan-700/5 rounded-full blur-[110px]" style={{ animation: 'orb3 18s ease-in-out infinite' }} />
      </div>

      {/* ── Toast ── */}
      {toastMsg && (
        <div className="fixed top-3 left-0 right-0 z-[100] px-4 pointer-events-none flex justify-center">
          <div className={`pointer-events-auto w-full max-w-[360px] p-3.5 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.9)] flex items-center gap-3 border backdrop-blur-2xl`}
            style={{ animation: 'toastSlide 0.4s cubic-bezier(0.16,1,0.3,1)', background: toastMsg.type === 'success' ? 'rgba(15,8,28,0.97)' : 'rgba(25,5,10,0.97)', borderColor: toastMsg.type === 'success' ? 'rgba(139,92,246,0.5)' : 'rgba(244,63,94,0.5)' }}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${toastMsg.type === 'success' ? 'bg-violet-500/15 text-violet-300 border-violet-500/30' : 'bg-rose-500/15 text-rose-300 border-rose-500/30'}`}>
              <div className="w-4 h-4">{toastMsg.type === 'success' ? <IcoCheck/> : <IcoLock/>}</div>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[9px] font-black uppercase tracking-widest ${toastMsg.type === 'success' ? 'text-violet-400' : 'text-rose-400'}`}>{toastMsg.type === 'success' ? 'Berhasil' : 'Perhatian'}</p>
              <p className="text-xs font-bold text-slate-100 leading-snug truncate mt-0.5">{toastMsg.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 glass bg-[#07050F]/85 border-b border-violet-500/10 px-4 py-3 max-w-md mx-auto flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-violet-700 flex items-center justify-center text-white font-black text-sm shadow-[0_0_20px_rgba(139,92,246,0.45)] ring-1 ring-violet-400/25">W</div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#07050F] shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs font-black tracking-tight grad-text-v">WALZSHOP</h1>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[9px] text-violet-400/60 font-bold mt-0.5">Digital Store Portal</p>
          </div>
        </div>
        <button onClick={() => checkStatus(initData)} disabled={refreshing} className={`w-9 h-9 rounded-2xl bg-violet-500/8 border border-violet-500/15 flex items-center justify-center text-violet-300 hover:bg-violet-500/15 active:scale-90 transition-all ${refreshing ? 'animate-spin text-violet-400' : ''}`}>
          <div className="w-4 h-4"><IcoRefresh/></div>
        </button>
      </header>

      {/* ── Main ── */}
      <main className="px-4 pt-3.5 max-w-md mx-auto space-y-3.5 relative z-10">

        {/* Ticker */}
        <div className="bg-[#120F1E] border border-violet-500/20 px-3.5 py-2.5 rounded-2xl flex items-center gap-2.5 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-[8px] font-black text-violet-400 uppercase tracking-wider">Live</span>
          </div>
          <p className="text-[10px] font-bold text-slate-300 truncate" key={tickerIndex} style={{ animation: 'tickIn 0.35s ease-out' }}>{RECENT_PURCHASES[tickerIndex]}</p>
        </div>

        {/* Flash Sale */}
        {isFlashActive && (
          <div className="relative rounded-[24px] overflow-hidden border border-fuchsia-500/25 shadow-[0_8px_30px_rgba(217,70,239,0.12)]" style={{ background: 'linear-gradient(135deg,#1A0D1F 0%,#0F0915 50%,#150C1A 100%)' }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.06) 0%,rgba(217,70,239,0.06) 100%)' }} />
            <div className="relative p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-rose-500 flex items-center justify-center text-white shadow-[0_4px_14px_rgba(217,70,239,0.4)]">
                  <div className="w-4.5 h-4.5"><IcoZap/></div>
                </div>
                <div>
                  <p className="text-xs font-black text-white leading-none">FLASH SALE EVENT</p>
                  <p className="text-[10px] text-fuchsia-300 font-bold mt-0.5">Diskon -{flashDiscount}% Semua Paket VIP</p>
                </div>
              </div>
              <span className="px-3 py-1.5 bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white font-black text-[9px] rounded-xl shadow-lg shadow-fuchsia-500/30 animate-pulse">
                -{flashDiscount}% OFF
              </span>
            </div>
          </div>
        )}

        {/* Pending */}
        {pending && (
          <div className="bg-[#1A1208]/80 border border-amber-500/35 p-3.5 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <p className="text-amber-200 text-xs font-bold">Transaksi sedang diverifikasi Admin...</p>
          </div>
        )}

        {/* ════════════════ DASHBOARD TAB ════════════════ */}
        {activeTab === 'dashboard' && (
          <div className="space-y-3.5" style={{ animation: 'fadeInUp 0.3s ease-out' }}>

            {/* Profile Card */}
            <div className="relative rounded-[24px] overflow-hidden border border-violet-500/20 shadow-[0_8px_40px_rgba(0,0,0,0.6)]" style={{ background: 'linear-gradient(155deg,#120F1E 0%,#0D0A18 100%)' }}>
              <div className="absolute top-0 right-0 w-40 h-40 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-fuchsia-600/6 rounded-full blur-2xl pointer-events-none" />
              <div className="relative p-4 space-y-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 shrink-0 rounded-2xl p-0.5 shadow-[0_0_20px_rgba(139,92,246,0.4)]" style={{ background: 'linear-gradient(135deg,#8B5CF6,#D946EF,#8B5CF6)' }}>
                    <div className="w-full h-full rounded-[13px] bg-[#0D0A18] flex items-center justify-center font-black text-white text-lg overflow-hidden">
                      {tgUser?.photo_url ? <img src={tgUser.photo_url} className="w-full h-full object-cover" alt="" /> : initials}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-black text-white truncate leading-tight">{displayName}</h2>
                    {userUsername && <p className="text-[11px] font-bold text-violet-400 mt-0.5">@{userUsername}</p>}
                    <p className="text-[9px] text-slate-500 font-mono mt-0.5">ID: {userTelegramId}</p>
                  </div>
                  <div className={`shrink-0 px-2.5 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-wider border ${isPrem ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.15)]' : 'bg-white/5 text-slate-400 border-white/8'}`}>
                    {isPrem ? '✦ VIP' : 'FREE'}
                  </div>
                </div>

                {isPrem && countdown && (
                  <div className="pt-3 border-t border-violet-500/10">
                    <p className="text-[8px] font-black text-violet-400/70 uppercase tracking-widest mb-2 text-center">Sisa Masa Aktif VIP</p>
                    <div className="flex justify-center gap-2">
                      {[
                        { val: countdown.days, unit: 'Hari' },
                        { val: String(countdown.hours).padStart(2,'0'), unit: 'Jam' },
                        { val: String(countdown.minutes).padStart(2,'0'), unit: 'Menit' },
                        { val: String(countdown.seconds).padStart(2,'0'), unit: 'Detik' },
                      ].map((t, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-xl bg-[#07050F] border border-violet-500/15 flex items-center justify-center font-black text-base font-mono text-violet-200 shadow-inner">
                            {t.val}
                          </div>
                          <p className="text-[7px] text-slate-500 font-bold mt-1 uppercase tracking-wider">{t.unit}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Status Bot', val: 'Online 24/7', color: 'text-emerald-400', dot: true },
                { label: 'Saldo Poin', val: `${userPoints} PTS`, color: 'text-amber-400', dot: false },
                { label: 'Streak', val: `${checkinStreak} Hari`, color: 'text-violet-300', dot: false },
              ].map((s, i) => (
                <div key={i} className="bg-[#120F1E] border border-violet-500/10 rounded-2xl p-3 text-center space-y-1 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                  <p className="text-[8px] text-slate-500 font-black uppercase tracking-wider">{s.label}</p>
                  <div className="flex items-center justify-center gap-1">
                    {s.dot && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />}
                    <span className={`font-black text-[11px] ${s.color}`}>{s.val}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code */}
            <div className="bg-[#120F1E] p-4 rounded-[22px] space-y-3 border border-violet-500/20 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 text-violet-400 shrink-0"><IcoTag/></div>
                <p className="text-xs font-black text-white">Klaim Kode Promo / Voucher</p>
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="MASUKKAN KODE VOUCHER..." value={claimInputCode} onChange={e => setClaimInputCode(e.target.value)}
                  className="flex-1 bg-[#0A0815] border border-violet-500/15 text-white placeholder-slate-600 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase focus:outline-none focus:border-violet-500/50 transition-all" />
                <button onClick={handleClaimVoucher} disabled={claiming || !claimInputCode.trim()}
                  className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black text-xs uppercase tracking-wider rounded-xl active:scale-95 disabled:opacity-40 transition-all shadow-[0_4px_16px_rgba(139,92,246,0.35)]">
                  {claiming ? '...' : 'Klaim'}
                </button>
              </div>
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { setActiveTab('buy'); setConfirmStep(false); }}
                className="bg-[#120F1E] p-4 rounded-[22px] text-left border border-violet-500/20 hover:border-violet-500/40 active:scale-95 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)] group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white flex items-center justify-center mb-3 shadow-[0_4px_14px_rgba(139,92,246,0.4)] group-hover:shadow-[0_4px_20px_rgba(139,92,246,0.55)] transition-all">
                  <div className="w-5 h-5"><IcoStore/></div>
                </div>
                <p className="text-xs font-black text-white">VIP Store</p>
                <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Beli paket langganan</p>
              </button>
              <button onClick={() => setActiveTab('checkin')}
                className="bg-[#120F1E] p-4 rounded-[22px] text-left border border-amber-500/20 hover:border-amber-500/40 active:scale-95 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)] group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center mb-3 shadow-[0_4px_14px_rgba(245,158,11,0.35)] group-hover:shadow-[0_4px_20px_rgba(245,158,11,0.5)] transition-all">
                  <div className="w-5 h-5"><IcoCalendar/></div>
                </div>
                <p className="text-xs font-black text-white">Daily Check-in</p>
                <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Klaim poin tiap 24 jam</p>
              </button>
            </div>

            {/* Leaderboard */}
            <div className="bg-[#120F1E] border border-amber-500/20 rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
              <div className="p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 shadow-[0_4px_14px_rgba(245,158,11,0.4)]">
                      <div className="w-4.5 h-4.5"><IcoTrophy/></div>
                    </div>
                    <div>
                      <h2 className="text-xs font-black text-white">Papan Skor Poin</h2>
                      <p className="text-[10px] text-slate-500">Top 10 dari {totalPlayers} pemain aktif</p>
                    </div>
                  </div>
                  {myRank && (
                    <div className="text-right">
                      <p className="text-[8px] text-slate-500 font-black uppercase tracking-wider">Rank Kamu</p>
                      <p className="text-sm font-black grad-text-g font-mono">#{myRank}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  {leaderboardLoading ? (
                    <div className="py-8 text-center"><p className="text-xs text-slate-500">Memuat papan skor...</p></div>
                  ) : leaderboard.length === 0 ? (
                    <div className="py-8 text-center border border-dashed border-violet-500/15 rounded-2xl"><p className="text-xs text-slate-500">Belum ada data</p></div>
                  ) : leaderboard.slice(0, 10).map((p: any, idx: number) => {
                    const rank = idx + 1;
                    const isMe = p.telegramId === userTelegramId?.toString();
                    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;
                    return (
                      <div key={p.telegramId} className={`flex items-center gap-3 p-3 rounded-2xl border ${isMe ? 'bg-violet-500/10 border-violet-500/25' : rank <= 3 ? 'bg-amber-500/5 border-amber-500/15' : 'bg-[#0A0815] border-white/4'}`}>
                        <div className="w-6 text-center shrink-0">
                          {medal ? <span className="text-sm">{medal}</span> : <span className="text-[10px] font-black text-slate-600">#{rank}</span>}
                        </div>
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-md">
                          {(p.firstName || '?')[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-bold truncate ${isMe ? 'text-violet-300' : 'text-slate-200'}`}>{p.firstName}{isMe ? ' (Kamu)' : ''}</p>
                          {p.badge?.label && <p className="text-[9px] text-slate-500">{p.badge.label}</p>}
                        </div>
                        <p className="text-xs font-black text-amber-400 shrink-0 font-mono">{p.points} PTS</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════ CHECKIN TAB ════════════════ */}
        {activeTab === 'checkin' && (
          <div className="space-y-4" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
            <div className="relative rounded-[24px] overflow-hidden border border-amber-500/25 shadow-[0_8px_40px_rgba(0,0,0,0.6)]" style={{ background: 'linear-gradient(155deg,#1A1208 0%,#110D05 50%,#0D0A05 100%)' }}>
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />
              <div className="relative p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(245,158,11,0.45)]">
                  <div className="w-8 h-8 text-slate-950"><IcoCalendar/></div>
                </div>
                <div>
                  <span className="px-3 py-1 bg-amber-500/12 text-amber-300 border border-amber-500/25 text-[9px] font-black rounded-full uppercase tracking-wider inline-block">Daily Check-in Reward</span>
                  <h2 className="text-base font-black text-white mt-2">Absen Harian · Dapat Poin</h2>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">Kumpulkan poin gratis setiap 24 Jam untuk ditukarkan dengan VIP Access gratis.</p>
                </div>
                <div className="bg-[#07050F]/60 border border-amber-500/15 p-4 rounded-2xl flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Status Absen</p>
                    <p className={`text-sm font-black mt-0.5 ${canCheckin ? 'text-amber-400' : 'text-emerald-400'}`}>{canCheckin ? 'Siap Diklaim ✦' : 'Sudah Absen Hari Ini'}</p>
                  </div>
                  <button onClick={claimDailyBonus} disabled={dailyClaiming || !canCheckin}
                    className={`px-5 py-2.5 font-black text-xs uppercase tracking-wider rounded-2xl active:scale-95 transition-all shadow-lg ${canCheckin ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-amber-500/35' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 cursor-not-allowed'}`}>
                    {dailyClaiming ? 'Proses...' : canCheckin ? 'Klaim +10 PTS' : 'Selesai ✓'}
                  </button>
                </div>
              </div>
            </div>

            {/* Streak Grid */}
            <div className="bg-[#120F1E] p-4 rounded-[22px] border border-violet-500/15 space-y-3 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black text-white uppercase tracking-wider">Streak Absen Beruntun</p>
                <span className="text-[9px] text-amber-400 font-bold">+10 PTS / Hari</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {DAILY_STREAKS.map((s) => {
                  const isClaimed = !canCheckin ? s.day <= checkinStreak : s.day < checkinStreak;
                  const isCurrentTarget = canCheckin && s.day === (checkinStreak + 1);
                  return (
                    <div key={s.day} className={`p-3 rounded-2xl text-center border flex flex-col items-center justify-between relative overflow-hidden transition-all min-h-[88px] ${s.day === 7 ? 'col-span-2' : ''} ${
                      s.day === 7 ? 'border-amber-400/40 shadow-[0_0_16px_rgba(245,158,11,0.15)]' : ''} ${
                      isClaimed ? 'bg-violet-500/10 border-violet-500/30' : isCurrentTarget ? 'bg-amber-500/10 border-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.1)]' : 'bg-[#0A0815] border-white/5'
                    }`} style={{ background: s.day === 7 ? 'linear-gradient(135deg,rgba(245,158,11,0.1),rgba(249,115,22,0.08))' : undefined }}>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[8px] font-black uppercase text-slate-500">{s.label}</span>
                        {isClaimed && <div className="w-3.5 h-3.5 text-violet-400 bg-violet-500/20 rounded-full border border-violet-500/30 flex items-center justify-center"><IcoCheck/></div>}
                      </div>
                      <div className={`w-4.5 h-4.5 my-1 ${isClaimed ? 'text-violet-400' : isCurrentTarget ? 'text-amber-400' : 'text-slate-600'}`}><IcoStar/></div>
                      {isClaimed ? <span className="text-[8px] font-black text-violet-400 uppercase">✓ Klaim</span>
                        : isCurrentTarget ? <span className="text-[8px] font-black text-amber-300 uppercase">Hari Ini</span>
                        : <span className="text-[10px] font-black text-slate-500 font-mono">+{s.pts}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════ BUY TAB ════════════════ */}
        {activeTab === 'buy' && (
          <div className="space-y-4" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-white">Beli VIP Access</h2>
                <p className="text-[10px] text-slate-500">Pilih durasi paket langganan</p>
              </div>
              <span className="text-[9px] font-black text-violet-300 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full">Official Store</span>
            </div>

            {isPrem ? (
              <div className="space-y-3.5">
                <div className="relative rounded-[24px] overflow-hidden border border-emerald-500/25 p-6 text-center space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.6)]" style={{ background: 'linear-gradient(155deg,#081A10 0%,#050F09 100%)' }}>
                  <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 flex items-center justify-center mx-auto shadow-[0_0_24px_rgba(16,185,129,0.4)]">
                    <div className="w-7 h-7"><IcoCrown/></div>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/12 border border-emerald-500/25 text-emerald-300 text-[9px] font-black uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Status VIP Aktif
                    </span>
                    <h3 className="text-sm font-black text-white mt-2">Akses VIP Anda Sedang Berjalan</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-xs mx-auto">Pembelian baru akan terbuka saat masa aktif habis.</p>
                  </div>
                  {countdown && (
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      {[{ v: countdown.days, u: 'Hari' }, { v: countdown.hours, u: 'Jam' }, { v: countdown.minutes, u: 'Menit' }].map((t, i) => (
                        <div key={i} className="bg-[#07050F]/60 border border-emerald-500/15 rounded-2xl py-3">
                          <p className="text-lg font-black text-emerald-400 font-mono">{t.v}</p>
                          <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{t.u}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-[#120F1E] p-4 rounded-[22px] border border-white/5 space-y-3">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Keuntungan VIP Aktif</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['Akses Fitur Premium', 'Kecepatan Maksimal', 'Bebas Iklan & Delay', 'Support Prioritas 24/7'].map((f, i) => (
                      <div key={i} className="bg-[#0A0815] p-3 rounded-2xl border border-emerald-500/10 text-emerald-300 text-xs font-bold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />{f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : !confirmStep ? (
              <>
                {/* Benefits */}
                <div className="bg-[#120F1E] p-4 rounded-[22px] border border-violet-500/20 space-y-3 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 text-violet-400"><IcoShieldCheck/></div>
                    <span className="text-xs font-black text-white uppercase tracking-wider">Keuntungan VIP Access</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {['Tanpa Batas Akses', 'Koneksi Cepat & Stabil', 'Bebas Iklan / Delay', 'Dukungan Prioritas'].map((f, i) => (
                      <div key={i} className="bg-[#0A0815] p-3 rounded-2xl border border-violet-500/8 text-violet-200 text-xs font-bold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />{f}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between px-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pilih Paket VIP</p>
                  {isFlashActive && <span className="text-[9px] text-fuchsia-400 font-black bg-fuchsia-500/10 border border-fuchsia-500/20 px-2.5 py-0.5 rounded-full">⚡ Flash Sale</span>}
                </div>

                {/* Package Cards */}
                <div className="grid grid-cols-2 gap-3">
                  {PACKAGES.map((p: any) => {
                    const originalPrice = p.price;
                    const itemPrice = isFlashActive ? Math.max(0, Math.floor(originalPrice * (1 - flashDiscount / 100))) : originalPrice;
                    const isSelected = selectedPkg === p.id;
                    return (
                      <button key={p.id} onClick={() => setSelectedPkg(p.id)}
                        className={`p-4 rounded-[22px] text-left border-2 transition-all active:scale-95 relative overflow-hidden flex flex-col justify-between ${isSelected ? 'border-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.2)]' : 'border-white/8 hover:border-violet-500/20 bg-[#120F1E]'}`}
                        style={isSelected ? { background: 'linear-gradient(155deg,rgba(139,92,246,0.15) 0%,rgba(13,10,24,1) 100%)' } : {}}>
                        {p.id === '30D' && <span className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-orange-500 text-[8px] font-black uppercase text-slate-950 px-2.5 py-1 rounded-bl-2xl">Best Value</span>}
                        {p.id === '20D' && <span className="absolute top-0 right-0 bg-violet-500/15 text-violet-300 text-[8px] font-black uppercase px-2.5 py-0.5 rounded-bl-2xl border-l border-b border-violet-500/25">Hemat</span>}
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-violet-500/20 text-violet-300' : 'bg-white/5 text-slate-500'}`}>
                            <div className="w-3.5 h-3.5"><IcoCrown/></div>
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-100 leading-tight">{p.label}</p>
                            <p className="text-[9px] text-slate-500 mt-0.5">{p.days} Hari VIP</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-2.5 border-t border-white/5 flex items-baseline gap-1.5">
                          <p className="text-sm font-black font-mono grad-text-g">Rp {itemPrice.toLocaleString('id-ID')}</p>
                          {isFlashActive && <p className="text-[9px] text-slate-600 line-through font-mono">Rp {originalPrice.toLocaleString('id-ID')}</p>}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Payment Methods */}
                <div className="bg-[#120F1E] p-4 rounded-[22px] border border-white/6 space-y-3 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Metode Pembayaran</p>
                  <div className="grid grid-cols-3 gap-2">
                    {METHODS.map(m => (
                      <button key={m.id} onClick={() => setPayMethod(m.id)}
                        className={`p-3 rounded-2xl text-center border-2 transition-all active:scale-95 flex flex-col items-center gap-1 ${payMethod === m.id ? 'bg-violet-500/12 border-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.2)]' : 'bg-[#0A0815] border-white/5 text-slate-400'}`}>
                        <span className="text-xs font-black text-white">{m.id}</span>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${payMethod === m.id ? 'bg-violet-500/15 border-violet-500/25 text-violet-300' : 'bg-white/5 border-white/5 text-slate-500'}`}>{m.badge}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={() => setConfirmStep(true)}
                  className="w-full py-4 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 text-white font-black rounded-2xl text-xs uppercase tracking-wider active:scale-[0.98] shadow-[0_8px_24px_rgba(139,92,246,0.4)] hover:brightness-110 transition-all flex items-center justify-center gap-2">
                  Lanjut ke Pembayaran
                  <span className="opacity-50">·</span>
                  <span className="font-mono">Rp {pkg.price.toLocaleString('id-ID')}</span>
                </button>
              </>
            ) : (
              /* ── Payment Form ── */
              <div className="bg-[#120F1E] p-5 rounded-[24px] space-y-4 border border-violet-500/20 shadow-[0_8px_40px_rgba(0,0,0,0.6)]">
                <div className="text-center pb-3.5 border-b border-violet-500/10 space-y-1">
                  <span className="px-3 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[9px] font-black rounded-full inline-block">✓ Konfirmasi Instan Admin</span>
                  <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest pt-1">Total Tagihan</p>
                  <p className="text-2xl font-black font-mono grad-text-g">Rp {pkg.price.toLocaleString('id-ID')}</p>
                  <p className="text-xs font-bold text-slate-400">{pkg.label} · Metode {payMethod}</p>
                </div>

                {payMethod === 'QRIS' && (
                  <div className="bg-[#0A0815] border border-violet-500/15 p-4 rounded-2xl text-center space-y-3">
                    <p className="text-[10px] text-violet-400 font-black uppercase tracking-wider">Scan QRIS All Payment</p>
                    <div className="relative w-48 h-48 mx-auto bg-white p-2.5 rounded-2xl shadow-xl flex items-center justify-center border-2 border-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                      <img src={QRIS_IMAGE_URL} alt="QRIS" className="w-full h-full object-contain rounded-xl" />
                    </div>
                    <div className="flex gap-2 justify-center pt-1">
                      <button onClick={() => setQrisZoomOpen(true)} className="px-3.5 py-2 bg-violet-500/12 hover:bg-violet-500/20 border border-violet-500/30 text-violet-300 font-bold text-xs rounded-xl flex items-center gap-1.5 active:scale-95 transition-all">
                        <div className="w-3.5 h-3.5"><IcoZoom/></div>Perbesar
                      </button>
                      <button onClick={downloadQrisImage} className="px-3.5 py-2 bg-white/4 hover:bg-white/8 border border-white/8 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 active:scale-95 transition-all">
                        <div className="w-3.5 h-3.5"><IcoDownload/></div>Unduh
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500">Scan dengan semua E-Wallet & M-Banking</p>
                  </div>
                )}

                {payMethod === 'DANA' && (
                  <div className="bg-[#0A0815] border border-violet-500/15 p-3.5 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-bold">Transfer E-Wallet DANA</span>
                      <span className="text-violet-300 font-black">A/n TI** SUT***</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#07050F] p-3 rounded-xl border border-white/5">
                      <span className="font-mono text-sm font-black text-white tracking-wider">083124469855</span>
                      <button onClick={() => copyPayNumber('083124469855')} className="px-3 py-1.5 bg-violet-500/12 text-violet-300 border border-violet-500/25 text-[10px] font-black rounded-lg active:scale-95 transition-transform">
                        {copiedNum === '083124469855' ? 'Tercopy ✓' : 'Salin'}
                      </button>
                    </div>
                  </div>
                )}

                {payMethod === 'SEABANK' && (
                  <div className="bg-[#0A0815] border border-violet-500/15 p-3.5 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-bold">No. Rekening SeaBank</span>
                      <span className="text-violet-300 font-black">A/n HAR*****O</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#07050F] p-3 rounded-xl border border-white/5">
                      <span className="font-mono text-sm font-black text-white tracking-wider">901984771499</span>
                      <button onClick={() => copyPayNumber('901984771499')} className="px-3 py-1.5 bg-violet-500/12 text-violet-300 border border-violet-500/25 text-[10px] font-black rounded-lg active:scale-95 transition-transform">
                        {copiedNum === '901984771499' ? 'Tercopy ✓' : 'Salin'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Upload Bukti Pembayaran</p>
                  <label className="w-full h-28 border border-dashed border-violet-500/20 hover:border-violet-500/40 rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-[#0A0815] overflow-hidden relative transition-all">
                    {proofImage ? <img src={proofImage} alt="Bukti" className="w-full h-full object-contain p-2" /> : (
                      <div className="text-center space-y-1">
                        <div className="w-6 h-6 mx-auto text-violet-400"><IcoUpload/></div>
                        <span className="text-xs font-bold text-slate-400">Pilih Foto Bukti Transfer</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>

                <input type="text" placeholder="Catatan / Nama Pengirim..." value={proofNote} onChange={e => setProofNote(e.target.value)}
                  className="w-full bg-[#0A0815] border border-white/8 text-white placeholder-slate-600 px-4 py-3 rounded-2xl text-xs font-medium focus:outline-none focus:border-violet-500/40 transition-all" />

                <div className="grid grid-cols-[0.8fr_1.4fr] gap-2.5 pt-1">
                  <button onClick={() => setConfirmStep(false)} className="py-3.5 bg-white/4 border border-white/8 text-slate-300 font-extrabold rounded-2xl text-xs uppercase tracking-wider active:scale-95 hover:bg-white/8 transition-all">Kembali</button>
                  <button onClick={submit} disabled={submitting || !proofNote.trim() || !proofImage}
                    className="py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl disabled:opacity-40 active:scale-[0.98] shadow-[0_6px_20px_rgba(139,92,246,0.35)] hover:brightness-110 transition-all">
                    {submitting ? 'Mengirim...' : 'Kirim Bukti Bayar'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════ REDEEM TAB ════════════════ */}
        {activeTab === 'redeem' && (
          <div className="space-y-4" style={{ animation: 'fadeInUp 0.3s ease-out' }}>

            {/* Points Hero */}
            <div className="relative rounded-[24px] overflow-hidden border border-amber-500/25 shadow-[0_8px_40px_rgba(0,0,0,0.6)]" style={{ background: 'linear-gradient(155deg,#1C1508 0%,#120F05 100%)' }}>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-amber-400/80">Bonus & Referral Program</span>
                    <p className="text-3xl font-black mt-0.5 font-mono grad-text-g">{userPoints}</p>
                    <p className="text-xs text-slate-400 font-black">PTS · +50 Poin per teman bergabung</p>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.2)]">
                    <div className="w-5.5 h-5.5"><IcoStar/></div>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={copyReferral} className="flex-1 py-2.5 bg-white/5 hover:bg-white/8 border border-white/8 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all text-slate-300">
                    <div className="w-4 h-4"><IcoCopy/></div>{copied ? 'Tercopy!' : 'Salin Link Referral'}
                  </button>
                  <button onClick={shareToTelegram} className="py-2.5 px-4 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs rounded-2xl flex items-center gap-1.5 active:scale-95 shadow-[0_4px_14px_rgba(245,158,11,0.3)] transition-all">
                    <div className="w-4 h-4"><IcoShare/></div>Bagikan
                  </button>
                </div>
              </div>
            </div>

            {/* Vouchers */}
            {userVouchers.length > 0 && (
              <div className="bg-[#120F1E] border border-white/6 p-4 rounded-[22px] space-y-2 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Voucher Aktif ({userVouchers.length})</p>
                {userVouchers.map((v: any, idx: number) => (
                  <div key={idx} className="bg-[#0A0815] border border-violet-500/12 p-3 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="font-mono text-xs font-black text-amber-300 tracking-wider">{v.code}</p>
                      <p className="text-[10px] text-violet-400 font-bold">Diskon {v.discount}% VIP Access</p>
                    </div>
                    <button onClick={() => copyVoucherCode(v.code)} className="px-3 py-1.5 bg-amber-500/12 text-amber-300 border border-amber-500/25 text-[10px] font-bold rounded-xl active:scale-95 transition-all">
                      {copiedVoucher === v.code ? 'Disalin ✓' : 'Salin'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Redeem Catalog */}
            <div className="bg-[#120F1E] border border-white/6 p-4 rounded-[22px] space-y-3 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between pb-2 border-b border-violet-500/10">
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">Katalog Penukaran</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Geser untuk lihat lebih →</p>
                </div>
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/15 text-amber-300 font-black text-[10px] rounded-full font-mono">{userPoints} PTS</span>
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1">
                {REDEEM_OPTIONS.map(opt => {
                  const canRedeem = userPoints >= opt.points;
                  const progressPct = Math.min((userPoints / opt.points) * 100, 100);
                  return (
                    <div key={opt.id} className="min-w-[205px] max-w-[205px] shrink-0">
                      <div className={`rounded-[22px] border overflow-hidden relative ${canRedeem ? 'bg-[#0E0B18] border-violet-500/30 shadow-[0_4px_20px_rgba(139,92,246,0.1)]' : 'bg-[#0A0815] border-white/5'}`}>
                        <div className="p-4 pb-3 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border ${canRedeem ? 'bg-violet-500/15 text-violet-300 border-violet-500/25' : 'bg-white/5 text-slate-600 border-white/5'}`}>{opt.badge}</span>
                            <div className={canRedeem ? 'text-amber-400' : 'text-slate-700'}>
                              <div className="w-4 h-4">{opt.isVoucher ? <IcoTag/> : <IcoStar/>}</div>
                            </div>
                          </div>
                          <p className={`text-xs font-black leading-snug ${canRedeem ? 'text-white' : 'text-slate-500'}`}>{opt.label}</p>
                          <p className="text-[10px] text-slate-600 leading-relaxed h-8 overflow-hidden">{opt.desc}</p>
                        </div>
                        <div className="relative flex items-center px-4">
                          <div className="ticket-notch left" />
                          <div className="ticket-divider flex-1" />
                          <div className="ticket-notch right" />
                        </div>
                        <div className="p-4 pt-3 space-y-2.5">
                          <div className="flex items-baseline justify-between">
                            <p className={`text-base font-black font-mono ${canRedeem ? 'text-amber-400' : 'text-slate-600'}`}>{opt.points}</p>
                            <span className="text-[9px] text-slate-600 font-bold uppercase">Poin</span>
                          </div>
                          {!canRedeem && (
                            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                            </div>
                          )}
                          <button onClick={() => setRedeemConfirmItem(opt)} disabled={!canRedeem}
                            className={`w-full py-2.5 font-black text-xs uppercase tracking-wider rounded-2xl transition-all active:scale-95 ${canRedeem ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_4px_14px_rgba(139,92,246,0.3)]' : 'bg-white/4 text-slate-600 border border-white/5 cursor-not-allowed'}`}>
                            {canRedeem ? 'Tukar Sekarang' : `Kurang ${opt.points - userPoints} PTS`}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════ PROFILE TAB ════════════════ */}
        {activeTab === 'profile' && (
          <div className="space-y-4" style={{ animation: 'fadeInUp 0.3s ease-out' }}>

            {/* Profile Hero */}
            <div className="relative rounded-[24px] overflow-hidden border border-violet-500/20 shadow-[0_8px_40px_rgba(0,0,0,0.6)]" style={{ background: 'linear-gradient(155deg,#120F1E 0%,#0D0A18 100%)' }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 80% 20%,rgba(139,92,246,0.08) 0%,transparent 60%)' }} />
              <div className="relative p-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-[20px] p-0.5 shadow-[0_0_24px_rgba(139,92,246,0.4)] shrink-0" style={{ background: 'linear-gradient(135deg,#8B5CF6,#D946EF,#F59E0B)' }}>
                    <div className="w-full h-full rounded-[18px] bg-[#07050F] flex items-center justify-center font-black text-white text-xl overflow-hidden">
                      {tgUser?.photo_url ? <img src={tgUser.photo_url} className="w-full h-full object-cover" alt="" /> : initials}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-black text-white truncate">{displayName}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">@{userUsername}</p>
                    {badge && (
                      <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider" style={{ color: badge.color, borderColor: `${badge.color}44`, backgroundColor: `${badge.color}14` }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: badge.color }} />{badge.label}
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-violet-500/10 text-center">
                  {[
                    { val: userPoints, label: 'Poin', color: 'text-amber-400' },
                    { val: userStatus?.referralCount || 0, label: 'Referral', color: 'text-violet-400' },
                    { val: checkinStreak, label: 'Streak', color: 'text-emerald-400' },
                  ].map((s, i) => (
                    <div key={i} className="bg-[#07050F]/60 p-3 rounded-2xl border border-white/5">
                      <p className={`text-base font-black font-mono leading-none ${s.color}`}>{s.val}</p>
                      <p className="text-[8px] text-slate-500 font-black uppercase tracking-wider mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sub Tabs */}
            <div className="bg-[#120F1E] border border-violet-500/12 p-1.5 rounded-2xl flex gap-1">
              {(['overview', 'history', 'settings'] as const).map((t) => (
                <button key={t} onClick={() => setProfileSubTab(t)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${profileSubTab === t ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_4px_14px_rgba(139,92,246,0.35)]' : 'text-slate-500 hover:text-slate-300'}`}>
                  {t === 'overview' ? 'Ringkasan' : t === 'history' ? 'Riwayat' : 'Info Akun'}
                </button>
              ))}
            </div>

            {/* Overview */}
            {profileSubTab === 'overview' && (
              <div className="space-y-3.5" style={{ animation: 'fadeInUp 0.25s ease-out' }}>
                {/* Daily Missions */}
                <div className="bg-[#120F1E] border border-white/6 p-4 rounded-[22px] space-y-3 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-2xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center text-violet-400">
                      <div className="w-4 h-4"><IcoTarget/></div>
                    </div>
                    <div>
                      <h2 className="text-xs font-black text-white">Misi Harian</h2>
                      <p className="text-[10px] text-slate-500">Selesaikan misi untuk poin ekstra</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { key: 'visit', label: 'Buka aplikasi hari ini', pts: 0, done: true },
                      { key: 'checkin', label: 'Klaim bonus check-in harian', pts: 10, done: !!userStatus?.missionsDone?.checkin },
                      { key: 'redeem', label: 'Tukar poin dengan reward', pts: 0, done: !!userStatus?.missionsDone?.redeem },
                    ].map((m) => (
                      <div key={m.key} className={`flex items-center justify-between p-3 rounded-2xl border ${m.done ? 'bg-violet-500/8 border-violet-500/18' : 'bg-[#0A0815] border-white/5'}`}>
                        <div className="flex items-center gap-2.5">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${m.done ? 'bg-violet-500 text-white' : 'bg-white/5 text-slate-600'}`}>
                            {m.done && <div className="w-3 h-3"><IcoCheck/></div>}
                          </div>
                          <p className={`text-xs font-bold ${m.done ? 'text-violet-200' : 'text-slate-400'}`}>{m.label}</p>
                        </div>
                        {m.pts > 0 && <span className="text-xs font-black text-amber-400 font-mono">+{m.pts}</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Referral */}
                <div className="bg-[#120F1E] border border-white/6 p-4 rounded-[22px] space-y-3 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/15 flex items-center justify-center text-fuchsia-400">
                      <div className="w-4 h-4"><IcoUsers/></div>
                    </div>
                    <div>
                      <h2 className="text-xs font-black text-white">Program Ajak Teman</h2>
                      <p className="text-[10px] text-slate-500">+50 Poin per teman bergabung</p>
                    </div>
                  </div>
                  <div className="bg-[#0A0815] border border-white/6 rounded-2xl p-3 flex items-center justify-between gap-2">
                    <p className="text-[10px] font-mono text-slate-500 truncate">t.me/fixeedredbot?start=ref_{userTelegramId}</p>
                    <button onClick={copyReferral} className="px-3 py-1.5 bg-fuchsia-500/12 border border-fuchsia-500/25 text-fuchsia-300 rounded-xl text-xs font-bold shrink-0 active:scale-95 transition-all">
                      {copied ? 'Disalin!' : 'Salin'}
                    </button>
                  </div>
                  <button onClick={shareToTelegram} className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl active:scale-[0.98] shadow-[0_6px_20px_rgba(139,92,246,0.3)] transition-all flex items-center justify-center gap-2">
                    <div className="w-4 h-4"><IcoShare/></div>Bagikan ke Telegram
                  </button>
                  {referredUsers.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Teman Terundang ({referredUsers.length})</p>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto">
                        {referredUsers.slice(0, 8).map((r: any, i: number) => (
                          <div key={i} className="flex items-center gap-2.5 bg-[#0A0815] border border-white/4 rounded-xl p-2.5">
                            <div className="w-6 h-6 rounded-lg bg-fuchsia-500/15 text-fuchsia-300 flex items-center justify-center text-[10px] font-black shrink-0">
                              {(r.firstName || '?')[0]?.toUpperCase()}
                            </div>
                            <p className="text-xs font-bold text-slate-300 truncate flex-1">{r.firstName}</p>
                            <span className="text-[10px] text-emerald-400 font-bold font-mono shrink-0">+50 PTS</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tier Progress */}
                <div className="bg-[#120F1E] border border-white/6 p-4 rounded-[22px] space-y-3 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-2xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center text-amber-400">
                      <div className="w-4 h-4"><IcoCrown/></div>
                    </div>
                    <div>
                      <h2 className="text-xs font-black text-white">Tingkat Level Member</h2>
                      <p className="text-[10px] text-slate-500">Naikkan level dari referral & transaksi</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[{ t: 'BRONZE', l: '🥉', c: '#D97706' }, { t: 'SILVER', l: '🥈', c: '#94A3B8' }, { t: 'GOLD', l: '🥇', c: '#FBBF24' }, { t: 'PLATINUM', l: '🏆', c: '#A78BFA' }, { t: 'DIAMOND', l: '💎', c: '#22D3EE' }].map((lvl) => {
                      const isCurrent = badge?.tier === lvl.t;
                      return (
                        <div key={lvl.t} className={`text-center py-2.5 rounded-2xl border transition-all ${isCurrent ? 'border-white/20 bg-white/8 shadow-[0_0_12px_rgba(255,255,255,0.06)]' : 'border-white/4 opacity-35'}`}>
                          <p className="text-base">{lvl.l}</p>
                          <p className="text-[7px] font-black text-slate-400 mt-1 uppercase">{lvl.t}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* History */}
            {profileSubTab === 'history' && (
              <div className="bg-[#120F1E] border border-white/6 p-4 rounded-[22px] space-y-3 shadow-[0_4px_16px_rgba(0,0,0,0.4)]" style={{ animation: 'fadeInUp 0.25s ease-out' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-2xl bg-cyan-500/10 border border-cyan-500/15 flex items-center justify-center text-cyan-400">
                    <div className="w-4 h-4"><IcoClock/></div>
                  </div>
                  <div>
                    <h2 className="text-xs font-black text-white">Riwayat Transaksi</h2>
                    <p className="text-[10px] text-slate-500">Aktivitas poin & pembelian</p>
                  </div>
                </div>
                {historyLoading ? (
                  <div className="py-8 text-center"><p className="text-xs text-slate-500">Memuat riwayat...</p></div>
                ) : history.length === 0 ? (
                  <div className="py-8 text-center border border-dashed border-violet-500/12 rounded-2xl"><p className="text-xs text-slate-500">Belum ada riwayat</p></div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {history.map((h: any, i: number) => {
                      const typeStyle: Record<string, { icon: string; color: string }> = {
                        CHECKIN: { icon: '📅', color: 'text-violet-400' },
                        VOUCHER: { icon: '🎟️', color: 'text-amber-400' },
                        REDEEM_VIP: { icon: '⭐', color: 'text-fuchsia-400' },
                        REDEEM_VOUCHER: { icon: '🎁', color: 'text-pink-400' },
                        PURCHASE: { icon: '💳', color: 'text-cyan-400' },
                      };
                      const style = typeStyle[h.type] || { icon: '📌', color: 'text-slate-400' };
                      return (
                        <div key={i} className="flex items-center gap-3 p-3 bg-[#0A0815] border border-white/4 rounded-2xl">
                          <span className="text-base shrink-0">{style.icon}</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-200 truncate">{h.label}</p>
                            <p className="text-[9px] text-slate-500">{new Date(h.timestamp).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                          {typeof h.points === 'number' && h.points !== 0 && (
                            <span className={`text-xs font-black font-mono shrink-0 ${h.points > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{h.points > 0 ? '+' : ''}{h.points} PTS</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Settings */}
            {profileSubTab === 'settings' && (
              <div style={{ animation: 'fadeInUp 0.25s ease-out' }}>
                <div className="bg-[#120F1E] border border-white/6 p-4 rounded-[22px] space-y-3 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center text-slate-400">
                      <div className="w-4 h-4"><IcoUserCircle/></div>
                    </div>
                    <div>
                      <h2 className="text-xs font-black text-white">Info Akun</h2>
                      <p className="text-[10px] text-slate-500">Rincian identitas Telegram</p>
                    </div>
                  </div>
                  <div className="bg-[#0A0815] border border-white/5 rounded-2xl divide-y divide-white/5">
                    {[
                      { label: 'Telegram ID', val: String(userTelegramId) },
                      { label: 'Username', val: `@${userUsername}` },
                      { label: 'Status', val: isPrem ? 'VIP Member' : 'Free User', special: isPrem },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3.5">
                        <span className="text-xs text-slate-400 font-medium">{item.label}</span>
                        <span className={`text-xs font-bold font-mono ${item.special ? 'text-emerald-400' : 'text-slate-200'}`}>{item.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Bottom Navigation ── */}
      <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-sm">
        <div className="glass bg-[#120F1E]/92 backdrop-blur-3xl rounded-[26px] p-1.5 border border-violet-500/15 flex items-center justify-around shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_0_1px_rgba(139,92,246,0.08)] gap-1">
          {[
            { id: 'dashboard', label: 'Home', Icon: IcoHome, grad: 'bg-white text-slate-950' },
            { id: 'buy', label: 'Store', Icon: IcoStore, grad: 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white' },
            { id: 'checkin', label: 'Absen', Icon: IcoCalendar, grad: 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950' },
            { id: 'redeem', label: 'Poin', Icon: IcoGift, grad: 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950' },
            { id: 'profile', label: 'Profil', Icon: IcoUserCircle, grad: 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white' },
          ].map(({ id, label, Icon, grad }) => {
            const isActive = activeTab === id;
            return (
              <button key={id}
                onClick={() => { setActiveTab(id as any); if (id === 'buy') setConfirmStep(false); }}
                className={`flex-1 py-2.5 rounded-[18px] flex flex-col items-center justify-center gap-1 text-[10px] font-black transition-all active:scale-90 ${isActive ? `${grad} shadow-lg` : 'text-slate-500 hover:text-slate-300'}`}
                style={isActive ? { animation: 'navPop 0.25s cubic-bezier(0.16,1,0.3,1)' } : {}}>
                <div className="w-4 h-4"><Icon /></div>
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Redeem Confirm Modal ── */}
      {redeemConfirmItem && (
        <div className="fixed inset-0 z-50 bg-[#07050F]/90 backdrop-blur-xl flex items-center justify-center p-4" style={{ animation: 'fadeInUp 0.15s ease-out' }} onClick={() => setRedeemConfirmItem(null)}>
          <div className="max-w-xs w-full bg-[#120F1E] p-6 rounded-[32px] space-y-4 border border-amber-500/25 text-center shadow-[0_30px_80px_rgba(0,0,0,0.95)]" style={{ animation: 'scaleIn 0.2s cubic-bezier(0.16,1,0.3,1)' }} onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-[20px] bg-amber-500/12 border border-amber-500/25 text-amber-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(245,158,11,0.15)]">
              <div className="w-7 h-7"><IcoGift/></div>
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Konfirmasi Penukaran</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Potong <span className="text-amber-400 font-bold font-mono">{redeemConfirmItem.points} PTS</span> untuk <span className="text-white font-bold">{redeemConfirmItem.label}</span>?
              </p>
            </div>
            <div className="bg-[#0A0815] p-3 rounded-2xl border border-white/6 text-xs space-y-1.5 text-left">
              {[['Saldo Saat Ini', `${userPoints} PTS`, 'text-white'], ['Biaya', `-${redeemConfirmItem.points} PTS`, 'text-amber-400'], ['Sisa Poin', `${userPoints - redeemConfirmItem.points} PTS`, 'text-emerald-400']].map(([l, v, c], i, arr) => (
                <div key={i} className={`flex justify-between ${i === arr.length - 1 ? 'pt-1.5 border-t border-white/5' : ''}`}>
                  <span className="text-slate-400">{l}:</span>
                  <span className={`font-bold font-mono ${c}`}>{v}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-[0.8fr_1.4fr] gap-2.5 pt-1">
              <button onClick={() => setRedeemConfirmItem(null)} className="py-3 bg-white/4 border border-white/8 text-slate-300 font-extrabold rounded-2xl text-xs uppercase tracking-wider active:scale-95 transition-all">Batal</button>
              <button onClick={executeRedeem} disabled={redeeming} className="py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl active:scale-95 disabled:opacity-40 shadow-[0_6px_20px_rgba(245,158,11,0.3)] transition-all">
                {redeeming ? 'Proses...' : 'Konfirmasi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── QRIS Zoom Modal ── */}
      {qrisZoomOpen && (
        <div className="fixed inset-0 z-50 bg-[#07050F]/95 backdrop-blur-2xl flex items-center justify-center p-4" style={{ animation: 'fadeInUp 0.15s ease-out' }} onClick={() => setQrisZoomOpen(false)}>
          <div className="max-w-sm w-full bg-[#120F1E] p-5 rounded-[32px] space-y-4 border border-violet-500/30 text-center shadow-[0_30px_80px_rgba(0,0,0,0.95)]" style={{ animation: 'scaleIn 0.2s cubic-bezier(0.16,1,0.3,1)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-center gap-2 pb-2 border-b border-violet-500/10">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-xs font-black text-white uppercase tracking-wider">QRIS Fullscreen</span>
            </div>
            <div className="w-full aspect-square bg-white p-3 rounded-2xl shadow-2xl border-4 border-violet-400 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
              <img src={QRIS_IMAGE_URL} alt="QRIS" className="w-full h-full object-contain rounded-xl" />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-violet-300 font-bold">Siap scan via DANA, GoPay, OVO, ShopeePay & M-Banking</p>
              <button onClick={() => setQrisZoomOpen(false)} className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-[0_6px_20px_rgba(139,92,246,0.35)] active:scale-95 transition-all">
                Tutup & Kembali
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Chat FAB ── */}
      {!chatOpen && (
        <button onClick={() => setChatOpen(true)} aria-label="Chat dengan Owner"
          className="fixed right-3.5 z-40 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] h-11 pl-3 pr-3.5 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white flex items-center gap-1.5 shadow-[0_8px_24px_rgba(139,92,246,0.5)] active:scale-95 transition-all border border-white/12 animate-fab-pop">
          <span className="relative w-[18px] h-[18px] block">
            <IcoChat />
            {chatUnread > 0 && (
              <span className="absolute -top-2 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 border-2 border-[#120F1E] text-[8px] font-black flex items-center justify-center leading-none">
                {chatUnread > 9 ? '9+' : chatUnread}
              </span>
            )}
          </span>
          <span className="text-[11px] font-black tracking-wide">Chat</span>
        </button>
      )}

      {/* ── Chat Panel ── */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 bg-[#07050F] flex flex-col h-[100dvh]" style={{ animation: 'fadeInUp 0.2s ease-out' }}>
          <div className="shrink-0 flex items-center gap-3 px-4 pb-3 pt-[max(56px,calc(env(safe-area-inset-top)+44px))] border-b border-violet-500/10 bg-[#120F1E]">
            <button onClick={() => setChatOpen(false)} className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-slate-300 active:scale-95 transition-all shrink-0">←</button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shrink-0 shadow-[0_4px_14px_rgba(139,92,246,0.4)]">
              <div className="w-4.5 h-4.5"><IcoChat /></div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-white">Customer Support</p>
              <p className="text-[10px] text-slate-400">{chatConversation?.status === 'closed' ? 'Percakapan ditutup' : 'Owner biasanya membalas cepat'}</p>
            </div>
            <button onClick={() => loadChat(initData)} className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-slate-300 active:scale-95 transition-all shrink-0">
              <div className="w-4 h-4"><IcoRefresh /></div>
            </button>
          </div>

          <div ref={chatScrollRef} onScroll={handleChatScroll} className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-4 space-y-2.5">
            {chatLoading && chatMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-500">
                <div className="w-6 h-6 border-2 border-violet-500/25 border-t-violet-500 rounded-full animate-spin" />
                <p className="text-xs font-medium">Memuat percakapan...</p>
              </div>
            ) : chatError ? (
              <div className="h-full flex flex-col items-center justify-center gap-3 text-center px-6">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-400 flex items-center justify-center">
                  <div className="w-6 h-6"><IcoLock /></div>
                </div>
                <p className="text-xs text-rose-300 font-semibold">{chatError}</p>
                <button onClick={() => loadChat(initData)} className="px-4 py-2 bg-white/5 border border-white/8 text-slate-200 text-[11px] font-bold rounded-xl active:scale-95 transition-all">Coba Lagi</button>
              </div>
            ) : chatMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-center px-6">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                  <div className="w-6 h-6"><IcoChat /></div>
                </div>
                <p className="text-xs text-slate-300 font-bold">Belum ada percakapan</p>
                <p className="text-[10px] text-slate-500 max-w-[220px]">Kirim pesan pertama, Owner akan segera membalas.</p>
              </div>
            ) : (
              chatMessages.map((m: any) => {
                const isUser = m.sender_type === 'user';
                const isAi = m.sender_type === 'ai';
                return (
                  <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`} style={{ animation: 'fadeInUp 0.2s ease-out' }}>
                    <div className={`max-w-[78%] px-4 py-2.5 text-[12.5px] leading-relaxed ${
                      isUser ? 'bg-gradient-to-br from-violet-600 via-fuchsia-600 to-purple-600 text-white rounded-2xl rounded-br-md shadow-[0_4px_16px_-4px_rgba(139,92,246,0.5)] ring-1 ring-fuchsia-300/15'
                      : isAi ? 'bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-600 text-white rounded-2xl rounded-bl-md shadow-[0_4px_16px_-4px_rgba(6,182,212,0.5)] ring-1 ring-cyan-300/15'
                      : 'bg-[#1C1828] text-slate-100 rounded-2xl rounded-bl-md shadow-[0_4px_14px_-6px_rgba(0,0,0,0.6)] ring-1 ring-violet-500/8'
                    }`}>
                      {isAi && (
                        <p className="flex items-center gap-1 text-[8.5px] font-black uppercase tracking-widest text-cyan-50/80 mb-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-200 shadow-[0_0_6px_rgba(165,243,252,0.8)]" />Asisten AI
                        </p>
                      )}
                      <p className="whitespace-pre-wrap break-words">{m.message}</p>
                      <p className={`text-[9px] mt-1 font-medium flex items-center gap-1 ${isUser ? 'text-fuchsia-50/70 justify-end' : isAi ? 'text-cyan-50/70' : 'text-slate-500'}`}>
                        {m._failed ? <span className="text-rose-300">Gagal terkirim</span>
                          : m._pending ? <span>Mengirim...</span>
                          : new Date(m.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="shrink-0 p-3 pb-[max(12px,env(safe-area-inset-bottom))] border-t border-violet-500/10 bg-[#120F1E]">
            {chatConversation?.status === 'closed' && (
              <div className="text-center py-2"><p className="text-[10px] text-slate-500">Percakapan ditutup Owner. Kirim pesan baru untuk membuka kembali.</p></div>
            )}
            <div className="flex items-end gap-2">
              <textarea value={chatInput}
                onChange={(e) => { setChatInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px'; }}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }}
                placeholder="Tulis pesan..." rows={1} maxLength={2000} disabled={chatSending}
                className="flex-1 bg-[#0A0815] border border-violet-500/15 text-white placeholder-slate-600 px-3.5 py-2.5 rounded-2xl text-xs focus:outline-none focus:border-violet-500/40 transition-all resize-none max-h-24 disabled:opacity-60" />
              <button onClick={sendChatMessage} disabled={chatSending || !chatInput.trim()}
                className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white flex items-center justify-center active:scale-95 disabled:opacity-40 transition-all shadow-[0_4px_14px_rgba(139,92,246,0.4)]">
                <div className="w-4 h-4">{chatSending ? '···' : <IcoSend />}</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
