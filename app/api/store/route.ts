import { NextResponse } from 'next/server';
import { redis, PACKAGES, verifyTelegramInitData } from '@/lib/utils';

const DAILY_STREAK_POINTS = [10, 15, 20, 25, 30, 40, 75];

function computeBadge(userData: any) {
  const referralCount = userData.referralCount || 0;
  const totalSpentDays = userData.totalDaysPurchased || 0;
  if (referralCount >= 20 || totalSpentDays >= 90) return { tier: 'DIAMOND', label: '💎 Diamond', color: '#67e8f9' };
  if (referralCount >= 10 || totalSpentDays >= 45) return { tier: 'PLATINUM', label: '🏆 Platinum', color: '#c4b5fd' };
  if (referralCount >= 5 || totalSpentDays >= 20) return { tier: 'GOLD', label: '🥇 Gold', color: '#fbbf24' };
  if (referralCount >= 1 || totalSpentDays >= 7) return { tier: 'SILVER', label: '🥈 Silver', color: '#cbd5e1' };
  return { tier: 'BRONZE', label: '🥉 Bronze', color: '#d6a578' };
}

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

async function addHistory(telegramId: string, entry: { type: string; label: string; points?: number; days?: number }) {
  try {
    const key = `history:${telegramId}`;
    const raw = await redis.get<string | object>(key);
    let history: any[] = raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : [];
    history.unshift({ ...entry, timestamp: new Date().toISOString() });
    if (history.length > 50) history = history.slice(0, 50);
    await redis.set(key, JSON.stringify(history));
  } catch {}
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { initData, action, packageId, proofNote, proofImage, voucherCode, pointsToRedeem, daysToAdd, isVoucher } = body;

    const tgUser = verifyTelegramInitData(initData);
    if (!tgUser || !tgUser.id) {
      return NextResponse.json({ error: 'Akses tidak sah. Buka melalui Telegram.' }, { status: 401 });
    }

    const telegramId = tgUser.id.toString();
    const userKey = `user:${telegramId}`;

    const rateKey = `rate:${telegramId}:${action}`;
    const rateCount = await redis.incr(rateKey);
    if (rateCount === 1) {
      await redis.expire(rateKey, 4);
    }
    if (rateCount > 4) {
      return NextResponse.json({ error: 'Terlalu banyak permintaan. Mohon tunggu.' }, { status: 429 });
    }

    const userDataRaw = await redis.get<string | object>(userKey);
    const userData: any = userDataRaw
      ? (typeof userDataRaw === 'string' ? JSON.parse(userDataRaw) : userDataRaw)
      : { telegramId, status: 'FREE', points: 50, vouchers: [], riskScore: 0, lastCheckin: null };

    if (userData.status === 'BANNED') {
      return NextResponse.json({ error: 'Akun Anda telah diblokir oleh admin.' }, { status: 403 });
    }

    const botToken = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || '';
    const adminId = process.env.ADMIN_TELEGRAM_ID || '';

    const profileData = {
      firstName: tgUser.first_name || 'Pengguna',
      lastName: tgUser.last_name || '',
      username: tgUser.username || '',
      updatedAt: new Date().toISOString(),
    };
    await redis.set(`profile:${telegramId}`, JSON.stringify(profileData));

    if (action === 'check_status') {
      const pendingTrx = await redis.get(`pending_trx:${telegramId}`);
      const flashSaleRaw = await redis.get<string | object>('store:flash_sale');
      const flashSale = flashSaleRaw ? (typeof flashSaleRaw === 'string' ? JSON.parse(flashSaleRaw) : flashSaleRaw) : null;
      const isAdmin = adminId ? telegramId === adminId : false;
      const badge = computeBadge(userData);

      // Progress misi harian (dihitung dari data yang sudah ada, tanpa migrasi rumit)
      const todayStr = new Date().toISOString().slice(0, 10);
      if (userData.missionsDate !== todayStr) {
        userData.missionsDate = todayStr;
        userData.missionsDone = { checkin: false, visit: false, redeem: false };
      }
      userData.missionsDone = userData.missionsDone || { checkin: false, visit: false, redeem: false };
      userData.missionsDone.visit = true; // buka app = misi "kunjungi app" otomatis selesai
      await redis.set(userKey, JSON.stringify(userData));

      return NextResponse.json({
        user: userData,
        pendingOrder: !!pendingTrx,
        flashSale,
        isAdmin,
        badge,
      });
    }

    if (action === 'get_history') {
      const raw = await redis.get<string | object>(`history:${telegramId}`);
      const history: any[] = raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : [];
      return NextResponse.json({ success: true, history: history.slice(0, 30) });
    }

    if (action === 'get_leaderboard') {
      const keys = await redis.keys('user:*');
      const board: any[] = [];
      for (const key of keys) {
        const raw = await redis.get<string | object>(key);
        if (!raw) continue;
        const u: any = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (u.status === 'BANNED') continue;
        const tgId = key.replace('user:', '');
        const profRaw = await redis.get<string | object>(`profile:${tgId}`);
        const prof: any = profRaw ? (typeof profRaw === 'string' ? JSON.parse(profRaw) : profRaw) : {};
        board.push({
          telegramId: tgId,
          firstName: prof.firstName || 'Pengguna',
          username: prof.username || '',
          points: u.points || 0,
          referralCount: u.referralCount || 0,
          badge: computeBadge(u),
        });
      }
      board.sort((a, b) => b.points - a.points);
      const top = board.slice(0, 10);
      const myRank = board.findIndex((b) => b.telegramId === telegramId) + 1;
      return NextResponse.json({ success: true, leaderboard: top, myRank: myRank || null, totalPlayers: board.length });
    }

    if (action === 'get_referrals') {
      return NextResponse.json({
        success: true,
        referralCount: userData.referralCount || 0,
        referredUsers: (userData.referredUsers || []).slice(0, 50),
        referredBy: userData.referredBy || null,
      });
    }

    if (action === 'daily_checkin') {
      const now = Date.now();
      const last = userData.lastCheckin ? new Date(userData.lastCheckin).getTime() : 0;
      const twentyFourHours = 24 * 60 * 60 * 1000;
      const fortyEightHours = 48 * 60 * 60 * 1000;

      if (now - last < twentyFourHours) {
        const remainingHours = Math.ceil((twentyFourHours - (now - last)) / (60 * 60 * 1000));
        return NextResponse.json({ error: `Kamu sudah klaim bonus hari ini. Coba lagi dalam ${remainingHours} jam.` }, { status: 400 });
      }

      // Streak berlanjut jika masih dalam 48 jam dari checkin terakhir, jika tidak reset ke 1
      const streakContinues = last && (now - last) < fortyEightHours;
      const currentStreak = streakContinues ? ((userData.checkinStreak || 0) % 7) + 1 : 1;
      const streakBonus = DAILY_STREAK_POINTS[currentStreak - 1] || 10;

      userData.points = (userData.points || 0) + streakBonus;
      userData.lastCheckin = new Date().toISOString();
      userData.checkinStreak = currentStreak;

      userData.missionsDate = userData.missionsDate || new Date().toISOString().slice(0, 10);
      userData.missionsDone = userData.missionsDone || { checkin: false, visit: false, redeem: false };
      userData.missionsDone.checkin = true;

      await redis.set(userKey, JSON.stringify(userData));
      await addHistory(telegramId, { type: 'CHECKIN', label: `Bonus Harian (Hari ke-${currentStreak})`, points: streakBonus });
      await addAuditLog('DAILY_CHECKIN', `Klaim Bonus Harian +${streakBonus} PTS (Streak Hari ${currentStreak})`, telegramId);

      return NextResponse.json({
        success: true,
        message: `Berhasil klaim bonus harian +${streakBonus} Poin! (Streak Hari ${currentStreak}/7)`,
        points: userData.points,
        streak: currentStreak,
      });
    }

    if (action === 'submit_order') {
      const pendingTrx = await redis.get(`pending_trx:${telegramId}`);
      if (pendingTrx) {
        return NextResponse.json({ error: 'Kamu masih memiliki transaksi yang sedang ditinjau admin.' }, { status: 400 });
      }

      const flashSaleRaw = await redis.get<string | object>('store:flash_sale');
      const flashSale: any = flashSaleRaw ? (typeof flashSaleRaw === 'string' ? JSON.parse(flashSaleRaw) : flashSaleRaw) : null;

      const selectedPkg = PACKAGES.find((p) => p.id === packageId) || PACKAGES[0];
      let finalPrice = selectedPkg.price;

      if (flashSale && flashSale.active && new Date(flashSale.expiresAt).getTime() > Date.now()) {
        const discountAmount = Math.floor((selectedPkg.price * (flashSale.discountPercent || 0)) / 100);
        finalPrice = Math.max(0, selectedPkg.price - discountAmount);
      }

      const orderId = `TRX-${Date.now().toString(36).toUpperCase()}`;

      const orderPayload = {
        orderId,
        telegramId,
        displayName: [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' '),
        username: tgUser.username ? `@${tgUser.username}` : '-',
        packageId: selectedPkg.id,
        amount: finalPrice,
        durationDays: selectedPkg.days,
        proofNote: proofNote || '-',
        proofImage: proofImage || null,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };

      await redis.set(`trx:${orderId}`, JSON.stringify(orderPayload));
      await redis.set(`pending_trx:${telegramId}`, orderId);

      const ordersRaw = await redis.get<string | object>('store:orders');
      const orders: any[] = ordersRaw ? (typeof ordersRaw === 'string' ? JSON.parse(ordersRaw) : ordersRaw) : [];
      orders.unshift(orderPayload);
      await redis.set('store:orders', JSON.stringify(orders));

      userData.riskScore = (userData.riskScore || 0) + 5;
      await redis.set(userKey, JSON.stringify(userData));

      await addAuditLog('SUBMIT_ORDER', `Order ID: ${orderId} | Total: Rp ${finalPrice}`, telegramId);

      if (botToken && adminId) {
        const captionText =
          `📦 *PESANAN BARU MASUK*\n\n` +
          `Order ID: \`${orderId}\`\n` +
          `User: ${orderPayload.displayName} (${orderPayload.username})\n` +
          `ID Telegram: \`${telegramId}\`\n` +
          `Paket: *${selectedPkg.label}* (Rp ${finalPrice.toLocaleString('id-ID')})\n` +
          `Catatan: ${orderPayload.proofNote}`;

        try {
          if (proofImage && typeof proofImage === 'string' && proofImage.startsWith('data:image')) {
            const base64Data = proofImage.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            const formData = new FormData();
            formData.append('chat_id', adminId);
            formData.append('caption', captionText);
            formData.append('parse_mode', 'Markdown');
            formData.append('photo', new Blob([buffer], { type: 'image/jpeg' }), 'proof.jpg');

            await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
              method: 'POST',
              body: formData,
            });
          } else {
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: adminId,
                text: captionText,
                parse_mode: 'Markdown',
              }),
            });
          }
        } catch {
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: adminId,
              text: captionText,
              parse_mode: 'Markdown',
            }),
          });
        }
      }

      return NextResponse.json({ success: true, orderId });
    }

    if (action === 'claim_voucher') {
      const formattedCode = (voucherCode || '').trim().toUpperCase();
      if (!formattedCode) return NextResponse.json({ error: 'Kode voucher harus diisi' }, { status: 400 });

      const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

      const redeemCodesRaw = await redis.get<string | object>('store:redeem_codes');
      const redeemCodes: any[] = redeemCodesRaw
        ? (typeof redeemCodesRaw === 'string' ? JSON.parse(redeemCodesRaw) : redeemCodesRaw)
        : [];

      const codeIdx = redeemCodes.findIndex((c: any) => c.code === formattedCode);
      if (codeIdx === -1) {
        userData.riskScore = (userData.riskScore || 0) + 10;
        await redis.set(userKey, JSON.stringify(userData));
        await addAuditLog('FAILED_VOUCHER', `Kode tidak valid: ${formattedCode}`, telegramId);
        return NextResponse.json({ error: 'Kode promo/voucher tidak valid' }, { status: 404 });
      }

      const foundCode = redeemCodes[codeIdx];

      // Reset kuota harian otomatis jika sudah ganti hari
      if (foundCode.dailyLimit && foundCode.lastResetDate !== todayStr) {
        foundCode.usedToday = 0;
        foundCode.lastResetDate = todayStr;
      }

      // Cek kuota total (lifetime) kode
      if (typeof foundCode.usesLeft === 'number' && foundCode.usesLeft <= 0) {
        return NextResponse.json({ error: 'Kuota kode promo telah habis' }, { status: 400 });
      }

      // Cek kuota harian kode (mencegah kode habis diborong di awal hari)
      if (foundCode.dailyLimit && (foundCode.usedToday || 0) >= foundCode.dailyLimit) {
        return NextResponse.json({
          error: `Kuota harian kode ini sudah penuh (${foundCode.dailyLimit}/hari). Coba lagi besok ya!`,
        }, { status: 429 });
      }

      // Cek apakah user ini sudah pernah klaim kode yang sama hari ini
      const userClaimKey = `voucher_claim:${formattedCode}:${telegramId}`;
      const alreadyClaimedToday = await redis.get(userClaimKey);
      if (alreadyClaimedToday === todayStr) {
        return NextResponse.json({
          error: 'Kamu sudah klaim kode ini hari ini. Coba lagi besok!',
        }, { status: 429 });
      }

      if (typeof foundCode.usesLeft === 'number') {
        foundCode.usesLeft -= 1;
      }
      if (foundCode.dailyLimit) {
        foundCode.usedToday = (foundCode.usedToday || 0) + 1;
      }

      if (typeof foundCode.usesLeft === 'number' && foundCode.usesLeft <= 0) {
        redeemCodes.splice(codeIdx, 1);
      } else {
        redeemCodes[codeIdx] = foundCode;
      }
      await redis.set('store:redeem_codes', JSON.stringify(redeemCodes));

      // Tandai user sudah klaim kode ini hari ini (auto-expire 25 jam)
      await redis.set(userClaimKey, todayStr, { ex: 90000 });

      let baseDate = new Date();
      if (userData.status === 'ACTIVE' && userData.expiredAt && new Date(userData.expiredAt).getTime() > Date.now()) {
        baseDate = new Date(userData.expiredAt);
      }
      baseDate.setTime(baseDate.getTime() + (foundCode.days || 7) * 24 * 60 * 60 * 1000);

      userData.status = 'ACTIVE';
      userData.expiredAt = baseDate.toISOString();
      userData.updatedAt = new Date().toISOString();
      await redis.set(userKey, JSON.stringify(userData));

      await addAuditLog('CLAIM_VOUCHER', `Kode: ${formattedCode} | +${foundCode.days} Hari`, telegramId);
      await addHistory(telegramId, { type: 'VOUCHER', label: `Klaim Kode ${formattedCode}`, days: foundCode.days });

      const remainingToday = foundCode.dailyLimit
        ? Math.max(foundCode.dailyLimit - (foundCode.usedToday || 0), 0)
        : null;

      return NextResponse.json({
        success: true,
        message: `Sukses klaim voucher! Masa VIP bertambah +${foundCode.days} Hari.`,
        remainingToday,
        dailyLimit: foundCode.dailyLimit || null,
      });
    }

    if (action === 'redeem_points') {
      const cost = parseInt(pointsToRedeem) || 0;
      if ((userData.points || 0) < cost) {
        return NextResponse.json({ error: 'Poin kamu tidak mencukupi' }, { status: 400 });
      }

      userData.points = (userData.points || 0) - cost;

      userData.missionsDate = userData.missionsDate || new Date().toISOString().slice(0, 10);
      userData.missionsDone = userData.missionsDone || { checkin: false, visit: false, redeem: false };
      userData.missionsDone.redeem = true;

      if (isVoucher) {
        const generatedCode = `DISC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        if (!userData.vouchers) userData.vouchers = [];
        userData.vouchers.push({
          code: generatedCode,
          discount: 50,
          createdAt: new Date().toISOString(),
        });
        await addAuditLog('REDEEM_POINT_VOUCHER', `Voucher Diskon 50% | Kode: ${generatedCode}`, telegramId);
        await addHistory(telegramId, { type: 'REDEEM_VOUCHER', label: `Tukar Poin → Voucher Diskon`, points: -cost });
      } else {
        let baseDate = new Date();
        if (userData.status === 'ACTIVE' && userData.expiredAt && new Date(userData.expiredAt).getTime() > Date.now()) {
          baseDate = new Date(userData.expiredAt);
        }
        const addDays = parseInt(daysToAdd) || 3;
        baseDate.setTime(baseDate.getTime() + addDays * 24 * 60 * 60 * 1000);

        userData.status = 'ACTIVE';
        userData.expiredAt = baseDate.toISOString();
        userData.totalDaysPurchased = (userData.totalDaysPurchased || 0) + addDays;
        await addAuditLog('REDEEM_POINT_VIP', `Tukar Poin +${addDays} Hari VIP`, telegramId);
        await addHistory(telegramId, { type: 'REDEEM_VIP', label: `Tukar Poin +${addDays} Hari VIP`, points: -cost, days: addDays });
      }

      userData.updatedAt = new Date().toISOString();
      await redis.set(userKey, JSON.stringify(userData));

      return NextResponse.json({ success: true, user: userData });
    }

    return NextResponse.json({ error: 'Aksi tidak valid' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
