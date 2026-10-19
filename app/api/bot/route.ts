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
      const webAppUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        'https://fixred-walz.vercel.app';
      const botName = 'NBNX';
      const bannerUrl =
        'https://plain-apac-prod-public.komododecks.com/202610/19/VePtWsAg2psYGkstTN8w/image.png';

      const userKey = `user:${telegramId}`;
      const existingUserRaw = await redis.get<string | object>(userKey);
      let userData: any;

      if (existingUserRaw) {
        userData =
          typeof existingUserRaw === 'string'
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
          profile: { firstName, username },
        };
      }

      const isPremium = userData.status === 'ACTIVE';

      if (text.startsWith('/start')) {
        const parts = text.split(' ');
        let referredBy: string | null = null;

        if (parts.length > 1 && parts[1].startsWith('ref_')) {
          const referrerId = parts[1].replace('ref_', '');
          if (referrerId !== telegramId && !existingUserRaw) {
            const refKey = `user:${referrerId}`;
            const refRaw = await redis.get<string | object>(refKey);
            if (refRaw) {
              const refUser: any =
                typeof refRaw === 'string' ? JSON.parse(refRaw) : refRaw;
              refUser.points = (refUser.points || 0) + 50;
              refUser.referralCount = (refUser.referralCount || 0) + 1;
              if (!refUser.referredUsers) refUser.referredUsers = [];
              refUser.referredUsers.push({
                telegramId,
                firstName,
                joinedAt: new Date().toISOString(),
              });
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

        const welcomeText =
          `⚡️ *WALZSHOP DIGITAL STORE* ⚡️\n` +
          `_Layanan Digital Premium & Terpercaya_\n\n` +
          `┌ 👤 *INFORMASI AKUN*\n` +
          `├ 🆔 *ID Akun:* \`${telegramId}\`\n` +
          `├ 👤 *Nama:* ${firstName}\n` +
          `├ 💎 *Status Akses:* ${isPremium ? '*VIP PREMIUM*' : '*FREE USER*'}\n` +
          `└ ⭐ *Saldo Poin:* \`${userData.points || 0} Poin\`\n\n` +
          `🤖 *System:* ${botName}\n\n` +
          `Silakan pilih menu di bawah ini untuk melanjutkan 👇`;

        const inline_keyboard = [
          [
            {
              text: isPremium ? '📞 Fixmerah' : '🎁 Fixmerah',
              callback_data: 'fixmerah',
            },
          ],
          [
            {
              text: '💳 Beli VIP',
              web_app: { url: `${webAppUrl}?tab=buy` },
            },
            {
              text: '⭐ Tukar Poin',
              web_app: { url: `${webAppUrl}?tab=redeem` },
            },
          ],
          [
            {
              text: '👥 Ajak Teman',
              web_app: { url: `${webAppUrl}?tab=profile` },
            },
            {
              text: '🏆 Leaderboard',
              web_app: { url: `${webAppUrl}?tab=profile` },
            },
          ],
          [
            {
              text: '💬 Customer Support',
              web_app: { url: `${webAppUrl}?tab=chat` },
            },
          ],
        ];

        await fetch(
          `https://api.telegram.org/bot${botToken}/sendPhoto`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              photo: bannerUrl,
              caption: welcomeText,
              parse_mode: 'Markdown',
              reply_markup: { inline_keyboard },
            }),
          }
        );

        return NextResponse.json({ ok: true });
      }

      if (text.startsWith('/fixmerah') || text === '📞 Fixmerah') {
        if (!isPremium) {
          await fetch(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: '❌ Fitur Fixmerah hanya untuk pengguna Premium.',
                parse_mode: 'Markdown',
              }),
            }
          );
          return NextResponse.json({ ok: true });
        }

        userData.fixmerahStatus = 'pending';
        userData.fixmerahNumbers = [];
        await redis.set(userKey, JSON.stringify(userData));

        const instructionText =
          `🛠 *PROSES FIXMERAH AKTIF*\n\n` +
          `Silakan kirim *1 sampai 3 nomor telepon*.\n` +
          `Format: tiap nomor di baris baru (contoh +62... atau 08...).\n\n` +
          `Ketik /batalkan untuk membatalkan proses.`;

        await fetch(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: instructionText,
              parse_mode: 'Markdown',
            }),
          }
        );

        return NextResponse.json({ ok: true });
      }

      if (text === '/batalkan') {
        userData.fixmerahStatus = null;
        userData.fixmerahNumbers = [];
        await redis.set(userKey, JSON.stringify(userData));

        await fetch(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: '❌ Proses Fixmerah dibatalkan.',
              parse_mode: 'Markdown',
            }),
          }
        );

        return NextResponse.json({ ok: true });
      }

      if (text && !text.startsWith('/')) {
        if (userData.fixmerahStatus === 'pending') {
          const phoneNumbers = text
            .split('\n')
            .map((n: string) => n.trim())
            .filter((n: string) => n.length > 0);

          if (phoneNumbers.length < 1 || phoneNumbers.length > 3) {
            await fetch(
              `https://api.telegram.org/bot${botToken}/sendMessage`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: chatId,
                  text: '⚠️ Kirim *1 sampai 3 nomor*, masing-masing di baris baru.',
                  parse_mode: 'Markdown',
                }),
              }
            );
            return NextResponse.json({ ok: true });
          }

          const formatted = phoneNumbers.map((num: string) =>
            num.startsWith('+62')
              ? num
              : num.startsWith('0')
                ? '+62' + num.slice(1)
                : '+62' + num
          );

          userData.fixmerahStatus = 'sent';
          userData.fixmerahNumbers = formatted;
          await redis.set(userKey, JSON.stringify(userData));

          const targetUsername = process.env.TARGET_BOT_USERNAME || '';
          if (targetUsername) {
            await fetch(
              `https://api.telegram.org/bot${botToken}/sendMessage`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: '@' + targetUsername,
                  text:
                    `🛠 *BARU MASUK FIXMERAH*\n\n` +
                    `Dari: \`${telegramId}\`\n` +
                    formatted
                      .map(
                        (n: string, i: number) =>
                          `Nomor ${i + 1}: ${n}`
                      )
                      .join('\n') +
                    `\n\nSilakan proses dan kirim balasan.`,
                  parse_mode: 'Markdown',
                }),
              }
            );
          }

          const defaultText =
            `✅ *BERHASIL PROSES FIXMERAH*\n\n` +
            formatted
              .map(
                (n: string, i: number) =>
                  `✅ BERHASIL (${i + 1})\n📱 ${n}\n🆔 ID: NBNX-5269-1297-${2050 + i * 100}\n📩 TERKIRIM\n`
              )
              .join('\n') +
            `\n📬 Notifikasi update status akan dikirim otomatis jika ada balasan.`;

          await fetch(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: defaultText,
                parse_mode: 'Markdown',
              }),
            }
          );

          return NextResponse.json({ ok: true });
        }
      }

      return NextResponse.json({ ok: true });
    }

    if (body.callback_query) {
      const callback = body.callback_query;
      const callbackId = callback.id;
      const data = callback.data || '';
      const chatId = callback.message?.chat?.id;
      const fromId = callback.from?.id?.toString();
      const botToken =
        process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;

      await fetch(
        `https://api.telegram.org/bot${botToken}/answerCallbackQuery`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ callback_query_id: callbackId }),
        }
      );

      if (data === 'fixmerah' && chatId && fromId) {
        const userKey = `user:${fromId}`;
        const existingUserRaw = await redis.get<string | object>(userKey);
        const userData: any = existingUserRaw
          ? typeof existingUserRaw === 'string'
            ? JSON.parse(existingUserRaw)
            : existingUserRaw
          : { status: 'FREE' };

        if (userData.status !== 'ACTIVE') {
          await fetch(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: '❌ Fitur Fixmerah hanya untuk pengguna Premium.',
                parse_mode: 'Markdown',
              }),
            }
          );
        } else {
          userData.fixmerahStatus = 'pending';
          userData.fixmerahNumbers = [];
          await redis.set(userKey, JSON.stringify(userData));

          await fetch(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text:
                  `🛠 *PROSES FIXMERAH AKTIF*\n\n` +
                  `Kirim *1 sampai 3 nomor telepon*, masing-masing di baris baru.\n\n` +
                  `Ketik /batalkan untuk membatalkan.`,
                parse_mode: 'Markdown',
              }),
            }
          );
        }
      }

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[bot] error:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal error' },
      { status: 500 }
    );
  }
}
