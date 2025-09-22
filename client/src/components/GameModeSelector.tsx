import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Heart, BellRing } from "lucide-react";

export type GameMode = "friends" | "crush" | "spouse";

interface GameModeSelectorProps {
  selectedMode?: GameMode;
  onModeSelect: (mode: GameMode) => void;
}

export default function GameModeSelector({ selectedMode, onModeSelect }: GameModeSelectorProps) {
  const modes = [
    {
      id: "friends" as GameMode,
      title: "Friends",
      description: "Fun questions for hanging out with your friends",
      icon: Users,
      gradient: "from-blue-500 to-purple-600",
      color: "bg-blue-100 text-blue-700"
    },
    {
      id: "crush" as GameMode,
      title: "With Crush",
      description: "Get to know someone you're interested in",
      icon: Heart,
      gradient: "from-pink-500 to-red-600",
      color: "bg-pink-100 text-pink-700"
    },
    {
      id: "spouse" as GameMode,
      title: "With Spouse",
      description: "Deepen your connection with your partner",
      icon: BellRing,
      gradient: "from-purple-500 to-indigo-600",
      color: "bg-purple-100 text-purple-700"
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 text-primary neon-glow">Choose Your Doom</h2>
        <p className="text-muted-foreground">Select your relationship type for personalized chaos</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modes.map((mode, index) => {
          const Icon = mode.icon;
          const isSelected = selectedMode === mode.id;
          
          return (
            <Card
              key={mode.id}
              className={`relative overflow-hidden cursor-pointer transition-all duration-500 hover-elevate transform hover:scale-105 animate-slide-in-up ${
                isSelected ? "ring-2 ring-primary shadow-lg neon-glow-strong" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => onModeSelect(mode.id)}
              data-testid={`card-mode-${mode.id}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${mode.gradient} opacity-5`} />
              <div className="relative p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${mode.color}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{mode.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{mode.description}</p>
                {isSelected && (
                  <Badge variant="default" className="mt-2">Selected</Badge>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}