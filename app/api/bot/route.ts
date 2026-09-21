import { NextResponse } from 'next/server';
import { redis } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.message) {
      const message = body.message;
      const chatId = message.chat.id;
      const text = message.text || '';
      const telegramId = message.from.id.toString();
      const firstName = message.from.first_name || 'Pengguna';
      const username = message.from.username || '';

      const botToken = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
      const webAppUrl = process.env.NEXT_PUBLIC_APP_URL || `https://${process.env.VERCEL_URL}`;

      const userKey = `user:${telegramId}`;
      const existingUserRaw = await redis.get<string | object>(userKey);
      const userData: any = existingUserRaw
        ? typeof existingUserRaw === 'string'
          ? JSON.parse(existingUserRaw)
          : existingUserRaw
        : {
            telegramId,
            status: 'FREE',
            expiredAt: null,
            points: 0,
            vouchers: [],
            createdAt: new Date().toISOString(),
            profile: { firstName, username }
          };

      if (text.startsWith('/start')) {
        const parts = text.split(' ');
        let referredBy: string | null = null;

        if (parts.length > 1 && parts[1].startsWith('ref_')) {
          const referrerId = parts[1].replace('ref_', '');
          if (referrerId !== telegramId && !existingUserRaw) {
            const refKey = `user:${referrerId}`;
            const refRaw = await redis.get<string | object>(refKey);
            if (refRaw) {
              const refUser: any = typeof refRaw === 'string' ? JSON.parse(refRaw) : refRaw;
              refUser.points = (refUser.points || 0) + 50;
              refUser.referralCount = (refUser.referralCount || 0) + 1;
              if (!refUser.referredUsers) refUser.referredUsers = [];
              refUser.referredUsers.push({ telegramId, firstName, joinedAt: new Date().toISOString() });
              await redis.set(refKey, JSON.stringify(refUser));

              referredBy = referrerId;

              // Kirim notifikasi ke pemberi referral
              try {
                await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    chat_id: referrerId,
                    text: `🎉 *Referral Berhasil!*\n${firstName} baru saja bergabung lewat link referral kamu.\n\n+50 Poin telah ditambahkan ke akunmu!`,
                    parse_mode: 'Markdown',
                  }),
                });
              } catch {}
            }
          }
        }

        if (!existingUserRaw) {
          userData.referredBy = referredBy;
          userData.referralCount = 0;
          userData.referredUsers = [];
        }

        await redis.set(userKey, JSON.stringify(userData));

        const welcomeText = 
          `👋 *Selamat Datang di WALZSHOP*\n` +
          `Layanan Digital Premium & Store Terpercaya\n\n` +
          `🆔 *ID Akun:* \`${telegramId}\`\n` +
          `👤 *Nama:* ${firstName}\n` +
          `💎 *Status Akses:* ${userData.status === 'ACTIVE' ? 'VIP PREMIUM' : 'FREE USER'}\n` +
          `⭐ *Saldo Poin:* ${userData.points || 0} Poin\n\n` +
          `Klik tombol di bawah untuk membuka *WALZSHOP Store*:`;

        const inlineKeyboard = {
          inline_keyboard: [
            [
              {
                text: '🚀 Buka WALZSHOP Store',
                web_app: { url: webAppUrl }
              }
            ],
            [
              { text: '💳 Beli VIP', web_app: { url: `${webAppUrl}?tab=buy` } },
              { text: '🎁 Tukar Poin', web_app: { url: `${webAppUrl}?tab=redeem` } }
            ],
            [
              { text: '👥 Ajak Teman', web_app: { url: `${webAppUrl}?tab=profile` } },
              { text: '🏆 Leaderboard', web_app: { url: `${webAppUrl}?tab=profile` } }
            ],
            [
              { text: '💬 Customer Support', url: 'https://t.me/fixeedredbot' }
            ]
          ]
        };

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: welcomeText,
            parse_mode: 'Markdown',
            reply_markup: inlineKeyboard
          })
        });

        return NextResponse.json({ ok: true });
      }
    }

    if (body.callback_query) {
      const callback = body.callback_query;
      const callbackId = callback.id;
      const botToken = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;

      await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: callbackId })
      });

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: true });
  }
}
