import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, User, RefreshCw, Palette, Download, Link, Copy, ExternalLink } from "lucide-react";
import type { MinecraftTool } from "@shared/schema";

export default function MinecraftTools() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  
  const { data: tools, isLoading } = useQuery<MinecraftTool[]>({
    queryKey: ['/api/minecraft-tools'],
  });

  const handleCopyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleOpenTool = (url: string) => {
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <section id="tools" className="py-20 bg-gaming-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-gaming-green">Minecraft</span> Tools
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gaming-black-lighter rounded-xl p-8 animate-pulse">
                <div className="h-8 bg-gaming-black rounded mb-4" />
                <div className="h-4 bg-gaming-black rounded mb-4" />
                <div className="h-3 bg-gaming-black rounded mb-6" />
                <div className="h-10 bg-gaming-black rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools?.map((tool) => {
            const getIcon = () => {
              switch (tool.category) {
                case 'Server Management': return <Search className="text-gaming-green text-xl" />;
                case 'Player Tools': return <User className="text-gaming-green text-xl" />;
                case 'Utilities': return <RefreshCw className="text-gaming-green text-xl" />;
                case 'Design': return <Palette className="text-gaming-green text-xl" />;
                default: return <ExternalLink className="text-gaming-green text-xl" />;
              }
            };

            return (
              <Card key={tool.id} className="group bg-gaming-black-lighter border-gaming-black-lighter hover:shadow-xl hover:shadow-gaming-green/20 transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gaming-green/10 rounded-lg flex items-center justify-center mr-4">
                        {getIcon()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gaming-white">{tool.name}</h3>
                        <Badge className="bg-gaming-green/20 text-gaming-green text-xs mt-1">
                          {tool.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gaming-gray mb-6 flex-grow">{tool.description}</p>
                  
                  {tool.features && tool.features.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-gaming-white font-semibold mb-3">Features:</h4>
                      <ul className="text-gaming-gray text-sm space-y-1">
                        {tool.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-gaming-green mr-2">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex space-x-3 mt-auto">
                    <Button 
                      onClick={() => handleOpenTool(tool.url)}
                      className="flex-1 bg-gradient-green text-gaming-black hover:shadow-lg hover:shadow-gaming-green/30"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Use Tool
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyToClipboard(tool.url, tool.id)}
                      className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-gaming-black"
                    >
                      {copied === tool.id ? "Copied!" : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {tool.isPremium && (
                    <div className="mt-4 p-3 bg-gaming-green/10 rounded-lg border border-gaming-green/20">
                      <div className="flex items-center justify-between">
                        <span className="text-gaming-green text-sm font-medium">Premium Tool</span>
                        <Badge className="bg-gaming-green text-gaming-black">PRO</Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {(!tools || tools.length === 0) && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gaming-black-lighter rounded-full flex items-center justify-center mx-auto mb-6">
              <Palette className="text-gaming-green text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-gaming-white mb-4">Tools Coming Soon</h3>
            <p className="text-gaming-gray max-w-md mx-auto">
              We're working on adding powerful Minecraft tools to help you manage your servers more effectively.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
