import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, AlertTriangle, Flame } from "lucide-react";

export type DifficultyLevel = "easy" | "medium" | "extreme";

interface DifficultySelectorProps {
  selectedDifficulty?: DifficultyLevel;
  onDifficultySelect: (difficulty: DifficultyLevel) => void;
}

export default function DifficultySelector({ selectedDifficulty, onDifficultySelect }: DifficultySelectorProps) {
  const difficulties = [
    {
      id: "easy" as DifficultyLevel,
      title: "Easy",
      description: "Family-friendly and appropriate for all ages",
      icon: ShieldCheck,
      color: "bg-green-500",
      textColor: "text-green-700",
      bgColor: "bg-green-50",
      examples: ["What's your most embarrassing secret?", "Do your worst impression of someone here"]
    },
    {
      id: "medium" as DifficultyLevel,
      title: "Medium",
      description: "Slightly spicy content for mature audiences",
      icon: AlertTriangle,
      color: "bg-orange-500",
      textColor: "text-orange-700",
      bgColor: "bg-orange-50",
      examples: ["Confess your darkest fantasy", "Send a risky text to your ex"]
    },
    {
      id: "extreme" as DifficultyLevel,
      title: "Extreme",
      description: "Adults only - inappropriate and daring content",
      icon: Flame,
      color: "bg-red-500",
      textColor: "text-red-700",
      bgColor: "bg-red-50",
      examples: ["Reveal your most forbidden desire", "Strip down to your underwear"]
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 text-primary neon-glow">Choose Your Intensity</h2>
        <p className="text-muted-foreground">How far into the darkness will you venture?</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {difficulties.map((difficulty, index) => {
          const Icon = difficulty.icon;
          const isSelected = selectedDifficulty === difficulty.id;
          
          return (
            <Card
              key={difficulty.id}
              className={`cursor-pointer transition-all duration-500 hover-elevate transform hover:scale-105 animate-slide-in-left ${
                isSelected ? "ring-2 ring-primary shadow-lg neon-glow-strong" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => onDifficultySelect(difficulty.id)}
              data-testid={`card-difficulty-${difficulty.id}`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${difficulty.bgColor}`}>
                      <Icon className={`w-6 h-6 ${difficulty.textColor}`} />
                    </div>
                    <h3 className="text-xl font-semibold">{difficulty.title}</h3>
                  </div>
                  <Badge 
                    className={`${difficulty.color} text-white`}
                    data-testid={`badge-${difficulty.id}`}
                  >
                    {difficulty.id === "extreme" ? "18+" : difficulty.id === "medium" ? "16+" : "All Ages"}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">{difficulty.description}</p>
                
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Examples:</p>
                  {difficulty.examples.map((example, index) => (
                    <p key={index} className="text-xs italic bg-muted p-2 rounded">
                      "{example}"
                    </p>
                  ))}
                </div>
                
                {isSelected && (
                  <Badge variant="default" className="mt-4">Selected</Badge>
                )}
              </div>
            </Card>
          );
        })}
      </div>
      
      {(selectedDifficulty === "medium" || selectedDifficulty === "extreme") && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ Age verification required for this difficulty level
          </p>
        </div>
      )}
    </div>
  );
}