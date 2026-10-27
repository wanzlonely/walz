'use client';

import React from 'react';

export default function StoreUI() {
  return (
    <div className="min-h-screen bg-[#060810] text-slate-100 flex items-center justify-center p-6">
      <div className="text-center space-y-3 max-w-sm">
        <p className="text-lg font-black">WALZSHOP</p>
        <p className="text-sm text-slate-400 leading-relaxed">
          Upload file <span className="text-emerald-400 font-mono">page-payment-casaku-only.tsx</span> ke{' '}
          <span className="text-emerald-400 font-mono">app/page.tsx</span> (UI penuh + payment Casaku).
        </p>
        <p className="text-xs text-slate-500">
          Backend Casaku sudah siap. Hanya file UI yang perlu di-upload manual karena ukuran file besar.
        </p>
      </div>
    </div>
  );
}
