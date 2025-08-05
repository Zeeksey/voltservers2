import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, GamepadIcon, Server } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import PromoBanner from "@/components/promo-banner";
import Footer from "@/components/footer";

export default function PricingPage() {
  const popularGames = [
    { name: "Minecraft", slug: "minecraft", icon: "🎮", description: "The world's most popular sandbox game" },
    { name: "Rust", slug: "rust", icon: "🔧", description: "Survival multiplayer at its finest" },
    { name: "CS2", slug: "cs2", icon: "🎯", description: "Competitive gaming redefined" },
    { name: "Valheim", slug: "valheim", icon: "⚔️", description: "Viking survival adventure" },
    { name: "ARK", slug: "ark", icon: "🦕", description: "Dinosaur survival evolved" },
    { name: "Palworld", slug: "palworld", icon: "🐾", description: "Creature collection adventure" }
  ];

  return (
    <div className="min-h-screen bg-gaming-black">
      <title>Game Server Pricing - VoltServers</title>
      <meta name="description" content="Find the perfect hosting plan for your game server. Browse pricing for Minecraft, Rust, CS2, and more popular games." />
      
      <PromoBanner />
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-gaming">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gaming-white mb-6">
            Game-Specific <span className="text-gaming-green">Pricing</span>
          </h1>
          <p className="text-xl text-gaming-gray mb-8 max-w-3xl mx-auto">
            Each game has tailored hosting plans optimized for performance. View pricing and features specific to your favorite games.
          </p>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularGames.map((game) => (
              <Card key={game.slug} className="bg-gaming-gray-dark border-gaming-gray hover:border-gaming-green transition-colors group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{game.icon}</span>
                    <CardTitle className="text-gaming-white">{game.name}</CardTitle>
                  </div>
                  <p className="text-gaming-gray text-sm">{game.description}</p>
                </CardHeader>
                <CardContent>
                  <Link href={`/games/${game.slug}`}>
                    <Button className="w-full bg-gaming-green hover:bg-gaming-green-dark text-gaming-black group-hover:scale-105 transition-transform">
                      View Plans
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
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
              <GamepadIcon className="w-12 h-12 text-gaming-green mx-auto mb-4" />
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
            </p>
            <Badge className="bg-gaming-green text-gaming-black text-lg px-4 py-2">
              🎉 Save 25% with Annual Plans - 3 Months Free!
            </Badge>
          </div>
        </div>
      </section>

      {/* Minecraft Pricing */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">
              Minecraft Server <span className="text-gaming-green">Hosting</span>
            </h2>
            <p className="text-gaming-gray text-lg">
              Premium Minecraft hosting starting at $3.99/month. All plans include unlimited SSD storage and slots.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {minecraftPlans.map((plan, index) => (
              <Card key={index} className={`bg-gaming-black-lighter border-gaming-black-lighter hover:shadow-xl hover:shadow-gaming-green/20 transition-all duration-300 relative ${plan.popular ? 'border-gaming-green' : ''}`}>
                {plan.popular && (
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
                    <div className="text-3xl font-bold text-gaming-green mb-2">{plan.price}</div>
                    <p className="text-gaming-gray">/monthly</p>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-gaming-white">
                      <Users className="w-4 h-4 text-gaming-green" />
                      <span>{plan.players}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gaming-white">
                      <Server className="w-4 h-4 text-gaming-green" />
                      <span>{plan.ram}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-gaming-green flex-shrink-0" />
                        <span className="text-gaming-gray text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, lIndex) => (
                      <div key={lIndex} className="flex items-center gap-2">
                        <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span className="text-gaming-gray text-sm">{limitation}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full font-semibold ${plan.popular ? 'bg-gaming-green hover:bg-gaming-green-dark text-gaming-black' : 'bg-gaming-black-light hover:bg-gaming-black text-gaming-white border border-gaming-green'}`}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Other Games */}
      <section className="py-20 bg-gaming-black-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">Other Game Servers</h2>
            <p className="text-gaming-gray text-lg">
              We support 60+ games with the same premium performance and features.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {otherGamePlans.map((gameGroup, gIndex) => (
              <Card key={gIndex} className="bg-gaming-black-lighter border-gaming-black-lighter">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gaming-white mb-6">{gameGroup.game}</h3>
                  <div className="space-y-4">
                    {gameGroup.plans.map((plan, pIndex) => (
                      <div key={pIndex} className="p-4 bg-gaming-black rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-gaming-white font-semibold">{plan.name}</h4>
                          <span className="text-gaming-green font-bold">{plan.price}/mo</span>
                        </div>
                        <div className="flex justify-between text-gaming-gray text-sm">
                          <span>{plan.players}</span>
                          <span>{plan.ram}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline"
                    className="w-full mt-6 border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-gaming-black"
                  >
                    View All Plans
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">All Plans Include</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gaming-black-lighter border-gaming-green text-center">
              <CardContent className="p-6">
                <HardDrive className="w-12 h-12 text-gaming-green mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gaming-white mb-2">NVMe SSD</h3>
                <p className="text-gaming-gray text-sm">6x faster than traditional SSD storage</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gaming-black-lighter border-gaming-green text-center">
              <CardContent className="p-6">
                <Shield className="w-12 h-12 text-gaming-green mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gaming-white mb-2">DDoS Protection</h3>
                <p className="text-gaming-gray text-sm">Always-on protection against attacks</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gaming-black-lighter border-gaming-green text-center">
              <CardContent className="p-6">
                <Globe className="w-12 h-12 text-gaming-green mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gaming-white mb-2">Global Locations</h3>
                <p className="text-gaming-gray text-sm">15+ server locations worldwide</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gaming-black-lighter border-gaming-green text-center">
              <CardContent className="p-6">
                <Zap className="w-12 h-12 text-gaming-green mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gaming-white mb-2">Instant Setup</h3>
                <p className="text-gaming-gray text-sm">Get your server online in seconds</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gaming-black-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">Pricing FAQ</h2>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="bg-gaming-black-lighter border-gaming-black-lighter">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gaming-white mb-2">Can I upgrade or downgrade my plan?</h3>
                <p className="text-gaming-gray">Yes, you can change your plan at any time. Upgrades are instant, and downgrades take effect at your next billing cycle.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gaming-black-lighter border-gaming-black-lighter">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gaming-white mb-2">Do you offer refunds?</h3>
                <p className="text-gaming-gray">Yes, we offer a 3-day money-back guarantee. You can process refunds automatically from your control panel.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gaming-black-lighter border-gaming-black-lighter">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gaming-white mb-2">Are there any setup fees?</h3>
                <p className="text-gaming-gray">No, there are no setup fees. Your server is deployed instantly upon payment.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-gaming">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gaming-white mb-4">
            Ready to Start Gaming?
          </h2>
          <p className="text-xl text-gaming-gray mb-8">
            Join thousands of gamers enjoying premium server hosting with GameHost Pro.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/games/minecraft">
              <Button 
                size="lg" 
                className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black font-semibold"
              >
                Start Your Server
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline"
                className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-gaming-black"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}