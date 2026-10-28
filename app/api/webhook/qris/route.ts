import { NextResponse } from 'next/server';
import { redis, PACKAGES } from '@/lib/utils';

async function activateVip(userKey: string, userData: any, days: number, telegramId: string, orderMeta: any) {
  let baseDate = new Date();
  if (userData.status === 'ACTIVE' && userData.expiredAt && new Date(userData.expiredAt).getTime() > Date.now()) {
    baseDate = new Date(userData.expiredAt);
  }
  baseDate.setTime(baseDate.getTime() + days * 24 * 60 * 60 * 1000);
  userData.status = 'ACTIVE';
  userData.expiredAt = baseDate.toISOString();
  userData.totalDaysPurchased = (userData.totalDaysPurchased || 0) + days;
  userData.updatedAt = new Date().toISOString();
  await redis.set(userKey, JSON.stringify(userData));

  try {
    const key = `history:${telegramId}`;
    const raw = await redis.get<string | object>(key);
    let history: any[] = raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : [];
    history.unshift({
      type: 'PURCHASE',
      label: `Beli VIP ${days} Hari (QRIS)`,
      days,
      timestamp: new Date().toISOString(),
    });
    if (history.length > 50) history = history.slice(0, 50);
    await redis.set(key, JSON.stringify(history));
  } catch {}

  const botToken = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || '';
  const adminId = process.env.ADMIN_TELEGRAM_ID || '';
  if (botToken && adminId) {
    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: adminId,
          text:
            `✅ *PEMBAYARAN QRIS BERHASIL (Webhook)*\n\n` +
            `Order: \`${orderMeta.orderCode}\`\n` +
            `User ID: \`${telegramId}\`\n` +
            `Paket: *${orderMeta.packageLabel}*\n` +
            `Total: Rp ${Number(orderMeta.amount).toLocaleString('id-ID')}`,
          parse_mode: 'Markdown',
        }),
      });
    } catch {}
  }

  return userData;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const event = body?.event;
    const orderCode = body?.orderCode || body?.code;

    if (event && event !== 'order.paid') {
      return NextResponse.json({ ok: true, ignored: true });
    }

    if (!orderCode) {
      return NextResponse.json({ error: 'orderCode wajib' }, { status: 400 });
    }

    const raw = await redis.get<string | object>(`trx:${orderCode}`);
    if (!raw) {
      return NextResponse.json({ ok: true, note: 'order not found locally' });
    }

    const order: any = typeof raw === 'string' ? JSON.parse(raw) : raw;

    if (order.status === 'PAID') {
      return NextResponse.json({ ok: true, alreadyPaid: true });
    }

    const telegramId = String(order.telegramId || '');
    if (!telegramId) {
      return NextResponse.json({ error: 'telegramId missing on order' }, { status: 400 });
    }

    order.status = 'PAID';
    order.paidAt = body?.paidAt || new Date().toISOString();
    await redis.set(`trx:${orderCode}`, JSON.stringify(order));
    await redis.del(`pending_trx:${telegramId}`);

    const ordersRaw = await redis.get<string | object>('store:orders');
    let orders: any[] = ordersRaw
      ? typeof ordersRaw === 'string'
        ? JSON.parse(ordersRaw)
        : ordersRaw
      : [];
    orders = orders.map((o) =>
      o.transactionId === orderCode || o.orderId === orderCode
        ? { ...o, status: 'PAID', paidAt: order.paidAt }
        : o
    );
    await redis.set('store:orders', JSON.stringify(orders));

    const userKey = `user:${telegramId}`;
    const userRaw = await redis.get<string | object>(userKey);
    const userData: any = userRaw
      ? typeof userRaw === 'string'
        ? JSON.parse(userRaw)
        : userRaw
      : { telegramId, status: 'FREE', points: 50 };

    const days = order.durationDays || PACKAGES.find((p) => p.id === order.packageId)?.days || 3;

    await activateVip(userKey, userData, days, telegramId, {
      orderCode,
      packageLabel: order.packageLabel || order.packageId,
      amount: body?.amount ?? order.amount,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'webhook error' }, { status: 500 });
  }
}
