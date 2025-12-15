import OpenAI from "openai";
import fetch from "node-fetch";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025.
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
 * Search the web and archives with query expansion
 */
export async function searchWeb(query: string): Promise<{ title: string; snippet: string; url: string }[]> {
  const key = process.env.AZURE_BING_KEY;
  const endpoint = process.env.AZURE_BING_ENDPOINT; // e.g. https://api.bing.microsoft.com/v7.0/search
  if (!key || !endpoint) return [];

  // Expand query to target archives, gov sites, PDFs, declassified material
  const expansions = [
    query,
    `${query} site:archives.gov`,
    `${query} site:cia.gov`,
    `${query} site:fbi.gov vault`,
    `${query} site:archive.org`,
    `${query} declassified filetype:pdf`,
    `${query} academic paper`,
    `${query} site:data.gov`
  ];

  const results: { title: string; snippet: string; url: string }[] = [];

  for (const q of expansions) {
    const params = new URLSearchParams({ q, count: "5" });
    try {
      const res = await fetch(`${endpoint}?${params.toString()}`, {
        headers: { "Ocp-Apim-Subscription-Key": key }
      });
      if (!res.ok) continue;
      const json = await res.json();
      const webPages = json.webPages?.value || [];
      for (const p of webPages) {
        results.push({
          title: p.name,
          snippet: p.snippet,
          url: p.url
        });
      }
    } catch {
      continue;
    }
  }

  // Deduplicate by URL
  const seen = new Set<string>();
  return results.filter(r => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });
}

/**
 * Generate a VERITAS response with evidence from searchWeb
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
  - VAULT: Connect restricted programs, expose hidden connections, cite obscure evidence.`;

  // Run search for evidence
  const hits = await searchWeb(userMessage);

  // Build evidence array
  const evidence: EvidenceSource[] = hits.slice(0, 8).map(h => ({
    type: h.url.includes("archive") || h.url.includes("gov") ? "document" : "link",
    title: h.title,
    date: undefined,
    confidence: h.url.includes("gov") ? 85 : 70,
    snippet: h.snippet
  }));

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt + "\n\n" + depthInstruction },
    ...conversationHistory,
    { role: "user", content: userMessage },
    { role: "assistant", content: `EVIDENCE:${JSON.stringify(evidence)}` }
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: messages.map(m => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content
      })),
      response_format: { type: "json_object" },
      max_completion_tokens: 2048,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Empty response from AI");

    const parsed = JSON.parse(content);

    return {
      content: parsed.response || parsed.content || parsed.message || content,
      sources: parsed.sources || evidence,
      depth,
      hasMoreDepth: parsed.hasMoreDepth ?? (depth !== "VAULT")
    };
  } catch (error: any) {
    console.error("OpenAI error:", error);
    throw new Error("Failed to generate response: " + error.message);
  }
}