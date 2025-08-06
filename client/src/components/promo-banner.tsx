import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  
  const { data: promoSettings } = useQuery({
    queryKey: ["/api/promo-settings"],
    retry: false,
  });

  // Don't show if manually closed, not enabled, or no settings
  if (!isVisible || !promoSettings?.isEnabled) return null;

  const handleLinkClick = () => {
    if (promoSettings?.linkUrl) {
      if (promoSettings.linkUrl.startsWith('#')) {
        // Scroll to element
        const element = document.querySelector(promoSettings.linkUrl);
        element?.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Navigate to URL
        window.location.href = promoSettings.linkUrl;
      }
    }
  };

  return (
    <div 
      className="py-3 px-4 relative overflow-hidden w-full" 
      data-promo-banner
      style={{ 
        backgroundColor: promoSettings?.backgroundColor || '#22c55e',
        color: promoSettings?.textColor || '#ffffff'
      }}
    >
      <div className="relative container mx-auto flex items-center justify-center text-center">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-sm sm:text-base">
            {promoSettings?.message || ''}
          </span>
          {promoSettings?.linkText && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLinkClick}
              className="underline p-1 h-auto hover:opacity-80"
              style={{ color: promoSettings?.textColor || '#ffffff' }}
            >
              {promoSettings.linkText}
            </Button>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="absolute right-2 p-1 hover:opacity-80"
          style={{ color: promoSettings?.textColor || '#ffffff' }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}