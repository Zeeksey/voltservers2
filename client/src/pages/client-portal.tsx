import PromoBanner from "@/components/promo-banner";
import Navigation from "@/components/navigation";
import WHMCSIntegration from "@/components/whmcs-integration";
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
  Clock,
  Users,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export default function ClientPortal() {
  // Test WHMCS connection first
  const { data: whmcsStatus } = useQuery({
    queryKey: ['/api/whmcs/test'],
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });

  // Only fetch WHMCS data if connection is working
  const { data: whmcsServices, isLoading: servicesLoading } = useQuery({
    queryKey: ['/api/whmcs/clients/1/services'],
    enabled: whmcsStatus?.connected === true,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1
  });

  const { data: whmcsInvoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ['/api/whmcs/clients/1/invoices'],
    enabled: whmcsStatus?.connected === true,
    staleTime: 2 * 60 * 1000,
    retry: 1
  });

  const { data: whmcsTickets, isLoading: ticketsLoading } = useQuery({
    queryKey: ['/api/whmcs/tickets'],
    enabled: whmcsStatus?.connected === true,
    staleTime: 2 * 60 * 1000,
    retry: 1
  });

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

  // Dynamic account stats based on WHMCS data
  const accountStats = [
    { 
      label: "Active Services", 
      value: whmcsServices?.products?.length ? String(whmcsServices.products.length) : "3", 
      icon: <Server className="w-5 h-5" /> 
    },
    { label: "Total Uptime", value: "99.9%", icon: <Clock className="w-5 h-5" /> },
    { label: "Data Transfer", value: "2.4TB", icon: <BarChart3 className="w-5 h-5" /> },
    { 
      label: "Open Tickets", 
      value: whmcsTickets?.tickets?.length ? String(whmcsTickets.tickets.length) : "0", 
      icon: <Shield className="w-5 h-5" /> 
    }
  ];

  return (
    <div className="min-h-screen bg-gaming-black">
      <title>Client Portal - GameHost Pro | Account Management</title>
      <meta name="description" content="Access your GameHost Pro client portal. Manage services, view billing, create support tickets, and monitor your game servers." />
      
      <PromoBanner />
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-gaming">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gaming-white mb-6">
              Client <span className="text-gaming-green">Portal</span>
            </h1>
            <p className="text-xl text-gaming-gray mb-8">
              Manage your services, billing, and support tickets all in one place
            </p>
          </div>
        </div>
      </section>

      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto space-y-8">
          {/* Account Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {accountStats.map((stat, index) => (
              <Card key={index} className="bg-gaming-dark border-gaming-green/20">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-gaming-green/20 rounded-lg mx-auto mb-3">
                    <span className="text-gaming-green">{stat.icon}</span>
                  </div>
                  <div className="text-2xl font-bold text-gaming-green mb-1">{stat.value}</div>
                  <div className="text-gaming-gray text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="bg-gaming-dark border-gaming-green/20">
            <CardHeader>
              <CardTitle className="text-gaming-white text-2xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action, index) => (
                  <div key={index}>
                    {action.external ? (
                      <div className="bg-gaming-black-lighter border border-gaming-green/20 rounded-lg p-6 text-center hover:border-gaming-green/40 transition-colors group cursor-pointer">
                        <div className="flex items-center justify-center w-12 h-12 bg-gaming-green/20 rounded-lg mx-auto mb-4 group-hover:bg-gaming-green/30 transition-colors">
                          {action.icon}
                        </div>
                        <h3 className="text-gaming-white font-semibold mb-2 group-hover:text-gaming-green transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-gaming-gray text-sm mb-4">{action.description}</p>
                        <div className="flex items-center justify-center text-gaming-green text-sm">
                          <span className="mr-1">Access via WHMCS</span>
                          <ExternalLink className="w-4 h-4" />
                        </div>
                      </div>
                    ) : (
                      <Link href={action.href}>
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
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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

          {/* Real WHMCS Services */}
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
                  <div className="text-gaming-gray">No active services found.</div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Real WHMCS Invoices */}
          {whmcsStatus?.connected && whmcsInvoices && (
            <Card className="bg-gaming-dark border-gaming-green/20">
              <CardHeader>
                <CardTitle className="text-gaming-white text-2xl flex items-center gap-2">
                  <CreditCard className="w-6 h-6" />
                  Recent Bills
                </CardTitle>
              </CardHeader>
              <CardContent>
                {invoicesLoading ? (
                  <div className="text-gaming-gray">Loading invoices...</div>
                ) : whmcsInvoices?.invoices?.length > 0 ? (
                  <div className="space-y-4">
                    {whmcsInvoices.invoices.slice(0, 5).map((invoice: any, index: number) => (
                      <div key={index} className="bg-gaming-black-lighter p-4 rounded-lg border border-gaming-green/20">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-gaming-white font-semibold">Invoice #{invoice.invoiceid || invoice.id}</h4>
                            <p className="text-gaming-gray text-sm">Due: {invoice.duedate || 'N/A'}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-gaming-green font-semibold">${invoice.total || '0.00'}</div>
                            <Badge className={`${invoice.status === 'Paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                              {invoice.status || 'Pending'}
                            </Badge>
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

          {/* Real WHMCS Support Tickets */}
          {whmcsStatus?.connected && whmcsTickets && (
            <Card className="bg-gaming-dark border-gaming-green/20">
              <CardHeader>
                <CardTitle className="text-gaming-white text-2xl flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  Support Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ticketsLoading ? (
                  <div className="text-gaming-gray">Loading tickets...</div>
                ) : whmcsTickets?.tickets?.length > 0 ? (
                  <div className="space-y-4">
                    {whmcsTickets.tickets.slice(0, 5).map((ticket: any, index: number) => (
                      <div key={index} className="bg-gaming-black-lighter p-4 rounded-lg border border-gaming-green/20">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-gaming-white font-semibold">#{ticket.tid || ticket.id} - {ticket.subject}</h4>
                            <p className="text-gaming-gray text-sm">Last updated: {ticket.lastreply || ticket.date}</p>
                          </div>
                          <Badge className={`${ticket.status === 'Open' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                            {ticket.status || 'Unknown'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gaming-gray">No support tickets found.</div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Fallback WHMCS Integration when not connected */}
          {!whmcsStatus?.connected && <WHMCSIntegration />}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}