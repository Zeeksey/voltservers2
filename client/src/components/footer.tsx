import { Gamepad2, Twitter, MessageCircle, Youtube, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function Footer() {
  const { data: themeSettings } = useQuery<{
    siteName?: string;
    logoUrl?: string;
  }>({
    queryKey: ['/api/theme-settings'],
    retry: false,
  });

  const siteName = themeSettings?.siteName || "VoltServers";
  const logoUrl = themeSettings?.logoUrl;
  return (
    <footer id="support" className="bg-gaming-black-lighter py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8 mb-8 lg:mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4 lg:mb-6">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={siteName} 
                  className="h-12 max-w-40 object-contain"
                />
              ) : (
                <>
                  <div className="w-10 h-10 bg-gradient-green rounded-lg flex items-center justify-center">
                    <Gamepad2 className="text-gaming-black text-xl" />
                  </div>
                  <span className="text-xl lg:text-2xl font-bold text-gaming-green">{siteName}</span>
                </>
              )}
            </div>
            <p className="text-gaming-gray mb-6 text-sm lg:text-base leading-relaxed">
              The premier game server hosting platform trusted by thousands of gaming communities worldwide. 
              Experience the difference with enterprise-grade infrastructure.
            </p>
            <div className="flex space-x-3">
              <Button 
                variant="ghost" 
                size="icon"
                className="w-10 h-10 bg-gaming-black text-gaming-gray hover:text-gaming-green hover:bg-gaming-green/10 transition-all duration-200"
                onClick={() => window.open('https://twitter.com/voltservers', '_blank')}
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="w-10 h-10 bg-gaming-black text-gaming-gray hover:text-gaming-green hover:bg-gaming-green/10 transition-all duration-200"
                onClick={() => window.open('https://discord.gg/voltservers', '_blank')}
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="w-10 h-10 bg-gaming-black text-gaming-gray hover:text-gaming-green hover:bg-gaming-green/10 transition-all duration-200"
                onClick={() => window.open('https://youtube.com/@voltservers', '_blank')}
              >
                <Youtube className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="w-10 h-10 bg-gaming-black text-gaming-gray hover:text-gaming-green hover:bg-gaming-green/10 transition-all duration-200"
                onClick={() => window.open('https://github.com/voltservers', '_blank')}
              >
                <Github className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-gaming-white font-bold mb-4 text-base lg:text-lg">Services</h4>
            <ul className="space-y-2 lg:space-y-3">
              <li><Link href="/games/minecraft"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer text-sm lg:text-base">Minecraft Hosting</span></Link></li>
              <li><Link href="/games/cs2"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer text-sm lg:text-base">CS2 Servers</span></Link></li>
              <li><Link href="/games/rust"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer text-sm lg:text-base">Rust Hosting</span></Link></li>
              <li><Link href="/games/ark"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer text-sm lg:text-base">ARK Servers</span></Link></li>
              <li><Link href="/enterprise"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer text-sm lg:text-base">Dedicated Servers</span></Link></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="text-gaming-white font-bold mb-4 text-base lg:text-lg">Company</h4>
            <ul className="space-y-2 lg:space-y-3">
              <li><Link href="/about"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer text-sm lg:text-base">About Us</span></Link></li>
              <li><Link href="/hardware"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer text-sm lg:text-base">Hardware</span></Link></li>
              <li><Link href="/pricing"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer text-sm lg:text-base">Pricing</span></Link></li>
              <li><Link href="/support"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer text-sm lg:text-base">Support Center</span></Link></li>
              <li><Link href="/status"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer text-sm lg:text-base">Server Status</span></Link></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="text-gaming-white font-bold mb-4 text-base lg:text-lg">Resources</h4>
            <ul className="space-y-2 lg:space-y-3">
              <li><Link href="/knowledgebase"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer text-sm lg:text-base">Knowledge Base</span></Link></li>
              <li><Link href="/contact"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer text-sm lg:text-base">Contact Us</span></Link></li>
              <li><Link href="/client-portal"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer text-sm lg:text-base">Client Portal</span></Link></li>
              <li><Link href="/minecraft-tools"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer text-sm lg:text-base">Minecraft Tools</span></Link></li>
              <li><a href="https://discord.gg/voltservers" target="_blank" rel="noopener noreferrer" className="text-gaming-gray hover:text-gaming-green transition-colors text-sm lg:text-base">Discord Community</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gaming-green/10 pt-6 lg:pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-gaming-gray text-sm">
            © 2025 VoltServers. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center sm:justify-end space-x-4 lg:space-x-6 text-sm">
            <a href="#" className="text-gaming-gray hover:text-gaming-green transition-colors">Privacy Policy</a>
            <a href="#" className="text-gaming-gray hover:text-gaming-green transition-colors">Terms of Service</a>
            <a href="#" className="text-gaming-gray hover:text-gaming-green transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
