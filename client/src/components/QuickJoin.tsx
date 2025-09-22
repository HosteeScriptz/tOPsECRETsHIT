import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Loader2 } from "lucide-react";

interface QuickJoinProps {
  onJoinRoom: (playerName: string, roomCode: string) => void;
}

export default function QuickJoin({ onJoinRoom }: QuickJoinProps) {
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState("");

  const handleJoinRoom = async () => {
    if (!playerName.trim() || !roomCode.trim()) {
      setError("Please enter both your name and room code");
      return;
    }
    
    setIsJoining(true);
    setError("");
    
    try {
      // Check if room exists by calling the backend API
      const response = await fetch(`/api/games/${roomCode}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("Room not found. Please check the code and try again.");
        } else {
          setError("Failed to connect to the room. Please try again.");
        }
        setIsJoining(false);
        return;
      }
      
      const gameData = await response.json();
      console.log("Room found:", gameData);
      
      // Proceed to join the room
      onJoinRoom(playerName, roomCode);
    } catch (error) {
      console.error("Error joining room:", error);
      setError("Failed to connect to the room. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Card className="p-4 border-2 border-primary/20 hover:border-primary/40 transition-colors">
      <CardContent className="space-y-4 p-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary">Quick Join</h3>
            <p className="text-sm text-muted-foreground">Jump into an existing game</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="quickJoinName" className="text-xs">Your Name</Label>
            <Input
              id="quickJoinName"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              data-testid="input-quick-join-name"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="quickJoinCode" className="text-xs">Room Code</Label>
            <Input
              id="quickJoinCode"
              placeholder="6-digit code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={6}
              data-testid="input-quick-join-code"
            />
          </div>
        </div>

        {error && (
          <div className="text-xs text-destructive bg-destructive/10 p-2 rounded" data-testid="text-quick-join-error">
            {error}
          </div>
        )}

        <Button 
          className="w-full" 
          onClick={handleJoinRoom}
          disabled={!playerName.trim() || !roomCode.trim() || isJoining}
          data-testid="button-quick-join"
        >
          {isJoining ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Joining...
            </>
          ) : (
            <>
              <Users className="w-4 h-4 mr-2" />
              Join Game
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
