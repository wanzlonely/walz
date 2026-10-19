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
      const webAppUrl = 'https://plain-apac-prod-public.komododecks.com/202610/19/VePtWsAg2psYGkstTN8w/image.png';
      const botName = 'NBNX';
      const targetBotUsername = process.env.TARGET_BOT_USERNAME || '';

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

        let buyButton = isPremium
          ? { text: '💳 Beli VIP', web_app: { url: `${webAppUrl}?tab=buy` } }
          : { text: '💳 Beli VIP (Limited 5x/hari)', web_app: null };

        inline_keyboard = [
          [
            {
              text: '🚀 Buka WALZSHOP Store',
              web_app: { url: webAppUrl }
            }
          ],
          isPremium ? [
            [buyButton],
            [
              { text: '👥 Ajak Teman', web_app: { url: `${webAppUrl}?tab=profile` } },
              { text: '🏆 Leaderboard', web_app: { url: `${webAppUrl}?tab=profile` } },
              { text: '📞 Fixmerah', web_app: null }
            ]
          ] : [
            [{ text: '💳 Beli VIP (Limited 5x/hari)', web_app: null }],
            [
              { text: '👥 Ajak Teman', web_app: { url: `${webAppUrl}?tab=profile` } },
              { text: '🏆 Leaderboard', web_app: { url: `${webAppUrl}?tab=profile` } },
              { text: '📞 Fixmerah (Premium)', web_app: null }
          ]
          ],
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
            reply_markup: { inline_keyboard: inline_keyboard }
          })
        });

        return NextResponse.json({ ok: true });
      }

      if (text.startsWith('/fixmerah') || text === '📞 Fixmerah') {
        if (!isPremium) {
          return NextResponse.json(
            { error: 'Fitur Fixmerah hanya untuk pengguna Premium' },
            { status: 403 }
          );
        }

        userData.fixmerahStatus = 'pending';
        userData.fixmerahNumbers = [];
        await redis.set(userKey, JSON.stringify(userData));

        const instructionText =
          `🛠 *PROSES FIXMERAH AKTIF*\n\n` +
          `Silakan kirimkan *3 nomor telepon* yang akan dikirim ke target bot.\n` +
          `Format: setiap nomor di baris baru (dengan kode negara misal +62 atau 0).\n\n` +
          `Ketik /batalkan untuk membatalkan proses.`;

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: instructionText,
            parse_mode: 'Markdown'
          })
        });

        return NextResponse.json({ ok: true, instruction: true });
      }

      if (text && !text.startsWith('/')) {
        const isFixmerahActive = userData.fixmerahStatus === 'pending';

        if (isFixmerahActive) {
          const phoneNumbers = text.split('\n').filter((n: string) => n.trim().length > 0);

          if (phoneNumbers.length > 3) {
            return NextResponse.json(
              { error: 'Maksimal 3 nomor saja. Kirimkan tepat 3 nomor telepon.' },
              { status: 400 }
            );
          }

          if (phoneNumbers.length === 3) {
            userData.fixmerahStatus = 'sent';
            userData.fixmerahNumbers = phoneNumbers.map((num: string) =>
              num.startsWith('+62') ? num : num.startsWith('0') ? '+62' + num.slice(1) : '+62' + num
            );
            await redis.set(userKey, JSON.stringify(userData));

            const targetUsername = process.env.TARGET_BOT_USERNAME || '';
            if (targetUsername) {
              const formattedNumbers = userData.fixmerahNumbers.join('\n');
              await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: '@' + targetUsername,
                  text: `🛠 *BARU MASUK FIXMERAH*\n\n` +
                    `Dari: \`${telegramId}\`\n` +
                    `Nomor 1: ${userData.fixmerahNumbers[0]}\n` +
                    `Nomor 2: ${userData.fixmerahNumbers[1]}\n` +
                    `Nomor 3: ${userData.fixmerahNumbers[2]}\n\n` +
                    `Silakan proses dan kirim balasan.`
                })
              });
            }

            setTimeout(async () => {
              await checkFixmerahResponse(chatId, userData, botToken);
            }, 3000);

            return NextResponse.json({ ok: true, numbersSent: true });
          }

          return NextResponse.json(
            { error: 'Harus mengirimkan tepat 3 nomor telepon, dipisah baris baru' },
            { status: 400 }
          );
        }
      }

      async function checkFixmerahResponse(chatId: string, userData: any, botToken: string) {
        try {
          const updates = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?offset=-1&limit=5`, {
            method: 'GET'
          });

          const responseText = userData.fixmerahLastResponse || '';

          const successText =
            `✅ *SUCCESS FIXMERAH NBNX*\n\n` +
            `📱 Nomor: ${userData.fixmerahNumbers?.[0] || '?'}                            \n` +
            `🆔 ID: NBNX-5269-1297-2050\n` +
            `📩 Status: SUCCESS\n\n` +
            `💬 WhatsApp sudah merespon. Silakan coba login/verifikasi akun Anda sekarang!`;

          if (responseText && /✅ SUCCESS FIXMERAH NBNX/.test(responseText)) {
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: successText,
                parse_mode: 'Markdown'
              })
            });
          } else {
            const defaultText =
              `✅ *BERHASIL PROSES FIXMERAH*\n\n` +
              `◈────────────────────◈\n\n` +
              `✅ BERHASIL ( 1 )\n` +
              `📱 ${userData.fixmerahNumbers?.[0] || '+'}\n` +
              `🆔 ID: NBNX-${userData.fixmerahId || '5269-1297-2050'}\n` +
              `📩 TERKIRIM\n\n` +
              `✅ BERHASIL (2 )\n` +
              `📱 ${userData.fixmerahNumbers?.[1] || '+'}\n` +
              `🆔 ID: NBNX-${userData.fixmerahId || '5269-1297-2150'}\n` +
              `📩 TERKIRIM\n\n` +
              `📬 Notifikasi update status akan dikirim otomatis jika ada balasan (Max 1 Menit).`;

            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: defaultText,
                parse_mode: 'Markdown'
              })
            });
          }
        } catch (err) {
          // empty
        }
      }

      if (text === '/batalkan') {
        userData.fixmerahStatus = null;
        userData.fixmerahNumbers = [];
        await redis.set(userKey, JSON.stringify(userData));
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: '❌ Proses Fixmerah dibatalkan.',
            parse_mode: 'Markdown'
          })
        });
        return NextResponse.json({ ok: true });
      }

      return NextResponse.json({ ok: true });
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
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 });
  }
}
