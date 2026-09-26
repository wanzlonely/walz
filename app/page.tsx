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
  { day: 1, pts: 10, label: 'HARI 1' },
  { day: 2, pts: 15, label: 'HARI 2' },
  { day: 3, pts: 20, label: 'HARI 3' },
  { day: 4, pts: 25, label: 'HARI 4' },
  { day: 5, pts: 30, label: 'HARI 5' },
  { day: 6, pts: 40, label: 'HARI 6' },
  { day: 7, pts: 75, label: 'BONUS BIG' },
];

const QRIS_IMAGE_URL = 'https://cdn.phototourl.com/free/2026-09-20-089b0a40-ebfa-44cc-822a-243c7f64a793.jpg';

function useCountdown(targetDate: string | null) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft(null);
      return;
    }

    const updateTimer = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft(null);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

function IcoHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
function IcoStore() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/>
      <line x1="12" y1="2" x2="12" y2="22"/>
    </svg>
  );
}
function IcoGift() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/>
      <line x1="12" y1="22" x2="12" y2="7"/>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    </svg>
  );
}
function IcoCopy() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  );
}
function IcoCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <polyline points="20 6 9 17 4 12"/>
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
function IcoShare() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
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
function IcoUpload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
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
function IcoStar() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
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
function IcoZoom() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
    </svg>
  );
}
function IcoDownload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}
function IcoShieldCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
    </svg>
  );
}
function IcoCalendar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}
function IcoCrown() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M2 4l3 12h14l3-12-6 7-4-8-4 8-6-7z"/><path d="M3 20h18"/>
    </svg>
  );
}
function IcoTrophy() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z"/>
      <path d="M17 5h3a2 2 0 0 1 2 2 5 5 0 0 1-5 5M7 5H4a2 2 0 0 0-2 2 5 5 0 0 0 5 5"/>
    </svg>
  );
}
function IcoUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}
function IcoClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
function IcoTarget() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
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
function IcoUserCircle() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M6.5 19a5.5 5.5 0 0 1 11 0"/>
    </svg>
  );
}

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
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % RECENT_PURCHASES.length);
    }, 4000);
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
        tg.ready();
        tg.expand();
        tg.setHeaderColor('#04060C');
        tg.setBackgroundColor('#04060C');
        const raw = tg.initData || '';
        const user = tg.initDataUnsafe?.user;
        setInitData(raw);
        setTgUser(user);
        checkStatus(raw);
      } else {
        checkStatus('');
      }
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
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    chatUserNearBottomRef.current = distanceFromBottom < 120;
  };

  const loadChat = async (raw: string) => {
    if (!raw) return;
    setChatLoading(true);
    setChatError(null);
    try {
      const res = await fetch(`/api/chat?initData=${encodeURIComponent(raw)}&t=${Date.now()}`, { cache: 'no-store' });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Gagal memuat chat');
      setChatConversation(d.conversation);
      setChatMessages(d.messages || []);
      setChatUnread(d.conversation?.unread_by_user || 0);
      setTimeout(() => scrollChatToBottom(false), 50);
    } catch (err: any) {
      setChatError(err?.message || 'Gagal memuat chat. Coba lagi.');
    } finally {
      setChatLoading(false);
    }
  };

  const sendChatMessage = async () => {
    const text = chatInput.trim();
    if (!text || chatSending || !initData) return;
    setChatSending(true);
    setChatInput('');
    const tempId = `temp-${Date.now()}`;
    setChatMessages((prev) => [
      ...prev,
      { id: tempId, sender_type: 'user', message: text, created_at: new Date().toISOString(), _pending: true },
    ]);
    chatUserNearBottomRef.current = true;
    setTimeout(() => scrollChatToBottom(true), 30);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, text }),
      });
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
    } finally {
      setChatSending(false);
    }
  };

  const markChatRead = async (raw: string) => {
    if (!raw) return;
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData: raw, action: 'mark_read' }),
      });
      setChatUnread(0);
    } catch {}
  };

  useEffect(() => {
    if (initData) loadChat(initData);
  }, [initData]);

  useEffect(() => {
    if (chatOpen && initData && chatUnread > 0) {
      markChatRead(initData);
    }
  }, [chatOpen]);

  useEffect(() => {
    if (!chatConversation?.id) return;

    const channel = supabase
      .channel(`user-chat-${chatConversation.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `conversation_id=eq.${chatConversation.id}` },
        (payload: any) => {
          const newMsg = payload.new;
          setChatMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            if (newMsg.sender_type === 'user') {
              const tempIdx = prev.findIndex((m) => m._pending && m.sender_type === 'user' && m.message === newMsg.message);
              if (tempIdx !== -1) {
                const next = prev.slice();
                next[tempIdx] = newMsg;
                return next;
              }
            }
            return [...prev, newMsg];
          });

          if (newMsg.sender_type === 'owner' || newMsg.sender_type === 'ai') {
            if (chatOpen && chatUserNearBottomRef.current) {
              setTimeout(() => scrollChatToBottom(true), 30);
              markChatRead(initData);
            } else if (!chatOpen) {
              setChatUnread((u) => u + 1);
            }
          } else if (chatUserNearBottomRef.current) {
            setTimeout(() => scrollChatToBottom(true), 30);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'chat_conversations', filter: `id=eq.${chatConversation.id}` },
        (payload: any) => {
          setChatConversation((prev: any) => ({ ...prev, ...payload.new }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatConversation?.id, chatOpen]);

  const checkStatus = async (raw: string) => {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/store?t=${Date.now()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ initData: raw, action: 'check_status' }),
      });
      const d = await res.json();
      if (res.ok) {
        if (d.isAdmin) { router.push('/admin'); return; }
        setUserStatus(d.user);
        setPending(d.pendingOrder);
        setFlashSale(d.flashSale);
        setBadge(d.badge || null);
      } else if (res.status === 403) {
        showToast('error', d.error || 'Akun Anda telah diblokir!');
        setUserStatus({ status: 'BANNED' });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const claimDailyBonus = async () => {
    if (dailyClaiming) return;
    setDailyClaiming(true);
    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, action: 'daily_checkin' }),
      });
      const d = await res.json();
      if (res.ok) {
        showToast('success', d.message || 'Berhasil klaim bonus harian +10 Poin!');
        checkStatus(initData);
      } else {
        showToast('error', d.error || 'Gagal klaim bonus harian');
      }
    } finally {
      setDailyClaiming(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('error', 'Ukuran foto maksimal 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 800;
          let width = img.width;
          let height = img.height;
          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
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
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initData,
          action: 'submit_order',
          packageId: selectedPkg,
          proofNote,
          proofImage
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPending(true);
        setActiveTab('dashboard');
        setConfirmStep(false);
        setProofNote('');
        setProofImage(null);
        showToast('success', 'Pesanan dikirim! Admin akan memverifikasi.');
        checkStatus(initData);
      } else {
        showToast('error', data.error || 'Gagal mengirim pesanan');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClaimVoucher = async () => {
    if (!claimInputCode.trim() || claiming) return;
    setClaiming(true);
    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initData,
          action: 'claim_voucher',
          voucherCode: claimInputCode
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const quotaNote = data.dailyLimit
          ? ` (Sisa kuota hari ini: ${data.remainingToday}/${data.dailyLimit})`
          : '';
        showToast('success', (data.message || 'Kode promo berhasil diklaim!') + quotaNote);
        setClaimInputCode('');
        checkStatus(initData);
      } else {
        showToast('error', data.error || 'Kode promo tidak valid');
      }
    } finally {
      setClaiming(false);
    }
  };

  const executeRedeem = async () => {
    if (!redeemConfirmItem || redeeming) return;
    const { points, days, isVoucher } = redeemConfirmItem;
    if ((userStatus?.points || 0) < points) {
      showToast('error', 'Poin Anda tidak mencukupi untuk item ini');
      setRedeemConfirmItem(null);
      return;
    }
    setRedeeming(true);
    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initData,
          action: 'redeem_points',
          pointsToRedeem: points,
          daysToAdd: days,
          isVoucher
        }),
      });
      if (res.ok) {
        showToast('success', isVoucher ? 'Voucher diskon berhasil dibuat!' : `Masa VIP bertambah +${days} Hari!`);
        setRedeemConfirmItem(null);
        checkStatus(initData);
      } else {
        const err = await res.json();
        showToast('error', err.error || 'Gagal menukarkan poin');
      }
    } finally {
      setRedeeming(false);
    }
  };

  const copyReferral = () => {
    const telegramUserId = tgUser?.id || userStatus?.telegramId;
    if (!telegramUserId) return;
    const refUrl = `https://t.me/fixeedredbot?start=ref_${telegramUserId}`;
    navigator.clipboard.writeText(refUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, action: 'get_history' }),
      });
      const d = await res.json();
      if (res.ok) setHistory(d.history || []);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    setLeaderboardLoading(true);
    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, action: 'get_leaderboard' }),
      });
      const d = await res.json();
      if (res.ok) {
        setLeaderboard(d.leaderboard || []);
        setMyRank(d.myRank || null);
        setTotalPlayers(d.totalPlayers || 0);
      }
    } finally {
      setLeaderboardLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'profile' && initData) {
      if (profileSubTab === 'history') fetchHistory();
    }
  }, [activeTab, profileSubTab, initData]);

  useEffect(() => {
    if (activeTab === 'dashboard' && initData) fetchLeaderboard();
  }, [activeTab, initData]);

  const shareToTelegram = () => {
    const telegramUserId = tgUser?.id || userStatus?.telegramId;
    if (!telegramUserId) return;
    const refUrl = `https://t.me/fixeedredbot?start=ref_${telegramUserId}`;
    const shareText = encodeURIComponent(`Nikmati VIP Store & Bonus Poin Gratis di WALZSHOP! ${refUrl}`);
    window.open(`https://t.me/share/url?url=${refUrl}&text=${shareText}`, '_blank');
  };

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedVoucher(code);
    setTimeout(() => setCopiedVoucher(null), 3000);
  };

  const copyPayNumber = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNum(text);
    setTimeout(() => setCopiedNum(null), 3000);
  };

  const downloadQrisImage = () => {
    const link = document.createElement('a');
    link.href = QRIS_IMAGE_URL;
    link.download = 'QRIS_WALZSHOP.jpg';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  if (loading) return (
    <div className="min-h-screen bg-[#04060C] flex flex-col items-center justify-center p-4 selection:bg-emerald-500/30">
      <div className="relative flex flex-col items-center gap-4 p-8 bg-[#0B0F1A]/90 border border-emerald-500/30 rounded-3xl backdrop-blur-3xl shadow-[0_0_60px_rgba(16,185,129,0.15)] animate-[scaleIn_0.3s_ease-out]">
        <div className="relative flex items-center justify-center w-16 h-16">
          <div className="absolute inset-0 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
          <div className="absolute inset-2 border-2 border-teal-500/10 border-b-teal-400 rounded-full animate-[spin_1.5s_linear_infinite_reverse]" />
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/40">
            W
          </div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs font-black tracking-[0.25em] text-emerald-400 uppercase">WALZSHOP STORE</p>
          <p className="text-[10px] text-slate-400 font-medium tracking-wider">Memuat Mini App Premium...</p>
        </div>
      </div>
    </div>
  );

  if (isBanned) return (
    <div className="min-h-screen bg-[#04060C] text-slate-100 flex items-center justify-center p-4 font-sans selection:bg-rose-500/30">
      <div className="bg-[#0B0F1A] p-7 rounded-[32px] max-w-xs w-full text-center space-y-4 border border-rose-500/40 shadow-[0_0_50px_rgba(244,63,94,0.2)] animate-[scaleIn_0.3s_ease-out]">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500/20 to-rose-950/40 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
          <div className="w-7 h-7"><IcoLock/></div>
        </div>
        <div>
          <h2 className="text-base font-black text-white uppercase tracking-wider">AKUN DIBLOKIR</h2>
          <p className="text-xs text-slate-400 leading-relaxed font-medium mt-1">
            Akun Telegram Anda telah diblokir secara permanen. Silakan hubungi admin jika terjadi kekeliruan.
          </p>
        </div>
      </div>
    </div>
  );

  const rawPkg = PACKAGES.find((p: any) => p.id === selectedPkg) || PACKAGES[0] || { id: '3D', days: 3, price: 2000, label: '3 Hari' };
  const calculatedPrice = isFlashActive ? Math.max(0, Math.floor(rawPkg.price * (1 - flashDiscount / 100))) : rawPkg.price;
  const pkg = { ...rawPkg, price: calculatedPrice };

  const displayName = tgUser ? [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ') : userStatus?.profile?.firstName || 'Exploit User';
  const userUsername = tgUser?.username || userStatus?.profile?.username || 'exploit_user';
  const userTelegramId = tgUser?.id || userStatus?.telegramId || '8884003270';
  const initials = displayName?.[0]?.toUpperCase() || 'E';
  const userPoints = userStatus?.points || 0;
  const userVouchers = userStatus?.vouchers || [];

  return (
    <div className="min-h-screen bg-[#04060C] text-slate-100 font-sans relative overflow-x-hidden pb-32 selection:bg-emerald-500/30">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/12 rounded-full blur-[120px] animate-[pulseGlow_4s_infinite_ease-in-out]" />
        <div className="absolute top-1/3 -right-24 w-[320px] h-[320px] bg-teal-500/8 rounded-full blur-[110px]" />
        <div className="absolute top-2/3 -left-24 w-[300px] h-[300px] bg-violet-600/8 rounded-full blur-[110px]" />
      </div>

      {toastMsg && (
        <div className="fixed top-4 left-0 right-0 z-[100] px-4 pointer-events-none flex justify-center">
          <div className={`pointer-events-auto w-full max-w-[360px] p-3.5 rounded-2xl shadow-[0_16px_50px_rgba(0,0,0,0.85)] flex items-center gap-3 border backdrop-blur-3xl animate-[toastSlide_0.4s_cubic-bezier(0.16,1,0.3,1)] ${
            toastMsg.type === 'success' 
              ? 'border-emerald-500/50 bg-[#061D15]/95 text-emerald-200 shadow-emerald-950/40' 
              : 'border-rose-500/50 bg-[#210A11]/95 text-rose-200 shadow-rose-950/40'
          }`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
              toastMsg.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}>
              <div className="w-4.5 h-4.5">{toastMsg.type === 'success' ? <IcoCheck/> : <IcoLock/>}</div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black uppercase tracking-widest opacity-60">
                {toastMsg.type === 'success' ? 'Sistem Berhasil' : 'Pemberitahuan'}
              </p>
              <p className="text-xs font-bold leading-snug truncate mt-0.5">{toastMsg.text}</p>
            </div>
          </div>
        </div>
      )}

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
              <h1 className="text-xs font-black tracking-tight text-white leading-none">WALZSHOP</h1>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[9px] text-emerald-400 font-extrabold tracking-wider mt-0.5">Digital Store Portal</p>
          </div>
        </div>

        <button
          onClick={() => checkStatus(initData)}
          disabled={refreshing}
          className={`w-9 h-9 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-white/10 active:scale-90 transition-all shadow-md ${refreshing ? 'animate-spin text-emerald-400' : ''}`}
        >
          <div className="w-4 h-4"><IcoRefresh/></div>
        </button>
      </header>

      <main className="px-4 pt-3.5 max-w-md mx-auto space-y-3.5 relative z-10">

        <div className="bg-gradient-to-r from-[#0B101D] to-[#0D1527] border border-emerald-500/30 px-3.5 py-2.5 rounded-2xl flex items-center gap-2.5 text-[10px] font-bold text-emerald-300 shadow-lg shadow-black/40 overflow-hidden">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <p className="truncate font-medium" key={tickerIndex}>{RECENT_PURCHASES[tickerIndex]}</p>
        </div>

        {isFlashActive && (
          <div className="bg-gradient-to-r from-[#231219] via-[#1A0E1A] to-[#0F0814] border border-rose-500/40 p-4 rounded-3xl flex items-center justify-between shadow-xl shadow-rose-950/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-9 h-9 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shadow-md">
                <div className="w-4.5 h-4.5"><IcoZap/></div>
              </div>
              <div>
                <p className="text-xs font-black text-white leading-none">FLASH SALE EVENT</p>
                <p className="text-[10px] text-rose-300 font-extrabold mt-1">Diskon -{flashDiscount}% Semua Paket VIP</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black text-[9px] rounded-xl shadow-lg shadow-rose-500/30 animate-pulse uppercase tracking-wider relative z-10">
              -{flashDiscount}% OFF
            </span>
          </div>
        )}

        {pending && (
          <div className="bg-gradient-to-r from-amber-950/30 to-amber-900/10 border border-amber-500/40 p-3.5 rounded-3xl flex items-center gap-3 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            <p className="text-amber-200 text-xs font-bold">Transaksi Anda sedang diverifikasi oleh Admin...</p>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-3.5 animate-[fadeIn_0.25s_ease-out]">

            <div className="glass-card p-4 rounded-[28px] relative overflow-hidden border border-white/10 shadow-2xl space-y-3">
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-500 p-0.5 shadow-xl shrink-0">
                    <div className="w-full h-full rounded-[14px] bg-[#0A0F1A] flex items-center justify-center font-black text-white text-base overflow-hidden">
                      {tgUser?.photo_url ? <img src={tgUser.photo_url} className="w-full h-full object-cover" alt=""/> : initials}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xs font-black text-white truncate">{displayName}</h2>
                    {userUsername && <p className="text-[10px] text-emerald-400 font-extrabold leading-tight mt-0.5 truncate">@{userUsername}</p>}
                    <p className="text-[9px] text-slate-500 font-mono mt-0.5">ID: {userTelegramId}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase border tracking-wider shrink-0 ${
                  isPrem ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-md shadow-emerald-500/10' : 'bg-white/5 text-slate-400 border-white/10'
                }`}>
                  {isPrem ? 'VIP MEMBER' : 'FREE USER'}
                </span>
              </div>

              {isPrem && countdown && (
                <div className="pt-3 border-t border-white/10 text-center relative z-10">
                  <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1.5">Sisa Masa Aktif VIP</p>
                  <div className="grid grid-cols-4 gap-1.5 font-mono text-xs font-black text-white">
                    <div className="bg-[#050811] border border-white/10 py-1.5 rounded-xl text-center"><span className="text-emerald-400">{countdown.days}</span><span className="text-[8px] font-normal text-slate-400 ml-0.5">h</span></div>
                    <div className="bg-[#050811] border border-white/10 py-1.5 rounded-xl text-center"><span className="text-emerald-400">{String(countdown.hours).padStart(2, '0')}</span><span className="text-[8px] font-normal text-slate-400 ml-0.5">j</span></div>
                    <div className="bg-[#050811] border border-white/10 py-1.5 rounded-xl text-center"><span className="text-emerald-400">{String(countdown.minutes).padStart(2, '0')}</span><span className="text-[8px] font-normal text-slate-400 ml-0.5">m</span></div>
                    <div className="bg-[#050811] border border-white/10 py-1.5 rounded-xl text-center"><span className="text-emerald-400">{String(countdown.seconds).padStart(2, '0')}</span><span className="text-[8px] font-normal text-slate-400 ml-0.5">s</span></div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="glass-card p-3 rounded-2xl border border-white/10 shadow-lg">
                <span className="text-[9px] text-slate-400 font-extrabold block uppercase tracking-wider">Status Bot</span>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"/>
                  <span className="font-black text-emerald-400 text-xs">Online 24/7</span>
                </div>
              </div>
              <div className="glass-card p-3 rounded-2xl border border-white/10 shadow-lg">
                <span className="text-[9px] text-slate-400 font-extrabold block uppercase tracking-wider">Saldo Poin</span>
                <span className="font-black text-amber-400 text-xs mt-1 block font-mono">{userPoints} PTS</span>
              </div>
            </div>

            <div className="glass-card p-4 rounded-[28px] space-y-3 border border-emerald-500/30 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 text-emerald-400"><IcoTag/></div>
                <p className="text-xs font-black text-white">Klaim Kode Promo / Voucher</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="MASUKKAN KODE VOUCHER..."
                  value={claimInputCode}
                  onChange={e => setClaimInputCode(e.target.value)}
                  className="flex-1 min-w-0 bg-[#050811] border border-white/10 text-white placeholder-slate-600 px-3.5 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner"
                />
                <button
                  onClick={handleClaimVoucher}
                  disabled={claiming || !claimInputCode.trim()}
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl active:scale-95 disabled:opacity-40 transition-all shadow-lg shadow-emerald-500/25 shrink-0"
                >
                  {claiming ? '...' : 'Klaim'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setActiveTab('buy'); setConfirmStep(false); }}
                className="glass-card p-4 rounded-[28px] text-left border border-emerald-500/30 hover:border-emerald-500/50 active:scale-95 transition-all shadow-xl group"
              >
                <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2.5 shadow-md group-hover:bg-emerald-500/20 transition-all">
                  <div className="w-4.5 h-4.5"><IcoStore/></div>
                </div>
                <p className="text-xs font-black text-white">VIP Store</p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Beli paket langganan</p>
              </button>

              <button
                onClick={() => setActiveTab('checkin')}
                className="glass-card p-4 rounded-[28px] text-left border border-amber-500/30 hover:border-amber-500/50 active:scale-95 transition-all shadow-xl group"
              >
                <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-2.5 shadow-md group-hover:bg-amber-500/20 transition-all">
                  <div className="w-4.5 h-4.5"><IcoCalendar/></div>
                </div>
                <p className="text-xs font-black text-white">Daily Check-in</p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Klaim poin tiap 24 jam</p>
              </button>
            </div>

            <div className="glass-card border border-amber-500/30 rounded-[28px] overflow-hidden relative shadow-xl">
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 shrink-0">
                      <div className="w-4.5 h-4.5"><IcoTrophy/></div>
                    </div>
                    <div>
                      <h2 className="text-xs font-black text-white">Papan Skor Poin</h2>
                      <p className="text-[10px] text-slate-400">Top 10 dari {totalPlayers} pemain aktif</p>
                    </div>
                  </div>
                  {myRank && (
                    <div className="text-right shrink-0 bg-[#050811] px-2.5 py-1 rounded-xl border border-white/5">
                      <p className="text-[8px] text-slate-400 font-black uppercase tracking-wider">Rank Kamu</p>
                      <p className="text-xs font-black text-amber-400 font-mono">#{myRank}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {leaderboardLoading ? (
                    <div className="py-6 text-center">
                      <p className="text-xs text-slate-500">Memuat papan skor...</p>
                    </div>
                  ) : leaderboard.length === 0 ? (
                    <div className="py-6 text-center border border-dashed border-white/10 rounded-2xl">
                      <p className="text-xs text-slate-500">Belum ada data</p>
                    </div>
                  ) : (
                    leaderboard.slice(0, 10).map((p: any, idx: number) => {
                      const rank = idx + 1;
                      const isMe = p.telegramId === userTelegramId?.toString();
                      const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;
                      return (
                        <div key={p.telegramId} className={`flex items-center gap-2.5 p-2.5 rounded-2xl border transition-all ${isMe ? 'bg-violet-500/15 border-violet-500/40 shadow-md' : 'bg-[#050811] border-white/5'}`}>
                          <div className="w-5 text-center shrink-0">
                            {medal ? <span className="text-xs">{medal}</span> : <span className="text-[10px] font-black text-slate-500">#{rank}</span>}
                          </div>
                          <div className="w-6.5 h-6.5 rounded-xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-md">
                            {(p.firstName || '?')[0]?.toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs font-bold truncate ${isMe ? 'text-violet-300' : 'text-slate-200'}`}>{p.firstName}{isMe ? ' (Kamu)' : ''}</p>
                            <p className="text-[9px] text-slate-500">{p.badge?.label}</p>
                          </div>
                          <p className="text-xs font-black text-amber-400 shrink-0 font-mono">{p.points} PTS</p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'checkin' && (
          <div className="space-y-3.5 animate-[fadeIn_0.25s_ease-out]">
            <div className="glass-card border border-amber-500/30 p-5 rounded-[28px] text-center space-y-3 shadow-xl relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                <div className="w-6 h-6"><IcoCalendar/></div>
              </div>

              <div>
                <span className="px-3 py-0.5 bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[9px] font-black rounded-full uppercase tracking-wider inline-block mb-1">
                  Daily Check-in Reward
                </span>
                <h2 className="text-sm font-black text-white mt-0.5">Absen Harian Dapatkan Poin</h2>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
                  Kumpulkan poin gratis setiap 24 Jam untuk ditukarkan dengan VIP Access gratis.
                </p>
              </div>

              <div className="bg-[#050811] p-3 rounded-2xl border border-amber-500/25 flex items-center justify-between shadow-inner">
                <div className="text-left">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Status Absen</p>
                  <p className={`text-xs font-black ${canCheckin ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {canCheckin ? 'Siap Diklaim' : 'Sudah Absen Hari Ini'}
                  </p>
                </div>
                <button
                  onClick={claimDailyBonus}
                  disabled={dailyClaiming || !canCheckin}
                  className={`px-4 py-2 font-black text-xs uppercase tracking-wider rounded-xl active:scale-95 transition-all shadow-md ${
                    canCheckin
                      ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-slate-950 shadow-amber-500/30'
                      : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 cursor-not-allowed'
                  }`}
                >
                  {dailyClaiming ? 'Proses...' : canCheckin ? 'Klaim +10 PTS' : 'Selesai ✓'}
                </button>
              </div>
            </div>

            <div className="glass-card p-4 rounded-[28px] border border-white/10 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black text-white uppercase tracking-wider">Streak Absen Beruntun</p>
                <span className="text-[9px] text-amber-400 font-extrabold">+10 PTS / Hari</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {DAILY_STREAKS.map((s) => {
                  const isClaimed = !canCheckin ? s.day <= checkinStreak : s.day < checkinStreak;
                  const isCurrentTarget = canCheckin && s.day === (checkinStreak + 1);
                  const isDay7 = s.day === 7;

                  return (
                    <div
                      key={s.day}
                      className={`p-2.5 rounded-2xl text-center border flex flex-col items-center justify-between relative overflow-hidden transition-all min-h-[84px] ${
                        isDay7 ? 'col-span-2 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-950/30 border-amber-400/60 text-amber-200' : ''
                      } ${
                        isClaimed
                          ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                          : isCurrentTarget
                          ? 'bg-amber-950/30 border-amber-400 text-amber-300 shadow-md shadow-amber-500/20'
                          : 'bg-[#050811] border-white/5 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[8px] font-black uppercase text-slate-400">{s.label}</span>
                        {isClaimed && (
                          <div className="w-3 h-3 text-emerald-400 flex items-center justify-center bg-emerald-500/20 rounded-full border border-emerald-500/40">
                            <IcoCheck/>
                          </div>
                        )}
                      </div>

                      <div className="w-4 h-4 text-amber-400 my-1">
                        <IcoStar/>
                      </div>

                      {isClaimed ? (
                        <span className="text-[8px] font-black text-emerald-400 uppercase">✓ Klaim</span>
                      ) : isCurrentTarget ? (
                        <span className="text-[8px] font-black text-amber-300 uppercase">Hari Ini</span>
                      ) : (
                        <span className="text-[9px] font-black text-amber-400 font-mono">+{s.pts} PTS</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'buy' && (
          <div className="space-y-3.5 animate-[fadeIn_0.25s_ease-out]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-black text-white">Beli VIP Access</h2>
                <p className="text-[10px] text-slate-400">Pilih durasi paket langganan Anda</p>
              </div>
              <span className="text-[9px] text-emerald-400 font-black bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                Official Store
              </span>
            </div>

            {isPrem ? (
              <div className="space-y-3.5">
                <div className="glass-card rounded-[28px] border border-emerald-500/30 p-5 text-center space-y-3 shadow-xl">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-inner">
                    <div className="w-7 h-7"><IcoCrown/></div>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[9px] font-black uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Status VIP Aktif
                    </span>
                    <h3 className="text-xs font-black text-white mt-1.5">Akses VIP Anda Sedang Berjalan</h3>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed max-w-xs mx-auto">
                      Pilihan pembelian paket baru akan terbuka secara otomatis saat masa aktif langganan habis.
                    </p>
                  </div>
                  {countdown && (
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <div className="bg-[#050811] border border-white/10 rounded-2xl py-2.5">
                        <p className="text-base font-black text-emerald-400 font-mono">{countdown.days}</p>
                        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Hari</p>
                      </div>
                      <div className="bg-[#050811] border border-white/10 rounded-2xl py-2.5">
                        <p className="text-base font-black text-emerald-400 font-mono">{countdown.hours}</p>
                        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Jam</p>
                      </div>
                      <div className="bg-[#050811] border border-white/10 rounded-2xl py-2.5">
                        <p className="text-base font-black text-emerald-400 font-mono">{countdown.minutes}</p>
                        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Menit</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="glass-card p-4 rounded-[28px] border border-white/10 space-y-2.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Keuntungan VIP Active</p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <div className="bg-[#050811] p-2.5 rounded-2xl border border-white/5 text-emerald-300 flex items-center gap-2 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>
                      Akses Fitur Premium
                    </div>
                    <div className="bg-[#050811] p-2.5 rounded-2xl border border-white/5 text-emerald-300 flex items-center gap-2 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>
                      Kecepatan Maksimal
                    </div>
                    <div className="bg-[#050811] p-2.5 rounded-2xl border border-white/5 text-emerald-300 flex items-center gap-2 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>
                      Tanpa Iklan / Delay
                    </div>
                    <div className="bg-[#050811] p-2.5 rounded-2xl border border-white/5 text-emerald-300 flex items-center gap-2 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>
                      Support Prioritas
                    </div>
                  </div>
                </div>
              </div>
            ) : !confirmStep ? (
              <>
                <div className="glass-card p-4 rounded-[28px] border border-emerald-500/30 space-y-2.5 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 text-emerald-400"><IcoShieldCheck/></div>
                    <span className="text-xs font-black text-white uppercase tracking-wider">Keuntungan Akses VIP</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <div className="bg-[#050811] p-2.5 rounded-2xl border border-white/5 text-emerald-300 flex items-center gap-2 text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>
                      Tanpa Batas Akses
                    </div>
                    <div className="bg-[#050811] p-2.5 rounded-2xl border border-white/5 text-emerald-300 flex items-center gap-2 text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>
                      Koneksi Cepat & Stabil
                    </div>
                    <div className="bg-[#050811] p-2.5 rounded-2xl border border-white/5 text-emerald-300 flex items-center gap-2 text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>
                      Bebas Iklan / Delay
                    </div>
                    <div className="bg-[#050811] p-2.5 rounded-2xl border border-white/5 text-emerald-300 flex items-center gap-2 text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>
                      Dukungan Prioritas
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between px-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pilih Paket VIP</p>
                  {isFlashActive && (
                    <span className="text-[9px] text-rose-400 font-black bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">Diskon Flash Sale</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {PACKAGES.map((p: any) => {
                    const originalPrice = p.price;
                    const itemPrice = isFlashActive ? Math.max(0, Math.floor(originalPrice * (1 - flashDiscount / 100))) : originalPrice;
                    const isSelected = selectedPkg === p.id;

                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPkg(p.id)}
                        className={`p-3.5 rounded-2xl text-left border-2 transition-all active:scale-95 relative overflow-hidden flex flex-col justify-between ${
                          isSelected
                            ? 'bg-gradient-to-br from-emerald-500/20 via-teal-950/40 to-[#0A0F1A] border-emerald-400 text-white shadow-xl shadow-emerald-500/15'
                            : 'glass-card border-white/10 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        {p.id === '30D' && (
                          <span className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-orange-500 text-[8px] font-black uppercase text-slate-950 px-2.5 py-0.5 rounded-bl-xl shadow-md">
                            Best Value
                          </span>
                        )}
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-slate-500'}`}>
                            <div className="w-3.5 h-3.5"><IcoCrown/></div>
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-100 leading-tight">{p.label}</p>
                            <p className="text-[9px] text-slate-400 font-medium">{p.days} Hari VIP</p>
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-white/5 flex items-baseline gap-1.5">
                          <p className="text-xs font-black text-emerald-400 font-mono">Rp {itemPrice.toLocaleString('id-ID')}</p>
                          {isFlashActive && (
                            <p className="text-[8px] text-slate-500 line-through font-bold font-mono">Rp {originalPrice.toLocaleString('id-ID')}</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="glass-card p-4 rounded-[28px] border border-white/10 space-y-2.5 shadow-xl">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pilih Metode Pembayaran</p>
                  <div className="grid grid-cols-3 gap-2">
                    {METHODS.map(m => (
                      <button
                        key={m.id}
                        onClick={() => setPayMethod(m.id)}
                        className={`p-2.5 rounded-2xl text-center border-2 transition-all active:scale-95 flex flex-col items-center justify-center gap-1 ${
                          payMethod === m.id
                            ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/15'
                            : 'bg-[#050811] border-white/5 text-slate-400'
                        }`}
                      >
                        <span className="text-xs font-black">{m.id}</span>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${payMethod === m.id ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' : 'bg-white/5 border-white/5 text-slate-400'}`}>
                          {m.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setConfirmStep(true)}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider active:scale-[0.98] shadow-lg shadow-emerald-500/30 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  Lanjut Pembayaran
                  <span className="opacity-60">•</span>
                  <span className="font-mono">Rp {pkg.price.toLocaleString('id-ID')}</span>
                </button>
              </>
            ) : (
              <div className="glass-card p-5 rounded-[32px] space-y-4 border border-white/10 shadow-xl">
                <div className="text-center pb-3 border-b border-white/10 space-y-1">
                  <span className="px-3 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[9px] font-black rounded-full inline-block">
                    ✓ Konfirmasi Instan Admin
                  </span>
                  <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest pt-1">Total Tagihan</p>
                  <p className="text-xl font-black text-emerald-400 font-mono">Rp {pkg.price.toLocaleString('id-ID')}</p>
                  <p className="text-xs font-bold text-slate-300">{pkg.label} • Metode {payMethod}</p>
                </div>

                {payMethod === 'QRIS' && (
                  <div className="bg-[#050811] border border-emerald-500/25 p-3.5 rounded-2xl text-center space-y-2.5">
                    <p className="text-[10px] text-emerald-400 font-black uppercase tracking-wider">Scan QRIS All Payment</p>

                    <div className="relative w-40 h-40 mx-auto bg-white p-2 rounded-2xl shadow-xl flex items-center justify-center border-2 border-emerald-400">
                      <img
                        src={QRIS_IMAGE_URL}
                        alt="QRIS Payment"
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>

                    <div className="flex gap-2 justify-center pt-1">
                      <button
                        onClick={() => setQrisZoomOpen(true)}
                        className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-xl flex items-center gap-1.5 active:scale-95 transition-all"
                      >
                        <div className="w-3.5 h-3.5"><IcoZoom/></div>
                        Perbesar
                      </button>

                      <button
                        onClick={downloadQrisImage}
                        className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 active:scale-95 transition-all"
                      >
                        <div className="w-3.5 h-3.5"><IcoDownload/></div>
                        Unduh Gambar
                      </button>
                    </div>
                  </div>
                )}

                {payMethod === 'DANA' && (
                  <div className="bg-[#050811] border border-emerald-500/25 p-3.5 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-bold">Transfer DANA</span>
                      <span className="text-emerald-400 font-black">A/n TI** SUT***</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#0A0F1A] p-3 rounded-xl border border-white/5">
                      <span className="font-mono text-xs font-black text-white tracking-wider">083124469855</span>
                      <button
                        onClick={() => copyPayNumber('083124469855')}
                        className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black rounded-lg active:scale-95 transition-transform"
                      >
                        {copiedNum === '083124469855' ? 'Tercopy' : 'Salin'}
                      </button>
                    </div>
                  </div>
                )}

                {payMethod === 'SEABANK' && (
                  <div className="bg-[#050811] border border-emerald-500/25 p-3.5 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-bold">No. Rekening SeaBank</span>
                      <span className="text-emerald-400 font-black">A/n HAR*****O</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#0A0F1A] p-3 rounded-xl border border-white/5">
                      <span className="font-mono text-xs font-black text-white tracking-wider">901984771499</span>
                      <button
                        onClick={() => copyPayNumber('901984771499')}
                        className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black rounded-lg active:scale-95 transition-transform"
                      >
                        {copiedNum === '901984771499' ? 'Tercopy' : 'Salin'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Upload Bukti Pembayaran</p>
                  <label className="w-full h-24 border border-dashed border-white/20 hover:border-emerald-500/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-[#050811] overflow-hidden relative transition-all shadow-inner">
                    {proofImage ? (
                      <img src={proofImage} alt="Bukti" className="w-full h-full object-contain p-2"/>
                    ) : (
                      <div className="text-center text-slate-500 space-y-1">
                        <div className="w-5 h-5 mx-auto text-emerald-400"><IcoUpload/></div>
                        <span className="text-xs font-bold text-slate-400">Pilih Foto Bukti Transfer</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden"/>
                  </label>
                </div>

                <input
                  type="text"
                  placeholder="Catatan / Nama Pengirim..."
                  value={proofNote}
                  onChange={e => setProofNote(e.target.value)}
                  className="w-full bg-[#050811] border border-white/10 text-white placeholder-slate-600 px-3.5 py-2.5 rounded-2xl text-xs font-medium focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner"
                />

                <div className="grid grid-cols-[0.8fr_1.4fr] gap-2.5 pt-1">
                  <button onClick={() => setConfirmStep(false)} className="py-3 bg-white/5 border border-white/10 text-slate-300 font-extrabold rounded-2xl text-xs uppercase tracking-wider active:scale-95 transition-all">
                    Kembali
                  </button>
                  <button
                    onClick={submit}
                    disabled={submitting || !proofNote.trim() || !proofImage}
                    className="py-3 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl disabled:opacity-40 active:scale-[0.98] shadow-lg shadow-emerald-500/25 transition-all"
                  >
                    {submitting ? 'Mengirim...' : 'Kirim Bukti'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'redeem' && (
          <div className="space-y-3.5 animate-[fadeIn_0.25s_ease-out]">

            <div className="glass-card border border-amber-500/30 p-4.5 rounded-[28px] relative overflow-hidden shadow-xl space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-amber-400/90">Bonus & Referral Program</span>
                  <h2 className="text-xl font-black mt-0.5 text-white font-mono">{userPoints} PTS</h2>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">+50 Poin per Teman bergabung</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                  <div className="w-5 h-5"><IcoStar/></div>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={copyReferral}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <div className="w-3.5 h-3.5"><IcoCopy/></div>
                  {copied ? 'Tercopy!' : 'Salin Link'}
                </button>
                <button
                  onClick={shareToTelegram}
                  className="py-2.5 px-4 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs rounded-2xl flex items-center gap-1.5 active:scale-95 shadow-md shadow-amber-500/20 transition-all"
                >
                  <div className="w-3.5 h-3.5"><IcoShare/></div>
                  Bagikan
                </button>
              </div>
            </div>

            {userVouchers.length > 0 && (
              <div className="glass-card border border-white/10 p-4 rounded-[28px] space-y-2 shadow-xl">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Voucher Milik Anda ({userVouchers.length})</p>
                {userVouchers.map((v: any, idx: number) => (
                  <div key={idx} className="bg-[#050811] border border-white/5 p-3 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="font-mono text-xs font-black text-amber-300 tracking-wider">{v.code}</p>
                      <p className="text-[10px] text-emerald-400 font-bold">Diskon {v.discount}% VIP Access</p>
                    </div>
                    <button
                      onClick={() => copyVoucherCode(v.code)}
                      className="px-3 py-1 bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded-xl active:scale-95 transition-all"
                    >
                      {copiedVoucher === v.code ? 'Disalin' : 'Salin Kode'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="glass-card border border-white/10 p-4 rounded-[28px] space-y-3 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">Katalog Penukaran Poin</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Geser ke samping untuk opsi →</p>
                </div>
                <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 font-black text-[10px] rounded-full font-mono">
                  {userPoints} PTS
                </span>
              </div>

              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 pt-1">
                {REDEEM_OPTIONS.map(opt => {
                  const canRedeem = userPoints >= opt.points;
                  const progressPct = Math.min((userPoints / opt.points) * 100, 100);

                  return (
                    <div key={opt.id} className="min-w-[200px] max-w-[200px] shrink-0">
                      <div className={`rounded-[24px] border overflow-hidden relative ${
                        canRedeem
                          ? 'bg-[#050811] border-amber-500/40 shadow-lg shadow-amber-500/10'
                          : 'bg-[#050811] border-white/5'
                      }`}>
                        <div className="p-3.5 pb-2.5 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                              canRedeem ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-white/5 text-slate-500 border-white/5'
                            }`}>
                              {opt.badge}
                            </span>
                            <div className={canRedeem ? 'text-amber-400' : 'text-slate-600'}>
                              <div className="w-3.5 h-3.5">{opt.isVoucher ? <IcoTag/> : <IcoStar/>}</div>
                            </div>
                          </div>
                          <p className={`text-xs font-black leading-snug ${canRedeem ? 'text-white' : 'text-slate-400'}`}>{opt.label}</p>
                          <p className="text-[9px] text-slate-500 leading-relaxed h-7 overflow-hidden font-medium">{opt.desc}</p>
                        </div>

                        <div className="relative flex items-center px-3">
                          <div className="ticket-notch left"/>
                          <div className="ticket-divider flex-1"/>
                          <div className="ticket-notch right"/>
                        </div>

                        <div className="p-3.5 pt-2.5 space-y-2">
                          <div className="flex items-baseline justify-between">
                            <p className={`text-sm font-black font-mono ${canRedeem ? 'text-amber-400' : 'text-slate-500'}`}>{opt.points}</p>
                            <span className="text-[8px] text-slate-500 font-bold uppercase">Poin</span>
                          </div>

                          {!canRedeem && (
                            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                              <div className="h-full bg-amber-500/50 rounded-full" style={{ width: `${progressPct}%` }} />
                            </div>
                          )}

                          <button
                            onClick={() => setRedeemConfirmItem(opt)}
                            disabled={!canRedeem}
                            className={`w-full py-2 font-black text-[11px] uppercase tracking-wider rounded-xl transition-all active:scale-95 ${
                              canRedeem
                                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
                                : 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                            }`}
                          >
                            {canRedeem ? 'Tukar' : `Kurang ${opt.points - userPoints} PTS`}
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

        {activeTab === 'profile' && (
          <div className="space-y-3.5 animate-[fadeIn_0.25s_ease-out]">

            <div className="relative rounded-[28px] overflow-hidden border border-white/10 glass-card shadow-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-300 via-fuchsia-500 to-violet-500 p-0.5 shadow-lg shrink-0">
                  <div className="w-full h-full rounded-[14px] bg-[#050811] flex items-center justify-center font-black text-white text-base overflow-hidden">
                    {tgUser?.photo_url ? <img src={tgUser.photo_url} className="w-full h-full object-cover" alt=""/> : initials}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-white truncate leading-tight">{displayName}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">@{userUsername}</p>
                  {badge && (
                    <span
                      className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full text-[8px] font-black border uppercase tracking-wider"
                      style={{ color: badge.color, borderColor: `${badge.color}55`, backgroundColor: `${badge.color}18` }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: badge.color }} />
                      {badge.label}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10 text-center">
                <div className="bg-[#050811] p-2 rounded-xl border border-white/5">
                  <p className="text-sm font-black text-amber-400 font-mono leading-none">{userPoints}</p>
                  <p className="text-[8px] text-slate-400 font-black uppercase tracking-wider mt-1">Poin</p>
                </div>
                <div className="bg-[#050811] p-2 rounded-xl border border-white/5">
                  <p className="text-sm font-black text-violet-400 font-mono leading-none">{userStatus?.referralCount || 0}</p>
                  <p className="text-[8px] text-slate-400 font-black uppercase tracking-wider mt-1">Referral</p>
                </div>
                <div className="bg-[#050811] p-2 rounded-xl border border-white/5">
                  <p className="text-sm font-black text-emerald-400 font-mono leading-none">{checkinStreak}</p>
                  <p className="text-[8px] text-slate-400 font-black uppercase tracking-wider mt-1">Streak</p>
                </div>
              </div>
            </div>

            <div className="glass-card border border-white/10 p-1 rounded-2xl flex gap-1">
              {(['overview', 'history', 'settings'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setProfileSubTab(t)}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                    profileSubTab === t
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t === 'overview' ? 'Ringkasan' : t === 'history' ? 'Riwayat' : 'Pengaturan'}
                </button>
              ))}
            </div>

            {profileSubTab === 'overview' && (
              <div className="space-y-3.5 animate-[fadeIn_0.25s_ease-out]">

                <div className="glass-card border border-white/10 p-4 rounded-[28px] space-y-3 shadow-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <div className="w-3.5 h-3.5"><IcoTarget/></div>
                    </div>
                    <div>
                      <h2 className="text-xs font-black text-white">Misi Harian</h2>
                      <p className="text-[10px] text-slate-400">Selesaikan misi untuk poin ekstra</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[
                      { key: 'visit', label: 'Buka aplikasi hari ini', pts: 0, done: true },
                      { key: 'checkin', label: 'Klaim bonus check-in harian', pts: 10, done: !!userStatus?.missionsDone?.checkin },
                      { key: 'redeem', label: 'Tukar poin dengan reward', pts: 0, done: !!userStatus?.missionsDone?.redeem },
                    ].map((m) => (
                      <div key={m.key} className={`flex items-center justify-between p-2.5 rounded-2xl border ${m.done ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-[#050811] border-white/5'}`}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 ${m.done ? 'bg-emerald-500 text-slate-950' : 'bg-white/5 text-slate-600'}`}>
                            {m.done && <div className="w-2.5 h-2.5"><IcoCheck/></div>}
                          </div>
                          <p className={`text-xs font-bold ${m.done ? 'text-emerald-300' : 'text-slate-300'}`}>{m.label}</p>
                        </div>
                        {m.pts > 0 && <span className="text-xs font-black text-amber-400 font-mono">+{m.pts}</span>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card border border-white/10 p-4 rounded-[28px] space-y-3 shadow-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                      <div className="w-3.5 h-3.5"><IcoUsers/></div>
                    </div>
                    <div>
                      <h2 className="text-xs font-black text-white">Program Ajak Teman</h2>
                      <p className="text-[10px] text-slate-400">Dapatkan +50 Poin per teman bergabung</p>
                    </div>
                  </div>

                  <div className="bg-[#050811] border border-white/10 rounded-2xl p-2.5 flex items-center justify-between gap-2">
                    <p className="text-[10px] font-mono text-slate-400 truncate">t.me/fixeedredbot?start=ref_{userTelegramId}</p>
                    <button onClick={copyReferral} className="px-2.5 py-1 bg-violet-500/20 border border-violet-500/30 text-violet-300 rounded-lg text-xs font-bold shrink-0 active:scale-95 transition-all">
                      {copied ? 'Disalin!' : 'Salin'}
                    </button>
                  </div>

                  <button onClick={shareToTelegram} className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl active:scale-[0.98] shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center gap-2">
                    <div className="w-3.5 h-3.5"><IcoShare/></div>
                    Bagikan ke Telegram
                  </button>
                </div>

              </div>
            )}

            {profileSubTab === 'history' && (
              <div className="glass-card border border-white/10 p-4 rounded-[28px] space-y-3 shadow-xl animate-[fadeIn_0.25s_ease-out]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                    <div className="w-3.5 h-3.5"><IcoClock/></div>
                  </div>
                  <div>
                    <h2 className="text-xs font-black text-white">Riwayat Transaksi</h2>
                    <p className="text-[10px] text-slate-400">Aktivitas poin & pembelian Anda</p>
                  </div>
                </div>

                {historyLoading ? (
                  <div className="py-6 text-center">
                    <p className="text-xs text-slate-500">Memuat riwayat...</p>
                  </div>
                ) : history.length === 0 ? (
                  <div className="py-6 text-center border border-dashed border-white/10 rounded-2xl">
                    <p className="text-xs text-slate-500">Belum ada riwayat aktivitas</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {history.map((h: any, i: number) => (
                      <div key={i} className="flex items-center gap-2.5 p-2.5 bg-[#050811] border border-white/5 rounded-2xl">
                        <span className="text-sm shrink-0">📌</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-200 truncate">{h.label}</p>
                          <p className="text-[9px] text-slate-500">{new Date(h.timestamp).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        {typeof h.points === 'number' && h.points !== 0 && (
                          <span className={`text-xs font-black font-mono shrink-0 ${h.points > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {h.points > 0 ? '+' : ''}{h.points} PTS
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {profileSubTab === 'settings' && (
              <div className="glass-card border border-white/10 p-4 rounded-[28px] space-y-3 shadow-xl animate-[fadeIn_0.25s_ease-out]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                    <div className="w-3.5 h-3.5"><IcoUserCircle/></div>
                  </div>
                  <div>
                    <h2 className="text-xs font-black text-white">Info Akun</h2>
                    <p className="text-[10px] text-slate-400">Rincian identitas Telegram</p>
                  </div>
                </div>
                <div className="bg-[#050811] border border-white/5 rounded-2xl divide-y divide-white/5">
                  <div className="flex items-center justify-between p-3">
                    <span className="text-xs text-slate-400 font-medium">Telegram ID</span>
                    <span className="text-xs text-slate-200 font-mono font-bold">{userTelegramId}</span>
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <span className="text-xs text-slate-400 font-medium">Username</span>
                    <span className="text-xs text-slate-200 font-mono font-bold">@{userUsername}</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          aria-label="Support"
          className="fixed right-4 bottom-24 z-30 h-10 px-3.5 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-purple-600 text-white flex items-center gap-2 shadow-lg shadow-purple-900/40 border border-white/20 active:scale-95 transition-all"
        >
          <span className="relative w-4 h-4 block">
            <IcoChat />
            {chatUnread > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[14px] h-3.5 px-0.5 rounded-full bg-rose-500 text-[8px] font-black flex items-center justify-center leading-none">
                {chatUnread > 9 ? '9+' : chatUnread}
              </span>
            )}
          </span>
          <span className="text-[11px] font-black tracking-wide">Support</span>
        </button>
      )}

      <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-sm">
        <div className="glass bg-[#080D1A]/90 rounded-full p-1.5 border border-white/15 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.9)] gap-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-2 rounded-full flex flex-col items-center justify-center gap-1 text-[9px] font-black transition-all active:scale-95 ${
              activeTab === 'dashboard' ? 'bg-white text-slate-950 shadow-md shadow-white/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="w-4 h-4"><IcoHome/></div>
            <span>Home</span>
          </button>

          <button
            onClick={() => { setActiveTab('buy'); setConfirmStep(false); }}
            className={`flex-1 py-2 rounded-full flex flex-col items-center justify-center gap-1 text-[9px] font-black transition-all active:scale-95 ${
              activeTab === 'buy' ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="w-4 h-4"><IcoStore/></div>
            <span>Store</span>
          </button>

          <button
            onClick={() => setActiveTab('checkin')}
            className={`flex-1 py-2 rounded-full flex flex-col items-center justify-center gap-1 text-[9px] font-black transition-all active:scale-95 ${
              activeTab === 'checkin' ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="w-4 h-4"><IcoCalendar/></div>
            <span>Absen</span>
          </button>

          <button
            onClick={() => setActiveTab('redeem')}
            className={`flex-1 py-2 rounded-full flex flex-col items-center justify-center gap-1 text-[9px] font-black transition-all active:scale-95 ${
              activeTab === 'redeem' ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="w-4 h-4"><IcoGift/></div>
            <span>Poin</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 rounded-full flex flex-col items-center justify-center gap-1 text-[9px] font-black transition-all active:scale-95 ${
              activeTab === 'profile' ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="w-4 h-4"><IcoUserCircle/></div>
            <span>Profil</span>
          </button>
        </div>
      </nav>

      {redeemConfirmItem && (
        <div className="fixed inset-0 z-50 bg-[#04060C]/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease-out]" onClick={() => setRedeemConfirmItem(null)}>
          <div className="max-w-xs w-full bg-[#0B0F1A] p-5 rounded-[32px] space-y-3 border border-amber-500/30 text-center shadow-2xl animate-[scaleIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <div className="w-6 h-6"><IcoGift/></div>
            </div>

            <div>
              <h3 className="text-xs font-black text-white">Konfirmasi Penukaran Poin</h3>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                Tukar <span className="text-amber-400 font-bold font-mono">{redeemConfirmItem.points} PTS</span> untuk <span className="text-white font-bold">{redeemConfirmItem.label}</span>?
              </p>
            </div>

            <div className="grid grid-cols-[0.8fr_1.4fr] gap-2 pt-1">
              <button onClick={() => setRedeemConfirmItem(null)} className="py-2.5 bg-white/5 border border-white/10 text-slate-300 font-extrabold rounded-xl text-xs uppercase active:scale-95 transition-all">
                Batal
              </button>
              <button onClick={executeRedeem} disabled={redeeming} className="py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs uppercase rounded-xl active:scale-95 disabled:opacity-40 transition-all shadow-md">
                {redeeming ? '...' : 'Konfirmasi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {qrisZoomOpen && (
        <div className="fixed inset-0 z-50 bg-[#04060C]/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease-out]" onClick={() => setQrisZoomOpen(false)}>
          <div className="max-w-xs w-full bg-[#0B0F1A] p-4 rounded-[28px] space-y-3 border border-emerald-500/40 text-center shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="w-full aspect-square bg-white p-2 rounded-2xl shadow-xl flex items-center justify-center border-2 border-emerald-400">
              <img src={QRIS_IMAGE_URL} alt="QRIS Fullscreen" className="w-full h-full object-contain rounded-xl" />
            </div>
            <button onClick={() => setQrisZoomOpen(false)} className="w-full py-2.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-slate-950 font-black text-xs uppercase rounded-xl active:scale-95">
              Tutup
            </button>
          </div>
        </div>
      )}

      {chatOpen && (
        <div className="fixed inset-0 z-50 bg-[#04060C] flex flex-col h-[100dvh] animate-[fadeIn_0.15s_ease-out]">
          <div className="shrink-0 flex items-center gap-3 px-4 pb-3 pt-[max(16px,env(safe-area-inset-top))] border-b border-white/10 bg-[#0B0F1A]">
            <button onClick={() => setChatOpen(false)} className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 shrink-0">
              ←
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-white">Customer Support</p>
              <p className="text-[10px] text-slate-400">Owner membalas pesan secara cepat</p>
            </div>
          </div>

          {chatError && (
            <div className="px-4 py-2 bg-rose-500/15 border-b border-rose-500/25 text-[10px] font-semibold text-rose-300 text-center">
              {chatError}
            </div>
          )}

          <div ref={chatScrollRef} onScroll={handleChatScroll} className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-2 bg-[#04060C]">
            {chatLoading && chatMessages.length === 0 ? (
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
                const isUser = m.sender_type === 'user';
                return (
                  <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-3.5 py-2 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-2xl rounded-br-xs'
                        : 'bg-[#121828] text-slate-100 rounded-2xl rounded-bl-xs border border-white/10'
                    }`}>
                      <p className="whitespace-pre-wrap break-words">{m.message}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="shrink-0 p-3 border-t border-white/10 bg-[#0B0F1A] flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
              placeholder="Tulis pesan..."
              className="flex-1 bg-[#050811] border border-white/10 text-white px-3.5 py-2 rounded-xl text-xs focus:outline-none"
            />
            <button onClick={sendChatMessage} disabled={chatSending || !chatInput.trim()} className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-black rounded-xl shrink-0">
              Kirim
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
