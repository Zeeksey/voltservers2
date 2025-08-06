import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Users, Shield, Server, Zap, HeadphonesIcon, BookOpen, Clock, ChevronRight, Database, ChevronDown } from "lucide-react";
import Navigation from "@/components/navigation";
import PromoBanner from "@/components/promo-banner";
import Footer from "@/components/footer";
import { Game } from "@shared/schema";

// Custom Section Component
function CustomSection({ section, game }: { section: any; game: Game }) {
  const getSectionClass = (sectionType: string) => {
    switch (sectionType) {
      case 'hero':
        return 'py-32 bg-gradient-to-br from-gaming-black via-gaming-black-light to-gaming-black';
      case 'cta':
        return 'py-20 bg-gaming-green/10';
      case 'testimonials':
        return 'py-20 bg-gaming-black-dark';
      default:
        return 'py-20';
    }
  };

  return (
    <section className={getSectionClass(section.sectionType)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          {section.title && (
            <h2 className="text-4xl font-bold text-gaming-white mb-4">
              {section.title.replace('{game}', game.name)}
            </h2>
          )}
          {section.subtitle && (
            <p className="text-gaming-gray text-lg">
              {section.subtitle.replace('{game}', game.name)}
            </p>
          )}
        </div>
        
        {/* Render content based on section type */}
        {section.sectionType === 'cta' && (
          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black font-semibold"
            >
              {section.content?.buttonText || 'Get Started'}
            </Button>
          </div>
        )}
        
        {section.content?.items && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {section.content.items.map((item: any, index: number) => (
              <Card key={index} className="bg-gaming-black-lighter border-gaming-green/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gaming-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gaming-gray">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function GamePage() {
  const [match, params] = useRoute("/games/:slug");
  const slug = params?.slug;
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "quarterly" | "biannual" | "annual">("monthly");

  const { data: game, isLoading } = useQuery<Game>({
    queryKey: ["/api/games", slug],
    queryFn: async () => {
      const response = await fetch(`/api/games/${slug}`);
      if (!response.ok) throw new Error("Game not found");
      return response.json();
    },
    enabled: !!slug,
  });

  // Fetch related blog articles
  const { data: relatedArticles } = useQuery({
    queryKey: ["/api/blog/related", slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog/related/${slug}`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!slug,
  });

  // Fetch dynamic customization data
  const { data: customSections = [] } = useQuery({
    queryKey: [`/api/games/${game?.id}/sections`],
    enabled: !!game?.id,
  }) as { data: any[] };

  const { data: customPricingTiers = [] } = useQuery({
    queryKey: [`/api/games/${game?.id}/pricing-tiers`],
    enabled: !!game?.id,
  }) as { data: any[] };

  const { data: customFeatures = [] } = useQuery({
    queryKey: [`/api/games/${game?.id}/features`],
    enabled: !!game?.id,
  }) as { data: any[] };

  // Fetch WHMCS pricing plans for Minecraft
  const { data: whmcsProducts, isLoading: whmcsLoading } = useQuery({
    queryKey: ['/api/whmcs/products', slug],
    queryFn: async () => {
      const response = await fetch(`/api/whmcs/products/${slug}`);
      if (!response.ok) throw new Error('Failed to fetch WHMCS products');
      return response.json();
    },
    enabled: !!game && slug === 'minecraft'
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gaming-black">
        <PromoBanner />
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <div className="text-gaming-green">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gaming-black">
        <PromoBanner />
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gaming-white mb-4">Game Not Found</h1>
            <p className="text-gaming-gray">The game you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  // Pricing tier multipliers (discounts for longer terms)
  const pricingMultipliers = {
    monthly: 1.0,
    quarterly: 0.90, // 10% discount
    biannual: 0.80, // 20% discount
    annual: 0.75    // 25% discount
  };

  // Helper function to calculate discounted price
  const calculatePrice = (basePrice: string, multiplier: number) => {
    return (parseFloat(basePrice) * multiplier).toFixed(2);
  };

  const getBillingLabel = (period: string) => {
    switch(period) {
      case 'monthly': return 'Monthly';
      case 'quarterly': return 'Quarterly (10% off)';
      case 'biannual': return 'Semi-Annual (20% off)';
      case 'annual': return 'Annual (25% off)';
      default: return 'Monthly';
    }
  };

  const defaultPricingPlans = [
    {
      name: "Starter",
      price: calculatePrice(game.basePrice, pricingMultipliers[billingPeriod]),
      originalPrice: game.basePrice,
      players: "10",
      features: [
        "Instant Setup",
        "DDoS Protection", 
        "Full FTP Access",
        "Mod Support",
        "Automated Backups"
      ]
    },
    {
      name: "Standard", 
      price: calculatePrice((parseFloat(game.basePrice) * 1.5).toFixed(2), pricingMultipliers[billingPeriod]),
      originalPrice: (parseFloat(game.basePrice) * 1.5).toFixed(2),
      players: "25",
      features: [
        "Everything in Starter",
        "Priority Support",
        "Custom Plugins",
        "Advanced Monitoring",
        "Database Access"
      ],
      popular: true
    },
    {
      name: "Premium",
      price: calculatePrice((parseFloat(game.basePrice) * 2.5).toFixed(2), pricingMultipliers[billingPeriod]),
      originalPrice: (parseFloat(game.basePrice) * 2.5).toFixed(2),
      players: "Unlimited",
      features: [
        "Everything in Standard",
        "Dedicated Resources",
        "24/7 Phone Support",
        "Custom Configurations",
        "Migration Assistance"
      ]
    }
  ];

  // Use WHMCS products for Minecraft if available, otherwise use existing logic
  let pricingPlans;
  if (slug === 'minecraft' && whmcsProducts?.products?.length > 0) {
    pricingPlans = whmcsProducts.products.map((product: any) => ({
      name: product.name,
      price: calculatePrice(product.monthlyPrice.toString(), pricingMultipliers[billingPeriod]),
      originalPrice: product.monthlyPrice.toString(),
      players: null, // Don't show player count for WHMCS products
      features: product.features || [],
      popular: product.popular || false,
      whmcsProductId: product.whmcsProductId
    }));
  } else if (Array.isArray(customPricingTiers) && customPricingTiers.length > 0) {
    pricingPlans = customPricingTiers;
  } else if (game.pricingPlans && Array.isArray(game.pricingPlans) && game.pricingPlans.length > 0) {
    pricingPlans = game.pricingPlans as any[];
  } else {
    pricingPlans = defaultPricingPlans;
  }

  const features = game.features && game.features.length > 0 ? game.features : [
    "Instant Setup",
    "DDoS Protection", 
    "Mod Support",
    "Global Locations",
    "24/7 Support",
    "Automated Backups"
  ];

  return (
    <div className="min-h-screen bg-gaming-black">
      <title>{game.name} Server Hosting - VoltServers</title>
      <meta name="description" content={`Professional ${game.name} server hosting with 99.9% uptime guarantee. Deploy instantly with DDoS protection, NVMe SSD, and 24/7 support.`} />
      
      <meta property="og:title" content={`${game.name} Server Hosting - VoltServers`} />
      <meta property="og:description" content={`Professional ${game.name} server hosting with 99.9% uptime guarantee. Deploy instantly with DDoS protection, NVMe SSD, and 24/7 support.`} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={game.imageUrl} />
      <meta property="og:site_name" content="VoltServers" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${game.name} Server Hosting`} />
      <meta name="twitter:description" content={`Professional ${game.name} server hosting with 99.9% uptime guarantee.`} />
      <meta name="twitter:image" content={game.imageUrl} />
      
      <PromoBanner />
      <Navigation />
      
      {/* Hero Section - VoltServers Style */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gaming-black via-gaming-black-light to-gaming-black"></div>
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gaming-black/90 via-gaming-black/50 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Lag-Free, High Performance <span className="text-gaming-green">{game.name} Servers</span>
              </h1>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                {game.heroSubtitle || `Instant setup, mod support, automatic wipes, and 24/7 expert support with VoltServers premium ${game.name} hosting.`}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="bg-gaming-green hover:bg-gaming-green/90 text-black font-semibold px-8"
                  onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Get Started
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-black px-8"
                >
                  View Features
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <Zap className="w-4 h-4 text-gaming-green" />
                  <span>Instant Setup</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Shield className="w-4 h-4 text-gaming-green" />
                  <span>DDoS Protection</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Server className="w-4 h-4 text-gaming-green" />
                  <span>Mod Support</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Users className="w-4 h-4 text-gaming-green" />
                  <span>Global Locations</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-gaming-green/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 -z-10"></div>
                <img 
                  src={game.heroImageUrl || game.imageUrl} 
                  alt={game.name}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-sm text-gaming-green font-semibold mb-1">Now Playing</div>
                    <div className="text-white text-lg">Epic {game.name} Adventures</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20" id="plans">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">Choose Your Plan</h2>
            <p className="text-gaming-gray text-lg">Select the perfect hosting solution for your {game.name} server</p>
            {slug === 'minecraft' && whmcsProducts?.products?.length > 0 && (
              <div className="mt-4">
                <Badge variant="secondary" className="bg-gaming-green/20 text-gaming-green">
                  Live WHMCS Pricing ({whmcsProducts.products.length} plans)
                </Badge>
              </div>
            )}
            {slug === 'minecraft' && whmcsProducts?.result === 'fallback' && (
              <div className="mt-4">
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                  Fallback Pricing (WHMCS Unavailable)
                </Badge>
              </div>
            )}
            {slug === 'minecraft' && whmcsLoading && (
              <div className="mt-4">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                  Loading WHMCS Products...
                </Badge>
              </div>
            )}
            
            {/* Billing Period Selector - VoltServers Style */}
            <div className="flex justify-center mt-8 mb-8">
              <p className="text-gray-400 mb-4">Select a billing cycle to see your discounted rate:</p>
            </div>
            <div className="flex justify-center mb-8">
              <Tabs value={billingPeriod} onValueChange={(value) => setBillingPeriod(value as "monthly" | "quarterly" | "biannual" | "annual")} className="w-auto">
                <TabsList className="grid w-full grid-cols-4 bg-black/20 border border-zinc-700">
                  <TabsTrigger 
                    value="monthly" 
                    className="data-[state=active]:bg-gaming-green data-[state=active]:text-black"
                  >
                    Monthly
                  </TabsTrigger>
                  <TabsTrigger 
                    value="quarterly" 
                    className="data-[state=active]:bg-gaming-green data-[state=active]:text-black"
                  >
                    Quarterly <span className="text-xs text-gaming-green">-10% OFF</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="biannual" 
                    className="data-[state=active]:bg-gaming-green data-[state=active]:text-black"
                  >
                    Semi-Annually <span className="text-xs text-gaming-green">-20% OFF</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="annual" 
                    className="data-[state=active]:bg-gaming-green data-[state=active]:text-black"
                  >
                    Annually <span className="text-xs text-gaming-green">-25% OFF</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {(customPricingTiers.length > 0 ? customPricingTiers : pricingPlans).map((plan: any, index: number) => (
              <div 
                key={index} 
                className={`relative rounded-xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                  (plan.popular || plan.isPopular) 
                    ? 'border-gaming-green bg-black/60 scale-105' 
                    : 'border-zinc-700 bg-black/40 hover:border-gaming-green'
                }`}
              >
                {(plan.popular || plan.isPopular) && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gaming-green text-black font-medium">Most Popular</Badge>
                  </div>
                )}
                <div className="text-center pb-8 pt-8 px-6">
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  <div className="mt-4">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-4xl font-bold text-gaming-green">
                          ${billingPeriod === 'monthly' 
                            ? (plan.monthlyPrice || plan.price)
                            : billingPeriod === 'biannual' 
                            ? (plan.biannualPrice || (plan.price * pricingMultipliers.biannual).toFixed(2))
                            : (plan.annualPrice || (plan.price * pricingMultipliers.annual).toFixed(2))
                          }
                        </span>
                        <span className="text-gray-400 text-lg">/{billingPeriod === 'monthly' ? 'mo' : billingPeriod === 'biannual' ? '6 mo' : 'year'}</span>
                      </div>
                      {billingPeriod !== 'monthly' && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500 line-through">${plan.originalPrice}</span>
                          <Badge className="bg-gaming-green/20 text-gaming-green text-xs">
                            {billingPeriod === 'biannual' ? 'Save 15%' : 'Save 25%'}
                          </Badge>
                        </div>
                      )}
                      {billingPeriod === 'monthly' && (
                        <p className="text-gray-400 text-sm">Billed monthly</p>
                      )}
                      {billingPeriod === 'biannual' && (
                        <p className="text-gray-400 text-sm">Billed every 6 months</p>
                      )}
                      {billingPeriod === 'annual' && (
                        <p className="text-gray-400 text-sm">Billed annually</p>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-400 mt-2">
                    {plan.players && `Recommended Players: ${plan.players}`}
                    {plan.ram && plan.storage && (
                      <span className="block text-sm">
                        {plan.ram} RAM • {plan.storage} Storage
                      </span>
                    )}
                    {plan.whmcsProductId && (
                      <span className="block text-sm text-gaming-green">
                        WHMCS Product ID: {plan.whmcsProductId}
                      </span>
                    )}
                  </p>
                </div>
                <div className="space-y-4 pt-0 px-6 pb-6">
                  {plan.features.map((feature: string, featureIndex: number) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <Check className="text-gaming-green w-5 h-5" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                  <Button 
                    className={`w-full mt-8 ${
                      (plan.popular || plan.isPopular)
                        ? 'bg-gaming-green hover:bg-gaming-green/90 text-black' 
                        : 'bg-transparent border border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-black'
                    }`}
                  >
                    Select Plan
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gaming-black-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Exclusive Features</h2>
            <p className="text-gray-400 text-lg">Everything you need for the perfect {game.name} server</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {(customFeatures.length > 0 ? customFeatures : features).map((feature: any, index) => {
              const icons = [Users, Shield, Server, Zap, HeadphonesIcon];
              const IconComponent = feature.icon ? 
                (() => {
                  switch(feature.icon.toLowerCase()) {
                    case 'shield': return Shield;
                    case 'users': return Users;
                    case 'server': return Server;
                    case 'zap': return Zap;
                    case 'headphones': case 'headphonesicon': return HeadphonesIcon;
                    case 'check': return Check;
                    default: return icons[index % icons.length];
                  }
                })() : icons[index % icons.length];
              
              return (
                <div key={index} className="text-center group">
                  <div className="w-14 h-14 bg-gaming-green/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-gaming-green/20 transition-colors">
                    <IconComponent className="w-6 h-6 text-gaming-green" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">
                    {feature.title || feature}
                  </h3>
                  {feature.description && (
                    <p className="text-gray-400 text-xs">
                      {feature.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Server Specifications */}
      <section className="py-20 bg-gradient-to-br from-zinc-900 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Enterprise Hardware</h2>
            <p className="text-gray-400 text-lg">Professional-grade infrastructure for optimal performance</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-black/30 border border-zinc-700 rounded-xl p-6 hover:border-gaming-green/50 transition-colors">
              <div className="w-12 h-12 bg-gaming-green/20 rounded-lg flex items-center justify-center mb-4">
                <Server className="w-6 h-6 text-gaming-green" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">CPU</h3>
              <p className="text-gray-300">Intel Xeon E-2236</p>
              <p className="text-sm text-gray-400">3.4GHz Base, 4.8GHz Turbo</p>
            </div>
            <div className="bg-black/30 border border-zinc-700 rounded-xl p-6 hover:border-gaming-green/50 transition-colors">
              <div className="w-12 h-12 bg-gaming-green/20 rounded-lg flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-gaming-green" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Memory</h3>
              <p className="text-gray-300">DDR4 ECC RAM</p>
              <p className="text-sm text-gray-400">Up to 128GB capacity</p>
            </div>
            <div className="bg-black/30 border border-zinc-700 rounded-xl p-6 hover:border-gaming-green/50 transition-colors">
              <div className="w-12 h-12 bg-gaming-green/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-gaming-green" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Storage</h3>
              <p className="text-gray-300">NVMe SSD</p>
              <p className="text-sm text-gray-400">6x faster than SATA</p>
            </div>
            <div className="bg-black/30 border border-zinc-700 rounded-xl p-6 hover:border-gaming-green/50 transition-colors">
              <div className="w-12 h-12 bg-gaming-green/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-gaming-green" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Network</h3>
              <p className="text-gray-300">1Gbps Bandwidth</p>
              <p className="text-sm text-gray-400">DDoS Protection</p>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-gaming-green/10 to-blue-500/10 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Trusted by Thousands</h2>
              <p className="text-gray-400 text-lg">Join the community of satisfied server owners</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-gaming-green mb-2">99.9%</div>
                <div className="text-gray-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gaming-green mb-2">24/7</div>
                <div className="text-gray-400">Support</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gaming-green mb-2">1000+</div>
                <div className="text-gray-400">Servers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gaming-green mb-2">50K+</div>
                <div className="text-gray-400">Players</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gaming-black-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">What Players Say</h2>
            <p className="text-gray-400 text-lg">Real feedback from our community</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black/40 border border-zinc-700 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gaming-green rounded-full flex items-center justify-center text-black font-bold mr-3">
                  A
                </div>
                <div>
                  <div className="font-semibold text-white">Alex Thompson</div>
                  <div className="text-sm text-gray-400">Server Owner</div>
                </div>
              </div>
              <p className="text-gray-300 italic">"Best hosting service I've used. Setup was instant and performance is incredible. My players love the zero lag experience!"</p>
              <div className="flex text-gaming-green mt-3">
                {"★".repeat(5)}
              </div>
            </div>
            <div className="bg-black/40 border border-zinc-700 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gaming-green rounded-full flex items-center justify-center text-black font-bold mr-3">
                  S
                </div>
                <div>
                  <div className="font-semibold text-white">Sarah Chen</div>
                  <div className="text-sm text-gray-400">Community Manager</div>
                </div>
              </div>
              <p className="text-gray-300 italic">"The control panel is amazing. I can manage everything easily, and the 24/7 support team is always helpful when needed."</p>
              <div className="flex text-gaming-green mt-3">
                {"★".repeat(5)}
              </div>
            </div>
            <div className="bg-black/40 border border-zinc-700 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gaming-green rounded-full flex items-center justify-center text-black font-bold mr-3">
                  M
                </div>
                <div>
                  <div className="font-semibold text-white">Mike Rodriguez</div>
                  <div className="text-sm text-gray-400">Gaming Streamer</div>
                </div>
              </div>
              <p className="text-gray-300 italic">"Switched from another host and the difference is night and day. Server performance is consistent and reliable for streaming."</p>
              <div className="flex text-gaming-green mt-3">
                {"★".repeat(5)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400 text-lg">Everything you need to know about {game.name} hosting</p>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-black/20 border border-zinc-700 rounded-xl overflow-hidden">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-black/30">
                  <span className="font-semibold text-white">How quickly can I get my server online?</span>
                  <ChevronDown className="w-5 h-5 text-gaming-green group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-6 pt-0 text-gray-300">
                  Your {game.name} server will be automatically deployed within 60 seconds of payment confirmation. Our automated system handles all the setup, so you can start playing immediately.
                </div>
              </details>
            </div>
            <div className="bg-black/20 border border-zinc-700 rounded-xl overflow-hidden">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-black/30">
                  <span className="font-semibold text-white">Can I install mods and plugins?</span>
                  <ChevronDown className="w-5 h-5 text-gaming-green group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-6 pt-0 text-gray-300">
                  Absolutely! You have full administrative access to install any compatible mods, plugins, or custom configurations. Our control panel makes it easy to manage everything.
                </div>
              </details>
            </div>
            <div className="bg-black/20 border border-zinc-700 rounded-xl overflow-hidden">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-black/30">
                  <span className="font-semibold text-white">What kind of support do you provide?</span>
                  <ChevronDown className="w-5 h-5 text-gaming-green group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-6 pt-0 text-gray-300">
                  We offer 24/7 technical support through live chat, email tickets, and our comprehensive knowledge base. Our expert team can help with server setup, optimization, and troubleshooting.
                </div>
              </details>
            </div>
            <div className="bg-black/20 border border-zinc-700 rounded-xl overflow-hidden">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-black/30">
                  <span className="font-semibold text-white">Can I upgrade or downgrade my plan?</span>
                  <ChevronDown className="w-5 h-5 text-gaming-green group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-6 pt-0 text-gray-300">
                  Yes! You can upgrade or downgrade your plan at any time through our client portal. Changes take effect immediately and billing is prorated automatically.
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Sections */}
      {customSections.length > 0 && customSections
        .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
        .map((section: any, index: number) => (
          <CustomSection key={section.id} section={section} game={game} />
        ))}

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-gaming-green to-blue-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-black mb-4">Ready to Launch Your {game.name} Server?</h2>
          <p className="text-xl text-black/80 mb-8">Join thousands of players enjoying lag-free gameplay</p>
          <Button 
            size="lg" 
            className="bg-black text-gaming-green hover:bg-black/90 px-8 py-4 text-lg"
            onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Start Your Server Now
          </Button>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles && relatedArticles.length > 0 && (
        <section className="py-20 bg-gaming-black-light">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gaming-white mb-4">
                Related <span className="text-gaming-green">Articles</span>
              </h2>
              <p className="text-gaming-gray text-lg">
                Learn more about {game.name} server hosting and optimization
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.slice(0, 3).map((article: any, index: number) => (
                <Link key={index} href={`/blog/${article.slug}`}>
                  <Card className="bg-gaming-black-lighter border-gaming-black-lighter hover:border-gaming-green/30 transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-0">
                      <img 
                        src={article.imageUrl} 
                        alt={article.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <BookOpen className="w-4 h-4 text-gaming-green" />
                          <span className="text-gaming-green text-sm font-medium">Guide</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gaming-white mb-3 group-hover:text-gaming-green transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gaming-gray text-sm mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-gaming-gray text-xs">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gaming-gray group-hover:text-gaming-green transition-colors" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link href="/knowledgebase">
                <Button 
                  variant="outline"
                  className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-gaming-black"
                >
                  View All Guides
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-gaming">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gaming-white mb-4">
            Ready to Launch Your {game.name} Server?
          </h2>
          <p className="text-xl text-gaming-gray mb-8">
            Join thousands of players enjoying smooth, lag-free gameplay on GameHost Pro.
          </p>
          <Button 
            size="lg" 
            className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black font-semibold"
          >
            Get Started Today
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}