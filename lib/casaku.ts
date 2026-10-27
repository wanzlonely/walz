const CASAKU_BASE = 'https://api.casaku.id';

function licenseKey() {
  return process.env.CASAKU_LICENSE_KEY || '';
}

function qrisId() {
  return process.env.CASAKU_QRIS_ID || '';
}

function prefix() {
  return (process.env.CASAKU_PREFIX || 'WALZ').slice(0, 8);
}

function expiredMinutes() {
  const n = parseInt(process.env.CASAKU_EXPIRED_MINUTES || '15', 10);
  return Number.isFinite(n) && n > 0 ? n : 15;
}

async function casakuFetch(path: string, init?: RequestInit) {
  const key = licenseKey();
  if (!key) {
    throw new Error('CASAKU_LICENSE_KEY belum diatur');
  }
  const res = await fetch(`${CASAKU_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-license-key': key,
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export type CasakuGenerateResult = {
  transactionId: string;
  originalAmount: number;
  totalAmount: number;
  uniqueNominal: number;
  qr_string: string;
  payment_url?: string;
  status?: string;
  expiredInMinutes?: number;
};

export async function generateQris(amount: number): Promise<CasakuGenerateResult> {
  const id = qrisId();
  if (!id) {
    throw new Error('CASAKU_QRIS_ID belum diatur');
  }
  if (!amount || amount < 1) {
    throw new Error('Nominal tidak valid');
  }

  const body = {
    qr_id: id,
    amount: Math.round(amount),
    useUniqueCode: true,
    packageIds: ['id.dana', 'com.shopee.id', 'id.gopay'],
    expiredInMinutes: expiredMinutes(),
    qrType: 'dynamic',
    paymentMethod: 'qris',
    useQris: true,
    prefix: prefix(),
  };

  const { ok, status, data } = await casakuFetch('/api/generate/v2/qris', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (!ok || data?.status !== 200 || !data?.data?.transactionId) {
    const msg =
      data?.message ||
      (status === 403
        ? 'Aplikasi listener Casaku sedang offline. Buka aplikasi Casaku di HP.'
        : 'Gagal membuat QRIS');
    throw new Error(msg);
  }

  const d = data.data;
  return {
    transactionId: d.transactionId,
    originalAmount: d.originalAmount ?? amount,
    totalAmount: d.totalAmount ?? amount,
    uniqueNominal: d.uniqueNominal ?? 0,
    qr_string: d.qr_string || '',
    payment_url: d.payment_url,
    status: d.status || 'pending',
    expiredInMinutes: d.expiredInMinutes ?? expiredMinutes(),
  };
}

export async function checkTransactionStatus(transactionId: string): Promise<{
  transactionId: string;
  amount?: number;
  status: string;
  expiredAt?: string;
}> {
  if (!transactionId) throw new Error('transactionId wajib');

  const { ok, data } = await casakuFetch('/api/generate/check-status', {
    method: 'POST',
    body: JSON.stringify({ transactionId }),
  });

  if (!ok || data?.status !== 200 || !data?.data) {
    throw new Error(data?.message || 'Gagal cek status transaksi');
  }

  return {
    transactionId: data.data.transactionId || transactionId,
    amount: data.data.amount,
    status: (data.data.status || 'pending').toLowerCase(),
    expiredAt: data.data.expiredAt,
  };
}

export async function cancelTransaction(transactionId: string): Promise<void> {
  if (!transactionId) return;
  await casakuFetch('/api/generate/cancel-status', {
    method: 'POST',
    body: JSON.stringify({ transactionId }),
  });
}

export async function checkDeviceOnline(): Promise<boolean> {
  try {
    const { ok, data } = await casakuFetch('/api/device/check', { method: 'GET' });
    if (!ok || data?.status !== 200) return true;
    if (data?.data?.requireListenerOnline === false) return true;
    return !!data?.data?.anyOnline;
  } catch {
    return true;
  }
}
