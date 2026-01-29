'use server';

/**
 * @fileOverview Generates simple explanations of bridge design calculations.
 *
 * - generateCalculationExplanations - A function that generates explanations for bridge design calculations.
 * - CalculationExplanationsInput - The input type for the generateCalculationExplanations function.
 * - CalculationExplanationsOutput - The return type for the generateCalculationExplanations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculationExplanationsInputSchema = z.object({
  calculationType: z.string().describe('The type of calculation to explain (e.g., Dead Load, Live Load, Impact Factor).'),
  formula: z.string().describe('The formula used in the calculation.'),
  values: z.string().describe('The values used in the calculation.'),
  result: z.string().describe('The result of the calculation.'),
  context: z.string().describe('Additional context for the calculation.'),
});
export type CalculationExplanationsInput = z.infer<typeof CalculationExplanationsInputSchema>;

const CalculationExplanationsOutputSchema = z.object({
  explanation: z.string().describe('A simplified explanation of the calculation and its relevance to bridge design.'),
});
export type CalculationExplanationsOutput = z.infer<typeof CalculationExplanationsOutputSchema>;

export async function generateCalculationExplanations(input: CalculationExplanationsInput): Promise<CalculationExplanationsOutput> {
  return generateCalculationExplanationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculationExplanationsPrompt',
  input: {schema: CalculationExplanationsInputSchema},
  output: {schema: CalculationExplanationsOutputSchema},
  prompt: `You are an expert civil engineer specializing in bridge design and education. Your task is to provide simple, easy-to-understand explanations of bridge design calculations for student engineers.

  Given the following calculation details, generate a concise explanation of the calculation, its purpose, and its significance in bridge design. Use clear and straightforward language, avoiding overly technical terms.

  Calculation Type: {{{calculationType}}}
  Formula: {{{formula}}}
  Values: {{{values}}}
  Result: {{{result}}}
  Context: {{{context}}}

  Explanation:`,
});

const generateCalculationExplanationsFlow = ai.defineFlow(
  {
    name: 'generateCalculationExplanationsFlow',
    inputSchema: CalculationExplanationsInputSchema,
    outputSchema: CalculationExplanationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
