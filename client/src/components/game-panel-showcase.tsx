import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Users, 
  Activity,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Server,
  Terminal,
  FileText,
  Database,
  CheckCircle,
  Clock,
  AlertTriangle,
  Zap
} from 'lucide-react';

export default function GamePanelShowcase() {
  const [isStarting, setIsStarting] = useState(false);
  const [serverStatus, setServerStatus] = useState<'offline' | 'starting' | 'online'>('offline');
  const [playerCount, setPlayerCount] = useState(0);
  const [cpuUsage, setCpuUsage] = useState(12);
  const [ramUsage, setRamUsage] = useState(2.4);
  const [consoleLines, setConsoleLines] = useState<string[]>([
    '[12:34:21] [Server thread/INFO]: Starting minecraft server version 1.21.4',
    '[12:34:22] [Server thread/INFO]: Loading properties',
    '[12:34:23] [Server thread/INFO]: Default game type: SURVIVAL'
  ]);

  const maxPlayers = 100;
  const maxRam = 8;

  const startServer = () => {
    if (serverStatus === 'online') return;
    
    setIsStarting(true);
    setServerStatus('starting');
    setConsoleLines(prev => [...prev, '[' + new Date().toLocaleTimeString() + '] [Server thread/INFO]: Starting server...']);
    
    // Simulate server startup sequence
    setTimeout(() => {
      setConsoleLines(prev => [...prev, '[' + new Date().toLocaleTimeString() + '] [Server thread/INFO]: Preparing spawn area: 0%']);
    }, 1000);
    
    setTimeout(() => {
      setConsoleLines(prev => [...prev, '[' + new Date().toLocaleTimeString() + '] [Server thread/INFO]: Preparing spawn area: 47%']);
    }, 2000);
    
    setTimeout(() => {
      setConsoleLines(prev => [...prev, '[' + new Date().toLocaleTimeString() + '] [Server thread/INFO]: Preparing spawn area: 100%']);
    }, 3000);
    
    setTimeout(() => {
      setConsoleLines(prev => [...prev, '[' + new Date().toLocaleTimeString() + '] [Server thread/INFO]: Done (4.2s)! For help, type "help"']);
      setServerStatus('online');
      setIsStarting(false);
      setCpuUsage(45);
      setRamUsage(4.2);
      setPlayerCount(Math.floor(Math.random() * 25) + 1);
    }, 4000);
  };

  const stopServer = () => {
    if (serverStatus === 'offline') return;
    
    setServerStatus('offline');
    setPlayerCount(0);
    setCpuUsage(12);
    setRamUsage(2.4);
    setConsoleLines(prev => [...prev, '[' + new Date().toLocaleTimeString() + '] [Server thread/INFO]: Stopping server']);
  };

  const restartServer = () => {
    stopServer();
    setTimeout(() => startServer(), 1000);
  };

  useEffect(() => {
    if (serverStatus === 'online') {
      const interval = setInterval(() => {
        // Simulate real-time metrics
        setCpuUsage(prev => Math.max(20, Math.min(80, prev + (Math.random() - 0.5) * 10)));
        setRamUsage(prev => Math.max(3, Math.min(7, prev + (Math.random() - 0.5) * 0.5)));
        setPlayerCount(prev => Math.max(0, Math.min(maxPlayers, prev + Math.floor((Math.random() - 0.5) * 3))));
        
        // Add occasional console messages
        if (Math.random() < 0.3) {
          const messages = [
            'Player joined the game',
            'Player left the game',
            'Saving the game (this may take a moment!)',
            'Saved the game',
            'Automatic restart in 12 hours'
          ];
          const randomMessage = messages[Math.floor(Math.random() * messages.length)];
          setConsoleLines(prev => {
            const newLines = [...prev, '[' + new Date().toLocaleTimeString() + '] [Server thread/INFO]: ' + randomMessage];
            return newLines.slice(-10); // Keep only last 10 lines
          });
        }
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [serverStatus]);

  const getStatusColor = () => {
    switch (serverStatus) {
      case 'online': return 'text-green-400';
      case 'starting': return 'text-yellow-400';
      case 'offline': return 'text-red-400';
    }
  };

  const getStatusIcon = () => {
    switch (serverStatus) {
      case 'online': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'starting': return <Clock className="w-4 h-4 text-yellow-400 animate-spin" />;
      case 'offline': return <AlertTriangle className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <section className="py-20 bg-gaming-black-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gaming-green/20 text-gaming-green border-gaming-green/30">
            <Zap className="w-4 h-4 mr-1" />
            Interactive Demo
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gaming-white mb-4">
            Professional Game <span className="text-gaming-green">Management Panel</span>
          </h2>
          <p className="text-gaming-gray text-lg max-w-3xl mx-auto">
            Experience our powerful control panel with real-time monitoring, one-click server management, 
            and professional-grade tools designed for serious game server hosting.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Server Control Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Server Status Card */}
              <Card className="bg-gaming-black border-gaming-green/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gaming-white flex items-center gap-2">
                      <Server className="w-5 h-5 text-gaming-green" />
                      Minecraft Server - Creative Build
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {getStatusIcon()}
                      <span className={`text-sm font-medium ${getStatusColor()}`}>
                        {serverStatus.charAt(0).toUpperCase() + serverStatus.slice(1)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Server Controls */}
                  <div className="flex gap-2">
                    <Button 
                      onClick={startServer}
                      disabled={serverStatus === 'online' || isStarting}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Start
                    </Button>
                    <Button 
                      onClick={stopServer}
                      disabled={serverStatus === 'offline'}
                      variant="destructive"
                      size="sm"
                    >
                      <Pause className="w-4 h-4 mr-1" />
                      Stop
                    </Button>
                    <Button 
                      onClick={restartServer}
                      disabled={serverStatus === 'offline'}
                      variant="outline"
                      size="sm"
                      className="border-gaming-green/20 hover:border-gaming-green/50"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Restart
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="border-gaming-green/20 hover:border-gaming-green/50"
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Settings
                    </Button>
                  </div>

                  {/* Server Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gaming-black-light rounded-lg">
                      <Users className="w-5 h-5 text-gaming-green mx-auto mb-1" />
                      <div className="text-sm text-gaming-gray">Players</div>
                      <div className="text-lg font-bold text-gaming-white">{playerCount}/{maxPlayers}</div>
                    </div>
                    <div className="text-center p-3 bg-gaming-black-light rounded-lg">
                      <Cpu className="w-5 h-5 text-gaming-green mx-auto mb-1" />
                      <div className="text-sm text-gaming-gray">CPU</div>
                      <div className="text-lg font-bold text-gaming-white">{cpuUsage.toFixed(0)}%</div>
                    </div>
                    <div className="text-center p-3 bg-gaming-black-light rounded-lg">
                      <MemoryStick className="w-5 h-5 text-gaming-green mx-auto mb-1" />
                      <div className="text-sm text-gaming-gray">RAM</div>
                      <div className="text-lg font-bold text-gaming-white">{ramUsage.toFixed(1)}/{maxRam}GB</div>
                    </div>
                    <div className="text-center p-3 bg-gaming-black-light rounded-lg">
                      <Network className="w-5 h-5 text-gaming-green mx-auto mb-1" />
                      <div className="text-sm text-gaming-gray">Uptime</div>
                      <div className="text-lg font-bold text-gaming-white">99.9%</div>
                    </div>
                  </div>

                  {/* Resource Usage */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gaming-gray">CPU Usage</span>
                        <span className="text-gaming-white">{cpuUsage.toFixed(0)}%</span>
                      </div>
                      <Progress value={cpuUsage} className="h-2 bg-gaming-black-light" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gaming-gray">Memory Usage</span>
                        <span className="text-gaming-white">{ramUsage.toFixed(1)}/{maxRam}GB</span>
                      </div>
                      <Progress value={(ramUsage / maxRam) * 100} className="h-2 bg-gaming-black-light" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Console Card */}
              <Card className="bg-gaming-black border-gaming-green/20">
                <CardHeader>
                  <CardTitle className="text-gaming-white flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-gaming-green" />
                    Server Console
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gaming-black-light rounded-lg p-4 h-48 overflow-y-auto font-mono text-sm">
                    {consoleLines.map((line, index) => (
                      <div key={index} className="text-gaming-gray mb-1">
                        {line}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter server command..."
                      className="flex-1 bg-gaming-black-light border border-gaming-green/20 rounded px-3 py-2 text-gaming-white text-sm"
                      disabled={serverStatus !== 'online'}
                    />
                    <Button 
                      size="sm" 
                      disabled={serverStatus !== 'online'}
                      className="bg-gaming-green text-gaming-black hover:bg-gaming-green-dark"
                    >
                      Send
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Quick Actions & Info */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="bg-gaming-black border-gaming-green/20">
                <CardHeader>
                  <CardTitle className="text-gaming-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-gaming-green" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start border-gaming-green/20" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    File Manager
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-gaming-green/20" size="sm">
                    <Database className="w-4 h-4 mr-2" />
                    Backup Manager
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-gaming-green/20" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    Player Management
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-gaming-green/20" size="sm">
                    <Activity className="w-4 h-4 mr-2" />
                    Performance Logs
                  </Button>
                </CardContent>
              </Card>

              {/* Server Info */}
              <Card className="bg-gaming-black border-gaming-green/20">
                <CardHeader>
                  <CardTitle className="text-gaming-white flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-gaming-green" />
                    Server Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gaming-gray">Game Version</span>
                    <span className="text-gaming-white">1.21.4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gaming-gray">Server IP</span>
                    <span className="text-gaming-white font-mono">play.voltservers.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gaming-gray">Location</span>
                    <span className="text-gaming-white">US East</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gaming-gray">Plan</span>
                    <span className="text-gaming-white">Pro (8GB RAM)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gaming-gray">Storage</span>
                    <span className="text-gaming-white">25GB NVMe SSD</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-gaming-black border-gaming-green/20">
                <CardHeader>
                  <CardTitle className="text-gaming-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-gaming-green" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="text-gaming-white">Server started</div>
                      <div className="text-gaming-gray text-xs">2 minutes ago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="text-gaming-white">Backup completed</div>
                      <div className="text-gaming-gray text-xs">1 hour ago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="text-gaming-white">Plugin updated</div>
                      <div className="text-gaming-gray text-xs">3 hours ago</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-4 bg-gaming-black/50 backdrop-blur-sm border border-gaming-green/20 rounded-lg p-6">
              <div className="text-left">
                <h3 className="text-xl font-bold text-gaming-white mb-1">Ready to get started?</h3>
                <p className="text-gaming-gray">Deploy your own server with this exact control panel in under 60 seconds.</p>
              </div>
              <Button className="bg-gaming-green text-gaming-black hover:bg-gaming-green-dark font-semibold">
                Deploy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}