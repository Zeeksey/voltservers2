import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  Copy,
  CheckCircle,
  Server,
  Globe,
  Gamepad2,
  Monitor,
  Tv,
  Zap,
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react';
import type { DemoServer } from '@shared/schema';

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

export default function DemoGamesSection() {
  const [copiedServer, setCopiedServer] = useState<string | null>(null);
  const [serverStatuses, setServerStatuses] = useState<Map<string, ServerStatus>>(new Map());

  // Fetch demo servers from API
  const { data: demoServers = [], isLoading } = useQuery<DemoServer[]>({
    queryKey: ['/api/demo-servers'],
  });

  // Query each server's live status
  useEffect(() => {
    if (!demoServers || demoServers.length === 0) return;

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

  if (isLoading) {
    return (
      <section className="py-20 bg-gaming-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-gaming-green">Loading demo servers...</div>
          </div>
        </div>
      </section>
    );
  }

  // Fallback demo servers if API fails
  const fallbackServers = [
  {
    id: '1',
    name: 'VoltServers Creative Hub',
    game: 'Minecraft',
    ip: 'demo.voltservers.com',
    port: '25565',
    version: '1.21.4',
    players: { online: 47, max: 100 },
    status: 'online',
    platform: 'Crossplay',
    gameMode: 'Creative',
    description: 'Build anything you can imagine in our creative showcase server'
  },
  {
    id: '2',
    name: 'VoltServers Deathmatch',
    game: 'CS2',
    ip: 'cs2-demo.voltservers.com',
    port: '27015',
    version: '2.1.9',
    players: { online: 18, max: 32 },
    status: 'online',
    platform: 'PC',
    gameMode: 'Deathmatch',
    description: 'Fast-paced deathmatch with custom maps and weapons'
  },
  {
    id: '3',
    name: 'VoltServers Survival',
    game: 'Rust',
    ip: 'rust-demo.voltservers.com',
    port: '28015',
    version: '2024.12.10',
    players: { online: 134, max: 200 },
    status: 'online',
    platform: 'PC',
    gameMode: 'Vanilla',
    description: 'Classic Rust survival experience on a fresh-wiped server'
  },
  {
    id: '4',
    name: 'VoltServers PvE Island',
    game: 'ARK: Survival',
    ip: 'ark-demo.voltservers.com',
    port: '7777',
    version: '359.38',
    players: { online: 23, max: 50 },
    status: 'online',
    platform: 'Crossplay',
    gameMode: 'PvE',
    description: 'Cooperative survival with tamed dinosaurs and friendly community'
  }
];

  // Use database demo servers or fallback
  const serversToDisplay = demoServers.length > 0 ? demoServers : fallbackServers;

  const copyToClipboard = async (text: string, serverId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedServer(serverId);
      setTimeout(() => setCopiedServer(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'offline': return 'text-red-500';
      case 'maintenance': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'offline': return <Clock className="w-4 h-4 text-red-500" />;
      case 'maintenance': return <Zap className="w-4 h-4 text-yellow-500" />;
      default: return <Server className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'PC': return <Monitor className="w-4 h-4" />;
      case 'Console': return <Tv className="w-4 h-4" />;
      case 'Crossplay': return <Globe className="w-4 h-4" />;
      default: return <Gamepad2 className="w-4 h-4" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'PC': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Console': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Crossplay': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <section className="py-20 bg-gaming-black-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gaming-green/20 text-gaming-green border-gaming-green/30">
            <Gamepad2 className="w-4 h-4 mr-1" />
            Try Before You Buy
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gaming-white mb-6">
            Connect to Our <span className="text-gaming-green">Demo Servers</span>
          </h2>
          <p className="text-xl text-gaming-gray mb-8 max-w-3xl mx-auto">
            Experience the VoltServers difference firsthand. Connect to our live demo servers and test our 
            performance, stability, and features before making your decision.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {serversToDisplay.map((server) => {
            const status = serverStatuses.get(server.id);
            const serverIp = server.serverIp || server.ip;
            const serverPort = server.serverPort || server.port;
            const serverName = server.serverName || server.name;
            const gameType = server.gameType || server.game;
            const isOnline = status?.online ?? (server.status === 'online');
            const currentPlayers = status?.players?.current ?? server.players?.online ?? 0;
            const maxPlayers = status?.players?.max ?? server.maxPlayers ?? server.players?.max ?? 100;
            
            return (
            <Card key={server.id} className="bg-gaming-black border-gaming-green/20 hover:border-gaming-green/50 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-gaming-white text-lg">{gameType}</CardTitle>
                  <div className="flex items-center gap-1">
                    {isOnline ? 
                      <Wifi className="w-4 h-4 text-green-500" /> :
                      <WifiOff className="w-4 h-4 text-red-500" />
                    }
                    <span className={`text-sm font-medium ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
                      {isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
                <h3 className="text-gaming-gray text-sm font-medium">{serverName}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`${getPlatformColor(server.platform)} flex items-center gap-1 text-xs`}>
                    {getPlatformIcon(server.platform)}
                    {server.platform}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-gaming-green/30 text-gaming-gray">
                    {server.gameMode || 'Standard'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gaming-gray text-sm">{server.description}</p>
                
                {/* Connection Info */}
                <div className="space-y-3">
                  <div className="bg-gaming-black-lighter rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gaming-gray text-xs">Server IP</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(`${serverIp}:${serverPort}`, server.id)}
                        className="h-6 w-6 p-0 hover:bg-gaming-green/20"
                      >
                        {copiedServer === server.id ? (
                          <CheckCircle className="w-3 h-3 text-gaming-green" />
                        ) : (
                          <Copy className="w-3 h-3 text-gaming-gray hover:text-gaming-green" />
                        )}
                      </Button>
                    </div>
                    <div className="font-mono text-gaming-white text-sm break-all">
                      {serverIp}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gaming-gray">Port:</span>
                      <div className="font-mono text-gaming-white">{serverPort}</div>
                    </div>
                    <div>
                      <span className="text-gaming-gray">Version:</span>
                      <div className="font-mono text-gaming-white">{server.version || status?.version || 'Unknown'}</div>
                    </div>
                  </div>
                </div>
                
                {/* Player Count */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gaming-green" />
                    <span className="text-gaming-white font-medium">
                      {currentPlayers}/{maxPlayers}
                    </span>
                    <span className="text-gaming-gray">players</span>
                  </div>
                  <div className="text-right">
                    <div className="text-gaming-green text-xs font-medium">
                      {Math.round((currentPlayers / maxPlayers) * 100)}% full
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>

        {/* Connection Instructions */}
        <div className="bg-gaming-black rounded-xl p-8 border border-gaming-green/20">
          <h3 className="text-2xl font-bold text-gaming-white mb-6 text-center">
            How to Connect
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gaming-green/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Copy className="w-6 h-6 text-gaming-green" />
              </div>
              <h4 className="text-gaming-white font-semibold mb-2">1. Copy Server IP</h4>
              <p className="text-gaming-gray text-sm">
                Click the copy button next to any server IP above to copy it to your clipboard.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gaming-green/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Gamepad2 className="w-6 h-6 text-gaming-green" />
              </div>
              <h4 className="text-gaming-white font-semibold mb-2">2. Open Your Game</h4>
              <p className="text-gaming-gray text-sm">
                Launch your game client and navigate to the multiplayer or server browser section.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gaming-green/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Server className="w-6 h-6 text-gaming-green" />
              </div>
              <h4 className="text-gaming-white font-semibold mb-2">3. Connect & Play</h4>
              <p className="text-gaming-gray text-sm">
                Paste the server IP, connect, and experience our premium hosting quality firsthand.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}