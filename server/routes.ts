import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateVeritasResponse, type ChatMessage, type EvidenceSource } from "./openai";
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
      let chatHistory: ChatMessage[] = [];

      // Try to get conversation history (optional - works if DB is available)
      if (conversationId) {
        try {
          const history = await storage.getMessagesByConversation(conversationId);
          chatHistory = history.slice(-10).map(m => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content,
          }));
        } catch (dbError) {
          console.warn("Could not retrieve conversation history from DB:", dbError);
          chatHistory = [];
        }
      }

      // Generate AI response with web search
      const aiResponse = await generateVeritasResponse(
        body.message,
        body.depth,
        chatHistory,
        body.systemPrompt
      );

      // Try to save to database (optional - if DB is available)
      let savedMessage: any = {
        id: Math.floor(Math.random() * 1000000),
        conversationId: conversationId || 0,
        role: "ai",
        content: aiResponse.content,
        depth: aiResponse.depth,
        sources: aiResponse.sources,
        createdAt: new Date(),
      };

      if (conversationId) {
        try {
          // Try to save user message
          await storage.createMessage({
            conversationId,
            role: "user",
            content: body.message,
            depth: body.depth,
            sources: null,
          });

          // Try to save AI message with sources
          savedMessage = await storage.createMessage({
            conversationId,
            role: "ai",
            content: aiResponse.content,
            depth: aiResponse.depth,
            sources: aiResponse.sources,
          });
        } catch (dbError) {
          console.warn("Could not save messages to DB:", dbError);
          // Continue without persistence - just return the response
        }
      } else {
        // No conversation ID - create one if DB is available
        try {
          const conversation = await storage.createConversation({
            title: body.message.substring(0, 50) + "...",
            userId: null,
          });
          conversationId = conversation.id;
          savedMessage.conversationId = conversationId;

          // Save both messages
          await storage.createMessage({
            conversationId,
            role: "user",
            content: body.message,
            depth: body.depth,
            sources: null,
          });

          savedMessage = await storage.createMessage({
            conversationId,
            role: "ai",
            content: aiResponse.content,
            depth: aiResponse.depth,
            sources: aiResponse.sources,
          });
        } catch (dbError) {
          console.warn("Could not create conversation in DB:", dbError);
          // Continue without persistence
        }
      }

      res.json({
        message: savedMessage,
        conversationId: conversationId || 0,
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
      const allConversations = await storage.getConversationsByUser(0);
      res.json(allConversations);
    } catch (error: any) {
      console.error("Get conversations error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch conversations" });
    }
  });

  // Get single conversation with messages
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
      console.error("Get conversation error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch conversation" });
    }
  });

  return httpServer;
}
