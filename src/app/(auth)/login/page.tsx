"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Logo from '@/components/icons/Logo';
import { mockUsers } from '@/lib/mock-data';
import type { User } from '@/types';

export default function LoginPage() {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const { login, currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && currentUser) {
      router.replace('/dashboard');
    }
  }, [currentUser, loading, router]);


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId) {
      login(selectedUserId);
    }
  };

  if (loading || currentUser) {
     return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="items-center text-center">
          <Logo size={64} className="mb-4" />
          <CardTitle className="text-3xl font-headline">Welcome to TaskFlow</CardTitle>
          <CardDescription>Select a mock user to sign in.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="user-select" className="text-base">Select User Profile</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger id="user-select" className="w-full text-base h-12">
                  <SelectValue placeholder="Choose a user..." />
                </SelectTrigger>
                <SelectContent>
                  {mockUsers.map((user: User) => (
                    <SelectItem key={user.id} value={user.id} className="text-base py-2">
                      {user.name} ({user.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full h-12 text-lg" disabled={!selectedUserId}>
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col items-center text-center">
            <p className="text-xs text-muted-foreground mt-4">
                This is a mock authentication system. No real credentials are used.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
