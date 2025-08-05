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

  const categories = [
    {
      title: "Getting Started",
      description: "New to GameHost Pro? Start here for essential setup guides.",
      articles: [
        { title: "How to Set Up Your First Minecraft Server", views: "12.5k", updated: "2 days ago", featured: true },
        { title: "Connecting to Your Server", views: "8.2k", updated: "1 week ago" },
        { title: "Understanding Your Control Panel", views: "6.1k", updated: "3 days ago" },
        { title: "Server Location Selection Guide", views: "4.3k", updated: "5 days ago" }
      ]
    },
    {
      title: "Minecraft Specific",
      description: "Everything you need to know about Minecraft server management.",
      articles: [
        { title: "Installing Mods and Plugins", views: "15.8k", updated: "1 day ago", featured: true },
        { title: "Setting Up Modpacks", views: "11.2k", updated: "4 days ago" },
        { title: "Configuring Server Properties", views: "9.7k", updated: "1 week ago" },
        { title: "Managing Player Permissions", views: "7.4k", updated: "3 days ago" },
        { title: "Backup and Restore Guide", views: "5.9k", updated: "2 weeks ago" }
      ]
    },
    {
      title: "Technical Support",
      description: "Troubleshooting guides and technical solutions.",
      articles: [
        { title: "Server Won't Start - Troubleshooting", views: "13.1k", updated: "3 days ago", featured: true },
        { title: "Optimizing Server Performance", views: "10.6k", updated: "1 week ago" },
        { title: "Memory and RAM Issues", views: "8.8k", updated: "5 days ago" },
        { title: "Network Connectivity Problems", views: "6.5k", updated: "4 days ago" }
      ]
    },
    {
      title: "Billing & Account",
      description: "Account management, billing, and subscription help.",
      articles: [
        { title: "How to Upgrade Your Server Plan", views: "9.3k", updated: "2 days ago" },
        { title: "Understanding Your Invoice", views: "7.1k", updated: "1 week ago" },
        { title: "Cancellation and Refund Policy", views: "5.8k", updated: "3 days ago" },
        { title: "Payment Methods and Security", views: "4.2k", updated: "1 week ago" }
      ]
    },
    {
      title: "Advanced Features",
      description: "Make the most of your server with advanced configurations.",
      articles: [
        { title: "Setting Up Multiple Server Instances", views: "6.7k", updated: "4 days ago" },
        { title: "Custom Java Arguments and Flags", views: "5.4k", updated: "1 week ago" },
        { title: "Database Configuration", views: "4.1k", updated: "5 days ago" },
        { title: "API Access and Automation", views: "3.2k", updated: "2 weeks ago" }
      ]
    },
    {
      title: "Other Games",
      description: "Guides for Rust, ARK, Valheim, and other supported games.",
      articles: [
        { title: "Setting Up a Rust Server", views: "8.9k", updated: "3 days ago" },
        { title: "ARK Server Configuration", views: "6.6k", updated: "1 week ago" },
        { title: "Valheim Server Management", views: "5.3k", updated: "4 days ago" },
        { title: "CS2 Server Setup Guide", views: "4.8k", updated: "2 days ago" }
      ]
    }
  ];

  const popularArticles = [
    { title: "How to Set Up Your First Minecraft Server", category: "Getting Started", views: "12.5k" },
    { title: "Installing Mods and Plugins", category: "Minecraft", views: "15.8k" },
    { title: "Server Won't Start - Troubleshooting", category: "Technical", views: "13.1k" },
    { title: "Optimizing Server Performance", category: "Technical", views: "10.6k" },
    { title: "Setting Up Modpacks", category: "Minecraft", views: "11.2k" }
  ];

  const filteredCategories = categories.map(category => ({
    ...category,
    articles: category.articles.filter(article =>
      searchQuery === "" || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.articles.length > 0);

  return (
    <div className="min-h-screen bg-gaming-black">
      <PromoBanner />
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-gaming">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gaming-white mb-6">
              <span className="text-gaming-green">Knowledge</span> Base
            </h1>
            <p className="text-xl text-gaming-gray mb-8">
              Find answers, tutorials, and guides to help you get the most out of your game server.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gaming-gray w-5 h-5" />
              <Input
                type="text"
                placeholder="Search articles, guides, and tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gaming-black-lighter border border-gaming-black-lighter text-gaming-white placeholder-gaming-gray focus:outline-none focus:border-gaming-green text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">
              Popular <span className="text-gaming-green">Articles</span>
            </h2>
            <p className="text-gaming-gray text-lg">Most viewed guides by our community</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularArticles.map((article, index) => (
              <Card key={index} className="bg-gaming-black-lighter border-gaming-black-lighter hover:border-gaming-green/30 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary" className="bg-gaming-green/20 text-gaming-green">
                      {article.category}
                    </Badge>
                    <Star className="w-4 h-4 text-gaming-green" />
                  </div>
                  <h3 className="text-lg font-semibold text-gaming-white mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center justify-between text-gaming-gray text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{article.views} views</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gaming-black-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">Browse by Category</h2>
            <p className="text-gaming-gray text-lg">Find the help you need organized by topic</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {(searchQuery ? filteredCategories : categories).map((category, index) => (
              <Card key={index} className="bg-gaming-black-lighter border-gaming-black-lighter">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <BookOpen className="w-6 h-6 text-gaming-green" />
                    <h3 className="text-2xl font-bold text-gaming-white">{category.title}</h3>
                  </div>
                  <p className="text-gaming-gray mb-6">{category.description}</p>
                  
                  <div className="space-y-3">
                    {category.articles.slice(0, 4).map((article, aIndex) => (
                      <div key={aIndex} className="flex items-center justify-between p-3 bg-gaming-black rounded-lg hover:bg-gaming-black-light transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-gaming-green" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-gaming-white group-hover:text-gaming-green transition-colors">
                                {article.title}
                              </span>
                              {article.featured && (
                                <Badge className="bg-gaming-green text-gaming-black text-xs">
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-gaming-gray text-xs mt-1">
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {article.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {article.updated}
                              </span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gaming-gray group-hover:text-gaming-green transition-colors" />
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="ghost"
                    className="w-full mt-6 text-gaming-green hover:text-gaming-green-dark hover:bg-gaming-green/10"
                  >
                    View All {category.title} Articles
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">Quick Access</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/support">
              <Card className="bg-gaming-black-lighter border-gaming-green hover:shadow-xl hover:shadow-gaming-green/20 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gaming-green/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-gaming-green" />
                  </div>
                  <h3 className="text-lg font-semibold text-gaming-white mb-2">Support Center</h3>
                  <p className="text-gaming-gray text-sm">Get help from our support team</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/contact">
              <Card className="bg-gaming-black-lighter border-gaming-green hover:shadow-xl hover:shadow-gaming-green/20 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gaming-green/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-gaming-green" />
                  </div>
                  <h3 className="text-lg font-semibold text-gaming-white mb-2">Contact Us</h3>
                  <p className="text-gaming-gray text-sm">Reach out to our team directly</p>
                </CardContent>
              </Card>
            </Link>
            
            <Card className="bg-gaming-black-lighter border-gaming-green hover:shadow-xl hover:shadow-gaming-green/20 transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gaming-green/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-gaming-green" />
                </div>
                <h3 className="text-lg font-semibold text-gaming-white mb-2">Video Tutorials</h3>
                <p className="text-gaming-gray text-sm">Learn with step-by-step videos</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gaming-black-lighter border-gaming-green hover:shadow-xl hover:shadow-gaming-green/20 transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gaming-green/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-gaming-green" />
                </div>
                <h3 className="text-lg font-semibold text-gaming-white mb-2">API Docs</h3>
                <p className="text-gaming-gray text-sm">Developer documentation</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
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
            >
              Join Discord
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}