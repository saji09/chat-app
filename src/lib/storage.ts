import { Message, User } from "./types";

// Simple in-memory storage with localStorage fallback
let users: User[] = [];
let messages: Message[] = [];

if (typeof window !== 'undefined') {
  // Load from localStorage if available
  const storedUsers = localStorage.getItem('chat-app-users');
  const storedMessages = localStorage.getItem('chat-app-messages');
  
  if (storedUsers) {
    try {
      users = JSON.parse(storedUsers);
    } catch (e) {
      console.error('Error parsing stored users:', e);
    }
  }
  
  if (storedMessages) {
    try {
      messages = JSON.parse(storedMessages);
    } catch (e) {
      console.error('Error parsing stored messages:', e);
    }
  }
}

export const saveUsers = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('chat-app-users', JSON.stringify(users));
  }
};

export const saveMessages = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('chat-app-messages', JSON.stringify(messages));
  }
};

export const getUsers = () => users;

export const getMessages = (room?: string) => {
  if (!room) return messages;
  return messages.filter(msg => msg.room === room);
};

export const addUser = (user: Omit<User, 'id'>) => {
  const newUser = { ...user, id: Date.now().toString() };
  users.push(newUser);
  saveUsers();
  return newUser;
};

export const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
  const newMessage = {
    ...message,
    id: Date.now().toString(),
    timestamp: new Date(),
  };
  messages.push(newMessage);
  saveMessages();
  return newMessage;
};

export const findUserByUsername = (username: string) => {
  return users.find(user => user.username === username);
};

export const findUserById = (id: string) => {
  return users.find(user => user.id === id);
};