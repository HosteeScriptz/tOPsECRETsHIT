import { useState } from "react";
import GameModeSelector, { GameMode } from "../GameModeSelector";

export default function GameModeSelectorExample() {
  const [selectedMode, setSelectedMode] = useState<GameMode | undefined>();

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    console.log("Selected mode:", mode);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <GameModeSelector 
        selectedMode={selectedMode}
        onModeSelect={handleModeSelect}
      />
    </div>
  );
}