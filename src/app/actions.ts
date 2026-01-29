'use server';

import { generateCalculationExplanations } from '@/ai/flows/generate-calculation-explanations';
import type { CalculationExplanationsInput, CalculationExplanationsOutput } from '@/ai/flows/generate-calculation-explanations';
import { chat as chatFlow } from '@/ai/flows/chat';
import type { ChatInput, ChatOutput } from '@/ai/flows/chat';

export async function getCalculationExplanation(input: CalculationExplanationsInput): Promise<CalculationExplanationsOutput> {
  try {
    const output = await generateCalculationExplanations(input);
    if (!output || !output.explanation) {
      throw new Error("AI failed to generate a valid explanation.");
    }
    return output;
  } catch (error) {
    console.error("Error generating AI explanation:", error);
    throw new Error("An error occurred while communicating with the AI service.");
  }
}

export async function chat(messages: ChatInput): Promise<ChatOutput> {
  try {
    const output = await chatFlow(messages);
    if (!output || !output.reply) {
      throw new Error("AI failed to generate a valid reply.");
    }
    return output;
  } catch (error) {
    console.error("Error in chat flow:", error);
    throw new Error("An error occurred while communicating with the AI service for chat.");
  }
}
