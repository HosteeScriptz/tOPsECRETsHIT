import { 
  type User, 
  type InsertUser, 
  type Game, 
  type InsertGame, 
  type Player, 
  type InsertPlayer, 
  type GamePrompt, 
  type InsertGamePrompt 
} from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Game methods
  getGame(id: string): Promise<Game | undefined>;
  getGameByRoomCode(roomCode: string): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: string, updates: Partial<Game>): Promise<Game | undefined>;
  deleteGame(id: string): Promise<boolean>;

  // Player methods
  getPlayer(id: string): Promise<Player | undefined>;
  getPlayersByGameId(gameId: string): Promise<Player[]>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: string, updates: Partial<Player>): Promise<Player | undefined>;
  removePlayer(id: string): Promise<boolean>;

  // GamePrompt methods
  getGamePrompt(id: string): Promise<GamePrompt | undefined>;
  getGamePromptsByGameId(gameId: string): Promise<GamePrompt[]>;
  createGamePrompt(prompt: InsertGamePrompt): Promise<GamePrompt>;
  updateGamePrompt(id: string, updates: Partial<GamePrompt>): Promise<GamePrompt | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private games: Map<string, Game>;
  private players: Map<string, Player>;
  private gamePrompts: Map<string, GamePrompt>;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.players = new Map();
    this.gamePrompts = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Game methods
  async getGame(id: string): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async getGameByRoomCode(roomCode: string): Promise<Game | undefined> {
    return Array.from(this.games.values()).find(
      (game) => game.roomCode === roomCode,
    );
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const id = randomUUID();
    const game: Game = {
      ...insertGame,
      id,
      status: "waiting",
      currentTurnPlayerId: null,
      createdAt: new Date(),
    };
    this.games.set(id, game);
    return game;
  }

  async updateGame(id: string, updates: Partial<Game>): Promise<Game | undefined> {
    const game = this.games.get(id);
    if (!game) return undefined;
    
    const updatedGame = { ...game, ...updates };
    this.games.set(id, updatedGame);
    return updatedGame;
  }

  async deleteGame(id: string): Promise<boolean> {
    return this.games.delete(id);
  }

  // Player methods
  async getPlayer(id: string): Promise<Player | undefined> {
    return this.players.get(id);
  }

  async getPlayersByGameId(gameId: string): Promise<Player[]> {
    return Array.from(this.players.values()).filter(
      (player) => player.gameId === gameId,
    );
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const id = randomUUID();
    const player: Player = {
      ...insertPlayer,
      id,
      score: 0,
      isOnline: true,
      joinedAt: new Date(),
    };
    this.players.set(id, player);
    return player;
  }

  async updatePlayer(id: string, updates: Partial<Player>): Promise<Player | undefined> {
    const player = this.players.get(id);
    if (!player) return undefined;
    
    const updatedPlayer = { ...player, ...updates };
    this.players.set(id, updatedPlayer);
    return updatedPlayer;
  }

  async removePlayer(id: string): Promise<boolean> {
    return this.players.delete(id);
  }

  // GamePrompt methods
  async getGamePrompt(id: string): Promise<GamePrompt | undefined> {
    return this.gamePrompts.get(id);
  }

  async getGamePromptsByGameId(gameId: string): Promise<GamePrompt[]> {
    return Array.from(this.gamePrompts.values()).filter(
      (prompt) => prompt.gameId === gameId,
    );
  }

  async createGamePrompt(insertPrompt: InsertGamePrompt): Promise<GamePrompt> {
    const id = randomUUID();
    const prompt: GamePrompt = {
      ...insertPrompt,
      id,
      completed: false,
      skipped: false,
      createdAt: new Date(),
    };
    this.gamePrompts.set(id, prompt);
    return prompt;
  }

  async updateGamePrompt(id: string, updates: Partial<GamePrompt>): Promise<GamePrompt | undefined> {
    const prompt = this.gamePrompts.get(id);
    if (!prompt) return undefined;
    
    const updatedPrompt = { ...prompt, ...updates };
    this.gamePrompts.set(id, updatedPrompt);
    return updatedPrompt;
  }
}

export const storage = new MemStorage();
