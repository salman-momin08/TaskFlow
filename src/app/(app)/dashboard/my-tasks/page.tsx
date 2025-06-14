
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ListChecks, Filter, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { mockTasks, mockUsers } from '@/lib/mock-data';
import type { Task, Status } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { format, parseISO } from 'date-fns';

export default function MyTasksPage() {
  const { currentUser } = useAuth();
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const assignedTasks = useMemo(() => {
    if (!currentUser) return [];
    return mockTasks.filter(task => task.assigneeId === currentUser.id);
  }, [currentUser]); // mockTasks is not in dependency array, assuming it's stable

  const filteredTasks = useMemo(() => {
    return assignedTasks
      .filter(task => statusFilter === 'all' || task.status === statusFilter)
      .filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()) || task.description.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [assignedTasks, statusFilter, searchTerm]);

  const getReporterName = (reporterId: string) => {
    const reporter = mockUsers.find(user => user.id === reporterId);
    return reporter ? reporter.name : 'Unknown Reporter';
  };

  if (!currentUser) {
    return <p>Loading user data...</p>; // Or a more sophisticated loading state
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <ListChecks className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl font-headline">My Tasks</CardTitle>
              <CardDescription>View and manage tasks assigned to you, {currentUser.name}.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative w-full sm:w-auto flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as Status | 'all')}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {(['Open', 'In Progress', 'Pending Approval', 'Closed', 'Reopened'] as Status[]).map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredTasks.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.map((task: Task) => (
                <Card key={task.id} className="flex flex-col hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">{task.title}</CardTitle>
                    <CardDescription>Priority: {task.priority} | Reported by: {getReporterName(task.reporterId)}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-2">{task.description}</p>
                    <p className="text-sm">Status: <span className="font-semibold text-foreground">{task.status}</span></p>
                    <p className="text-sm">Last Updated: {format(parseISO(task.updatedAt), 'PP')}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="link" className="p-0 h-auto text-primary" asChild>
                      <Link href={`/dashboard/task/${task.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 flex flex-col items-center">
              <Image src="https://placehold.co/300x200.png" data-ai-hint="no tasks" alt="No tasks found" width={200} height={133} className="rounded-md mb-6 opacity-70" />
              <p className="text-lg text-muted-foreground mb-2">No tasks match your current filters.</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

