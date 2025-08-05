import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  MessageCircle, 
  MapPin, 
  Phone,
  Clock,
  Send,
  HeadphonesIcon,
  Globe,
  CheckCircle,
  User,
  Building
} from "lucide-react";

export default function EnhancedContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    priority: 'medium'
  });

  const contactMethods = [
    {
      icon: <MessageCircle className="w-8 h-8 text-gaming-green" />,
      title: "Live Chat",
      description: "Get instant support from our team",
      details: "Average response: 30 seconds",
      availability: "24/7",
      action: "Start Chat",
      status: "online"
    },
    {
      icon: <Mail className="w-8 h-8 text-gaming-green" />,
      title: "Email Support",
      description: "Detailed technical assistance",
      details: "support@gamehostpro.com",
      availability: "Response within 2 hours",
      action: "Send Email",
      status: "online"
    },
    {
      icon: <Phone className="w-8 h-8 text-gaming-green" />,
      title: "Phone Support",
      description: "Direct line to our experts",
      details: "+1 (555) 123-GAME",
      availability: "9 AM - 9 PM EST",
      action: "Call Now",
      status: "online"
    },
    {
      icon: <HeadphonesIcon className="w-8 h-8 text-gaming-green" />,
      title: "Discord Community",
      description: "Join 15,000+ gamers",
      details: "Community support & updates",
      availability: "24/7",
      action: "Join Discord",
      status: "online"
    }
  ];

  const offices = [
    {
      city: "San Francisco HQ",
      address: "123 Gaming Street, San Francisco, CA 94102",
      phone: "+1 (555) 123-4567",
      hours: "9 AM - 6 PM PST",
      timezone: "PST",
      employees: "50+"
    },
    {
      city: "New York",
      address: "456 Server Avenue, New York, NY 10001",
      phone: "+1 (555) 987-6543",
      hours: "9 AM - 6 PM EST",
      timezone: "EST", 
      employees: "30+"
    },
    {
      city: "London",
      address: "789 Hosting Lane, London, UK SW1A 1AA",
      phone: "+44 20 7123 4567",
      hours: "9 AM - 6 PM GMT",
      timezone: "GMT",
      employees: "25+"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // Here you would integrate with your actual contact form API
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-12">
      {/* Contact Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contactMethods.map((method, index) => (
          <Card key={index} className="bg-gaming-dark border-gaming-green/20 hover:border-gaming-green/40 transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <div className="relative mb-4">
                {method.icon}
                <Badge className={`absolute -top-2 -right-2 ${
                  method.status === 'online' 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}>
                  {method.status}
                </Badge>
              </div>
              <h3 className="text-gaming-white font-semibold text-lg mb-2">{method.title}</h3>
              <p className="text-gaming-gray text-sm mb-3">{method.description}</p>
              <div className="space-y-2 mb-4">
                <p className="text-gaming-green text-sm font-medium">{method.details}</p>
                <p className="text-gaming-gray text-xs">{method.availability}</p>
              </div>
              <Button 
                className="w-full bg-gaming-green hover:bg-gaming-green-dark text-gaming-black group-hover:scale-105 transition-transform"
                size="sm"
              >
                {method.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <Card className="bg-gaming-dark border-gaming-green/20">
          <CardHeader>
            <CardTitle className="text-gaming-white text-2xl flex items-center">
              <Send className="w-6 h-6 text-gaming-green mr-3" />
              Get in Touch
            </CardTitle>
            <p className="text-gaming-gray">
              Send us a message and we'll respond within 2 hours during business hours
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-gaming-white text-sm font-medium">Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your full name"
                    className="bg-gaming-black-lighter border-gaming-green/30 text-gaming-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gaming-white text-sm font-medium">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com"
                    className="bg-gaming-black-lighter border-gaming-green/30 text-gaming-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gaming-white text-sm font-medium">Company</label>
                <Input
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Your company name (optional)"
                  className="bg-gaming-black-lighter border-gaming-green/30 text-gaming-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gaming-white text-sm font-medium">Subject *</label>
                <Input
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="What can we help you with?"
                  className="bg-gaming-black-lighter border-gaming-green/30 text-gaming-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-gaming-white text-sm font-medium">Priority</label>
                <select 
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full bg-gaming-black-lighter border border-gaming-green/30 text-gaming-white rounded-md px-3 py-2"
                >
                  <option value="low">Low - General inquiry</option>
                  <option value="medium">Medium - Technical question</option>
                  <option value="high">High - Server issue</option>
                  <option value="urgent">Urgent - Service down</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-gaming-white text-sm font-medium">Message *</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Please provide details about your inquiry..."
                  className="bg-gaming-black-lighter border-gaming-green/30 text-gaming-white min-h-[120px]"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-gaming-green hover:bg-gaming-green-dark text-gaming-black text-lg py-3">
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </Button>

              <div className="text-center">
                <p className="text-gaming-gray text-sm">
                  <CheckCircle className="w-4 h-4 inline text-gaming-green mr-1" />
                  We typically respond within 2 hours
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Office Locations */}
        <div className="space-y-6">
          <div>
            <h3 className="text-gaming-white text-2xl font-bold mb-2 flex items-center">
              <Building className="w-6 h-6 text-gaming-green mr-3" />
              Our Offices
            </h3>
            <p className="text-gaming-gray">Visit us or get in touch with your local team</p>
          </div>

          <div className="space-y-4">
            {offices.map((office, index) => (
              <Card key={index} className="bg-gaming-black-lighter border-gaming-green/20 hover:border-gaming-green/40 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-gaming-white font-semibold text-lg mb-1">{office.city}</h4>
                      <Badge className="bg-gaming-green/20 text-gaming-green border-gaming-green/30">
                        {office.employees} employees
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-gaming-green text-sm font-medium">{office.timezone}</div>
                      <div className="text-gaming-gray text-xs">Local time</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gaming-green mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gaming-white text-sm">{office.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gaming-green flex-shrink-0" />
                      <div>
                        <p className="text-gaming-white text-sm">{office.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gaming-green flex-shrink-0" />
                      <div>
                        <p className="text-gaming-white text-sm">{office.hours}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gaming-green/20">
                    <Button variant="outline" size="sm" className="border-gaming-green/30 text-gaming-green hover:bg-gaming-green/10">
                      <Globe className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}