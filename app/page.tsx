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

export default function StoreUI() {
  return (
    <div className="min-h-screen bg-[#060810] text-slate-100 flex items-center justify-center p-6">
      <div className="text-center space-y-3 max-w-sm">
        <p className="text-lg font-black">WALZSHOP</p>
        <p className="text-sm text-slate-400">
          Halaman sedang dipulihkan. Silakan refresh dalam beberapa menit atau restore file app/page.tsx dari commit ce38a05 di GitHub.
        </p>
        <a
          href="https://github.com/wanzlonely/walz/blob/ce38a05a2c4c48e1245c6b00ef761c24147a33f2/app/page.tsx"
          className="inline-block text-emerald-400 text-xs font-bold underline"
        >
          Buka versi lama di GitHub
        </a>
      </div>
    </div>
  );
}
