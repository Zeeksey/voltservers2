import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Users, 
  Star, 
  TrendingUp, 
  Sparkles,
  Server,
  Gamepad2,
  Zap,
  Shield,
  Clock,
  Monitor,
  Tv,
  Globe2
} from 'lucide-react';
import Navigation from '@/components/navigation';
import PromoBanner from '@/components/promo-banner';
import Footer from '@/components/footer';
import SEOHead from '@/components/seo-head';
import { Link } from 'wouter';

interface Game {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  basePrice: string;
  playerCount: number;
  isPopular: boolean;
  isNew: boolean;
  isTrending: boolean;
  category?: string;
  tags?: string[];
  platform?: 'PC' | 'Console' | 'Crossplay';
  minPlayers?: number;
  maxPlayers?: number;
}

const gamesSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Game Server Hosting Options",
  "description": "Browse our complete collection of game server hosting options",
  "url": "https://voltservers.com/games",
  "numberOfItems": 50,
  "itemListElement": [
    {
      "@type": "Product",
      "name": "Minecraft Server Hosting",
      "description": "Professional Minecraft server hosting with plugin support",
      "url": "https://voltservers.com/games/minecraft"
    }
  ]
};

export default function GamesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  // Fetch games
  const { data: games = [], isLoading } = useQuery<Game[]>({
    queryKey: ['/api/games'],
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Game categories
  const categories = [
    { value: 'all', label: 'All Games', icon: <Gamepad2 className="w-4 h-4" /> },
    { value: 'survival', label: 'Survival', icon: <Shield className="w-4 h-4" /> },
    { value: 'action', label: 'Action', icon: <Zap className="w-4 h-4" /> },
    { value: 'simulation', label: 'Simulation', icon: <Server className="w-4 h-4" /> },
    { value: 'strategy', label: 'Strategy', icon: <Clock className="w-4 h-4" /> },
    { value: 'sandbox', label: 'Sandbox', icon: <Sparkles className="w-4 h-4" /> },
  ];

  // Platform options
  const platforms = [
    { value: 'all', label: 'All Platforms', icon: <Globe2 className="w-4 h-4" /> },
    { value: 'PC', label: 'PC', icon: <Monitor className="w-4 h-4" /> },
    { value: 'Console', label: 'Console', icon: <Tv className="w-4 h-4" /> },
    { value: 'Crossplay', label: 'Cross-Platform', icon: <Globe2 className="w-4 h-4" /> },
  ];

  // Enhanced games data with categories and tags
  const enhancedGames = useMemo(() => {
    return games.map(game => ({
      ...game,
      category: game.name === 'Minecraft' ? 'sandbox' :
                game.name === 'CS2' ? 'action' :
                game.name === 'Rust' ? 'survival' :
                game.name === 'ARK: Survival' ? 'survival' :
                game.name === 'Valheim' ? 'survival' :
                game.name === 'Satisfactory' ? 'simulation' :
                game.name === 'Factorio' ? 'simulation' :
                game.name === 'Squad' ? 'action' :
                'action',
      tags: game.name === 'Minecraft' ? ['Building', 'Creative', 'Multiplayer'] :
            game.name === 'CS2' ? ['Competitive', 'FPS', 'Team-based'] :
            game.name === 'Rust' ? ['PvP', 'Crafting', 'Base Building'] :
            game.name === 'ARK: Survival' ? ['Dinosaurs', 'Taming', 'PvE'] :
            game.name === 'Valheim' ? ['Co-op', 'Norse', 'Exploration'] :
            ['Multiplayer', 'Action'],
      platform: game.name === 'Minecraft' ? 'Crossplay' as const :
                game.name === 'CS2' ? 'PC' as const :
                game.name === 'Rust' ? 'PC' as const :
                game.name === 'ARK: Survival' ? 'Crossplay' as const :
                game.name === 'Valheim' ? 'PC' as const :
                'PC' as const,
      minPlayers: 1,
      maxPlayers: game.name === 'Minecraft' ? 100 :
                  game.name === 'CS2' ? 32 :
                  game.name === 'Rust' ? 200 :
                  50
    }));
  }, [games]);

  // Filter and sort games
  const filteredAndSortedGames = useMemo(() => {
    let filtered = enhancedGames.filter(game => {
      const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (game.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
      const matchesPlatform = selectedPlatform === 'all' || game.platform === selectedPlatform;
      
      return matchesSearch && matchesCategory && matchesPlatform;
    });

    // Sort games
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.playerCount - a.playerCount;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return parseFloat(a.basePrice) - parseFloat(b.basePrice);
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [enhancedGames, searchTerm, selectedCategory, selectedPlatform, sortBy]);

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'PC': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Console': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Crossplay': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'PC': return <Monitor className="w-3 h-3" />;
      case 'Console': return <Tv className="w-3 h-3" />;
      case 'Crossplay': return <Globe2 className="w-3 h-3" />;
      default: return <Gamepad2 className="w-3 h-3" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gaming-black">
        <PromoBanner />
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gaming-green"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-black">
      <SEOHead
        title="Browse Games - VoltServers | Premium Game Server Hosting"
        description="Browse our extensive collection of game servers. From Minecraft to CS2, Rust, and more. Deploy instantly with 99.9% uptime guarantee."
        keywords="game servers, minecraft hosting, rust server, cs2 hosting, valheim server, ark hosting, gaming servers, multiplayer hosting"
        ogTitle="Browse Games - All Game Servers Available | VoltServers"
        ogDescription="Browse our extensive collection of game servers. From Minecraft to CS2, Rust, and more."
        canonicalUrl="https://voltservers.com/games"
        schema={gamesSchema}
      />
      
      <PromoBanner />
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-gaming">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-gaming-green/20 text-gaming-green border-gaming-green/30">
              <Filter className="w-4 h-4 mr-1" />
              {games.length}+ Games Available
            </Badge>
            <h1 className="text-5xl font-bold text-gaming-white mb-6">
              Choose Your <span className="text-gaming-green">Game Server</span>
            </h1>
            <p className="text-xl text-gaming-gray mb-8">
              Deploy high-performance game servers instantly. From popular classics to the latest releases, 
              we support all your favorite games with enterprise-grade infrastructure.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-gaming-black-lighter/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gaming-green">{games.length}+</div>
                <div className="text-sm text-gaming-gray">Games</div>
              </div>
              <div className="bg-gaming-black-lighter/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gaming-green">24/7</div>
                <div className="text-sm text-gaming-gray">Support</div>
              </div>
              <div className="bg-gaming-black-lighter/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gaming-green">99.9%</div>
                <div className="text-sm text-gaming-gray">Uptime</div>
              </div>
              <div className="bg-gaming-black-lighter/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gaming-green">Instant</div>
                <div className="text-sm text-gaming-gray">Setup</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-12 bg-gaming-black-light">
        <div className="container mx-auto px-4">
          <div className="bg-gaming-black-lighter rounded-xl p-6 border border-gaming-green/20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gaming-gray w-4 h-4" />
                  <Input
                    placeholder="Search games..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gaming-black border-gaming-green/30 text-gaming-white placeholder:text-gaming-gray focus:border-gaming-green"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-gaming-black border-gaming-green/30 text-gaming-white">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          {category.icon}
                          {category.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Platform Filter */}
              <div>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="bg-gaming-black border-gaming-green/30 text-gaming-white">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        <div className="flex items-center gap-2">
                          {platform.icon}
                          {platform.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-gaming-black border-gaming-green/30 text-gaming-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="price">Price Low-High</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <Badge variant="secondary" className="bg-gaming-green/20 text-gaming-green">
                  Search: {searchTerm}
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="ml-2 hover:text-gaming-white"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="bg-gaming-green/20 text-gaming-green">
                  {categories.find(c => c.value === selectedCategory)?.label}
                  <button 
                    onClick={() => setSelectedCategory('all')}
                    className="ml-2 hover:text-gaming-white"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedPlatform !== 'all' && (
                <Badge variant="secondary" className="bg-gaming-green/20 text-gaming-green">
                  {platforms.find(p => p.value === selectedPlatform)?.label}
                  <button 
                    onClick={() => setSelectedPlatform('all')}
                    className="ml-2 hover:text-gaming-white"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredAndSortedGames.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-2xl font-bold text-gaming-white mb-2">No games found</h3>
              <p className="text-gaming-gray mb-6">Try adjusting your search criteria or filters</p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedPlatform('all');
                }}
                className="bg-gaming-green text-gaming-black hover:bg-gaming-green-dark"
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedGames.map((game) => (
                <Card key={game.id} className="bg-gaming-black-lighter border-gaming-green/20 hover:border-gaming-green/50 transition-all duration-300 group">
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img 
                        src={game.imageUrl} 
                        alt={game.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        {game.isPopular && (
                          <Badge className="bg-gaming-green text-gaming-black">
                            <Star className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                        {game.isNew && (
                          <Badge className="bg-blue-600 text-white">
                            <Sparkles className="w-3 h-3 mr-1" />
                            New
                          </Badge>
                        )}
                        {game.isTrending && (
                          <Badge className="bg-orange-600 text-white">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge className={`${getPlatformColor(game.platform || 'PC')} flex items-center gap-1`}>
                          {getPlatformIcon(game.platform || 'PC')}
                          {game.platform || 'PC'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-gaming-white text-lg">{game.name}</CardTitle>
                    </div>
                    <p className="text-gaming-gray text-sm mb-3 line-clamp-2">{game.description}</p>
                    
                    {/* Tags */}
                    {game.tags && game.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {game.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-gaming-green/30 text-gaming-gray">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gaming-gray">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{game.playerCount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Server className="w-4 h-4" />
                        <span>{game.minPlayers}-{game.maxPlayers}</span>
                      </div>
                    </div>
                    
                    {/* Pricing and CTA */}
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <div className="text-2xl font-bold text-gaming-green bg-gaming-green/10 px-2 py-1 rounded">
                          ${game.basePrice}
                        </div>
                        <div className="text-xs text-gaming-gray">per month</div>
                      </div>
                      <Link href={`/games/${game.slug}`}>
                        <Button 
                          className="bg-gaming-green text-gaming-black hover:bg-gaming-green-dark font-semibold"
                          size="sm"
                        >
                          Deploy
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}