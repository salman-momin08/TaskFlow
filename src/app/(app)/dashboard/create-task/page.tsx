
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { mockUsers } from '@/lib/mock-data';
import type { Priority, User } from '@/types';
import { priorities } from '@/types'; // Import priorities array
import { useToast } from "@/hooks/use-toast";

const taskFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }).max(100),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }).max(1000),
  priority: z.enum(priorities),
  assigneeId: z.string().optional().or(z.literal("")), // Allow empty string from form, handle in submit
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

const UNASSIGNED_VALUE = "unassigned_task_placeholder";

export default function CreateTaskPage() {
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const developers = mockUsers.filter(user => user.role === 'Developer');

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'Medium',
      assigneeId: '', // This will make the placeholder show initially
    },
  });

  const onSubmit = (data: TaskFormValues) => {
    if (!currentUser) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "You must be logged in to create a task.",
        });
        return;
    }
    
    const processedAssigneeId = data.assigneeId === UNASSIGNED_VALUE || data.assigneeId === '' ? undefined : data.assigneeId;

    const newTask = {
      id: `task-${Date.now()}`, // Mock ID
      title: data.title,
      description: data.description,
      priority: data.priority,
      assigneeId: processedAssigneeId,
      reporterId: currentUser.id,
      status: 'Open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeLoggedMinutes: 0,
    };
    console.log('New Task Submitted:', newTask);
    toast({
        title: "Task Created!",
        description: `Task "${data.title}" has been successfully created.`,
    });
    form.reset(); 
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-lg max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <PlusCircle className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl font-headline">Create New Task</CardTitle>
              <CardDescription>Fill out the form below to add a new task or bug report.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter task title (e.g., Fix login button)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a detailed description of the task or bug..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assigneeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assignee (Optional)</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || ''} // Ensure value is controlled and handles empty string for placeholder
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select assignee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={UNASSIGNED_VALUE}>Unassigned</SelectItem>
                          {developers.map((dev: User) => (
                            <SelectItem key={dev.id} value={dev.id}>{dev.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Leave blank if unassigned.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Submitting..." : "Create Task"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

