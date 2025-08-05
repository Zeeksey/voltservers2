import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  AlertTriangle, 
  Play, 
  Square, 
  RotateCcw, 
  Server, 
  Users, 
  Package, 
  Globe, 
  HardDrive, 
  Activity,
  Plus,
  Download,
  Upload,
  FileText,
  Settings,
  Trash2,
  Eye,
  Edit,
  Save,
  Shield,
  Clock
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface MinecraftServer {
  id: string;
  userId: string;
  serverName: string;
  serverType: string;
  version: string;
  status: 'online' | 'offline' | 'starting' | 'stopping';
  ipAddress: string;
  port: number;
  maxPlayers: number;
  currentPlayers: number;
  ramAllocation: number;
  diskSpace: number;
  lastOnline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface MinecraftPlugin {
  id: string;
  serverId: string;
  pluginName: string;
  version: string;
  author: string;
  description?: string;
  isEnabled: boolean;
  installedAt: Date;
}

interface MinecraftWorld {
  id: string;
  serverId: string;
  worldName: string;
  worldType: string;
  seed?: string;
  gamemode: string;
  difficulty: string;
  createdAt: Date;
}

interface MinecraftPlayer {
  id: string;
  serverId: string;
  playerName: string;
  uuid: string;
  isOnline: boolean;
  isOp: boolean;
  isBanned: boolean;
  isWhitelisted: boolean;
  playtime: number;
  lastLogin?: Date;
  firstJoin: Date;
}

interface MinecraftBackup {
  id: string;
  serverId: string;
  worldId?: string;
  backupName: string;
  backupType: 'full' | 'world' | 'plugins';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  sizeBytes?: number;
  createdAt: Date;
}

interface MinecraftLog {
  id: string;
  serverId: string;
  logLevel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  message: string;
  source: string;
  timestamp: Date;
}

export default function MinecraftManagement() {
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('servers');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch servers
  const { data: servers = [], isLoading: serversLoading } = useQuery<MinecraftServer[]>({
    queryKey: ['/api/minecraft/servers'],
  });

  // Fetch server details
  const { data: serverDetails } = useQuery<MinecraftServer>({
    queryKey: ['/api/minecraft/servers', selectedServer],
    enabled: !!selectedServer,
  });

  // Fetch plugins for selected server
  const { data: plugins = [] } = useQuery<MinecraftPlugin[]>({
    queryKey: ['/api/minecraft/servers', selectedServer, 'plugins'],
    enabled: !!selectedServer,
  });

  // Fetch worlds for selected server
  const { data: worlds = [] } = useQuery<MinecraftWorld[]>({
    queryKey: ['/api/minecraft/servers', selectedServer, 'worlds'],
    enabled: !!selectedServer,
  });

  // Fetch players for selected server
  const { data: players = [] } = useQuery<MinecraftPlayer[]>({
    queryKey: ['/api/minecraft/servers', selectedServer, 'players'],
    enabled: !!selectedServer,
  });

  // Fetch backups for selected server
  const { data: backups = [] } = useQuery<MinecraftBackup[]>({
    queryKey: ['/api/minecraft/servers', selectedServer, 'backups'],
    enabled: !!selectedServer,
  });

  // Fetch logs for selected server
  const { data: logs = [] } = useQuery<MinecraftLog[]>({
    queryKey: ['/api/minecraft/servers', selectedServer, 'logs'],
    enabled: !!selectedServer,
  });

  // Server control mutations
  const startServerMutation = useMutation({
    mutationFn: async (serverId: string) => {
      const response = await fetch(`/api/minecraft/servers/${serverId}/start`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to start server');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/minecraft/servers'] });
      toast({ title: 'Server starting...', description: 'The server is being started.' });
    },
  });

  const stopServerMutation = useMutation({
    mutationFn: async (serverId: string) => {
      const response = await fetch(`/api/minecraft/servers/${serverId}/stop`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to stop server');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/minecraft/servers'] });
      toast({ title: 'Server stopping...', description: 'The server is being stopped.' });
    },
  });

  const restartServerMutation = useMutation({
    mutationFn: async (serverId: string) => {
      const response = await fetch(`/api/minecraft/servers/${serverId}/restart`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to restart server');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/minecraft/servers'] });
      toast({ title: 'Server restarting...', description: 'The server is being restarted.' });
    },
  });

  // Create backup mutation
  const createBackupMutation = useMutation({
    mutationFn: async (data: { serverId: string; backupName: string; backupType: string }) => {
      const response = await fetch(`/api/minecraft/servers/${data.serverId}/backups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backupName: data.backupName, backupType: data.backupType }),
      });
      if (!response.ok) throw new Error('Failed to create backup');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/minecraft/servers', selectedServer, 'backups'] });
      toast({ title: 'Backup started', description: 'The backup process has begun.' });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'starting': return 'bg-yellow-500';
      case 'stopping': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      online: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      offline: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      starting: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      stopping: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  if (serversLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gaming-green"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gaming-green to-white bg-clip-text text-transparent">
            Minecraft Server Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive server management and monitoring tools
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gaming-green hover:bg-gaming-green/90">
              <Plus className="mr-2 h-4 w-4" />
              New Server
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Server</DialogTitle>
              <DialogDescription>
                Deploy a new Minecraft server instance
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="serverName">Server Name</Label>
                <Input id="serverName" placeholder="My Minecraft Server" />
              </div>
              <div>
                <Label htmlFor="serverType">Server Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select server type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vanilla">Vanilla</SelectItem>
                    <SelectItem value="bukkit">Bukkit</SelectItem>
                    <SelectItem value="spigot">Spigot</SelectItem>
                    <SelectItem value="paper">Paper</SelectItem>
                    <SelectItem value="forge">Forge</SelectItem>
                    <SelectItem value="fabric">Fabric</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="version">Version</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select version" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.20.4">1.20.4</SelectItem>
                    <SelectItem value="1.20.1">1.20.1</SelectItem>
                    <SelectItem value="1.19.4">1.19.4</SelectItem>
                    <SelectItem value="1.18.2">1.18.2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-gaming-green hover:bg-gaming-green/90">
                Create Server
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Server List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Servers ({servers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {servers.map((server) => (
                  <div
                    key={server.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedServer === server.id
                        ? 'border-gaming-green bg-gaming-green/10'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gaming-green/50'
                    }`}
                    onClick={() => setSelectedServer(server.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{server.serverName}</h4>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(server.status)}`} />
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span>Players</span>
                        <span>{server.currentPlayers}/{server.maxPlayers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Version</span>
                        <span>{server.version}</span>
                      </div>
                      <Badge className={`text-xs ${getStatusBadge(server.status)}`}>
                        {server.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {selectedServer ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="plugins">Plugins</TabsTrigger>
                <TabsTrigger value="worlds">Worlds</TabsTrigger>
                <TabsTrigger value="players">Players</TabsTrigger>
                <TabsTrigger value="backups">Backups</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(serverDetails?.status || 'offline')}`}>
                          <Activity className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{serverDetails?.status || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">Server Status</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {serverDetails?.currentPlayers}/{serverDetails?.maxPlayers}
                          </p>
                          <p className="text-sm text-muted-foreground">Players Online</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500">
                          <HardDrive className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{serverDetails?.ramAllocation}GB</p>
                          <p className="text-sm text-muted-foreground">RAM Allocation</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Server Controls */}
                <Card>
                  <CardHeader>
                    <CardTitle>Server Controls</CardTitle>
                    <CardDescription>Manage your server's operational state</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <Button
                        onClick={() => selectedServer && startServerMutation.mutate(selectedServer)}
                        disabled={serverDetails?.status === 'online' || startServerMutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Start
                      </Button>
                      <Button
                        onClick={() => selectedServer && stopServerMutation.mutate(selectedServer)}
                        disabled={serverDetails?.status === 'offline' || stopServerMutation.isPending}
                        variant="destructive"
                      >
                        <Square className="mr-2 h-4 w-4" />
                        Stop
                      </Button>
                      <Button
                        onClick={() => selectedServer && restartServerMutation.mutate(selectedServer)}
                        disabled={restartServerMutation.isPending}
                        variant="outline"
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Restart
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Server Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Server Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Server Name</Label>
                        <p className="font-medium">{serverDetails?.serverName}</p>
                      </div>
                      <div>
                        <Label>Server Type</Label>
                        <p className="font-medium">{serverDetails?.serverType}</p>
                      </div>
                      <div>
                        <Label>Version</Label>
                        <p className="font-medium">{serverDetails?.version}</p>
                      </div>
                      <div>
                        <Label>Address</Label>
                        <p className="font-medium">{serverDetails?.ipAddress}:{serverDetails?.port}</p>
                      </div>
                      <div>
                        <Label>Disk Space</Label>
                        <p className="font-medium">{serverDetails?.diskSpace}GB</p>
                      </div>
                      <div>
                        <Label>Last Online</Label>
                        <p className="font-medium">
                          {serverDetails?.lastOnline 
                            ? new Date(serverDetails.lastOnline).toLocaleDateString()
                            : 'Never'
                          }
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Plugins Tab */}
              <TabsContent value="plugins" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          Installed Plugins ({plugins.length})
                        </CardTitle>
                        <CardDescription>Manage server plugins and extensions</CardDescription>
                      </div>
                      <Button className="bg-gaming-green hover:bg-gaming-green/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Install Plugin
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {plugins.map((plugin) => (
                        <div key={plugin.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-blue-500">
                              <Package className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{plugin.pluginName}</h4>
                              <p className="text-sm text-muted-foreground">
                                v{plugin.version} by {plugin.author}
                              </p>
                              {plugin.description && (
                                <p className="text-sm text-muted-foreground mt-1">{plugin.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch checked={plugin.isEnabled} />
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Worlds Tab */}
              <TabsContent value="worlds" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="h-5 w-5" />
                          Server Worlds ({worlds.length})
                        </CardTitle>
                        <CardDescription>Manage world files and settings</CardDescription>
                      </div>
                      <Button className="bg-gaming-green hover:bg-gaming-green/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Create World
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {worlds.map((world) => (
                        <Card key={world.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold">{world.worldName}</h4>
                              <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Type</span>
                                <span>{world.worldType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Gamemode</span>
                                <span>{world.gamemode}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Difficulty</span>
                                <span>{world.difficulty}</span>
                              </div>
                              {world.seed && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Seed</span>
                                  <span className="font-mono text-xs">{world.seed}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Players Tab */}
              <TabsContent value="players" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Player Management ({players.length})
                        </CardTitle>
                        <CardDescription>Manage player permissions and access</CardDescription>
                      </div>
                      <Button className="bg-gaming-green hover:bg-gaming-green/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Player
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {players.map((player) => (
                        <div key={player.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${player.isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
                            <div>
                              <h4 className="font-semibold">{player.playerName}</h4>
                              <p className="text-sm text-muted-foreground">
                                Playtime: {formatUptime(player.playtime)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Last login: {player.lastLogin ? new Date(player.lastLogin).toLocaleDateString() : 'Never'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex gap-2">
                              {player.isOp && <Badge variant="secondary">OP</Badge>}
                              {player.isWhitelisted && <Badge variant="outline">Whitelisted</Badge>}
                              {player.isBanned && <Badge variant="destructive">Banned</Badge>}
                            </div>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Backups Tab */}
              <TabsContent value="backups" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Save className="h-5 w-5" />
                          Server Backups ({backups.length})
                        </CardTitle>
                        <CardDescription>Create and manage server backups</CardDescription>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="bg-gaming-green hover:bg-gaming-green/90">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Backup
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create New Backup</DialogTitle>
                            <DialogDescription>
                              Create a backup of your server data
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="backupName">Backup Name</Label>
                              <Input 
                                id="backupName" 
                                placeholder="Manual backup - 2025-08-05"
                                defaultValue={`Manual backup - ${new Date().toISOString().split('T')[0]}`}
                              />
                            </div>
                            <div>
                              <Label htmlFor="backupType">Backup Type</Label>
                              <Select defaultValue="full">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="full">Full Server</SelectItem>
                                  <SelectItem value="world">World Only</SelectItem>
                                  <SelectItem value="plugins">Plugins Only</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button 
                              className="w-full bg-gaming-green hover:bg-gaming-green/90"
                              onClick={() => {
                                if (selectedServer) {
                                  createBackupMutation.mutate({
                                    serverId: selectedServer,
                                    backupName: `Manual backup - ${new Date().toISOString().split('T')[0]}`,
                                    backupType: 'full'
                                  });
                                }
                              }}
                            >
                              Create Backup
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {backups.map((backup) => (
                        <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-purple-500">
                              <Save className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{backup.backupName}</h4>
                              <p className="text-sm text-muted-foreground">
                                {backup.backupType} backup • {backup.sizeBytes ? formatBytes(backup.sizeBytes) : 'Unknown size'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Created: {new Date(backup.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              className={
                                backup.status === 'completed' ? 'bg-green-100 text-green-800' :
                                backup.status === 'failed' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }
                            >
                              {backup.status}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Logs Tab */}
              <TabsContent value="logs" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Server Logs
                        </CardTitle>
                        <CardDescription>View server activity and debug information</CardDescription>
                      </div>
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export Logs
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96 w-full border rounded-lg p-4">
                      <div className="space-y-2">
                        {logs.map((log) => (
                          <div key={log.id} className="flex items-start gap-3 text-sm">
                            <span className="text-muted-foreground w-20 shrink-0">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                            <Badge 
                              variant="outline"
                              className={`w-16 justify-center ${
                                log.logLevel === 'ERROR' ? 'border-red-500 text-red-500' :
                                log.logLevel === 'WARN' ? 'border-yellow-500 text-yellow-500' :
                                log.logLevel === 'INFO' ? 'border-blue-500 text-blue-500' :
                                'border-gray-500 text-gray-500'
                              }`}
                            >
                              {log.logLevel}
                            </Badge>
                            <span className="text-muted-foreground w-24 shrink-0">[{log.source}]</span>
                            <span className="flex-1">{log.message}</span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Server className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold">Select a Server</h3>
                  <p className="text-muted-foreground">
                    Choose a server from the list to view its management interface
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}