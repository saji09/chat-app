import { NextRequest, NextResponse } from 'next/server';
import { getUsers } from '@/lib/storage';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // Get all users from storage
    const users = getUsers();
    
    // Return users without sensitive information (passwords)
    const safeUsers = users.map(user => ({
      id: user.id,
      username: user.username
    }));

    return NextResponse.json({ users: safeUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}