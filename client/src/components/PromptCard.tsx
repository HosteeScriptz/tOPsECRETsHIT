import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import type { GamePrompt } from "@shared/schema";

interface PromptCardProps {
  prompt: GamePrompt;
  playerName: string;
  onComplete: () => void;
  onSkip: () => void;
  onNewPrompt?: () => void;
  canGetNewPrompt?: boolean;
  disabled?: boolean;
}

export default function PromptCard({ 
  prompt, 
  playerName, 
  onComplete, 
  onSkip, 
  onNewPrompt,
  canGetNewPrompt = true,
  disabled = false
}: PromptCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`${playerName} completed prompt: ${prompt.text}`);
    onComplete();
    setIsCompleting(false);
  };

  const handleSkip = async () => {
    setIsSkipping(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`${playerName} skipped prompt: ${prompt.text}`);
    onSkip();
    setIsSkipping(false);
  };

  const handleNewPrompt = () => {
    console.log(`${playerName} requested new prompt`);
    onNewPrompt?.();
  };

  const typeColors = {
    truth: "bg-blue-100 text-blue-700 border-blue-300",
    dare: "bg-red-100 text-red-700 border-red-300"
  };

  const difficultyColors = {
    easy: "bg-green-500",
    medium: "bg-orange-500", 
    extreme: "bg-red-500"
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <Card className="relative overflow-hidden">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3">
                <Badge 
                  className={`text-sm font-medium border ${typeColors[prompt.type]}`}
                  data-testid={`badge-type-${prompt.type}`}
                >
                  {prompt.type.toUpperCase()}
                </Badge>
                <Badge 
                  className={`text-white ${difficultyColors[prompt.difficulty]}`}
                  data-testid={`badge-difficulty-${prompt.difficulty}`}
                >
                  {prompt.difficulty.charAt(0).toUpperCase() + prompt.difficulty.slice(1)}
                </Badge>
              </div>
              <h2 className="text-lg font-medium text-muted-foreground">
                {playerName}, it's your turn!
              </h2>
            </div>

            {/* Prompt Text */}
            <div className="bg-muted/30 rounded-lg p-6 min-h-[120px] flex items-center justify-center border border-primary/20 animate-fade-in">
              <p 
                className="text-xl font-medium leading-relaxed text-center text-foreground neon-glow"
                data-testid="text-prompt"
              >
                {prompt.text}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleComplete}
                disabled={disabled || isCompleting || isSkipping}
                className="flex items-center gap-2"
                data-testid="button-complete"
              >
                {isCompleting ? (
                  <>Completing...</>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    I Did It! (+1 point)
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleSkip}
                disabled={disabled || isCompleting || isSkipping}
                className="flex items-center gap-2"
                data-testid="button-skip"
              >
                {isSkipping ? (
                  <>Skipping...</>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    Skip (-1 point)
                  </>
                )}
              </Button>
              
              {canGetNewPrompt && (
                <Button
                  variant="ghost"
                  onClick={handleNewPrompt}
                  disabled={disabled || isCompleting || isSkipping}
                  className="flex items-center gap-2"
                  data-testid="button-new-prompt"
                >
                  <RotateCcw className="w-4 h-4" />
                  New {prompt.type}
                </Button>
              )}
            </div>

            {/* Helper Text */}
            <p className="text-xs text-muted-foreground">
              Complete the {prompt.type} to gain a point, or skip to lose a point
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}