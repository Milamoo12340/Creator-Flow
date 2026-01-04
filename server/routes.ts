import { Express } from "express";
import { veritasQuery } from "./openai";
import { storage } from "./storage";
// server/routes.ts (or wherever you handle /api/chat)
import express from 'express';
import { veritasQuery } from './openai';

const router = express.Router();

router.post('/api/chat', async (req, res) => {
  try {
    const userPrompt = String(req.body.prompt || req.query.prompt || '');
    if (!userPrompt) return res.status(400).json({ error: 'Missing prompt' });

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
