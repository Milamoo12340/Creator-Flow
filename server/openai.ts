// openai.ts
// Core AI pipeline for VERITAS: resilient, multi-provider, structured outputs

import OpenAI from 'openai';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { HfInference } from '@huggingface/inference';
import { CircuitBreaker } from './utils/circuitBreaker';
import { log, withCorrelationId } from './utils/logging';
import { Result, AIError, AIErrorType } from './utils/resultTypes';
import { StructuredOutputSchema } from './schemas/structuredOutput';

// Provider adapters
import { callOpenAI, callHuggingFace, callOllama } from './providers';

// Config
const CONFIG = {
  models: ['gpt-5', 'gpt-4o', 'llama-3-70b', 'qwen-32b'],
  retry: { maxAttempts: 3, baseDelayMs: 1000, maxDelayMs: 10000 },
  timeoutMs: 30000,
  circuitBreaker: { failureThreshold: 5, resetTimeMs: 60000 },
  cost: { maxTokensPerCall: 2000 },
};

// Main AI pipeline
export async function veritasAIRequest(
  messages: Array<{ role: string; content: string }>,
  options: { structuredOutput?: z.ZodSchema<any>; depth?: 'SURFACE' | 'DEEP' | 'DARK' | 'VAULT' } = {}
): Promise<Result<any>> {
  const correlationId = randomUUID();
  const circuit = new CircuitBreaker(CONFIG.circuitBreaker);
  let lastError: AIError | null = null;

  for (const model of CONFIG.models) {
    if (!circuit.canRequest()) {
      log('Circuit breaker open', { model, correlationId });
      return { success: false, error: { type: AIErrorType.CIRCUIT_OPEN, message: 'Circuit breaker open', retryable: false }, meta: { correlationId, model, attempts: 0, totalLatencyMs: 0 } };
    }

    for (let attempt = 1; attempt <= CONFIG.retry.maxAttempts; attempt++) {
      const start = Date.now();
      try {
        let response;
        if (model.startsWith('gpt-')) {
          response = await callOpenAI(model, messages, options, CONFIG.timeoutMs);
        } else if (model.startsWith('llama-') || model.startsWith('qwen-')) {
          response = await callHuggingFace(model, messages, options, CONFIG.timeoutMs);
        } else if (model.startsWith('ollama-')) {
          response = await callOllama(model, messages, options, CONFIG.timeoutMs);
        } else {
          continue;
        }

        // Structured output validation
        if (options.structuredOutput) {
          const parsed = options.structuredOutput.safeParse(response);
          if (!parsed.success) {
            lastError = { type: AIErrorType.VALIDATION, message: 'Output validation failed', retryable: true };
            circuit.recordFailure();
            continue;
          }
          circuit.recordSuccess();
          return { success: true, data: parsed.data, meta: { correlationId, model, attempts: attempt, totalLatencyMs: Date.now() - start } };
        }

        circuit.recordSuccess();
        return { success: true, data: response, meta: { correlationId, model, attempts: attempt, totalLatencyMs: Date.now() - start } };
      } catch (err: any) {
        lastError = { type: AIErrorType.UNKNOWN, message: err.message, retryable: true };
        circuit.recordFailure();
        log('AI call failed', { model, attempt, error: err, correlationId });
        await new Promise(res => setTimeout(res, Math.min(CONFIG.retry.baseDelayMs * 2 ** (attempt - 1), CONFIG.retry.maxDelayMs)));
      }
    }
  }

  return { success: false, error: lastError || { type: AIErrorType.UNKNOWN, message: 'All providers failed', retryable: false }, meta: { correlationId, model: '', attempts: CONFIG.retry.maxAttempts, totalLatencyMs: 0 } };
}
