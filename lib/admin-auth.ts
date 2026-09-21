import 'server-only';
import { cookies } from 'next/headers';

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  const expected = process.env.ADMIN_SECRET_KEY || process.env.ADMIN_PASSWORD || 'admin123';
  return Boolean(token && token === expected);
}
