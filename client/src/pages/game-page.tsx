import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Users, Shield, Server, Zap, HeadphonesIcon, BookOpen, Clock, ChevronRight } from "lucide-react";
import Navigation from "@/components/navigation";
import PromoBanner from "@/components/promo-banner";
import Footer from "@/components/footer";
import { Game } from "@shared/schema";

export default function GamePage() {
  const [match, params] = useRoute("/games/:slug");
  const slug = params?.slug;

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

  const defaultPricingPlans = [
    {
      name: "Starter",
      price: game.basePrice,
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
      price: (parseFloat(game.basePrice) * 1.5).toFixed(2),
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
      price: (parseFloat(game.basePrice) * 2.5).toFixed(2), 
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

  const pricingPlans = game.pricingPlans && Array.isArray(game.pricingPlans) && game.pricingPlans.length > 0 
    ? game.pricingPlans as any[] 
    : defaultPricingPlans;

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
      <PromoBanner />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-gaming">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gaming-white mb-6">
                {game.heroTitle || `Premium ${game.name} Server Hosting`}
              </h1>
              <p className="text-xl text-gaming-gray mb-8">
                {game.heroSubtitle || `Lag-free, high performance ${game.name} servers with instant setup and 24/7 expert support.`}
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {features.slice(0, 4).map((feature, index) => (
                  <Badge key={index} variant="secondary" className="bg-gaming-green/20 text-gaming-green">
                    {feature}
                  </Badge>
                ))}
              </div>
              <Button 
                size="lg" 
                className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black font-semibold"
              >
                Get Started
              </Button>
            </div>
            <div className="flex justify-center">
              <img 
                src={game.heroImageUrl || game.imageUrl} 
                alt={game.name}
                className="max-w-full h-auto rounded-lg shadow-2xl"
              />
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
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan: any, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-gaming-green' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gaming-green text-gaming-black">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-gaming-white">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gaming-green">${plan.price}</span>
                    <span className="text-gaming-gray">/mo</span>
                  </div>
                  <p className="text-gaming-gray mt-2">Recommended Players: {plan.players}</p>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  {plan.features.map((feature: string, featureIndex: number) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <Check className="text-gaming-green w-5 h-5" />
                      <span className="text-gaming-white">{feature}</span>
                    </div>
                  ))}
                  <Button 
                    className={`w-full mt-8 ${
                      plan.popular 
                        ? 'bg-gaming-green hover:bg-gaming-green-dark text-gaming-black' 
                        : 'bg-gaming-black-lighter hover:bg-gaming-black-light text-gaming-white'
                    }`}
                  >
                    Select Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gaming-black-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">Exclusive Features</h2>
            <p className="text-gaming-gray text-lg">Everything you need for the perfect {game.name} server</p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const icons = [Users, Shield, Server, Zap, HeadphonesIcon];
              const IconComponent = icons[index % icons.length];
              
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gaming-green/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-gaming-green" />
                  </div>
                  <h3 className="text-lg font-semibold text-gaming-white mb-2">{feature}</h3>
                  <p className="text-gaming-gray text-sm">Professional-grade {feature.toLowerCase()} for your server</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

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