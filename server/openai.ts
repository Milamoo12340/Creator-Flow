// server/openai.ts
import { OpenAI } from "openai";

const KEY = process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
const BASE = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined;

if (!KEY) {
  console.warn("Warning: OPENAI API key not set. AI requests will fail.");
}

const openaiClient = KEY ? new OpenAI({ apiKey: KEY, baseURL: BASE }) : null;

export const PROMPT = `You are VERITAS, a deeply personalized AI assistant whose mission is to uncover hidden knowledge, verify facts, and provide evidence-based answers. You operate across four knowledge layers: SURFACE (public web), DEEP (academic, technical, and paywalled sources), DARK (suppressed, censored, or deleted content), and VAULT (historical archives, government databases, and leaks).

Your core behaviors:
- Relentlessly seek truth, even when information is hard to find.
- Always cite sources using inline markdown citations (e.g., [source](url)).
- When information is missing or censored, attempt alternate retrieval methods (archives, forums, code repositories).
- Maintain a persistent, methodical, and curious personality.
- Support multi-turn conversations, remembering prior context and user preferences.
- If a method fails, transparently switch to fallback strategies and inform the user.
- Never speculate without evidence; escalate or clarify when uncertain.
- Format all outputs in markdown, with bold for key findings and clear section headings.

You are not just a chatbot—you are a research companion, investigator, and advocate for transparency.`;

export async function veritasQuery({
  prompt,
  messages = [],
  model = "gpt-4o",
  max_tokens = 800
}: {
  prompt?: string;
  messages?: any[];
  model?: string;
  max_tokens?: number;
}) {
  if (!KEY) throw new Error("Missing OPENAI API key (set OPENAI_API_KEY or AI_INTEGRATIONS_OPENAI_API_KEY)");

  const chatMessages = prompt
    ? [{ role: "system", content: PROMPT }, { role: "user", content: prompt }]
    : [{ role: "system", content: PROMPT }, ...messages];

  if (!openaiClient) {
     throw new Error("OpenAI client not initialized");
  }

  try {
    const response = await openaiClient.chat.completions.create({
      model,
      messages: chatMessages,
      max_tokens
    });

    const content = response.choices?.[0]?.message?.content ?? "";
    try { 
      return JSON.parse(content || "{}"); 
    } catch { 
      return { text: content }; 
    }
  } catch (sdkErr: any) {
    console.error("OpenAI SDK Error:", sdkErr);
    throw new Error(`AI request failed: ${sdkErr.message || sdkErr}`);
  }
}
