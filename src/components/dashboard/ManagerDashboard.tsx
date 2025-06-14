
"use client";

import React, { useMemo } from 'react';
import type { User, Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, ListFilter, Activity, CheckCircle, XCircle, Clock, BarChart3, Brain } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { mockTasks, mockUsers } from '@/lib/mock-data';
import { format, subWeeks, startOfWeek, endOfWeek, isWithinInterval, parseISO, isThisMonth, differenceInBusinessDays } from 'date-fns';

interface ManagerDashboardProps {
  user: User;
}

export default function ManagerDashboard({ user }: ManagerDashboardProps) {
  const allTasks = mockTasks; // Use all mock tasks

  const openTasks = useMemo(() => allTasks.filter(task => task.status === 'Open' || task.status === 'In Progress'), [allTasks]);
  const closedTasks = useMemo(() => allTasks.filter(task => task.status === 'Closed'), [allTasks]);
  const pendingTasks = useMemo(() => allTasks.filter(task => task.status === 'Pending Approval'), [allTasks]);

  const tasksClosedThisMonth = useMemo(() => {
    return allTasks.filter(task => task.status === 'Closed' && isThisMonth(parseISO(task.updatedAt))).length;
  }, [allTasks]);

  const avgTimeHours = useMemo(() => {
    const closedAndLoggedTasks = allTasks.filter(task => task.status === 'Closed' && task.timeLoggedMinutes > 0);
    if (closedAndLoggedTasks.length === 0) return '0.0';
    const totalLoggedMinutes = closedAndLoggedTasks.reduce((sum, task) => sum + task.timeLoggedMinutes, 0);
    return (totalLoggedMinutes / closedAndLoggedTasks.length / 60).toFixed(1);
  }, [allTasks]);


  const teamActivityData = useMemo(() => {
    const today = new Date();
    const data = Array.from({ length: 4 }).map((_, i) => {
      const weekEndTarget = subWeeks(today, i); // Week 4 (current) is i=0, Week 1 is i=3
      const weekStart = startOfWeek(weekEndTarget, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(weekEndTarget, { weekStartsOn: 1 });
      return {
        week: `Week ${4 - i}`,
        startDate: weekStart,
        endDate: weekEnd,
        created: 0,
        resolved: 0,
      };
    }).reverse(); // Order from Week 1 to Week 4

    allTasks.forEach(task => {
      const createdAtDate = parseISO(task.createdAt);
      const updatedAtDate = parseISO(task.updatedAt);

      for (const weekData of data) {
        if (isWithinInterval(createdAtDate, { start: weekData.startDate, end: weekData.endDate })) {
          weekData.created += 1;
        }
        if (task.status === 'Closed' && isWithinInterval(updatedAtDate, { start: weekData.startDate, end: weekData.endDate })) {
          weekData.resolved += 1;
        }
      }
    });
    return data.map(({ week, created, resolved }) => ({ week, created, resolved }));
  }, [allTasks]);


  const chartConfigTeamActivity = {
    created: { label: "Tasks Created", color: "hsl(var(--chart-1))" },
    resolved: { label: "Tasks Resolved", color: "hsl(var(--chart-2))" },
  };


  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="pb-2">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
                <CardTitle className="text-3xl font-headline text-primary">Manager Dashboard</CardTitle>
                <CardDescription className="text-lg">Oversee project progress and team performance, {user.name}.</CardDescription>
            </div>
            <Link href="/dashboard/ai-assign" passHref>
                <Button variant="outline" className="mt-4 sm:mt-0 bg-accent text-accent-foreground hover:bg-accent/90">
                    <Brain className="mr-2 h-5 w-5" /> AI Assign Task
                </Button>
            </Link>
          </div>
        </CardHeader>
         <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card className="bg-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary">Total Open Tasks</CardTitle>
                <ListFilter className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{openTasks.length}</div>
                <p className="text-xs text-primary/80">Actively being worked on</p>
              </CardContent>
            </Card>
            <Card className="bg-destructive/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-destructive">Pending Approval</CardTitle>
                <Clock className="h-5 w-5 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{pendingTasks.length}</div>
                 <p className="text-xs text-destructive/80">Awaiting review</p>
              </CardContent>
            </Card>
             <Card className="bg-green-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-600">Tasks Closed (Month)</CardTitle>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{tasksClosedThisMonth}</div>
                <p className="text-xs text-green-600/80">Completed this month</p>
              </CardContent>
            </Card>
            <Card className="bg-amber-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-amber-600">Avg. Time per Task</CardTitle>
                <Activity className="h-5 w-5 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{avgTimeHours} hrs</div>
                <p className="text-xs text-amber-600/80">Avg. for closed tasks</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="open" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex mb-4">
          <TabsTrigger value="open">Open Tasks ({openTasks.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval ({pendingTasks.length})</TabsTrigger>
          <TabsTrigger value="closed">Closed Tasks ({closedTasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="open">
          <TaskListView tasks={openTasks} title="Open & In Progress Tasks" />
        </TabsContent>
        <TabsContent value="pending">
          <TaskListView tasks={pendingTasks} title="Tasks Pending Approval" isApprovalView={true} />
        </TabsContent>
        <TabsContent value="closed">
          <TaskListView tasks={closedTasks} title="Recently Closed Tasks" />
        </TabsContent>
      </Tabs>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline text-2xl">Team Task Activity</CardTitle>
          </div>
           <CardDescription>Overall bug and task resolution trends over the last 4 weeks.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfigTeamActivity} className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={teamActivityData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} stroke="#888888" fontSize={12} />
                <YAxis tickLine={false} axisLine={false} stroke="#888888" fontSize={12} allowDecimals={false} />
                <ChartTooltip 
                    cursor={false}
                    content={<ChartTooltipContent 
                                indicator="dashed" 
                                labelClassName="font-semibold" 
                                className="rounded-lg shadow-lg border-border/50 bg-background" 
                            />} 
                />
                <ChartLegend content={<ChartLegendContent iconType="circle" className="mt-2 text-sm"/>} />
                <Bar dataKey="created" fill="var(--color-created)" radius={[4, 4, 0, 0]} barSize={20} name="Created" />
                <Bar dataKey="resolved" fill="var(--color-resolved)" radius={[4, 4, 0, 0]} barSize={20} name="Resolved" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for displaying task lists within tabs
function TaskListView({ tasks, title, isApprovalView = false }: { tasks: Task[], title: string, isApprovalView?: boolean }) {
  const getAssigneeName = (assigneeId?: string) => {
    if (!assigneeId) return 'Unassigned';
    return mockUsers.find(u => u.id === assigneeId)?.name || 'Unknown User';
  };
  
  if (tasks.length === 0) {
    return (
        <Card className="flex flex-col items-center justify-center py-12 text-center">
          <Image src="https://placehold.co/300x200.png" data-ai-hint="empty list" alt="No tasks in this category" width={200} height={133} className="rounded-md mb-4 opacity-60" />
          <CardTitle className="font-headline text-xl mb-1">Nothing here!</CardTitle>
          <CardDescription>No tasks match the current criteria.</CardDescription>
        </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map(task => (
          <Card key={task.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-secondary/50 transition-colors">
            <div>
              <h3 className="font-semibold text-lg">{task.title}</h3>
              <p className="text-sm text-muted-foreground">Assignee: {getAssigneeName(task.assigneeId)} | Priority: {task.priority}</p>
            </div>
            <div className="flex gap-2 mt-3 sm:mt-0">
              {isApprovalView && (
                <>
                  <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white" disabled>
                    <CheckCircle className="mr-1 h-4 w-4" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white" disabled>
                    <XCircle className="mr-1 h-4 w-4" /> Reopen
                  </Button>
                </>
              )}
              <Button size="sm" variant="outline" asChild>
                <Link href={`/dashboard/task/${task.id}`}>View Details</Link>
              </Button>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

