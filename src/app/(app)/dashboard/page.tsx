"use client";

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import DeveloperDashboard from '@/components/dashboard/DeveloperDashboard';
import ManagerDashboard from '@/components/dashboard/ManagerDashboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg md:col-span-2 lg:col-span-1" />
        </div>
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  if (!currentUser) {
    // This case should ideally be handled by the AppLayout, but as a fallback:
    return <p className="text-center text-destructive">User not authenticated. Redirecting...</p>;
  }

  return (
    <div className="container mx-auto py-2">
      {currentUser.role === 'Developer' && <DeveloperDashboard user={currentUser} />}
      {currentUser.role === 'Manager' && <ManagerDashboard user={currentUser} />}
    </div>
  );
}
