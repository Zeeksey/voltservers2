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
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gaming-green">Popular</span> Game Servers
          </h2>
          <p className="text-xl text-gaming-gray max-w-3xl mx-auto">
            Choose from our extensive library of supported games. Each server comes with optimized configurations and mod support.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games?.map((game) => (
            <Link key={game.id} href={`/games/${game.slug}`}>
              <Card className="group bg-gaming-black-lighter border-gaming-black-lighter hover:shadow-xl hover:shadow-gaming-green/20 transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col h-full cursor-pointer">
                <div className="relative">
                  <GameImage 
                    src={game.imageUrl || `/images/games/${game.slug}.svg`} 
                    alt={`${game.name} server interface`} 
                    gameSlug={game.slug}
                    className="w-full h-48 object-cover" 
                    loading="eager"
                    onError={(e) => {
                      // Fallback to default game icon if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = `/images/games/default.svg`;
                    }}
                  />
                  {game.isPopular && (
                    <Badge className="absolute top-4 right-4 bg-gaming-green text-gaming-black">
                      Popular
                    </Badge>
                  )}
                  {game.isNew && (
                    <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                      New
                    </Badge>
                  )}
                  {game.isTrending && (
                    <Badge className="absolute top-4 right-4 bg-yellow-500 text-gaming-black">
                      Trending
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-gaming-green/0 group-hover:bg-gaming-green/10 transition-colors duration-300" />
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gaming-white">{game.name}</h3>
                    <span className="text-gaming-green font-semibold">From ${game.basePrice}/mo</span>
                  </div>
                  <p className="text-gaming-gray mb-4 flex-1">{game.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-gaming-green rounded-full server-online" />
                      <span className="text-sm text-gaming-gray">{game.playerCount.toLocaleString()} players</span>
                    </div>
                    <Button className="bg-gaming-green text-gaming-black hover:bg-gaming-green-dark">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          
          {/* More Games Card */}
          <Card className="group bg-gaming-black-lighter border-2 border-dashed border-gaming-green/30 hover:shadow-xl hover:shadow-gaming-green/20 transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
            <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gaming-green/10 rounded-full flex items-center justify-center mb-4">
                <Plus className="text-gaming-green text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gaming-white mb-2">More Games</h3>
              <p className="text-gaming-gray mb-4 flex-1">Don't see your game? We support 50+ games with custom installations.</p>
              <Button variant="ghost" className="text-gaming-green hover:text-gaming-green-dark mt-auto">
                View All Games <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
