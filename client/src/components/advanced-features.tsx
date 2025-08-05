import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, Database, Globe, HeadphonesIcon, Cpu, HardDrive, Network } from "lucide-react";

export default function AdvancedFeatures() {
  const features = [
    {
      icon: Shield,
      title: "Enterprise DDoS Protection",
      description: "Multi-layered protection against attacks up to 1.2 Tbps with automatic mitigation",
      badge: "99.97% Uptime"
    },
    {
      icon: Zap,
      title: "NVMe SSD Storage",
      description: "Lightning-fast NVMe drives with up to 3,500 MB/s read speeds for instant world loading",
      badge: "3.5GB/s Speed"
    },
    {
      icon: Database,
      title: "Automated Backups",
      description: "Daily automated backups with one-click restore. Keep your world safe with 30-day retention",
      badge: "30-Day Retention"
    },
    {
      icon: Globe,
      title: "Global Edge Network",
      description: "15+ worldwide locations with intelligent routing for optimal player connections",
      badge: "15+ Locations"
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Expert Support",
      description: "Gaming specialists available around the clock with average 2-minute response time",
      badge: "2min Response"
    },
    {
      icon: Cpu,
      title: "Latest Hardware",
      description: "Intel Xeon processors and DDR5 RAM for maximum performance and stability",
      badge: "Latest Gen"
    },
    {
      icon: HardDrive,
      title: "Instant Deployment",
      description: "Deploy your server in under 60 seconds with our automated provisioning system",
      badge: "60s Deploy"
    },
    {
      icon: Network,
      title: "Premium Bandwidth",
      description: "Unmetered premium bandwidth with tier-1 providers for lag-free gaming",
      badge: "Unlimited"
    }
  ];

  return (
    <section className="py-20 bg-gaming-black-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gaming-green">Advanced</span> Infrastructure
          </h2>
          <p className="text-xl text-gaming-gray max-w-3xl mx-auto">
            Enterprise-grade infrastructure designed specifically for game servers. 
            Built by gamers, for gamers, with no compromises on performance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="bg-gaming-black-lighter border-gaming-black hover:border-gaming-green/30 transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gaming-green/10 group-hover:bg-gaming-green/20 transition-colors">
                      <IconComponent className="h-6 w-6 text-gaming-green" />
                    </div>
                    <Badge variant="secondary" className="bg-gaming-green/20 text-gaming-green border-gaming-green/30">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-gaming-white text-lg group-hover:text-gaming-green transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gaming-gray text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gaming-green/10 border border-gaming-green/30">
            <Zap className="h-5 w-5 text-gaming-green mr-2" />
            <span className="text-gaming-white font-medium">
              All features included in every plan
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}