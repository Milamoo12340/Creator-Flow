import { Express } from "express";
import { veritasQuery } from "./openai";
import  "server/storage.ts";
// server/routes.ts (or wherever you handle /api/chat)

import express from "express";
import chatRouter from "./routes";

const app = express();
app.use(express.json());
app.use(chatRouter);

const router = express.Router();

/** * Simple POST /api/chat that accepts either: * - { prompt: "..." } OR * - { messages: [...] } (chat-style) * * Returns the raw result from veritasQuery. */ router.post("/api/chat", async (req, res) => { try { const { prompt, messages } = req.body ?? {}; // Basic validation: require either prompt or messages 
  const router = Router();

router.post("/api/chat", async (req, res) => {
  const { prompt, messages } = req.body;
  try {
    const result = await veritasQuery({ prompt, messages });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;                                                                                                                                                                                                                  if ((!prompt || String(prompt).trim() === "") && (!Array.isArray(messages) || messages.length === 0)) { return res.status(400).json({ error: "Missing prompt or messages in request body" }); }

    const aiResponse = await veritasQuery(userPrompt);
    return res.json({ ok: true, ai: aiResponse });
  } catch (err: any) {
    console.error('AI request failed:', err);
    const status = err.message?.includes('Missing OPENAI_API_KEY') ? 500 : 502;
    return res.status(status).json({ error: `AI request failed: ${err.message}` });
  }
});

export default router;

export async function registerRoutes(app: Express) {
  app.post("/api/chat", async (req, res) => {
    const { prompt, messages } = req.body;
    try {
      const result = await veritasQuery({ prompt, messages });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
}
