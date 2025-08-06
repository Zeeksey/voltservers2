import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import GameImage from "@/components/game-image";
import type { Game } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

// Static games data to prevent flashing - shows immediately without API calls
const staticGames = [
  {
    id: "51ffadcd-d9dc-4956-8f7b-cb0735a6dfa3",
    name: "Minecraft",
    slug: "minecraft",
    description: "Java & Bedrock support, unlimited mods, automatic backups",
    imageUrl: "/images/games/minecraft.svg",
    basePrice: "$2.99",
    playerCount: 2847,
    isPopular: true
  },
  {
    id: "a8b2c3d4-e5f6-7890-1234-567890abcdef", 
    name: "CS2",
    slug: "cs2",
    description: "Counter-Strike 2 servers with custom maps and plugins",
    imageUrl: "/images/games/cs2.svg",
    basePrice: "$4.99",
    playerCount: 1234,
    isPopular: true
  },
  {
    id: "b9c3d4e5-f6g7-8901-2345-678901bcdefg",
    name: "Rust", 
    slug: "rust",
    description: "Survival servers with oxide plugins and custom maps",
    imageUrl: "/images/games/rust.svg",
    basePrice: "$6.99", 
    playerCount: 892,
    isPopular: true
  },
  {
    id: "c0d4e5f6-g7h8-9012-3456-789012cdefgh",
    name: "Garry's Mod",
    slug: "garrys-mod", 
    description: "Physics sandbox that lets you experiment with objects, create contraptions, and play game modes.",
    imageUrl: "/images/games/gmod.svg",
    basePrice: "$3.99",
    playerCount: 556,
    isPopular: true
  },
  {
    id: "d1e5f6g7-h8i9-0123-4567-890123defghi",
    name: "ARK: Survival Evolved",
    slug: "ark",
    description: "Dinosaur survival with clusters and mod support",
    imageUrl: "/images/games/ark.svg",
    basePrice: "$8.99",
    playerCount: 445,
    isPopular: false
  },
  {
    id: "e2f6g7h8-i9j0-1234-5678-901234efghij",
    name: "Valheim",
    slug: "valheim",
    description: "Viking survival servers with dedicated worlds",
    imageUrl: "/images/games/valheim.svg",
    basePrice: "$5.99",
    playerCount: 678,
    isPopular: false
  },
  {
    id: "f3g7h8i9-j0k1-2345-6789-012345fghijk",
    name: "7 Days to Die",
    slug: "7dtd",
    description: "Zombie survival with custom mods and maps",
    imageUrl: "/images/games/7dtd.svg",
    basePrice: "$4.99",
    playerCount: 234,
    isPopular: false
  },
  {
    id: "g4h8i9j0-k1l2-3456-7890-123456ghijkl",
    name: "Terraria",
    slug: "terraria",
    description: "2D adventure sandbox with multiplayer building",
    imageUrl: "/images/games/terraria.svg",
    basePrice: "$3.99",
    playerCount: 123,
    isPopular: false
  }
];

export default function GameCards() {
  // Query games from admin-managed API data with optimized settings to prevent flashing
  const { data: apiGames, isLoading, error, isPlaceholderData } = useQuery({
    queryKey: ['/api/games'],
    staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Cache for 30 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus to prevent flashing
    refetchOnMount: false, // Don't refetch on mount if we have cached data
    placeholderData: staticGames, // Use static games as placeholder to prevent empty states
  });

  // Always have games data - either from API or static fallback
  const games = apiGames && apiGames.length > 0 ? apiGames : staticGames;

  // Never show loading state - always display games immediately

  return (
    <section id="games" className="py-20 bg-gaming-black-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
            Find the Perfect <span className="text-gaming-green">Game Server</span>
          </h2>
          <p className="text-xl text-gaming-gray max-w-3xl mx-auto">
            Browse our collection of optimized game servers. From Minecraft to Rust, we've got your favorites covered with high-performance hosting.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games?.map((game: any) => (
            <Link key={game.id} href={`/games/${game.slug}`}>
              <div className="rounded-xl border border-zinc-700 bg-black/40 overflow-hidden hover:border-gaming-green transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                <div className="relative aspect-[2/1] overflow-hidden">
                  <GameImage 
                    src={game.imageUrl || `/images/games/${game.slug}.svg`} 
                    alt={game.name} 
                    gameSlug={game.slug}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    loading="eager"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `/images/games/default.svg`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                  
                  {/* Badges positioned in top-left */}
                  <div className="absolute top-3 left-3 flex gap-1 flex-wrap">
                    {game.isPopular && (
                      <Badge className="bg-gaming-green text-black text-xs px-2 py-1 font-medium">
                        Popular
                      </Badge>
                    )}
                    {game.isTrending && (
                      <Badge className="bg-orange-500 text-white text-xs px-2 py-1 font-medium">
                        Trending
                      </Badge>
                    )}
                    {game.isNew && (
                      <Badge className="bg-blue-500 text-white text-xs px-2 py-1 font-medium">
                        New
                      </Badge>
                    )}
                  </div>
                  
                  {/* Game title overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-gaming-green transition-colors">
                      {game.name}
                    </h3>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Game Description */}
                  <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                    {game.description}
                  </p>
                  
                  {/* Features List */}
                  <div className="mb-4 space-y-1">
                    {game.features && game.features.length > 0 ? 
                      game.features.slice(0, 4).map((feature: string, index: number) => (
                        <div key={index} className="flex items-center text-sm text-gray-400">
                          <div className="w-1 h-1 bg-gaming-green rounded-full mr-3"></div>
                          {feature}
                        </div>
                      )) :
                      [
                        "Instant Setup",
                        "DDoS Protection", 
                        "Mod Support",
                        "24/7 Support"
                      ].slice(0, 4).map((feature: string, index: number) => (
                        <div key={index} className="flex items-center text-sm text-gray-400">
                          <div className="w-1 h-1 bg-gaming-green rounded-full mr-3"></div>
                          {feature}
                        </div>
                      ))
                    }
                  </div>
                  
                  {/* Pricing */}
                  <div className="text-sm text-gray-400 mb-4">
                    Starting at <span className="font-bold text-lg text-white">${game.basePrice}/mo</span>
                  </div>
                  
                  {/* View Plans Button */}
                  <Button className="w-full bg-gaming-green hover:bg-gaming-green/90 text-black border-0 py-2.5 font-medium transition-all">
                    View Plans
                  </Button>
                </div>
              </div>
            </Link>
          ))}
          
          {/* More Games Card */}
          <div className="rounded-xl border-2 border-dashed border-zinc-700 bg-black/20 hover:border-gaming-green/50 transition-all duration-300 hover:-translate-y-1 group flex flex-col h-full">
            <div className="p-6 h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gaming-green/10 transition-colors">
                <Plus className="text-gray-400 group-hover:text-gaming-green text-2xl transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gaming-green transition-colors">Can't find your game?</h3>
              <p className="text-gray-300 mb-4 flex-1 text-sm">We support 50+ games with custom installations and setups.</p>
              <Button variant="outline" className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-black mt-auto transition-all">
                Request a listing <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
