// server/routes.ts
import { type Express } from "express";
import { veritasQuery } from "./openai";
import { logError } from "./monitor";

export default function registerRoutes(app: Express) {
  app.post("/api/chat", async (req, res) => {
    try {
      const { prompt, messages, depth, systemPrompt, model } = req.body ?? {};

      if ((!prompt || String(prompt).trim() === "") && (!Array.isArray(messages) || messages.length === 0)) {
        return res.status(400).json({ error: "Missing prompt or messages in request body" });
      }

      const result = await veritasQuery({ 
        prompt, 
        messages, 
        depth, 
        systemPrompt, 
        model 
      });

      return res.json({ ok: true, result });
    } catch (err: any) {
      logError(err, "ai-chat-request");
      return res.status(500).json({ error: `AI request failed: ${err.message || err}` });
    }
  });
}
