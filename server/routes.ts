import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { storage } from "./storage";
import { insertGameSchema, insertPlayerSchema, insertGamePromptSchema } from "@shared/schema";
import { promptGenerator } from "./gemini-prompts";
import { z } from "zod";

// Room management for Socket.io
const gameRooms = new Map<string, Set<string>>(); // gameId -> Set of socketIds

export async function registerRoutes(app: Express): Promise<Server> {
  // Game API routes
  app.post("/api/games", async (req, res) => {
    try {
      const gameData = insertGameSchema.parse(req.body);
      const game = await storage.createGame(gameData);
      res.json(game);
    } catch (error) {
      res.status(400).json({ error: "Invalid game data" });
    }
  });

  app.get("/api/games/:roomCode", async (req, res) => {
    try {
      const game = await storage.getGameByRoomCode(req.params.roomCode);
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }

      const players = await storage.getPlayersByGameId(game.id);
      res.json({ game, players });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch game" });
    }
  });

  app.post("/api/games/:gameId/players", async (req, res) => {
    try {
      const playerData = insertPlayerSchema.extend({
        gameId: z.string()
      }).parse({
        ...req.body,
        gameId: req.params.gameId
      });

      const player = await storage.createPlayer(playerData);
      
      // If this is the host player, update the game's hostId
      if (playerData.isHost) {
        await storage.updateGame(playerData.gameId, { hostId: player.id });
      }
      
      res.json(player);
    } catch (error) {
      res.status(400).json({ error: "Invalid player data" });
    }
  });

  app.get("/api/games/:gameId/players", async (req, res) => {
    try {
      const players = await storage.getPlayersByGameId(req.params.gameId);
      res.json(players);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch players" });
    }
  });

  app.post("/api/games/:gameId/prompts", async (req, res) => {
    try {
      const promptData = insertGamePromptSchema.extend({
        gameId: z.string()
      }).parse({
        ...req.body,
        gameId: req.params.gameId
      });

      const prompt = await storage.createGamePrompt(promptData);
      res.json(prompt);
    } catch (error) {
      res.status(400).json({ error: "Invalid prompt data" });
    }
  });

  app.patch("/api/players/:playerId", async (req, res) => {
    try {
      const updatedPlayer = await storage.updatePlayer(req.params.playerId, req.body);
      if (!updatedPlayer) {
        return res.status(404).json({ error: "Player not found" });
      }
      res.json(updatedPlayer);
    } catch (error) {
      res.status(500).json({ error: "Failed to update player" });
    }
  });

  app.patch("/api/games/:gameId", async (req, res) => {
    try {
      const updatedGame = await storage.updateGame(req.params.gameId, req.body);
      if (!updatedGame) {
        return res.status(404).json({ error: "Game not found" });
      }
      res.json(updatedGame);
    } catch (error) {
      res.status(500).json({ error: "Failed to update game" });
    }
  });

  const httpServer = createServer(app);
  
  // Setup Socket.io for real-time functionality
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join game room
    socket.on("join-game", async (data: { gameId: string, playerId: string }) => {
      try {
        const { gameId, playerId } = data;
        
        // Join socket to game room
        socket.join(gameId);
        
        // Track player in room
        if (!gameRooms.has(gameId)) {
          gameRooms.set(gameId, new Set());
        }
        gameRooms.get(gameId)!.add(socket.id);

        // Update player online status
        await storage.updatePlayer(playerId, { isOnline: true });

        // Get updated game state
        const game = await storage.getGame(gameId);
        const players = await storage.getPlayersByGameId(gameId);

        // Notify all players in the room
        io.to(gameId).emit("player-joined", {
          playerId,
          game,
          players
        });

        console.log(`Player ${playerId} joined game ${gameId}`);
      } catch (error) {
        socket.emit("error", { message: "Failed to join game" });
      }
    });

    // Leave game room
    socket.on("leave-game", async (data: { gameId: string, playerId: string }) => {
      try {
        const { gameId, playerId } = data;

        // Leave socket room
        socket.leave(gameId);

        // Remove from tracked room
        if (gameRooms.has(gameId)) {
          gameRooms.get(gameId)!.delete(socket.id);
        }

        // Update player online status
        await storage.updatePlayer(playerId, { isOnline: false });

        // Get updated players
        const players = await storage.getPlayersByGameId(gameId);

        // Notify other players
        io.to(gameId).emit("player-left", {
          playerId,
          players
        });

        console.log(`Player ${playerId} left game ${gameId}`);
      } catch (error) {
        socket.emit("error", { message: "Failed to leave game" });
      }
    });

    // Start game
    socket.on("start-game", async (data: { gameId: string, hostId: string }) => {
      try {
        const { gameId, hostId } = data;

        // Verify host permissions
        const host = await storage.getPlayer(hostId);
        if (!host || !host.isHost) {
          socket.emit("error", { message: "Only the host can start the game" });
          return;
        }

        // Get all players and set first player's turn
        const players = await storage.getPlayersByGameId(gameId);
        if (players.length < 2) {
          socket.emit("error", { message: "Need at least 2 players to start" });
          return;
        }

        const firstPlayer = players[0];
        
        // Update game status and current turn
        const updatedGame = await storage.updateGame(gameId, {
          status: "playing",
          currentTurnPlayerId: firstPlayer.id
        });

        // Notify all players
        io.to(gameId).emit("game-started", {
          game: updatedGame,
          players,
          currentTurnPlayerId: firstPlayer.id
        });

        console.log(`Game ${gameId} started by host ${hostId}`);
      } catch (error) {
        socket.emit("error", { message: "Failed to start game" });
      }
    });

    // Handle turn change
    socket.on("next-turn", async (data: { gameId: string, currentPlayerId: string }) => {
      try {
        const { gameId, currentPlayerId } = data;

        const players = await storage.getPlayersByGameId(gameId);
        const currentIndex = players.findIndex(p => p.id === currentPlayerId);
        const nextIndex = (currentIndex + 1) % players.length;
        const nextPlayer = players[nextIndex];

        // Update game with next player's turn
        const updatedGame = await storage.updateGame(gameId, {
          currentTurnPlayerId: nextPlayer.id
        });

        // Notify all players
        io.to(gameId).emit("turn-changed", {
          game: updatedGame,
          players,
          currentTurnPlayerId: nextPlayer.id,
          previousPlayerId: currentPlayerId
        });

        console.log(`Turn changed in game ${gameId} from ${currentPlayerId} to ${nextPlayer.id}`);
      } catch (error) {
        socket.emit("error", { message: "Failed to change turn" });
      }
    });

    // Handle score update
    socket.on("update-score", async (data: { gameId: string, playerId: string, points: number }) => {
      try {
        const { gameId, playerId, points } = data;

        // Get current player and update score
        const player = await storage.getPlayer(playerId);
        if (!player) {
          socket.emit("error", { message: "Player not found" });
          return;
        }

        const updatedPlayer = await storage.updatePlayer(playerId, {
          score: player.score + points
        });

        // Get all players for updated scores
        const players = await storage.getPlayersByGameId(gameId);

        // Notify all players
        io.to(gameId).emit("score-updated", {
          playerId,
          newScore: updatedPlayer!.score,
          points,
          players
        });

        console.log(`Score updated for player ${playerId}: +${points} (total: ${updatedPlayer!.score})`);
      } catch (error) {
        socket.emit("error", { message: "Failed to update score" });
      }
    });

    // Handle prompt generation/completion
    socket.on("prompt-completed", async (data: { gameId: string, promptId: string, playerId: string, completed: boolean }) => {
      try {
        const { gameId, promptId, playerId, completed } = data;

        // Update prompt status
        await storage.updateGamePrompt(promptId, {
          completed,
          skipped: !completed
        });

        // Notify all players
        io.to(gameId).emit("prompt-completed", {
          promptId,
          playerId,
          completed
        });

        console.log(`Prompt ${promptId} ${completed ? 'completed' : 'skipped'} by player ${playerId}`);
      } catch (error) {
        socket.emit("error", { message: "Failed to update prompt" });
      }
    });

    // Generate new prompt
    socket.on("generate-prompt", async (data: { gameId: string, playerId: string, type: "truth" | "dare" }) => {
      try {
        const { gameId, playerId, type } = data;

        // Get game details for prompt generation context
        const game = await storage.getGame(gameId);
        if (!game) {
          socket.emit("error", { message: "Game not found" });
          return;
        }

        // Generate prompt using Gemini AI or fallback system
        const generatedPrompt = await promptGenerator.generatePrompt({
          type,
          mode: game.mode,
          difficulty: game.difficulty,
          gameTheme: "Game of Doom - Dark party atmosphere with nightclub vibes, mysterious and exciting"
        });

        // Create prompt in storage
        const newPrompt = await storage.createGamePrompt({
          gameId,
          type,
          text: generatedPrompt.text,
          difficulty: game.difficulty,
          mode: game.mode,
          playerId
        });

        // Notify all players with additional context about the prompt source
        io.to(gameId).emit("prompt-generated", {
          prompt: newPrompt,
          playerId,
          isAIGenerated: generatedPrompt.isAIGenerated
        });

        console.log(
          `New ${type} prompt generated for player ${playerId} in game ${gameId} ` +
          `(${generatedPrompt.isAIGenerated ? 'AI-generated' : 'static fallback'}): "${generatedPrompt.text}"`
        );
      } catch (error) {
        console.error("Error generating prompt:", error);
        socket.emit("error", { message: "Failed to generate prompt" });
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      
      // Clean up from all rooms
      for (const [gameId, socketIds] of gameRooms.entries()) {
        if (socketIds.has(socket.id)) {
          socketIds.delete(socket.id);
          // If room is empty, clean it up
          if (socketIds.size === 0) {
            gameRooms.delete(gameId);
          }
        }
      }
    });
  });

  return httpServer;
}
