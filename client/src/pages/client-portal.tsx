import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PromoBanner from "@/components/promo-banner";
import Navigation from "@/components/navigation";
import WHMCSLogin from "@/components/whmcs-login";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Server, 
  CreditCard, 
  FileText, 
  Settings, 
  BarChart3, 
  Shield,
  Users,
  ArrowRight,
  ExternalLink,
  User,
  LogOut,
  MessageSquare,
  Clock,
  AlertCircle
} from "lucide-react";
import { Link } from "wouter";

export default function ClientPortal() {
  const [loggedInClient, setLoggedInClient] = useState<any>(null);

  // Check for existing login on page load
  useEffect(() => {
    const savedClient = localStorage.getItem('whmcs_client_data');
    if (savedClient) {
      try {
        setLoggedInClient(JSON.parse(savedClient));
      } catch (error) {
        localStorage.removeItem('whmcs_client_data');
        localStorage.removeItem('whmcs_client_id');
      }
    }
  }, []);

  // Test WHMCS connection first
  const { data: whmcsStatus } = useQuery({
    queryKey: ['/api/whmcs/test'],
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });

  // Only fetch WHMCS data if connection is working and user is logged in
  const clientId = loggedInClient?.id;
  
  const { data: whmcsServices, isLoading: servicesLoading } = useQuery({
    queryKey: [`/api/whmcs/clients/${clientId}/services`],
    enabled: whmcsStatus?.connected === true && !!clientId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1
  });

  const { data: whmcsInvoices, isLoading: invoicesLoading } = useQuery({
    queryKey: [`/api/whmcs/clients/${clientId}/invoices`],
    enabled: whmcsStatus?.connected === true && !!clientId,
    staleTime: 2 * 60 * 1000,
    retry: 1
  });

  const { data: whmcsTickets, isLoading: ticketsLoading } = useQuery({
    queryKey: [`/api/whmcs/support/tickets/${loggedInClient?.email}`],
    enabled: whmcsStatus?.connected === true && !!loggedInClient?.email,
    staleTime: 2 * 60 * 1000,
    retry: 1
  });

  const handleLoginSuccess = (clientData: any) => {
    setLoggedInClient(clientData);
  };

  const handleLogout = () => {
    localStorage.removeItem('whmcs_client_data');
    localStorage.removeItem('whmcs_client_id');
    setLoggedInClient(null);
  };

  const quickActions = [
    {
      icon: <Server className="w-6 h-6 text-gaming-green" />,
      title: "Manage Servers",
      description: "Control your game servers",
      href: "/server-management",
      external: false
    },
    {
      icon: <CreditCard className="w-6 h-6 text-gaming-green" />,
      title: "Billing & Invoices",
      description: "View billing history",
      href: "/billing-management",
      external: false
    },
    {
      icon: <FileText className="w-6 h-6 text-gaming-green" />,
      title: "Support Tickets",
      description: "Get help from our team",
      href: "/support",
      external: false
    },
    {
      icon: <Settings className="w-6 h-6 text-gaming-green" />,
      title: "Account Settings",
      description: "Update your profile",
      href: "/client-portal",
      external: false
    }
  ];

  return (
    <div className="min-h-screen bg-gaming-black text-gaming-white">
      <PromoBanner />
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gaming-green to-gaming-blue bg-clip-text text-transparent">
            Client Portal
          </h1>
          <p className="text-gaming-gray text-lg">
            {loggedInClient 
              ? `Welcome back, ${loggedInClient.firstname} ${loggedInClient.lastname}!`
              : "Login to manage your services, billing, and support tickets"
            }
          </p>
        </div>

        {/* Show login form if not authenticated */}
        {!loggedInClient && (
          <div className="max-w-2xl mx-auto mb-12">
            <WHMCSLogin 
              onLoginSuccess={handleLoginSuccess}
              whmcsConnected={whmcsStatus?.connected === true}
            />
          </div>
        )}

        {/* Show client portal content if authenticated */}
        {loggedInClient && (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Client Info and Logout */}
            <div className="flex justify-between items-center bg-gaming-dark border border-gaming-green/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gaming-green/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gaming-green" />
                </div>
                <div>
                  <h3 className="text-gaming-white font-semibold">
                    {loggedInClient.firstname} {loggedInClient.lastname}
                  </h3>
                  <p className="text-gaming-gray text-sm">{loggedInClient.email}</p>
                  <Badge className={`mt-1 ${loggedInClient.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {loggedInClient.status}
                  </Badge>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-gaming-green/20 text-gaming-white hover:bg-gaming-green/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* WHMCS Connection Status */}
            {whmcsStatus && (
              <Card className="bg-gaming-dark border-gaming-green/20">
                <CardHeader>
                  <CardTitle className="text-gaming-white text-xl flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    WHMCS Integration Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${whmcsStatus.connected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className={`${whmcsStatus.connected ? 'text-green-400' : 'text-red-400'}`}>
                      {whmcsStatus.message}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="bg-gaming-dark border-gaming-green/20">
              <CardHeader>
                <CardTitle className="text-gaming-white text-2xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {quickActions.map((action, index) => (
                    <Link key={index} href={action.href}>
                      <div className="bg-gaming-black-lighter border border-gaming-green/20 rounded-lg p-6 text-center hover:border-gaming-green/40 transition-colors group cursor-pointer">
                        <div className="flex items-center justify-center w-12 h-12 bg-gaming-green/20 rounded-lg mx-auto mb-4 group-hover:bg-gaming-green/30 transition-colors">
                          {action.icon}
                        </div>
                        <h3 className="text-gaming-white font-semibold mb-2 group-hover:text-gaming-green transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-gaming-gray text-sm mb-4">{action.description}</p>
                        <div className="flex items-center justify-center text-gaming-green text-sm">
                          <span className="mr-1">Access Now</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* WHMCS Services - Enhanced Server Display */}
            {whmcsStatus?.connected && whmcsServices && (
              <Card className="bg-gaming-dark border-gaming-green/20">
                <CardHeader>
                  <CardTitle className="text-gaming-white text-2xl flex items-center gap-2">
                    <Server className="w-6 h-6" />
                    Your Game Servers ({whmcsServices?.products?.product?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {servicesLoading ? (
                    <div className="flex items-center gap-2 text-gaming-gray">
                      <div className="w-4 h-4 border-2 border-gaming-green/20 border-t-gaming-green rounded-full animate-spin" />
                      Loading your game servers...
                    </div>
                  ) : whmcsServices?.products?.product?.length > 0 ? (
                    <div className="space-y-6">
                      {whmcsServices.products.product.map((service: any, index: number) => (
                        <div key={index} className="bg-gaming-black-lighter p-6 rounded-lg border border-gaming-green/20 hover:border-gaming-green/40 transition-colors">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Server Info */}
                            <div className="lg:col-span-2">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h4 className="text-gaming-white font-bold text-lg">
                                    {service.serverDetails?.gameType || service.productname || 'Game Server'}
                                  </h4>
                                  <p className="text-gaming-gray text-sm">{service.domain || service.serverDetails?.ip || 'Server Domain'}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${service.serverDetails?.status === 'Online' ? 'bg-green-500' : 'bg-red-500'}`} />
                                  <span className={`text-sm font-medium ${service.serverDetails?.status === 'Online' ? 'text-green-400' : 'text-red-400'}`}>
                                    {service.serverDetails?.status || service.domainstatus || 'Unknown'}
                                  </span>
                                </div>
                              </div>

                              {/* Server Connection Details */}
                              <div className="bg-gaming-dark p-4 rounded-lg mb-4">
                                <h5 className="text-gaming-white font-semibold mb-2">Connection Details</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gaming-gray">Server IP:</span>
                                    <span className="text-gaming-white ml-2 font-mono">
                                      {service.serverDetails?.ip || service.dedicatedip || `server-${service.id}.gamehost.com`}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gaming-gray">Port:</span>
                                    <span className="text-gaming-white ml-2 font-mono">
                                      {service.serverDetails?.port || '25565'}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gaming-gray">Location:</span>
                                    <span className="text-gaming-white ml-2">
                                      {service.serverDetails?.location || 'Global Network'}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gaming-gray">Uptime:</span>
                                    <span className="text-green-400 ml-2 font-semibold">
                                      {service.serverDetails?.uptime || '99.9%'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Server Specifications */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-gaming-dark p-3 rounded-lg text-center">
                                  <div className="text-gaming-green font-semibold">
                                    {service.serverDetails?.specs?.ram || '4GB RAM'}
                                  </div>
                                  <div className="text-gaming-gray text-xs">Memory</div>
                                </div>
                                <div className="bg-gaming-dark p-3 rounded-lg text-center">
                                  <div className="text-gaming-green font-semibold">
                                    {service.serverDetails?.specs?.storage || 'SSD'}
                                  </div>
                                  <div className="text-gaming-gray text-xs">Storage</div>
                                </div>
                                <div className="bg-gaming-dark p-3 rounded-lg text-center">
                                  <div className="text-gaming-green font-semibold">
                                    {service.serverDetails?.specs?.cpu || 'High CPU'}
                                  </div>
                                  <div className="text-gaming-gray text-xs">Processor</div>
                                </div>
                                <div className="bg-gaming-dark p-3 rounded-lg text-center">
                                  <div className="text-gaming-green font-semibold">
                                    {service.serverDetails?.specs?.bandwidth || 'Unlimited'}
                                  </div>
                                  <div className="text-gaming-gray text-xs">Bandwidth</div>
                                </div>
                              </div>
                            </div>

                            {/* Billing & Actions */}
                            <div>
                              <div className="bg-gaming-dark p-4 rounded-lg">
                                <h5 className="text-gaming-white font-semibold mb-3">Billing</h5>
                                <div className="space-y-2 mb-4">
                                  <div>
                                    <span className="text-gaming-gray text-sm">Price:</span>
                                    <div className="text-gaming-green font-bold text-xl">
                                      ${service.amount || service.recurringamount || '0.00'}
                                    </div>
                                    <span className="text-gaming-gray text-sm">
                                      {service.billingcycle || 'Monthly'}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gaming-gray text-sm">Next Due:</span>
                                    <div className="text-gaming-white text-sm">
                                      {service.nextduedate || 'N/A'}
                                    </div>
                                  </div>
                                </div>

                                <Badge className={`w-full justify-center mb-3 ${
                                  service.domainstatus === 'Active' 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : 'bg-red-500/20 text-red-400'
                                }`}>
                                  {service.domainstatus || 'Unknown Status'}
                                </Badge>

                                <div className="space-y-2">
                                  <Button 
                                    className="w-full bg-gaming-green hover:bg-gaming-green/80 text-gaming-black font-semibold"
                                    size="sm"
                                  >
                                    Manage Server
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    className="w-full border-gaming-green/20 text-gaming-white hover:bg-gaming-green/10"
                                    size="sm"
                                  >
                                    <ExternalLink className="w-4 h-4 mr-1" />
                                    Control Panel
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Server className="w-12 h-12 text-gaming-gray mx-auto mb-4" />
                      <div className="text-gaming-gray">No game servers found.</div>
                      <div className="text-gaming-gray text-sm">Purchase a server to get started!</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* WHMCS Invoices - Enhanced Billing Display */}
            {whmcsStatus?.connected && whmcsInvoices && (
              <Card className="bg-gaming-dark border-gaming-green/20">
                <CardHeader>
                  <CardTitle className="text-gaming-white text-2xl flex items-center gap-2">
                    <CreditCard className="w-6 h-6" />
                    Billing & Invoices ({whmcsInvoices?.invoices?.invoice?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {invoicesLoading ? (
                    <div className="flex items-center gap-2 text-gaming-gray">
                      <div className="w-4 h-4 border-2 border-gaming-green/20 border-t-gaming-green rounded-full animate-spin" />
                      Loading billing information...
                    </div>
                  ) : whmcsInvoices?.invoices?.invoice?.length > 0 ? (
                    <div className="space-y-4">
                      {whmcsInvoices.invoices.invoice.slice(0, 8).map((invoice: any, index: number) => (
                        <div key={index} className="bg-gaming-black-lighter p-4 rounded-lg border border-gaming-green/20 hover:border-gaming-green/40 transition-colors">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                            {/* Invoice Details */}
                            <div>
                              <h4 className="text-gaming-white font-semibold">
                                Invoice #{invoice.invoicenum}
                              </h4>
                              <p className="text-gaming-gray text-sm">
                                Created: {new Date(invoice.date).toLocaleDateString()}
                              </p>
                            </div>

                            {/* Amount & Payment */}
                            <div className="text-center">
                              <div className="text-gaming-green font-bold text-lg">
                                {invoice.formattedTotal || `$${parseFloat(invoice.total || '0').toFixed(2)}`}
                              </div>
                              <div className="text-gaming-gray text-sm">
                                {invoice.paymentMethod || 'Credit Card'}
                              </div>
                            </div>

                            {/* Due Date & Status */}
                            <div className="text-center">
                              <div className="text-gaming-white text-sm">
                                Due: {new Date(invoice.duedate).toLocaleDateString()}
                              </div>
                              {invoice.daysOverdue > 0 && (
                                <div className="text-red-400 text-xs">
                                  {invoice.daysOverdue} days overdue
                                </div>
                              )}
                              <Badge className={`mt-1 ${
                                invoice.status === 'Paid' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : invoice.status === 'Unpaid' 
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {invoice.status}
                              </Badge>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 justify-end">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-gaming-green/20 text-gaming-white hover:bg-gaming-green/10"
                              >
                                <FileText className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              {invoice.status === 'Unpaid' && (
                                <Button 
                                  size="sm"
                                  className="bg-gaming-green hover:bg-gaming-green/80 text-gaming-black font-semibold"
                                >
                                  Pay Now
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {whmcsInvoices.invoices.invoice.length > 8 && (
                        <div className="text-center pt-4">
                          <Button variant="outline" className="border-gaming-green/20 text-gaming-white hover:bg-gaming-green/10">
                            View All Invoices ({whmcsInvoices.invoices.invoice.length})
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CreditCard className="w-12 h-12 text-gaming-gray mx-auto mb-4" />
                      <div className="text-gaming-gray">No invoices found.</div>
                      <div className="text-gaming-gray text-sm">Your billing history will appear here.</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Support Tickets Section */}
            {whmcsStatus?.connected && (
              <Card className="bg-gaming-dark border-gaming-green/20">
                <CardHeader>
                  <CardTitle className="text-gaming-white text-2xl flex items-center gap-2">
                    <MessageSquare className="w-6 h-6" />
                    Support Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {ticketsLoading ? (
                    <div className="flex items-center gap-2 text-gaming-gray">
                      <div className="w-4 h-4 border-2 border-gaming-green/20 border-t-gaming-green rounded-full animate-spin" />
                      Loading support tickets...
                    </div>
                  ) : whmcsTickets?.tickets?.ticket ? (
                    <div className="space-y-4">
                      {(Array.isArray(whmcsTickets.tickets.ticket) ? whmcsTickets.tickets.ticket : [whmcsTickets.tickets.ticket])
                        .slice(0, 5)
                        .map((ticket: any) => (
                        <div key={ticket.id} className="bg-gaming-black-lighter p-4 rounded-lg border border-gaming-green/20 hover:border-gaming-green/40 transition-colors">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                            {/* Ticket Details */}
                            <div className="md:col-span-2">
                              <h4 className="text-gaming-white font-semibold">
                                #{ticket.tid}: {ticket.subject}
                              </h4>
                              <p className="text-gaming-gray text-sm">
                                Department: {ticket.department}
                              </p>
                              <p className="text-gaming-gray text-xs">
                                Created: {new Date(ticket.date).toLocaleDateString()}
                              </p>
                            </div>

                            {/* Status & Priority */}
                            <div className="text-center">
                              <Badge className={`mb-2 ${
                                ticket.status === 'Open' ? 'bg-gaming-green/20 text-gaming-green' :
                                ticket.status === 'Answered' ? 'bg-blue-500/20 text-blue-400' :
                                ticket.status === 'Customer-Reply' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-gaming-gray/20 text-gaming-gray'
                              }`}>
                                {ticket.status}
                              </Badge>
                              <div className="flex items-center justify-center gap-1">
                                <AlertCircle className="w-3 h-3 text-gaming-gray" />
                                <span className="text-gaming-white text-sm">{ticket.priority}</span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 justify-end">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-gaming-green/20 text-gaming-white hover:bg-gaming-green/10"
                              >
                                <MessageSquare className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Link href="/support">
                                <Button 
                                  size="sm"
                                  className="bg-gaming-green hover:bg-gaming-green/80 text-gaming-black font-semibold"
                                >
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  Reply
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="flex justify-between items-center pt-4">
                        <Link href="/support">
                          <Button 
                            className="bg-gaming-green hover:bg-gaming-green/80 text-gaming-black font-semibold"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Create New Ticket
                          </Button>
                        </Link>
                        {whmcsTickets.tickets.ticket.length > 5 && (
                          <Button variant="outline" className="border-gaming-green/20 text-gaming-white hover:bg-gaming-green/10">
                            View All Tickets ({Array.isArray(whmcsTickets.tickets.ticket) ? whmcsTickets.tickets.ticket.length : 1})
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gaming-gray mx-auto mb-4" />
                      <div className="text-gaming-gray mb-2">No support tickets found.</div>
                      <div className="text-gaming-gray text-sm mb-4">Create a ticket to get help from our support team.</div>
                      <Link href="/support">
                        <Button 
                          className="bg-gaming-green hover:bg-gaming-green/80 text-gaming-black font-semibold"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Create Support Ticket
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Support Actions */}
            <Card className="bg-gaming-dark border-gaming-green/20">
              <CardHeader>
                <CardTitle className="text-gaming-white text-2xl">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/support">
                    <div className="bg-gaming-black-lighter border border-gaming-green/20 rounded-lg p-4 text-center hover:border-gaming-green/40 transition-colors group cursor-pointer">
                      <MessageSquare className="w-8 h-8 text-gaming-green mx-auto mb-2" />
                      <h4 className="text-gaming-white font-semibold mb-1">Create Ticket</h4>
                      <p className="text-gaming-gray text-sm">Get technical support</p>
                    </div>
                  </Link>
                  <Link href="/knowledgebase">
                    <div className="bg-gaming-black-lighter border border-gaming-green/20 rounded-lg p-4 text-center hover:border-gaming-green/40 transition-colors group cursor-pointer">
                      <FileText className="w-8 h-8 text-gaming-green mx-auto mb-2" />
                      <h4 className="text-gaming-white font-semibold mb-1">Knowledge Base</h4>
                      <p className="text-gaming-gray text-sm">Browse help articles</p>
                    </div>
                  </Link>
                  <div 
                    className="bg-gaming-black-lighter border border-gaming-green/20 rounded-lg p-4 text-center hover:border-gaming-green/40 transition-colors group cursor-pointer"
                    onClick={() => window.open('https://discord.gg/gamehost', '_blank')}
                  >
                    <Users className="w-8 h-8 text-gaming-green mx-auto mb-2" />
                    <h4 className="text-gaming-white font-semibold mb-1">Discord</h4>
                    <p className="text-gaming-gray text-sm">Join our community</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}