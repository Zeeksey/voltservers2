import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Server, 
  Shield, 
  Zap, 
  Globe, 
  Cpu, 
  HardDrive, 
  Wifi,
  Clock,
  MapPin,
  Activity
} from "lucide-react";
import Navigation from "@/components/navigation";
import PromoBanner from "@/components/promo-banner";
import Footer from "@/components/footer";

export default function HardwarePage() {
  // Primary server specifications - OVH Rise-Game-2
  const primaryServer = {
    name: "Rise-Game-2",
    provider: "OVHcloud",
    processor: "AMD Ryzen 7 5800X",
    cores: "8 cores",
    baseSpeed: "3.8 GHz",
    boostSpeed: "4.7 GHz",
    architecture: "AMD Ryzen 5000 series",
    multithreading: "SMT (Simultaneous Multithreading)",
    cooling: "Water Cooling Technology",
    ddosProtection: "Exclusive Game DDoS Protection",
    traffic: "Unlimited Traffic",
    performance: "26% more performance than previous generation",
    optimizedFor: "Video processing, encoding, virtual gaming platforms"
  };

  const locations = [
    {
      region: "North America",
      locations: [
        { name: "Virginia", ping: "13ms", recommended: true, specs: "OVH Rise-Game-2 (Ryzen 7 5800X @ 4.7 GHz)", score: "4130", cooling: "Water Cooled" },
        { name: "Quebec", ping: "36ms", specs: "OVH Rise-Game-2 (Ryzen 7 5800X @ 4.7 GHz)", score: "4130", cooling: "Water Cooled" },
        { name: "Florida", ping: "42ms", specs: "AMD Ryzen 9 7950X @ Max 5.70 GHz", score: "4266" },
        { name: "Texas", ping: "46ms", specs: "Intel Xeon E-2276G @ Max 4.90 GHz", score: "2880" },
        { name: "California", ping: "86ms", specs: "AMD EPYC 4564P @ Max 5.70 GHz", score: "4266" },
        { name: "Oregon", ping: "91ms", specs: "AMD EPYC 4244P @ Max 5.10 GHz", score: "3858", cooling: "Water Cooled" }
      ]
    },
    {
      region: "Europe",
      locations: [
        { name: "United Kingdom", ping: "86ms", specs: "AMD EPYC 4464P @ Max 5.40 GHz", score: "4130" },
        { name: "Germany", ping: "99ms", specs: "AMD Ryzen 9 7950X @ Max 5.70 GHz", score: "4266" },
        { name: "Netherlands", ping: "102ms", specs: "AMD EPYC 4564P @ Max 5.70 GHz", score: "4266" },
        { name: "France", ping: "97ms", specs: "AMD EPYC 4244P @ Max 5.10 GHz", score: "3858" }
      ]
    },
    {
      region: "Asia Pacific",
      locations: [
        { name: "Australia", ping: "221ms", specs: "AMD EPYC 4464P @ Max 5.40 GHz", score: "4130" },
        { name: "Singapore", ping: "252ms", specs: "AMD Ryzen 9 7950X @ Max 5.70 GHz", score: "4266" },
        { name: "India", ping: "248ms", specs: "AMD EPYC 4564P @ Max 5.70 GHz", score: "4266" }
      ]
    }
  ];

  const features = [
    {
      icon: <Cpu className="w-8 h-8 text-gaming-green" />,
      title: "High Performance CPUs",
      description: "Latest AMD EPYC and Ryzen processors optimized for gaming workloads"
    },
    {
      icon: <HardDrive className="w-8 h-8 text-gaming-green" />,
      title: "NVMe SSD Storage",
      description: "6x faster than SATA SSD with lightning-fast read/write speeds"
    },
    {
      icon: <Shield className="w-8 h-8 text-gaming-green" />,  
      title: "DDoS Protection",
      description: "Built-in protection against attacks, always on and always free"
    },
    {
      icon: <Wifi className="w-8 h-8 text-gaming-green" />,
      title: "High-Speed Network",
      description: "1-10 Gbps network ports for minimal latency and maximum throughput"
    },
    {
      icon: <Zap className="w-8 h-8 text-gaming-green" />,
      title: "DDR5 Memory",
      description: "Latest generation RAM for superior performance and reliability"
    },
    {
      icon: <Activity className="w-8 h-8 text-gaming-green" />,
      title: "99.9% Uptime SLA",
      description: "Guaranteed uptime with network outages covered by our SLA"
    }
  ];

  return (
    <div className="min-h-screen bg-gaming-black">
      <PromoBanner />
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-gaming">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gaming-white mb-6">
              Hardware & <span className="text-gaming-green">Locations</span>
            </h1>
            <p className="text-xl text-gaming-gray mb-8">
              Choose the best location for your server and enjoy fast, reliable performance anywhere in the world.
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black font-semibold"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Check Locations
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-gaming-black"
              >
                View Specs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Server Showcase - OVH Rise-Game-2 */}
      <section className="py-16 px-4 bg-gaming-black-light">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">
              Our Primary Gaming Server
            </h2>
            <p className="text-xl text-gaming-gray">
              OVH Rise-Game-2 - Professional gaming hardware with 26% more performance
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gaming-black border-gaming-green/30 p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gaming-green/10 rounded-lg flex items-center justify-center">
                      <Server className="w-8 h-8 text-gaming-green" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gaming-white">Primary Gaming Server</h3>
                      <p className="text-gaming-gray">High-Performance Gaming Hardware</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Cpu className="w-5 h-5 text-gaming-green" />
                      <span className="text-gaming-white font-medium">Processor:</span>
                      <span className="text-gaming-gray">{primaryServer.processor} ({primaryServer.cores})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gaming-green" />
                      <span className="text-gaming-white font-medium">Speed:</span>
                      <span className="text-gaming-gray">{primaryServer.baseSpeed} base, {primaryServer.boostSpeed} boost</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-gaming-green" />
                      <span className="text-gaming-white font-medium">Technology:</span>
                      <span className="text-gaming-gray">{primaryServer.multithreading}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-gaming-green" />
                      <span className="text-gaming-white font-medium">Cooling:</span>
                      <span className="text-gaming-gray">{primaryServer.cooling}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gaming-white mb-4">Key Features</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-gaming-green mt-0.5" />
                      <div>
                        <p className="text-gaming-white font-medium">{primaryServer.ddosProtection}</p>
                        <p className="text-gaming-gray text-sm">Built-in protection against gaming attacks</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-gaming-green mt-0.5" />
                      <div>
                        <p className="text-gaming-white font-medium">{primaryServer.traffic}</p>
                        <p className="text-gaming-gray text-sm">No bandwidth limitations or overage charges</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Activity className="w-5 h-5 text-gaming-green mt-0.5" />
                      <div>
                        <p className="text-gaming-white font-medium">{primaryServer.performance}</p>
                        <p className="text-gaming-gray text-sm">Optimized for {primaryServer.optimizedFor}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gaming-green/10 rounded-lg border border-gaming-green/30">
                    <p className="text-gaming-green font-semibold text-sm">Performance Boost</p>
                    <p className="text-gaming-white text-lg">Up to 4.7GHz with Boost Mode</p>
                    <p className="text-gaming-gray text-sm">Water cooling ensures consistent performance</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">High Performance Hardware</h2>
            <p className="text-gaming-gray text-lg">All servers use powerful CPUs and fast RAM, built for speed and stability.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gaming-black-lighter border-gaming-black-lighter hover:border-gaming-green/30 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gaming-green/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gaming-white mb-2">{feature.title}</h3>
                  <p className="text-gaming-gray">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Global Coverage */}
      <section className="py-20 bg-gaming-black-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">
              We Serve Customers <span className="text-gaming-green">All Around The World</span>
            </h2>
            <p className="text-gaming-gray text-lg">
              From the US to Europe, Asia, and Australia - we've got servers worldwide so you can play with low ping wherever you are.
            </p>
          </div>

          {locations.map((region, regionIndex) => (
            <div key={regionIndex} className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-2xl font-bold text-gaming-white">{region.region}</h3>
                <Badge className="bg-gaming-green text-gaming-black">{region.locations.length} Locations</Badge>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {region.locations.map((location, index) => (
                  <Card key={index} className={`bg-gaming-black-lighter border-gaming-black-lighter hover:shadow-xl hover:shadow-gaming-green/20 transition-all duration-300 ${location.recommended ? 'border-gaming-green' : ''}`}>
                    {location.recommended && (
                      <div className="bg-gaming-green text-gaming-black text-center py-2 text-sm font-semibold">
                        Recommended
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xl font-bold text-gaming-white">{location.name}</h4>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gaming-green" />
                          <span className="text-gaming-green font-semibold">{location.ping}</span>
                        </div>
                      </div>
                      
                      {location.cooling && (
                        <Badge className="bg-blue-500/20 text-blue-400 mb-3">
                          {location.cooling}
                        </Badge>
                      )}
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-gaming-gray" />
                          <span className="text-gaming-white text-sm">{location.specs}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wifi className="w-4 h-4 text-gaming-gray" />
                          <span className="text-gaming-white text-sm">1-10 Gbps Network Port</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <HardDrive className="w-4 h-4 text-gaming-gray" />
                          <span className="text-gaming-white text-sm">DDR4/DDR5 RAM</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-gaming-gray text-sm">Single Thread Score</span>
                          <span className="text-gaming-green font-semibold">{location.score}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hardware Comparison */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">Hardware Comparison</h2>
            <p className="text-gaming-gray text-lg">
              GameHost Pro's hardware goes above and beyond. Faster, stronger, better performance for every server.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-gaming-black-lighter border-gaming-green">
              <CardContent className="p-6 text-center">
                <Cpu className="w-12 h-12 text-gaming-green mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gaming-white mb-2">Premium CPUs</h3>
                <p className="text-gaming-gray text-sm">Up to AMD EPYC 4464P, optimized for high single-thread performance.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gaming-black-lighter border-gaming-green">
              <CardContent className="p-6 text-center">
                <HardDrive className="w-12 h-12 text-gaming-green mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gaming-white mb-2">NVMe SSD</h3>
                <p className="text-gaming-gray text-sm">6x faster than SATA SSD for lightning-fast loading times.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gaming-black-lighter border-gaming-green">
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 text-gaming-green mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gaming-white mb-2">DDoS Protection</h3>
                <p className="text-gaming-gray text-sm">Always on and always free protection against attacks.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-gaming">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gaming-white mb-4">
            Ready to Experience Premium Performance?
          </h2>
          <p className="text-xl text-gaming-gray mb-8">
            Join thousands of gamers enjoying lag-free gameplay on our high-performance servers.
          </p>
          <Button 
            size="lg" 
            className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black font-semibold"
          >
            <Server className="w-5 h-5 mr-2" />
            Get Started Today
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}