import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, Play, Shield, Clock, Headphones } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-20 pb-16 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-gaming-black via-gaming-black/90 to-gaming-black/70" />
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          <div className="space-y-8">
            <Badge className="inline-flex items-center px-4 py-2 bg-gaming-green/10 border border-gaming-green/20 text-gaming-green">
              <span className="w-2 h-2 bg-gaming-green rounded-full mr-2 animate-pulse-green" />
              99.9% Uptime Guaranteed
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="text-gaming-white">Premium</span><br />
              <span className="text-gaming-green">Game Server</span><br />
              <span className="text-gaming-white">Hosting</span>
            </h1>
            
            <p className="text-xl text-gaming-gray max-w-xl">
              Deploy your game servers in seconds with our cutting-edge infrastructure. 
              From Minecraft to CS2, we've got you covered with enterprise-grade performance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-gradient-green text-gaming-black px-8 py-4 text-lg font-bold hover:shadow-xl hover:shadow-gaming-green/30 animate-glow"
                size="lg"
              >
                <Rocket className="mr-2" />
                Start Now - From $2.99/mo
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-gaming-green text-gaming-green px-8 py-4 text-lg font-bold hover:bg-gaming-green hover:text-gaming-black"
                size="lg"
              >
                <Play className="mr-2" />
                View Demo
              </Button>
            </div>
            
            <div className="flex items-center space-x-8 pt-4">
              <div className="flex items-center space-x-2">
                <Shield className="text-gaming-green text-xl" />
                <span className="text-gaming-gray">DDoS Protection</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="text-gaming-green text-xl" />
                <span className="text-gaming-gray">Instant Setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <Headphones className="text-gaming-green text-xl" />
                <span className="text-gaming-gray">24/7 Support</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Modern gaming setup with server interfaces" 
              className="rounded-2xl shadow-2xl shadow-gaming-green/20 animate-float" 
            />
            <div className="absolute -bottom-6 -right-6 bg-gaming-green text-gaming-black p-4 rounded-xl font-bold shadow-lg">
              <div className="text-2xl">50K+</div>
              <div className="text-sm">Active Servers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
