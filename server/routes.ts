import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateVeritasResponse, type ChatMessage } from "./openai";
import { insertMessageSchema, insertConversationSchema } from "@shared/schema";
import { z } from "zod";

const chatRequestSchema = z.object({
  message: z.string().min(1),
  depth: z.enum(["SURFACE", "DEEP", "DARK", "VAULT"]).default("SURFACE"),
  conversationId: z.number().optional(),
  systemPrompt: z.string().optional(),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Chat endpoint - main AI interaction
  app.post("/api/chat", async (req, res) => {
    try {
      const body = chatRequestSchema.parse(req.body);
      
      let conversationId = body.conversationId;
      
      // Create new conversation if needed
      if (!conversationId) {
        const conversation = await storage.createConversation({
          title: body.message.substring(0, 50) + "...",
          userId: null,
        });
        conversationId = conversation.id;
      }
      
      // Save user message
      await storage.createMessage({
        conversationId,
        role: "user",
        content: body.message,
        depth: body.depth,
        sources: null,
      });
      
      // Get conversation history
      const history = await storage.getMessagesByConversation(conversationId);
      const chatHistory: ChatMessage[] = history.slice(-10).map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      }));
      
      // Generate AI response
      const aiResponse = await generateVeritasResponse(
        body.message,
        body.depth,
        chatHistory,
        body.systemPrompt
      );
      
      // Save AI message
      const savedMessage = await storage.createMessage({
        conversationId,
        role: "ai",
        content: aiResponse.content,
        depth: aiResponse.depth,
        sources: aiResponse.sources,
      });
      
      res.json({
        message: savedMessage,
        conversationId,
        hasMoreDepth: aiResponse.hasMoreDepth,
      });
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({ error: error.message || "Failed to process chat" });
    }
  });

  // Get conversations
  app.get("/api/conversations", async (req, res) => {
    try {
      // For now, get all conversations (no auth)
      const allConversations = await storage.getConversationsByUser(1);
      res.json(allConversations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get conversation with messages
  app.get("/api/conversations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const conversation = await storage.getConversation(id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      const messages = await storage.getMessagesByConversation(id);
      res.json({ conversation, messages });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get/Update config
  app.get("/api/config", async (req, res) => {
    try {
      const config = await storage.getUserConfig(1);
      res.json(config || {
        activeModel: "dolphin",
        temperature: 85,
        systemPrompt: "You are VERITAS. Uncover hidden knowledge.",
        osintTools: { torbot: true, onionscan: true, wayback: true, dorks: true }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/config", async (req, res) => {
    try {
      const config = await storage.upsertUserConfig({
        userId: 1,
        ...req.body,
      });
      res.json(config);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return httpServer;
}
