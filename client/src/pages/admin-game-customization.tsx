import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Save, ArrowLeft, Video, Package, Wrench } from 'lucide-react';
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
      setGameFeatures(game.features || []);
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
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/games/${gameId}/pricing-tiers`] });
      toast({ title: 'Pricing tier created successfully' });
      resetTierForm();
    },
  });

  const updateTierMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest(`/api/admin/pricing-tiers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/games/${gameId}/pricing-tiers`] });
      toast({ title: 'Pricing tier updated successfully' });
      setEditingTier(null);
      resetTierForm();
    },
  });

  const deleteTierMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/admin/pricing-tiers/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/games/${gameId}/pricing-tiers`] });
      toast({ title: 'Pricing tier deleted successfully' });
    },
  });

  const createFeatureMutation = useMutation({
    mutationFn: (data: any) => apiRequest(`/api/admin/games/${gameId}/features`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/games/${gameId}/features`] });
      toast({ title: 'Feature created successfully' });
      resetFeatureForm();
    },
  });

  const updateFeatureMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest(`/api/admin/features/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/games/${gameId}/features`] });
      toast({ title: 'Feature updated successfully' });
      setEditingFeature(null);
      resetFeatureForm();
    },
  });

  const deleteFeatureMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/admin/features/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/games/${gameId}/features`] });
      toast({ title: 'Feature deleted successfully' });
    },
  });

  const resetSectionForm = () => {
    setSectionForm({
      sectionType: 'custom',
      title: '',
      subtitle: '',
      content: {},
      isEnabled: true,
      sortOrder: 0,
    });
  };

  const resetTierForm = () => {
    setTierForm({
      name: '',
      description: '',
      players: 0,
      ram: '',
      storage: '',
      monthlyPrice: 0,
      biannualPrice: 0,
      annualPrice: 0,
      features: [],
      isPopular: false,
      isEnabled: true,
      sortOrder: 0,
    });
  };

  const resetFeatureForm = () => {
    setFeatureForm({
      icon: '',
      title: '',
      description: '',
      isEnabled: true,
      sortOrder: 0,
    });
  };

  const editSection = (section: GamePageSection) => {
    setEditingSection(section.id);
    setSectionForm({
      sectionType: section.sectionType,
      title: section.title || '',
      subtitle: section.subtitle || '',
      content: section.content || {},
      isEnabled: section.isEnabled,
      sortOrder: section.sortOrder,
    });
  };

  const editTier = (tier: GamePricingTier) => {
    setEditingTier(tier.id);
    setTierForm({
      name: tier.name,
      description: tier.description || '',
      players: tier.players || 0,
      ram: tier.ram || '',
      storage: tier.storage || '',
      monthlyPrice: parseFloat(tier.monthlyPrice),
      biannualPrice: parseFloat(tier.biannualPrice || '0'),
      annualPrice: parseFloat(tier.annualPrice || '0'),
      features: tier.features || [],
      isPopular: tier.isPopular,
      isEnabled: tier.isEnabled,
      sortOrder: tier.sortOrder,
    });
  };

  const editFeature = (feature: GameFeature) => {
    setEditingFeature(feature.id);
    setFeatureForm({
      icon: feature.icon || '',
      title: feature.title,
      description: feature.description,
      isEnabled: feature.isEnabled,
      sortOrder: feature.sortOrder,
    });
  };

  const addFeatureToTier = () => {
    if (newFeatureText.trim()) {
      setTierForm(prev => ({
        ...prev,
        features: [...prev.features, newFeatureText.trim()]
      }));
      setNewFeatureText('');
    }
  };

  const removeFeatureFromTier = (index: number) => {
    setTierForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  if (gameLoading) {
    return <div className="p-8">Loading game data...</div>;
  }

  if (!game) {
    return <div className="p-8">Game not found</div>;
  }

  return (
    <div className="p-8 bg-gaming-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gaming-white">
                Customize Game Page: {game.name}
              </h1>
              <p className="text-gaming-gray">
                Configure sections, pricing tiers, and features for this game page
              </p>
            </div>
          </div>
          <Link href={`/games/${game.slug}`}>
            <Button className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black">
              <Eye className="w-4 h-4 mr-2" />
              Preview Page
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="sections" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gaming-black-lighter">
            <TabsTrigger value="sections" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black">
              Page Sections
            </TabsTrigger>
            <TabsTrigger value="pricing" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black">
              Pricing Tiers
            </TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black">
              Features
            </TabsTrigger>
          </TabsList>

          {/* Page Sections Tab */}
          <TabsContent value="sections" className="space-y-6">
            <Card className="bg-gaming-black-lighter border-gaming-green/20">
              <CardHeader>
                <CardTitle className="text-gaming-white">
                  {editingSection ? 'Edit Section' : 'Add New Section'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gaming-white">Section Type</Label>
                    <Select 
                      value={sectionForm.sectionType} 
                      onValueChange={(value) => setSectionForm(prev => ({ ...prev, sectionType: value }))}
                    >
                      <SelectTrigger className="bg-gaming-black border-gaming-green/30 text-gaming-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gaming-black border-gaming-green/30">
                        <SelectItem value="hero">Hero Section</SelectItem>
                        <SelectItem value="features">Features</SelectItem>
                        <SelectItem value="pricing">Pricing</SelectItem>
                        <SelectItem value="faq">FAQ</SelectItem>
                        <SelectItem value="cta">Call to Action</SelectItem>
                        <SelectItem value="testimonials">Testimonials</SelectItem>
                        <SelectItem value="versions">Versions</SelectItem>
                        <SelectItem value="custom">Custom Section</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gaming-white">Sort Order</Label>
                    <Input
                      type="number"
                      value={sectionForm.sortOrder}
                      onChange={(e) => setSectionForm(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gaming-white">Title</Label>
                  <Input
                    value={sectionForm.title}
                    onChange={(e) => setSectionForm(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                  />
                </div>

                <div>
                  <Label className="text-gaming-white">Subtitle</Label>
                  <Input
                    value={sectionForm.subtitle}
                    onChange={(e) => setSectionForm(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={sectionForm.isEnabled}
                    onCheckedChange={(checked) => setSectionForm(prev => ({ ...prev, isEnabled: checked }))}
                  />
                  <Label className="text-gaming-white">Enabled</Label>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      if (editingSection) {
                        updateSectionMutation.mutate({ id: editingSection, data: sectionForm });
                      } else {
                        createSectionMutation.mutate(sectionForm);
                      }
                    }}
                    disabled={createSectionMutation.isPending || updateSectionMutation.isPending}
                    className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingSection ? 'Update Section' : 'Create Section'}
                  </Button>
                  {editingSection && (
                    <Button
                      onClick={() => {
                        setEditingSection(null);
                        resetSectionForm();
                      }}
                      variant="outline"
                      className="border-gaming-green/30 text-gaming-white"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Existing Sections */}
            <div className="grid gap-4">
              {sectionsLoading ? (
                <div>Loading sections...</div>
              ) : (
                sections.map((section) => (
                  <Card key={section.id} className="bg-gaming-black-lighter border-gaming-green/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Badge variant={section.isEnabled ? 'default' : 'secondary'} className="bg-gaming-green text-gaming-black">
                            {section.sectionType}
                          </Badge>
                          {!section.isEnabled && <EyeOff className="w-4 h-4 text-gaming-gray" />}
                          <div>
                            <h3 className="text-gaming-white font-semibold">{section.title || 'Untitled Section'}</h3>
                            {section.subtitle && <p className="text-gaming-gray text-sm">{section.subtitle}</p>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => editSection(section)}
                            variant="outline"
                            className="border-gaming-green/30 text-gaming-white"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => deleteSectionMutation.mutate(section.id)}
                            variant="outline"
                            className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Pricing Tiers Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card className="bg-gaming-black-lighter border-gaming-green/20">
              <CardHeader>
                <CardTitle className="text-gaming-white">
                  {editingTier ? 'Edit Pricing Tier' : 'Add New Pricing Tier'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gaming-white">Name</Label>
                    <Input
                      value={tierForm.name}
                      onChange={(e) => setTierForm(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gaming-white">Description</Label>
                    <Input
                      value={tierForm.description}
                      onChange={(e) => setTierForm(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-gaming-white">Players</Label>
                    <Input
                      type="number"
                      value={tierForm.players}
                      onChange={(e) => setTierForm(prev => ({ ...prev, players: parseInt(e.target.value) || 0 }))}
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gaming-white">RAM</Label>
                    <Input
                      value={tierForm.ram}
                      onChange={(e) => setTierForm(prev => ({ ...prev, ram: e.target.value }))}
                      placeholder="e.g., 4GB"
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gaming-white">Storage</Label>
                    <Input
                      value={tierForm.storage}
                      onChange={(e) => setTierForm(prev => ({ ...prev, storage: e.target.value }))}
                      placeholder="e.g., 100GB"
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-gaming-white">Monthly Price ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={tierForm.monthlyPrice}
                      onChange={(e) => setTierForm(prev => ({ ...prev, monthlyPrice: parseFloat(e.target.value) || 0 }))}
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gaming-white">6-Month Price ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={tierForm.biannualPrice}
                      onChange={(e) => setTierForm(prev => ({ ...prev, biannualPrice: parseFloat(e.target.value) || 0 }))}
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gaming-white">Annual Price ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={tierForm.annualPrice}
                      onChange={(e) => setTierForm(prev => ({ ...prev, annualPrice: parseFloat(e.target.value) || 0 }))}
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gaming-white">Features</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newFeatureText}
                      onChange={(e) => setNewFeatureText(e.target.value)}
                      placeholder="Add a feature..."
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                      onKeyPress={(e) => e.key === 'Enter' && addFeatureToTier()}
                    />
                    <Button
                      onClick={addFeatureToTier}
                      size="sm"
                      className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {tierForm.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between bg-gaming-black p-2 rounded">
                        <span className="text-gaming-white">{feature}</span>
                        <Button
                          size="sm"
                          onClick={() => removeFeatureFromTier(index)}
                          variant="outline"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={tierForm.isPopular}
                      onCheckedChange={(checked) => setTierForm(prev => ({ ...prev, isPopular: checked }))}
                    />
                    <Label className="text-gaming-white">Popular</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={tierForm.isEnabled}
                      onCheckedChange={(checked) => setTierForm(prev => ({ ...prev, isEnabled: checked }))}
                    />
                    <Label className="text-gaming-white">Enabled</Label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      if (editingTier) {
                        updateTierMutation.mutate({ id: editingTier, data: tierForm });
                      } else {
                        createTierMutation.mutate(tierForm);
                      }
                    }}
                    disabled={createTierMutation.isPending || updateTierMutation.isPending}
                    className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingTier ? 'Update Tier' : 'Create Tier'}
                  </Button>
                  {editingTier && (
                    <Button
                      onClick={() => {
                        setEditingTier(null);
                        resetTierForm();
                      }}
                      variant="outline"
                      className="border-gaming-green/30 text-gaming-white"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Existing Tiers */}
            <div className="grid gap-4">
              {tiersLoading ? (
                <div>Loading pricing tiers...</div>
              ) : (
                pricingTiers.map((tier) => (
                  <Card key={tier.id} className="bg-gaming-black-lighter border-gaming-green/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col gap-1">
                            {tier.isPopular && <Badge className="bg-gaming-green text-gaming-black">Popular</Badge>}
                            {!tier.isEnabled && <EyeOff className="w-4 h-4 text-gaming-gray" />}
                          </div>
                          <div>
                            <h3 className="text-gaming-white font-semibold">{tier.name}</h3>
                            <p className="text-gaming-gray text-sm">{tier.description}</p>
                            <div className="flex gap-4 text-sm text-gaming-gray">
                              <span>{tier.players} players</span>
                              <span>{tier.ram} RAM</span>
                              <span>{tier.storage} storage</span>
                              <span className="text-gaming-green font-semibold">${tier.monthlyPrice}/mo</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => editTier(tier)}
                            variant="outline"
                            className="border-gaming-green/30 text-gaming-white"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => deleteTierMutation.mutate(tier.id)}
                            variant="outline"
                            className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <Card className="bg-gaming-black-lighter border-gaming-green/20">
              <CardHeader>
                <CardTitle className="text-gaming-white">
                  {editingFeature ? 'Edit Feature' : 'Add New Feature'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gaming-white">Icon (Lucide name)</Label>
                    <Input
                      value={featureForm.icon}
                      onChange={(e) => setFeatureForm(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="e.g., Check, Shield, Globe"
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gaming-white">Sort Order</Label>
                    <Input
                      type="number"
                      value={featureForm.sortOrder}
                      onChange={(e) => setFeatureForm(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gaming-white">Title</Label>
                  <Input
                    value={featureForm.title}
                    onChange={(e) => setFeatureForm(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                  />
                </div>

                <div>
                  <Label className="text-gaming-white">Description</Label>
                  <Textarea
                    value={featureForm.description}
                    onChange={(e) => setFeatureForm(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={featureForm.isEnabled}
                    onCheckedChange={(checked) => setFeatureForm(prev => ({ ...prev, isEnabled: checked }))}
                  />
                  <Label className="text-gaming-white">Enabled</Label>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      if (editingFeature) {
                        updateFeatureMutation.mutate({ id: editingFeature, data: featureForm });
                      } else {
                        createFeatureMutation.mutate(featureForm);
                      }
                    }}
                    disabled={createFeatureMutation.isPending || updateFeatureMutation.isPending}
                    className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingFeature ? 'Update Feature' : 'Create Feature'}
                  </Button>
                  {editingFeature && (
                    <Button
                      onClick={() => {
                        setEditingFeature(null);
                        resetFeatureForm();
                      }}
                      variant="outline"
                      className="border-gaming-green/30 text-gaming-white"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Existing Features */}
            <div className="grid gap-4">
              {featuresLoading ? (
                <div>Loading features...</div>
              ) : (
                features.map((feature) => (
                  <Card key={feature.id} className="bg-gaming-black-lighter border-gaming-green/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {!feature.isEnabled && <EyeOff className="w-4 h-4 text-gaming-gray" />}
                          <div>
                            <h3 className="text-gaming-white font-semibold">{feature.title}</h3>
                            <p className="text-gaming-gray text-sm">{feature.description}</p>
                            {feature.icon && <p className="text-gaming-green text-xs">Icon: {feature.icon}</p>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => editFeature(feature)}
                            variant="outline"
                            className="border-gaming-green/30 text-gaming-white"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => deleteFeatureMutation.mutate(feature.id)}
                            variant="outline"
                            className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}