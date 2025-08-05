import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap, Gamepad2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface ThemeSettings {
  siteName?: string;
}

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  
  const { data: themeSettings } = useQuery<ThemeSettings>({
    queryKey: ["/api/theme-settings"],
  });

  const scrollToSection = (sectionId: string) => {
    if (location !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };

  const mainNavLinks = [
    { href: "/games", label: "Games" },
    { href: "/pricing", label: "Pricing" },
    { href: "/hardware", label: "Hardware" },
    { href: "/status", label: "Status" },
    { href: "/support", label: "Support" }
  ];

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-gaming-green/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 lg:py-4">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-green rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Zap className="text-gaming-black text-lg lg:text-xl" />
              </div>
              <span className="text-xl lg:text-2xl font-bold text-gaming-green">{themeSettings?.siteName || "VoltServers"}</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {mainNavLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={`text-gaming-white hover:text-gaming-green transition-colors cursor-pointer font-medium px-3 py-2 rounded-md hover:bg-gaming-green/10 ${
                  location === link.href ? 'text-gaming-green bg-gaming-green/10' : ''
                }`}>
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            <Link href="/client-portal">
              <Button 
                variant="outline" 
                size="sm"
                className="hidden sm:inline-flex border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-gaming-black transition-all duration-200"
              >
                Client Portal
              </Button>
            </Link>
            <Link href="/games">
              <Button 
                size="sm"
                className="bg-gradient-green text-gaming-black hover:shadow-lg hover:shadow-gaming-green/25 font-medium px-4 lg:px-6"
              >
                Get Started
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-gaming-green hover:bg-gaming-green/10 w-9 h-9"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gaming-green/20 bg-gaming-black-lighter/95 backdrop-blur-sm">
            <div className="flex flex-col space-y-1">
              {mainNavLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span 
                    className={`block px-4 py-3 text-gaming-white hover:text-gaming-green hover:bg-gaming-green/10 transition-colors cursor-pointer rounded-md ${
                      location === link.href ? 'text-gaming-green bg-gaming-green/10' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              <div className="px-4 py-2 border-t border-gaming-green/10 mt-4">
                <Link href="/knowledgebase">
                  <span className="block py-2 text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer" onClick={() => setIsMenuOpen(false)}>
                    Knowledge Base
                  </span>
                </Link>
                <Link href="/about">
                  <span className="block py-2 text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer" onClick={() => setIsMenuOpen(false)}>
                    About
                  </span>
                </Link>
                <Link href="/contact">
                  <span className="block py-2 text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer" onClick={() => setIsMenuOpen(false)}>
                    Contact
                  </span>
                </Link>
                <div className="pt-2">
                  <Link href="/client-portal">
                    <Button 
                      variant="outline" 
                      className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-gaming-black w-full"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Client Portal
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
