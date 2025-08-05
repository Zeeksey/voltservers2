import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Star, Server, Users, ArrowRight, GamepadIcon as Gamepad2 } from "lucide-react";
import Footer from "@/components/footer";

const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    price: "$2.99",
    description: "Perfect for small groups of friends",
    features: ["2GB RAM", "Unlimited Slots", "DDoS Protection", "24/7 Support"],
    recommended: false
  },
  {
    id: "pro",
    name: "Pro", 
    price: "$5.99",
    description: "Ideal for growing communities",
    features: ["4GB RAM", "Unlimited Slots", "DDoS Protection", "Priority Support", "Free Subdomain"],
    recommended: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$12.99", 
    description: "For large communities and networks",
    features: ["8GB RAM", "Unlimited Slots", "DDoS Protection", "Dedicated Support", "Custom Domain", "Advanced Monitoring"],
    recommended: false
  }
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gaming-black text-gaming-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-gaming-black via-gaming-black-light to-gaming-black">
        <div className="container mx-auto px-4 text-center">
          <Badge className="bg-gaming-green text-gaming-black text-lg px-4 py-2 mb-8">
            🎉 Save 25% with Annual Plans - 3 Months Free!
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Simple, <span className="text-gaming-green">Transparent</span> Pricing
          </h1>
          <p className="text-xl text-gaming-gray max-w-3xl mx-auto mb-12">
            Choose from our game-optimized hosting plans. All plans include DDoS protection, 
            unlimited bandwidth, and 24/7 support. No hidden fees, no setup costs.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`bg-gaming-black-lighter border-gaming-black-lighter hover:shadow-xl hover:shadow-gaming-green/20 transition-all duration-300 relative ${plan.recommended ? 'border-gaming-green scale-105' : ''}`}>
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gaming-green text-gaming-black">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gaming-white mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold text-gaming-green mb-2">{plan.price}</div>
                    <p className="text-gaming-gray">/month</p>
                  </div>
                  
                  <p className="text-gaming-gray text-center mb-6">{plan.description}</p>
                  
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-gaming-green flex-shrink-0" />
                        <span className="text-gaming-gray">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full font-semibold ${plan.recommended ? 'bg-gaming-green hover:bg-gaming-green-dark text-gaming-black' : 'bg-gaming-black-light hover:bg-gaming-black text-gaming-white border border-gaming-green'}`}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Game-Specific Section */}
      <section className="py-16 bg-gaming-gray-dark/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gaming-white mb-8">Why Game-Specific Plans?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Server className="w-12 h-12 text-gaming-green mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gaming-white mb-2">Optimized Performance</h3>
              <p className="text-gaming-gray">Each plan is tuned for the specific requirements and player loads of different games.</p>
            </div>
            <div className="text-center">
              <Gamepad2 className="w-12 h-12 text-gaming-green mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gaming-white mb-2">Game Features</h3>
              <p className="text-gaming-gray">Plans include game-specific features like mod support, plugins, and specialized tools.</p>
            </div>
            <div className="text-center">
              <ArrowRight className="w-12 h-12 text-gaming-green mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gaming-white mb-2">Fair Pricing</h3>
              <p className="text-gaming-gray">Pay only for what you need based on your game's actual resource requirements.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};