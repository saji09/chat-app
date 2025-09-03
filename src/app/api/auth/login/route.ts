import { NextRequest, NextResponse } from 'next/server';
import { verifyLogin } from '@/lib/auth';
import { setSession } from '@/lib/auth';
import { findUserByUsername } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Simple verification (in a real app, you'd hash passwords)
    const user = findUserByUsername(username);
    
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    await setSession(user.id);

    // Return success response without redirecting
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}