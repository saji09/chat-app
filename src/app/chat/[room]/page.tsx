import ChatRoom from '@/components/ChatRoom';
import { getSession } from '@/lib/auth';
import { findUserById } from '@/lib/storage';
import { redirect } from 'next/navigation';

// Use generateStaticParams for pages as well
export function generateStaticParams() {
  return [{ room: 'general' }, { room: 'random' }];
}

interface ChatPageProps {
  params: { room: string };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const userId = await getSession();
  
  if (!userId) {
    redirect('/login');
  }

  const user = findUserById(userId);
  
  if (!user) {
    // Clear invalid session and redirect to login
    const { clearSession } = await import('@/lib/auth');
    await clearSession();
    redirect('/login');
  }

  return <ChatRoom room={params.room} user={user} />;
}