import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield } from "lucide-react";

interface AgeVerificationProps {
  isOpen: boolean;
  difficulty: "medium" | "extreme";
  onVerify: (verified: boolean) => void;
}

export default function AgeVerification({ isOpen, difficulty, onVerify }: AgeVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async (verified: boolean) => {
    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Age verification: ${verified ? "approved" : "denied"} for ${difficulty} mode`);
    onVerify(verified);
    setIsVerifying(false);
  };

  const difficultyInfo = {
    medium: {
      age: "16+",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "This mode contains slightly spicy content that may not be suitable for younger audiences."
    },
    extreme: {
      age: "18+",
      icon: Shield,
      color: "text-red-600", 
      bgColor: "bg-red-50",
      description: "This mode contains adult content and inappropriate material. Only for mature audiences."
    }
  };

  const info = difficultyInfo[difficulty];
  const Icon = info.icon;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onVerify(false)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center">
            <Icon className={`w-6 h-6 ${info.color}`} />
            Age Verification Required
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className={`p-4 rounded-lg ${info.bgColor}`}>
            <div className="text-center space-y-2">
              <div className={`text-3xl font-bold ${info.color}`}>
                {info.age}
              </div>
              <p className="text-sm text-muted-foreground">
                {info.description}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-center text-sm">
              Are you {difficulty === "extreme" ? "18" : "16"} years of age or older?
            </p>
            
            <div className="flex gap-3">
              <Button
                className="flex-1"
                onClick={() => handleVerify(true)}
                disabled={isVerifying}
                data-testid="button-verify-yes"
              >
                {isVerifying ? "Verifying..." : "Yes, I am"}
              </Button>
              
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleVerify(false)}
                disabled={isVerifying}
                data-testid="button-verify-no"
              >
                No, I'm not
              </Button>
            </div>
          </div>

          <div className="text-xs text-center text-muted-foreground">
            By clicking "Yes", you confirm that you meet the minimum age requirement for this content.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}