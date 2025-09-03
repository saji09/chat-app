import LoginForm from '@/components/LoginForm';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const userId = await getSession();
  
  if (userId) {
    redirect('/chat/general');
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <LoginForm />
    </div>
  );
}