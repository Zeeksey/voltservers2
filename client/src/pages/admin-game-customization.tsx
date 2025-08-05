import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Save, ArrowLeft, Video, Package, Wrench } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Game } from '@shared/schema';

export default function AdminGameCustomization() {
  const [match, params] = useRoute('/admin/games/:gameId/customize');
  const gameId = params?.gameId;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch game data
  const { data: game, isLoading: gameLoading } = useQuery<Game>({
    queryKey: ['/api/games', gameId],
    enabled: !!gameId,
  });

  // Game content state
  const [gameFeatures, setGameFeatures] = useState<string[]>([]);
  const [gameAddons, setGameAddons] = useState<string[]>([]);
  const [gameVideos, setGameVideos] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [newAddon, setNewAddon] = useState('');
  const [newVideo, setNewVideo] = useState('');

  // Initialize content from game data
  useEffect(() => {
    if (game) {
      // For now, we'll store addons and videos in the game features array with prefixes
      const features = game.features || [];
      setGameFeatures(features.filter(f => !f.startsWith('ADDON:') && !f.startsWith('VIDEO:')));
      setGameAddons(features.filter(f => f.startsWith('ADDON:')).map(f => f.replace('ADDON:', '')));
      setGameVideos(features.filter(f => f.startsWith('VIDEO:')).map(f => f.replace('VIDEO:', '')));
    }
  }, [game]);

  // Save game content mutation
  const updateGameContentMutation = useMutation({
    mutationFn: async () => {
      const allFeatures = [
        ...gameFeatures,
        ...gameAddons.map(addon => `ADDON:${addon}`),
        ...gameVideos.map(video => `VIDEO:${video}`)
      ];
      
      return apiRequest(`/api/admin/games/${gameId}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...game,
          features: allFeatures
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/games', gameId] });
      toast({ title: 'Game content updated successfully!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to update game content', description: error.message, variant: 'destructive' });
    },
  });

  // Helper functions
  const addFeature = () => {
    if (newFeature.trim()) {
      setGameFeatures([...gameFeatures, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setGameFeatures(gameFeatures.filter((_, i) => i !== index));
  };

  const addAddon = () => {
    if (newAddon.trim()) {
      setGameAddons([...gameAddons, newAddon.trim()]);
      setNewAddon('');
    }
  };

  const removeAddon = (index: number) => {
    setGameAddons(gameAddons.filter((_, i) => i !== index));
  };

  const addVideo = () => {
    if (newVideo.trim()) {
      setGameVideos([...gameVideos, newVideo.trim()]);
      setNewVideo('');
    }
  };

  const removeVideo = (index: number) => {
    setGameVideos(gameVideos.filter((_, i) => i !== index));
  };

  if (gameLoading) {
    return (
      <div className="min-h-screen bg-gaming-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gaming-green mb-4"></div>
          <p className="text-gaming-gray">Loading game data...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gaming-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gaming-green mb-4">Game Not Found</h2>
          <p className="text-gaming-gray mb-6">The game you're looking for doesn't exist.</p>
          <Link href="/admin">
            <Button className="bg-gaming-green text-gaming-black">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-black text-white">
      {/* Header */}
      <div className="border-b border-gaming-green/20 bg-gaming-dark">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Wrench className="w-8 h-8 text-gaming-green" />
            <div>
              <h1 className="text-2xl font-bold">Customize {game.name}</h1>
              <p className="text-gray-400">Edit game features, addons, and content</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => updateGameContentMutation.mutate()}
              disabled={updateGameContentMutation.isPending}
              className="bg-gaming-green text-gaming-black hover:bg-gaming-green/90"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Link href="/admin">
              <Button variant="outline" className="border-gaming-green/30 text-gaming-green">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6">
          {/* Game Info Card */}
          <Card className="bg-gaming-dark border-gaming-green/20">
            <CardHeader>
              <CardTitle className="text-gaming-green flex items-center">
                <img src={game.imageUrl} alt={game.name} className="w-12 h-12 rounded mr-3 object-cover" />
                {game.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gaming-gray">{game.description}</p>
              <div className="flex space-x-4 mt-2">
                <span className="text-sm text-gaming-green">${game.basePrice}/mo</span>
                <span className="text-sm text-gaming-gray">{game.playerCount} players</span>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="features" className="space-y-6">
            <TabsList className="bg-gaming-dark border border-gaming-green/20">
              <TabsTrigger value="features" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black">
                <Wrench className="w-4 h-4 mr-2" />
                Features
              </TabsTrigger>
              <TabsTrigger value="addons" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black">
                <Package className="w-4 h-4 mr-2" />
                Addons/Mods
              </TabsTrigger>
              <TabsTrigger value="videos" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black">
                <Video className="w-4 h-4 mr-2" />
                Videos
              </TabsTrigger>
            </TabsList>

            {/* Features Tab */}
            <TabsContent value="features">
              <Card className="bg-gaming-dark border-gaming-green/20">
                <CardHeader>
                  <CardTitle className="text-gaming-green">Game Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a new feature..."
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      className="bg-gaming-dark-lighter border-gaming-green/30 text-white"
                      onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                    />
                    <Button
                      onClick={addFeature}
                      className="bg-gaming-green text-gaming-black hover:bg-gaming-green/90"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {gameFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gaming-dark-lighter rounded-lg">
                        <span className="text-white">{feature}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFeature(index)}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {gameFeatures.length === 0 && (
                      <p className="text-gaming-gray text-center py-8">No features added yet. Add some features to showcase what makes this game special!</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addons Tab */}
            <TabsContent value="addons">
              <Card className="bg-gaming-dark border-gaming-green/20">
                <CardHeader>
                  <CardTitle className="text-gaming-green">Addons & Mods</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add addon/mod name..."
                      value={newAddon}
                      onChange={(e) => setNewAddon(e.target.value)}
                      className="bg-gaming-dark-lighter border-gaming-green/30 text-white"
                      onKeyPress={(e) => e.key === 'Enter' && addAddon()}
                    />
                    <Button
                      onClick={addAddon}
                      className="bg-gaming-green text-gaming-black hover:bg-gaming-green/90"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {gameAddons.map((addon, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gaming-dark-lighter rounded-lg">
                        <span className="text-white">{addon}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeAddon(index)}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {gameAddons.length === 0 && (
                      <p className="text-gaming-gray text-center py-8">No addons/mods added yet. List popular mods or addons available for this game!</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos">
              <Card className="bg-gaming-dark border-gaming-green/20">
                <CardHeader>
                  <CardTitle className="text-gaming-green">Video Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add YouTube video URL or title..."
                      value={newVideo}
                      onChange={(e) => setNewVideo(e.target.value)}
                      className="bg-gaming-dark-lighter border-gaming-green/30 text-white"
                      onKeyPress={(e) => e.key === 'Enter' && addVideo()}
                    />
                    <Button
                      onClick={addVideo}
                      className="bg-gaming-green text-gaming-black hover:bg-gaming-green/90"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {gameVideos.map((video, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gaming-dark-lighter rounded-lg">
                        <span className="text-white">{video}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeVideo(index)}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {gameVideos.length === 0 && (
                      <p className="text-gaming-gray text-center py-8">No videos added yet. Add gameplay videos, tutorials, or trailers!</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}