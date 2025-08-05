import { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  Copy,
  Download,
  Share,
  Palette,
  Code,
  Globe,
  Calculator,
  Cpu,
  Shield,
  Database,
  Users,
  Wrench,
  CheckCircle,
  Info
} from 'lucide-react';
import Navigation from '@/components/navigation';
import PromoBanner from '@/components/promo-banner';
import Footer from '@/components/footer';
import { useToast } from '@/hooks/use-toast';

// Tool configurations
const toolConfigs = {
  'banner-generator': {
    name: 'Banner Generator',
    description: 'Create custom banners with patterns and colors for your Minecraft builds',
    category: 'Creative',
    icon: 'Palette',
    difficulty: 'Beginner'
  },
  'command-generator': {
    name: 'Command Generator', 
    description: 'Generate complex Minecraft commands for server administration and gameplay',
    category: 'Server',
    icon: 'Code',
    difficulty: 'Intermediate'
  },
  'seed-finder': {
    name: 'Seed Finder',
    description: 'Find the perfect world seed based on your desired biomes and structures',
    category: 'World',
    icon: 'Globe',
    difficulty: 'Beginner'
  },
  'potion-calculator': {
    name: 'Potion Calculator',
    description: 'Calculate brewing recipes and potion effects for optimal gameplay',
    category: 'Gameplay',
    icon: 'Calculator',
    difficulty: 'Intermediate'
  },
  'server-optimizer': {
    name: 'Server Optimizer',
    description: 'Optimize your server settings for better performance and player experience',
    category: 'Server',
    icon: 'Cpu',
    difficulty: 'Advanced'
  },
  'permission-manager': {
    name: 'Permission Manager',
    description: 'Manage player permissions and groups with visual interface',
    category: 'Server',
    icon: 'Shield',
    difficulty: 'Intermediate'
  },
  'plugin-finder': {
    name: 'Plugin Finder',
    description: 'Discover and compare plugins for your Minecraft server',
    category: 'Server',
    icon: 'Database',
    difficulty: 'Beginner'
  },
  'whitelist-manager': {
    name: 'Whitelist Manager',
    description: 'Manage server whitelist and player access controls',
    category: 'Server',
    icon: 'Users',
    difficulty: 'Beginner'
  }
};

