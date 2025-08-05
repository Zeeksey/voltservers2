import PromoBanner from "@/components/promo-banner";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import LiveChat from "@/components/live-chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Server,
  Users,
  Cpu,
  HardDrive,
  Wifi,
  Shield,
  Clock,
  CheckCircle,
  Star,
  Gift,
  Gamepad2,
  Code,
  Database,
  Wrench,
  Target,
  MonitorSpeaker,
  MousePointer,
  Layers,
  Package,
  Globe,
  Zap,
  Download,
  Settings,
  Play,
  Crown,
  ArrowRight,
  ChevronRight,
  Heart,
  Award
} from "lucide-react";

export default function MinecraftHostingPage() {
  const pricingPlans = [
    {
      name: "Budget",
      price: "2.99",
      description: "Perfect for small groups with few plugins",
      features: [
        "1GB RAM",
        "Unlimited player slots",
        "Unlimited SSD storage",
        "Free subdomain",
        "DDoS protection",
        "24/7 support"
      ],
      recommended: false,
      popular: false
    },
    {
      name: "Starter",
      price: "5.99",
      description: "Great for friends and small communities",
      features: [
        "2GB RAM",
        "Unlimited player slots",
        "Unlimited SSD storage",
        "Free subdomain",
        "DDoS protection",
        "Priority support"
      ],
      recommended: false,
      popular: false
    },
    {
      name: "Premium",
      price: "9.99",
      description: "Recommended for modpacks and plugins",
      features: [
        "4GB RAM",
        "Unlimited player slots",
        "Unlimited SSD storage",
        "Free subdomain",
        "DDoS protection",
        "Priority support",
        "Advanced control panel"
      ],
      recommended: true,
      popular: true
    },
    {
      name: "Extreme",
      price: "19.99",
      description: "For large servers with many plugins",
      features: [
        "8GB RAM",
        "Unlimited player slots",
        "Unlimited SSD storage",
        "Free subdomain",
        "DDoS protection",
        "Premium support",
        "Dedicated IP",
        "Custom JAR support"
      ],
      recommended: false,
      popular: false
    }
  ];

  const controlPanelFeatures = [
    {
      icon: <MonitorSpeaker className="w-8 h-8 text-gaming-green" />,
      title: "Smooth Instant Console",
      description: "Real-time console with message highlighting and log sharing capabilities"
    },
    {
      icon: <Package className="w-8 h-8 text-gaming-green" />,
      title: "One-Click Modpack Installer",
      description: "2000+ modpacks available with instant installation from CurseForge"
    },
    {
      icon: <Layers className="w-8 h-8 text-gaming-green" />,
      title: "Server Instances",
      description: "Swap between different server configurations instantly"
    },
    {
      icon: <Database className="w-8 h-8 text-gaming-green" />,
      title: "Built-in File Manager",
      description: "Upload, download, and edit files directly from your browser"
    },
    {
      icon: <Shield className="w-8 h-8 text-gaming-green" />,
      title: "Automatic Backups",
      description: "Scheduled backups with one-click restore functionality"
    },
    {
      icon: <Wrench className="w-8 h-8 text-gaming-green" />,
      title: "Plugin Manager",
      description: "Browse and install plugins with advanced filtering options"
    }
  ];

  const serverTypes = [
    {
      name: "Vanilla",
      icon: <Gamepad2 className="w-6 h-6" />,
      description: "Pure Minecraft experience"
    },
    {
      name: "Paper",
      icon: <Code className="w-6 h-6" />,
      description: "Optimized for performance"
    },
    {
      name: "Forge",
      icon: <Wrench className="w-6 h-6" />,
      description: "For modded servers"
    },
    {
      name: "Fabric",
      icon: <Layers className="w-6 h-6" />,
      description: "Lightweight modding"
    },
    {
      name: "Bedrock",
      icon: <Globe className="w-6 h-6" />,
      description: "Cross-platform play"
    },
    {
      name: "Custom",
      icon: <Settings className="w-6 h-6" />,
      description: "Upload your own JAR"
    }
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-gaming-green" />,
      title: "Instant Setup",
      description: "Your server is ready in under 60 seconds"
    },
    {
      icon: <Shield className="w-6 h-6 text-gaming-green" />,
      title: "DDoS Protection",
      description: "Enterprise-grade protection included"
    },
    {
      icon: <Globe className="w-6 h-6 text-gaming-green" />,
      title: "Global Locations",
      description: "15+ server locations worldwide"
    },
    {
      icon: <Clock className="w-6 h-6 text-gaming-green" />,
      title: "99.9% Uptime",
      description: "Guaranteed uptime with SLA"
    },
    {
      icon: <Users className="w-6 h-6 text-gaming-green" />,
      title: "24/7 Support",
      description: "Expert support team always available"
    },
    {
      icon: <HardDrive className="w-6 h-6 text-gaming-green" />,
      title: "NVMe SSD Storage",
      description: "Lightning-fast storage performance"
    }
  ];

  const testimonials = [
    {
      name: "Alex M.",
      rating: 5,
      text: "Best Minecraft hosting I've used. The control panel is amazing and support is super helpful!",
      verified: true
    },
    {
      name: "Sarah K.",
      rating: 5,
      text: "Server runs perfectly with 50+ players. No lag whatsoever. Highly recommend!",
      verified: true
    },
    {
      name: "Mike R.",
      rating: 5,
      text: "Setup was literally under a minute. The one-click modpack installer is a game changer.",
      verified: true
    }
  ];

  return (
    <div className="min-h-screen bg-gaming-black">
      <title>Minecraft Server Hosting - GameHost Pro | Starting at $2.99/mo</title>
      <meta name="description" content="Best Minecraft server hosting for Java and Bedrock Edition. Instant setup, DDoS protection, unlimited plugins. 2000+ modpacks available. Starting at $2.99/mo." />
      
      <PromoBanner />
      <Navigation />

      {/* Hero Section */}
      <section className="py-32 bg-gradient-gaming relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-gaming-green/5" 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ff88' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
               }}>
          </div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-gaming-green/20 text-gaming-green border-gaming-green/30 mb-6 text-lg px-4 py-2">
              #1 Minecraft Hosting
            </Badge>
            <h1 className="text-6xl font-bold text-gaming-white mb-6">
              The Best <span className="text-gaming-green">Minecraft</span> Server Host
            </h1>
            <p className="text-xl text-gaming-gray mb-4">
              For Java Edition and Bedrock Edition
            </p>
            <p className="text-lg text-gaming-gray mb-8">
              Instant setup • DDoS protection • Starting at $2.99/mo
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black font-semibold text-lg px-8 py-4">
                Get Your Server Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-gaming-green/30 text-gaming-green hover:bg-gaming-green/10 text-lg px-8 py-4">
                View Demo
                <Play className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-gaming-gray">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-gaming-green mr-2" />
                Instant Setup
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-gaming-green mr-2" />
                24/7 Support
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-gaming-green mr-2" />
                99.9% Uptime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gaming-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">
              Choose Your <span className="text-gaming-green">Plan</span>
            </h2>
            <p className="text-xl text-gaming-gray">
              All plans include unlimited player slots and SSD storage
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`bg-gaming-dark border-2 transition-all hover:scale-105 relative ${
                  plan.recommended 
                    ? 'border-gaming-green ring-2 ring-gaming-green/20' 
                    : 'border-gaming-green/20 hover:border-gaming-green/40'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gaming-green text-gaming-black font-semibold px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                {plan.recommended && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-blue-500 text-white font-semibold px-3 py-1">
                      Recommended
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-gaming-white text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gaming-green">${plan.price}</span>
                    <span className="text-gaming-gray">/month</span>
                  </div>
                  <p className="text-gaming-gray text-sm mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gaming-gray">
                        <CheckCircle className="w-4 h-4 text-gaming-green mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full font-semibold ${
                      plan.recommended 
                        ? 'bg-gaming-green hover:bg-gaming-green-dark text-gaming-black' 
                        : 'bg-gaming-dark border border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-gaming-black'
                    }`}
                    variant={plan.recommended ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Control Panel 2.0 Section */}
      <section className="py-20 bg-gaming-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-gaming-green/20 text-gaming-green border-gaming-green/30 mb-4">
              Control Panel 2.0
            </Badge>
            <h2 className="text-4xl font-bold text-gaming-white mb-4">
              Rebuilt From the <span className="text-gaming-green">Ground Up</span>
            </h2>
            <p className="text-xl text-gaming-gray max-w-3xl mx-auto">
              Our completely redesigned control panel makes server management effortless 
              with powerful features and an intuitive interface.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {controlPanelFeatures.map((feature, index) => (
              <Card key={index} className="bg-gaming-black border-gaming-green/20 hover:border-gaming-green/40 transition-all group">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-gaming-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gaming-gray">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black font-semibold">
              Try the Demo
              <MousePointer className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Server Types */}
      <section className="py-20 bg-gaming-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">
              All Server <span className="text-gaming-green">Types</span> Supported
            </h2>
            <p className="text-xl text-gaming-gray">
              From vanilla to heavily modded - we support them all
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
            {serverTypes.map((type, index) => (
              <Card key={index} className="bg-gaming-dark border-gaming-green/20 hover:border-gaming-green/40 transition-all hover:scale-105 group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3 text-gaming-green group-hover:scale-110 transition-transform">
                    {type.icon}
                  </div>
                  <h3 className="text-gaming-white font-semibold mb-1">{type.name}</h3>
                  <p className="text-gaming-gray text-xs">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gaming-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">
              Why Choose <span className="text-gaming-green">GameHost Pro</span>
            </h2>
            <p className="text-xl text-gaming-gray">
              Everything you need for the perfect Minecraft server
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 bg-gaming-black rounded-lg border border-gaming-green/20 hover:border-gaming-green/40 transition-colors">
                <div className="flex-shrink-0 p-2 bg-gaming-green/20 rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-gaming-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gaming-gray">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gaming-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">
              <span className="text-gaming-green">7,000+</span> Happy Customers
            </h2>
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-gaming-green text-gaming-green" />
              ))}
              <span className="text-gaming-green font-semibold ml-2">5.0 out of 5</span>
            </div>
            <p className="text-xl text-gaming-gray">
              Based on thousands of reviews
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gaming-dark border-gaming-green/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gaming-green text-gaming-green" />
                    ))}
                  </div>
                  <p className="text-gaming-gray mb-4">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gaming-white font-semibold">{testimonial.name}</span>
                    {testimonial.verified && (
                      <Badge className="bg-gaming-green/20 text-gaming-green border-gaming-green/30 text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Money Back Guarantee */}
      <section className="py-20 bg-gradient-to-r from-gaming-green/10 to-gaming-green/5">
        <div className="container mx-auto px-4 text-center">
          <Shield className="w-16 h-16 text-gaming-green mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-gaming-white mb-4">
            3-Day Money Back Guarantee
          </h2>
          <p className="text-xl text-gaming-gray mb-8 max-w-2xl mx-auto">
            Not satisfied? Get a full refund within 3 days, no questions asked. 
            We're confident you'll love our service.
          </p>
          <Button size="lg" className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black font-semibold text-lg px-8 py-4">
            Start Your Server Now
            <Crown className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      <Footer />
      <LiveChat />
    </div>
  );
}