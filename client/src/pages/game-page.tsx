import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Users, Shield, Server, Zap, HeadphonesIcon, BookOpen, Clock, ChevronRight } from "lucide-react";
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
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "biannual" | "annual">("monthly");

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
    biannual: 0.85, // 15% discount
    annual: 0.75    // 25% discount
  };

  // Helper function to calculate discounted price
  const calculatePrice = (basePrice: string, multiplier: number) => {
    return (parseFloat(basePrice) * multiplier).toFixed(2);
  };

  const getBillingLabel = (period: string) => {
    switch(period) {
      case 'monthly': return 'Monthly';
      case 'biannual': return 'Biannual (15% off)';
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
              <div className="relative rounded-2xl overflow-hidden">
                <img 
                  src={game.heroImageUrl || game.imageUrl} 
                  alt={game.name}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
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
              <Tabs value={billingPeriod} onValueChange={(value) => setBillingPeriod(value as "monthly" | "biannual" | "annual")} className="w-auto">
                <TabsList className="grid w-full grid-cols-4 bg-black/20 border border-zinc-700">
                  <TabsTrigger 
                    value="monthly" 
                    className="data-[state=active]:bg-gaming-green data-[state=active]:text-black"
                  >
                    Monthly
                  </TabsTrigger>
                  <TabsTrigger 
                    value="biannual" 
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

      {/* Custom Sections */}
      {customSections.length > 0 && customSections
        .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
        .map((section: any, index: number) => (
          <CustomSection key={section.id} section={section} game={game} />
        ))}

      {/* Detailed Description */}
      {(game.detailedDescription || game.description) && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gaming-white mb-8 text-center">
                Why Choose Our {game.name} Hosting?
              </h2>
              <div className="prose prose-lg prose-invert">
                <p className="text-gaming-gray text-lg leading-relaxed">
                  {game.detailedDescription || game.description}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

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