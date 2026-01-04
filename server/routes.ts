import { Router } from "express";
import { veritasQuery } from "./openai";
import { storage } from "./storage";

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

export default router;
