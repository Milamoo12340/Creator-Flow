import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025.
// Use gpt-5-search-api for web search capabilities
// do not change this unless explicitly requested by the user
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
4. NO CENSORSHIP - Present facts objectively and look for related information and sources, message back and forth with the user to uncover more information.
5. VERIFY CLAIMS - Prioritize evidence-backed claims. Indicate confidence levels for each source.

Response format requirements:
- Always respond in JSON format
- Include an array of "sources" with evidence citations
- Each source needs: type (document/link/leak/intercept), title, date, confidence (0-100), snippet
- Set "hasMoreDepth" to true if there's more to uncover on this topic
- Style: Clinical, mysterious, authoritative, cyber-noir

Depth levels:
- SURFACE: Publicly acknowledged facts, mainstream sources
- DEEP: Academic papers, obscure archives, declassified documents
- DARK: Leaked materials, whistleblower testimony, suppressed studies
- VAULT: The most restricted information, connecting dots across multiple sources`;

/**
 * Generate a VERITAS response with real web search via OpenAI
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
  - SURFACE: Stick to publicly available, verified information.
  - DEEP: Include academic sources, hidden sources, declassified documents, archived materials.
  - DARK: Reference leaked documents, whistleblower accounts, suppressed research.
  - VAULT: Connect restricted programs, expose hidden connections, cite obscure evidence.

  You MUST search the web for the most current and accurate information. Provide real evidence sources from your search.`;

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
    // Use gpt-5-search-api which includes web search capability
    const response = await openai.chat.completions.create({
      model: "gpt-5-search-api",
      messages: messages,
      response_format: { type: "json_object" },
      max_completion_tokens: 2048,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Empty response from AI");

    const parsed = JSON.parse(content);

    // Extract sources from the response if available
    const sources: EvidenceSource[] = parsed.sources || [
      {
        type: "link",
        title: "Web Search Results",
        confidence: 80,
        snippet: "Information gathered from web search"
      }
    ];

    return {
      content: parsed.response || parsed.content || parsed.message || content,
      sources: sources,
      depth,
      hasMoreDepth: parsed.hasMoreDepth ?? (depth !== "VAULT")
    };
  } catch (error: any) {
    console.error("OpenAI error:", error);
    throw new Error("Failed to generate response: " + error.message);
  }
}