import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wrench, 
  Calculator, 
  Globe, 
  Settings, 
  Search,
  Code,
  Palette,
  Cpu,
  Database,
  Shield,
  Users,
  Zap
} from 'lucide-react';
import Navigation from '@/components/navigation';
import PromoBanner from '@/components/promo-banner';
import Footer from '@/components/footer';

interface MinecraftTool {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  featured: boolean;
  platforms: string[];
}

const minecraftTools: MinecraftTool[] = [
  {
    id: '1',
    slug: 'banner-generator',
    name: 'Banner Generator',
    description: 'Create custom banners with patterns and colors for your Minecraft builds',
    category: 'Creative',
    icon: 'Palette',
    featured: true,
    platforms: ['PC', 'Console', 'Mobile']
  },
  {
    id: '2',
    slug: 'command-generator',
    name: 'Command Generator',
    description: 'Generate complex Minecraft commands for server administration and gameplay',
    category: 'Server',
    icon: 'Code',
    featured: true,
    platforms: ['PC', 'Console', 'Mobile', 'Crossplay']
  },
  {
    id: '3',
    slug: 'seed-finder',
    name: 'Seed Finder',
    description: 'Find the perfect world seed based on your desired biomes and structures',
    category: 'World',
    icon: 'Globe',
    featured: true,
    platforms: ['PC', 'Console', 'Mobile', 'Crossplay']
  },
  {
    id: '4',
    slug: 'potion-calculator',
    name: 'Potion Calculator',
    description: 'Calculate brewing recipes and potion effects for optimal gameplay',
    category: 'Gameplay',
    icon: 'Calculator',
    featured: false,
    platforms: ['PC', 'Console', 'Mobile']
  },
  {
    id: '5',
    slug: 'server-optimizer',
    name: 'Server Optimizer',
    description: 'Optimize your server settings for better performance and player experience',
    category: 'Server',
    icon: 'Cpu',
    featured: true,
    platforms: ['PC', 'Console', 'Crossplay']
  },
  {
    id: '6',
    slug: 'permission-manager',
    name: 'Permission Manager',
    description: 'Manage player permissions and groups with visual interface',
    category: 'Server',
    icon: 'Shield',
    featured: false,
    platforms: ['PC', 'Console', 'Crossplay']
  },
  {
    id: '7',
    slug: 'plugin-finder',
    name: 'Plugin Finder',
    description: 'Discover and compare plugins for your Minecraft server',
    category: 'Server',
    icon: 'Database',
    featured: false,
    platforms: ['PC', 'Console', 'Mobile', 'Crossplay']
  },
  {
    id: '8',
    slug: 'whitelist-manager',
    name: 'Whitelist Manager',
    description: 'Manage server whitelist and player access controls',
    category: 'Server',
    icon: 'Users',
    featured: false,
    platforms: ['PC', 'Console', 'Mobile', 'Crossplay']
  }
];

const categories = ['All', 'Creative', 'Server', 'World', 'Gameplay'];
const featuredTools = minecraftTools.filter(tool => tool.featured);

