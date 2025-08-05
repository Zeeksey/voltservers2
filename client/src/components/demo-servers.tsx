import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Clock, Users, Server, Copy, ExternalLink, Wifi, WifiOff, Activity } from "lucide-react";
import type { DemoServer } from "@shared/schema";

interface ServerStatus {
  online: boolean;
  players: {
    current: number;
    max: number;
  };
  version: string;
  motd: string;
  ping: number;
  hostname: string;
  port: number;
  software: string;
}

export default function DemoServers() {
  const [copying, setCopying] = useState<string | null>(null);
  const [serverStatuses, setServerStatuses] = useState<Map<string, ServerStatus>>(new Map());
  
  const { data: demoServers, isLoading } = useQuery<DemoServer[]>({
    queryKey: ['/api/demo-servers'],
  });

  // Query each server's live status
  useEffect(() => {
    if (!demoServers) return;

    const queryAllServers = async () => {
      const statusPromises = demoServers.map(async (server) => {
        try {
          const response = await fetch(`/api/query-server/${server.serverIp}/${server.serverPort}`);
          if (response.ok) {
            const status = await response.json();
            return { serverId: server.id, status };
          }
        } catch (error) {
          console.error(`Failed to query server ${server.serverIp}:${server.serverPort}`, error);
        }
        return { 
          serverId: server.id, 
          status: { 
            online: false, 
            players: { current: 0, max: server.maxPlayers },
            version: "Unknown",
            motd: "Server offline",
            ping: 0,
            hostname: server.serverIp,
            port: server.serverPort,
            software: "Unknown"
          } 
        };
      });

      const results = await Promise.all(statusPromises);
      const statusMap = new Map();
      results.forEach(({ serverId, status }) => {
        statusMap.set(serverId, status);
      });
      setServerStatuses(statusMap);
    };

    queryAllServers();
    
    // Refresh every 60 seconds to reduce server load
    const interval = setInterval(queryAllServers, 60000);
    return () => clearInterval(interval);
  }, [demoServers]);

  const handleCopyServerInfo = async (server: DemoServer) => {
    const serverInfo = `${server.serverIp}:${server.serverPort}`;
    await navigator.clipboard.writeText(serverInfo);
    setCopying(server.id);
    setTimeout(() => setCopying(null), 2000);
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gaming-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-gaming-green">Try</span> Our Servers
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-gaming-black-lighter rounded-xl p-8 animate-pulse">
                <div className="h-8 bg-gaming-black rounded mb-4" />
                <div className="h-4 bg-gaming-black rounded mb-6" />
                <div className="space-y-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-4 bg-gaming-black rounded" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gaming-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gaming-green">Try</span> Our Servers
          </h2>
          <p className="text-xl text-gaming-gray max-w-3xl mx-auto">
            Test our server performance before you buy. Join our demo servers and experience the difference quality hosting makes.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {demoServers?.map((server) => {
            const status = serverStatuses.get(server.id);
            const isOnline = status?.online ?? false;
            const currentPlayers = status?.players.current ?? 0;
            const maxPlayers = status?.players.max ?? server.maxPlayers;
            const playerPercentage = maxPlayers > 0 ? (currentPlayers / maxPlayers) * 100 : 0;

            return (
              <Card key={server.id} className="bg-gaming-black-lighter border-gaming-black-lighter hover:shadow-xl hover:shadow-gaming-green/20 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gaming-white">{server.serverName}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge className={isOnline ? "bg-gaming-green text-gaming-black" : "bg-red-500 text-white"}>
                        {isOnline ? (
                          <>
                            <Wifi className="h-3 w-3 mr-1" />
                            Online
                          </>
                        ) : (
                          <>
                            <WifiOff className="h-3 w-3 mr-1" />
                            Offline
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-gaming-gray mb-6">{server.description}</p>
                  
                  {status?.motd && status.motd !== "Server offline" && (
                    <div className="bg-gaming-black p-3 rounded-lg mb-4">
                      <div className="text-gaming-gray text-xs mb-1">Server Message:</div>
                      <div className="text-gaming-white text-sm">{status.motd}</div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gaming-black p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="text-gaming-green h-4 w-4" />
                        <span className="text-gaming-gray text-sm">Players</span>
                      </div>
                      <div className="text-gaming-white font-semibold">
                        {currentPlayers}/{maxPlayers}
                      </div>
                      <Progress 
                        value={playerPercentage} 
                        className="mt-2 h-2" 
                      />
                    </div>
                    
                    <div className="bg-gaming-black p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Activity className="text-gaming-green h-4 w-4" />
                        <span className="text-gaming-gray text-sm">
                          {isOnline ? "Ping" : "Status"}
                        </span>
                      </div>
                      <div className="text-gaming-white font-semibold">
                        {isOnline ? `${status?.ping || 0}ms` : "Offline"}
                      </div>
                    </div>
                  </div>
                  
                  {status?.version && isOnline && (
                    <div className="bg-gaming-black p-3 rounded-lg mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-gaming-gray text-xs">Version: </span>
                          <span className="text-gaming-white text-sm font-mono">{status.version}</span>
                        </div>
                        {status.software && status.software !== "Unknown" && (
                          <Badge variant="outline" className="text-xs border-gaming-green text-gaming-green">
                            {status.software}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-gaming-black p-4 rounded-lg mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Server className="text-gaming-green h-4 w-4" />
                        <span className="text-gaming-gray text-sm">Server Address</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyServerInfo(server)}
                        className="text-gaming-green hover:text-gaming-green-dark"
                      >
                        {copying === server.id ? "Copied!" : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                    <div className="text-gaming-white font-mono text-sm">
                      {server.serverIp}:{server.serverPort}
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button 
                      disabled={!isOnline}
                      className="flex-1 bg-gaming-green text-gaming-black hover:shadow-lg hover:shadow-gaming-green/30 disabled:opacity-50"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      {isOnline ? "Join Server" : "Server Offline"}
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-gaming-black"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Stats
                    </Button>
                  </div>
                  
                  {server.playtime && (
                    <div className="mt-4 p-3 bg-gaming-green/10 rounded-lg border border-gaming-green/20">
                      <div className="flex items-center justify-between">
                        <span className="text-gaming-green text-sm font-medium">
                          <Clock className="inline h-3 w-3 mr-1" />
                          Demo Time Limit: {server.playtime} minutes
                        </span>
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <div className="bg-gaming-black-lighter rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gaming-white mb-4">
              Ready to Get Your Own Server?
            </h3>
            <p className="text-gaming-gray mb-6">
              Experience the power of our hosting firsthand. Our demo servers run on the same infrastructure as our premium plans.
            </p>
            <Button className="bg-gradient-green text-gaming-black hover:shadow-lg hover:shadow-gaming-green/30">
              Get Started Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}