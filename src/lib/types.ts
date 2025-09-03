// lib/types.ts
export interface User {
  id: string;
  username: string;
  password: string;
}

export interface SafeUser {
  id: string;
  username: string;
}

export interface Message {
  id: string;
  content: string;
  userId: string;
  username: string;
  room: string;
  timestamp: Date;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}