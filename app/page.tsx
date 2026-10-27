'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PACKAGES } from '@/lib/packages';
import { supabase } from '@/lib/supabase';

export default function StoreUI() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060810] flex items-center justify-center text-white">
        Memuat...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060810] text-slate-100 flex items-center justify-center p-6">
      <div className="text-center space-y-3 max-w-sm">
        <p className="text-lg font-black">WALZSHOP</p>
        <p className="text-sm text-slate-400">
          Backend Casaku sudah aktif. Silakan restore UI penuh dari file lokal atau minta Grok push page.tsx lengkap.
        </p>
        {error && <p className="text-rose-400 text-xs">{error}</p>}
      </div>
    </div>
  );
}
