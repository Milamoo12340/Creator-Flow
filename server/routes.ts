// server/routes.ts
import express from "express";
import { veritasQuery } from "./openai";
import { getTieredTopic, getTerminalResponse } from "./mockData";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { log } from "./index";
import { z } from "zod";
import { drizzle } from "drizzle-orm/node-postgres";
import { pool } from "./db";
const router = express.Router();

/**
 * POST /api/chat
 * Accepts either:
 * - { prompt: "..." } OR
 * - { messages: [...] } (chat-style)
 *
 * Returns the raw result from veritasQuery.
 */
router.post("/api/chat", async (req, res) => {
	try {
		const { prompt, messages } = req.body ?? {};

		if ((!prompt || String(prompt).trim() === "") && (!Array.isArray(messages) || messages.length === 0)) {
			return res.status(400).json({ error: "Missing prompt or messages in request body" });
		}

		const result = await veritasQuery({ prompt, messages });

		return res.json({ ok: true, result });
	} catch (err: any) {
		console.error("AI request failed:", err);
		const status = String(err.message || "").toLowerCase().includes("missing") ? 500 : 502;
		return res.status(status).json({ error: `AI request failed: ${err.message || err}` });
	}
});

export default router;