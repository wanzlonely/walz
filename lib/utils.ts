import { Redis } from '@upstash/redis';
import crypto from 'crypto';
export { PACKAGES } from './packages';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export function verifyTelegramInitData(initDataRaw: string, botToken?: string) {
  if (!initDataRaw) return null;

  try {
    let urlParams = new URLSearchParams(initDataRaw);
    let userStr = urlParams.get('user');

    if (!userStr) {
      urlParams = new URLSearchParams(decodeURIComponent(initDataRaw));
      userStr = urlParams.get('user');
    }

    if (!userStr) return null;
    const user = JSON.parse(userStr);
    if (!user || !user.id) return null;

    const token = botToken || process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || '';
    const hash = urlParams.get('hash');

    if (token && hash) {
      urlParams.delete('hash');
      const paramsList = Array.from(urlParams.entries())
        .map(function (entry) {
          return entry[0] + '=' + entry[1];
        })
        .sort();

      const dataCheckString = paramsList.join('\n');
      const secretKey = crypto.createHmac('sha256', 'WebAppData').update(token).digest();
      const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

      if (calculatedHash === hash) {
        return user;
      }
    }

    return user;
  } catch {
    return null;
  }
}