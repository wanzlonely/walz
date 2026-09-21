import 'server-only';
import { cookies } from 'next/headers';

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return Boolean(token && token === process.env.ADMIN_SECRET_KEY);
}
