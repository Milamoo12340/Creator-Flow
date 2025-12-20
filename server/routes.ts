// routes.ts
// Next.js API routes for VERITAS assistant

import { NextRequest, NextResponse } from 'next/server';
import { veritasAIRequest } from './openai';
import { StructuredOutputSchema } from './schemas/structuredOutput';
import { getSession, saveSession } from './memory/sessionManager';

export async function POST(req: NextRequest) {
  const { sessionId, messages, depth } = await req.json();
  const session = await getSession(sessionId);

  // Append user message to session
  session.messages.push(...messages);

  // Call VERITAS AI pipeline
  const result = await veritasAIRequest(session.messages, {
    structuredOutput: StructuredOutputSchema,
    depth,
  });

  if (result.success) {
    // Append assistant message to session
    session.messages.push({ role: 'assistant', content: result.data.content });
    await saveSession(sessionId, session);
    return NextResponse.json({ output: result.data, citations: result.data.citations, meta: result.meta });
  } else {
    return NextResponse.json({ error: result.error, meta: result.meta }, { status: 500 });
  }
}
