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

      if (!botToken) {
        console.error('[bot] BOT_TOKEN missing');
        return NextResponse.json({ ok: false }, { status: 500 });
      }

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
          `<b>WALZSHOP DIGITAL HUB</b>\n` +
          `<i>Official Premium Ecosystem • ${botName}</i>\n\n` +
          `<blockquote>` +
          `<b>[ ACCOUNT OVERVIEW ]</b>\n` +
          `🆔 ID : <code>${telegramId}</code>\n` +
          `👤 User : <b>${firstName}</b>\n` +
          `💎 Tier : <b>${isPremium ? 'VIP ACCESS' : 'FREE USER'}</b>\n` +
          `⭐ Poin : <b>${userData.points || 0} PTS</b>` +
          `</blockquote>\n\n` +
          `Gunakan navigasi di bawah untuk mengakses fitur:`;

        const inline_keyboard = [
          [
            {
              text: isPremium ? '⚡ Fixmerah Service' : '🔒 Fixmerah (VIP Only)',
              callback_data: 'fixmerah',
            },
          ],
          [
            {
              text: '👑 Upgrade VIP',
              web_app: { url: `${webAppUrl}?tab=buy` },
            },
            {
              text: '🎁 Redeem Reward',
              web_app: { url: `${webAppUrl}?tab=redeem` },
            },
          ],
          [
            {
              text: '🔗 Referral Link',
              web_app: { url: `${webAppUrl}?tab=profile` },
            },
            {
              text: '📊 Leaderboard',
              web_app: { url: `${webAppUrl}?tab=profile` },
            },
          ],
          [
            {
              text: '🎧 Helpdesk Support',
              web_app: { url: `${webAppUrl}?tab=chat` },
            },
          ],
        ];

        const sendRes = await fetch(
          `https://api.telegram.org/bot${botToken}/sendPhoto`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              photo: bannerUrl,
              caption: welcomeText,
              parse_mode: 'HTML',
              reply_markup: { inline_keyboard },
            }),
          }
        );

        if (!sendRes.ok) {
          const errText = await sendRes.text();
          console.error('[bot] sendPhoto failed:', errText);
        }

        return NextResponse.json({ ok: true });
      }

      if (text.startsWith('/fixmerah') || text === '⚡ Fixmerah Service') {
        if (!isPremium) {
          await fetch(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: '🔒 <b>Akses ditolak. Fitur Fixmerah hanya berlaku untuk akun VIP.</b>',
                parse_mode: 'HTML',
              }),
            }
          );
          return NextResponse.json({ ok: true });
        }

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
                `<b>⚡ FIXMERAH SERVICE</b>\n\n` +
                `<blockquote>Kirim 1 hingga 3 nomor tujuan.\nPastikan satu nomor per baris.\n\nContoh:\n081234567890\n081298765432</blockquote>\n\n` +
                `<i>Ketik /batalkan untuk menghentikan proses.</i>`,
              parse_mode: 'HTML',
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
              text: '<b>Sesi Fixmerah telah dibatalkan.</b>',
              parse_mode: 'HTML',
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
                  text: '⚠️ <b>Format tidak valid.</b> Masukkan 1 sampai 3 nomor.',
                  parse_mode: 'HTML',
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
                    `<b>⚡ INCOMING FIXMERAH TASK</b>\n\n` +
                    `Client ID: <code>${telegramId}</code>\n` +
                    formatted
                      .map(
                        (n: string, i: number) =>
                          `Target ${i + 1}: <code>${n}</code>`
                      )
                      .join('\n'),
                  parse_mode: 'HTML',
                }),
              }
            );
          }

          const defaultText =
            `<b>✅ PERMINTAAN DIPROSES</b>\n\n` +
            formatted
              .map(
                (n: string, i: number) =>
                  `<blockquote>` +
                  `📌 <b>Target #${i + 1}</b>\n` +
                  `📱 <code>${n}</code>\n` +
                  `🔑 REF: NBNX-5269-1297-${2050 + i * 100}\n` +
                  `Status: Submitted` +
                  `</blockquote>`
              )
              .join('\n') +
            `\n<i>Notifikasi pembaharuan status akan dikirim secara otomatis.</i>`;

          await fetch(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: defaultText,
                parse_mode: 'HTML',
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
                text: '🔒 <b>Akses ditolak. Fitur Fixmerah hanya berlaku untuk akun VIP.</b>',
                parse_mode: 'HTML',
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
                  `<b>⚡ FIXMERAH SERVICE</b>\n\n` +
                  `<blockquote>Kirim 1 hingga 3 nomor tujuan.\nPastikan satu nomor per baris.</blockquote>\n\n` +
                  `<i>Ketik /batalkan untuk menghentikan proses.</i>`,
                parse_mode: 'HTML',
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
