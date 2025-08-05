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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Save, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Game, GamePageSection, GamePricingTier, GameFeature } from '@shared/schema';

export default function AdminGameCustomization() {
  const [match, params] = useRoute('/admin/games/:gameId/customize');
  const gameId = params?.gameId;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch game data
  const { data: game, isLoading: gameLoading } = useQuery<Game>({
    queryKey: ['/api/admin/games', gameId],
    enabled: !!gameId,
  });

  // Fetch game customization data
  const { data: sections = [], isLoading: sectionsLoading } = useQuery<GamePageSection[]>({
    queryKey: [`/api/admin/games/${gameId}/sections`],
    enabled: !!gameId,
  });

  const { data: pricingTiers = [], isLoading: tiersLoading } = useQuery<GamePricingTier[]>({
    queryKey: [`/api/admin/games/${gameId}/pricing-tiers`],
    enabled: !!gameId,
  });

  const { data: features = [], isLoading: featuresLoading } = useQuery<GameFeature[]>({
    queryKey: [`/api/admin/games/${gameId}/features`],
    enabled: !!gameId,
  });

  // Section form state
  const [sectionForm, setSectionForm] = useState({
    sectionType: 'custom',
    title: '',
    subtitle: '',
    content: {},
    isEnabled: true,
    sortOrder: 0,
  });

  // Pricing tier form state
  const [tierForm, setTierForm] = useState({
    name: '',
    description: '',
    players: 0,
    ram: '',
    storage: '',
    monthlyPrice: 0,
    biannualPrice: 0,
    annualPrice: 0,
    features: [] as string[],
    isPopular: false,
    isEnabled: true,
    sortOrder: 0,
  });

  // Feature form state
  const [featureForm, setFeatureForm] = useState({
    icon: '',
    title: '',
    description: '',
    isEnabled: true,
    sortOrder: 0,
  });

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingTier, setEditingTier] = useState<string | null>(null);
  const [editingFeature, setEditingFeature] = useState<string | null>(null);
  const [newFeatureText, setNewFeatureText] = useState('');

  // Mutations
  const createSectionMutation = useMutation({
    mutationFn: (data: any) => apiRequest(`/api/admin/games/${gameId}/sections`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/games/${gameId}/sections`] });
      toast({ title: 'Section created successfully' });
      resetSectionForm();
    },
  });

  const updateSectionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest(`/api/admin/sections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/games/${gameId}/sections`] });
      toast({ title: 'Section updated successfully' });
      setEditingSection(null);
      resetSectionForm();
    },
  });

  const deleteSectionMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/admin/sections/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/games/${gameId}/sections`] });
      toast({ title: 'Section deleted successfully' });
    },
  });

  const createTierMutation = useMutation({
    mutationFn: (data: any) => apiRequest(`/api/admin/games/${gameId}/pricing-tiers`, {
      method: 'POST',
      body: JSON.stringify(data),
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