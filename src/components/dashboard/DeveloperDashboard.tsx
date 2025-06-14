
"use client";

import React, { useMemo } from 'react';
import type { User, Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Filter, CalendarDays, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { mockTasks } from '@/lib/mock-data';
import { format, subDays, getDay, parseISO, isSameDay } from 'date-fns';

interface DeveloperDashboardProps {
  user: User;
}

export default function DeveloperDashboard({ user }: DeveloperDashboardProps) {
  const assignedTasks = useMemo(() => {
    return mockTasks.filter(task => task.assigneeId === user.id);
  }, [user.id]);

  const tasksToDisplay = useMemo(() => {
    // Display a mix of tasks, prioritizing In Progress and Open
    const inProgress = assignedTasks.filter(t => t.status === 'In Progress');
    const open = assignedTasks.filter(t => t.status === 'Open');
    const other = assignedTasks.filter(t => t.status !== 'In Progress' && t.status !== 'Open');
    return [...inProgress, ...open, ...other].slice(0, 3); // Show up to 3 tasks
  }, [assignedTasks]);

  const dailyActivityData = useMemo(() => {
    const today = new Date();
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const lastSevenDaysData = Array.from({ length: 7 }).map((_, i) => {
      const day = subDays(today, 6 - i);
      return {
        date: day,
        day: dayLabels[getDay(day)],
        tasksCompleted: 0,
      };
    });

    assignedTasks.forEach(task => {
      if (task.status === 'Closed') {
        const completionDate = parseISO(task.updatedAt);
        const dayEntry = lastSevenDaysData.find(d => isSameDay(d.date, completionDate));
        if (dayEntry) {
          dayEntry.tasksCompleted += 1;
        }
      }
    });
    return lastSevenDaysData.map(d => ({ day: d.day, tasksCompleted: d.tasksCompleted }));
  }, [assignedTasks]);

  const chartConfigDailyActivity = {
    tasksCompleted: { label: "Tasks Completed", color: "hsl(var(--chart-1))" },
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <CardTitle className="text-3xl font-headline text-primary">Welcome, {user.name}!</CardTitle>
              <CardDescription className="text-lg">Here's an overview of your tasks ({assignedTasks.length} total).</CardDescription>
            </div>
            <Link href="/dashboard/create-task" passHref>
              <Button className="mt-4 sm:mt-0">
                <PlusCircle className="mr-2 h-5 w-5" /> Create New Task
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
           <div className="flex flex-wrap gap-4 mb-6">
             <Link href="/dashboard/my-tasks">
                <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" /> View All My Tasks
                </Button>
             </Link>
            {/* Placeholder for future sorting functionality */}
            {/* <Button variant="outline" disabled>
              <CalendarDays className="mr-2 h-4 w-4" /> Sort by Date
            </Button> */}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasksToDisplay.map((task) => (
          <Card key={task.id} className="hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="font-headline text-xl">{task.title}</CardTitle>
              <CardDescription>Priority: {task.priority} | Status: {task.status}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-1">{task.description}</p>
              <p className="text-xs text-muted-foreground">Last Updated: {format(parseISO(task.updatedAt), 'PP')}</p>
              <Button variant="link" className="p-0 h-auto mt-2 text-primary" asChild>
                <Link href={`/dashboard/task/${task.id}`}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
         {assignedTasks.length === 0 && (
           <Card className="md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-12 text-center">
            <Image src="https://placehold.co/300x200.png" data-ai-hint="empty tasks" alt="No tasks" width={300} height={200} className="rounded-md mb-6 opacity-70" />
            <CardTitle className="font-headline text-2xl mb-2">No Tasks Assigned</CardTitle>
            <CardDescription>Looks like your plate is clear! Enjoy the calm or create a new task.</CardDescription>
            <Link href="/dashboard/create-task" passHref className="mt-4">
              <Button>
                <PlusCircle className="mr-2 h-5 w-5" /> Create Task
              </Button>
            </Link>
          </Card>
         )}
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline text-2xl">Daily Task Activity</CardTitle>
          </div>
          <CardDescription>Your task completions over the past week.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfigDailyActivity} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={dailyActivityData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  tickLine={false} 
                  axisLine={false} 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  allowDecimals={false} 
                />
                <ChartTooltip 
                    cursor={false}
                    content={<ChartTooltipContent 
                                indicator="dot" 
                                labelClassName="font-semibold" 
                                className="rounded-lg shadow-lg border-border/50 bg-background" 
                            />} 
                />
                <Bar 
                  dataKey="tasksCompleted" 
                  fill="var(--color-tasksCompleted)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={30}
                  name="Tasks Completed" 
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

