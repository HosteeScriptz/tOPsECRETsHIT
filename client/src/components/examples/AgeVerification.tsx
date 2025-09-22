import { useState } from "react";
import AgeVerification from "../AgeVerification";
import { Button } from "@/components/ui/button";

export default function AgeVerificationExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [difficulty, setDifficulty] = useState<"medium" | "extreme">("medium");

  const handleVerify = (verified: boolean) => {
    console.log(`Age verification result: ${verified}`);
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <div className="space-y-4">
        <Button onClick={() => { setDifficulty("medium"); setIsOpen(true); }}>
          Show Medium Mode Verification (16+)
        </Button>
        <Button onClick={() => { setDifficulty("extreme"); setIsOpen(true); }}>
          Show Extreme Mode Verification (18+)
        </Button>
        
        <AgeVerification
          isOpen={isOpen}
          difficulty={difficulty}
          onVerify={handleVerify}
        />
      </div>
    </div>
  );
}