import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, Clock, Shield } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-gaming-green/10 via-gaming-black to-gaming-green/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="inline-flex items-center px-4 py-2 bg-gaming-green/20 border border-gaming-green/30 text-gaming-green mb-8">
            <Clock className="mr-2 w-4 h-4" />
            Limited Time: 30% Off First Month
          </Badge>
          
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            Ready to <span className="text-gaming-green">Level Up</span><br />
            Your Game Server?
          </h2>
          
          <p className="text-xl text-gaming-gray mb-8 max-w-2xl mx-auto">
            Join over 50,000 players worldwide. Get your game server online in under 60 seconds 
            with our enterprise-grade infrastructure and 24/7 expert support.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              className="bg-gradient-green text-gaming-black px-8 py-4 text-lg font-bold hover:shadow-xl hover:shadow-gaming-green/30 animate-glow"
              size="lg"
            >
              <Rocket className="mr-2" />
              Start Your Server Now
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-gaming-green text-gaming-green px-8 py-4 text-lg font-bold hover:bg-gaming-green hover:text-gaming-black"
              size="lg"
            >
              View Live Demo
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gaming-gray">
            <div className="flex items-center gap-2">
              <Shield className="text-gaming-green w-5 h-5" />
              <span>99.9% Uptime SLA</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-gaming-green w-5 h-5" />
              <span>Instant Setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket className="text-gaming-green w-5 h-5" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}