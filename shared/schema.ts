import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, serial, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Conversations table
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").default("New Investigation"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").references(() => conversations.id).notNull(),
  role: text("role").notNull(), // 'user' | 'ai' | 'system'
  content: text("content").notNull(),
  depth: text("depth"), // 'SURFACE' | 'DEEP' | 'DARK' | 'VAULT'
  sources: jsonb("sources"), // Evidence sources
  createdAt: timestamp("created_at").defaultNow(),
});

// User config table
export const userConfig = pgTable("user_config", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  activeModel: text("active_model").default("dolphin"),
  temperature: integer("temperature").default(85),
  systemPrompt: text("system_prompt").default("You are VERITAS. Uncover hidden knowledge."),
  osintTools: jsonb("osint_tools").default({ torbot: true, onionscan: true, wayback: true, dorks: true }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  conversations: many(conversations),
  config: one(userConfig),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user: one(users, { fields: [conversations.userId], references: [users.id] }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, { fields: [messages.conversationId], references: [conversations.id] }),
}));

export const userConfigRelations = relations(userConfig, ({ one }) => ({
  user: one(users, { fields: [userConfig.userId], references: [users.id] }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertConversationSchema = createInsertSchema(conversations).pick({
  userId: true,
  title: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  conversationId: true,
  role: true,
  content: true,
  depth: true,
  sources: true,
});

export const insertUserConfigSchema = createInsertSchema(userConfig).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type UserConfig = typeof userConfig.$inferSelect;
export type InsertUserConfig = z.infer<typeof insertUserConfigSchema>;
