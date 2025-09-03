import { cookies } from 'next/headers';

export async function setSession(userId: string) {
  const cookieStore = cookies();
  (await cookieStore).set('userId', userId, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
    sameSite: 'lax'
  });
}

export async function getSession() {
  try {
    const cookieStore = cookies();
    return (await cookieStore).get('userId')?.value;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function clearSession() {
  const cookieStore = cookies();
  (await cookieStore).delete('userId');
}

// Add to lib/auth.ts
export async function verifyLogin(username: string, password: string) {
  const { findUserByUsername } = await import('@/lib/storage');
  const user = findUserByUsername(username);
  
  // Simple password check (in real app, use hashing)
  if (!user || user.password !== password) {
    return null;
  }
  
  return user;
}