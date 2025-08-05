import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Award, 
  Clock, 
  Shield, 
  Server, 
  Globe,
  Target,
  Heart,
  Zap,
  HeadphonesIcon,
  Link as LinkIcon
} from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import PromoBanner from "@/components/promo-banner";
import Footer from "@/components/footer";

export default function AboutPage() {
  const stats = [
    { value: "15", label: "Server Locations", description: "Access gaming servers in 15 key regions for low latency and high-performing gameplay." },
    { value: "1M+", label: "Servers Hosted", description: "We've proudly hosted over 1 million game servers, ensuring reliable, high-performance gaming experiences." },
    { value: "50M", label: "Players Worldwide", description: "Join a massive community of 50 million gamers worldwide." },
    { value: "50+", label: "Games Supported", description: "Choose your adventure from our extensive game library." }
  ];

  const features = [
    {
      icon: <Clock className="w-8 h-8 text-gaming-green" />,
      title: "99.9% Uptime",
      description: "That's not a typo. All network outages are covered by our SLA."
    },
    {
      icon: <HeadphonesIcon className="w-8 h-8 text-gaming-green" />,
      title: "24/7 Support",
      description: "Our support team is available around-the-clock to assist you."
    },
    {
      icon: <LinkIcon className="w-8 h-8 text-gaming-green" />,
      title: "Free Subdomain",
      description: "Get a custom IP address for free using our subdomain creator."
    },
    {
      icon: <Zap className="w-8 h-8 text-gaming-green" />,
      title: "Instant Setup",
      description: "Start hosting in seconds after purchasing your game server."
    },
    {
      icon: <Shield className="w-8 h-8 text-gaming-green" />,
      title: "DDoS Protection",
      description: "We guarantee full protection against DDoS attacks under our SLA."
    },
    {
      icon: <Server className="w-8 h-8 text-gaming-green" />,
      title: "Expanding Game Library",
      description: "Our team is constantly working to keep our library up to date."
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
              About <span className="text-gaming-green">VoltServers</span>
            </h1>
            <p className="text-xl text-gaming-gray mb-8">
              Leading player-owned game server hosting provider since 2020, delivering premium services at unbeatable prices.
            </p>
          </div>
        </div>
      </section>

      {/* Our Company */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gaming-white mb-6">Our Company</h2>
              <p className="text-gaming-gray text-lg mb-6">
                VoltServers offers <strong className="text-gaming-green">premium services at unbeatable prices</strong>. 
                Founded in 2020, we've quickly become one of the most trusted game server hosting providers in the industry.
              </p>
              <p className="text-gaming-gray text-lg mb-6">
                We're committed to delivering an <strong className="text-gaming-green">exceptional user experience</strong> by 
                leveraging <strong className="text-gaming-green">top-tier hardware</strong> and maintaining a 
                <strong className="text-gaming-green"> 24/7 global support team</strong>. Plus, with our risk-free 
                72-hour money-back guarantee, there's no reason to wait.
              </p>
              <Link href="/games/minecraft">
                <Button 
                  size="lg" 
                  className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black font-semibold"
                >
                  Join Us Today
                </Button>
              </Link>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="VoltServers Team"
                className="rounded-lg shadow-2xl max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 bg-gaming-black-light">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Our Mission"
                className="rounded-lg shadow-2xl max-w-full h-auto"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-bold text-gaming-white mb-6">Our Mission</h2>
              <p className="text-gaming-gray text-lg mb-6">
                Our mission is to make it easy and affordable for anyone to operate any kind of internet service at any scale.
              </p>
              <p className="text-gaming-gray text-lg mb-6">
                Our team, consisting of passionate gamers and experienced developers, brings years of experience in the 
                game server hosting industry. We understand what gamers need because we are gamers ourselves.
              </p>
              <div className="flex items-center gap-4">
                <Target className="w-8 h-8 text-gaming-green" />
                <span className="text-gaming-white font-semibold">Democratizing game server hosting for everyone</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">
              GameHost Pro <span className="text-gaming-green">In Numbers</span>
            </h2>
            <p className="text-gaming-gray text-lg max-w-3xl mx-auto">
              At GameHost Pro, we take pride in our commitment to excellence and customer satisfaction. 
              Here are some numbers that reflect our dedication to providing top-tier game server hosting services.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-gaming-black-lighter border-gaming-black-lighter text-center hover:border-gaming-green/30 transition-colors">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-gaming-green mb-2">{stat.value}</div>
                  <h3 className="text-xl font-semibold text-gaming-white mb-3">{stat.label}</h3>
                  <p className="text-gaming-gray text-sm">{stat.description}</p>
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
            <p className="text-gaming-gray text-lg">
              We offer a wide variety of features that enhance your gaming experience and provide the most powerful hardware at the best price.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gaming-black-lighter border-gaming-black-lighter hover:border-gaming-green/30 transition-colors">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gaming-green/20 rounded-lg flex items-center justify-center mb-4">
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

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">Our Values</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-gaming-black-lighter border-gaming-green text-center">
              <CardContent className="p-8">
                <Heart className="w-12 h-12 text-gaming-green mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gaming-white mb-3">Customer First</h3>
                <p className="text-gaming-gray">Every decision we make is centered around providing the best possible experience for our customers.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gaming-black-lighter border-gaming-green text-center">
              <CardContent className="p-8">
                <Award className="w-12 h-12 text-gaming-green mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gaming-white mb-3">Excellence</h3>
                <p className="text-gaming-gray">We strive for excellence in everything we do, from our hardware to our customer support.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gaming-black-lighter border-gaming-green text-center">
              <CardContent className="p-8">
                <Users className="w-12 h-12 text-gaming-green mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gaming-white mb-3">Community</h3>
                <p className="text-gaming-gray">We're gamers serving gamers, building a community that supports and grows together.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-gaming">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gaming-white mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-gaming-gray mb-8">
            Experience the difference that premium hardware and dedicated support can make.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/">
              <Button 
                size="lg" 
                className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black font-semibold"
              >
                Get Started Today
              </Button>
            </Link>
            <Link href="/hardware">
              <Button 
                size="lg" 
                variant="outline"
                className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-gaming-black"
              >
                View Hardware Specs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}