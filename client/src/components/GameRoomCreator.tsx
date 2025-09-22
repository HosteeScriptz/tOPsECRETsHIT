import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Copy, Check } from "lucide-react";
import { GameMode } from "./GameModeSelector";
import { DifficultyLevel } from "./DifficultySelector";

interface GameRoomCreatorProps {
  selectedMode: GameMode;
  selectedDifficulty: DifficultyLevel;
  onCreateRoom: (playerName: string, roomCode: string) => void;
}

export default function GameRoomCreator({ selectedMode, selectedDifficulty, onCreateRoom }: GameRoomCreatorProps) {
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateRoomCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
    return code;
  };

  const handleCreateRoom = async () => {
    if (!playerName.trim()) return;
    
    setIsCreating(true);
    const code = roomCode || generateRoomCode();
    
    try {
      // Create game on the backend
      const gameResponse = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomCode: code,
          hostId: 'host-placeholder', // Will be updated when player joins
          mode: selectedMode,
          difficulty: selectedDifficulty,
        }),
      });

      if (!gameResponse.ok) {
        throw new Error('Failed to create game');
      }

      const game = await gameResponse.json();
      console.log("Game created:", game);
      
      onCreateRoom(playerName, code);
    } catch (error) {
      console.error("Failed to create room:", error);
      alert("Failed to create room. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const copyRoomCode = async () => {
    if (roomCode) {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
    <div className="w-full max-w-md mx-auto p-6">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Plus className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-primary neon-glow">Create Your Doom Chamber</CardTitle>
          <p className="text-sm text-muted-foreground">
            {modeLabels[selectedMode]} • {difficultyLabels[selectedDifficulty]} Mode
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="playerName">Your Name</Label>
            <Input
              id="playerName"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              data-testid="input-player-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roomCode">Room Code (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="roomCode"
                placeholder="Auto-generated"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                data-testid="input-room-code"
              />
              {!roomCode && (
                <Button 
                  variant="outline" 
                  onClick={() => setRoomCode(generateRoomCode())}
                  data-testid="button-generate-code"
                >
                  Generate
                </Button>
              )}
              {roomCode && (
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={copyRoomCode}
                  data-testid="button-copy-code"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </div>

          <Button 
            className="w-full" 
            onClick={handleCreateRoom}
            disabled={!playerName.trim() || isCreating}
            data-testid="button-create-room"
          >
            {isCreating ? "Creating Room..." : "Create Room"}
          </Button>

          <div className="text-xs text-center text-muted-foreground">
            Share the room code with your friends to let them join!
          </div>
        </CardContent>
      </Card>
    </div>
  );
}