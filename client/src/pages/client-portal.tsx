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
  LogOut
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
    queryKey: ['/api/whmcs/tickets'],
    enabled: whmcsStatus?.connected === true && !!clientId,
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
      href: "/dashboard",
      external: false
    },
    {
      icon: <CreditCard className="w-6 h-6 text-gaming-green" />,
      title: "Billing & Invoices",
      description: "View billing history",
      href: "/pricing",
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
      href: "/dashboard",
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

            {/* WHMCS Services */}
            {whmcsStatus?.connected && whmcsServices && (
              <Card className="bg-gaming-dark border-gaming-green/20">
                <CardHeader>
                  <CardTitle className="text-gaming-white text-2xl flex items-center gap-2">
                    <Server className="w-6 h-6" />
                    Your Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {servicesLoading ? (
                    <div className="text-gaming-gray">Loading services...</div>
                  ) : whmcsServices?.products?.length > 0 ? (
                    <div className="space-y-4">
                      {whmcsServices.products.map((service: any, index: number) => (
                        <div key={index} className="bg-gaming-black-lighter p-4 rounded-lg border border-gaming-green/20">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-gaming-white font-semibold">{service.product || service.name || 'Game Server'}</h4>
                              <p className="text-gaming-gray text-sm">{service.domain || 'N/A'}</p>
                              <Badge className={`mt-2 ${service.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {service.status || 'Unknown'}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="text-gaming-green font-semibold">${service.amount || service.price || '0.00'}</div>
                              <div className="text-gaming-gray text-sm">{service.billingcycle || 'Monthly'}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gaming-gray">No services found.</div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* WHMCS Invoices */}
            {whmcsStatus?.connected && whmcsInvoices && (
              <Card className="bg-gaming-dark border-gaming-green/20">
                <CardHeader>
                  <CardTitle className="text-gaming-white text-2xl flex items-center gap-2">
                    <CreditCard className="w-6 h-6" />
                    Recent Invoices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {invoicesLoading ? (
                    <div className="text-gaming-gray">Loading invoices...</div>
                  ) : whmcsInvoices?.invoices?.invoice?.length > 0 ? (
                    <div className="space-y-4">
                      {whmcsInvoices.invoices.invoice.slice(0, 5).map((invoice: any, index: number) => (
                        <div key={index} className="bg-gaming-black-lighter p-4 rounded-lg border border-gaming-green/20">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-gaming-white font-semibold">Invoice #{invoice.invoicenum}</h4>
                              <p className="text-gaming-gray text-sm">Due: {invoice.duedate}</p>
                              <Badge className={`mt-2 ${invoice.status === 'Paid' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {invoice.status}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="text-gaming-green font-semibold">${invoice.total}</div>
                              <div className="text-gaming-gray text-sm">{invoice.date}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gaming-gray">No invoices found.</div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}