// Banner Generator Component
function BannerGenerator() {
  const [selectedColor, setSelectedColor] = useState('white');
  const [selectedPattern, setSelectedPattern] = useState('none');
  const [patternColor, setPatternColor] = useState('black');
  const { toast } = useToast();

  const colors = [
    'white', 'orange', 'magenta', 'light_blue', 'yellow', 'lime', 'pink', 'gray',
    'light_gray', 'cyan', 'purple', 'blue', 'brown', 'green', 'red', 'black'
  ];

  const patterns = [
    'none', 'stripe_bottom', 'stripe_top', 'stripe_left', 'stripe_right',
    'stripe_center', 'stripe_middle', 'stripe_downright', 'stripe_downleft',
    'cross', 'straight_cross', 'triangle_bottom', 'triangle_top', 'triangles_bottom',
    'triangles_top', 'diagonal_left', 'diagonal_right', 'diagonal_up_left',
    'diagonal_up_right', 'circle', 'rhombus', 'half_vertical', 'half_horizontal',
    'half_vertical_right', 'half_horizontal_bottom', 'border', 'curly_border',
    'gradient', 'gradient_up', 'bricks', 'globe', 'creeper', 'skull', 'flower', 'mojang'
  ];

  const generateCommand = () => {
    let command = `/give @p minecraft:${selectedColor}_banner`;
    
    if (selectedPattern !== 'none') {
      command += `{BlockEntityTag:{Patterns:[{Pattern:"${selectedPattern}",Color:${colors.indexOf(patternColor)}}]}}`;
    }
    
    return command;
  };

  const copyCommand = () => {
    navigator.clipboard.writeText(generateCommand());
    toast({ title: 'Command copied to clipboard!' });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <Label className="text-gaming-white mb-2 block">Base Color</Label>
            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger className="bg-gaming-black-light border-gaming-green/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colors.map(color => (
                  <SelectItem key={color} value={color}>
                    {color.replace('_', ' ').toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gaming-white mb-2 block">Pattern</Label>
            <Select value={selectedPattern} onValueChange={setSelectedPattern}>
              <SelectTrigger className="bg-gaming-black-light border-gaming-green/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {patterns.map(pattern => (
                  <SelectItem key={pattern} value={pattern}>
                    {pattern.replace('_', ' ').toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPattern !== 'none' && (
            <div>
              <Label className="text-gaming-white mb-2 block">Pattern Color</Label>
              <Select value={patternColor} onValueChange={setPatternColor}>
                <SelectTrigger className="bg-gaming-black-light border-gaming-green/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colors.map(color => (
                    <SelectItem key={color} value={color}>
                      {color.replace('_', ' ').toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Label className="text-gaming-white block">Generated Command</Label>
          <div className="p-4 bg-gaming-black-light rounded-lg border border-gaming-green/20">
            <code className="text-gaming-green text-sm break-all">
              {generateCommand()}
            </code>
          </div>
          <Button 
            onClick={copyCommand}
            className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black w-full"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Command
          </Button>
        </div>
      </div>
    </div>
  );
}

// Command Generator Component
function CommandGenerator() {
  const [commandType, setCommandType] = useState('give');
  const [player, setPlayer] = useState('@p');
  const [item, setItem] = useState('minecraft:diamond_sword');
  const [amount, setAmount] = useState('1');
  const [nbtData, setNbtData] = useState('');
  const { toast } = useToast();

  const commandTypes = [
    { value: 'give', label: 'Give Item' },
    { value: 'summon', label: 'Summon Entity' },
    { value: 'setblock', label: 'Set Block' },
    { value: 'fill', label: 'Fill Area' },
    { value: 'teleport', label: 'Teleport' },
    { value: 'gamemode', label: 'Game Mode' },
    { value: 'effect', label: 'Apply Effect' },
    { value: 'enchant', label: 'Enchant Item' }
  ];

  const generateCommand = () => {
    switch (commandType) {
      case 'give':
        return `/give ${player} ${item} ${amount}${nbtData ? ` ${nbtData}` : ''}`;
      case 'summon':
        return `/summon ${item} ~ ~ ~${nbtData ? ` ${nbtData}` : ''}`;
      case 'gamemode':
        return `/gamemode ${item} ${player}`;
      default:
        return `/${commandType} ${player} ${item}`;
    }
  };

  const copyCommand = () => {
    navigator.clipboard.writeText(generateCommand());
    toast({ title: 'Command copied to clipboard!' });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <Label className="text-gaming-white mb-2 block">Command Type</Label>
            <Select value={commandType} onValueChange={setCommandType}>
              <SelectTrigger className="bg-gaming-black-light border-gaming-green/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {commandTypes.map(cmd => (
                  <SelectItem key={cmd.value} value={cmd.value}>
                    {cmd.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gaming-white mb-2 block">Target Player</Label>
            <Input
              value={player}
              onChange={(e) => setPlayer(e.target.value)}
              placeholder="@p, @a, @s, or player name"
              className="bg-gaming-black-light border-gaming-green/20"
            />
          </div>

          <div>
            <Label className="text-gaming-white mb-2 block">
              {commandType === 'summon' ? 'Entity' : commandType === 'gamemode' ? 'Mode' : 'Item/Block'}
            </Label>
            <Input
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="minecraft:diamond_sword"
              className="bg-gaming-black-light border-gaming-green/20"
            />
          </div>

          {commandType === 'give' && (
            <div>
              <Label className="text-gaming-white mb-2 block">Amount</Label>
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1"
                className="bg-gaming-black-light border-gaming-green/20"
              />
            </div>
          )}

          <div>
            <Label className="text-gaming-white mb-2 block">NBT Data (Optional)</Label>
            <Textarea
              value={nbtData}
              onChange={(e) => setNbtData(e.target.value)}
              placeholder="{Enchantments:[{id:sharpness,lvl:5}]}"
              className="bg-gaming-black-light border-gaming-green/20"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-gaming-white block">Generated Command</Label>
          <div className="p-4 bg-gaming-black-light rounded-lg border border-gaming-green/20">
            <code className="text-gaming-green text-sm break-all">
              {generateCommand()}
            </code>
          </div>
          <Button 
            onClick={copyCommand}
            className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black w-full"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Command
          </Button>
        </div>
      </div>
    </div>
  );
}

// Default tool component for tools without specific implementations
function DefaultTool({ toolName }: { toolName: string }) {
  return (
    <div className="text-center py-16">
      <Wrench className="w-16 h-16 text-gaming-green mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-gaming-white mb-4">{toolName}</h3>
      <p className="text-gaming-gray mb-8">
        This tool is currently under development. Check back soon for the full implementation!
      </p>
      <div className="max-w-md mx-auto">
        <Card className="bg-gaming-black-light border-gaming-green/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-gaming-green">
              <Info className="w-5 h-5" />
              <span className="font-medium">Coming Soon</span>
            </div>
            <p className="text-gaming-gray text-sm mt-2">
              We're working hard to bring you the best Minecraft tools. This feature will be available in the next update.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function MinecraftToolPage() {
  const [match, params] = useRoute('/minecraft-tool/:toolSlug');
  const toolSlug = params?.toolSlug;
  const tool = toolSlug ? toolConfigs[toolSlug as keyof typeof toolConfigs] : null;

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

  const renderTool = () => {
    switch (toolSlug) {
      case 'banner-generator':
        return <BannerGenerator />;
      case 'command-generator':
        return <CommandGenerator />;
      default:
        return <DefaultTool toolName={tool?.name || 'Unknown Tool'} />;
    }
  };

  if (!tool) {
    return (
      <div className="min-h-screen bg-gaming-black text-gaming-white">
        <PromoBanner />
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gaming-white mb-4">Tool Not Found</h1>
            <p className="text-gaming-gray mb-8">The tool you're looking for doesn't exist.</p>
            <Link href="/minecraft-tools">
              <Button className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tools
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const IconComponent = getIcon(tool.icon);

  return (
    <div className="min-h-screen bg-gaming-black text-gaming-white">
      <PromoBanner />
      <Navigation />
      
      {/* Header */}
      <section className="py-12 bg-gaming-black-light">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/minecraft-tools">
              <Button variant="outline" size="sm" className="border-gaming-green/20 text-gaming-gray hover:text-gaming-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tools
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-6 mb-6">
            <div className="w-16 h-16 bg-gaming-green/20 rounded-lg flex items-center justify-center">
              <IconComponent className="w-8 h-8 text-gaming-green" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gaming-white mb-2">{tool.name}</h1>
              <p className="text-gaming-gray text-lg">{tool.description}</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Badge variant="outline" className="text-gaming-green border-gaming-green/20">
              {tool.category}
            </Badge>
            <Badge 
              variant="secondary" 
              className={`${
                tool.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                tool.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}
            >
              {tool.difficulty}
            </Badge>
          </div>
        </div>
      </section>

      {/* Tool Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gaming-black-light border-gaming-green/20">
            <CardHeader>
              <CardTitle className="text-2xl text-gaming-white">Tool Interface</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTool()}
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}