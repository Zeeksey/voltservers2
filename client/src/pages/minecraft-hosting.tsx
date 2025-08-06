import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Check, 
  Users, 
  Server, 
  Globe,
  Download,
  Settings,
  PlayCircle,
  Gamepad2,
  Database,
  Cpu,
  HardDrive,
  Lock
} from 'lucide-react';
import Navigation from '@/components/navigation';
import PromoBanner from '@/components/promo-banner';
import Footer from '@/components/footer';
import SEOHead from '@/components/seo-head';
import { Link } from 'wouter';

const minecraftSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Minecraft Server Hosting",
  "description": "Premium Minecraft server hosting with instant setup, mod support, and 24/7 uptime",
  "image": "https://voltservers.com/images/games/minecraft.jpg",
  "brand": {
    "@type": "Brand",
    "name": "VoltServers"
  },
  "offers": {
    "@type": "Offer",
    "price": "4.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "200"
  }
};

export default function MinecraftHostingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'biannual' | 'annual'>('monthly');

  const minecraftPlans = [
    {
      id: 'budget',
      name: 'Budget',
      description: 'Perfect for small groups',
      players: 10,
      ram: '2GB',
      storage: '20GB',
      monthly: 4.99,
      biannual: 4.24,
      annual: 3.74,
      features: [
        'Instant Setup',
        'Full FTP Access', 
        'DDoS Protection',
        'Plugin Support',
        'Basic Support',
        'Automatic Backups'
      ],
      popular: false
    },
    {
      id: 'standard',
      name: 'Standard', 
      description: 'Most popular choice',
      players: 20,
      ram: '4GB',
      storage: '40GB',
      monthly: 9.99,
      biannual: 8.49,
      annual: 7.49,
      features: [
        'Everything in Budget',
        'Mod Support',
        'Advanced DDoS Protection',
        'Priority Support',
        'Custom JAR Files',
        'Scheduled Restarts'
      ],
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'For serious communities',
      players: 50,
      ram: '8GB', 
      storage: '80GB',
      monthly: 19.99,
      biannual: 16.99,
      annual: 14.99,
      features: [
        'Everything in Standard',
        'BungeeCord Support',
        'Dedicated IP',
        'Advanced Plugin Manager',
        '24/7 Priority Support',
        'Custom Startup Parameters'
      ],
      popular: false
    },
    {
      id: 'extreme',
      name: 'Extreme',
      description: 'Maximum performance',
      players: 100,
      ram: '16GB',
      storage: '160GB', 
      monthly: 39.99,
      biannual: 33.99,
      annual: 29.99,
      features: [
        'Everything in Premium',
        'NVMe SSD Storage',
        'Dedicated Resources',
        'Advanced Monitoring',
        'Custom Control Panel',
        'Migration Assistance'
      ],
      popular: false
    }
  ];

  const minecraftFeatures = [
    {
      icon: <PlayCircle className="w-6 h-6" />,
      title: 'Instant Setup',
      description: 'Server ready in under 60 seconds'
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: 'Full Control Panel',
      description: 'Manage your server with ease'
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: 'Mod & Plugin Support',
      description: 'Install mods and plugins with one click'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global Locations',
      description: 'Servers in 12+ worldwide locations'
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: 'Automatic Backups',
      description: 'Daily backups to keep your world safe'
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'DDoS Protection',
      description: 'Enterprise-grade protection included'
    }
  ];

  const minecraftVersions = [
    { version: '1.21.4', type: 'Latest Release', popular: true },
    { version: '1.20.6', type: 'Stable', popular: true },
    { version: '1.19.4', type: 'Popular', popular: false },
    { version: '1.18.2', type: 'Legacy', popular: false },
    { version: '1.16.5', type: 'Modded', popular: true },
    { version: '1.12.2', type: 'Classic Modded', popular: false }
  ];

  const modpacks = [
    { name: 'All The Mods 9', downloads: '2.1M', category: 'Kitchen Sink' },
    { name: 'Better Minecraft', downloads: '1.8M', category: 'Adventure' },
    { name: 'RLCraft', downloads: '3.2M', category: 'Hardcore' },
    { name: 'Pixelmon Reforged', downloads: '1.5M', category: 'Pokemon' },
    { name: 'SkyFactory 4', downloads: '2.7M', category: 'Skyblock' },
    { name: 'Stoneblock 3', downloads: '987K', category: 'Underground' }
  ];

  const getPlanPrice = (plan: any) => {
    return plan[billingPeriod];
  };

  const getBillingText = () => {
    switch (billingPeriod) {
      case 'biannual': return '/6mo';
      case 'annual': return '/year';
      default: return '/mo';
    }
  };

  const getSavingsText = () => {
    switch (billingPeriod) {
      case 'biannual': return 'Save 15%';
      case 'annual': return 'Save 25%';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gaming-black">
      <SEOHead
        title="Minecraft Server Hosting | Premium Java & Bedrock | VoltServers"
        description="Premium Minecraft server hosting with instant setup, mod support, and 99.9% uptime guarantee. Java & Bedrock support. Starting at $4.99/mo with DDoS protection."
        keywords="minecraft hosting, minecraft server hosting, java server, bedrock server, minecraft mods, bukkit hosting, spigot hosting, minecraft plugins"
        ogTitle="Minecraft Server Hosting | Premium Java & Bedrock | VoltServers"
        ogDescription="Premium Minecraft server hosting with instant setup, mod support, and 99.9% uptime guarantee."
        canonicalUrl="https://voltservers.com/minecraft"
        schema={minecraftSchema}
      />
      
      <PromoBanner />
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-gaming relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gaming-green rounded-xl flex items-center justify-center">
                <Gamepad2 className="w-8 h-8 text-gaming-black" />
              </div>
              <h1 className="text-5xl font-bold text-gaming-white">
                Minecraft <span className="text-gaming-green">Server Hosting</span>
              </h1>
            </div>
            <p className="text-xl text-gaming-gray mb-8">
              Premium Minecraft hosting with instant setup, mod support, and 24/7 uptime
            </p>
            
            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
              <div className="bg-gaming-black-lighter/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gaming-green">99.9%</div>
                <div className="text-sm text-gaming-gray">Uptime</div>
              </div>
              <div className="bg-gaming-black-lighter/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gaming-green">60s</div>
                <div className="text-sm text-gaming-gray">Setup Time</div>
              </div>
              <div className="bg-gaming-black-lighter/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gaming-green">24/7</div>
                <div className="text-sm text-gaming-gray">Support</div>
              </div>
              <div className="bg-gaming-black-lighter/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gaming-green">12+</div>
                <div className="text-sm text-gaming-gray">Locations</div>
              </div>
            </div>

            <Button 
              size="lg" 
              className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black font-semibold px-8"
            >
              Start Your Server Now
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">
              Choose Your <span className="text-gaming-green">Plan</span>
            </h2>
            <p className="text-gaming-gray text-lg mb-8">
              All plans include DDoS protection, mod support, and instant setup
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-gaming-gray">Monthly</span>
              <div className="flex bg-gaming-black-lighter rounded-lg p-1">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    billingPeriod === 'monthly' 
                      ? 'bg-gaming-green text-gaming-black' 
                      : 'text-gaming-gray hover:text-gaming-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod('biannual')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    billingPeriod === 'biannual' 
                      ? 'bg-gaming-green text-gaming-black' 
                      : 'text-gaming-gray hover:text-gaming-white'
                  }`}
                >
                  6 Months
                </button>
                <button
                  onClick={() => setBillingPeriod('annual')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    billingPeriod === 'annual' 
                      ? 'bg-gaming-green text-gaming-black' 
                      : 'text-gaming-gray hover:text-gaming-white'
                  }`}
                >
                  Annual
                </button>
              </div>
              <span className="text-gaming-gray">Annual</span>
              {getSavingsText() && (
                <Badge className="bg-gaming-green text-gaming-black ml-2">
                  {getSavingsText()}
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {minecraftPlans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative bg-gaming-black-lighter border-2 transition-all duration-300 ${
                  plan.popular 
                    ? 'border-gaming-green shadow-lg shadow-gaming-green/20' 
                    : 'border-gaming-green/20 hover:border-gaming-green/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gaming-green text-gaming-black font-semibold">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-gaming-white text-xl">{plan.name}</CardTitle>
                  <p className="text-gaming-gray text-sm">{plan.description}</p>
                  <div className="mt-4">
                    <div className="text-3xl font-bold text-gaming-green">
                      ${getPlanPrice(plan)}
                      <span className="text-lg text-gaming-gray">{getBillingText()}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Plan specs */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gaming-green" />
                      <span className="text-gaming-gray">{plan.players} Players</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-gaming-green" />
                      <span className="text-gaming-gray">{plan.ram} RAM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-gaming-green" />
                      <span className="text-gaming-gray">{plan.storage} Storage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gaming-green" />
                      <span className="text-gaming-gray">Global</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-gaming-green flex-shrink-0" />
                        <span className="text-gaming-gray text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full mt-6 ${
                      plan.popular
                        ? 'bg-gaming-green hover:bg-gaming-green-dark text-gaming-black'
                        : 'bg-gaming-black-light hover:bg-gaming-green hover:text-gaming-black text-gaming-green border border-gaming-green'
                    }`}
                  >
                    Choose {plan.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gaming-black-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">
              Why Choose Our <span className="text-gaming-green">Minecraft Hosting</span>
            </h2>
            <p className="text-gaming-gray text-lg max-w-2xl mx-auto">
              Built specifically for Minecraft with features that matter to server owners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {minecraftFeatures.map((feature, index) => (
              <Card key={index} className="bg-gaming-black-lighter border-gaming-green/20 hover:border-gaming-green/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gaming-green/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <div className="text-gaming-green">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold text-gaming-white mb-2">{feature.title}</h3>
                  <p className="text-gaming-gray">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Versions & Modpacks */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="versions" className="w-full">
            <div className="text-center mb-8">
              <TabsList className="bg-gaming-black-lighter">
                <TabsTrigger value="versions" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black">
                  Minecraft Versions
                </TabsTrigger>
                <TabsTrigger value="modpacks" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black">
                  Popular Modpacks
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="versions">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gaming-white mb-4">
                  Supported <span className="text-gaming-green">Minecraft Versions</span>
                </h2>
                <p className="text-gaming-gray">All major Minecraft versions supported with one-click installation</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {minecraftVersions.map((version, index) => (
                  <Card key={index} className={`bg-gaming-black-lighter border transition-colors ${
                    version.popular ? 'border-gaming-green/50' : 'border-gaming-green/20'
                  } hover:border-gaming-green/80`}>
                    <CardContent className="p-4 text-center">
                      {version.popular && (
                        <Badge className="bg-gaming-green text-gaming-black text-xs mb-2">
                          Popular
                        </Badge>
                      )}
                      <div className="text-lg font-bold text-gaming-white mb-1">{version.version}</div>
                      <div className="text-sm text-gaming-gray">{version.type}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="modpacks">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gaming-white mb-4">
                  Popular <span className="text-gaming-green">Modpacks</span>
                </h2>
                <p className="text-gaming-gray">One-click installation for the most popular modpacks</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modpacks.map((modpack, index) => (
                  <Card key={index} className="bg-gaming-black-lighter border-gaming-green/20 hover:border-gaming-green/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gaming-white">{modpack.name}</h3>
                        <Badge variant="outline" className="border-gaming-green/50 text-gaming-green text-xs">
                          {modpack.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-gaming-gray">
                        <Download className="w-4 h-4" />
                        <span className="text-sm">{modpack.downloads} downloads</span>
                      </div>
                      <Button size="sm" className="w-full mt-4 bg-gaming-green hover:bg-gaming-green-dark text-gaming-black">
                        Install Modpack
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gaming-white mb-4">
            Ready to Start Your <span className="text-gaming-green">Minecraft Server</span>?
          </h2>
          <p className="text-gaming-gray text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied server owners. Get your Minecraft server online in under 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/games">
              <Button size="lg" className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black font-semibold px-8">
                Start Your Server Now
              </Button>
            </Link>
            <Link href="/minecraft-tools">
              <Button size="lg" variant="outline" className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-gaming-black">
                Minecraft Tools
              </Button>
            </Link>
            <Link href="/games">
              <Button size="lg" variant="outline" className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-gaming-black">
                View All Games
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}