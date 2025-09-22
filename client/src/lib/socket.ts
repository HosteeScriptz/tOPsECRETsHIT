import io, { Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    // Connect to the server Socket.io instance
    socket = io(window.location.origin, {
      autoConnect: true,
    });

    // Global error handler
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Socket event types for type safety
export interface SocketEvents {
  // Client -> Server events
  'join-game': (data: { gameId: string; playerId: string }) => void;
  'leave-game': (data: { gameId: string; playerId: string }) => void;
  'start-game': (data: { gameId: string; hostId: string }) => void;
  'next-turn': (data: { gameId: string; currentPlayerId: string }) => void;
  'update-score': (data: { gameId: string; playerId: string; points: number }) => void;
  'prompt-completed': (data: { gameId: string; promptId: string; playerId: string; completed: boolean }) => void;
  'generate-prompt': (data: { gameId: string; playerId: string; type: 'truth' | 'dare' }) => void;

  // Server -> Client events
  'player-joined': (data: { playerId: string; game: any; players: any[] }) => void;
  'player-left': (data: { playerId: string; players: any[] }) => void;
  'game-started': (data: { game: any; players: any[]; currentTurnPlayerId: string }) => void;
  'turn-changed': (data: { game: any; players: any[]; currentTurnPlayerId: string; previousPlayerId: string }) => void;
  'score-updated': (data: { playerId: string; newScore: number; points: number; players: any[] }) => void;
  'prompt-completed': (data: { promptId: string; playerId: string; completed: boolean }) => void;
  'prompt-generated': (data: { prompt: any; playerId: string }) => void;
  'error': (data: { message: string }) => void;
}