import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, User, RefreshCw, Palette, Download, Link, Copy } from "lucide-react";

export default function MinecraftTools() {
  const [serverQuery, setServerQuery] = useState({
    ip: "",
    result: null as any
  });
  
  const [skinViewer, setSkinViewer] = useState({
    username: "",
    result: null as any
  });
  
  const [uuidConverter, setUuidConverter] = useState({
    input: "",
    result: null as any
  });
  
  const [colorGenerator, setColorGenerator] = useState({
    text: "",
    result: ""
  });

  const handleQueryServer = async () => {
    if (!serverQuery.ip) return;
    
    // Mock server query result
    setServerQuery({
      ...serverQuery,
      result: {
        players: "47,582/100,000",
        version: "1.20.4",
        ping: "23ms",
        motd: "Hypixel Network",
        status: "online"
      }
    });
  };

  const handleLoadSkin = async () => {
    if (!skinViewer.username) return;
    
    // Mock skin loading result
    setSkinViewer({
      ...skinViewer,
      result: {
        username: skinViewer.username,
        skinUrl: "https://pixabay.com/get/gcfdf7f457424a656d31aa90de24a5e8d05a090893b7d6558486b1e72ae13104f5dd95e54c045db1ead1428a2a730b25030d7304e0a300d48e4686376830a072f_1280.jpg"
      }
    });
  };

  const handleConvertUUID = async () => {
    if (!uuidConverter.input) return;
    
    // Mock UUID conversion
    const isUUID = uuidConverter.input.includes('-');
    setUuidConverter({
      ...uuidConverter,
      result: {
        username: isUUID ? "Notch" : uuidConverter.input,
        uuid: isUUID ? uuidConverter.input : "069a79f4-44e9-4726-a5be-fca90e38aaf5"
      }
    });
  };

  const handleGenerateColors = () => {
    if (!colorGenerator.text) return;
    
    // Mock color code generation
    setColorGenerator({
      ...colorGenerator,
      result: `§a§l${colorGenerator.text.split(' ')[0]} §r§b${colorGenerator.text.split(' ').slice(1).join(' ')}`
    });
  };

  const addColor = (colorCode: string) => () => {
    setColorGenerator({
      ...colorGenerator,
      text: colorGenerator.text + colorCode
    });
  };

  return (
    <section id="tools" className="py-20 bg-gaming-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gaming-green">Minecraft</span> Tools
          </h2>
          <p className="text-xl text-gaming-gray max-w-3xl mx-auto">
            Essential tools for Minecraft server administrators. Manage your server with ease using our integrated tools.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Server Query Tool */}
          <Card className="bg-gaming-black-lighter border-gaming-black-lighter">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gaming-green/10 rounded-lg flex items-center justify-center mr-4">
                  <Search className="text-gaming-green text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-gaming-white">Server Query</h3>
              </div>
              
              <p className="text-gaming-gray mb-6">Check any Minecraft server's status, player count, and version information.</p>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-gaming-white text-sm font-medium">Server IP</Label>
                  <Input 
                    type="text" 
                    placeholder="play.hypixel.net" 
                    value={serverQuery.ip}
                    onChange={(e) => setServerQuery({...serverQuery, ip: e.target.value})}
                    className="bg-gaming-black border-gaming-black-lighter text-gaming-white placeholder-gaming-gray focus:border-gaming-green"
                  />
                </div>
                <Button 
                  onClick={handleQueryServer}
                  className="w-full bg-gradient-green text-gaming-black hover:shadow-lg hover:shadow-gaming-green/30"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Query Server
                </Button>
              </div>
              
              {serverQuery.result && (
                <div className="mt-6 p-4 bg-gaming-black rounded-lg border border-gaming-green/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gaming-white font-semibold">Server Status</span>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-gaming-green rounded-full animate-pulse-green" />
                      <span className="text-gaming-green text-sm">Online</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gaming-gray">Players:</span>
                      <span className="text-gaming-white ml-2">{serverQuery.result.players}</span>
                    </div>
                    <div>
                      <span className="text-gaming-gray">Version:</span>
                      <span className="text-gaming-white ml-2">{serverQuery.result.version}</span>
                    </div>
                    <div>
                      <span className="text-gaming-gray">Ping:</span>
                      <span className="text-gaming-green ml-2">{serverQuery.result.ping}</span>
                    </div>
                    <div>
                      <span className="text-gaming-gray">MOTD:</span>
                      <span className="text-gaming-white ml-2">{serverQuery.result.motd}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skin Viewer */}
          <Card className="bg-gaming-black-lighter border-gaming-black-lighter">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gaming-green/10 rounded-lg flex items-center justify-center mr-4">
                  <User className="text-gaming-green text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-gaming-white">Skin Viewer</h3>
              </div>
              
              <p className="text-gaming-gray mb-6">View any Minecraft player's skin and get download links.</p>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-gaming-white text-sm font-medium">Player Username</Label>
                  <Input 
                    type="text" 
                    placeholder="Notch" 
                    value={skinViewer.username}
                    onChange={(e) => setSkinViewer({...skinViewer, username: e.target.value})}
                    className="bg-gaming-black border-gaming-black-lighter text-gaming-white placeholder-gaming-gray focus:border-gaming-green"
                  />
                </div>
                <Button 
                  onClick={handleLoadSkin}
                  className="w-full bg-gradient-green text-gaming-black hover:shadow-lg hover:shadow-gaming-green/30"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Load Skin
                </Button>
              </div>
              
              {skinViewer.result && (
                <div className="mt-6 text-center">
                  <img 
                    src={skinViewer.result.skinUrl} 
                    alt="Minecraft player skin preview" 
                    className="w-24 h-24 mx-auto rounded-lg mb-4" 
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <div className="text-gaming-white font-semibold mb-2">{skinViewer.result.username}</div>
                  <div className="flex justify-center space-x-2">
                    <Button variant="ghost" size="sm" className="text-gaming-green hover:text-gaming-green-dark">
                      <Download className="mr-1 h-3 w-3" />Download
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gaming-green hover:text-gaming-green-dark">
                      <Link className="mr-1 h-3 w-3" />Copy URL
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* UUID Converter */}
          <Card className="bg-gaming-black-lighter border-gaming-black-lighter">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gaming-green/10 rounded-lg flex items-center justify-center mr-4">
                  <RefreshCw className="text-gaming-green text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-gaming-white">UUID Converter</h3>
              </div>
              
              <p className="text-gaming-gray mb-6">Convert between Minecraft usernames and UUIDs for server administration.</p>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-gaming-white text-sm font-medium">Username or UUID</Label>
                  <Input 
                    type="text" 
                    placeholder="069a79f4-44e9-4726-a5be-fca90e38aaf5" 
                    value={uuidConverter.input}
                    onChange={(e) => setUuidConverter({...uuidConverter, input: e.target.value})}
                    className="bg-gaming-black border-gaming-black-lighter text-gaming-white placeholder-gaming-gray focus:border-gaming-green"
                  />
                </div>
                <Button 
                  onClick={handleConvertUUID}
                  className="w-full bg-gradient-green text-gaming-black hover:shadow-lg hover:shadow-gaming-green/30"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Convert
                </Button>
              </div>
              
              {uuidConverter.result && (
                <div className="mt-6 space-y-3">
                  <div className="p-3 bg-gaming-black rounded-lg">
                    <div className="text-gaming-gray text-sm mb-1">Username:</div>
                    <div className="text-gaming-white font-mono">{uuidConverter.result.username}</div>
                  </div>
                  <div className="p-3 bg-gaming-black rounded-lg">
                    <div className="text-gaming-gray text-sm mb-1">UUID:</div>
                    <div className="text-gaming-white font-mono text-sm">{uuidConverter.result.uuid}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Color Code Generator */}
          <Card className="bg-gaming-black-lighter border-gaming-black-lighter">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gaming-green/10 rounded-lg flex items-center justify-center mr-4">
                  <Palette className="text-gaming-green text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-gaming-white">Color Code Generator</h3>
              </div>
              
              <p className="text-gaming-gray mb-6">Generate Minecraft color codes for chat messages and signs.</p>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-gaming-white text-sm font-medium">Message Text</Label>
                  <Input 
                    type="text" 
                    placeholder="Welcome to our server!" 
                    value={colorGenerator.text}
                    onChange={(e) => setColorGenerator({...colorGenerator, text: e.target.value})}
                    className="bg-gaming-black border-gaming-black-lighter text-gaming-white placeholder-gaming-gray focus:border-gaming-green"
                  />
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  <Button variant="secondary" size="sm" onClick={addColor("§c")} className="bg-red-500 hover:bg-red-600 text-white">
                    Red
                  </Button>
                  <Button variant="secondary" size="sm" onClick={addColor("§9")} className="bg-blue-500 hover:bg-blue-600 text-white">
                    Blue
                  </Button>
                  <Button variant="secondary" size="sm" onClick={addColor("§a")} className="bg-green-500 hover:bg-green-600 text-white">
                    Green
                  </Button>
                  <Button variant="secondary" size="sm" onClick={addColor("§e")} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    Yellow
                  </Button>
                </div>
                
                <Button 
                  onClick={handleGenerateColors}
                  className="w-full bg-gradient-green text-gaming-black hover:shadow-lg hover:shadow-gaming-green/30"
                >
                  <Palette className="mr-2 h-4 w-4" />
                  Generate
                </Button>
              </div>
              
              {colorGenerator.result && (
                <div className="mt-6 p-4 bg-gaming-black rounded-lg">
                  <div className="text-gaming-gray text-sm mb-2">Generated Code:</div>
                  <div className="text-gaming-white font-mono text-sm bg-gaming-black-lighter p-2 rounded flex items-center justify-between">
                    <span>{colorGenerator.result}</span>
                    <Button variant="ghost" size="sm" className="text-gaming-green hover:text-gaming-green-dark">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
