import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Loader2 } from "lucide-react";

interface GameRoomJoinerProps {
  onJoinRoom: (playerName: string, roomCode: string) => void;
}

export default function GameRoomJoiner({ onJoinRoom }: GameRoomJoinerProps) {
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
    <div className="w-full max-w-md mx-auto p-6">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Users className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-primary neon-glow">Enter the Darkness</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter the room code to join an existing game
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="joinPlayerName">Your Name</Label>
            <Input
              id="joinPlayerName"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              data-testid="input-join-player-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="joinRoomCode">Room Code</Label>
            <Input
              id="joinRoomCode"
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={6}
              data-testid="input-join-room-code"
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded" data-testid="text-error">
              {error}
            </div>
          )}

          <Button 
            className="w-full" 
            onClick={handleJoinRoom}
            disabled={!playerName.trim() || !roomCode.trim() || isJoining}
            data-testid="button-join-room"
          >
            {isJoining ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Joining Room...
              </>
            ) : (
              "Join Room"
            )}
          </Button>

          <div className="text-xs text-center text-muted-foreground">
            Ask the room creator for the 6-digit room code
          </div>
        </CardContent>
      </Card>
    </div>
  );
}