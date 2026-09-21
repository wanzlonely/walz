import { NextResponse } from 'next/server';
import { redis } from '@/lib/utils';
import { cookies } from 'next/headers';

async function addAuditLog(action: string, detail: string, telegramId: string) {
  try {
    const raw = await redis.get<string | object>('store:audit_logs');
    let logs: any[] = raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : [];
    logs.unshift({
      id: `LOG-${Date.now().toString(36).toUpperCase()}`,
      action,
      detail,
      telegramId,
      timestamp: new Date().toISOString(),
    });
    if (logs.length > 50) logs = logs.slice(0, 50);
    await redis.set('store:audit_logs', JSON.stringify(logs));
  } catch {}
}

export async function GET() {
  try {
    const keys = await redis.keys('user:*');
    const users: any[] = [];

    for (const key of keys) {
      const raw = await redis.get<string | object>(key);
      if (raw) {
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        const tgId = key.replace('user:', '');
        const profRaw = await redis.get<string | object>(`profile:${tgId}`);
        const profile = profRaw ? (typeof profRaw === 'string' ? JSON.parse(profRaw) : profRaw) : null;
        users.push({ ...parsed, telegramId: tgId, profile });
      }
    }

    const ordersRaw = await redis.get<string | object>('store:orders');
    const orders = ordersRaw ? (typeof ordersRaw === 'string' ? JSON.parse(ordersRaw) : ordersRaw) : [];

    const redeemRaw = await redis.get<string | object>('store:redeem_codes');
    const redeemCodes = redeemRaw ? (typeof redeemRaw === 'string' ? JSON.parse(redeemRaw) : redeemRaw) : [];

    const flashSaleRaw = await redis.get<string | object>('store:flash_sale');
    const flashSale = flashSaleRaw ? (typeof flashSaleRaw === 'string' ? JSON.parse(flashSaleRaw) : flashSaleRaw) : null;

    const auditRaw = await redis.get<string | object>('store:audit_logs');
    const auditLogs = auditRaw ? (typeof auditRaw === 'string' ? JSON.parse(auditRaw) : auditRaw) : [];

    return NextResponse.json({ users, orders, redeemCodes, flashSale, auditLogs });
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data admin' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, password, telegramId, orderId, decision, userAction, targetTelegramId, durationDays, broadcastMessage, code, days, usesLeft, dailyLimit, adminPin, flashPercent, flashHours, flashActive } = body;

    const adminId = process.env.ADMIN_TELEGRAM_ID || '';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
    const requiredPin = process.env.ADMIN_PIN || '1234';
    const botToken = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || '';

    if (action === 'login') {
      if (password === adminPass && (adminId ? telegramId === adminId : true)) {
        // Set cookie sesi admin agar /api/admin/chat (inbox owner) bisa diverifikasi.
        // Nilai token = ADMIN_SECRET_KEY (fallback ke ADMIN_PASSWORD bila belum diset).
        const token = process.env.ADMIN_SECRET_KEY || adminPass;
        const cookieStore = await cookies();
        cookieStore.set('admin_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        });
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: 'Password atau Telegram ID salah' }, { status: 401 });
    }

    if (action === 'logout') {
      const cookieStore = await cookies();
      cookieStore.delete('admin_token');
      return NextResponse.json({ success: true });
    }

    const pinProtectedActions = ['user_action', 'broadcast', 'create_redeem_code', 'delete_redeem_code', 'toggle_flash_sale'];
    if (pinProtectedActions.includes(action)) {
      if (!adminPin || adminPin !== requiredPin) {
        return NextResponse.json({ error: 'PIN Keamanan Admin tidak valid!' }, { status: 403 });
      }
    }

    if (action === 'order_action') {
      const ordersRaw = await redis.get<string | object>('store:orders');
      const orders: any[] = ordersRaw ? (typeof ordersRaw === 'string' ? JSON.parse(ordersRaw) : ordersRaw) : [];

      const idx = orders.findIndex((o: any) => o.orderId === orderId);
      if (idx !== -1) {
        const order = orders[idx];
        if (decision === 'approve') {
          order.status = 'APPROVED';
          const uKey = `user:${order.telegramId}`;
          const uRaw = await redis.get<string | object>(uKey);
          const uData: any = uRaw ? (typeof uRaw === 'string' ? JSON.parse(uRaw) : uRaw) : { telegramId: order.telegramId, points: 50 };

          let baseDate = new Date();
          if (uData.status === 'ACTIVE' && uData.expiredAt && new Date(uData.expiredAt).getTime() > Date.now()) {
            baseDate = new Date(uData.expiredAt);
          }
          baseDate.setTime(baseDate.getTime() + (order.durationDays || 3) * 24 * 60 * 60 * 1000);

          uData.status = 'ACTIVE';
          uData.expiredAt = baseDate.toISOString();
          uData.updatedAt = new Date().toISOString();
          uData.totalDaysPurchased = (uData.totalDaysPurchased || 0) + (order.durationDays || 3);
          await redis.set(uKey, JSON.stringify(uData));

          try {
            const hKey = `history:${order.telegramId}`;
            const hRaw = await redis.get<string | object>(hKey);
            let hist: any[] = hRaw ? (typeof hRaw === 'string' ? JSON.parse(hRaw) : hRaw) : [];
            hist.unshift({
              type: 'PURCHASE',
              label: `Pembelian Paket ${order.durationDays || 3} Hari (Rp ${order.amount})`,
              days: order.durationDays || 3,
              timestamp: new Date().toISOString(),
            });
            if (hist.length > 50) hist = hist.slice(0, 50);
            await redis.set(hKey, JSON.stringify(hist));
          } catch {}

          await addAuditLog('APPROVE_ORDER', `Order ${orderId} disetujui. Rp ${order.amount}`, order.telegramId);

          if (botToken) {
            try {
              await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: order.telegramId,
                  text: `🎉 *PEMBAYARAN DISETUJU*\n\nPesanan ID: \`${order.orderId}\` telah dikonfirmasi!\nMasa VIP Anda aktif hingga: ${new Date(uData.expiredAt).toLocaleString('id-ID')}`,
                  parse_mode: 'Markdown',
                }),
              });
            } catch {}
          }
        } else {
          order.status = 'REJECTED';
          await addAuditLog('REJECT_ORDER', `Order ${orderId} ditolak.`, order.telegramId);

          if (botToken) {
            try {
              await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: order.telegramId,
                  text: `❌ *PEMBAYARAN DITOLAK*\n\nPesanan ID: \`${order.orderId}\` tidak dapat dikonfirmasi. Silakan hubungi admin jika ini kesalahan.`,
                  parse_mode: 'Markdown',
                }),
              });
            } catch {}
          }
        }

        orders[idx] = order;
        await redis.set('store:orders', JSON.stringify(orders));
        await redis.del(`pending_trx:${order.telegramId}`);
      }
      return NextResponse.json({ success: true });
    }

    if (action === 'user_action') {
      const uKey = `user:${targetTelegramId}`;
      const uRaw = await redis.get<string | object>(uKey);
      const uData: any = uRaw ? (typeof uRaw === 'string' ? JSON.parse(uRaw) : uRaw) : { telegramId: targetTelegramId, points: 50 };

      if (userAction === 'grant_premium') {
        let baseDate = new Date();
        if (uData.status === 'ACTIVE' && uData.expiredAt && new Date(uData.expiredAt).getTime() > Date.now()) {
          baseDate = new Date(uData.expiredAt);
        }
        const addDays = parseInt(durationDays) || 30;
        baseDate.setTime(baseDate.getTime() + addDays * 24 * 60 * 60 * 1000);

        uData.status = 'ACTIVE';
        uData.expiredAt = baseDate.toISOString();
        uData.updatedAt = new Date().toISOString();
        await addAuditLog('ADMIN_GRANT_VIP', `Atur +${addDays} Hari VIP Manual`, targetTelegramId);
      } else if (userAction === 'revoke_premium') {
        uData.status = 'FREE';
        uData.expiredAt = null;
        uData.updatedAt = new Date().toISOString();
        await addAuditLog('ADMIN_REVOKE_VIP', `Cabut status VIP Manual`, targetTelegramId);
      } else if (userAction === 'ban') {
        uData.status = 'BANNED';
        uData.updatedAt = new Date().toISOString();
        await addAuditLog('ADMIN_BAN_USER', `Akun diblokir oleh Admin`, targetTelegramId);
      } else if (userAction === 'unban') {
        const isVip = uData.expiredAt && new Date(uData.expiredAt).getTime() > Date.now();
        uData.status = isVip ? 'ACTIVE' : 'FREE';
        uData.updatedAt = new Date().toISOString();
        await addAuditLog('ADMIN_UNBAN_USER', `Blokir akun dibuka oleh Admin`, targetTelegramId);
      }

      await redis.set(uKey, JSON.stringify(uData));
      return NextResponse.json({ success: true });
    }

    if (action === 'toggle_flash_sale') {
      const activeState = !!flashActive;
      const percent = parseInt(flashPercent) || 20;
      const hours = parseInt(flashHours) || 24;

      const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
      const flashObj = {
        active: activeState,
        discountPercent: percent,
        expiresAt,
        createdAt: new Date().toISOString(),
      };

      await redis.set('store:flash_sale', JSON.stringify(flashObj));
      await addAuditLog('FLASH_SALE_TOGGLE', `Flash Sale ${activeState ? 'Aktif' : 'Nonaktif'} (${percent}% Diskon)`, 'ADMIN');
      return NextResponse.json({ success: true, flashSale: flashObj });
    }

    if (action === 'broadcast') {
      if (!broadcastMessage || !botToken) {
        return NextResponse.json({ error: 'Pesan broadcast atau Bot Token tidak valid' }, { status: 400 });
      }

      const keys = await redis.keys('user:*');
      let successCount = 0;
      let failCount = 0;

      for (const key of keys) {
        const tgId = key.replace('user:', '');
        try {
          const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: tgId,
              text: `📢 *PENGUMUMAN OFFICIAL STORE*\n\n${broadcastMessage}`,
              parse_mode: 'Markdown',
            }),
          });
          if (res.ok) successCount++;
          else failCount++;
        } catch {
          failCount++;
        }
      }

      await addAuditLog('BROADCAST_MASS', `Terkirim: ${successCount}, Gagal: ${failCount}`, 'ADMIN');

      return NextResponse.json({
        success: true,
        message: `Broadcast terkirim! Berhasil: ${successCount}, Gagal: ${failCount}`,
      });
    }

    if (action === 'create_redeem_code') {
      const redeemRaw = await redis.get<string | object>('store:redeem_codes');
      const redeemCodes: any[] = redeemRaw ? (typeof redeemRaw === 'string' ? JSON.parse(redeemRaw) : redeemRaw) : [];

      const formattedCode = (code || '').trim().toUpperCase();
      const existIdx = redeemCodes.findIndex((c: any) => c.code === formattedCode);

      const parsedDailyLimit = parseInt(dailyLimit) || 0; // 0 = tanpa batas harian

      const newObj = {
        code: formattedCode,
        days: parseInt(days) || 7,
        usesLeft: parseInt(usesLeft) || 10,
        dailyLimit: parsedDailyLimit > 0 ? parsedDailyLimit : null,
        usedToday: 0,
        lastResetDate: new Date().toISOString().slice(0, 10),
        createdAt: new Date().toISOString(),
      };

      if (existIdx !== -1) {
        // Pertahankan progres kuota harian yang sudah berjalan jika hanya mengubah data lain
        newObj.usedToday = redeemCodes[existIdx].usedToday || 0;
        newObj.lastResetDate = redeemCodes[existIdx].lastResetDate || newObj.lastResetDate;
        redeemCodes[existIdx] = newObj;
      } else {
        redeemCodes.push(newObj);
      }

      await redis.set('store:redeem_codes', JSON.stringify(redeemCodes));
      await addAuditLog(
        'CREATE_REDEEM_CODE',
        `Kode: ${formattedCode} (+${days} Hari, Kuota Total: ${usesLeft}${parsedDailyLimit > 0 ? `, Kuota/Hari: ${parsedDailyLimit}` : ''})`,
        'ADMIN'
      );
      return NextResponse.json({ success: true });
    }

    if (action === 'delete_redeem_code') {
      const redeemRaw = await redis.get<string | object>('store:redeem_codes');
      let redeemCodes: any[] = redeemRaw ? (typeof redeemRaw === 'string' ? JSON.parse(redeemRaw) : redeemRaw) : [];

      redeemCodes = redeemCodes.filter((c: any) => c.code !== code);
      await redis.set('store:redeem_codes', JSON.stringify(redeemCodes));
      await addAuditLog('DELETE_REDEEM_CODE', `Kode: ${code} dihapus`, 'ADMIN');
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Aksi tidak dikenal' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
