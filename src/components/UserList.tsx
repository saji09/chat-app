'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/types';

interface SafeUser {
  id: string;
  username: string;
}

interface UserListProps {
  currentUser: User;
  room: string;
}

export default function UserList({ currentUser, room }: UserListProps) {
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    
    // Set up polling for users
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="w-64 bg-white shadow-md p-4 flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-4">Online Users</h2>
      
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-pulse text-gray-500">Loading users...</div>
          </div>
        ) : users.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No users online</p>
        ) : (
          <ul className="space-y-2">
            {users.map((user) => (
              <li
                key={user.id}
                className={`flex items-center p-2 rounded-md ${
                  user.id === currentUser.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                } transition-colors`}
              >
                <div 
                  className={`w-3 h-3 rounded-full mr-2 ${
                    user.id === currentUser.id ? 'bg-blue-500' : 'bg-green-500'
                  }`} 
                />
                <span className="truncate">
                  {user.username}
                  {user.id === currentUser.id && ' (You)'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-2">Room: {room}</p>
        <button
          onClick={handleLogout}
          className="w-full text-sm text-white bg-red-500 py-1 px-3 rounded-md hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}