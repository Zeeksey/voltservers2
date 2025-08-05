import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  User, 
  Hash, 
  Palette, 
  Copy,
  Check,
  Server,
  Activity,
  Clock,
  Users,
  Wifi,
  AlertCircle,
  CheckCircle,
  Download,
  RefreshCw,
  Eye,
  Code
} from "lucide-react";

interface ServerStatus {
  online: boolean;
  players?: {
    current: number;
    max: number;
  };
  version?: string;
  ping?: number;
  motd?: string;
}

export default function MinecraftTools() {
  // Server Query Tool State
  const [serverAddress, setServerAddress] = useState("");
  const [serverPort, setServerPort] = useState("25565");
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);

  // UUID Converter State
  const [username, setUsername] = useState("");
  const [uuid, setUuid] = useState("");
  const [playerData, setPlayerData] = useState<any>(null);
  const [isLoadingPlayer, setIsLoadingPlayer] = useState(false);

  // Skin Viewer State
  const [skinUsername, setSkinUsername] = useState("");
  const [skinUrl, setSkinUrl] = useState("");

  // Color Code Generator State
  const [colorText, setColorText] = useState("");
  const [selectedColor, setSelectedColor] = useState("§a");
  const [generatedCode, setGeneratedCode] = useState("");

  // Copy State
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const queryServer = async () => {
    if (!serverAddress) return;
    
    setIsQuerying(true);
    try {
      const response = await fetch(`/api/query-server/${serverAddress}/${serverPort}`);
      const data = await response.json();
      setServerStatus(data);
    } catch (error) {
      console.error("Failed to query server:", error);
      setServerStatus({ online: false });
    } finally {
      setIsQuerying(false);
    }
  };

  const lookupPlayer = async () => {
    if (!username) return;
    
    setIsLoadingPlayer(true);
    try {
      // Using Mojang API to get UUID
      const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
      if (response.ok) {
        const data = await response.json();
        setPlayerData(data);
        setUuid(data.id);
      } else {
        setPlayerData(null);
        setUuid("");
      }
    } catch (error) {
      console.error("Failed to lookup player:", error);
      setPlayerData(null);
      setUuid("");
    } finally {
      setIsLoadingPlayer(false);
    }
  };

  const generateSkinUrl = () => {
    if (!skinUsername) return;
    const url = `https://mc-heads.net/body/${skinUsername}/256`;
    setSkinUrl(url);
  };

  const generateColorCode = () => {
    if (!colorText) return;
    const formatted = `${selectedColor}${colorText}`;
    setGeneratedCode(formatted);
  };

  const minecraftColors = [
    { code: "§0", name: "Black", color: "#000000" },
    { code: "§1", name: "Dark Blue", color: "#0000AA" },
    { code: "§2", name: "Dark Green", color: "#00AA00" },
    { code: "§3", name: "Dark Cyan", color: "#00AAAA" },
    { code: "§4", name: "Dark Red", color: "#AA0000" },
    { code: "§5", name: "Purple", color: "#AA00AA" },
    { code: "§6", name: "Gold", color: "#FFAA00" },
    { code: "§7", name: "Gray", color: "#AAAAAA" },
    { code: "§8", name: "Dark Gray", color: "#555555" },
    { code: "§9", name: "Blue", color: "#5555FF" },
    { code: "§a", name: "Green", color: "#55FF55" },
    { code: "§b", name: "Cyan", color: "#55FFFF" },
    { code: "§c", name: "Red", color: "#FF5555" },
    { code: "§d", name: "Pink", color: "#FF55FF" },
    { code: "§e", name: "Yellow", color: "#FFFF55" },
    { code: "§f", name: "White", color: "#FFFFFF" }
  ];

  return (
    <section id="tools" className="py-20 bg-gaming-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gaming-green">MC</span> Tools
          </h2>
          <p className="text-xl text-gaming-gray max-w-3xl mx-auto">
            Professional Minecraft server management and player tools with real-time data and API integration.
          </p>
        </div>

        <Tabs defaultValue="server-query" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
            <TabsTrigger value="server-query" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              Server Query
            </TabsTrigger>
            <TabsTrigger value="player-lookup" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Player Lookup
            </TabsTrigger>
            <TabsTrigger value="skin-viewer" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Skin Viewer
            </TabsTrigger>
            <TabsTrigger value="color-codes" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Color Codes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="server-query">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-gaming-green" />
                  Server Query Tool
                </CardTitle>
                <CardDescription>
                  Query any Minecraft server for real-time status, player count, and server information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="server-address">Server Address</Label>
                      <Input
                        id="server-address"
                        placeholder="mc.hypixel.net"
                        value={serverAddress}
                        onChange={(e) => setServerAddress(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="server-port">Port</Label>
                      <Input
                        id="server-port"
                        placeholder="25565"
                        value={serverPort}
                        onChange={(e) => setServerPort(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={queryServer}
                      disabled={isQuerying || !serverAddress}
                      className="w-full bg-gaming-green text-gaming-black hover:shadow-lg"
                    >
                      {isQuerying ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Querying...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Query Server
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {serverStatus && (
                    <div className="space-y-4">
                      <div className="bg-gaming-black-lighter p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          {serverStatus.online ? (
                            <CheckCircle className="h-5 w-5 text-gaming-green" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                          <span className="font-semibold text-gaming-white">
                            {serverStatus.online ? "Online" : "Offline"}
                          </span>
                        </div>
                        
                        {serverStatus.online && (
                          <div className="space-y-2 text-sm">
                            {serverStatus.players && (
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-gaming-green" />
                                <span className="text-gaming-gray">
                                  Players: {serverStatus.players.current}/{serverStatus.players.max}
                                </span>
                              </div>
                            )}
                            {serverStatus.version && (
                              <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-gaming-green" />
                                <span className="text-gaming-gray">Version: {serverStatus.version}</span>
                              </div>
                            )}
                            {serverStatus.ping && (
                              <div className="flex items-center gap-2">
                                <Wifi className="h-4 w-4 text-gaming-green" />
                                <span className="text-gaming-gray">Ping: {serverStatus.ping}ms</span>
                              </div>
                            )}
                            {serverStatus.motd && (
                              <div className="mt-3">
                                <p className="text-xs text-gaming-gray mb-1">MOTD:</p>
                                <p className="text-gaming-white text-sm font-mono bg-gaming-black p-2 rounded">
                                  {serverStatus.motd}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="player-lookup">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gaming-green" />
                  Player UUID Lookup
                </CardTitle>
                <CardDescription>
                  Convert Minecraft usernames to UUIDs and get player information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username">Minecraft Username</Label>
                      <Input
                        id="username"
                        placeholder="Notch"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={lookupPlayer}
                      disabled={isLoadingPlayer || !username}
                      className="w-full bg-gaming-green text-gaming-black hover:shadow-lg"
                    >
                      {isLoadingPlayer ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Looking up...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Lookup Player
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {playerData && (
                    <div className="space-y-4">
                      <div className="bg-gaming-black-lighter p-4 rounded-lg">
                        <h4 className="font-semibold text-gaming-white mb-3">Player Information</h4>
                        <div className="space-y-2">
                          <div>
                            <Label className="text-gaming-gray text-xs">Username</Label>
                            <div className="flex items-center gap-2">
                              <code className="text-gaming-white bg-gaming-black px-2 py-1 rounded text-sm">
                                {playerData.name}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopy(playerData.name, 'username')}
                              >
                                {copied === 'username' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label className="text-gaming-gray text-xs">UUID</Label>
                            <div className="flex items-center gap-2">
                              <code className="text-gaming-white bg-gaming-black px-2 py-1 rounded text-sm">
                                {uuid}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopy(uuid, 'uuid')}
                              >
                                {copied === 'uuid' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skin-viewer">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-gaming-green" />
                  Minecraft Skin Viewer
                </CardTitle>
                <CardDescription>
                  View and download Minecraft player skins in high resolution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="skin-username">Minecraft Username</Label>
                      <Input
                        id="skin-username"
                        placeholder="Steve"
                        value={skinUsername}
                        onChange={(e) => setSkinUsername(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={generateSkinUrl}
                      disabled={!skinUsername}
                      className="w-full bg-gaming-green text-gaming-black hover:shadow-lg"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Skin
                    </Button>
                  </div>
                  
                  {skinUrl && (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="bg-gaming-black-lighter p-4 rounded-lg">
                        <img 
                          src={skinUrl} 
                          alt={`${skinUsername}'s skin`}
                          className="w-32 h-64 pixelated"
                          style={{ imageRendering: 'pixelated' }}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(skinUrl, '_blank')}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(skinUrl, 'skin-url')}
                        >
                          {copied === 'skin-url' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="color-codes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-gaming-green" />
                  Minecraft Color Code Generator
                </CardTitle>
                <CardDescription>
                  Generate formatted text with Minecraft color codes for signs, books, and chat
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="color-text">Text to Format</Label>
                        <Input
                          id="color-text"
                          placeholder="Enter your text here"
                          value={colorText}
                          onChange={(e) => setColorText(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label>Select Color</Label>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {minecraftColors.map((color) => (
                            <button
                              key={color.code}
                              onClick={() => setSelectedColor(color.code)}
                              className={`p-2 rounded border text-xs ${
                                selectedColor === color.code 
                                  ? 'border-gaming-green bg-gaming-green/10' 
                                  : 'border-gaming-black-lighter bg-gaming-black-lighter'
                              }`}
                              style={{ color: color.color }}
                            >
                              {color.name}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <Button 
                        onClick={generateColorCode}
                        disabled={!colorText}
                        className="w-full bg-gaming-green text-gaming-black hover:shadow-lg"
                      >
                        <Code className="h-4 w-4 mr-2" />
                        Generate Code
                      </Button>
                    </div>
                    
                    {generatedCode && (
                      <div className="space-y-4">
                        <div>
                          <Label>Generated Code</Label>
                          <div className="flex items-center gap-2 mt-2">
                            <code className="flex-1 text-gaming-white bg-gaming-black p-3 rounded text-sm">
                              {generatedCode}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(generatedCode, 'color-code')}
                            >
                              {copied === 'color-code' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <Label>Preview</Label>
                          <div className="bg-gaming-black p-3 rounded mt-2">
                            <span style={{ color: minecraftColors.find(c => c.code === selectedColor)?.color }}>
                              {colorText}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}