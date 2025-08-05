import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Gamepad2 } from "lucide-react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [promoBannerVisible, setPromoBannerVisible] = useState(true);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    // Check if promo banner is visible by looking for the element
    const checkPromoBanner = () => {
      const promoBanner = document.querySelector('[data-promo-banner]');
      setPromoBannerVisible(!!promoBanner);
    };

    // Initial check
    checkPromoBanner();

    // Set up observer to watch for banner removal
    const observer = new MutationObserver(checkPromoBanner);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className={`fixed ${promoBannerVisible ? 'top-12' : 'top-0'} left-0 right-0 z-40 glass-effect transition-all duration-300`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-green rounded-lg flex items-center justify-center">
              <Gamepad2 className="text-gaming-black text-xl" />
            </div>
            <span className="text-2xl font-bold text-gaming-green">GameHost Pro</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('games')}
              className="hover:text-gaming-green transition-colors"
            >
              Games
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="hover:text-gaming-green transition-colors"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('tools')}
              className="hover:text-gaming-green transition-colors"
            >
              MC Tools
            </button>
            <button 
              onClick={() => scrollToSection('status')}
              className="hover:text-gaming-green transition-colors"
            >
              Server Status
            </button>
            <button 
              onClick={() => scrollToSection('support')}
              className="hover:text-gaming-green transition-colors"
            >
              Support
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="hidden sm:inline-flex border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-gaming-black"
              onClick={() => window.location.href = '/client-portal'}
            >
              Client Portal
            </Button>
            <Button className="bg-gradient-green text-gaming-black hover:shadow-lg hover:shadow-gaming-green/25">
              Get Started
            </Button>
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
              <button 
                onClick={() => scrollToSection('games')}
                className="text-left hover:text-gaming-green transition-colors"
              >
                Games
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-left hover:text-gaming-green transition-colors"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('tools')}
                className="text-left hover:text-gaming-green transition-colors"
              >
                MC Tools
              </button>
              <button 
                onClick={() => scrollToSection('status')}
                className="text-left hover:text-gaming-green transition-colors"
              >
                Server Status
              </button>
              <button 
                onClick={() => scrollToSection('support')}
                className="text-left hover:text-gaming-green transition-colors"
              >
                Support
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
