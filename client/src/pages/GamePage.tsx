import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Settings, LogOut, Play } from "lucide-react";
import PlayerList from "@/components/PlayerList";
import PromptCard from "@/components/PromptCard";
import PromptSelector from "@/components/PromptSelector";
import ScoreBoard from "@/components/ScoreBoard";
import { getSocket } from "@/lib/socket";
import type { Game, Player, GamePrompt } from "@shared/schema";

export default function GamePage() {
  const [match, params] = useRoute("/game/:roomCode");
  const roomCode = params?.roomCode || "";
  
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const playerName = urlParams.get('playerName') || '';
  const isHost = urlParams.get('host') === 'true';
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Game state
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<GamePrompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Socket instance
  const socket = getSocket();

  // Initialize game data on component mount
  useEffect(() => {
    const initializeGame = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch game data
        const gameResponse = await fetch(`/api/games/${roomCode}`);
        if (!gameResponse.ok) {
          if (gameResponse.status === 404) {
            throw new Error('Game room not found. Please check the room code.');
          }
          throw new Error('Failed to connect to game room');
        }
        
        const gameData = await gameResponse.json();
        setGame(gameData.game);
        setPlayers(gameData.players);

        // Create or find current player
        let player = gameData.players.find((p: Player) => p.name === playerName);
        
        if (!player) {
          // Create new player
          const playerResponse = await fetch(`/api/games/${gameData.game.id}/players`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: playerName,
              isHost: isHost,
            }),
          });
          
          if (!playerResponse.ok) {
            const errorData = await playerResponse.json();
            throw new Error(errorData.error || 'Failed to join game');
          }
          
          player = await playerResponse.json();
          
          // Update local state immediately
          setPlayers(prev => [...prev, player]);
        }
        
        setCurrentPlayer(player);

        // Join the game room via Socket.io
        socket.emit('join-game', {
          gameId: gameData.game.id,
          playerId: player.id,
        });

        setLoading(false);
      } catch (err) {
        console.error('Game initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load game');
        setLoading(false);
      }
    };

    if (roomCode && playerName) {
      initializeGame();
    } else {
      setError('Missing room code or player name');
      setLoading(false);
    }
  }, [roomCode, playerName, isHost, socket]);

  // Socket event listeners
  useEffect(() => {
    const handlePlayerJoined = (data: any) => {
      console.log('Player joined:', data);
      setPlayers(data.players);
      setGame(data.game);
    };

    const handlePlayerLeft = (data: any) => {
      console.log('Player left:', data);
      setPlayers(data.players);
    };

    const handleGameStarted = (data: any) => {
      console.log('Game started:', data);
      setGame(data.game);
      setPlayers(data.players);
      // Clear any existing prompt when game starts
      setCurrentPrompt(null);
    };

    const handleTurnChanged = (data: any) => {
      console.log('Turn changed:', data);
      setGame(data.game);
      setPlayers(data.players);
      // Clear prompt when turn changes
      setCurrentPrompt(null);
    };

    const handleScoreUpdated = (data: any) => {
      console.log('Score updated:', data);
      setPlayers(data.players);
    };

    const handlePromptGenerated = (data: any) => {
      console.log('Prompt generated:', data);
      setCurrentPrompt(data.prompt);
    };

    const handleError = (data: any) => {
      console.error('Socket error:', data);
      setError(data.message || 'An error occurred');
    };

    const handlePromptCompleted = (data: any) => {
      console.log('Prompt completed:', data);
      // Clear current prompt when completed
      setCurrentPrompt(null);
    };

    // Set up event listeners
    socket.on('player-joined', handlePlayerJoined);
    socket.on('player-left', handlePlayerLeft);
    socket.on('game-started', handleGameStarted);
    socket.on('turn-changed', handleTurnChanged);
    socket.on('score-updated', handleScoreUpdated);
    socket.on('prompt-generated', handlePromptGenerated);
    socket.on('prompt-completed', handlePromptCompleted);
    socket.on('error', handleError);

    // Handle connection events
    socket.on('connect', () => {
      console.log('Socket connected');
      setError(null);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setError('Connection lost. Trying to reconnect...');
    });

    socket.on('reconnect', () => {
      console.log('Socket reconnected');
      setError(null);
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off('player-joined', handlePlayerJoined);
      socket.off('player-left', handlePlayerLeft);
      socket.off('game-started', handleGameStarted);
      socket.off('turn-changed', handleTurnChanged);
      socket.off('score-updated', handleScoreUpdated);
      socket.off('prompt-generated', handlePromptGenerated);
      socket.off('prompt-completed', handlePromptCompleted);
      socket.off('error', handleError);
      socket.off('connect');
      socket.off('disconnect');
      socket.off('reconnect');
    };
  }, [socket]);

  const copyRoomCode = async () => {
    await navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startGame = () => {
    if (game && currentPlayer?.isHost) {
      socket.emit('start-game', {
        gameId: game.id,
        hostId: currentPlayer.id,
      });
    }
  };

  const handleComplete = () => {
    if (currentPrompt && currentPlayer && game) {
      socket.emit('prompt-completed', {
        gameId: game.id,
        promptId: currentPrompt.id,
        playerId: currentPlayer.id,
        completed: true,
      });
      
      socket.emit('update-score', {
        gameId: game.id,
        playerId: currentPlayer.id,
        points: 1,
      });
      
      nextTurn();
    }
  };

  const handleSkip = () => {
    if (currentPrompt && currentPlayer && game) {
      socket.emit('prompt-completed', {
        gameId: game.id,
        promptId: currentPrompt.id,
        playerId: currentPlayer.id,
        completed: false,
      });
      
      socket.emit('update-score', {
        gameId: game.id,
        playerId: currentPlayer.id,
        points: -1,
      });
      
      nextTurn();
    }
  };

  const handleNewPrompt = (type?: 'truth' | 'dare') => {
    if (game && currentPlayer) {
      const promptType = type || (Math.random() > 0.5 ? 'truth' : 'dare');
      console.log(`Generating ${promptType} prompt for player ${currentPlayer.id}`);
      socket.emit('generate-prompt', {
        gameId: game.id,
        playerId: currentPlayer.id,
        type: promptType,
      });
    }
  };

  const nextTurn = () => {
    if (game && currentPlayer) {
      socket.emit('next-turn', {
        gameId: game.id,
        currentPlayerId: currentPlayer.id,
      });
    }
  };

  const leaveGame = () => {
    if (game && currentPlayer) {
      socket.emit('leave-game', {
        gameId: game.id,
        playerId: currentPlayer.id,
      });
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.href = '/'}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!game || !currentPlayer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p>Game not found</p>
          <Button onClick={() => window.location.href = '/'}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const currentTurnPlayer = players.find(p => p.id === game.currentTurnPlayerId);
  const isMyTurn = currentTurnPlayer?.id === currentPlayer.id;

  const modeLabels = {
    friends: "Friends",
    crush: "With Crush",
    spouse: "With Spouse"
  };

  const difficultyLabels = {
    easy: "Easy",
    medium: "Medium", 
    extreme: "Extreme"
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <Card className="mb-6">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-primary neon-glow">Game of Doom</h1>
                  <p className="text-sm text-muted-foreground">
                    {modeLabels[game.mode]} • {difficultyLabels[game.difficulty]} Mode
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    {roomCode}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={copyRoomCode}
                    data-testid="button-copy-room-code"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {game.status === 'waiting' && currentPlayer.isHost && (
                  <Button
                    onClick={startGame}
                    data-testid="button-start-game"
                    className="gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Start Game
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowScoreboard(!showScoreboard)}
                  data-testid="button-toggle-scoreboard"
                >
                  {showScoreboard ? "Hide" : "Show"} Scores
                </Button>
                <Button variant="ghost" size="icon" data-testid="button-settings">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={leaveGame}
                  data-testid="button-leave"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {game.status === 'waiting' ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Waiting for players...</h2>
            <p className="text-muted-foreground mb-6">
              Share the room code with your friends: <span className="font-mono font-bold">{roomCode}</span>
            </p>
            <div className="text-sm text-muted-foreground">
              Players joined: {players.length}
              {players.length < 2 && " (Need at least 2 players to start)"}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Game Area */}
            <div className="lg:col-span-2 space-y-6">
              {currentTurnPlayer && (
                <>
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold">
                      {isMyTurn ? "Your turn!" : `${currentTurnPlayer.name}'s turn`}
                    </h3>
                  </div>
                  
                  {currentPrompt ? (
                    <PromptCard
                      prompt={currentPrompt}
                      playerName={currentTurnPlayer.name}
                      onComplete={handleComplete}
                      onSkip={handleSkip}
                      onNewPrompt={handleNewPrompt}
                      canGetNewPrompt={isMyTurn}
                      disabled={!isMyTurn}
                    />
                  ) : isMyTurn ? (
                    <PromptSelector
                      playerName={currentTurnPlayer.name}
                      onSelectType={handleNewPrompt}
                      disabled={false}
                    />
                  ) : (
                    <Card className="p-6 text-center">
                      <p className="text-muted-foreground">Waiting for {currentTurnPlayer.name} to generate a prompt...</p>
                    </Card>
                  )}
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {showScoreboard ? (
                <ScoreBoard
                  players={players}
                  roomCode={roomCode}
                  gameMode={modeLabels[game.mode]}
                  gameDifficulty={difficultyLabels[game.difficulty]}
                  currentTurnPlayerId={game.currentTurnPlayerId || undefined}
                />
              ) : (
                <PlayerList
                  players={players}
                  currentPlayerId={currentPlayer.id}
                  currentTurnPlayerId={game.currentTurnPlayerId || undefined}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}