import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Globe, Globe2, Server, Activity, RefreshCw, CheckCircle, AlertCircle, Clock } from "lucide-react";
import type { ServerStatus as ServerStatusType, ServerLocation } from "@shared/schema";

export default function ServerStatus() {
  const [customServer, setCustomServer] = useState("");
  const [customPort, setCustomPort] = useState("25565");
  const [pingResults, setPingResults] = useState<any[]>([]);
  const [isPinging, setIsPinging] = useState(false);

  const { data: statusData, isLoading: statusLoading } = useQuery<ServerStatusType[]>({
    queryKey: ['/api/server-status'],
  });

  const { data: locations, isLoading: locationsLoading } = useQuery<ServerLocation[]>({
    queryKey: ['/api/server-locations'],
  });

  const pingServer = async (address: string, port: string = "25565") => {
    setIsPinging(true);
    try {
      const startTime = Date.now();
      const response = await fetch(`/api/query-server/${address}/${port}`);
      const endTime = Date.now();
      const data = await response.json();
      
      const pingResult = {
        address: `${address}:${port}`,
        online: data.online,
        ping: endTime - startTime,
        players: data.players,
        version: data.version,
        motd: data.motd,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setPingResults(prev => [pingResult, ...prev.slice(0, 4)]); // Keep last 5 results
    } catch (error) {
      const pingResult = {
        address: `${address}:${port}`,
        online: false,
        ping: null,
        timestamp: new Date().toLocaleTimeString(),
        error: "Failed to connect"
      };
      setPingResults(prev => [pingResult, ...prev.slice(0, 4)]);
    } finally {
      setIsPinging(false);
    }
  };

  const handlePingCustomServer = () => {
    if (customServer) {
      pingServer(customServer, customPort);
    }
  };

  if (statusLoading || locationsLoading) {
    return (
      <section id="status" className="py-20 bg-gaming-black-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-gaming-green">Server</span> Status
            </h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-gaming-black-lighter rounded-xl p-6 animate-pulse">
              <div className="h-8 bg-gaming-black rounded mb-6" />
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 bg-gaming-black rounded" />
                ))}
              </div>
            </div>
            <div className="bg-gaming-black-lighter rounded-xl p-6 animate-pulse">
              <div className="h-8 bg-gaming-black rounded mb-6" />
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gaming-black rounded" />
                    <div className="h-2 bg-gaming-black rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const overallStatus = statusData?.every(s => s.status === 'operational') ? 'operational' : 'degraded';

  return (
    <section id="status" className="py-20 bg-gaming-black-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gaming-green">Server</span> Status
          </h2>
          <p className="text-xl text-gaming-gray max-w-3xl mx-auto">
            Real-time monitoring of our infrastructure. All systems operational with 99.9% uptime.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Overall Status */}
          <Card className="bg-gaming-black-lighter border-gaming-black-lighter">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gaming-white">Overall Status</h3>
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${overallStatus === 'operational' ? 'bg-gaming-green animate-pulse-green' : 'bg-red-500'}`} />
                  <span className={`font-semibold ${overallStatus === 'operational' ? 'text-gaming-green' : 'text-red-500'}`}>
                    {overallStatus === 'operational' ? 'All Systems Operational' : 'Some Issues Detected'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                {statusData?.map((service) => (
                  <div key={service.id} className="flex items-center justify-between">
                    <span className="text-gaming-gray">{service.service}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${service.status === 'operational' ? 'bg-gaming-green animate-pulse-green' : 'bg-red-500'}`} />
                      <span className={`text-sm ${service.status === 'operational' ? 'text-gaming-green' : 'text-red-500'}`}>
                        {service.status === 'operational' ? 'Operational' : 'Degraded'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="bg-gaming-black-lighter border-gaming-black-lighter">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gaming-white mb-6">Performance Metrics</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gaming-gray">Average Response Time</span>
                    <span className="text-gaming-green font-semibold">
                      {statusData?.[0]?.responseTime || 12}ms
                    </span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gaming-gray">Server Uptime</span>
                    <span className="text-gaming-green font-semibold">
                      {statusData?.[0]?.uptime || "99.97"}%
                    </span>
                  </div>
                  <Progress value={parseFloat(statusData?.[0]?.uptime?.toString() || "99.97")} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gaming-gray">Network Quality</span>
                    <span className="text-gaming-green font-semibold">Excellent</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Server Ping Tool */}
          <Card className="bg-gaming-black-lighter border-gaming-black-lighter">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-gaming-green" />
                Server Ping Tool
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="server-address">Server Address</Label>
                  <Input
                    id="server-address"
                    placeholder="mc.hypixel.net"
                    value={customServer}
                    onChange={(e) => setCustomServer(e.target.value)}
                    className="bg-gaming-black border-gaming-black text-gaming-white"
                  />
                </div>
                <div>
                  <Label htmlFor="server-port">Port</Label>
                  <Input
                    id="server-port"
                    placeholder="25565"
                    value={customPort}
                    onChange={(e) => setCustomPort(e.target.value)}
                    className="bg-gaming-black border-gaming-black text-gaming-white"
                  />
                </div>
                <Button 
                  onClick={handlePingCustomServer}
                  disabled={isPinging || !customServer}
                  className="w-full bg-gaming-green text-gaming-black hover:shadow-lg"
                >
                  {isPinging ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Pinging...
                    </>
                  ) : (
                    <>
                      <Server className="h-4 w-4 mr-2" />
                      Ping Server
                    </>
                  )}
                </Button>
                
                {pingResults.length > 0 && (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    <h4 className="text-sm font-semibold text-gaming-gray">Recent Pings</h4>
                    {pingResults.map((result, index) => (
                      <div key={index} className="bg-gaming-black p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gaming-white text-sm font-mono">{result.address}</span>
                          <div className="flex items-center gap-2">
                            {result.online ? (
                              <CheckCircle className="h-3 w-3 text-gaming-green" />
                            ) : (
                              <AlertCircle className="h-3 w-3 text-red-500" />
                            )}
                            <span className="text-xs text-gaming-gray">{result.timestamp}</span>
                          </div>
                        </div>
                        {result.online ? (
                          <div className="text-xs text-gaming-gray space-y-1">
                            {result.ping && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Ping: {result.ping}ms</span>
                              </div>
                            )}
                            {result.players && (
                              <div>Players: {result.players.current}/{result.players.max}</div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-red-500">
                            {result.error || "Server offline"}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Server Locations */}
        <Card className="bg-gaming-black-lighter border-gaming-black-lighter">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gaming-white mb-6">Server Locations</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {locations?.map((location) => (
                <div key={location.id} className="text-center p-4 bg-gaming-black rounded-lg">
                  <div className="text-gaming-green text-2xl mb-2">
                    {location.region === 'North America' && <Globe />}
                    {location.region === 'Europe' && <Globe2 />}
                    {location.region === 'Asia Pacific' && <Globe />}
                    {location.region === 'Australia' && <Globe2 />}
                  </div>
                  <div className="text-gaming-white font-semibold">{location.region}</div>
                  <div className="text-gaming-gray text-sm">{location.name}</div>
                  <div className="flex items-center justify-center mt-2">
                    <span className={`w-2 h-2 rounded-full mr-2 ${location.status === 'online' ? 'bg-gaming-green animate-pulse-green' : 'bg-red-500'}`} />
                    <span className={`text-sm ${location.status === 'online' ? 'text-gaming-green' : 'text-red-500'}`}>
                      {location.status === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
