import PromptCard, { GamePrompt } from "../PromptCard";

export default function PromptCardExample() {
  // todo: remove mock functionality
  const mockPrompt: GamePrompt = {
    id: "1",
    type: "dare",
    text: "Act out your most embarrassing moment in vivid detail, including all the cringe-worthy dialogue!",
    difficulty: "medium",
    mode: "friends"
  };

  const handleComplete = () => {
    console.log("Prompt completed! +1 point");
  };

  const handleSkip = () => {
    console.log("Prompt skipped! -1 point");
  };

  const handleNewPrompt = () => {
    console.log("Requesting new prompt...");
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <PromptCard
        prompt={mockPrompt}
        playerName="Alex"
        onComplete={handleComplete}
        onSkip={handleSkip}
        onNewPrompt={handleNewPrompt}
        canGetNewPrompt={true}
      />
    </div>
  );
}