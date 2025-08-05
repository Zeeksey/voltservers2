import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  BookOpen, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Star,
  Clock,
  Users,
  Gamepad2,
  CreditCard,
  Settings,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  Server,
  MapPin
} from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import PromoBanner from "@/components/promo-banner";
import Footer from "@/components/footer";
import type { BlogPost, ServerLocation } from "@shared/schema";

export default function KnowledgebasePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  // Fetch blog posts for knowledge base content
  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  // Fetch server locations
  const { data: serverLocations = [] } = useQuery<ServerLocation[]>({
    queryKey: ["/api/server-locations"],
  });

  // Filter and categorize blog posts
  const categorizedArticles = {
    games: blogPosts.filter(post => 
      post.tags.some(tag => 
        ['minecraft', 'game', 'setup', 'installation'].includes(tag.toLowerCase())
      )
    ),
    billing: blogPosts.filter(post => 
      post.tags.some(tag => 
        ['billing', 'payment', 'pricing', 'plan'].includes(tag.toLowerCase())
      )
    ),
    technical: blogPosts.filter(post => 
      post.tags.some(tag => 
        ['technical', 'troubleshooting', 'performance', 'optimization'].includes(tag.toLowerCase())
      )
    ),
    guides: blogPosts.filter(post => 
      post.tags.some(tag => 
        ['guide', 'tutorial', 'howto', 'setup'].includes(tag.toLowerCase())
      )
    )
  };

  // Filter articles based on search
  const filteredArticles = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const faqs = [
    {
      category: "Games",
      icon: Gamepad2,
      questions: [
        {
          question: "How do I set up a Minecraft server?",
          answer: "Setting up a Minecraft server is easy with GameHost Pro. Simply choose the Minecraft plan that fits your needs, select your server location, and we'll handle the rest. Your server will be ready in minutes with full control panel access."
        },
        {
          question: "Can I install mods and plugins on my server?",
          answer: "Yes! GameHost Pro supports both Forge mods and Bukkit/Spigot plugins. You can easily install them through our control panel or upload custom mods directly to your server."
        },
        {
          question: "What games do you support besides Minecraft?",
          answer: "We support a wide variety of games including Rust, ARK, CS2, Garry's Mod, and many more. Check our games page for the complete list of supported titles."
        },
        {
          question: "How many players can join my server?",
          answer: "Player capacity depends on your chosen plan and the game. Our plans range from small servers for friends (10-20 players) to large community servers (100+ players)."
        }
      ]
    },
    {
      category: "Billing",
      icon: CreditCard,
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and various cryptocurrency payments for your convenience."
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer: "Yes, you can cancel your subscription at any time from your account dashboard. Your server will remain active until the end of your current billing period."
        },
        {
          question: "Do you offer refunds?",
          answer: "We offer a 48-hour money-back guarantee for new customers. If you're not satisfied within the first 48 hours, contact our support team for a full refund."
        },
        {
          question: "How does billing work for multiple servers?",
          answer: "Each server is billed separately based on its individual plan. You can manage all your servers and billing from a single dashboard for convenience."
        }
      ]
    },
    {
      category: "Technical",
      icon: Settings,
      questions: [
        {
          question: "What if my server goes offline?",
          answer: "Our monitoring system automatically detects issues and attempts to restart your server. If problems persist, our technical team is notified immediately to resolve the issue."
        },
        {
          question: "How do I backup my server data?",
          answer: "GameHost Pro provides automated daily backups for all servers. You can also create manual backups anytime through the control panel and download them to your local computer."
        },
        {
          question: "Can I access my server files directly?",
          answer: "Yes! You have full FTP access to your server files. You can upload, download, and modify files directly through our web-based file manager or any FTP client."
        },
        {
          question: "What happens if I need more resources?",
          answer: "You can easily upgrade your server plan at any time. Upgrades take effect immediately, and you'll only pay the prorated difference for the current billing period."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gaming-black text-gaming-white">
      <PromoBanner />
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-gaming">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gaming-white mb-6">
            Knowledge Base
          </h1>
          <p className="text-xl text-gaming-gray mb-8 max-w-2xl mx-auto">
            Find answers, guides, and tutorials to help you get the most out of GameHost Pro
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gaming-gray w-5 h-5" />
            <Input
              type="text"
              placeholder="Search articles, guides, and FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 w-full bg-gaming-black-lighter border-gaming-green/30 text-gaming-white placeholder-gaming-gray rounded-lg focus:border-gaming-green focus:ring-gaming-green"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <Tabs defaultValue="articles" className="space-y-8">
          <TabsList className="bg-gaming-black-lighter border border-gaming-green/20 p-1">
            <TabsTrigger 
              value="articles" 
              className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Articles & Guides
            </TabsTrigger>
            <TabsTrigger 
              value="faq" 
              className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Frequently Asked Questions
            </TabsTrigger>
            <TabsTrigger 
              value="locations" 
              className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black"
            >
              <Server className="w-4 h-4 mr-2" />
              Server Locations
            </TabsTrigger>
          </TabsList>

          {/* Articles & Guides */}
          <TabsContent value="articles" className="space-y-8">
            {searchQuery ? (
              <div>
                <h2 className="text-2xl font-bold text-gaming-white mb-6">
                  Search Results ({filteredArticles.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map((article) => (
                    <Link key={article.id} href={`/blog/${article.slug}`}>
                      <Card className="bg-gaming-black-lighter border-gaming-black-lighter hover:border-gaming-green/30 transition-all duration-300 cursor-pointer group h-full">
                        <CardContent className="p-0">
                          <img 
                            src={article.imageUrl} 
                            alt={article.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <div className="p-6">
                            <div className="flex flex-wrap gap-2 mb-3">
                              {article.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="bg-gaming-green/20 text-gaming-green">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <h3 className="text-lg font-semibold text-gaming-white mb-3 group-hover:text-gaming-green transition-colors line-clamp-2">
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
              </div>
            ) : (
              <div className="space-y-12">
                {/* Featured Articles */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Star className="w-6 h-6 text-gaming-green" />
                    <h2 className="text-2xl font-bold text-gaming-white">Featured Articles</h2>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogPosts.slice(0, 3).map((article) => (
                      <Link key={article.id} href={`/blog/${article.slug}`}>
                        <Card className="bg-gaming-black-lighter border-gaming-black-lighter hover:border-gaming-green/30 transition-all duration-300 cursor-pointer group">
                          <CardContent className="p-0">
                            <img 
                              src={article.imageUrl} 
                              alt={article.title}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <div className="p-6">
                              <Badge className="bg-gaming-green text-gaming-black mb-3">Featured</Badge>
                              <h3 className="text-lg font-semibold text-gaming-white mb-3 group-hover:text-gaming-green transition-colors">
                                {article.title}
                              </h3>
                              <p className="text-gaming-gray text-sm">
                                {article.excerpt}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Categorized Articles */}
                {Object.entries(categorizedArticles).map(([category, articles]) => 
                  articles.length > 0 && (
                    <div key={category}>
                      <h2 className="text-2xl font-bold text-gaming-white mb-6 capitalize">
                        {category} Articles
                      </h2>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.slice(0, 6).map((article) => (
                          <Link key={article.id} href={`/blog/${article.slug}`}>
                            <Card className="bg-gaming-black-lighter border-gaming-black-lighter hover:border-gaming-green/30 transition-all duration-300 cursor-pointer group">
                              <CardContent className="p-6">
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {article.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="bg-gaming-green/20 text-gaming-green text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <h3 className="text-lg font-semibold text-gaming-white mb-3 group-hover:text-gaming-green transition-colors line-clamp-2">
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
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </TabsContent>

          {/* FAQ Section */}
          <TabsContent value="faq" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gaming-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gaming-gray text-lg">
                Quick answers to common questions about our services
              </p>
            </div>

            <div className="space-y-8">
              {faqs.map((faqCategory, categoryIndex) => (
                <Card key={categoryIndex} className="bg-gaming-black-lighter border-gaming-green/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-gaming-white">
                      <faqCategory.icon className="w-6 h-6 text-gaming-green" />
                      {faqCategory.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {faqCategory.questions.map((faq, faqIndex) => {
                      const faqId = `${categoryIndex}-${faqIndex}`;
                      return (
                        <Collapsible
                          key={faqIndex}
                          open={openFaq === faqId}
                          onOpenChange={(open) => setOpenFaq(open ? faqId : null)}
                        >
                          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gaming-black border border-gaming-black-light rounded-lg hover:border-gaming-green/30 transition-colors text-left">
                            <span className="text-gaming-white font-medium">{faq.question}</span>
                            <ChevronDown className={`w-4 h-4 text-gaming-gray transition-transform ${openFaq === faqId ? 'rotate-180' : ''}`} />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="px-4 py-3 text-gaming-gray bg-gaming-black/50 rounded-b-lg">
                            {faq.answer}
                          </CollapsibleContent>
                        </Collapsible>
                      );
                    })}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Discord CTA */}
            <Card className="bg-gradient-to-r from-[#5865F2] to-[#7289DA] border-0">
              <CardContent className="p-8 text-center">
                <MessageCircle className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">
                  Still Need Help?
                </h3>
                <p className="text-white/80 mb-6">
                  Join our Discord community for real-time support and connect with other GameHost Pro users!
                </p>
                <Button 
                  asChild
                  className="bg-white text-[#5865F2] hover:bg-gray-100 font-semibold"
                >
                  <a href="https://discord.gg/gamehost" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Join Discord Server
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Server Locations */}
          <TabsContent value="locations" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gaming-white mb-4">
                Server Locations
              </h2>
              <p className="text-gaming-gray text-lg">
                Our global network of high-performance servers ensures low latency worldwide
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serverLocations.map((location) => (
                <Card key={location.id} className="bg-gaming-black-lighter border-gaming-green/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gaming-green" />
                        <div>
                          <h3 className="text-lg font-semibold text-gaming-white">
                            {location.city}, {location.country}
                          </h3>
                          <p className="text-gaming-gray text-sm">{location.region}</p>
                        </div>
                      </div>
                      <Badge 
                        className={
                          location.status === 'online' 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }
                      >
                        {location.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gaming-gray">Provider:</span>
                        <span className="text-gaming-white">{location.provider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gaming-gray">Ping:</span>
                        <span className="text-gaming-green">{location.ping}ms</span>
                      </div>
                      {location.ipAddress && (
                        <div className="flex justify-between">
                          <span className="text-gaming-gray">Test IP:</span>
                          <code className="text-gaming-white bg-gaming-black px-2 py-1 rounded text-xs">
                            {location.ipAddress}
                          </code>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {serverLocations.length === 0 && (
              <div className="text-center py-12">
                <Server className="w-16 h-16 text-gaming-gray mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gaming-white mb-2">
                  Server locations loading...
                </h3>
                <p className="text-gaming-gray">
                  Please check back soon for our server location information.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Support CTA */}
      <section className="py-20 bg-gradient-gaming">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gaming-white mb-4">
            Still Need Help?
          </h2>
          <p className="text-xl text-gaming-gray mb-8">
            Our support team is available 24/7 to assist you with any questions.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/support">
              <Button 
                size="lg" 
                className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black font-semibold"
              >
                Contact Support
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline"
              className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-gaming-black"
              asChild
            >
              <a href="https://discord.gg/gamehost" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-2" />
                Join Discord
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}