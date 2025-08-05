import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import GameImage from "@/components/game-image";
import type { Game } from "@shared/schema";

export default function GameCards() {
  const { data: games, isLoading, isInitialLoading } = useQuery<Game[]>({
    queryKey: ['/api/games'],
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    gcTime: 60 * 60 * 1000, // Keep in cache for 1 hour
    placeholderData: [], // Prevent flash by showing empty array initially
  });

  if (isInitialLoading) {
    return (
      <section id="games" className="py-20 bg-gaming-black-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-gaming-green">Popular</span> Game Servers
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gaming-black-lighter rounded-xl overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gaming-black" />
                <div className="p-6">
                  <div className="h-4 bg-gaming-black rounded mb-4" />
                  <div className="h-3 bg-gaming-black rounded mb-4" />
                  <div className="h-8 bg-gaming-black rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

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
                    src={game.imageUrl} 
                    alt={`${game.name} server interface`} 
                    gameSlug={game.slug}
                    className="w-full h-48 object-cover" 
                    loading="lazy"
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
