import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Plus, 
  Trash2, 
  Move, 
  Settings2,
  Image as ImageIcon,
  Type,
  DollarSign,
  Star,
  Users,
  MessageCircle,
  Info,
  Zap
} from "lucide-react";
import NavigationNew from "@/components/navigation-new";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface GameTemplate {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  basePrice: string;
  category: string;
  minRam: number;
  recommendedRam: number;
  setupComplexity: 'easy' | 'medium' | 'hard';
  isPopular: boolean;
  isNew: boolean;
  isTrending: boolean;
  heroTitle?: string;
  heroSubtitle?: string;
  features: string[];
  pricingPlans: PricingPlan[];
  sections: GameSection[];
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
  isPopular: boolean;
  ram?: string;
  storage?: string;
  players?: string;
  whmcsProductId?: string;
}

interface GameSection {
  id?: string;
  sectionType: 'hero' | 'features' | 'pricing' | 'gallery' | 'testimonials' | 'faq' | 'cta' | 'server-specs';
  title: string;
  subtitle?: string;
  content?: string;
  isEnabled: boolean;
  sortOrder: number;
  customData?: any;
}

export default function AdminGameTemplateEditor() {
  const [, params] = useRoute("/admin/games/:gameId/template");
  const { gameId } = params;
  const [activeTab, setActiveTab] = useState("basic");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: game, isLoading } = useQuery<GameTemplate>({
    queryKey: [`/api/games/${gameId}`],
    enabled: !!gameId,
  });

  const { data: existingSections = [] } = useQuery({
    queryKey: [`/api/games/${gameId}/sections`],
    enabled: !!gameId,
  });

  const { data: existingPricingTiers = [] } = useQuery({
    queryKey: [`/api/games/${gameId}/pricing-tiers`],
    enabled: !!gameId,
  });

  const { data: existingFeatures = [] } = useQuery({
    queryKey: [`/api/games/${gameId}/features`],
    enabled: !!gameId,
  });

  const [templateData, setTemplateData] = useState<GameTemplate>({
    id: '',
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    basePrice: '',
    category: 'survival',
    minRam: 2,
    recommendedRam: 4,
    setupComplexity: 'easy',
    isPopular: false,
    isNew: false,
    isTrending: false,
    heroTitle: '',
    heroSubtitle: '',
    features: [],
    pricingPlans: [],
    sections: []
  });

  useEffect(() => {
    if (game) {
      setTemplateData({
        ...game,
        heroTitle: game.heroTitle || `${game.name} Server Hosting`,
        heroSubtitle: game.heroSubtitle || `Professional ${game.name} servers with 99.9% uptime`,
        features: existingFeatures.map((f: any) => f.name) || [],
        pricingPlans: existingPricingTiers || [],
        sections: existingSections || []
      });
    }
  }, [game, existingSections, existingPricingTiers, existingFeatures]);

  const saveTemplateMutation = useMutation({
    mutationFn: async (data: GameTemplate) => {
      // Save game basic info
      await apiRequest(`/api/games/${gameId}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: data.name,
          slug: data.slug,
          description: data.description,
          imageUrl: data.imageUrl,
          basePrice: data.basePrice,
          category: data.category,
          minRam: data.minRam,
          recommendedRam: data.recommendedRam,
          setupComplexity: data.setupComplexity,
          isPopular: data.isPopular,
          isNew: data.isNew,
          isTrending: data.isTrending,
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle
        }),
      });

      // Save features
      await apiRequest(`/api/games/${gameId}/features`, {
        method: 'POST',
        body: JSON.stringify({ features: data.features }),
      });

      // Save pricing plans
      await apiRequest(`/api/games/${gameId}/pricing-tiers`, {
        method: 'POST',
        body: JSON.stringify({ pricingTiers: data.pricingPlans }),
      });

      // Save sections
      await apiRequest(`/api/games/${gameId}/sections`, {
        method: 'POST',
        body: JSON.stringify({ sections: data.sections }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Template Saved",
        description: "Game template has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/games/${gameId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/games/${gameId}/sections`] });
      queryClient.invalidateQueries({ queryKey: [`/api/games/${gameId}/pricing-tiers`] });
      queryClient.invalidateQueries({ queryKey: [`/api/games/${gameId}/features`] });
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "Failed to save game template. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addPricingPlan = () => {
    setTemplateData(prev => ({
      ...prev,
      pricingPlans: [
        ...prev.pricingPlans,
        {
          name: "New Plan",
          price: "9.99",
          features: ["Feature 1", "Feature 2"],
          isPopular: false,
          ram: "4GB",
          storage: "20GB",
          players: "Up to 20"
        }
      ]
    }));
  };

  const updatePricingPlan = (index: number, updates: Partial<PricingPlan>) => {
    setTemplateData(prev => ({
      ...prev,
      pricingPlans: prev.pricingPlans.map((plan, i) => 
        i === index ? { ...plan, ...updates } : plan
      )
    }));
  };

  const removePricingPlan = (index: number) => {
    setTemplateData(prev => ({
      ...prev,
      pricingPlans: prev.pricingPlans.filter((_, i) => i !== index)
    }));
  };

  const addSection = (type: GameSection['sectionType']) => {
    const newSection: GameSection = {
      sectionType: type,
      title: `New ${type} Section`,
      subtitle: '',
      content: '',
      isEnabled: true,
      sortOrder: templateData.sections.length,
      customData: {}
    };
    
    setTemplateData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const updateSection = (index: number, updates: Partial<GameSection>) => {
    setTemplateData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === index ? { ...section, ...updates } : section
      )
    }));
  };

  const removeSection = (index: number) => {
    setTemplateData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    const newFeature = prompt("Enter feature name:");
    if (newFeature) {
      setTemplateData(prev => ({
        ...prev,
        features: [...prev.features, newFeature]
      }));
    }
  };

  const removeFeature = (index: number) => {
    setTemplateData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    saveTemplateMutation.mutate(templateData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gaming-black">
        <NavigationNew />
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <div className="text-gaming-green">Loading template editor...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-black">
      <NavigationNew />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gaming-white">Game Template Editor</h1>
              <p className="text-gaming-gray">Customize every aspect of the {templateData.name} game page</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link href={`/games/${templateData.slug}`}>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </Link>
            <Button 
              onClick={handleSave}
              disabled={saveTemplateMutation.isPending}
              className="bg-gaming-green text-gaming-black hover:bg-gaming-green-dark"
            >
              <Save className="w-4 h-4 mr-2" />
              {saveTemplateMutation.isPending ? "Saving..." : "Save Template"}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 bg-gaming-black-lighter">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="pricing">Pricing Plans</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="sections">Page Sections</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic">
            <Card className="bg-gaming-black-lighter border-gaming-green/20">
              <CardHeader>
                <CardTitle className="text-gaming-white">Basic Game Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gaming-white">Game Name</Label>
                    <Input
                      value={templateData.name}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-gaming-black border-gaming-green/30"
                    />
                  </div>
                  <div>
                    <Label className="text-gaming-white">URL Slug</Label>
                    <Input
                      value={templateData.slug}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, slug: e.target.value }))}
                      className="bg-gaming-black border-gaming-green/30"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gaming-white">Description</Label>
                  <Textarea
                    value={templateData.description}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-gaming-black border-gaming-green/30"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gaming-white">Image URL</Label>
                    <Input
                      value={templateData.imageUrl}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, imageUrl: e.target.value }))}
                      className="bg-gaming-black border-gaming-green/30"
                    />
                  </div>
                  <div>
                    <Label className="text-gaming-white">Base Price</Label>
                    <Input
                      value={templateData.basePrice}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, basePrice: e.target.value }))}
                      className="bg-gaming-black border-gaming-green/30"
                      placeholder="9.99"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-gaming-white">Category</Label>
                    <Select value={templateData.category} onValueChange={(value) => setTemplateData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger className="bg-gaming-black border-gaming-green/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="survival">Survival</SelectItem>
                        <SelectItem value="action">Action</SelectItem>
                        <SelectItem value="simulation">Simulation</SelectItem>
                        <SelectItem value="strategy">Strategy</SelectItem>
                        <SelectItem value="sandbox">Sandbox</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gaming-white">Min RAM (GB)</Label>
                    <Input
                      type="number"
                      value={templateData.minRam}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, minRam: parseInt(e.target.value) }))}
                      className="bg-gaming-black border-gaming-green/30"
                    />
                  </div>
                  <div>
                    <Label className="text-gaming-white">Recommended RAM (GB)</Label>
                    <Input
                      type="number"
                      value={templateData.recommendedRam}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, recommendedRam: parseInt(e.target.value) }))}
                      className="bg-gaming-black border-gaming-green/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gaming-white">Setup Complexity</Label>
                    <Select value={templateData.setupComplexity} onValueChange={(value: 'easy' | 'medium' | 'hard') => setTemplateData(prev => ({ ...prev, setupComplexity: value }))}>
                      <SelectTrigger className="bg-gaming-black border-gaming-green/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex space-x-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={templateData.isPopular}
                      onCheckedChange={(checked) => setTemplateData(prev => ({ ...prev, isPopular: checked }))}
                    />
                    <Label className="text-gaming-white">Popular</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={templateData.isNew}
                      onCheckedChange={(checked) => setTemplateData(prev => ({ ...prev, isNew: checked }))}
                    />
                    <Label className="text-gaming-white">New</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={templateData.isTrending}
                      onCheckedChange={(checked) => setTemplateData(prev => ({ ...prev, isTrending: checked }))}
                    />
                    <Label className="text-gaming-white">Trending</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hero Section */}
          <TabsContent value="hero">
            <Card className="bg-gaming-black-lighter border-gaming-green/20">
              <CardHeader>
                <CardTitle className="text-gaming-white">Hero Section Customization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-gaming-white">Hero Title</Label>
                  <Input
                    value={templateData.heroTitle}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, heroTitle: e.target.value }))}
                    className="bg-gaming-black border-gaming-green/30"
                    placeholder="Professional Minecraft Server Hosting"
                  />
                </div>
                <div>
                  <Label className="text-gaming-white">Hero Subtitle</Label>
                  <Textarea
                    value={templateData.heroSubtitle}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                    className="bg-gaming-black border-gaming-green/30"
                    rows={2}
                    placeholder="Deploy high-performance Minecraft servers with 99.9% uptime guarantee"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Plans */}
          <TabsContent value="pricing">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gaming-white">Pricing Plans</h3>
                <Button onClick={addPricingPlan} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Plan
                </Button>
              </div>

              {templateData.pricingPlans.map((plan, index) => (
                <Card key={index} className="bg-gaming-black-lighter border-gaming-green/20">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-gaming-white">{plan.name}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePricingPlan(index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-gaming-white">Plan Name</Label>
                        <Input
                          value={plan.name}
                          onChange={(e) => updatePricingPlan(index, { name: e.target.value })}
                          className="bg-gaming-black border-gaming-green/30"
                        />
                      </div>
                      <div>
                        <Label className="text-gaming-white">Monthly Price</Label>
                        <Input
                          value={plan.price}
                          onChange={(e) => updatePricingPlan(index, { price: e.target.value })}
                          className="bg-gaming-black border-gaming-green/30"
                        />
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <Switch
                          checked={plan.isPopular}
                          onCheckedChange={(checked) => updatePricingPlan(index, { isPopular: checked })}
                        />
                        <Label className="text-gaming-white">Popular Plan</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <Label className="text-gaming-white">Quarterly Price</Label>
                        <Input
                          value={plan.quarterlyPrice || ''}
                          onChange={(e) => updatePricingPlan(index, { quarterlyPrice: e.target.value })}
                          className="bg-gaming-black border-gaming-green/30"
                          placeholder="Optional"
                        />
                      </div>
                      <div>
                        <Label className="text-gaming-white">Biannual Price</Label>
                        <Input
                          value={plan.biannualPrice || ''}
                          onChange={(e) => updatePricingPlan(index, { biannualPrice: e.target.value })}
                          className="bg-gaming-black border-gaming-green/30"
                          placeholder="Optional"
                        />
                      </div>
                      <div>
                        <Label className="text-gaming-white">Annual Price</Label>
                        <Input
                          value={plan.annualPrice || ''}
                          onChange={(e) => updatePricingPlan(index, { annualPrice: e.target.value })}
                          className="bg-gaming-black border-gaming-green/30"
                          placeholder="Optional"
                        />
                      </div>
                      <div>
                        <Label className="text-gaming-white">WHMCS Product ID</Label>
                        <Input
                          value={plan.whmcsProductId || ''}
                          onChange={(e) => updatePricingPlan(index, { whmcsProductId: e.target.value })}
                          className="bg-gaming-black border-gaming-green/30"
                          placeholder="Optional"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-gaming-white">RAM</Label>
                        <Input
                          value={plan.ram || ''}
                          onChange={(e) => updatePricingPlan(index, { ram: e.target.value })}
                          className="bg-gaming-black border-gaming-green/30"
                          placeholder="4GB"
                        />
                      </div>
                      <div>
                        <Label className="text-gaming-white">Storage</Label>
                        <Input
                          value={plan.storage || ''}
                          onChange={(e) => updatePricingPlan(index, { storage: e.target.value })}
                          className="bg-gaming-black border-gaming-green/30"
                          placeholder="20GB"
                        />
                      </div>
                      <div>
                        <Label className="text-gaming-white">Players</Label>
                        <Input
                          value={plan.players || ''}
                          onChange={(e) => updatePricingPlan(index, { players: e.target.value })}
                          className="bg-gaming-black border-gaming-green/30"
                          placeholder="Up to 20"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-gaming-white">Features (one per line)</Label>
                      <Textarea
                        value={plan.features.join('\n')}
                        onChange={(e) => updatePricingPlan(index, { features: e.target.value.split('\n').filter(f => f.trim()) })}
                        className="bg-gaming-black border-gaming-green/30"
                        rows={4}
                        placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Features */}
          <TabsContent value="features">
            <Card className="bg-gaming-black-lighter border-gaming-green/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-gaming-white">Game Features</CardTitle>
                  <Button onClick={addFeature} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {templateData.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gaming-black rounded-lg">
                      <span className="text-gaming-white">{feature}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Page Sections */}
          <TabsContent value="sections">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gaming-white">Page Sections</h3>
                <div className="flex space-x-2">
                  <Select onValueChange={(type) => addSection(type as GameSection['sectionType'])}>
                    <SelectTrigger className="w-48 bg-gaming-black border-gaming-green/30">
                      <SelectValue placeholder="Add Section Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hero">Hero Section</SelectItem>
                      <SelectItem value="features">Features Grid</SelectItem>
                      <SelectItem value="pricing">Pricing Table</SelectItem>
                      <SelectItem value="gallery">Image Gallery</SelectItem>
                      <SelectItem value="testimonials">Testimonials</SelectItem>
                      <SelectItem value="faq">FAQ</SelectItem>
                      <SelectItem value="cta">Call to Action</SelectItem>
                      <SelectItem value="server-specs">Server Specs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {templateData.sections.map((section, index) => (
                <Card key={index} className="bg-gaming-black-lighter border-gaming-green/20">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="border-gaming-green text-gaming-green">
                          {section.sectionType}
                        </Badge>
                        <CardTitle className="text-gaming-white">{section.title}</CardTitle>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={section.isEnabled}
                          onCheckedChange={(checked) => updateSection(index, { isEnabled: checked })}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSection(index)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gaming-white">Section Title</Label>
                        <Input
                          value={section.title}
                          onChange={(e) => updateSection(index, { title: e.target.value })}
                          className="bg-gaming-black border-gaming-green/30"
                        />
                      </div>
                      <div>
                        <Label className="text-gaming-white">Sort Order</Label>
                        <Input
                          type="number"
                          value={section.sortOrder}
                          onChange={(e) => updateSection(index, { sortOrder: parseInt(e.target.value) })}
                          className="bg-gaming-black border-gaming-green/30"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gaming-white">Subtitle</Label>
                      <Input
                        value={section.subtitle || ''}
                        onChange={(e) => updateSection(index, { subtitle: e.target.value })}
                        className="bg-gaming-black border-gaming-green/30"
                      />
                    </div>
                    <div>
                      <Label className="text-gaming-white">Content</Label>
                      <Textarea
                        value={section.content || ''}
                        onChange={(e) => updateSection(index, { content: e.target.value })}
                        className="bg-gaming-black border-gaming-green/30"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Advanced */}
          <TabsContent value="advanced">
            <Card className="bg-gaming-black-lighter border-gaming-green/20">
              <CardHeader>
                <CardTitle className="text-gaming-white">Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-gaming-black rounded-lg">
                  <h4 className="text-gaming-white font-semibold mb-2">Template JSON Export</h4>
                  <p className="text-gaming-gray text-sm mb-4">
                    Copy this configuration to create similar games or backup your template
                  </p>
                  <Textarea
                    value={JSON.stringify(templateData, null, 2)}
                    readOnly
                    className="bg-gaming-black-dark border-gaming-green/30 font-mono text-xs"
                    rows={10}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}