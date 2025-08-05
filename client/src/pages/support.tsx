import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  HeadphonesIcon, 
  Mail, 
  FileText, 
  Search,
  Clock,
  Users,
  Shield,
  BookOpen,
  ExternalLink,
  HelpCircle,
  ChevronDown,
  Send,
  MessageSquare,
  AlertCircle,
  User
} from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import PromoBanner from "@/components/promo-banner";
import Footer from "@/components/footer";
import { apiRequest } from "@/lib/queryClient";
import type { FaqCategory, FaqItem } from "@shared/schema";

export default function SupportPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [emailForm, setEmailForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "Medium",
    deptid: ""
  });

  const [loggedInClient, setLoggedInClient] = useState<any>(null);

  // Fetch support departments
  const { data: departments } = useQuery({
    queryKey: ['/api/whmcs/support/departments'],
    enabled: true
  });

  // Get logged in client for WHMCS integration
  useEffect(() => {
    const savedClient = localStorage.getItem('whmcs_client_data');
    if (savedClient) {
      try {
        setLoggedInClient(JSON.parse(savedClient));
      } catch (error) {
        console.error('Error parsing client data:', error);
      }
    }
  }, []);

  // Create support ticket mutation
  const createTicketMutation = useMutation({
    mutationFn: async (ticketData: {
      name: string;
      email: string;
      subject: string;
      message: string;
      priority: string;
      deptid?: string;
    }) => {
      const response = await fetch('/api/whmcs/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Support Ticket Created",
        description: `Ticket #${data.ticketid || data.id || 'N/A'} has been submitted. We'll respond within 4 hours.`,
      });
      setEmailForm({
        name: "",
        email: "",
        subject: "",
        message: "",
        priority: "Medium",
        deptid: ""
      });
      
      // Refetch tickets to show the new one
      queryClient.invalidateQueries({ queryKey: ['/api/whmcs/support/tickets'] });
    },
    onError: (error: any) => {
      console.error('Ticket creation error:', error);
      toast({
        title: "Failed to create ticket",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  // Get user's support tickets
  const { data: userTickets } = useQuery({
    queryKey: [`/api/whmcs/support/tickets/${loggedInClient?.email}`, loggedInClient?.email],
    queryFn: async () => {
      if (!loggedInClient?.email) return null;
      const response = await fetch(`/api/whmcs/support/tickets/${encodeURIComponent(loggedInClient.email)}?requestorEmail=${encodeURIComponent(loggedInClient.email)}`);
      if (!response.ok) {
        throw new Error(`${response.status}: ${await response.text()}`);
      }
      return response.json();
    },
    enabled: !!loggedInClient?.email,
    staleTime: 60 * 1000
  });

  const supportChannels = [
    {
      icon: <HeadphonesIcon className="w-8 h-8 text-gaming-green" />,
      title: "Discord Support",
      description: "Join our community for help and discussions",
      availability: "Community Driven",
      responseTime: "Real-time",
      action: "Join Discord",
      link: "https://discord.gg/gamehost"
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-gaming-green" />,
      title: "Support Tickets",
      description: "Create WHMCS support tickets for technical issues",
      availability: "24/7 Available",
      responseTime: "< 4 hours",
      action: "Create Ticket",
      formSection: true
    }
  ];

  // Fetch FAQ data from API with fallback
  const { data: faqData = [], isLoading: isLoadingFaq } = useQuery({
    queryKey: ['/api/faqs'],
    select: (data: any) => data || [
      {
        id: "getting-started",
        title: "Getting Started",
        items: [
          { id: "1", question: "How do I set up my first server?", answer: "Setting up your first server is easy. Simply choose your game, select a plan, and follow our quick-start guide." },
          { id: "2", question: "What games do you support?", answer: "We support all popular games including Minecraft, CS2, Rust, ARK, and many more." },
          { id: "3", question: "How do I connect to my server?", answer: "You'll receive connection details via email once your server is ready. Use your game client to connect using the provided IP address." },
          { id: "4", question: "Can I change my server location?", answer: "Yes, you can change your server location from your control panel. Note that this may require server migration." }
        ]
      },
      {
        id: "billing-plans",
        title: "Billing & Plans",  
        items: [
          { id: "5", question: "How does billing work?", answer: "We use monthly billing cycles. Your first payment covers the setup and first month of service." },
          { id: "6", question: "Can I upgrade my plan?", answer: "Yes, you can upgrade or downgrade your plan at any time from your client portal." },
          { id: "7", question: "What's your refund policy?", answer: "We offer a 7-day money-back guarantee for new customers. Contact support for refund requests." },
          { id: "8", question: "Do you offer discounts?", answer: "Yes, we offer discounts for longer-term commitments and students. Check our pricing page for current offers." }
        ]
      },
      {
        id: "technical-support",
        title: "Technical Support",
        items: [
          { id: "9", question: "My server won't start, what do I do?", answer: "First, check the server console for error messages. If you need help, contact our support team with the error details." },
          { id: "10", question: "How do I install mods/plugins?", answer: "You can install mods and plugins through your server control panel or by uploading files directly via FTP." },
          { id: "11", question: "How do I backup my world?", answer: "Automatic backups are included with all plans. You can also create manual backups from your control panel." },
          { id: "12", question: "Why is my server lagging?", answer: "Server lag can be caused by many factors including high player count, resource-intensive plugins, or insufficient RAM. Contact support for optimization help." }
        ]
      }
    ]
  });

  // Email form submission
  const sendEmailMutation = useMutation({
    mutationFn: async (formData: typeof emailForm) => {
      return apiRequest('/api/contact', 'POST', formData);
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you within 4 hours.",
      });
      setEmailForm({
        name: "",
        email: "",
        subject: "",
        message: "",
        priority: "Medium",
        deptid: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only allow logged-in users to create tickets
    if (!loggedInClient) {
      toast({
        title: "Login Required",
        description: "Please log into your client portal to create support tickets.",
        variant: "destructive",
      });
      return;
    }
    
    if (!emailForm.subject || !emailForm.message) {
      toast({
        title: "Please fill in all required fields",
        description: "Subject and message are required.",
        variant: "destructive",
      });
      return;
    }
    
    createTicketMutation.mutate({
      name: `${loggedInClient.firstname} ${loggedInClient.lastname}`,
      email: loggedInClient.email,
      subject: emailForm.subject,
      message: emailForm.message,
      priority: emailForm.priority,
      deptid: emailForm.deptid
    });
  };

  const resources = [
    {
      icon: <BookOpen className="w-6 h-6 text-gaming-green" />,
      title: "Knowledge Base",
      description: "Comprehensive guides and tutorials",
      link: "/knowledgebase"
    },
    {
      icon: <FileText className="w-6 h-6 text-gaming-green" />,
      title: "Minecraft Tools",
      description: "Specialized tools and utilities",
      link: "/minecraft-tools"
    },
    {
      icon: <Users className="w-6 h-6 text-gaming-green" />,
      title: "Community Discord",
      description: "Connect with other users and share tips",
      link: "https://discord.gg/gamehost"
    },
    {
      icon: <Shield className="w-6 h-6 text-gaming-green" />,
      title: "Status Page",
      description: "Check our service status and uptime",
      link: "/status"
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
                  
                  {channel.formSection ? (
                    <Button 
                      className="w-full bg-gaming-green hover:bg-gaming-green-dark text-gaming-black font-semibold"
                      onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      {channel.action}
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-gaming-green hover:bg-gaming-green-dark text-gaming-black font-semibold"
                      onClick={() => window.open(channel.link, '_blank')}
                    >
                      {channel.action}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gaming-black-light">
        <div className="container mx-auto px-4">
          <Card id="contact-form" className="max-w-4xl mx-auto bg-gaming-black-lighter border-gaming-black-lighter">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-gaming-white flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-gaming-green mr-3" />
                Create Support Ticket
              </CardTitle>
              <CardDescription className="text-gaming-gray text-lg">
                Submit a ticket directly to our WHMCS system for technical support
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {!loggedInClient ? (
                <div className="text-center py-12">
                  <div className="mb-6 p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <AlertCircle className="w-8 h-8 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold text-xl">Login Required</span>
                    </div>
                    <p className="text-yellow-300 text-lg mb-6">
                      You must be logged into your client account to create support tickets. This ensures your tickets are properly tracked and linked to your services.
                    </p>
                    <Link href="/client-portal">
                      <Button size="lg" className="bg-gaming-green hover:bg-gaming-green/80 text-gaming-black font-semibold">
                        <User className="w-5 h-5 mr-2" />
                        Login to Client Portal
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-8 p-4 bg-gaming-dark/50 rounded-lg">
                    <p className="text-gaming-gray text-sm">
                      Don't have an account? Contact us through Discord or email us directly for general inquiries.
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-6 p-4 bg-gaming-green/10 border border-gaming-green/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-5 h-5 text-gaming-green" />
                      <span className="text-gaming-green font-semibold">Logged in as: {loggedInClient.firstname} {loggedInClient.lastname}</span>
                    </div>
                    <p className="text-gaming-gray text-sm">
                      Your ticket will be automatically linked to your account ({loggedInClient.email})
                    </p>
                  </div>
                  
                  <form onSubmit={handleTicketSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="subject" className="text-gaming-white text-sm font-medium mb-2 block">Subject *</Label>
                        <Input
                          id="subject"
                          type="text"
                          required
                          value={emailForm.subject}
                          onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                          className="bg-gaming-black border-gaming-black-lighter text-gaming-white focus:border-gaming-green"
                          placeholder="Brief description of your inquiry"
                        />
                      </div>
                      <div>
                        <Label htmlFor="department" className="text-gaming-white text-sm font-medium mb-2 block">Department</Label>
                        <select
                          id="department"
                          value={emailForm.deptid}
                          onChange={(e) => setEmailForm({ ...emailForm, deptid: e.target.value })}
                          className="w-full px-3 py-2 bg-gaming-black border border-gaming-black-lighter rounded-md text-gaming-white focus:border-gaming-green focus:outline-none"
                        >
                          <option value="">Select Department</option>
                          {departments?.departments?.department?.map((dept: any) => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name}
                            </option>
                          )) || (
                            <>
                              <option value="1">General Support</option>
                              <option value="2">Technical Support</option>
                              <option value="3">Billing Support</option>
                              <option value="4">Sales</option>
                            </>
                          )}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="priority" className="text-gaming-white text-sm font-medium mb-2 block">Priority</Label>
                        <select
                          id="priority"
                          value={emailForm.priority}
                          onChange={(e) => setEmailForm({ ...emailForm, priority: e.target.value })}
                          className="w-full px-3 py-2 bg-gaming-black border border-gaming-black-lighter rounded-md text-gaming-white focus:border-gaming-green focus:outline-none"
                        >
                          <option value="Low">Low - General inquiry</option>
                          <option value="Medium">Medium - Standard support</option>
                          <option value="High">High - Urgent issue</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-gaming-white text-sm font-medium mb-2 block">Message *</Label>
                      <Textarea
                        id="message"
                        required
                        rows={6}
                        value={emailForm.message}
                        onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                        className="bg-gaming-black border-gaming-black-lighter text-gaming-white focus:border-gaming-green resize-none"
                        placeholder="Please provide detailed information about your question or issue..."
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={createTicketMutation.isPending}
                      className="w-full bg-gaming-green hover:bg-gaming-green-dark text-gaming-black font-semibold py-3"
                    >
                      {createTicketMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gaming-black/20 border-t-gaming-black rounded-full animate-spin mr-2" />
                          Creating Ticket...
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-5 h-5 mr-2" />
                          Create Support Ticket
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
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
            {(faqData as any[]).map((category: any) => (
              <Card key={category.id} className="bg-gaming-black-lighter border-gaming-black-lighter">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gaming-white mb-4">{category.title}</h3>
                  <div className="space-y-3">
                    {category.items.map((item: any) => (
                      <Collapsible key={item.id}>
                        <CollapsibleTrigger className="w-full text-left flex items-center gap-3 p-3 rounded-lg bg-gaming-black hover:bg-gaming-black-light transition-colors text-gaming-gray hover:text-gaming-white">
                          <HelpCircle className="w-4 h-4 text-gaming-green flex-shrink-0" />
                          <span className="text-sm flex-1">{item.question}</span>
                          <ChevronDown className="w-4 h-4 text-gaming-green" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-3 pb-3">
                          <div className="bg-gaming-black/50 rounded-lg p-3 mt-2">
                            <p className="text-sm text-gaming-gray">{item.answer}</p>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
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
              <MessageSquare className="w-5 h-5 mr-2" />
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