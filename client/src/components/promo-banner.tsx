import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Zap, Copy, Check } from "lucide-react";

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const promoCode = "NEWGAMER25";

  const handleCopy = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-green text-gaming-black py-3 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gaming-green opacity-90" />
      <div className="relative container mx-auto flex items-center justify-center text-center">
        <div className="flex items-center space-x-4">
          <Zap className="text-gaming-black animate-pulse" />
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm sm:text-base">
              🎮 New Year Special: Get 25% OFF your first month! Use code 
            </span>
            <div className="bg-gaming-black/20 px-3 py-1 rounded-md flex items-center space-x-2">
              <code className="font-mono font-bold">{promoCode}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="p-1 h-auto text-gaming-black hover:bg-gaming-black/20"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="absolute right-2 p-1 text-gaming-black hover:bg-gaming-black/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}