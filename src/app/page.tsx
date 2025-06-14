"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from "@/components/ui/skeleton";


export default function HomePage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (currentUser) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [currentUser, loading, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-8">
      <Skeleton className="h-12 w-12 rounded-full mb-4" />
      <Skeleton className="h-4 w-[250px] mb-2" />
      <Skeleton className="h-4 w-[200px]" />
      <p className="mt-4 text-sm text-muted-foreground font-code">Initializing TaskFlow...</p>
    </div>
  );
}
