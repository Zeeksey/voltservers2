import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Home, ArrowLeft, Zap } from "lucide-react";

export default function NotFoundPage() {
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
                className="h-16 max-w-32 object-contain"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-green rounded-lg flex items-center justify-center">
                <Zap className="text-gaming-black text-2xl" />
              </div>
            )}
          </div>

          {/* 404 Icon */}
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-red-500" />
          </div>

          {/* Title */}
          <h1 className="text-6xl font-bold text-gaming-green mb-4">
            404
          </h1>

          {/* Subtitle */}
          <h2 className="text-xl font-semibold text-gaming-white mb-4">
            Page Not Found
          </h2>

          {/* Message */}
          <p className="text-gaming-gray mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/">
              <Button className="bg-gaming-green text-gaming-black hover:bg-gaming-green/90 w-full">
                <Home className="w-4 h-4 mr-2" />
                Go to Homepage
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-gaming-black w-full"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Help Links */}
          <div className="mt-6 pt-6 border-t border-gaming-green/20">
            <p className="text-gaming-gray text-sm mb-3">Need help?</p>
            <div className="flex justify-center space-x-4 text-xs">
              <Link href="/games">
                <span className="text-gaming-green hover:underline cursor-pointer">
                  Browse Games
                </span>
              </Link>
              <Link href="/support">
                <span className="text-gaming-green hover:underline cursor-pointer">
                  Support
                </span>
              </Link>
              <Link href="/status">
                <span className="text-gaming-green hover:underline cursor-pointer">
                  Status
                </span>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}