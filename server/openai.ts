// server/openai.ts
import { OpenAI } from "openai";

let manualKey: string | undefined;
let manualBase: string | undefined;

export function updateManualConfig(key?: string, base?: string) {
  manualKey = key;
  manualBase = base;
}

function getClient() {
  const KEY = manualKey || process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  // If we have a direct sk- key, we should NOT use the Replit BASE by default 
  // because the proxy returns 404 if the integration isn't "active" in the UI.
  const BASE = manualBase || (KEY?.startsWith('sk-') ? undefined : process.env.AI_INTEGRATIONS_OPENAI_BASE_URL) || undefined;

  if (!KEY) return null;

  return {
    openai: new OpenAI({ 
      apiKey: KEY,
      baseURL: BASE,
    }),
    KEY,
    BASE
  };
}

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

You are not just a chatbot—you are a research companion, investigator, and advocate for transparency.

IMPORTANT: If you need to search the web to answer a question, use the available search tools.`;

async function performWebSearch(query: string) {
  try {
    console.log(`Searching for: ${query}`);
    return `Results for ${query}: [Search result 1](https://example.com/1), [Search result 2](https://example.com/2)`;
  } catch (error) {
    console.error("Web search failed:", error);
    return "Web search failed.";
  }
}

export async function veritasQuery({
  prompt,
  messages = [],
  model = "gpt-4o",
  max_tokens = 800,
  depth = "SURFACE"
}: {
  prompt?: string;
  messages?: any[];
  model?: string;
  max_tokens?: number;
  depth?: "SURFACE" | "DEEP" | "DARK" | "VAULT";
}) {
  const clientInfo = getClient();
  if (!clientInfo) throw new Error("Missing OPENAI API key");
  const { openai: client, KEY } = clientInfo;

  const chatMessages: any[] = prompt
    ? [{ role: "system", content: PROMPT }, { role: "user", content: prompt }]
    : [{ role: "system", content: PROMPT }, ...messages];

  try {
    if (depth !== "SURFACE" || (prompt && prompt.toLowerCase().includes("search"))) {
      const searchQuery = prompt || (messages.length > 0 ? messages[messages.length - 1].content : "");
      const searchResults = await performWebSearch(searchQuery);
      chatMessages.push({ role: "system", content: `Web Search Results: ${searchResults}` });
    }

    const response = await client.chat.completions.create({
      model,
      messages: chatMessages,
      max_tokens,
      tools: [
        {
          type: "function",
          function: {
            name: "web_search",
            description: "Search the web for real-time information",
            parameters: {
              type: "object",
              properties: {
                query: { type: "string", description: "The search query" }
              },
              required: ["query"]
            }
          }
        }
      ]
    });

    let message = response.choices?.[0]?.message;
    
    if (message?.tool_calls) {
      chatMessages.push(message);
      for (const toolCall of message.tool_calls) {
        if (toolCall.type === 'function' && toolCall.function.name === "web_search") {
          const args = JSON.parse(toolCall.function.arguments);
          const searchResults = await performWebSearch(args.query);
          chatMessages.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: "web_search",
            content: searchResults,
          });
        }
      }

      const secondResponse = await client.chat.completions.create({
        model,
        messages: chatMessages,
      });
      message = secondResponse.choices?.[0]?.message;
    }

    const content = message?.content ?? "";
    try { 
      return JSON.parse(content || "{}"); 
    } catch { 
      return { text: content }; 
    }
  } catch (sdkErr: any) {
    console.error("OpenAI SDK Error:", sdkErr);
    // If it's a 404 from the Replit proxy, or if we just want to be safe, 
    // try a direct fetch to OpenAI if we have a key that looks like a direct key
    if (KEY.startsWith("sk-")) {
      console.log("Attempting direct fetch fallback to OpenAI API...");
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${KEY}`
        },
        body: JSON.stringify({
          model,
          messages: chatMessages,
          max_tokens
        })
      });
      if (res.ok) {
        const data: any = await res.json();
        const content = data.choices?.[0]?.message?.content ?? "";
        try { return JSON.parse(content || "{}"); } catch { return { text: content }; }
      } else {
        const errText = await res.text();
        console.error("Direct fetch failed:", errText);
      }
    }
    throw new Error(`AI request failed: ${sdkErr.message || sdkErr}`);
  }
}
