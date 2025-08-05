import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import type { PricingPlan } from "@shared/schema";

export default function PricingSection() {
  const { data: plans, isLoading } = useQuery<PricingPlan[]>({
    queryKey: ['/api/pricing-plans'],
  });

  if (isLoading) {
    return (
      <section id="pricing" className="py-20 bg-gaming-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-gaming-green">Simple</span> Pricing Plans
            </h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gaming-black-lighter rounded-2xl p-8 animate-pulse">
                <div className="h-8 bg-gaming-black rounded mb-4" />
                <div className="h-12 bg-gaming-black rounded mb-6" />
                <div className="space-y-3 mb-8">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="h-4 bg-gaming-black rounded" />
                  ))}
                </div>
                <div className="h-12 bg-gaming-black rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-20 bg-gaming-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gaming-green">Simple</span> Pricing Plans
          </h2>
          <p className="text-xl text-gaming-gray max-w-3xl mx-auto">
            Choose the perfect plan for your gaming community. All plans include DDoS protection, SSD storage, and 24/7 support.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans?.map((plan, index) => (
            <Card 
              key={plan.id} 
              className={`relative ${
                plan.isPopular 
                  ? 'bg-gaming-black-lighter border-2 border-gaming-green transform lg:scale-105' 
                  : 'bg-gaming-black-lighter border border-gaming-black-lighter hover:border-gaming-green/30'
              } transition-all duration-300`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-green text-gaming-black px-6 py-2">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardContent className={`p-8 ${plan.isPopular ? 'pt-12' : ''}`}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gaming-white mb-2">{plan.name}</h3>
                  <p className="text-gaming-gray mb-6">
                    {index === 0 && "Perfect for small communities"}
                    {index === 1 && "Best for growing communities"}
                    {index === 2 && "For large communities"}
                  </p>
                  <div className="text-5xl font-bold text-gaming-green mb-2">${plan.price}</div>
                  <div className="text-gaming-gray">/month</div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.maxPlayers && (
                    <li className="flex items-center">
                      <Check className="text-gaming-green mr-3 h-5 w-5" />
                      <span className={plan.isPopular ? "text-gaming-white" : "text-gaming-gray"}>
                        {plan.maxPlayers === 999999 ? "Unlimited players" : `Up to ${plan.maxPlayers} players`}
                      </span>
                    </li>
                  )}
                  <li className="flex items-center">
                    <Check className="text-gaming-green mr-3 h-5 w-5" />
                    <span className={plan.isPopular ? "text-gaming-white" : "text-gaming-gray"}>
                      {plan.ram}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="text-gaming-green mr-3 h-5 w-5" />
                    <span className={plan.isPopular ? "text-gaming-white" : "text-gaming-gray"}>
                      {plan.storage}
                    </span>
                  </li>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <Check className="text-gaming-green mr-3 h-5 w-5" />
                      <span className={plan.isPopular ? "text-gaming-white" : "text-gaming-gray"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={
                    plan.isPopular 
                      ? "w-full bg-gradient-green text-gaming-black hover:shadow-lg hover:shadow-gaming-green/30" 
                      : "w-full border-2 border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-gaming-black"
                  }
                  variant={plan.isPopular ? "default" : "outline"}
                >
                  Choose {plan.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
