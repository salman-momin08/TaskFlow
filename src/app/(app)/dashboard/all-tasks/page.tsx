
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Layers, Filter, Search, User, BarChartHorizontalBig } from 'lucide-react';
import { mockTasks, mockUsers } from '@/lib/mock-data';
import type { Task, User as UserType, Status, Priority } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { priorities as allPriorities, statuses as allStatuses } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AllTasksPage() {
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const developers = useMemo(() => mockUsers.filter(user => user.role === 'Developer'), []);

  const filteredTasks = useMemo(() => {
    return mockTasks
      .filter(task => statusFilter === 'all' || task.status === statusFilter)
      .filter(task => priorityFilter === 'all' || task.priority === priorityFilter)
      .filter(task => assigneeFilter === 'all' || task.assigneeId === assigneeFilter || (!task.assigneeId && assigneeFilter === 'unassigned'))
      .filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()) || task.description.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [statusFilter, priorityFilter, assigneeFilter, searchTerm]); // mockTasks removed from deps, assuming stable

  const getUserById = (userId?: string): UserType | undefined => {
    return mockUsers.find(user => user.id === userId);
  };

  const getInitials = (name: string) => {
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Layers className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl font-headline">All Tasks</CardTitle>
              <CardDescription>Browse and manage all tasks in the system.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
            <div className="relative w-full md:flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Search tasks by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full md:w-auto">
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as Status | 'all')}>
                  <SelectTrigger className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {allStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as Priority | 'all')}>
                  <SelectTrigger className="w-full">
                    <BarChartHorizontalBig className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    {allPriorities.map(priority => <SelectItem key={priority} value={priority}>{priority}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Select value={assigneeFilter} onValueChange={(value) => setAssigneeFilter(value as string | 'all')}>
                  <SelectTrigger className="w-full">
                    <User className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignees</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {developers.map(dev => <SelectItem key={dev.id} value={dev.id}>{dev.name}</SelectItem>)}
                  </SelectContent>
                </Select>
            </div>
          </div>

          {filteredTasks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task: Task) => {
                  const assignee = getUserById(task.assigneeId);
                  const reporter = getUserById(task.reporterId);
                  return (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>{task.status}</TableCell>
                      <TableCell>{task.priority}</TableCell>
                      <TableCell>
                        {assignee ? (
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={assignee.avatarUrl} alt={assignee.name} data-ai-hint="person" />
                                    <AvatarFallback>{getInitials(assignee.name)}</AvatarFallback>
                                </Avatar>
                                {assignee.name}
                            </div>
                        ) : <span className="text-muted-foreground italic">Unassigned</span>}
                      </TableCell>
                      <TableCell>{reporter ? reporter.name : 'Unknown'}</TableCell>
                      <TableCell>{new Date(task.updatedAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="link" size="sm" asChild>
                          <Link href={`/dashboard/task/${task.id}`}>Details</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 flex flex-col items-center">
              <Image src="https://placehold.co/300x200.png" data-ai-hint="empty table" alt="No tasks found" width={200} height={133} className="rounded-md mb-6 opacity-70" />
              <p className="text-lg text-muted-foreground mb-2">No tasks match your current filters.</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

