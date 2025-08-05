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
  Clock
} from 'lucide-react';
import Navigation from '@/components/navigation';
import PromoBanner from '@/components/promo-banner';
import Footer from '@/components/footer';
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

export default function GamesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  // Fetch games
  const { data: games = [], isLoading } = useQuery<Game[]>({
    queryKey: ['/api/games'],
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
      case 'Mobile': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Crossplay': return 'bg-gaming-green/20 text-gaming-green border border-gaming-green/30';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
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
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-black">
      <PromoBanner />
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-gaming">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gaming-white mb-6">
              Game <span className="text-gaming-green">Server</span> Hosting
            </h1>
            <p className="text-xl text-gaming-gray mb-8">
              Choose from our extensive library of games and deploy your server instantly
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
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="PC">PC</SelectItem>
                    <SelectItem value="Console">Console</SelectItem>
                    <SelectItem value="Mobile">Mobile</SelectItem>
                    <SelectItem value="Crossplay">Crossplay</SelectItem>
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
                  Category: {categories.find(c => c.value === selectedCategory)?.label}
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
                  Platform: {selectedPlatform}
                  <button 
                    onClick={() => setSelectedPlatform('all')}
                    className="ml-2 hover:text-gaming-white"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>

            {/* Results Count */}
            <div className="text-sm text-gaming-gray mt-4">
              Showing {filteredAndSortedGames.length} of {games.length} games
            </div>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredAndSortedGames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedGames.map((game) => (
                <Card 
                  key={game.id} 
                  className="bg-gaming-black-lighter border-gaming-green/20 hover:border-gaming-green/50 transition-all duration-300 group overflow-hidden"
                >
                  <div className="relative">
                    <img 
                      src={game.imageUrl} 
                      alt={game.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Overlay badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {game.isPopular && (
                        <Badge className="bg-gaming-green text-gaming-black">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                      {game.isNew && (
                        <Badge className="bg-blue-500 text-white">
                          <Sparkles className="w-3 h-3 mr-1" />
                          New
                        </Badge>
                      )}
                      {game.isTrending && (
                        <Badge className="bg-red-500 text-white">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>

                    {/* Price badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gaming-green text-gaming-black font-bold text-lg px-3 py-1">
                        ${game.basePrice}/mo
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gaming-white group-hover:text-gaming-green transition-colors">
                        {game.name}
                      </h3>
                      <Badge className={getPlatformColor(game.platform || 'PC')}>
                        {game.platform}
                      </Badge>
                    </div>
                    
                    <p className="text-gaming-gray text-sm mb-4 line-clamp-2">
                      {game.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {(game.tags || []).slice(0, 3).map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="text-xs border-gaming-green/30 text-gaming-gray"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gaming-gray mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {game.playerCount.toLocaleString()} players
                      </div>
                      <div className="flex items-center gap-1">
                        <Server className="w-4 h-4" />
                        Max {game.maxPlayers}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link href={game.slug === 'minecraft' ? '/games/minecraft' : `/games/${game.slug}`}>
                      <Button className="w-full bg-gaming-green hover:bg-gaming-green-dark text-gaming-black font-semibold group-hover:shadow-lg group-hover:shadow-gaming-green/25 transition-all">
                        Deploy Server
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gaming-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gaming-green" />
              </div>
              <h3 className="text-xl font-semibold text-gaming-white mb-2">No games found</h3>
              <p className="text-gaming-gray mb-6">
                Try adjusting your search criteria or browse all games
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedPlatform('all');
                }}
                className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}