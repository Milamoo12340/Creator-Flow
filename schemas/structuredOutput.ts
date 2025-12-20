// schemas/structuredOutput.ts
import { z } from 'zod';

export const StructuredOutputSchema = z.object({
  content: z.string(),
  citations: z.array(z.string()).optional(),
});
export type StructuredOutput = z.infer<typeof StructuredOutputSchema>;
export const EvidenceSourceSchema = z.object{  type: z.enum(['ai', 'human', 'document', 'database', 'api']),  title: z.string(),  date: z.string().optional(),  confidence: z.number().min(0).max(100),  snippet: z.string().optional(),  url: z.string().url().optional(),};
