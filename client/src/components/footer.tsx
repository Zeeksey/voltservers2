import { Gamepad2, Twitter, MessageCircle, Youtube, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer id="support" className="bg-gaming-black-lighter py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-green rounded-lg flex items-center justify-center">
                <Gamepad2 className="text-gaming-black text-xl" />
              </div>
              <span className="text-2xl font-bold text-gaming-green">GameHost Pro</span>
            </div>
            <p className="text-gaming-gray mb-6 max-w-md">
              The premier game server hosting platform trusted by thousands of gaming communities worldwide. 
              Experience the difference with enterprise-grade infrastructure.
            </p>
            <div className="flex space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                className="w-10 h-10 bg-gaming-black text-gaming-gray hover:text-gaming-green hover:bg-gaming-green/10"
                onClick={() => window.open('https://twitter.com/gamehostpro', '_blank')}
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="w-10 h-10 bg-gaming-black text-gaming-gray hover:text-gaming-green hover:bg-gaming-green/10"
                onClick={() => window.open('https://discord.gg/gamehostpro', '_blank')}
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="w-10 h-10 bg-gaming-black text-gaming-gray hover:text-gaming-green hover:bg-gaming-green/10"
                onClick={() => window.open('https://youtube.com/@gamehostpro', '_blank')}
              >
                <Youtube className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="w-10 h-10 bg-gaming-black text-gaming-gray hover:text-gaming-green hover:bg-gaming-green/10"
                onClick={() => window.open('https://github.com/gamehostpro', '_blank')}
              >
                <Github className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="text-gaming-white font-bold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gaming-gray hover:text-gaming-green transition-colors">Minecraft Hosting</a></li>
              <li><a href="#" className="text-gaming-gray hover:text-gaming-green transition-colors">CS2 Servers</a></li>
              <li><a href="#" className="text-gaming-gray hover:text-gaming-green transition-colors">Rust Hosting</a></li>
              <li><a href="#" className="text-gaming-gray hover:text-gaming-green transition-colors">ARK Servers</a></li>
              <li><a href="#" className="text-gaming-gray hover:text-gaming-green transition-colors">Dedicated Servers</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-gaming-white font-bold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gaming-gray hover:text-gaming-green transition-colors">Knowledge Base</a></li>
              <li><a href="#" className="text-gaming-gray hover:text-gaming-green transition-colors">Submit Ticket</a></li>
              <li><a href="#" className="text-gaming-gray hover:text-gaming-green transition-colors">Live Chat</a></li>
              <li><a href="#" className="text-gaming-gray hover:text-gaming-green transition-colors">Server Status</a></li>
              <li><a href="#" className="text-gaming-gray hover:text-gaming-green transition-colors">Community Forum</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gaming-black pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gaming-gray text-sm mb-4 md:mb-0">
            © 2025 GameHost Pro. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gaming-gray hover:text-gaming-green transition-colors">Privacy Policy</a>
            <a href="#" className="text-gaming-gray hover:text-gaming-green transition-colors">Terms of Service</a>
            <a href="#" className="text-gaming-gray hover:text-gaming-green transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
