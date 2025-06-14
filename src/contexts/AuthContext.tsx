"use client";

import type { User, UserRole } from '@/types';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { mockUsers } from '@/lib/mock-data';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (userId: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('taskflow-user');
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        // Validate if user still exists in mockUsers, simple check
        if (mockUsers.find(u => u.id === parsedUser.id)) {
          setCurrentUser(parsedUser);
        } else {
          localStorage.removeItem('taskflow-user');
        }
      }
    } catch (error) {
      console.error("Error loading user from localStorage", error);
      localStorage.removeItem('taskflow-user');
    }
    setLoading(false);
  }, []);

  const login = (userId: string) => {
    const userToLogin = mockUsers.find(user => user.id === userId);
    if (userToLogin) {
      setCurrentUser(userToLogin);
      localStorage.setItem('taskflow-user', JSON.stringify(userToLogin));
    } else {
      console.error("User not found for login");
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('taskflow-user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
