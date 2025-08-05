import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap, Gamepad2 } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

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

  return (
    <nav className="sticky top-0 z-40 glass-effect">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-green rounded-lg flex items-center justify-center">
                <Zap className="text-gaming-black text-xl" />
              </div>
              <span className="text-2xl font-bold text-gaming-green">VoltServers</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/games">
              <span className="hover:text-gaming-green transition-colors cursor-pointer">
                Games
              </span>
            </Link>
            <Link href="/hardware">
              <span className="hover:text-gaming-green transition-colors cursor-pointer">
                Hardware
              </span>
            </Link>
            <Link href="/pricing">
              <span className="hover:text-gaming-green transition-colors cursor-pointer">
                Pricing
              </span>
            </Link>
            <Link href="/knowledgebase">
              <span className="hover:text-gaming-green transition-colors cursor-pointer">
                Knowledge Base
              </span>
            </Link>
            <Link href="/status">
              <span className="hover:text-gaming-green transition-colors cursor-pointer">
                Status
              </span>
            </Link>
            <Link href="/about">
              <span className="hover:text-gaming-green transition-colors cursor-pointer">
                About
              </span>
            </Link>
            <Link href="/support">
              <span className="hover:text-gaming-green transition-colors cursor-pointer">
                Support
              </span>
            </Link>
            <Link href="/contact">
              <span className="hover:text-gaming-green transition-colors cursor-pointer">
                Contact
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/client-portal">
              <Button 
                variant="outline" 
                className="hidden sm:inline-flex border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-gaming-black"
              >
                Client Portal
              </Button>
            </Link>
            <Link href="/games">
              <Button className="bg-gradient-green text-gaming-black hover:shadow-lg hover:shadow-gaming-green/25">
                Get Started
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gaming-green"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gaming-green/20">
            <div className="flex flex-col space-y-4">
              <Link href="/games">
                <span className="text-left hover:text-gaming-green transition-colors cursor-pointer block">
                  Games
                </span>
              </Link>
              <Link href="/hardware">
                <span className="text-left hover:text-gaming-green transition-colors cursor-pointer block">
                  Hardware
                </span>
              </Link>
              <Link href="/pricing">
                <span className="text-left hover:text-gaming-green transition-colors cursor-pointer block">
                  Pricing
                </span>
              </Link>
              <Link href="/knowledgebase">
                <span className="text-left hover:text-gaming-green transition-colors cursor-pointer block">
                  Knowledge Base
                </span>
              </Link>
              <Link href="/status">
                <span className="text-left hover:text-gaming-green transition-colors cursor-pointer block">
                  Status
                </span>
              </Link>
              <Link href="/about">
                <span className="text-left hover:text-gaming-green transition-colors cursor-pointer block">
                  About
                </span>
              </Link>
              <Link href="/support">
                <span className="text-left hover:text-gaming-green transition-colors cursor-pointer block">
                  Support
                </span>
              </Link>
              <Link href="/contact">
                <span className="text-left hover:text-gaming-green transition-colors cursor-pointer block">
                  Contact
                </span>
              </Link>
              <Link href="/client-portal">
                <Button 
                  variant="outline" 
                  className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-gaming-black w-full mt-2"
                >
                  Client Portal
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
