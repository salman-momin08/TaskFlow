
// src/ai/flows/suggest-task-assignee.ts
'use server';
/**
 * @fileOverview An AI agent to suggest the best assignee for a task based on performance metrics.
 *
 * - suggestTaskAssignee - A function that suggests a task assignee.
 * - SuggestTaskAssigneeInput - The input type for the suggestTaskAssignee function.
 * - SuggestTaskAssigneeOutput - The return type for the suggestTaskAssignee function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTaskAssigneeInputSchema = z.object({
  taskDescription: z.string().describe('The description of the task to be assigned.'),
  developerPerformanceMetrics: z
    .array(z.object({
      developerId: z.string(),
      averageTaskCompletionTime: z.number().describe('Average time in hours to complete a task.'),
      successRate: z.number().describe('Success rate (0 to 1) of task completion.'),
      currentWorkload: z.number().describe('The current number of tasks assigned to the developer.'),
    }))
    .describe('Array of developer performance metrics.'),
});

export type SuggestTaskAssigneeInput = z.infer<typeof SuggestTaskAssigneeInputSchema>;

const SuggestTaskAssigneeOutputSchema = z.object({
  suggestedAssigneeId: z.string().describe('The ID of the suggested developer to assign the task to.'),
  reasoning: z.string().describe('The reasoning behind the assignee suggestion.'),
});

export type SuggestTaskAssigneeOutput = z.infer<typeof SuggestTaskAssigneeOutputSchema>;

// This is the callable prompt object defined by ai.definePrompt
const suggestTaskAssigneePrompt = ai.definePrompt({
  name: 'suggestTaskAssigneePrompt',
  input: {schema: SuggestTaskAssigneeInputSchema},
  output: {schema: SuggestTaskAssigneeOutputSchema},
  prompt: `You are an AI assistant helping managers assign tasks to developers. You are given a task description and performance metrics for each developer. Based on this information, you must choose the best developer to assign the task to.

Task Description: {{{taskDescription}}}

Developer Performance Metrics:
{{#each developerPerformanceMetrics}}
- Developer ID: {{{developerId}}}, Average Task Completion Time: {{{averageTaskCompletionTime}}} hours, Success Rate: {{{successRate}}}, Current Workload: {{{currentWorkload}}} tasks
{{/each}}

Consider these factors when choosing the best developer:
* The developer's average task completion time.
* The developer's success rate.
* The developer's current workload. Prefer developers with a lower current workload.

Output the suggestedAssigneeId and reasoning fields in JSON format.
`,
});

// This is the Genkit flow definition
const suggestTaskAssigneeFlow = ai.defineFlow(
  {
    name: 'suggestTaskAssigneeFlow',
    inputSchema: SuggestTaskAssigneeInputSchema,
    outputSchema: SuggestTaskAssigneeOutputSchema,
  },
  async (input: SuggestTaskAssigneeInput): Promise<SuggestTaskAssigneeOutput> => {
    console.log('Executing suggestTaskAssigneeFlow with input:', JSON.stringify(input));
    try {
      const result = await suggestTaskAssigneePrompt(input); // Call the prompt object
      const output = result.output; // Access the output from the response

      if (!output) {
        console.error('AI Suggestion Flow Error: Genkit prompt returned no output or a null output.');
        throw new Error('AI suggestion failed: No output received from the AI model.');
      }
      console.log('suggestTaskAssigneeFlow received output:', JSON.stringify(output));
      return output;
    } catch (flowError: any) {
      // Log the full error object for better debugging on Vercel
      console.error('Error within suggestTaskAssigneeFlow execution (raw):', flowError);
      console.error('Error within suggestTaskAssigneeFlow execution (stringified):', JSON.stringify(flowError, Object.getOwnPropertyNames(flowError)));
      
      let errorMessage = 'An unknown error occurred inside the AI flow execution.';
      if (flowError instanceof Error) {
        errorMessage = flowError.message;
        // Check for common API key/configuration related messages from Google
        if (errorMessage.includes("API key not valid") || 
            errorMessage.includes("permission denied") || 
            errorMessage.includes("API_KEY_INVALID") ||
            errorMessage.includes("User location is not supported") || // Added this check
            errorMessage.includes("Billing account not found") ||
            errorMessage.includes("API not enabled")) {
            throw new Error(`AI API Configuration Error: ${errorMessage}. Please verify your API key, Google Cloud project settings (e.g., API enabled, billing active, region availability), and that your Vercel deployment region is supported by the API.`);
        }
        // For other errors that are instances of Error
        throw new Error(`AI flow execution error: ${errorMessage}`);
      } else if (typeof flowError === 'string') {
        // Handle cases where the error might be a string
        errorMessage = flowError;
        throw new Error(`AI flow execution error (string): ${errorMessage}`);
      }
      // Fallback for other types of errors
      throw new Error(errorMessage);
    }
  }
);

// This is the exported server action function
export async function suggestTaskAssignee(input: SuggestTaskAssigneeInput): Promise<SuggestTaskAssigneeOutput> {
  console.log("Attempting to call suggestTaskAssignee server action.");
  if (!process.env.GOOGLE_API_KEY) {
    console.error("AI Action Failed: The GOOGLE_API_KEY environment variable is not set.");
    throw new Error("AI_CONFIG_ERROR: The GOOGLE_API_KEY environment variable is missing. Please configure it in your deployment environment.");
  }

  try {
    return await suggestTaskAssigneeFlow(input);
  } catch (error: any) {
     // Log the full error object for better debugging on Vercel
    console.error("Error calling suggestTaskAssigneeFlow from the wrapper function (raw):", error);
    console.error("Error calling suggestTaskAssigneeFlow from the wrapper function (stringified):", JSON.stringify(error, Object.getOwnPropertyNames(error)));

    let clientErrorMessage = "An unexpected error occurred while processing the AI task assignee suggestion.";
    if (error instanceof Error) {
        clientErrorMessage = error.message;
      if (clientErrorMessage.startsWith("AI_CONFIG_ERROR:") || clientErrorMessage.startsWith("AI API Configuration Error:") || clientErrorMessage.startsWith("AI flow execution error:")) {
        throw error; 
      }
      throw new Error(`AI Task Assignee Suggestion Failed: ${clientErrorMessage}`);
    } else if (typeof error === 'string'){
        clientErrorMessage = error;
        throw new Error(`AI Task Assignee Suggestion Failed (string): ${clientErrorMessage}`);
    }
    throw new Error(clientErrorMessage);
  }
}
