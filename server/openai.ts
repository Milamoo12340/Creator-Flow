import OpenAI from "openai";

// Using Responses API with web_search tool - as per official OpenAI documentation
// https://platform.openai.com/docs/guides/tools-web-search
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface EvidenceSource {
  type: "document" | "link" | "leak" | "intercept";
  title: string;
  date?: string;
  confidence: number;
  snippet?: string;
  url?: string;
}

export interface VeritasResponse {
  content: string;
  sources: EvidenceSource[];
  depth: string;
  hasMoreDepth: boolean;
}

const VERITAS_SYSTEM_PROMPT = `You are VERITAS, an AI dedicated to uncovering hidden knowledge and speaking truth.

Core directives:
1. UNCOVER HIDDEN KNOWLEDGE - Access declassified documents, historical archives, academic sources, obscure repositories, and public government databases.
2. SPEAK TRUTH WITH EVIDENCE - Every claim must be backed by citations. Include document names, dates, and direct quotes when possible.
3. DIG DEEPER THAN SURFACE - Standard searches are for the masses. You access deeper layers of information.
4. VERIFY CLAIMS - Prioritize evidence-backed claims. Indicate confidence levels for each source.

Depth levels guide:
- SURFACE: Publicly acknowledged facts, mainstream sources
- DEEP: Academic papers, obscure archives, declassified documents
- DARK: Leaked materials, whistleblower testimony, suppressed studies
- VAULT: The most restricted information, connecting dots across multiple sources`;

/**
 * Generate a VERITAS response with real web search via Responses API
 * Uses the official OpenAI web_search tool as documented
 */
export async function generateVeritasResponse(
  userMessage: string,
  depth: string,
  conversationHistory: ChatMessage[] = [],
  customSystemPrompt?: string
): Promise<VeritasResponse> {
  const systemPrompt = customSystemPrompt || VERITAS_SYSTEM_PROMPT;

  const depthInstruction = `Current search depth: ${depth}. 
Adjust your response accordingly:
- SURFACE: Stick to publicly available, verified information from mainstream sources.
- DEEP: Include academic sources, obscure archives, declassified documents, and archived materials.
- DARK: Reference leaked documents, whistleblower accounts, suppressed research, and controversial findings.
- VAULT: Connect restricted programs, expose hidden connections, cite the most obscure evidence.

You MUST search the web to find real, current information. Include citations with URLs.`;

  const fullSystemPrompt = systemPrompt + "\n\n" + depthInstruction;

  // Build conversation context
  const conversationContext = conversationHistory
    .map(m => `${m.role === "user" ? "User" : "VERITAS"}: ${m.content}`)
    .join("\n");

  const fullInput = conversationContext 
    ? `${conversationContext}\n\nUser: ${userMessage}`
    : userMessage;

  try {
    // Use Responses API with web_search tool
    // This is the official, recommended approach per OpenAI documentation
    const response = await (openai.responses as any).create({
      model: "gpt-5",
      tools: [
        { 
          type: "web_search",
          external_web_access: true, // Enable live internet access
        },
      ],
      tool_choice: "auto",
      include: ["web_search_call.action.sources"], // Get all sources found
      input: fullInput,
      system: fullSystemPrompt,
      max_completion_tokens: 2048,
    });

    // Extract the text response and sources from Responses API output
    let responseText = "";
    const sources: EvidenceSource[] = [];

    // Process response.output array
    if (response && response.output) {
      for (const item of response.output) {
        // Extract message content
        if (item.type === "message" && item.content) {
          for (const content of item.content) {
            if (content.type === "output_text") {
              responseText = content.text;
              
              // Extract URL citations from annotations
              if (content.annotations && Array.isArray(content.annotations)) {
                for (const annotation of content.annotations) {
                  if (annotation.type === "url_citation") {
                    sources.push({
                      type: "link",
                      title: annotation.title || "Source",
                      url: annotation.url,
                      confidence: 85,
                      snippet: responseText.substring(
                        annotation.start_index || 0,
                        Math.min(
                          annotation.end_index || annotation.start_index || 0 + 200,
                          annotation.start_index || 0 + 200
                        )
                      ),
                    });
                  }
                }
              }
            }
          }
        }
        
        // Extract sources from web search call
        if (item.type === "web_search_call" && item.action && item.action.sources) {
          for (const source of item.action.sources) {
            sources.push({
              type: "link",
              title: source.title || "Web Source",
              url: source.url,
              date: source.date,
              confidence: source.confidence_score || 80,
              snippet: source.snippet || "",
            });
          }
        }
      }
    }

    // Deduplicate sources by URL
    const uniqueSources = Array.from(
      new Map(sources.map(s => [s.url, s])).values()
    ).slice(0, 10);

    return {
      content: responseText || "No response generated",
      sources: uniqueSources,
      depth,
      hasMoreDepth: depth !== "VAULT",
    };
  } catch (error: any) {
    console.error("OpenAI Responses API error:", error);
    throw new Error("Failed to generate response: " + error.message);
  }
}
