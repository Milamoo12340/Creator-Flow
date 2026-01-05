// server/routes.ts
import express from "express";
import { veritasQuery } from "./openai";

const router = express.Router();

router.post("/api/chat", async (req, res) => {
  try {
    const { prompt, messages, depth } = req.body ?? {};

    if ((!prompt || String(prompt).trim() === "") && (!Array.isArray(messages) || messages.length === 0)) {
      return res.status(400).json({ error: "Missing prompt or messages in request body" });
    }

    const result = await veritasQuery({ prompt, messages, depth });

    return res.json({ ok: true, result });
  } catch (err: any) {
    console.error("AI request failed:", err);
    return res.status(500).json({ error: `AI request failed: ${err.message || err}` });
  }
});

export default router;
