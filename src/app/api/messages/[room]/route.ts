import { NextRequest, NextResponse } from 'next/server';
import { getMessages, addMessage } from '@/lib/storage';
import { getSession } from '@/lib/auth';
import { findUserById } from '@/lib/storage';

// Define the type for the params
interface Params {
  params: Promise<{ room: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    // Check if user is authenticated
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // Await the params to get the room value
    const { room } = await params;
    
    // Get messages for the specific room
    const messages = getMessages(room);
    
    return NextResponse.json({ 
      room,
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

export async function POST(request: NextRequest, { params }: Params) {
  try {
    // Check if user is authenticated
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // Get user information
    const user = findUserById(session);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      );
    }

    // Await the params to get the room value
    const { room } = await params;
    const { content } = await request.json();

    // Validate input
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Message content is required and must be a string' },
        { status: 400 }
      );
    }

    if (content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message content cannot be empty' },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Message content is too long (max 1000 characters)' },
        { status: 400 }
      );
    }

    // Add the message to storage
    const message = addMessage({
      content: content.trim(),
      room,
      userId: user.id,
      username: user.username,
    });

    // Return the created message
    return NextResponse.json({ 
      message 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}