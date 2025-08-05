import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

export default function ComparisonSection() {
  const features = [
    { name: "Instant Server Setup", us: true, others: false },
    { name: "99.9% Uptime SLA", us: true, others: false },
    { name: "DDoS Protection Included", us: true, others: "Extra Cost" },
    { name: "24/7 Expert Support", us: true, others: "Business Hours" },
    { name: "Automatic Backups", us: true, others: "Manual Only" },
    { name: "Global Server Locations", us: "8 Locations", others: "Limited" },
    { name: "One-Click Mod Installation", us: true, others: false },
    { name: "Custom Control Panel", us: true, others: "Generic" }
  ];

  return (
    <section className="py-20 bg-gaming-black-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Why Choose <span className="text-gaming-green">GameHost Pro</span>?
          </h2>
          <p className="text-xl text-gaming-gray max-w-3xl mx-auto">
            See how we compare to other hosting providers and why thousands choose us for their game servers.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gaming-black border border-gaming-green/30">
            <CardContent className="p-0">
              <div className="grid grid-cols-3 bg-gaming-black-lighter rounded-t-lg">
                <div className="p-6 text-center">
                  <div className="text-gaming-gray font-semibold">Features</div>
                </div>
                <div className="p-6 text-center border-l border-r border-gaming-green/30">
                  <Badge className="bg-gradient-green text-gaming-black px-4 py-2 font-bold">
                    GameHost Pro
                  </Badge>
                </div>
                <div className="p-6 text-center">
                  <div className="text-gaming-gray font-semibold">Others</div>
                </div>
              </div>
              
              {features.map((feature, index) => (
                <div key={index} className={`grid grid-cols-3 border-t border-gaming-gray/20 ${index % 2 === 0 ? 'bg-gaming-black/50' : ''}`}>
                  <div className="p-4 text-gaming-white font-medium">
                    {feature.name}
                  </div>
                  <div className="p-4 text-center border-l border-r border-gaming-green/30">
                    {typeof feature.us === 'string' ? (
                      <Badge variant="secondary" className="bg-gaming-green/20 text-gaming-green">
                        {feature.us}
                      </Badge>
                    ) : feature.us ? (
                      <Check className="text-gaming-green w-6 h-6 mx-auto" />
                    ) : (
                      <X className="text-red-500 w-6 h-6 mx-auto" />
                    )}
                  </div>
                  <div className="p-4 text-center">
                    {typeof feature.others === 'string' ? (
                      <Badge variant="outline" className="text-gaming-gray border-gaming-gray/30">
                        {feature.others}
                      </Badge>
                    ) : feature.others ? (
                      <Check className="text-gaming-green w-6 h-6 mx-auto" />
                    ) : (
                      <X className="text-red-500 w-6 h-6 mx-auto" />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}