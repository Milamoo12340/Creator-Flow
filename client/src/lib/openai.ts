// client/src/lib/openai.ts
// Browser shim: call your server /api/chat endpoint instead of importing server SDK.

export async function generateVeritasResponse(prompt: string, depth: string) {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Server error ${res.status}: ${text}`);
    }

    const payload = await res.json();
    // Normalize common server shapes: { ok: true, result: {...} } or { result } or raw text
    const result = payload.result ?? payload.ai ?? payload;

    if (typeof result === "string") {
      return { text: result, depth_level: depth, sources: [] };
    }

    // If server returns a TerminalResponse-like object, return it directly
    return result;
  } catch (err) {
    console.error("generateVeritasResponse error:", err);
    return { text: `Fallback response for depth ${depth}`, depth_level: depth, sources: [] };
  }
}
