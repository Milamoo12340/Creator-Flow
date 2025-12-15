// client/src/lib/mockdata.ts
import { EvidenceSource } from "@/components/EvidenceCard";

export interface TerminalResponse {
  text: string;
  sources?: EvidenceSource[];
  depth_level: "SURFACE" | "DEEP" | "DARK" | "VAULT";
  related_topic_id?: string;
  next_depth?: "DEEP" | "DARK" | "VAULT";
}

/**
 * Fetch a real response from the backend instead of mock data.
 */
export async function fetchTerminalResponse(
  message: string,
  depth: "SURFACE" | "DEEP" | "DARK" | "VAULT" = "SURFACE"
): Promise<TerminalResponse> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, depth }),
  });

  if (!res.ok) {
    throw new Error(`Chat API error: ${res.status}`);
  }

  const data = await res.json();
  // The backend returns { message: { content, sources, depth }, ... }
  return {
    text: data.message.content,
    sources: data.message.sources,
    depth_level: data.message.depth,
    next_depth: data.hasMoreDepth ? "DEEP" : undefined,
  };
}
