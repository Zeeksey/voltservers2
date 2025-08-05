import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, 
  MessageCircle, 
  MapPin, 
  Phone,
  Clock,
  Send,
  HeadphonesIcon
} from "lucide-react";
import Navigation from "@/components/navigation";
import PromoBanner from "@/components/promo-banner";
import Footer from "@/components/footer";

export default function ContactPage() {
  const contactMethods = [
    {
      icon: <MessageCircle className="w-8 h-8 text-gaming-green" />,
      title: "Live Chat",
      description: "Get instant support from our team",
      details: "Available 24/7",
      action: "Start Chat"
    },
    {
      icon: <Mail className="w-8 h-8 text-gaming-green" />,
      title: "Email Support",
      description: "Send us your questions",
      details: "support@gamehostpro.com",
      action: "Send Email"
    },
    {
      icon: <HeadphonesIcon className="w-8 h-8 text-gaming-green" />,
      title: "Discord",
      description: "Join our community",
      details: "Connect with other users",
      action: "Join Discord"
    }
  ];

  const offices = [
    {
      city: "San Francisco",
      address: "123 Gaming Street, SF, CA 94102",
      phone: "+1 (555) 123-4567",
      hours: "9 AM - 6 PM PST"
    },
    {
      city: "New York",
      address: "456 Server Avenue, NY, NY 10001",
      phone: "+1 (555) 987-6543",
      hours: "9 AM - 6 PM EST"
    },
    {
      city: "London",
      address: "789 Hosting Lane, London, UK SW1A 1AA",
      phone: "+44 20 7123 4567",
      hours: "9 AM - 6 PM GMT"
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
              Contact <span className="text-gaming-green">Us</span>
            </h1>
            <p className="text-xl text-gaming-gray mb-8">
              Have questions? We're here to help. Reach out to our team through any of the channels below.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">Get In Touch</h2>
            <p className="text-gaming-gray text-lg">Choose your preferred way to contact us</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <Card key={index} className="bg-gaming-black-lighter border-gaming-black-lighter hover:border-gaming-green/30 transition-colors text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gaming-green/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gaming-white mb-2">{method.title}</h3>
                  <p className="text-gaming-gray mb-2">{method.description}</p>
                  <p className="text-gaming-green font-semibold mb-4">{method.details}</p>
                  <Button className="w-full bg-gaming-green hover:bg-gaming-green-dark text-gaming-black font-semibold">
                    {method.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Office Info */}
      <section className="py-20 bg-gaming-black-light">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gaming-white mb-6">Send Us a Message</h2>
              <Card className="bg-gaming-black-lighter border-gaming-black-lighter">
                <CardContent className="p-8">
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gaming-white text-sm font-semibold mb-2">
                          First Name *
                        </label>
                        <Input 
                          type="text" 
                          className="bg-gaming-black border-gaming-black text-gaming-white focus:border-gaming-green"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-gaming-white text-sm font-semibold mb-2">
                          Last Name *
                        </label>
                        <Input 
                          type="text" 
                          className="bg-gaming-black border-gaming-black text-gaming-white focus:border-gaming-green"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gaming-white text-sm font-semibold mb-2">
                        Email Address *
                      </label>
                      <Input 
                        type="email" 
                        className="bg-gaming-black border-gaming-black text-gaming-white focus:border-gaming-green"
                        placeholder="john@example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gaming-white text-sm font-semibold mb-2">
                        Subject *
                      </label>
                      <Input 
                        type="text" 
                        className="bg-gaming-black border-gaming-black text-gaming-white focus:border-gaming-green"
                        placeholder="How can we help you?"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gaming-white text-sm font-semibold mb-2">
                        Message *
                      </label>
                      <Textarea 
                        rows={6}
                        className="bg-gaming-black border-gaming-black text-gaming-white focus:border-gaming-green resize-none"
                        placeholder="Tell us about your question or concern..."
                      />
                    </div>
                    
                    <Button 
                      type="submit"
                      className="w-full bg-gaming-green hover:bg-gaming-green-dark text-gaming-black font-semibold"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Office Information */}
            <div>
              <h2 className="text-3xl font-bold text-gaming-white mb-6">Our Offices</h2>
              <div className="space-y-6">
                {offices.map((office, index) => (
                  <Card key={index} className="bg-gaming-black-lighter border-gaming-black-lighter">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-gaming-white mb-4">{office.city}</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-gaming-green mt-0.5 flex-shrink-0" />
                          <span className="text-gaming-gray">{office.address}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-gaming-green flex-shrink-0" />
                          <span className="text-gaming-gray">{office.phone}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-gaming-green flex-shrink-0" />
                          <span className="text-gaming-gray">{office.hours}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Additional Contact Info */}
              <Card className="bg-gaming-black-lighter border-gaming-green mt-6">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gaming-white mb-4">24/7 Support</h3>
                  <p className="text-gaming-gray mb-4">
                    Need immediate assistance? Our support team is available around the clock to help you with any issues.
                  </p>
                  <div className="flex gap-3">
                    <Button className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black font-semibold">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Live Chat
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-gaming-black"
                    >
                      Call Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gaming-white mb-4">Find Us</h2>
          </div>
          <div className="bg-gaming-black-lighter rounded-lg p-8 text-center">
            <MapPin className="w-16 h-16 text-gaming-green mx-auto mb-4" />
            <p className="text-gaming-gray">Interactive map coming soon</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}