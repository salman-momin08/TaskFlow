
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Sparkles, UserCheck, Users, Loader2 } from 'lucide-react';
import { suggestTaskAssignee, SuggestTaskAssigneeInput, SuggestTaskAssigneeOutput } from '@/ai/flows/suggest-task-assignee';
import { mockDeveloperPerformanceMetrics, mockUsers } from '@/lib/mock-data';
import type { DeveloperPerformanceMetric } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AIAssignPage() {
  const [taskDescription, setTaskDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestTaskAssigneeOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const developerMetrics = mockDeveloperPerformanceMetrics.map(metric => ({
    developerId: metric.developerId,
    averageTaskCompletionTime: metric.averageTaskCompletionTime,
    successRate: metric.successRate,
    currentWorkload: metric.currentOpenTasks,
  }));
  
  const getDeveloperName = (id: string) => mockUsers.find(u => u.id === id)?.name || 'Unknown Developer';
  const getDeveloperAvatar = (id: string) => mockUsers.find(u => u.id === id)?.avatarUrl;
  const getInitials = (name: string) => {
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };


  const handleSuggestAssignee = async () => {
    if (!taskDescription.trim()) {
      toast({
        variant: "destructive",
        title: "Input Required",
        description: "Please enter a task description.",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuggestion(null);

    try {
      const input: SuggestTaskAssigneeInput = {
        taskDescription,
        developerPerformanceMetrics: developerMetrics,
      };
      const result = await suggestTaskAssignee(input);
      setSuggestion(result);
    } catch (err) {
      console.error("AI Suggestion Error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      toast({
        variant: "destructive",
        title: "AI Suggestion Failed",
        description: err instanceof Error ? err.message : "Could not get AI suggestion. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl font-headline">AI Task Assignment</CardTitle>
              <CardDescription>Leverage AI to suggest the best assignee for a new task.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label htmlFor="taskDescription" className="block text-sm font-medium text-foreground mb-1">
              Task Description
            </label>
            <Textarea
              id="taskDescription"
              placeholder="Describe the task in detail (e.g., 'Develop a new user authentication feature using OAuth 2.0 and integrate with existing user database. Requires strong knowledge of security best practices and Node.js.')"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="min-h-[100px]"
              disabled={isLoading}
            />
          </div>
          <Button onClick={handleSuggestAssignee} disabled={isLoading || !taskDescription.trim()} className="w-full sm:w-auto">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Suggest Assignee
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {suggestion && (
            <Card className="bg-accent/10 border-accent">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <UserCheck className="h-6 w-6 text-accent" />
                  <CardTitle className="text-xl text-accent font-headline">AI Suggestion</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-lg">
                  Suggested Assignee: <span className="font-semibold">{getDeveloperName(suggestion.suggestedAssigneeId)}</span>
                </p>
                <div>
                  <p className="font-medium text-foreground">Reasoning:</p>
                  <p className="text-muted-foreground">{suggestion.reasoning}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl font-headline">Developer Performance Metrics</CardTitle>
            </div>
            <CardDescription>Metrics used by the AI for suggestions.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockDeveloperPerformanceMetrics.map((dev) => (
                    <Card key={dev.developerId} className="p-4">
                        <div className="flex items-center space-x-3 mb-2">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={dev.avatarUrl} alt={dev.name} data-ai-hint="person" />
                                <AvatarFallback>{getInitials(dev.name)}</AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-lg">{dev.name}</CardTitle>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>Avg. Completion: <span className="font-medium text-foreground">{dev.averageTaskCompletionTime} hrs</span></li>
                            <li>Success Rate: <span className="font-medium text-foreground">{(dev.successRate * 100).toFixed(0)}%</span></li>
                            <li>Current Workload: <span className="font-medium text-foreground">{dev.currentOpenTasks} tasks</span></li>
                        </ul>
                    </Card>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