export default function MinecraftToolsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Palette': return Palette;
      case 'Code': return Code;
      case 'Globe': return Globe;
      case 'Calculator': return Calculator;
      case 'Cpu': return Cpu;
      case 'Shield': return Shield;
      case 'Database': return Database;
      case 'Users': return Users;
      default: return Wrench;
    }
  };

  const filteredTools = minecraftTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesPlatform = selectedPlatform === 'All' || tool.platforms.includes(selectedPlatform);
    
    return matchesSearch && matchesCategory && matchesPlatform;
  });

  return (
    <div className="min-h-screen bg-gaming-black">
      <PromoBanner />
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gaming-black via-gaming-black-light to-gaming-black">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Minecraft <span className="text-gaming-green">Tools</span>
            </h1>
            <p className="text-xl text-gaming-gray mb-8">
              Professional tools and utilities to enhance your Minecraft server management and gameplay experience
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Badge variant="secondary" className="bg-gaming-green/20 text-gaming-green">
                <Wrench className="w-4 h-4 mr-1" />
                {minecraftTools.length}+ Tools Available
              </Badge>
              <Badge variant="secondary" className="bg-gaming-green/20 text-gaming-green">
                <Zap className="w-4 h-4 mr-1" />
                Always Updated
              </Badge>
              <Badge variant="secondary" className="bg-gaming-green/20 text-gaming-green">
                <Settings className="w-4 h-4 mr-1" />
                Easy to Use
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-20 bg-gaming-black-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">Featured Tools</h2>
            <p className="text-gaming-gray text-lg">Most popular and essential tools for Minecraft servers</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredTools.map((tool) => {
              const IconComponent = getIcon(tool.icon);
              return (
                <Link key={tool.id} href={`/minecraft-tool/${tool.slug}`}>
                  <Card className="bg-gaming-black border-gaming-green/20 hover:border-gaming-green/50 transition-all duration-300 cursor-pointer group h-full">
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 bg-gaming-green/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-gaming-green/30 transition-colors">
                        <IconComponent className="w-8 h-8 text-gaming-green" />
                      </div>
                      <CardTitle className="text-gaming-white group-hover:text-gaming-green transition-colors">
                        {tool.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gaming-gray text-sm mb-4 text-center">
                        {tool.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-xs">
                          {tool.category}
                        </Badge>
                        <div className="flex gap-1">
                          {tool.platforms.slice(0, 2).map((platform, platformIndex) => (
                            <Badge 
                              key={platformIndex}
                              variant="secondary" 
                              className="text-xs bg-gaming-green/20 text-gaming-green"
                            >
                              {platform}
                            </Badge>
                          ))}
                          {tool.platforms.length > 2 && (
                            <Badge variant="secondary" className="text-xs bg-gaming-green/20 text-gaming-green">
                              +{tool.platforms.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* All Tools */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">All Tools</h2>
            <p className="text-gaming-gray text-lg">Browse our complete collection of Minecraft tools</p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gaming-gray w-4 h-4" />
                <Input
                  placeholder="Search tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gaming-black-light border-gaming-green/20"
                />
              </div>
            </div>

            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-gaming-black-light">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category}
                    value={category}
                    className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="mt-4 flex gap-2 justify-center flex-wrap">
              {['All', 'PC', 'Console', 'Mobile', 'Crossplay'].map((platform) => (
                <Button
                  key={platform}
                  variant={selectedPlatform === platform ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPlatform(platform)}
                  className={selectedPlatform === platform ? 
                    "bg-gaming-green text-gaming-black hover:bg-gaming-green-dark" : 
                    "border-gaming-green/20 text-gaming-gray hover:text-gaming-white"
                  }
                >
                  {platform}
                </Button>
              ))}
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredTools.map((tool) => {
              const IconComponent = getIcon(tool.icon);
              return (
                <Link key={tool.id} href={`/minecraft-tool/${tool.slug}`}>
                  <Card className="bg-gaming-black-light border-gaming-green/20 hover:border-gaming-green/50 transition-all duration-300 cursor-pointer group h-full">
                    <CardHeader className="text-center pb-4">
                      <div className="w-12 h-12 bg-gaming-green/20 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-gaming-green/30 transition-colors">
                        <IconComponent className="w-6 h-6 text-gaming-green" />
                      </div>
                      <CardTitle className="text-lg text-gaming-white group-hover:text-gaming-green transition-colors">
                        {tool.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gaming-gray text-sm mb-4 text-center line-clamp-2">
                        {tool.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-xs">
                          {tool.category}
                        </Badge>
                        <div className="flex gap-1">
                          {tool.platforms.slice(0, 2).map((platform, platformIndex) => (
                            <Badge 
                              key={platformIndex}
                              variant="secondary" 
                              className="text-xs bg-gaming-green/20 text-gaming-green"
                            >
                              {platform}
                            </Badge>
                          ))}
                          {tool.platforms.length > 2 && (
                            <Badge variant="secondary" className="text-xs bg-gaming-green/20 text-gaming-green">
                              +{tool.platforms.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-16">
              <Wrench className="w-16 h-16 text-gaming-gray mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gaming-white mb-2">No Tools Found</h3>
              <p className="text-gaming-gray">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}