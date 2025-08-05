import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Server, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Users, 
  HardDrive, 
  Cpu, 
  Activity,
  Download,
  Upload,
  Calendar,
  Clock,
  Globe,
  Shield,
  Database,
  Terminal,
  FileText,
  Archive,
  Zap,
  Eye,
  EyeOff
} from "lucide-react";

interface ServerService {
  id: string;
  name: string;
  game: string;
  status: 'online' | 'offline' | 'starting' | 'stopping';
  players: { current: number; max: number };
  uptime: string;
  location: string;
  plan: string;
  ip: string;
  resources: {
    cpu: number;
    ram: { used: number; total: number };
    storage: { used: number; total: number };
  };
  network: {
    upload: string;
    download: string;
  };
  lastBackup: string;
  nextBilling: string;
}

export default function ServiceManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [hideIPs, setHideIPs] = useState(false);
  
  const services: ServerService[] = [
    {
      id: 'srv-001',
      name: 'My Minecraft Server',
      game: 'Minecraft',
      status: 'online',
      players: { current: 24, max: 50 },
      uptime: '15d 7h 23m',
      location: 'New York, US',
      plan: 'Iron Plan (4GB)',
      ip: '198.51.100.42',
      resources: {
        cpu: 45,
        ram: { used: 2.1, total: 4.0 },
        storage: { used: 12.5, total: 25.0 }
      },
      network: {
        upload: '1.2 MB/s',
        download: '850 KB/s'
      },
      lastBackup: '2 hours ago',
      nextBilling: 'Jan 15, 2025'
    },
    {
      id: 'srv-002',
      name: 'PvP Arena Server',
      game: 'Minecraft',
      status: 'offline',
      players: { current: 0, max: 100 },
      uptime: '0d 0h 0m',
      location: 'London, UK',
      plan: 'Diamond Plan (8GB)',
      ip: '203.0.113.89',
      resources: {
        cpu: 0,
        ram: { used: 0, total: 8.0 },
        storage: { used: 8.2, total: 50.0 }
      },
      network: {
        upload: '0 MB/s',
        download: '0 MB/s'
      },
      lastBackup: '1 day ago',
      nextBilling: 'Jan 20, 2025'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'offline': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'starting': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'stopping': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleServerAction = (action: string, serverId: string) => {
    console.log(`${action} server ${serverId}`);
    // Here you would integrate with your actual server management API
  };

  return (
    <div className="space-y-6">
      {/* Control Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gaming-white">Your Servers</h2>
          <p className="text-gaming-gray">Manage and monitor your game servers</p>
        </div>
        <Button
          variant="outline"
          size="sm"  
          onClick={() => setHideIPs(!hideIPs)}
          className="border-gaming-green/30 text-gaming-green hover:bg-gaming-green/10"
        >
          {hideIPs ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
          {hideIPs ? 'Show IPs' : 'Hide IPs'}
        </Button>
      </div>

      {/* Service Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {services.map((service) => (
          <Card key={service.id} className="bg-gaming-dark border-gaming-green/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gaming-white text-base md:text-lg">{service.name}</CardTitle>
                <Badge className={getStatusColor(service.status)}>
                  {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gaming-gray">
                <div className="flex items-center space-x-1">
                  <Server className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{service.game}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">{service.location}</span>
                  <span className="sm:hidden">{service.location.split(',')[0]}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{service.players.current}/{service.players.max}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Resource Usage */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gaming-gray">CPU Usage</span>
                    <span className="text-gaming-green">{service.resources.cpu}%</span>
                  </div>
                  <Progress value={service.resources.cpu} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gaming-gray">RAM Usage</span>
                    <span className="text-gaming-green">
                      {service.resources.ram.used}GB / {service.resources.ram.total}GB
                    </span>
                  </div>
                  <Progress value={(service.resources.ram.used / service.resources.ram.total) * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gaming-gray">Storage</span>
                    <span className="text-gaming-green">
                      {service.resources.storage.used}GB / {service.resources.storage.total}GB
                    </span>
                  </div>
                  <Progress value={(service.resources.storage.used / service.resources.storage.total) * 100} className="h-2" />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gaming-black-lighter p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-gaming-gray mb-1">
                    <Clock className="w-4 h-4" />
                    <span>Uptime</span>
                  </div>
                  <div className="text-gaming-white font-medium">{service.uptime}</div>
                </div>
                
                <div className="bg-gaming-black-lighter p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-gaming-gray mb-1">
                    <Server className="w-4 h-4" />
                    <span>Server IP</span>
                  </div>
                  <div className="text-gaming-white font-mono text-xs">
                    {hideIPs ? '•••.•••.•••.•••' : service.ip}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                {service.status === 'online' ? (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleServerAction('stop', service.id)}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 flex-1 sm:flex-none"
                    >
                      <Pause className="w-4 h-4 mr-1" />
                      Stop
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleServerAction('restart', service.id)}
                      className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 flex-1 sm:flex-none"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Restart
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="sm" 
                    onClick={() => handleServerAction('start', service.id)}
                    className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Start
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-gaming-green/30 text-gaming-green hover:bg-gaming-green/10"
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Management Tabs */}
      <Card className="bg-gaming-dark border-gaming-green/20">
        <CardHeader>
          <CardTitle className="text-gaming-white">Server Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gaming-black-lighter border border-gaming-green/20">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black">
                <Activity className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="console" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black">
                <Terminal className="w-4 h-4 mr-2" />
                Console
              </TabsTrigger>
              <TabsTrigger value="files" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black">
                <FileText className="w-4 h-4 mr-2" />
                Files
              </TabsTrigger>
              <TabsTrigger value="backups" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black">
                <Archive className="w-4 h-4 mr-2" />
                Backups
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Performance Chart Placeholder */}
                  <Card className="bg-gaming-black-lighter border-gaming-green/20">
                    <CardHeader>
                      <CardTitle className="text-gaming-white text-lg">Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-gaming-black rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Activity className="w-12 h-12 text-gaming-green mx-auto mb-2" />
                          <p className="text-gaming-gray">Real-time performance charts</p>
                          <p className="text-gaming-gray text-sm">CPU, RAM, Network usage over time</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  {/* Quick Actions */}
                  <Card className="bg-gaming-black-lighter border-gaming-green/20">
                    <CardHeader>
                      <CardTitle className="text-gaming-white text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button className="w-full bg-gaming-green hover:bg-gaming-green-dark text-gaming-black">
                        <Archive className="w-4 h-4 mr-2" />
                        Create Backup
                      </Button>
                      <Button variant="outline" className="w-full border-gaming-green/30 text-gaming-green">
                        <Database className="w-4 h-4 mr-2" />
                        Manage Database
                      </Button>
                      <Button variant="outline" className="w-full border-gaming-green/30 text-gaming-green">
                        <Shield className="w-4 h-4 mr-2" />
                        Security Settings
                      </Button>
                      <Button variant="outline" className="w-full border-gaming-green/30 text-gaming-green">
                        <Zap className="w-4 h-4 mr-2" />
                        Performance Tuning
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Billing Info */}
                  <Card className="bg-gaming-black-lighter border-gaming-green/20">
                    <CardHeader>
                      <CardTitle className="text-gaming-white text-lg">Billing</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gaming-gray">Current Plan</span>
                        <span className="text-gaming-white">{services[0].plan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gaming-gray">Next Billing</span>
                        <span className="text-gaming-white">{services[0].nextBilling}</span>
                      </div>
                      <Button variant="outline" className="w-full border-gaming-green/30 text-gaming-green">
                        <Calendar className="w-4 h-4 mr-2" />
                        Manage Billing
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="console" className="mt-6">
              <Card className="bg-gaming-black-lighter border-gaming-green/20">
                <CardContent className="p-6">
                  <div className="bg-gaming-black rounded-lg p-4 font-mono text-sm">
                    <div className="text-gaming-green mb-2">[INFO] Server started successfully</div>
                    <div className="text-gaming-white mb-2">[INFO] Players online: 24/50</div>
                    <div className="text-yellow-400 mb-2">[WARN] High CPU usage detected: 78%</div>
                    <div className="text-gaming-green mb-2">[INFO] Auto-backup completed</div>
                    <div className="text-gaming-gray mb-4">Type commands here...</div>
                    <div className="flex">
                      <span className="text-gaming-green mr-2">$</span>
                      <div className="flex-1 bg-transparent border-none outline-none text-gaming-white">
                        <span className="animate-pulse">|</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="files" className="mt-6">
              <Card className="bg-gaming-black-lighter border-gaming-green/20">
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gaming-green mx-auto mb-4" />
                    <h3 className="text-gaming-white text-lg font-semibold mb-2">File Manager</h3>
                    <p className="text-gaming-gray">Browse, edit, and manage your server files</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="backups" className="mt-6">
              <Card className="bg-gaming-black-lighter border-gaming-green/20">
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <Archive className="w-16 h-16 text-gaming-green mx-auto mb-4" />
                    <h3 className="text-gaming-white text-lg font-semibold mb-2">Backup Management</h3>
                    <p className="text-gaming-gray">Create, restore, and schedule automatic backups</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}