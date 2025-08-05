import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PromoBanner from "@/components/promo-banner";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Server, 
  Users,
  Monitor,
  Cpu,
  Network,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import { Link } from "wouter";

export default function ServerManagement() {

  // Get logged in client
  const [loggedInClient, setLoggedInClient] = useState<any>(null);
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

  // Fetch WHMCS services (real billing data)
  const { data: whmcsServices, isLoading: servicesLoading } = useQuery({
    queryKey: [`/api/whmcs/clients/${loggedInClient?.email}/services`],
    enabled: !!loggedInClient?.email,
    staleTime: 30 * 1000 // 30 seconds
  });

  // Test Wisp connection
  const { data: wispStatus } = useQuery({
    queryKey: ['/api/wisp/test'],
    enabled: !!loggedInClient?.id
  });



  if (!loggedInClient) {
    return (
      <div className="min-h-screen bg-gaming-black text-gaming-white">
        <PromoBanner />
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-gaming-gray mb-6">Please log in to access server management.</p>
          <Link href="/client-portal">
            <Button className="bg-gaming-green hover:bg-gaming-green/80 text-gaming-black">
              Go to Client Portal
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Filter and convert WHMCS services to server format - ONLY ACTIVE services
  const serverList = whmcsServices?.products?.product?.filter((service: any) => 
    service.status === 'Active'
  ).map((service: any) => ({
    id: service.id,
    name: service.name, // Use exact product name from WHMCS
    game: service.groupname, // Use exact group name from WHMCS
    status: 'online', // Active services are considered online
    ip: service.dedicatedip?.split(':')[0] || service.serverhostname,
    port: service.dedicatedip?.split(':')[1] || '25565',
    dedicatedip: service.dedicatedip, // Full IP:Port from WHMCS
    billingCycle: service.billingcycle,
    nextDueDate: service.nextduedate,
    recurringAmount: service.recurringamount,
    servername: service.servername,
    serverhostname: service.serverhostname,
    orderNumber: service.ordernumber,
    regDate: service.regdate
  })) || [];

  console.log('Logged in client data:', loggedInClient);
  console.log('Services data:', whmcsServices);
  console.log('Filtered active servers:', serverList);

  return (
    <div className="min-h-screen bg-gaming-black text-gaming-white">
      <PromoBanner />
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gaming-green to-gaming-blue bg-clip-text text-transparent">
            Server Management
          </h1>
          <p className="text-gaming-gray text-lg">
            Overview of your game servers - {serverList.length} active servers
          </p>
        </div>

        {servicesLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-gaming-green/20 border-t-gaming-green rounded-full animate-spin" />
            <span className="ml-3 text-gaming-gray">Loading your servers...</span>
          </div>
        ) : serverList.length === 0 ? (
          <Card className="bg-gaming-dark border-gaming-green/20">
            <CardContent className="text-center py-12">
              <Server className="w-16 h-16 text-gaming-gray mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gaming-white mb-2">No Servers Found</h3>
              <p className="text-gaming-gray mb-6">You don't have any active game servers yet.</p>
              <Link href="/pricing">
                <Button className="bg-gaming-green hover:bg-gaming-green/80 text-gaming-black">
                  Purchase a Server
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Wisp Connection Status */}
            <Card className="bg-gaming-dark border-gaming-green/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  {wispStatus?.connected ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-gaming-green" />
                      <div>
                        <h3 className="text-gaming-white font-semibold">Wisp.gg Integration Active</h3>
                        <p className="text-gaming-gray text-sm">All server data is live from your game panel</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-6 h-6 text-yellow-400" />
                      <div>
                        <h3 className="text-gaming-white font-semibold">Connection Issue</h3>
                        <p className="text-gaming-gray text-sm">Unable to connect to Wisp.gg panel</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Server Overview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {serverList.map((server: any) => (
                <Card key={server.id} className="bg-gaming-dark border-gaming-green/20 hover:border-gaming-green/40 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gaming-white flex items-center gap-2">
                        <Server className="w-5 h-5" />
                        {server.name}
                      </CardTitle>
                      <Badge 
                        variant={server.status === 'online' ? 'default' : 'secondary'}
                        className={server.status === 'online' ? 'bg-gaming-green text-gaming-black' : 'bg-gaming-gray'}
                      >
                        {server.status}
                      </Badge>
                    </div>
                    <p className="text-gaming-gray text-sm">{server.game}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Server Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-gaming-green" />
                        <span className="text-sm text-gaming-gray">
                          {server.billingCycle}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Network className="w-4 h-4 text-gaming-yellow" />
                        <span className="text-sm text-gaming-gray">
                          {server.servername}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-gaming-blue" />
                        <span className="text-sm text-gaming-gray">
                          Order #{server.orderNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-gaming-green" />
                        <span className="text-sm text-gaming-gray">
                          Since {server.regDate}
                        </span>
                      </div>
                    </div>

                    {/* Connection Info */}
                    <div className="bg-gaming-black/30 rounded-lg p-3">
                      <div className="text-xs text-gaming-gray mb-1">Server Address</div>
                      <div className="text-sm text-gaming-white font-mono">
                        {server.dedicatedip || `${server.ip}:${server.port}`}
                      </div>
                    </div>

                    {/* Game Panel Link */}
                    <a 
                      href="https://game.voltservers.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full bg-gaming-green hover:bg-gaming-green/80 text-gaming-black">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Game Panel
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}