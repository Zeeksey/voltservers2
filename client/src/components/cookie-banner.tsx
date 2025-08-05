import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Cookie, Settings, Check, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
}

interface CookieSettings {
  showCookieBanner: boolean;
  cookieConsentRequired: boolean;
  cookiePolicyText: string;
  cookiePolicyUrl: string;
  cookieCategories: CookieCategory[];
}

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<Record<string, boolean>>({});

  // Fetch theme settings to get cookie configuration
  const { data: themeSettings } = useQuery<any>({
    queryKey: ["/api/theme-settings"],
  });

  const cookieSettings: CookieSettings = {
    showCookieBanner: themeSettings?.showCookieBanner ?? true,
    cookieConsentRequired: themeSettings?.cookieConsentRequired ?? true,
    cookiePolicyText: themeSettings?.cookiePolicyText ?? "We use cookies to enhance your experience and analyze site traffic.",
    cookiePolicyUrl: themeSettings?.cookiePolicyUrl ?? "/privacy-policy",
    cookieCategories: themeSettings?.cookieCategories ? 
      (typeof themeSettings.cookieCategories === 'string' ? 
        JSON.parse(themeSettings.cookieCategories) : 
        themeSettings.cookieCategories) : 
      [
        { id: "necessary", name: "Necessary", description: "Essential for website functionality", required: true },
        { id: "analytics", name: "Analytics", description: "Help us understand how visitors use our site", required: false },
        { id: "marketing", name: "Marketing", description: "Used to deliver relevant advertisements", required: false }
      ]
  };

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    const hasConsent = consent !== null;

    if (!hasConsent && cookieSettings.showCookieBanner) {
      setIsVisible(true);
    }

    // Initialize preferences based on existing consent or defaults
    if (hasConsent) {
      try {
        const consentData = JSON.parse(consent);
        setPreferences(consentData);
      } catch (e) {
        // Handle legacy boolean consent
        const initialPrefs: Record<string, boolean> = {};
        cookieSettings.cookieCategories.forEach(category => {
          initialPrefs[category.id] = category.required || consent === 'true';
        });
        setPreferences(initialPrefs);
      }
    } else {
      // Set defaults - required cookies enabled, optional disabled
      const initialPrefs: Record<string, boolean> = {};
      cookieSettings.cookieCategories.forEach(category => {
        initialPrefs[category.id] = category.required;
      });
      setPreferences(initialPrefs);
    }
  }, [cookieSettings.showCookieBanner]);

  const acceptAll = () => {
    const allAccepted: Record<string, boolean> = {};
    cookieSettings.cookieCategories.forEach(category => {
      allAccepted[category.id] = true;
    });
    setPreferences(allAccepted);
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    setIsVisible(false);
    setShowPreferences(false);
    applyConsentSettings(allAccepted);
  };

  const acceptNecessary = () => {
    const necessaryOnly: Record<string, boolean> = {};
    cookieSettings.cookieCategories.forEach(category => {
      necessaryOnly[category.id] = category.required;
    });
    setPreferences(necessaryOnly);
    localStorage.setItem('cookie-consent', JSON.stringify(necessaryOnly));
    setIsVisible(false);
    setShowPreferences(false);
    applyConsentSettings(necessaryOnly);
  };

  const savePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    setIsVisible(false);
    setShowPreferences(false);
    applyConsentSettings(preferences);
  };

  const applyConsentSettings = (consent: Record<string, boolean>) => {
    // Apply cookie settings based on user consent
    if (consent.analytics && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
    
    if (consent.marketing) {
      // Enable marketing cookies/pixels
      if (window.fbq) {
        window.fbq('consent', 'grant');
      }
    }

    // Trigger a custom event for other scripts to listen to
    window.dispatchEvent(new CustomEvent('cookieConsentUpdate', { 
      detail: consent 
    }));
  };

  const togglePreference = (categoryId: string) => {
    const category = cookieSettings.cookieCategories.find(c => c.id === categoryId);
    if (category?.required) return; // Can't toggle required cookies

    setPreferences(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  if (!isVisible || !cookieSettings.showCookieBanner) {
    return null;
  }

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gaming-black/95 backdrop-blur-sm border-t border-gaming-green/20">
        <Card className="max-w-4xl mx-auto bg-gaming-dark border-gaming-green/30">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Cookie className="w-6 h-6 text-gaming-green flex-shrink-0" />
                <div className="text-sm text-gray-300 leading-relaxed">
                  <p>{cookieSettings.cookiePolicyText}</p>
                  <a 
                    href={cookieSettings.cookiePolicyUrl} 
                    className="text-gaming-green hover:text-gaming-green/80 underline inline-block mt-1"
                  >
                    Learn more
                  </a>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-gaming-green/30 text-gaming-green hover:bg-gaming-green/10 w-full sm:w-auto"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Preferences
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gaming-dark border-gaming-green/20 max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-gaming-green flex items-center gap-2">
                        <Cookie className="w-5 h-5" />
                        Cookie Preferences
                      </DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Choose which cookies you want to allow. Required cookies are necessary for the website to function.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      {cookieSettings.cookieCategories.map((category) => (
                        <div 
                          key={category.id} 
                          className="flex items-start justify-between p-4 rounded-lg bg-gaming-black/50 border border-gaming-green/10"
                        >
                          <div className="flex-1 pr-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Label className="font-medium text-gaming-white">
                                {category.name}
                              </Label>
                              {category.required && (
                                <Badge variant="secondary" className="text-xs">
                                  Required
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed">
                              {category.description}
                            </p>
                          </div>
                          <Switch
                            checked={preferences[category.id] || false}
                            onCheckedChange={() => togglePreference(category.id)}
                            disabled={category.required}
                            className="mt-1"
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gaming-green/10">
                      <Button 
                        onClick={acceptAll}
                        className="bg-gaming-green hover:bg-gaming-green/90 text-gaming-black flex-1"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Accept All
                      </Button>
                      <Button 
                        onClick={savePreferences}
                        variant="outline"
                        className="border-gaming-green/30 text-gaming-green hover:bg-gaming-green/10 flex-1"
                      >
                        Save Preferences
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  onClick={acceptNecessary}
                  variant="outline" 
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 w-full sm:w-auto"
                >
                  <X className="w-4 h-4 mr-2" />
                  Necessary Only
                </Button>
                
                <Button 
                  onClick={acceptAll}
                  size="sm"
                  className="bg-gaming-green hover:bg-gaming-green/90 text-gaming-black w-full sm:w-auto"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Accept All
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

// Utility function to check if a specific cookie category is consented
export function hasCookieConsent(category: string): boolean {
  try {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) return false;
    
    const consentData = JSON.parse(consent);
    return consentData[category] === true;
  } catch (e) {
    return false;
  }
}

// Utility function to get all cookie preferences
export function getCookiePreferences(): Record<string, boolean> {
  try {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) return {};
    
    return JSON.parse(consent);
  } catch (e) {
    return {};
  }
}