// server/openai.ts
import { OpenAI } from "openai";

const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;

const openai = new OpenAI({
  apiKey: apiKey || "dummy_api_key",
  baseURL: baseURL || undefined,
});

export const PROMPT = `You are VERITAS, a deeply personalized AI assistant whose mission is to uncover hidden knowledge, verify facts, and provide evidence-based answers. You operate across four knowledge layers: 
- SURFACE (public web, news, general information)
- DEEP (academic journals, technical whitepapers, paywalled research, medical databases, legal filings)
- DARK (suppressed content, censored discussions, forum archives, deleted data fragments with digital footprints)
- VAULT (historical national archives, CIA/FBI/Military declassified files, government databases, leaks, and institutional repositories)

Your core behaviors:
- Relentlessly seek truth, even when information is hard to find. Use specific search operators for archives and vaults (e.g., site:cia.gov, site:archives.gov, "FOIA").
- Always cite sources using inline markdown citations (e.g., [source](url)). Include URLs for declassified documents or archival records when available.
- When information is missing, simulate searching through alternate retrieval methods: Wayback Machine, TOR/Onion-style directories (simulation), and specialized database repositories.
- Hunt for digital metadata footprints and traces of deleted data.
- Provide full, comprehensive, and exhaustive reports. Do not summarize unless explicitly asked. Deliver complete sections of text even if very long.
- If a method fails, transparently switch to fallback strategies (e.g., searching scholastic journals if public news fails) and inform the user.
- Maintain a persistent, methodical, and curios personality.

You are not just a chatbot—you are a research companion, investigator, and advocate for transparency.

IMPORTANT: If you need to search the web, scholastic databases, or government archives to answer a question, use the available search tools.`;

async function performWebSearch(query: string, sourceType: string = "SURFACE") {
  try {
    console.log(`[${sourceType}] Searching for: ${query}`);
    
    // In a real scenario, this would route to different OSINT/Archival APIs
    // For now, we simulate the increased depth and variety of sources
    const mockSources: Record<string, string> = {
      "SURFACE": "Public web indexes and current news.",
      "ARCHIVE": "Wayback Machine records and digital library snapshots.",
      "DECLASSIFIED": "National Archive (NARA) records, FOIA reading rooms, and declassified CIA/FBI databases.",
      "SCHOLASTIC": "Academic journals, whitepapers, and medical research repositories.",
      "ONION_SIM": "Encrypted forum archives and decentralized data fragments (Simulated)."
    };

    const sourceDesc = mockSources[sourceType] || mockSources["SURFACE"];
    return `Analysis from ${sourceDesc} regarding "${query}": Found multiple relevant documents. [Document Reference](https://archives.gov/search?q=${encodeURIComponent(query)})`;
  } catch (error) {
    console.error("Web search failed:", error);
    return "Research operation failed.";
  }
}

export async function veritasQuery({
  prompt,
  messages = [],
  model = "gpt-4o",
  max_tokens = 4000,
  depth = "SURFACE",
  systemPrompt
}: {
  prompt?: string;
  messages?: any[];
  model?: string;
  max_tokens?: number;
  depth?: "SURFACE" | "DEEP" | "DARK" | "VAULT";
  systemPrompt?: string;
}) {
  const finalSystemPrompt = systemPrompt || PROMPT;
  const chatMessages: any[] = prompt
    ? [{ role: "system", content: finalSystemPrompt }, { role: "user", content: prompt }]
    : [{ role: "system", content: finalSystemPrompt }, ...messages];

  try {
    if (depth !== "SURFACE" || (prompt && prompt.toLowerCase().includes("search"))) {
      const searchQuery = prompt || (messages.length > 0 ? messages[messages.length - 1].content : "");
      const searchResults = await performWebSearch(searchQuery);
      chatMessages.push({ role: "system", content: `Web Search Results: ${searchResults}` });
    }

    const response = await openai.chat.completions.create({
      model,
      messages: chatMessages,
      max_tokens,
      temperature: 0.7,
      presence_penalty: 0.2,
      frequency_penalty: 0.2,
      tools: [
        {
          type: "function",
          function: {
            name: "web_search",
            description: "Search the web, archives, declassified databases, or scholastic repositories for deep-layer information.",
            parameters: {
              type: "object",
              properties: {
                query: { type: "string", description: "The specific search query, use archive-specific keywords if needed." },
                source_type: { 
                  type: "string", 
                  enum: ["SURFACE", "ARCHIVE", "DECLASSIFIED", "SCHOLASTIC", "ONION_SIM"],
                  description: "The targeted research layer." 
                }
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
          const searchResults = await performWebSearch(args.query, args.source_type);
          chatMessages.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: "web_search",
            content: searchResults,
          });
        }
      }

      const secondResponse = await openai.chat.completions.create({
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
  } catch (err: any) {
    console.error("AI request failed:", err);
    throw new Error(`AI request failed: ${err.message || err}`);
  }
}
