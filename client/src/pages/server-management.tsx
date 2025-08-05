import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PromoBanner from "@/components/promo-banner";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Server, 
  Play, 
  Square, 
  RotateCcw, 
  Settings, 
  Users,
  Monitor,
  Activity,
  HardDrive,
  Cpu,
  Network,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Shield,
  ExternalLink
} from "lucide-react";
import { Link } from "wouter";

export default function ServerManagement() {
  const [selectedServer, setSelectedServer] = useState<any>(null);
  const queryClient = useQueryClient();

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

  // Fetch Wisp servers data
  const { data: servers, isLoading: serversLoading } = useQuery({
    queryKey: ['/api/wisp/servers'],
    enabled: !!loggedInClient?.id,
    staleTime: 30 * 1000 // 30 seconds
  });

  // Test Wisp connection
  const { data: wispStatus } = useQuery({
    queryKey: ['/api/wisp/test'],
    enabled: !!loggedInClient?.id
  });

  // Server action mutations
  const serverActionMutation = useMutation({
    mutationFn: async ({ serverId, action }: { serverId: string, action: string }) => {
      const response = await fetch(`/api/wisp/servers/${serverId}/power`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (!response.ok) throw new Error('Server action failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wisp/servers'] });
    }
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

  const serverList = servers || [];

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
            Manage and monitor your game servers - {serverList.length} active servers
          </p>
        </div>

        {serversLoading ? (
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Server List */}
            <div className="lg:col-span-1">
              <Card className="bg-gaming-dark border-gaming-green/20">
                <CardHeader>
                  <CardTitle className="text-gaming-white flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    Your Servers ({serverList.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {serverList.map((server: any, index: number) => (
                    <div
                      key={index}
                      onClick={() => setSelectedServer(server)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedServer?.id === server.id
                          ? 'border-gaming-green bg-gaming-green/10'
                          : 'border-gaming-green/20 hover:border-gaming-green/40'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-gaming-white font-semibold text-sm">
                            {server.serverDetails?.gameType || server.productname || 'Game Server'}
                          </h4>
                          <p className="text-gaming-gray text-xs">
                            {server.serverDetails?.ip || server.domain}
                          </p>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          server.serverDetails?.status === 'Online' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                      </div>
                      <Badge className={`mt-2 text-xs ${
                        server.domainstatus === 'Active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {server.domainstatus}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Server Details */}
            <div className="lg:col-span-2">
              {selectedServer ? (
                <Tabs defaultValue="overview" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4 bg-gaming-dark">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="console">Console</TabsTrigger>
                    <TabsTrigger value="files">Files</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    {/* Server Controls */}
                    <Card className="bg-gaming-dark border-gaming-green/20">
                      <CardHeader>
                        <CardTitle className="text-gaming-white flex items-center gap-2">
                          <Monitor className="w-5 h-5" />
                          Server Controls
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 mb-6">
                          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                            selectedServer.serverDetails?.status === 'Online' 
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              selectedServer.serverDetails?.status === 'Online' ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                            <span className="text-sm font-medium">
                              {selectedServer.serverDetails?.status || 'Unknown'}
                            </span>
                          </div>
                          <div className="text-gaming-gray text-sm">
                            Uptime: {selectedServer.serverDetails?.uptime || '99.9%'}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => serverActionMutation.mutate({ serverId: selectedServer.id, action: 'start' })}
                            disabled={serverActionMutation.isPending}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Start
                          </Button>
                          <Button 
                            variant="outline" 
                            className="border-red-500 text-red-400 hover:bg-red-500/10"
                            onClick={() => serverActionMutation.mutate({ serverId: selectedServer.id, action: 'stop' })}
                            disabled={serverActionMutation.isPending}
                          >
                            <Square className="w-4 h-4 mr-2" />
                            Stop
                          </Button>
                          <Button 
                            variant="outline" 
                            className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
                            onClick={() => serverActionMutation.mutate({ serverId: selectedServer.id, action: 'restart' })}
                            disabled={serverActionMutation.isPending}
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Restart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Server Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-gaming-dark border-gaming-green/20">
                        <CardHeader>
                          <CardTitle className="text-gaming-white text-lg flex items-center gap-2">
                            <Network className="w-5 h-5" />
                            Connection Info
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <span className="text-gaming-gray text-sm">Server IP:</span>
                            <div className="text-gaming-white font-mono text-sm">
                              {selectedServer.serverDetails?.ip || selectedServer.dedicatedip || 'N/A'}
                            </div>
                          </div>
                          <div>
                            <span className="text-gaming-gray text-sm">Port:</span>
                            <div className="text-gaming-white font-mono text-sm">
                              {selectedServer.serverDetails?.port || '25565'}
                            </div>
                          </div>
                          <div>
                            <span className="text-gaming-gray text-sm">Location:</span>
                            <div className="text-gaming-white text-sm">
                              {selectedServer.serverDetails?.location || 'Global Network'}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gaming-dark border-gaming-green/20">
                        <CardHeader>
                          <CardTitle className="text-gaming-white text-lg flex items-center gap-2">
                            <Cpu className="w-5 h-5" />
                            Server Specs
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-gaming-gray text-sm">RAM:</span>
                              <div className="text-gaming-green font-semibold">
                                {selectedServer.serverDetails?.specs?.ram || '4GB'}
                              </div>
                            </div>
                            <div>
                              <span className="text-gaming-gray text-sm">Storage:</span>
                              <div className="text-gaming-green font-semibold">
                                {selectedServer.serverDetails?.specs?.storage || 'SSD'}
                              </div>
                            </div>
                            <div>
                              <span className="text-gaming-gray text-sm">CPU:</span>
                              <div className="text-gaming-green font-semibold">
                                {selectedServer.serverDetails?.specs?.cpu || 'High CPU'}
                              </div>
                            </div>
                            <div>
                              <span className="text-gaming-gray text-sm">Bandwidth:</span>
                              <div className="text-gaming-green font-semibold">
                                {selectedServer.serverDetails?.specs?.bandwidth || 'Unlimited'}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="console">
                    <Card className="bg-gaming-dark border-gaming-green/20">
                      <CardHeader>
                        <CardTitle className="text-gaming-white flex items-center gap-2">
                          <Activity className="w-5 h-5" />
                          Server Console
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gaming-black p-4 rounded-lg font-mono text-sm text-gaming-white min-h-[400px] border border-gaming-green/20">
                          <div className="text-green-400">[INFO] Server starting...</div>
                          <div className="text-gaming-white">[INFO] Loading world data...</div>
                          <div className="text-green-400">[INFO] Server ready! Players can now connect.</div>
                          <div className="text-gaming-gray">[CONSOLE] Real-time console integration requires WHMCS module configuration</div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="files">
                    <Card className="bg-gaming-dark border-gaming-green/20">
                      <CardHeader>
                        <CardTitle className="text-gaming-white flex items-center gap-2">
                          <HardDrive className="w-5 h-5" />
                          File Manager
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <HardDrive className="w-12 h-12 text-gaming-gray mx-auto mb-4" />
                          <h3 className="text-gaming-white font-semibold mb-2">File Manager</h3>
                          <p className="text-gaming-gray mb-4">Manage your server files and configurations</p>
                          <Button 
                            variant="outline" 
                            className="border-gaming-green/20 text-gaming-white hover:bg-gaming-green/10"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open File Manager
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="settings">
                    <Card className="bg-gaming-dark border-gaming-green/20">
                      <CardHeader>
                        <CardTitle className="text-gaming-white flex items-center gap-2">
                          <Settings className="w-5 h-5" />
                          Server Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-gaming-white font-semibold mb-3">Game Settings</h4>
                            <div className="space-y-3">
                              <div>
                                <span className="text-gaming-gray text-sm">Server Name:</span>
                                <div className="text-gaming-white">
                                  {selectedServer.productname || 'Game Server'}
                                </div>
                              </div>
                              <div>
                                <span className="text-gaming-gray text-sm">Game Mode:</span>
                                <div className="text-gaming-white">Survival</div>
                              </div>
                              <div>
                                <span className="text-gaming-gray text-sm">Difficulty:</span>
                                <div className="text-gaming-white">Normal</div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-gaming-white font-semibold mb-3">Network Settings</h4>
                            <div className="space-y-3">
                              <div>
                                <span className="text-gaming-gray text-sm">Max Players:</span>
                                <div className="text-gaming-white">20</div>
                              </div>
                              <div>
                                <span className="text-gaming-gray text-sm">PvP:</span>
                                <div className="text-gaming-white">Enabled</div>
                              </div>
                              <div>
                                <span className="text-gaming-gray text-sm">Whitelist:</span>
                                <div className="text-gaming-white">Disabled</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              ) : (
                <Card className="bg-gaming-dark border-gaming-green/20">
                  <CardContent className="text-center py-12">
                    <Server className="w-16 h-16 text-gaming-gray mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gaming-white mb-2">Select a Server</h3>
                    <p className="text-gaming-gray">Choose a server from the list to manage it</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}