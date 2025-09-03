import { NextRequest, NextResponse } from 'next/server';
import { addUser, findUserByUsername } from '@/lib/storage';
import { setSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (findUserByUsername(username)) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    const user = addUser({ username, password });
    await setSession(user.id);

    // Return success response without redirecting
    return NextResponse.json({ 
      success: true,
      user: { id: user.id, username: user.username } 
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}