import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import GameModeSelector, { GameMode } from "@/components/GameModeSelector";
import DifficultySelector, { DifficultyLevel } from "@/components/DifficultySelector";
import GameRoomCreator from "@/components/GameRoomCreator";
import GameRoomJoiner from "@/components/GameRoomJoiner";
import QuickJoin from "@/components/QuickJoin";
import AgeVerification from "@/components/AgeVerification";
import { Zap, Users, Plus } from "lucide-react";

type GameStep = "setup" | "create" | "join";

export default function HomePage() {
  const [selectedMode, setSelectedMode] = useState<GameMode | undefined>();
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | undefined>();
  const [gameStep, setGameStep] = useState<GameStep>("setup");
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState(false);

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    console.log("Selected mode:", mode);
  };

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    setSelectedDifficulty(difficulty);
    console.log("Selected difficulty:", difficulty);
    
    // Show age verification for medium/extreme modes
    if ((difficulty === "medium" || difficulty === "extreme") && !isAgeVerified) {
      setShowAgeVerification(true);
    }
  };

  const handleAgeVerification = (verified: boolean) => {
    setIsAgeVerified(verified);
    setShowAgeVerification(false);
    
    if (!verified) {
      // Reset to easy mode if age verification fails
      setSelectedDifficulty("easy");
    }
  };

  const handleCreateRoom = (playerName: string, roomCode: string) => {
    console.log("Navigating to game room:", { playerName, roomCode, selectedMode, selectedDifficulty });
    // Navigate to the game page with the room code
    window.location.href = `/game/${roomCode}?playerName=${encodeURIComponent(playerName)}&host=true`;
  };

  const handleJoinRoom = (playerName: string, roomCode: string) => {
    console.log("Joining existing room:", { playerName, roomCode });
    // Navigate to the game page with the room code
    window.location.href = `/game/${roomCode}?playerName=${encodeURIComponent(playerName)}&host=false`;
  };

  const canProceed = selectedMode && selectedDifficulty && 
    (selectedDifficulty === "easy" || isAgeVerified);

  if (gameStep === "create") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            onClick={() => setGameStep("setup")}
            className="mb-4"
            data-testid="button-back"
          >
            ← Back to Setup
          </Button>
          <GameRoomCreator
            selectedMode={selectedMode!}
            selectedDifficulty={selectedDifficulty!}
            onCreateRoom={handleCreateRoom}
          />
        </div>
      </div>
    );
  }

  if (gameStep === "join") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            onClick={() => setGameStep("setup")}
            className="mb-4"
            data-testid="button-back"
          >
            ← Back to Setup
          </Button>
          <GameRoomJoiner onJoinRoom={handleJoinRoom} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Zap className="w-10 h-10 text-primary neon-glow animate-neon-pulse" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-chart-2 bg-clip-text text-transparent animate-float">
              Game of Doom
            </h1>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4 neon-glow">
            Truth or Dare
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Enter the ultimate party experience. Dark, thrilling, and dangerously fun.
            <br />
            <span className="text-accent">Dare to play?</span>
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <Badge variant="outline" className="gap-1 border-primary text-primary neon-glow">
              <Users className="w-3 h-3" />
              Multiplayer
            </Badge>
            <Badge variant="outline" className="border-accent text-accent neon-glow">AI-Generated</Badge>
            <Badge variant="outline" className="border-chart-2 text-chart-2 neon-glow">Real-time</Badge>
          </div>
        </div>

        {/* Quick Join Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <QuickJoin onJoinRoom={handleJoinRoom} />
        </div>

        <div className="text-center mb-8">
          <Separator className="max-w-xs mx-auto" />
          <p className="text-muted-foreground text-sm mt-4">or create a new game</p>
        </div>

        {/* Game Setup */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Mode Selection */}
          <GameModeSelector
            selectedMode={selectedMode}
            onModeSelect={handleModeSelect}
          />

          {selectedMode && (
            <>
              <Separator />
              {/* Difficulty Selection */}
              <DifficultySelector
                selectedDifficulty={selectedDifficulty}
                onDifficultySelect={handleDifficultySelect}
              />
            </>
          )}

          {canProceed && (
            <>
              <Separator />
              {/* Action Buttons */}
              <Card className="p-6">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-semibold">Ready to Play?</h3>
                  <p className="text-muted-foreground">
                    Create a new room or join an existing one
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                    <Button 
                      className="flex items-center gap-2"
                      onClick={() => setGameStep("create")}
                      data-testid="button-create-room"
                    >
                      <Plus className="w-4 h-4" />
                      Create Room
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => setGameStep("join")}
                      data-testid="button-join-room"
                    >
                      <Users className="w-4 h-4" />
                      Join Room
                    </Button>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>

        {/* Age Verification Modal */}
        <AgeVerification
          isOpen={showAgeVerification}
          difficulty={selectedDifficulty === "extreme" ? "extreme" : "medium"}
          onVerify={handleAgeVerification}
        />
      </div>
    </div>
  );
}