'use client';

import { useState, useEffect, useRef } from 'react';
import { User, Message } from '@/lib/types';
import { useToast } from './ToastProvider';
import UserList from './UserList';

interface ChatRoomProps {
  room: string;
  user: User;
}

export default function ChatRoom({ room, user }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  useEffect(() => {
    fetchMessages();
    
    // Set up polling for new messages
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [room]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages/${room}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        setIsLoading(false);
      } else if (response.status === 401) {
        // Handle unauthorized access
        window.location.href = '/login';
      }
    } catch (error) {
      addToast('Failed to fetch messages', 'error');
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`/api/messages/${room}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages(); // Refresh messages
      } else {
        const errorData = await response.json();
        addToast(errorData.error || 'Failed to send message', 'error');
      }
    } catch (error) {
      addToast('Failed to send message', 'error');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with UserList component */}
      <UserList currentUser={user} room={room} />

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white p-4 shadow-md">
          <h1 className="text-xl font-semibold">Chat Room: {room}</h1>
          <p className="text-sm text-gray-600">Welcome, {user.username}</p>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.userId === user.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                    message.userId === user.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-800 shadow'
                  }`}
                >
                  <div className="font-semibold">{message.username}</div>
                  <div>{message.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="bg-white p-4 shadow-md">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={1000}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!newMessage.trim()}
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {newMessage.length}/1000 characters
          </p>
        </form>
      </div>
    </div>
  );
}