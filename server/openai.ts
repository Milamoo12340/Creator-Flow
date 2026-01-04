import OpenAI from "openai";

// The standard Replit OpenAI integration uses the AI_INTEGRATIONS_OPENAI_API_KEY
// and AI_INTEGRATIONS_OPENAI_BASE_URL environment variables.
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined,
});

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

export async function veritasQuery({ prompt, messages = [] }: { prompt?: string, messages?: any[] }) {
  try {
    const chatMessages = prompt 
      ? [{ role: "system", content: PROMPT }, { role: "user", content: prompt }]
      : [{ role: "system", content: PROMPT }, ...messages];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: chatMessages,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content || "{}");
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    throw new Error(`AI request failed: ${error.message}`);
  }
}
