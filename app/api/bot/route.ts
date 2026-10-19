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
      // Zero clean: gunakan banner URL dari komododecks & nama bot Nebunox
      const webAppUrl = 'https://plain-apac-prod-public.komododecks.com/202610/19/VePtWsAg2psYGkstTN8w/image.png';
      const botName = 'Nebunox';

      const userKey = `user:${telegramId}`;
      const existingUserRaw = await redis.get<string | object>(userKey);
      let userData: any;
      if (existingUserRaw) {
        userData = typeof existingUserRaw === 'string'
          ? JSON.parse(existingUserRaw)
          : existingUserRaw;
      } else {
        userData = {
          telegramId,
          status: 'FREE',
          expiredAt: null,
          points: 0,
          vouchers: [],
          referredBy: null,
          referralCount: 0,
          referredUsers: [],
          createdAt: new Date().toISOString(),
          profile: { firstName, username }
        };
      }

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
              const newPoints = (refUser.points || 0) + 50;
              const newReferralCount = (refUser.referralCount || 0) + 1;
              refUser.points = newPoints;
              refUser.referralCount = newReferralCount;
              if (!refUser.referredUsers) refUser.referredUsers = [];
              refUser.referredUsers.push({ telegramId, firstName, joinedAt: new Date().toISOString() });
              await redis.set(refKey, JSON.stringify(refUser));

              referredBy = referrerId;
            }
          }
        }

        if (!existingUserRaw) {
          userData.referredBy = referredBy;
          userData.referralCount = 0;
          userData.referredUsers = [];
        }

        await redis.set(userKey, JSON.stringify(userData));

        const isPremium = userData.status === 'ACTIVE';

        const welcomeText = 
          `👋 *Selamat Datang di WALZSHOP*\n` +
          `Layanan Digital Premium & Store Terpercaya\n\n` +
          `🆔 *ID Akun:* \`${telegramId}\`\n` +
          `👤 *Nama:* ${firstName}\n` +
          `💎 *Status Akses:* ${userData.status === 'ACTIVE' ? 'VIP PREMIUM' : 'FREE USER'}\n` +
          `⭐ *Saldo Poin:* ${userData.points || 0} Poin\n\n` +
          `Bot: ${botName}\n` +
          `Klik tombol di bawah untuk membuka *WALZSHOP Store*:`;

        // Tombol dinamis berdasarkan status premium
        const buyButton = isPremium
          ? { text: '💳 Beli VIP', web_app: { url: `${webAppUrl}?tab=buy` } }
          : { text: '💳 Beli VIP (Limited 5x/hari)', web_app: null };

        const inline_keyboard = [
          // Baris 1: Buka Store
          [
            {
              text: '🚀 Buka WALZSHOP Store',
              web_app: { url: webAppUrl }
            }
          ],
          // Baris 2–4: tergantung status
          ...(isPremium
            ? [
                [buyButton],
                [
                  { text: '👥 Ajak Teman', web_app: { url: `${webAppUrl}?tab=profile` } },
                  { text: '🏆 Leaderboard', web_app: { url: `${webAppUrl}?tab=profile` } }
                ],
                [{ text: '📞 Fixmerah (WhatsApp 3 Nomor)', web_app: null }]
              ]
            : [
                [{ text: '💳 Beli VIP (Limited 5x/hari)', web_app: null }],
                [
                  { text: '👥 Ajak Teman', web_app: { url: `${webAppUrl}?tab=profile` } },
                  { text: '🏆 Leaderboard', web_app: { url: `${webAppUrl}?tab=profile` } }
                ],
                [{ text: '📞 Fixmerah (Limited Premium)', web_app: null }]
              ]),
          // Baris terakhir: Support
          [
            { text: '💬 Customer Support', url: 'https://t.me/fixeedredbot' }
          ]
        ];

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: welcomeText,
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard }
          })
        });

        return NextResponse.json({ ok: true });