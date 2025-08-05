import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Zap, 
  Shield, 
  Clock, 
  Star,
  TrendingUp,
  Users,
  Server,
  Globe,
  CheckCircle,
  ArrowRight,
  Play
} from "lucide-react";
import { Link } from "wouter";

export default function ProfessionalHero() {
  const features = [
    { icon: <Zap className="w-5 h-5" />, text: "Deploy in 60 seconds" },
    { icon: <Shield className="w-5 h-5" />, text: "DDoS Protection" },
    { icon: <Clock className="w-5 h-5" />, text: "99.9% Uptime SLA" },
    { icon: <Star className="w-5 h-5" />, text: "24/7 Expert Support" }
  ];

  const trustSignals = [
    { number: "50,000+", label: "Active Servers" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" },
    { number: "15+", label: "Global Locations" }
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gaming-black via-gaming-dark to-gaming-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gaming-green/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gaming-green/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-gaming-green/5 to-transparent rounded-full"></div>
      </div>

      <div className="relative container mx-auto px-4 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Trust Badge */}
            <div className="flex items-center space-x-2">
              <Badge className="bg-gaming-green/20 text-gaming-green border-gaming-green/30 px-3 py-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                #1 Rated Game Hosting
              </Badge>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gaming-green text-gaming-green" />
                ))}
                <span className="text-gaming-gray text-sm ml-2">4.9/5 (2,847 reviews)</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-gaming-white leading-tight">
                Premium Game
                <br />
                <span className="text-gaming-green bg-gradient-to-r from-gaming-green to-green-400 bg-clip-text text-transparent">
                  Server Hosting
                </span>
              </h1>
              <p className="text-xl text-gaming-gray leading-relaxed max-w-lg">
                Deploy high-performance game servers instantly with enterprise-grade infrastructure, 
                DDoS protection, and 24/7 expert support. Starting at just $2.99/month.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 bg-gaming-dark/50 backdrop-blur-sm border border-gaming-green/20 rounded-full px-4 py-2">
                  <span className="text-gaming-green">{feature.icon}</span>
                  <span className="text-gaming-white text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/games">
                <Button size="lg" className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black text-lg px-8 py-4 h-auto group">
                  Get Started Today
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-gaming-green/30 text-gaming-green hover:bg-gaming-green/10 text-lg px-8 py-4 h-auto group"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-4 gap-6 pt-8 border-t border-gaming-green/20">
              {trustSignals.map((signal, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-gaming-green">{signal.number}</div>
                  <div className="text-sm text-gaming-gray">{signal.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            {/* Main Dashboard Preview */}
            <Card className="bg-gaming-dark/80 backdrop-blur-sm border-gaming-green/20 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">Online</Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gaming-white font-medium">Minecraft Server #1</span>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gaming-green" />
                      <span className="text-gaming-green">24/50</span>
                    </div>
                  </div>
                  
                  <div className="bg-gaming-black/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gaming-gray text-sm">CPU Usage</span>
                      <span className="text-gaming-green text-sm">23%</span>
                    </div>
                    <div className="w-full bg-gaming-black rounded-full h-2">
                      <div className="bg-gradient-to-r from-gaming-green to-green-400 h-2 rounded-full" style={{width: '23%'}}></div>
                    </div>
                  </div>

                  <div className="bg-gaming-black/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gaming-gray text-sm">RAM Usage</span>
                      <span className="text-gaming-green text-sm">1.2GB / 4GB</span>
                    </div>
                    <div className="w-full bg-gaming-black rounded-full h-2">
                      <div className="bg-gradient-to-r from-gaming-green to-green-400 h-2 rounded-full" style={{width: '30%'}}></div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black flex-1">
                      Start
                    </Button>
                    <Button size="sm" variant="outline" className="border-gaming-green/30 text-gaming-green flex-1">
                      Restart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>


          </div>
        </div>

        {/* Bottom Features Bar */}
        <div className="mt-20 grid md:grid-cols-3 gap-6">
          <div className="bg-gaming-dark/30 backdrop-blur-sm border border-gaming-green/20 rounded-lg p-6 text-center group hover:bg-gaming-dark/50 transition-colors">
            <CheckCircle className="w-8 h-8 text-gaming-green mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-gaming-white font-semibold mb-2">Instant Deployment</h3>
            <p className="text-gaming-gray text-sm">Your server will be ready in under 60 seconds</p>
          </div>
          
          <div className="bg-gaming-dark/30 backdrop-blur-sm border border-gaming-green/20 rounded-lg p-6 text-center group hover:bg-gaming-dark/50 transition-colors">
            <Shield className="w-8 h-8 text-gaming-green mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-gaming-white font-semibold mb-2">Enterprise Security</h3>
            <p className="text-gaming-gray text-sm">Advanced DDoS protection and security monitoring</p>
          </div>
          
          <div className="bg-gaming-dark/30 backdrop-blur-sm border border-gaming-green/20 rounded-lg p-6 text-center group hover:bg-gaming-dark/50 transition-colors">
            <Users className="w-8 h-8 text-gaming-green mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-gaming-white font-semibold mb-2">Expert Support</h3>
            <p className="text-gaming-gray text-sm">24/7 support from gaming infrastructure experts</p>
          </div>
        </div>
      </div>
    </section>
  );
}