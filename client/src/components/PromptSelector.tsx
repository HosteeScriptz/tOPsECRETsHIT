import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap } from "lucide-react";

interface PromptSelectorProps {
  playerName: string;
  onSelectType: (type: 'truth' | 'dare') => void;
  disabled?: boolean;
}

export default function PromptSelector({ playerName, onSelectType, disabled = false }: PromptSelectorProps) {
  const handleTruthSelect = () => {
    console.log(`${playerName} selected truth`);
    onSelectType('truth');
  };

  const handleDareSelect = () => {
    console.log(`${playerName} selected dare`);
    onSelectType('dare');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <Card className="relative overflow-hidden">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Header */}
            <div className="space-y-3">
              <h2 className="text-lg font-medium text-muted-foreground">
                {playerName}, it's your turn!
              </h2>
              <h3 className="text-2xl font-bold text-primary neon-glow">
                Choose Your Fate
              </h3>
              <p className="text-muted-foreground">
                Will you reveal the truth or take on a dare?
              </p>
            </div>

            {/* Selection Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              <Button
                onClick={handleTruthSelect}
                disabled={disabled}
                className="h-24 flex flex-col gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                data-testid="button-select-truth"
              >
                <Brain className="w-6 h-6" />
                <span className="text-lg font-semibold">Truth</span>
                <span className="text-xs opacity-80">Reveal a secret</span>
              </Button>
              
              <Button
                onClick={handleDareSelect}
                disabled={disabled}
                className="h-24 flex flex-col gap-2 bg-red-600 hover:bg-red-700 text-white"
                data-testid="button-select-dare"
              >
                <Zap className="w-6 h-6" />
                <span className="text-lg font-semibold">Dare</span>
                <span className="text-xs opacity-80">Take the challenge</span>
              </Button>
            </div>

            {/* Helper Text */}
            <p className="text-xs text-muted-foreground">
              Choose wisely - your fate depends on it!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}