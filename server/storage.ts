import { 
  users, conversations, messages, userConfig,
  type User, type InsertUser, 
  type Conversation, type InsertConversation,
  type Message, type InsertMessage,
  type UserConfig, type InsertUserConfig
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Conversations
  getConversation(id: number): Promise<Conversation | undefined>;
  getConversationsByUser(userId: number): Promise<Conversation[]>;
  createConversation(data: InsertConversation): Promise<Conversation>;
  
  // Messages
  getMessagesByConversation(conversationId: number): Promise<Message[]>;
  createMessage(data: InsertMessage): Promise<Message>;
  
  // Config
  getUserConfig(userId: number): Promise<UserConfig | undefined>;
  upsertUserConfig(data: InsertUserConfig): Promise<UserConfig>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Conversations
  async getConversation(id: number): Promise<Conversation | undefined> {
    const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conv || undefined;
  }

  async getConversationsByUser(userId: number): Promise<Conversation[]> {
    return db.select().from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.updatedAt));
  }

  async createConversation(data: InsertConversation): Promise<Conversation> {
    const [conv] = await db.insert(conversations).values(data).returning();
    return conv;
  }

  // Messages
  async getMessagesByConversation(conversationId: number): Promise<Message[]> {
    return db.select().from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);
  }

  async createMessage(data: InsertMessage): Promise<Message> {
    const [msg] = await db.insert(messages).values(data).returning();
    return msg;
  }

  // Config
  async getUserConfig(userId: number): Promise<UserConfig | undefined> {
    const [config] = await db.select().from(userConfig).where(eq(userConfig.userId, userId));
    return config || undefined;
  }

  async upsertUserConfig(data: InsertUserConfig): Promise<UserConfig> {
    const existing = data.userId ? await this.getUserConfig(data.userId) : undefined;
    if (existing) {
      const [updated] = await db.update(userConfig)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(userConfig.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(userConfig).values(data).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
