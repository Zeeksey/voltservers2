import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PromoBanner from "@/components/promo-banner";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  FileText, 
  Download, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  Receipt,
  TrendingUp,
  Wallet
} from "lucide-react";
import { Link } from "wouter";

export default function BillingManagement() {
  const [loggedInClient, setLoggedInClient] = useState<any>(null);

  // Get logged in client
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

  // Fetch WHMCS invoices using email instead of ID for better compatibility
  const { data: invoices, isLoading: invoicesLoading } = useQuery({
    queryKey: [`/api/whmcs/clients/${loggedInClient?.email}/invoices`],
    enabled: !!loggedInClient?.email,
    staleTime: 60 * 1000 // 1 minute
  });

  // Fetch WHMCS services for billing summary
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: [`/api/whmcs/clients/${loggedInClient?.email}/services`],
    enabled: !!loggedInClient?.email,
    staleTime: 60 * 1000
  });

  // Debug client data
  console.log('Logged in client data:', loggedInClient);
  console.log('Invoices data:', invoices);
  console.log('Services data:', services);

  if (!loggedInClient) {
    return (
      <div className="min-h-screen bg-gaming-black text-gaming-white">
        <PromoBanner />
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-gaming-gray mb-6">Please log in to access billing management.</p>
          <Link href="/client-portal">
            <Button className="bg-gaming-green hover:bg-gaming-green/80 text-gaming-black">
              Go to Client Portal
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const invoiceList = invoices?.invoices?.invoice || [];
  const serviceList = services?.products?.product || [];

  // Calculate billing statistics
  const totalMonthly = serviceList.reduce((sum: number, service: any) => {
    const amount = parseFloat(service.amount || service.recurringamount || '0');
    return sum + amount;
  }, 0);

  const unpaidInvoices = invoiceList.filter((inv: any) => inv.status === 'Unpaid');
  const overdueInvoices = invoiceList.filter((inv: any) => 
    inv.status === 'Unpaid' && new Date(inv.duedate) < new Date()
  );

  const totalUnpaid = unpaidInvoices.reduce((sum: number, inv: any) => {
    return sum + parseFloat(inv.total || '0');
  }, 0);

  return (
    <div className="min-h-screen bg-gaming-black text-gaming-white">
      <PromoBanner />
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gaming-green to-gaming-blue bg-clip-text text-transparent">
            Billing Management
          </h1>
          <p className="text-gaming-gray text-lg">
            Manage your billing, invoices, and payment methods
          </p>
        </div>

        {/* Billing Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gaming-dark border-gaming-green/20">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gaming-green/20 rounded-lg mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-gaming-green" />
              </div>
              <div className="text-2xl font-bold text-gaming-green mb-1">
                ${totalMonthly.toFixed(2)}
              </div>
              <div className="text-gaming-gray text-sm">Monthly Billing</div>
            </CardContent>
          </Card>

          <Card className="bg-gaming-dark border-gaming-green/20">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mx-auto mb-3">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {invoiceList.length}
              </div>
              <div className="text-gaming-gray text-sm">Total Invoices</div>
            </CardContent>
          </Card>

          <Card className="bg-gaming-dark border-gaming-green/20">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-500/20 rounded-lg mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {unpaidInvoices.length}
              </div>
              <div className="text-gaming-gray text-sm">Unpaid Invoices</div>
            </CardContent>
          </Card>

          <Card className="bg-gaming-dark border-gaming-green/20">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-lg mx-auto mb-3">
                <Clock className="w-6 h-6 text-red-400" />
              </div>
              <div className="text-2xl font-bold text-red-400 mb-1">
                ${totalUnpaid.toFixed(2)}
              </div>
              <div className="text-gaming-gray text-sm">Amount Due</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="invoices" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gaming-dark">
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="space-y-6">
            {/* Overdue Invoices Alert */}
            {overdueInvoices.length > 0 && (
              <Card className="bg-red-500/10 border-red-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                    <div>
                      <h3 className="text-red-400 font-semibold">
                        {overdueInvoices.length} Overdue Invoice{overdueInvoices.length > 1 ? 's' : ''}
                      </h3>
                      <p className="text-gaming-gray text-sm">
                        Please pay your overdue invoices to avoid service interruption
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Invoice List */}
            <Card className="bg-gaming-dark border-gaming-green/20">
              <CardHeader>
                <CardTitle className="text-gaming-white flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Invoice History ({invoiceList.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {invoicesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-gaming-green/20 border-t-gaming-green rounded-full animate-spin" />
                    <span className="ml-3 text-gaming-gray">Loading invoices...</span>
                  </div>
                ) : invoiceList.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gaming-gray mx-auto mb-4" />
                    <div className="text-gaming-gray">No invoices found</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {invoiceList.map((invoice: any, index: number) => (
                      <div key={index} className="bg-gaming-black-lighter p-4 rounded-lg border border-gaming-green/20">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                          {/* Invoice Info */}
                          <div>
                            <h4 className="text-gaming-white font-semibold">
                              #{invoice.invoicenum}
                            </h4>
                            <p className="text-gaming-gray text-sm">
                              {new Date(invoice.date).toLocaleDateString()}
                            </p>
                          </div>

                          {/* Amount */}
                          <div className="text-center">
                            <div className="text-gaming-green font-bold text-lg">
                              ${parseFloat(invoice.total || '0').toFixed(2)}
                            </div>
                            <div className="text-gaming-gray text-sm">
                              {invoice.paymentmethod || 'Credit Card'}
                            </div>
                          </div>

                          {/* Due Date */}
                          <div className="text-center">
                            <div className="text-gaming-white text-sm">
                              {new Date(invoice.duedate).toLocaleDateString()}
                            </div>
                            {invoice.status === 'Unpaid' && new Date(invoice.duedate) < new Date() && (
                              <div className="text-red-400 text-xs">
                                {Math.floor((Date.now() - new Date(invoice.duedate).getTime()) / (1000 * 60 * 60 * 24))} days overdue
                              </div>
                            )}
                          </div>

                          {/* Status */}
                          <div className="text-center">
                            <Badge className={`${
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
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-gaming-green/20 text-gaming-white hover:bg-gaming-green/10"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              PDF
                            </Button>
                            {invoice.status === 'Unpaid' && (
                              <Button 
                                size="sm"
                                className="bg-gaming-green hover:bg-gaming-green/80 text-gaming-black"
                              >
                                Pay Now
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card className="bg-gaming-dark border-gaming-green/20">
              <CardHeader>
                <CardTitle className="text-gaming-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Active Services ({serviceList.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {servicesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-gaming-green/20 border-t-gaming-green rounded-full animate-spin" />
                    <span className="ml-3 text-gaming-gray">Loading services...</span>
                  </div>
                ) : serviceList.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 text-gaming-gray mx-auto mb-4" />
                    <div className="text-gaming-gray">No active services found</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {serviceList.map((service: any, index: number) => (
                      <div key={index} className="bg-gaming-black-lighter p-4 rounded-lg border border-gaming-green/20">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                          {/* Service Info */}
                          <div>
                            <h4 className="text-gaming-white font-semibold">
                              {service.serverDetails?.gameType || service.productname}
                            </h4>
                            <p className="text-gaming-gray text-sm">
                              {service.domain || service.serverDetails?.ip}
                            </p>
                          </div>

                          {/* Billing */}
                          <div className="text-center">
                            <div className="text-gaming-green font-bold">
                              ${parseFloat(service.amount || service.recurringamount || '0').toFixed(2)}
                            </div>
                            <div className="text-gaming-gray text-sm">
                              {service.billingcycle || 'Monthly'}
                            </div>
                          </div>

                          {/* Next Due */}
                          <div className="text-center">
                            <div className="text-gaming-white text-sm">
                              {service.nextduedate ? new Date(service.nextduedate).toLocaleDateString() : 'N/A'}
                            </div>
                            <div className="text-gaming-gray text-xs">Next Due</div>
                          </div>

                          {/* Status */}
                          <div className="text-center">
                            <Badge className={`${
                              service.domainstatus === 'Active' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {service.domainstatus}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-6">
            <Card className="bg-gaming-dark border-gaming-green/20">
              <CardHeader>
                <CardTitle className="text-gaming-white flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gaming-gray mx-auto mb-4" />
                  <h3 className="text-gaming-white font-semibold mb-2">Payment Methods</h3>
                  <p className="text-gaming-gray mb-4">
                    Payment methods are managed through your WHMCS client area
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-gaming-green/20 text-gaming-white hover:bg-gaming-green/10"
                  >
                    Manage Payment Methods
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
}