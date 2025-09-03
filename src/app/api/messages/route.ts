import { NextRequest, NextResponse } from 'next/server';
import { getMessages, addMessage } from '@/lib/storage';
import { getSession } from '@/lib/auth';
import { findUserById } from '@/lib/storage';

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

    // Get all messages or filter by room if provided
    const { searchParams } = new URL(request.url);
    const room = searchParams.get('room');
    
    const messages = getMessages(room || undefined);
    
    return NextResponse.json({ 
      messages 
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = findUserById(session);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { content, room } = await request.json();

    if (!content || !room) {
      return NextResponse.json(
        { error: 'Content and room are required' },
        { status: 400 }
      );
    }

    const message = addMessage({
      content,
      room,
      userId: user.id,
      username: user.username,
    });

    return NextResponse.json({ message });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}