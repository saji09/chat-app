import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const userId = await getSession();
  
  if (userId) {
    redirect('/chat/general');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome to Next Chat
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Connect with friends and join group conversations
        </p>
        <div className="flex flex-col space-y-4">
          <Link
            href="/register"
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 text-center transition-colors"
          >
            Create Account
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-50 text-center transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}