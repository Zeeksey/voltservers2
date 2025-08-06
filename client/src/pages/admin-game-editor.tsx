import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save, Eye, ArrowLeft, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NavigationNew from '@/components/navigation-new';

interface GameData {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  heroImageUrl?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  basePrice: string;
  playerCount: number;
  isPopular: boolean;
  isNew: boolean;
  isTrending: boolean;
  category: string;
  features: string[];
  ramRequirements: string;
  setupComplexity: string;
  pricingPlans?: PricingPlan[];
}

interface PricingPlan {
  id?: string;
  name: string;
  price: string;
  monthlyPrice?: string;
  quarterlyPrice?: string;
  biannualPrice?: string;
  annualPrice?: string;
  features: string[];
  players?: string;
  ram?: string;
  storage?: string;
  isPopular: boolean;
  whmcsProductId?: string;
}

export default function AdminGameEditor() {
  const { gameId } = useParams<{ gameId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [gameData, setGameData] = useState<GameData>({
    id: '',
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    heroImageUrl: '',
    heroTitle: '',
    heroSubtitle: '',
    basePrice: '9.99',
    playerCount: 50,
    isPopular: false,
    isNew: false,
    isTrending: false,
    category: 'survival',
    features: ['Instant Setup', 'DDoS Protection', 'Mod Support', '24/7 Support'],
    ramRequirements: '4GB',
    setupComplexity: 'Easy',
    pricingPlans: []
  });

  // Fetch existing game data
  const { data: existingGame, isLoading } = useQuery({
    queryKey: ['/api/games', gameId],
    enabled: !!gameId && gameId !== 'new'
  });

  // Load existing game data
  useEffect(() => {
    if (existingGame && gameId !== 'new') {
      setGameData(prev => ({
        ...prev,
        ...existingGame,
        features: existingGame.features || ['Instant Setup', 'DDoS Protection', 'Mod Support', '24/7 Support'],
        pricingPlans: existingGame.pricingPlans || []
      }));
    }
  }, [existingGame, gameId]);

  // Save game mutation
  const saveGameMutation = useMutation({
    mutationFn: async (data: GameData) => {
      const method = gameId === 'new' ? 'POST' : 'PUT';
      const url = gameId === 'new' ? '/api/admin/games' : `/api/admin/games/${gameId}`;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('Failed to save game');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Game saved successfully!"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/games'] });
      setLocation('/admin');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save game",
        variant: "destructive"
      });
    }
  });

  const handleInputChange = (field: keyof GameData, value: any) => {
    setGameData(prev => ({ ...prev, [field]: value }));
  };

  const addFeature = () => {
    setGameData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setGameData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  const removeFeature = (index: number) => {
    setGameData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addPricingPlan = () => {
    const basePrice = 9.99;
    const newPlan: PricingPlan = {
      name: 'New Plan',
      price: basePrice.toFixed(2),
      monthlyPrice: basePrice.toFixed(2),
      quarterlyPrice: (basePrice * 0.9).toFixed(2),  // 10% off
      biannualPrice: (basePrice * 0.8).toFixed(2),   // 20% off
      annualPrice: (basePrice * 0.75).toFixed(2),    // 25% off
      features: ['Feature 1', 'Feature 2'],
      players: '10',
      ram: '2GB',
      storage: '10GB',
      isPopular: false,
      whmcsProductId: ''
    };
    
    setGameData(prev => ({
      ...prev,
      pricingPlans: [...(prev.pricingPlans || []), newPlan]
    }));
  };

  const updatePricingPlan = (index: number, field: keyof PricingPlan, value: any) => {
    setGameData(prev => ({
      ...prev,
      pricingPlans: prev.pricingPlans?.map((plan, i) => {
        if (i !== index) return plan;
        
        const updatedPlan = { ...plan, [field]: value };
        
        // Auto-calculate discounted prices when monthly price changes
        if (field === 'monthlyPrice' && value) {
          const monthlyPrice = parseFloat(value);
          if (!isNaN(monthlyPrice)) {
            updatedPlan.quarterlyPrice = (monthlyPrice * 0.9).toFixed(2); // 10% off
            updatedPlan.biannualPrice = (monthlyPrice * 0.8).toFixed(2);   // 20% off
            updatedPlan.annualPrice = (monthlyPrice * 0.75).toFixed(2);    // 25% off
          }
        }
        
        return updatedPlan;
      }) || []
    }));
  };

  const removePricingPlan = (index: number) => {
    setGameData(prev => ({
      ...prev,
      pricingPlans: prev.pricingPlans?.filter((_, i) => i !== index) || []
    }));
  };

  const addPlanFeature = (planIndex: number) => {
    setGameData(prev => ({
      ...prev,
      pricingPlans: prev.pricingPlans?.map((plan, i) => 
        i === planIndex ? { ...plan, features: [...plan.features, ''] } : plan
      ) || []
    }));
  };

  const updatePlanFeature = (planIndex: number, featureIndex: number, value: string) => {
    setGameData(prev => ({
      ...prev,
      pricingPlans: prev.pricingPlans?.map((plan, i) => 
        i === planIndex ? {
          ...plan,
          features: plan.features.map((f, fi) => fi === featureIndex ? value : f)
        } : plan
      ) || []
    }));
  };

  const removePlanFeature = (planIndex: number, featureIndex: number) => {
    setGameData(prev => ({
      ...prev,
      pricingPlans: prev.pricingPlans?.map((plan, i) => 
        i === planIndex ? {
          ...plan,
          features: plan.features.filter((_, fi) => fi !== featureIndex)
        } : plan
      ) || []
    }));
  };

  const gameCategories = [
    'survival', 'sandbox', 'fps', 'strategy', 'rpg', 'mmo', 'racing', 'simulation', 'action', 'other'
  ];

  const quickStartTemplates = [
    {
      name: 'Minecraft',
      data: {
        category: 'sandbox',
        features: ['Instant Setup', 'DDoS Protection', 'Mod Support', 'Plugin Support', 'Automated Backups'],
        ramRequirements: '2GB',
        setupComplexity: 'Easy',
        basePrice: '4.99'
      }
    },
    {
      name: 'Rust',
      data: {
        category: 'survival',
        features: ['Anti-Cheat', 'DDoS Protection', 'Oxide Support', 'Automated Wipes', 'FTP Access'],
        ramRequirements: '4GB',
        setupComplexity: 'Medium',
        basePrice: '9.99'
      }
    },
    {
      name: 'Valheim',
      data: {
        category: 'survival',
        features: ['Password Protection', 'World Backup', 'Mod Support', 'DDoS Protection'],
        ramRequirements: '4GB',
        setupComplexity: 'Easy',
        basePrice: '7.99'
      }
    }
  ];

  const applyTemplate = (template: any) => {
    setGameData(prev => ({
      ...prev,
      ...template.data,
      features: template.data.features
    }));
    toast({
      title: "Template Applied",
      description: `${template.name} template settings applied!`
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gaming-black">
        <NavigationNew />
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <div className="text-gaming-green">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-black">
      <NavigationNew />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation('/admin')}
              className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-black"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
            <h1 className="text-3xl font-bold text-gaming-white">
              {gameId === 'new' ? 'Create New Game' : `Edit ${gameData.name}`}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {gameData.slug && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/games/${gameData.slug}`, '_blank')}
                className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-black"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            )}
            <Button
              onClick={() => saveGameMutation.mutate(gameData)}
              disabled={saveGameMutation.isPending}
              className="bg-gaming-green text-black hover:bg-gaming-green/90"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Game
            </Button>
          </div>
        </div>

        {/* Quick Start Templates */}
        {gameId === 'new' && (
          <Card className="mb-6 bg-gaming-black-light border-gaming-green/30">
            <CardHeader>
              <CardTitle className="text-gaming-white">Quick Start Templates</CardTitle>
              <CardDescription className="text-gaming-gray">
                Start with pre-configured settings for popular games
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {quickStartTemplates.map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => applyTemplate(template)}
                    className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-black"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {template.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gaming-black-light">
            <TabsTrigger value="basic" className="data-[state=active]:bg-gaming-green data-[state=active]:text-black">
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="hero" className="data-[state=active]:bg-gaming-green data-[state=active]:text-black">
              Hero Section
            </TabsTrigger>
            <TabsTrigger value="pricing" className="data-[state=active]:bg-gaming-green data-[state=active]:text-black">
              Pricing Plans
            </TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-gaming-green data-[state=active]:text-black">
              Features & Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card className="bg-gaming-black-light border-gaming-green/30">
              <CardHeader>
                <CardTitle className="text-gaming-white">Basic Information</CardTitle>
                <CardDescription className="text-gaming-gray">
                  Core game details and identification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gaming-white">Game Name</Label>
                    <Input
                      id="name"
                      value={gameData.name}
                      onChange={(e) => {
                        handleInputChange('name', e.target.value);
                        handleInputChange('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'));
                      }}
                      placeholder="Enter game name"
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug" className="text-gaming-white">URL Slug</Label>
                    <Input
                      id="slug"
                      value={gameData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      placeholder="game-url-slug"
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gaming-white">Description</Label>
                  <Textarea
                    id="description"
                    value={gameData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter game description"
                    rows={3}
                    className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl" className="text-gaming-white">Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={gameData.imageUrl}
                      onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-gaming-white">Category</Label>
                    <Select value={gameData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className="bg-gaming-black border-gaming-green/30 text-gaming-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gaming-black border-gaming-green/30">
                        {gameCategories.map((cat) => (
                          <SelectItem key={cat} value={cat} className="text-gaming-white hover:bg-gaming-green/20">
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="basePrice" className="text-gaming-white">Base Price ($)</Label>
                    <Input
                      id="basePrice"
                      value={gameData.basePrice}
                      onChange={(e) => handleInputChange('basePrice', e.target.value)}
                      placeholder="9.99"
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="playerCount" className="text-gaming-white">Max Players</Label>
                    <Input
                      id="playerCount"
                      type="number"
                      value={gameData.playerCount}
                      onChange={(e) => handleInputChange('playerCount', parseInt(e.target.value))}
                      placeholder="50"
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gaming-white">Status Badges</Label>
                    <div className="flex gap-4 pt-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isPopular"
                          checked={gameData.isPopular}
                          onCheckedChange={(checked) => handleInputChange('isPopular', checked)}
                        />
                        <Label htmlFor="isPopular" className="text-gaming-white text-sm">Popular</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isNew"
                          checked={gameData.isNew}
                          onCheckedChange={(checked) => handleInputChange('isNew', checked)}
                        />
                        <Label htmlFor="isNew" className="text-gaming-white text-sm">New</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isTrending"
                          checked={gameData.isTrending}
                          onCheckedChange={(checked) => handleInputChange('isTrending', checked)}
                        />
                        <Label htmlFor="isTrending" className="text-gaming-white text-sm">Trending</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero" className="space-y-6">
            <Card className="bg-gaming-black-light border-gaming-green/30">
              <CardHeader>
                <CardTitle className="text-gaming-white">Hero Section</CardTitle>
                <CardDescription className="text-gaming-gray">
                  Customize the main banner and call-to-action area
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="heroTitle" className="text-gaming-white">Hero Title</Label>
                  <Input
                    id="heroTitle"
                    value={gameData.heroTitle || ''}
                    onChange={(e) => handleInputChange('heroTitle', e.target.value)}
                    placeholder="Lag-Free, High Performance [Game] Servers"
                    className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle" className="text-gaming-white">Hero Subtitle</Label>
                  <Textarea
                    id="heroSubtitle"
                    value={gameData.heroSubtitle || ''}
                    onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
                    placeholder="Instant setup, mod support, automatic backups, and 24/7 expert support..."
                    rows={3}
                    className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heroImageUrl" className="text-gaming-white">Hero Image URL</Label>
                  <Input
                    id="heroImageUrl"
                    value={gameData.heroImageUrl || ''}
                    onChange={(e) => handleInputChange('heroImageUrl', e.target.value)}
                    placeholder="https://example.com/hero-image.jpg"
                    className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                  />
                  <p className="text-sm text-gaming-gray">
                    Leave empty to use main image URL. Recommended size: 800x600px
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <Card className="bg-gaming-black-light border-gaming-green/30">
              <CardHeader>
                <CardTitle className="text-gaming-white">Pricing Plans</CardTitle>
                <CardDescription className="text-gaming-gray">
                  Create and manage hosting plans with different pricing tiers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button
                    onClick={addPricingPlan}
                    className="bg-gaming-green text-black hover:bg-gaming-green/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Pricing Plan
                  </Button>
                  <div className="text-xs text-gaming-gray bg-gaming-black-light px-3 py-2 rounded">
                    💡 Enter monthly price - discounts auto-calculate (10%, 20%, 25% off)
                  </div>
                </div>

                {gameData.pricingPlans?.map((plan, planIndex) => (
                  <Card key={planIndex} className="bg-gaming-black border-gaming-green/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-gaming-white text-lg">
                          Plan {planIndex + 1}: {plan.name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={plan.isPopular}
                            onCheckedChange={(checked) => updatePricingPlan(planIndex, 'isPopular', checked)}
                          />
                          <Label className="text-gaming-white text-sm">Most Popular</Label>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removePricingPlan(planIndex)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gaming-white">Plan Name</Label>
                          <Input
                            value={plan.name}
                            onChange={(e) => updatePricingPlan(planIndex, 'name', e.target.value)}
                            className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gaming-white">WHMCS Product ID</Label>
                          <Input
                            value={plan.whmcsProductId || ''}
                            onChange={(e) => updatePricingPlan(planIndex, 'whmcsProductId', e.target.value)}
                            placeholder="123"
                            className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gaming-white">Monthly ($) <span className="text-xs text-gaming-gray">(Auto-calculates discounts)</span></Label>
                          <Input
                            value={plan.monthlyPrice || ''}
                            onChange={(e) => updatePricingPlan(planIndex, 'monthlyPrice', e.target.value)}
                            placeholder="9.99"
                            className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gaming-white">Quarterly ($) <span className="text-xs text-gaming-green">-10% auto</span></Label>
                          <Input
                            value={plan.quarterlyPrice || ''}
                            onChange={(e) => updatePricingPlan(planIndex, 'quarterlyPrice', e.target.value)}
                            placeholder="Auto-calculated"
                            className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gaming-white">Biannual ($) <span className="text-xs text-gaming-green">-20% auto</span></Label>
                          <Input
                            value={plan.biannualPrice || ''}
                            onChange={(e) => updatePricingPlan(planIndex, 'biannualPrice', e.target.value)}
                            placeholder="Auto-calculated"
                            className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gaming-white">Annual ($) <span className="text-xs text-gaming-green">-25% auto</span></Label>
                          <Input
                            value={plan.annualPrice || ''}
                            onChange={(e) => updatePricingPlan(planIndex, 'annualPrice', e.target.value)}
                            placeholder="Auto-calculated"
                            className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gaming-white">Players</Label>
                          <Input
                            value={plan.players || ''}
                            onChange={(e) => updatePricingPlan(planIndex, 'players', e.target.value)}
                            placeholder="10"
                            className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gaming-white">RAM</Label>
                          <Input
                            value={plan.ram || ''}
                            onChange={(e) => updatePricingPlan(planIndex, 'ram', e.target.value)}
                            placeholder="2GB"
                            className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gaming-white">Storage</Label>
                          <Input
                            value={plan.storage || ''}
                            onChange={(e) => updatePricingPlan(planIndex, 'storage', e.target.value)}
                            placeholder="10GB"
                            className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-gaming-white">Plan Features</Label>
                          <Button
                            size="sm"
                            onClick={() => addPlanFeature(planIndex)}
                            className="bg-gaming-green text-black hover:bg-gaming-green/90"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Feature
                          </Button>
                        </div>
                        {plan.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2">
                            <Input
                              value={feature}
                              onChange={(e) => updatePlanFeature(planIndex, featureIndex, e.target.value)}
                              placeholder="Enter feature"
                              className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removePlanFeature(planIndex, featureIndex)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {(!gameData.pricingPlans || gameData.pricingPlans.length === 0) && (
                  <div className="text-center py-8 text-gaming-gray">
                    No pricing plans added yet. Click "Add Pricing Plan" to get started.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card className="bg-gaming-black-light border-gaming-green/30">
              <CardHeader>
                <CardTitle className="text-gaming-white">Game Features</CardTitle>
                <CardDescription className="text-gaming-gray">
                  Configure the features and technical specifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ramRequirements" className="text-gaming-white">RAM Requirements</Label>
                    <Select 
                      value={gameData.ramRequirements} 
                      onValueChange={(value) => handleInputChange('ramRequirements', value)}
                    >
                      <SelectTrigger className="bg-gaming-black border-gaming-green/30 text-gaming-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gaming-black border-gaming-green/30">
                        {['1GB', '2GB', '4GB', '8GB', '16GB', '32GB'].map((ram) => (
                          <SelectItem key={ram} value={ram} className="text-gaming-white hover:bg-gaming-green/20">
                            {ram}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="setupComplexity" className="text-gaming-white">Setup Complexity</Label>
                    <Select 
                      value={gameData.setupComplexity} 
                      onValueChange={(value) => handleInputChange('setupComplexity', value)}
                    >
                      <SelectTrigger className="bg-gaming-black border-gaming-green/30 text-gaming-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gaming-black border-gaming-green/30">
                        {['Easy', 'Medium', 'Advanced'].map((complexity) => (
                          <SelectItem key={complexity} value={complexity} className="text-gaming-white hover:bg-gaming-green/20">
                            {complexity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-gaming-white">Features List</Label>
                    <Button
                      onClick={addFeature}
                      size="sm"
                      className="bg-gaming-green text-black hover:bg-gaming-green/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Feature
                    </Button>
                  </div>
                  
                  {gameData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder="Enter feature"
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFeature(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-8">
          <Button
            onClick={() => saveGameMutation.mutate(gameData)}
            disabled={saveGameMutation.isPending}
            size="lg"
            className="bg-gaming-green text-black hover:bg-gaming-green/90"
          >
            <Save className="w-4 h-4 mr-2" />
            {saveGameMutation.isPending ? 'Saving...' : 'Save Game'}
          </Button>
        </div>
      </div>
    </div>
  );
}