import { useState } from "react";
import DifficultySelector, { DifficultyLevel } from "../DifficultySelector";

export default function DifficultySelectorExample() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | undefined>();

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    setSelectedDifficulty(difficulty);
    console.log("Selected difficulty:", difficulty);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <DifficultySelector 
        selectedDifficulty={selectedDifficulty}
        onDifficultySelect={handleDifficultySelect}
      />
    </div>
  );
}