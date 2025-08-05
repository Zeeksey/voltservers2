import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  HeadphonesIcon, 
  MessageCircle, 
  Mail, 
  FileText, 
  Search,
  Clock,
  Users,
  Shield,
  BookOpen,
  ExternalLink,
  HelpCircle
} from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import PromoBanner from "@/components/promo-banner";
import Footer from "@/components/footer";

export default function SupportPage() {
  const supportChannels = [
    {
      icon: <MessageCircle className="w-8 h-8 text-gaming-green" />,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "24/7 Available",
      responseTime: "< 5 minutes",
      action: "Start Chat"
    },
    {
      icon: <HeadphonesIcon className="w-8 h-8 text-gaming-green" />,
      title: "Discord Support",
      description: "Join our community for help and discussions",
      availability: "Community Driven",
      responseTime: "Real-time",
      action: "Join Discord"
    },
    {
      icon: <Mail className="w-8 h-8 text-gaming-green" />,
      title: "Email Support",
      description: "Send us detailed questions via email",
      availability: "24/7 Available",
      responseTime: "< 4 hours",
      action: "Send Email"
    }
  ];

  const faqCategories = [
    {
      title: "Getting Started",
      questions: [
        "How do I set up my first server?",
        "What games do you support?",
        "How do I connect to my server?",
        "Can I change my server location?"
      ]
    },
    {
      title: "Billing & Plans",
      questions: [
        "How does billing work?",
        "Can I upgrade my plan?",
        "What's your refund policy?",
        "Do you offer discounts?"
      ]
    },
    {
      title: "Technical Support",
      questions: [
        "My server won't start, what do I do?",
        "How do I install mods/plugins?",
        "How do I backup my world?",
        "Why is my server lagging?"
      ]
    }
  ];

  const resources = [
    {
      icon: <BookOpen className="w-6 h-6 text-gaming-green" />,
      title: "Knowledge Base",
      description: "Comprehensive guides and tutorials",
      link: "#"
    },
    {
      icon: <FileText className="w-6 h-6 text-gaming-green" />,
      title: "Documentation",
      description: "Technical documentation and API reference",
      link: "#"
    },
    {
      icon: <Users className="w-6 h-6 text-gaming-green" />,
      title: "Community Forum",
      description: "Connect with other users and share tips",
      link: "#"
    },
    {
      icon: <Shield className="w-6 h-6 text-gaming-green" />,
      title: "Status Page",
      description: "Check our service status and uptime",
      link: "#"
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
              <span className="text-gaming-green">Support</span> Center
            </h1>
            <p className="text-xl text-gaming-gray mb-8">
              Get the help you need, when you need it. Our expert support team is here 24/7 to assist you.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gaming-gray w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help articles, guides, and more..."
                className="w-full pl-12 pr-4 py-4 bg-gaming-black-lighter border border-gaming-black-lighter rounded-lg text-gaming-white placeholder-gaming-gray focus:outline-none focus:border-gaming-green"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gaming-green hover:bg-gaming-green-dark text-gaming-black">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">Get Support</h2>
            <p className="text-gaming-gray text-lg">Choose the best way to reach out to our support team</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {supportChannels.map((channel, index) => (
              <Card key={index} className="bg-gaming-black-lighter border-gaming-black-lighter hover:border-gaming-green/30 transition-colors text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gaming-green/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {channel.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gaming-white mb-2">{channel.title}</h3>
                  <p className="text-gaming-gray mb-4">{channel.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4 text-gaming-green" />
                      <span className="text-sm text-gaming-white">{channel.availability}</span>
                    </div>
                    <Badge className="bg-gaming-green/20 text-gaming-green">
                      Response: {channel.responseTime}
                    </Badge>
                  </div>
                  
                  <Button className="w-full bg-gaming-green hover:bg-gaming-green-dark text-gaming-black font-semibold">
                    {channel.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gaming-black-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">
              Frequently Asked <span className="text-gaming-green">Questions</span>
            </h2>
            <p className="text-gaming-gray text-lg">Find quick answers to common questions</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {faqCategories.map((category, index) => (
              <Card key={index} className="bg-gaming-black-lighter border-gaming-black-lighter">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gaming-white mb-4">{category.title}</h3>
                  <div className="space-y-3">
                    {category.questions.map((question, qIndex) => (
                      <button
                        key={qIndex}
                        className="w-full text-left flex items-center gap-3 p-3 rounded-lg bg-gaming-black hover:bg-gaming-black-light transition-colors text-gaming-gray hover:text-gaming-white"
                      >
                        <HelpCircle className="w-4 h-4 text-gaming-green flex-shrink-0" />
                        <span className="text-sm">{question}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              variant="outline"
              className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-gaming-black"
            >
              View All FAQs
            </Button>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">Additional Resources</h2>
            <p className="text-gaming-gray text-lg">Explore our comprehensive documentation and community resources</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="bg-gaming-black-lighter border-gaming-black-lighter hover:border-gaming-green/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    {resource.icon}
                    <h3 className="text-lg font-semibold text-gaming-white">{resource.title}</h3>
                  </div>
                  <p className="text-gaming-gray text-sm mb-4">{resource.description}</p>
                  <Button 
                    variant="ghost" 
                    className="p-0 text-gaming-green hover:text-gaming-green-dark"
                  >
                    Learn More <ExternalLink className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-gaming">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gaming-white mb-4">
            Still Need Help?
          </h2>
          <p className="text-xl text-gaming-gray mb-8">
            Our support team is standing by to help you get the most out of your game server.
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black font-semibold"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Live Chat
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-gaming-black"
            >
              <Mail className="w-5 h-5 mr-2" />
              Send Email
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}