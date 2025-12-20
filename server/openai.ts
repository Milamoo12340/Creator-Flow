import OpenAI from "openai";

// Using Chat Completions API with gpt-5-search-api which has built-in web search
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

Response format requirements:
- Respond naturally with clear citations to sources you found
- Include actual URLs and titles from your web search
- Always cite where information comes from
- Set tone: Clinical, mysterious, authoritative, cyber-noir

Depth levels guide:
- SURFACE: Publicly acknowledged facts, mainstream sources
- DEEP: Academic papers, obscure archives, declassified documents
- DARK: Leaked materials, whistleblower testimony, suppressed studies
- VAULT: The most restricted information, connecting dots across multiple sources`;

/**
 * Generate a VERITAS response with real web search via Chat Completions
 */
export async function generateVeritasResponse(
  userMessage: string,
  depth: string,
  conversationHistory: ChatMessage[] = [],
  customSystemPrompt?: string
): Promise<VeritasResponse> {
  const systemPrompt = customSystemPrompt || VERITAS_SYSTEM_PROMPT;

  const depthInstruction = `
Current search depth: ${depth}. Adjust your response accordingly:
- SURFACE: Stick to publicly available, verified information from mainstream sources.
- DEEP: Include academic sources, obscure archives, declassified documents, and archived materials.
- DARK: Reference leaked documents, whistleblower accounts, suppressed research, and controversial findings.
- VAULT: Connect restricted programs, expose hidden connections, cite the most obscure evidence.

You MUST search the web to find real, current information about what the user is asking. Cite all sources with URLs.`;

  const fullSystemPrompt = systemPrompt + "\n\n" + depthInstruction;

  const messages: any[] = [
    { role: "system", content: fullSystemPrompt },
    ...conversationHistory.map(m => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content
    })),
    { role: "user", content: userMessage }
  ];

  try {
    // Use gpt-5-search-api for web search capabilities
    const response = await openai.chat.completions.create({
      model: "gpt-5-search-api",
      messages: messages,
      temperature: 0.7,
      max_tokens: 2048,
    });

    const responseText = response.choices[0].message.content || "";
    
    // Extract URLs from the response text (basic extraction)
    const sources: EvidenceSource[] = extractSourcesFromResponse(responseText);

    return {
      content: responseText,
      sources: sources,
      depth,
      hasMoreDepth: depth !== "VAULT",
    };
  } catch (error: any) {
    console.error("OpenAI Chat Completions error:", error);
    throw new Error("Failed to generate response: " + error.message);
  }
}

/**
 * Extract sources from the response text
 */
function extractSourcesFromResponse(responseText: string): EvidenceSource[] {
  const sources: EvidenceSource[] = [];
  
  // Match URLs in the format [text](url) or plain https://...
  const urlRegex = /\[([^\]]+)\]\(([^)]+)\)|(?:https?:\/\/[^\s]+)/g;
  let match;
  
  while ((match = urlRegex.exec(responseText)) !== null) {
    let title = "";
    let url = "";
    
    if (match[2]) {
      // Markdown link format
      title = match[1];
      url = match[2];
    } else {
      // Plain URL
      url = match[0];
      title = url.replace(/^https?:\/\//, "").split("/")[0];
    }
    
    if (url && url.startsWith("http")) {
      sources.push({
        type: "link",
        title: title || "Source",
        url: url,
        confidence: 85,
      });
    }
  }
  
  // Deduplicate
  const uniqueSources = Array.from(
    new Map(sources.map(s => [s.url, s])).values()
  ).slice(0, 10);

  return uniqueSources;
}
