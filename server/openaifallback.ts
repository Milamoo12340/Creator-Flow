// openai.ts
// VERITAS Intelligence Engine: Modular, Resilient, Multi-Provider LLM Orchestrator

import { createFallback } from "ai-fallback";
import { openai } from "@ai-sdk/openai";
import { huggingface } from "@ai-sdk/huggingface";
import { ollama } from "@ai-sdk/ollama";
import { githubSearch } from "./github";
import { waybackSearch } from "./wayback";
import { extractCitations, deduplicateCitations } from "./citations";
import { manageMemory } from "./memory";
import { logTrace, logError, logMetrics } from "./observability";

// System prompt for VERITAS
const VERITAS_SYSTEM_PROMPT = `
You are VERITAS, a deeply personalized AI assistant whose mission is to uncover hidden knowledge, verify facts, and provide evidence-based answers. You operate across SURFACE, DEEP, DARK, and VAULT knowledge layers. Always cite sources, escalate when information is missing, and maintain a persistent, methodical, and curious personality. Format outputs in markdown with bold for key findings and clear section headings.
`;

const fallbackModel = createFallback({
  models: [
    openai("gpt-5"),
    huggingface("llama-3-70b"),
    ollama("mistral"),
    // Add more as needed
  ],
  onError: (error, modelId) => {
    logError(`Model ${modelId} failed: ${error.message}`);
  },
  modelResetInterval: 5 * 60 * 1000,
});

export async function veritasQuery({
  prompt,
  context,
  memoryId,
  tools = ["web_search", "github_search", "wayback_search"],
  userId,
}: {
  prompt: string;
  context?: any;
  memoryId?: string;
  tools?: string[];
  userId?: string;
}) {
  try {
    logTrace({ event: "query_start", userId, prompt, tools });
    // Retrieve memory/context
    const memory = await manageMemory({ userId, memoryId });
    // Prepare input with system prompt and context
    const input = `${VERITAS_SYSTEM_PROMPT}\n\n${memory}\n\nUser: ${prompt}`;
    // Tool orchestration
    let toolResults: any = {};
    if (tools.includes("web_search")) {
      toolResults.web = await openai.responses.create({
        model: "gpt-5",
        tools: [{ type: "web_search" }],
        input: prompt,
      });
    }
    if (tools.includes("github_search")) {
      toolResults.github = await githubSearch(prompt);
    }
    if (tools.includes("wayback_search")) {
      toolResults.wayback = await waybackSearch(prompt);
    }
    // Aggregate context from tools
    const toolContext = Object.values(toolResults)
      .map((r: any) => r?.output_text || "")
      .join("\n\n");
    // Main LLM call with fallback
    const { text, citations } = await fallbackModel.generate({
      prompt: `${input}\n\nContext:\n${toolContext}`,
      system: VERITAS_SYSTEM_PROMPT,
      stream: true,
    });
    // Citation extraction and deduplication
    const extracted = extractCitations(text);
    const deduped = deduplicateCitations(extracted);
    logMetrics({ userId, tokens: text.length, citations: deduped.length });
    logTrace({ event: "query_complete", userId, text, citations: deduped });
    return { text, citations: deduped, toolResults };
  } catch (error) {
    logError(`veritasQuery failed: ${error.message}`);
    throw error;
  }
}
