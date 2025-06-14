
"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, User, CalendarDays, Tag, InfoIcon, AlignLeft, Activity, Edit3, Trash2, MessageSquare } from 'lucide-react'; // Changed Info to InfoIcon
import { mockTasks, mockUsers } from '@/lib/mock-data';
import type { Task, User as UserType } from '@/types';
import type { BadgeProps } from "@/components/ui/badge"; // For badge variant type
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils'; // Added missing import

// Helper component for displaying info items
interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value?: string | React.ReactNode;
  children?: React.ReactNode;
  badgeVariant?: BadgeProps['variant'];
  badgeClassName?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, label, value, children, badgeVariant, badgeClassName }) => (
  <div className="flex flex-col space-y-1 p-3 bg-secondary/30 rounded-lg shadow-sm">
    <div className="flex items-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
      <Icon className="mr-2 h-3.5 w-3.5" />
      {label}
    </div>
    {value && !badgeVariant && <p className="text-sm text-foreground font-medium">{value}</p>}
    {value && badgeVariant && (
      <Badge variant={badgeVariant} className={cn("capitalize text-xs px-2 py-0.5", badgeClassName)}>
        {value}
      </Badge>
    )}
    {children && <div className="text-sm text-foreground font-medium">{children}</div>}
  </div>
);

// Helper functions for badge variants
function getBadgeVariantForStatus(status: Task['status']): BadgeProps['variant'] {
  switch (status) {
    case 'Open':
      return 'default'; // Primary color (blue by default)
    case 'In Progress':
      return 'secondary'; // Muted color
    case 'Pending Approval':
      return 'outline'; 
    case 'Closed':
      return 'default'; // Using default, could be styled with className for green
    case 'Reopened':
      return 'destructive';
    default:
      return 'default';
  }
}
function getBadgeClassNameForStatus(status: Task['status']): string {
    if (status === 'Closed') {
        return 'bg-green-500 hover:bg-green-600 text-white';
    }
    if (status === 'In Progress') {
        return 'bg-amber-500 hover:bg-amber-600 text-black';
    }
    if (status === 'Open') {
        return 'bg-blue-500 hover:bg-blue-600 text-white';
    }
    return '';
}


function getBadgeVariantForPriority(priority: Task['priority']): BadgeProps['variant'] {
  switch (priority) {
    case 'Low':
      return 'secondary';
    case 'Medium':
      return 'default'; 
    case 'High':
      return 'destructive';
    default:
      return 'default';
  }
}


export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.taskId as string;

  const [task, setTask] = useState<Task | null | undefined>(undefined);
  const [assignee, setAssignee] = useState<UserType | null | undefined>(undefined);
  const [reporter, setReporter] = useState<UserType | null | undefined>(undefined);

  useEffect(() => {
    if (taskId) {
      const foundTask = mockTasks.find(t => t.id === taskId);
      setTask(foundTask || null);

      if (foundTask) {
        setAssignee(foundTask.assigneeId ? mockUsers.find(u => u.id === foundTask.assigneeId) || null : null);
        setReporter(mockUsers.find(u => u.id === foundTask.reporterId) || null);
      }
    }
  }, [taskId]);

  const getInitials = (name: string) => {
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  if (task === undefined) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-10 w-32 mb-6" />
        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
            </div>
            <Separator />
            <Skeleton className="h-6 w-1/4 mb-3" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (task === null) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="flex justify-start mb-6">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
        <InfoIcon className="mx-auto h-16 w-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold text-foreground mb-2">Task Not Found</h1>
        <p className="text-lg text-muted-foreground">The task ID <span className="font-mono text-destructive bg-destructive/10 px-1 rounded">{taskId}</span> does not exist or could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => router.back()} className="print:hidden">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
        </Button>
        <div className="flex gap-2 print:hidden">
           {/* Placeholder for future actions */}
          {/* <Button variant="outline" size="sm" disabled><Edit3 className="mr-2 h-4 w-4" /> Edit</Button>
          <Button variant="outline" size="sm" disabled className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/50 hover:border-destructive">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button> */}
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <CardTitle className="text-2xl lg:text-3xl font-headline mb-1 leading-tight">{task.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Task ID: {task.id}</CardDescription>
            </div>
            <div className="flex-shrink-0">
                 <Badge 
                    variant={getBadgeVariantForStatus(task.status)} 
                    className={cn("text-sm px-3 py-1", getBadgeClassNameForStatus(task.status))}
                >
                    {task.status}
                </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            <InfoItem icon={Tag} label="Priority" value={task.priority} badgeVariant={getBadgeVariantForPriority(task.priority)} />
            <InfoItem icon={CalendarDays} label="Created At" value={format(parseISO(task.createdAt), 'MMM d, yyyy \'at\' h:mm a')} />
            <InfoItem icon={CalendarDays} label="Last Updated" value={format(parseISO(task.updatedAt), 'MMM d, yyyy \'at\' h:mm a')} />
            
            {assignee ? (
              <InfoItem icon={User} label="Assignee">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={assignee.avatarUrl} alt={assignee.name} data-ai-hint="person" />
                    <AvatarFallback>{getInitials(assignee.name)}</AvatarFallback>
                  </Avatar>
                  <span>{assignee.name}</span>
                </div>
              </InfoItem>
            ) : <InfoItem icon={User} label="Assignee" value="Unassigned" />}

            {reporter && (
              <InfoItem icon={User} label="Reporter">
                 <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={reporter.avatarUrl} alt={reporter.name} data-ai-hint="person" />
                    <AvatarFallback>{getInitials(reporter.name)}</AvatarFallback>
                  </Avatar>
                  <span>{reporter.name}</span>
                </div>
              </InfoItem>
            )}
            {task.timeLoggedMinutes > 0 && (
                <InfoItem icon={Activity} label="Time Logged" value={`${(task.timeLoggedMinutes / 60).toFixed(1)} hours`} />
            )}
          </div>
          
          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center text-primary">
              <AlignLeft className="mr-2 h-5 w-5" />
              Description
            </h3>
            <div className="prose prose-sm max-w-none text-muted-foreground bg-background p-4 rounded-md border whitespace-pre-wrap">
                {task.description || <span className="italic">No description provided.</span>}
            </div>
          </div>
          
          {/* Future section for comments/activity log */}
          {/* 
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center text-primary">
              <MessageSquare className="mr-2 h-5 w-5" />
              Activity & Comments
            </h3>
            <div className="border rounded-md p-4 min-h-[100px]">
              <p className="text-muted-foreground italic text-sm">No comments or activity logged yet.</p>
            </div>
          </div> 
          */}

        </CardContent>
      </Card>
    </div>
  );
}

