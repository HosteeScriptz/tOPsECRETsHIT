import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const games = pgTable("games", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomCode: text("room_code").notNull().unique(),
  hostId: varchar("host_id").notNull(),
  mode: text("mode", { enum: ["friends", "crush", "spouse"] }).notNull(),
  difficulty: text("difficulty", { enum: ["easy", "medium", "extreme"] }).notNull(),
  status: text("status", { enum: ["waiting", "playing", "finished"] }).notNull().default("waiting"),
  currentTurnPlayerId: varchar("current_turn_player_id"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const players = pgTable("players", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameId: varchar("game_id").notNull(),
  name: text("name").notNull(),
  score: integer("score").notNull().default(0),
  isHost: boolean("is_host").notNull().default(false),
  isOnline: boolean("is_online").notNull().default(true),
  joinedAt: timestamp("joined_at").notNull().default(sql`now()`),
});

export const gamePrompts = pgTable("game_prompts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameId: varchar("game_id").notNull(),
  type: text("type", { enum: ["truth", "dare"] }).notNull(),
  text: text("text").notNull(),
  difficulty: text("difficulty", { enum: ["easy", "medium", "extreme"] }).notNull(),
  mode: text("mode", { enum: ["friends", "crush", "spouse"] }).notNull(),
  playerId: varchar("player_id").notNull(),
  completed: boolean("completed").notNull().default(false),
  skipped: boolean("skipped").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// User schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Game schemas
export const insertGameSchema = createInsertSchema(games).pick({
  roomCode: true,
  hostId: true,
  mode: true,
  difficulty: true,
});

export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;

// Player schemas
export const insertPlayerSchema = createInsertSchema(players).pick({
  gameId: true,
  name: true,
  isHost: true,
});

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;

// GamePrompt schemas
export const insertGamePromptSchema = createInsertSchema(gamePrompts).pick({
  gameId: true,
  type: true,
  text: true,
  difficulty: true,
  mode: true,
  playerId: true,
});

export type InsertGamePrompt = z.infer<typeof insertGamePromptSchema>;
export type GamePrompt = typeof gamePrompts.$inferSelect;
