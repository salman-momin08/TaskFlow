
"use client";

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart3, PieChartIcon, Users, CheckCircle, ListChecks } from 'lucide-react';
import { BarChart, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Bar, Pie, Cell, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { mockTasks, mockUsers } from '@/lib/mock-data';
import type { Task, Status, User as UserType } from '@/types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function ReportsPage() {
  const tasksByStatus = useMemo(() => {
    const statusCounts: { [key in Status]?: number } = {};
    mockTasks.forEach(task => {
      statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
    });
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value: value! }));
  }, [mockTasks]);

  const chartConfigTasksByStatus = useMemo(() => {
    const config: any = {};
    tasksByStatus.forEach((item, index) => {
      config[item.name.toLowerCase().replace(/\s+/g, '')] = {
        label: item.name,
        color: COLORS[index % COLORS.length],
      };
    });
    return config;
  }, [tasksByStatus]);


  const tasksCompletedPerDeveloper = useMemo(() => {
    const devTaskCounts: { [developerId: string]: { name: string, completed: number, open: number } } = {};
    mockUsers.filter(u => u.role === 'Developer').forEach(dev => {
        devTaskCounts[dev.id] = { name: dev.name, completed: 0, open: 0 };
    });

    mockTasks.forEach(task => {
      if (task.assigneeId && devTaskCounts[task.assigneeId]) {
        if (task.status === 'Closed') {
          devTaskCounts[task.assigneeId].completed += 1;
        } else if (task.status === 'Open' || task.status === 'In Progress' || task.status === 'Reopened') {
          devTaskCounts[task.assigneeId].open += 1;
        }
      }
    });
    return Object.values(devTaskCounts);
  }, [mockTasks, mockUsers]);

  const chartConfigTasksPerDev = {
    completed: { label: "Completed", color: "hsl(var(--chart-2))" },
    open: { label: "Open/In Progress", color: "hsl(var(--chart-1))" },
  };
  
  const totalTasks = mockTasks.length;
  const openTasksCount = tasksByStatus.find(s => s.name === 'Open')?.value || 0;
  const closedTasksCount = tasksByStatus.find(s => s.name === 'Closed')?.value || 0;


  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl font-headline">Reports & Analytics</CardTitle>
              <CardDescription>Insights into team performance and task progress.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                <Card className="bg-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-primary">Total Tasks</CardTitle>
                        <ListChecks className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{totalTasks}</div>
                        <p className="text-xs text-primary/80">All tasks in system</p>
                    </CardContent>
                </Card>
                <Card className="bg-destructive/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-destructive">Open Tasks</CardTitle>
                        <ListChecks className="h-5 w-5 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">{openTasksCount}</div>
                         <p className="text-xs text-destructive/80">Currently active</p>
                    </CardContent>
                </Card>
                 <Card className="bg-green-500/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-600">Closed Tasks</CardTitle>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{closedTasksCount}</div>
                        <p className="text-xs text-green-600/80">Successfully completed</p>
                    </CardContent>
                </Card>
            </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-primary" />
                    <CardTitle>Tasks by Status</CardTitle>
                </div>
                <CardDescription>Distribution of tasks across different statuses.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfigTasksByStatus} className="aspect-square h-[300px] w-full">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Pie data={tasksByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                      {tasksByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle>Task Load per Developer</CardTitle>
                </div>
                <CardDescription>Number of completed vs. open/in-progress tasks per developer.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfigTasksPerDev} className="h-[300px] w-full">
                  <BarChart data={tasksCompletedPerDeveloper} layout="vertical" margin={{left: 20}}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} strokeWidth={0} width={100} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                    <Legend />
                    <Bar dataKey="completed" fill="var(--color-completed)" radius={4} name="Completed" />
                    <Bar dataKey="open" fill="var(--color-open)" radius={4} name="Open/In Progress" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

