'use server';

/**
 * @fileOverview A simple chat flow.
 *
 * - chat - A function that takes a history of messages and returns a response.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define message schema for chat history
const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const ChatInputSchema = z.array(ChatMessageSchema);
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  reply: z.string(),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

// The exported function that will be called by server actions
export async function chat(messages: ChatInput): Promise<ChatOutput> {
  return chatFlow(messages);
}

// The Genkit flow definition
const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (messages) => {
    // Separate the last message as the new prompt and the rest as history.
    // The last message is always from the user in our UI implementation.
    const lastMessage = messages[messages.length - 1];
    const historyMessages = messages.slice(0, messages.length - 1);

    // Map the history to the format expected by Genkit's `generate` function
    const history = historyMessages.map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }],
    }));

    // The `generate` call uses the last user message as the prompt.
    const { output } = await ai.generate({
      prompt: lastMessage.content,
      history: history,
      config: {
        temperature: 0.7,
      },
    });

    return {
      reply: output.text,
    };
  }
);
