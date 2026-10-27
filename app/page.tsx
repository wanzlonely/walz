'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PACKAGES } from '@/lib/packages';

export default function StoreUI() {
  const router = useRouter();
  const [initData, setInitData] = useState('');
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState<any>(null);
  const [selectedPkg, setSelectedPkg] = useState(PACKAGES[0]?.id || '3D');
  const [submitting, setSubmitting] = useState(false);
  const [activePayment, setActivePayment] = useState<any>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.ready();
      tg.expand();
      const raw = tg.initData || '';
      setInitData(raw);
      checkStatus(raw);
    } else {
      checkStatus('');
    }
  }, []);

  const checkStatus = async (raw: string) => {
    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData: raw, action: 'check_status' }),
      });
      const d = await res.json();
      if (res.ok) {
        if (d.isAdmin) {
          router.push('/admin');
          return;
        }
        setUserStatus(d.user);
        if (d.pendingOrder?.qr_string) setActivePayment(d.pendingOrder);
      }
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async () => {
    if (submitting) return;
    setSubmitting(true);
    setMsg('');
    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, action: 'create_payment', packageId: selectedPkg }),
      });
      const data = await res.json();
      if (res.ok && data.order) {
        setActivePayment(data.order);
        setMsg('QRIS siap. Scan untuk bayar.');
      } else {
        setMsg(data.error || 'Gagal membuat QRIS');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const pollPayment = async () => {
    const res = await fetch('/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        initData,
        action: 'check_payment',
        transactionId: activePayment?.transactionId,
      }),
    });
    const data = await res.json();
    if (data.status === 'paid') {
      setActivePayment(null);
      setUserStatus(data.user);
      setMsg('Pembayaran berhasil! VIP aktif.');
      checkStatus(initData);
    } else if (data.status === 'expired' || data.status === 'cancel') {
      setActivePayment(null);
      setMsg('Transaksi berakhir.');
    } else {
      setMsg('Masih menunggu pembayaran...');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060810] flex items-center justify-center text-emerald-400 text-sm font-bold">
        WALZSHOP
      </div>
    );
  }

  const pkg = PACKAGES.find((p) => p.id === selectedPkg) || PACKAGES[0];

  return (
    <div className="min-h-screen bg-[#060810] text-slate-100 p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-lg font-black text-center pt-4">WALZSHOP</h1>
      <p className="text-center text-xs text-slate-400">
        Status: {userStatus?.status || 'FREE'} · Poin: {userStatus?.points ?? '-'}
      </p>

      {!activePayment ? (
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase">Pilih Paket</p>
          <div className="grid grid-cols-2 gap-2">
            {PACKAGES.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPkg(p.id)}
                className={`p-3 rounded-2xl border text-left ${
                  selectedPkg === p.id
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : 'border-white/10 bg-[#0D121F]'
                }`}
              >
                <p className="text-xs font-black">{p.label}</p>
                <p className="text-sm font-mono text-emerald-400">Rp {p.price.toLocaleString('id-ID')}</p>
              </button>
            ))}
          </div>
          <button
            onClick={createPayment}
            disabled={submitting}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-black text-xs uppercase disabled:opacity-50"
          >
            {submitting ? 'Membuat QRIS...' : `Bayar QRIS · Rp ${pkg.price.toLocaleString('id-ID')}`}
          </button>
        </div>
      ) : (
        <div className="space-y-3 bg-[#0D121F] p-4 rounded-3xl border border-emerald-500/30 text-center">
          <p className="text-xs font-black text-emerald-400">Scan QRIS</p>
          <p className="text-lg font-mono font-black text-white">
            Rp {Number(activePayment.amount).toLocaleString('id-ID')}
          </p>
          {activePayment.qr_string ? (
            <img
              className="mx-auto w-48 h-48 bg-white p-2 rounded-xl"
              alt="QRIS"
              src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(activePayment.qr_string)}`}
            />
          ) : null}
          <p className="text-[9px] text-slate-500 font-mono break-all">{activePayment.transactionId}</p>
          <button
            onClick={pollPayment}
            className="w-full py-3 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs uppercase"
          >
            Saya Sudah Bayar / Cek Status
          </button>
        </div>
      )}

      {msg ? <p className="text-center text-xs text-amber-300">{msg}</p> : null}
      <p className="text-center text-[10px] text-slate-600 pt-4">
        UI ringkas aktif. Upload file penuh dari artifacts bila perlu tampilan lengkap.
      </p>
    </div>
  );
}
