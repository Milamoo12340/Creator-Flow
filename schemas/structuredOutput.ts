// schemas/structuredOutput.ts
import { z } from 'zod';

export const StructuredOutputSchema = z.object({
  content: z.string(),
  citations: z.array(z.string()).optional(),
});
