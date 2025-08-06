import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Home, Clock, Zap } from "lucide-react";

export default function MaintenancePage() {
  const { data: themeSettings } = useQuery({
    queryKey: ['/api/theme-settings']
  });

  const siteName = (themeSettings as any)?.siteName || "VoltServers";
  const logoUrl = (themeSettings as any)?.logoUrl;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gaming-black via-gaming-black-lighter to-gaming-black flex items-center justify-center px-4">
      <Card className="bg-gaming-black-light/90 border-gaming-green/30 backdrop-blur-sm max-w-md w-full text-center">
        <CardContent className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={siteName} 
                className="h-20 max-w-40 object-contain"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-green rounded-lg flex items-center justify-center">
                <Zap className="text-gaming-black text-2xl" />
              </div>
            )}
          </div>

          {/* Maintenance Icon */}
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wrench className="w-10 h-10 text-yellow-500" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gaming-white mb-4">
            Under Maintenance
          </h1>

          {/* Message */}
          <p className="text-gaming-gray mb-6 leading-relaxed">
            We're currently performing scheduled maintenance to improve your experience. 
            We'll be back online shortly.
          </p>

          {/* Estimated Time */}
          <div className="flex items-center justify-center gap-2 mb-6 text-gaming-green">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Expected completion: 30 minutes</span>
          </div>

          {/* Action Button */}
          <Link href="/">
            <Button className="bg-gaming-green text-gaming-black hover:bg-gaming-green/90 w-full">
              <Home className="w-4 h-4 mr-2" />
              Check Again
            </Button>
          </Link>

          {/* Status Link */}
          <p className="text-gaming-gray text-xs mt-4">
            For updates, check our{" "}
            <Link href="/status">
              <span className="text-gaming-green hover:underline cursor-pointer">
                status page
              </span>
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}