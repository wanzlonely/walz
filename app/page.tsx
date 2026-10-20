'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PACKAGES } from '@/lib/packages';
import { supabase } from '@/lib/supabase';

// RESTORE_MARKER - file too large for single update; see follow-up
export default function StoreUI() {
  return <div className="min-h-screen bg-[#060810] text-white p-8">Loading store…</div>;
}
