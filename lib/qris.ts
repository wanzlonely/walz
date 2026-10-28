const BASE = (process.env.QRIS_API_BASE_URL || '').replace(/\/$/, '');

function apiKey() {
  return process.env.QRIS_API_KEY || '';
}

async function qrisFetch(path: string, init?: RequestInit) {
  const key = apiKey();
  if (!key) throw new Error('QRIS_API_KEY belum diatur');
  if (!BASE) throw new Error('QRIS_API_BASE_URL belum diatur');

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': key,
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });

  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export type QrisCreateResult = {
  code: string;
  qrisString: string;
  totalAmount: number;
};

export async function createQrisOrder(amount: number, description: string): Promise<QrisCreateResult> {
  if (!amount || amount < 1) throw new Error('Nominal tidak valid');

  const { ok, status, data } = await qrisFetch('/api/v1/orders', {
    method: 'POST',
    body: JSON.stringify({
      amount: Math.round(amount),
      description: description || 'Order WALZSHOP',
    }),
  });

  if (!ok || !data?.code || !data?.qrisString) {
    const msg =
      data?.message ||
      data?.error ||
      (status === 401 || status === 403
        ? 'API Key tidak valid atau akses ditolak'
        : 'Gagal membuat QRIS');
    throw new Error(msg);
  }

  return {
    code: String(data.code),
    qrisString: String(data.qrisString),
    totalAmount: Number(data.totalAmount ?? amount),
  };
}

export async function getQrisOrderStatus(code: string): Promise<{
  code: string;
  status: string;
  paidAt?: string;
  totalAmount?: number;
}> {
  if (!code) throw new Error('order code wajib');

  const { ok, data } = await qrisFetch(`/api/v1/orders/${encodeURIComponent(code)}`, {
    method: 'GET',
  });

  if (!ok) {
    throw new Error(data?.message || data?.error || 'Gagal cek status order');
  }

  return {
    code,
    status: String(data?.status || 'pending').toLowerCase(),
    paidAt: data?.paidAt,
    totalAmount: data?.totalAmount != null ? Number(data.totalAmount) : undefined,
  };
}
