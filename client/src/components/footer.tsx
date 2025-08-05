import { Gamepad2, Twitter, MessageCircle, Youtube, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

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
              <span className="text-2xl font-bold text-gaming-green">VoltServers</span>
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
                onClick={() => window.open('https://twitter.com/voltservers', '_blank')}
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="w-10 h-10 bg-gaming-black text-gaming-gray hover:text-gaming-green hover:bg-gaming-green/10"
                onClick={() => window.open('https://discord.gg/voltservers', '_blank')}
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="w-10 h-10 bg-gaming-black text-gaming-gray hover:text-gaming-green hover:bg-gaming-green/10"
                onClick={() => window.open('https://youtube.com/@voltservers', '_blank')}
              >
                <Youtube className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="w-10 h-10 bg-gaming-black text-gaming-gray hover:text-gaming-green hover:bg-gaming-green/10"
                onClick={() => window.open('https://github.com/voltservers', '_blank')}
              >
                <Github className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="text-gaming-white font-bold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><Link href="/games/minecraft"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer">Minecraft Hosting</span></Link></li>
              <li><Link href="/games/cs2"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer">CS2 Servers</span></Link></li>
              <li><Link href="/games/rust"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer">Rust Hosting</span></Link></li>
              <li><Link href="/games/ark"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer">ARK Servers</span></Link></li>
              <li><Link href="/enterprise"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer">Dedicated Servers</span></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-gaming-white font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer">About Us</span></Link></li>
              <li><Link href="/hardware"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer">Hardware</span></Link></li>
              <li><Link href="/pricing"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer">Pricing</span></Link></li>
              <li><Link href="/support"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer">Support Center</span></Link></li>
              <li><Link href="/status"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer">Server Status</span></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-gaming-white font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/knowledgebase"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer">Knowledge Base</span></Link></li>
              <li><Link href="/contact"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer">Contact Us</span></Link></li>
              <li><Link href="/client-portal"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer">Client Portal</span></Link></li>
              <li><Link href="/minecraft-tools"><span className="text-gaming-gray hover:text-gaming-green transition-colors cursor-pointer">Minecraft Tools</span></Link></li>
              <li><a href="https://discord.gg/voltservers" target="_blank" rel="noopener noreferrer" className="text-gaming-gray hover:text-gaming-green transition-colors">Discord Community</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gaming-black pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gaming-gray text-sm mb-4 md:mb-0">
            © 2025 VoltServers. All rights reserved.
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
