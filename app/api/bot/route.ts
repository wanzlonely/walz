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
          `❖ <b>𝐖 𝐀 𝐋 𝗭 𝐒 𝐇 𝐎 𝐏</b> ❖\n` +
          `<i>────── ᴅɪɢɪᴛᴀʟ ᴇᴄᴏsʏsᴛᴇᴍ ──────</i>\n\n` +
          `<b>[ ᴀᴄᴄᴏᴜɴᴛ ɪɴsɪɢʜᴛ ]</b>\n` +
          `◈ ɪᴅ : <code>${telegramId}</code>\n` +
          `◈ ᴜsᴇʀ : <b>${firstName}</b>\n` +
          `◈ ᴛɪᴇʀ : <b>${isPremium ? '💎 ᴠɪᴘ ᴀᴄᴄᴇss' : '⚡ 𝖥𝖱𝖤𝖤 𝖬𝖤𝖬𝖡𝖤𝖱'}</b>\n` +
          `◈ ᴘᴏɪɴᴛs : <b>${userData.points || 0}</b> 𝖯𝖳𝖲\n\n` +
          `<b>[ sʏsᴛᴇᴍ ]</b>\n` +
          `◈ ᴇɴɢɪɴᴇ : <code>${botName} v2.0</code>\n\n` +
          `<i>✦ Pilih layanan pada panel interaktif berikut:</i>`;

        const inline_keyboard = [
          [
            {
              text: isPremium ? '⚡ 𝐅𝐈𝐗𝐌𝐄𝐑𝐀𝐇 𝐒𝐄𝐑𝐕𝐈𝐂𝐄' : '🔒 𝐅𝐈𝐗𝐌𝐄𝐑𝐀𝐇 (𝐕𝐈𝐏 𝐎𝐍𝐋𝐘)',
              callback_data: 'fixmerah',
            },
          ],
          [
            {
              text: '💎 𝗨𝗣𝗚𝗥𝗔𝗗𝗘 𝗩𝗜𝗣',
              web_app: { url: `${webAppUrl}?tab=buy` },
            },
            {
              text: '🎁 𝗥𝗘𝗗𝗘𝗘𝗠 𝗣𝗢𝗜𝗡𝗧𝗦',
              web_app: { url: `${webAppUrl}?tab=redeem` },
            },
          ],
          [
            {
              text: '🔗 𝗥𝗘𝗙𝗘𝗥𝗥𝗔𝗟',
              web_app: { url: `${webAppUrl}?tab=profile` },
            },
            {
              text: '🏆 𝗟𝗘𝗔Dh𝗘𝗥𝗕𝗢𝗔𝗥𝗗',
              web_app: { url: `${webAppUrl}?tab=profile` },
            },
          ],
          [
            {
              text: '💬 𝖧𝖤𝖫𝖯𝖣𝖤𝖲𝖪 𝖲𝖴𝖯𝖯𝖮𝖱𝖳',
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

      if (text.startsWith('/fixmerah') || text === '⚡ 𝐅𝐈𝐗𝐌𝐄𝐑𝐀𝐇 𝐒𝐄𝐑𝐕𝐈𝐂𝐄') {
        if (!isPremium) {
          await fetch(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text:
                  `🔒 <b>ᴀᴋsᴇs ᴅɪᴛᴏʟᴀᴋ</b>\n\n` +
                  `<i>Layanan Fixmerah secara eksklusif hanya dapat diakses oleh member VIP.</i>`,
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
                `⚡ <b>𝐅𝐈𝐗𝐌𝐄𝐑𝐀𝐇 𝐏𝐑𝐎𝐂𝐄𝐒𝐒𝐎𝐑</b>\n\n` +
                `<blockquote>Kirim 1-3 nomor target (pisahkan dengan baris baru)\n\nContoh:\n081234567890\n081298765432</blockquote>\n\n` +
                `<i>Ketik /batalkan untuk membatalkan antrean.</i>`,
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
              text: '✖ <b>Sesi berhasil dibatalkan.</b>',
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
                  text:
                    `⚠️ <b>𝖥𝖮𝖱𝖬𝖠𝖳 𝖨𝖭𝖵𝖠𝖫𝖨𝖣</b>\n` +
                    `<i>Gunakan batas minimal 1 nomor dan maksimal 3 nomor.</i>`,
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
                    `⚡ <b>ɴᴇᴡ ᴛᴀsᴋ ɪɴʙᴏx</b>\n\n` +
                    `◈ Client ID: <code>${telegramId}</code>\n` +
                    formatted
                      .map(
                        (n: string, i: number) =>
                          `◈ Target #${i + 1}: <code>${n}</code>`
                      )
                      .join('\n'),
                  parse_mode: 'HTML',
                }),
              }
            );
          }

          const defaultText =
            `✦ <b>𝖯𝖱𝖮𝖢𝖤𝖲𝖲𝖨𝖭𝖦 𝖢𝖮𝖬𝖯𝖫𝖤𝖳𝖤𝖣</b> ✦\n\n` +
            formatted
              .map(
                (n: string, i: number) =>
                  `<blockquote>` +
                  `◈ <b>𝖳𝖺𝗋𝗀𝖾𝗍 #${i + 1}</b>\n` +
                  `📱 <code>${n}</code>\n` +
                  `🆔 <code>NBNX-5269-1297-${2050 + i * 100}</code>\n` +
                  `STATUS: <b>DISPATCHED</b>` +
                  `</blockquote>`
              )
              .join('\n') +
            `\n<i>Sistem akan mengirim notifikasi berkala begitu terdapat pembaruan status.</i>`;

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
                text:
                  `🔒 <b>ᴀᴋsᴇs ᴅɪᴛᴏʟᴀᴋ</b>\n\n` +
                  `<i>Layanan Fixmerah secara eksklusif hanya dapat diakses oleh member VIP.</i>`,
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
                  `⚡ <b>𝐅𝐈𝐗𝐌𝐄𝐑𝐀𝐇 𝐏𝐑𝐎𝐂𝐄𝐒𝐒𝐎𝐑</b>\n\n` +
                  `<blockquote>Kirim 1-3 nomor target (pisahkan dengan baris baru)</blockquote>\n\n` +
                  `<i>Ketik /batalkan untuk membatalkan antrean.</i>`,
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
