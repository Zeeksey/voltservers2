import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, Trash2, Save, ArrowLeft, Video, Package, Wrench, Eye, EyeOff,
  Layout, Type, Image as ImageIcon, FileText, Star, Users, DollarSign,
  Move, Settings, Copy, ChevronUp, ChevronDown, Palette, Monitor
} from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Game } from '@shared/schema';

// Component types for the page builder
interface PageSection {
  id: string;
  type: 'hero' | 'features' | 'pricing' | 'gallery' | 'testimonials' | 'faq' | 'cta';
  title: string;
  content: any;
  style: {
    backgroundColor: string;
    textColor: string;
    padding: string;
    layout: string;
  };
  order: number;
}

const defaultSections: Record<string, Omit<PageSection, 'id' | 'order'>> = {
  hero: {
    type: 'hero',
    title: 'Hero Section',
    content: {
      headline: 'Premium {{GAME_NAME}} Hosting',
      subheadline: 'Experience lag-free gaming with our high-performance servers',
      buttonText: 'Get Started',
      backgroundImage: '',
      features: ['24/7 Support', 'DDoS Protection', 'Instant Setup']
    },
    style: {
      backgroundColor: '#0a0a0a',
      textColor: '#ffffff',
      padding: '4rem',
      layout: 'center'
    }
  },
  features: {
    type: 'features',
    title: 'Features Section',
    content: {
      headline: 'Why Choose Our {{GAME_NAME}} Servers?',
      features: [
        { title: 'High Performance', description: 'Latest hardware for optimal gaming', icon: 'monitor' },
        { title: '24/7 Support', description: 'Expert support whenever you need it', icon: 'users' },
        { title: 'Easy Setup', description: 'Get your server running in minutes', icon: 'settings' }
      ]
    },
    style: {
      backgroundColor: '#1a1a1a',
      textColor: '#ffffff',
      padding: '3rem',
      layout: 'grid'
    }
  },
  pricing: {
    type: 'pricing',
    title: 'Pricing Section',
    content: {
      headline: '{{GAME_NAME}} Server Plans',
      plans: [
        { name: 'Starter', price: '{{BASE_PRICE}}', features: ['4GB RAM', '10 Players', 'Basic Support'] },
        { name: 'Pro', price: '{{BASE_PRICE * 2}}', features: ['8GB RAM', '25 Players', 'Priority Support'] },
        { name: 'Enterprise', price: '{{BASE_PRICE * 3}}', features: ['16GB RAM', 'Unlimited Players', '24/7 Support'] }
      ]
    },
    style: {
      backgroundColor: '#0f0f0f',
      textColor: '#ffffff',
      padding: '3rem',
      layout: 'cards'
    }
  }
};

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

  // Page builder state
  const [sections, setSections] = useState<PageSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);

  // Initialize sections from game data
  useEffect(() => {
    if (game && sections.length === 0) {
      // Try to parse existing page structure or create default
      try {
        const pageData = game.pageStructure ? JSON.parse(game.pageStructure) : null;
        if (pageData && pageData.sections) {
          setSections(pageData.sections);
        } else {
          // Create default page structure
          const defaultHero = {
            ...defaultSections.hero,
            id: 'hero-1',
            order: 0,
            content: {
              ...defaultSections.hero.content,
              headline: `Premium ${game.name} Hosting`,
              subheadline: `Experience lag-free ${game.name} gaming with our high-performance servers`
            }
          };
          setSections([defaultHero]);
        }
      } catch (error) {
        // Fallback to default structure
        const defaultHero = {
          ...defaultSections.hero,
          id: 'hero-1',
          order: 0,
          content: {
            ...defaultSections.hero.content,
            headline: `Premium ${game?.name || 'Game'} Hosting`,
            subheadline: `Experience lag-free ${game?.name || 'game'} gaming with our high-performance servers`
          }
        };
        setSections([defaultHero]);
      }
    }
  }, [game, sections.length]);

  // Page builder functions
  const addSection = (type: string) => {
    const template = defaultSections[type];
    if (!template) return;

    const newSection: PageSection = {
      ...template,
      id: `${type}-${Date.now()}`,
      order: sections.length
    };
    setSections([...sections, newSection]);
    setSelectedSection(newSection.id);
  };

  const updateSection = (sectionId: string, updates: Partial<PageSection>) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, ...updates } : section
    ));
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
    if (selectedSection === sectionId) {
      setSelectedSection(null);
    }
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const sectionIndex = sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return;

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    [newSections[sectionIndex], newSections[targetIndex]] = [newSections[targetIndex], newSections[sectionIndex]];
    
    // Update order values
    newSections.forEach((section, index) => {
      section.order = index;
    });

    setSections(newSections);
  };

  // Save page structure mutation
  const savePageMutation = useMutation({
    mutationFn: async () => {
      const pageStructure = JSON.stringify({ sections });
      
      return apiRequest(`/api/admin/games/${gameId}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...game,
          pageStructure
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/games', gameId] });
      toast({ title: 'Page structure saved successfully!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to save page structure', description: error.message, variant: 'destructive' });
    },
  });

  // Component preview renderer
  const renderSectionPreview = (section: PageSection) => {
    const style = {
      backgroundColor: section.style.backgroundColor,
      color: section.style.textColor,
      padding: section.style.padding === '4rem' ? '2rem' : '1rem',
    };

    switch (section.type) {
      case 'hero':
        return (
          <div style={style} className="text-center">
            <h1 className="text-3xl font-bold mb-4">{section.content.headline}</h1>
            <p className="text-xl mb-6">{section.content.subheadline}</p>
            <Button className="bg-gaming-green text-gaming-black">
              {section.content.buttonText}
            </Button>
          </div>
        );
      case 'features':
        return (
          <div style={style}>
            <h2 className="text-2xl font-bold mb-6 text-center">{section.content.headline}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {section.content.features.map((feature: any, index: number) => (
                <div key={index} className="text-center">
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'pricing':
        return (
          <div style={style}>
            <h2 className="text-2xl font-bold mb-6 text-center">{section.content.headline}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {section.content.plans.map((plan: any, index: number) => (
                <div key={index} className="border border-gaming-green/20 rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-2xl font-bold mb-4">${plan.price}/mo</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature: string, i: number) => (
                      <li key={i} className="text-sm">✓ {feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div style={style} className="text-center py-8">
            <p>Section: {section.title}</p>
          </div>
        );
    }
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
    <div className="admin-panel min-h-screen bg-gaming-black text-white">
      {/* Header */}
      <div className="border-b border-gaming-green/20 bg-gaming-dark">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Layout className="w-6 h-6 sm:w-8 sm:h-8 text-gaming-green" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Page Builder - {game.name}</h1>
              <p className="text-xs sm:text-sm text-gray-400">Drag and drop components to build your game page</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <div className="flex items-center space-x-2">
              <Switch 
                checked={previewMode}
                onCheckedChange={setPreviewMode}
                id="preview-mode"
              />
              <Label htmlFor="preview-mode" className="text-xs sm:text-sm text-gray-300">
                {previewMode ? <Eye className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" /> : <EyeOff className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />}
                <span className="hidden sm:inline">Preview</span>
              </Label>
            </div>
            <Button
              onClick={() => savePageMutation.mutate()}
              disabled={savePageMutation.isPending}
              className="bg-gaming-green hover:bg-gaming-green/90 text-gaming-black text-sm sm:text-base w-full sm:w-auto"
            >
              <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Save Page
            </Button>
            <Link href="/admin" className="w-full sm:w-auto">
              <Button variant="outline" className="border-gaming-green/30 text-gaming-green text-sm sm:text-base w-full">
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content - Page Builder */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="page-builder">
          {/* Component Palette */}
          <div className="component-palette">
            <h3 className="text-lg font-semibold text-gaming-green mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Components
            </h3>
            <div className="space-y-2">
              {Object.entries(defaultSections).map(([key, section]) => (
                <div
                  key={key}
                  className="draggable-component cursor-pointer"
                  onClick={() => addSection(key)}
                >
                  <div className="flex items-center gap-3">
                    {key === 'hero' && <Layout className="w-4 h-4" />}
                    {key === 'features' && <Star className="w-4 h-4" />}
                    {key === 'pricing' && <DollarSign className="w-4 h-4" />}
                    <div>
                      <div className="font-medium text-sm">{section.title}</div>
                      <div className="text-xs text-gray-400 capitalize">{key} section</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Page Canvas */}
          <div className="page-canvas">
            <div className="p-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gaming-green mb-2">
                  {game.name} Game Page Preview
                </h2>
                <p className="text-sm text-gray-400">
                  {sections.length} section{sections.length !== 1 ? 's' : ''} • Click to edit
                </p>
              </div>

              {sections.length === 0 ? (
                <div className="drop-zone">
                  <div className="text-center text-gray-400">
                    <Layout className="w-12 h-12 mx-auto mb-3" />
                    <p className="text-lg font-medium mb-2">Start Building Your Page</p>
                    <p className="text-sm">Click on components from the left panel to add them here</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {sections
                    .sort((a, b) => a.order - b.order)
                    .map((section) => (
                      <div
                        key={section.id}
                        className={`section-component ${selectedSection === section.id ? 'selected' : ''}`}
                        onClick={() => setSelectedSection(section.id)}
                      >
                        <div className="section-controls">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveSection(section.id, 'up');
                            }}
                            className="w-8 h-8 p-0 border-gaming-green/30 text-gaming-green hover:bg-gaming-green/10"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveSection(section.id, 'down');
                            }}
                            className="w-8 h-8 p-0 border-gaming-green/30 text-gaming-green hover:bg-gaming-green/10"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSection(section.id);
                            }}
                            className="w-8 h-8 p-0 border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        {renderSectionPreview(section)}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Properties Panel */}
          <div className="properties-panel">
            <h3 className="text-lg font-semibold text-gaming-green mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Properties
            </h3>
            
            {selectedSection ? (
              <SectionEditor
                section={sections.find(s => s.id === selectedSection)!}
                onUpdate={(updates) => updateSection(selectedSection, updates)}
                game={game}
              />
            ) : (
              <div className="text-center text-gray-400 py-8">
                <Settings className="w-12 h-12 mx-auto mb-3" />
                <p className="text-sm">Select a section to edit its properties</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Section Editor Component
interface SectionEditorProps {
  section: PageSection;
  onUpdate: (updates: Partial<PageSection>) => void;
  game: Game;
}

function SectionEditor({ section, onUpdate, game }: SectionEditorProps) {
  const updateContent = (contentUpdates: any) => {
    onUpdate({
      content: { ...section.content, ...contentUpdates }
    });
  };

  const updateStyle = (styleUpdates: any) => {
    onUpdate({
      style: { ...section.style, ...styleUpdates }
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div>
        <Label className="text-gray-300">Section Title</Label>
        <Input
          value={section.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="admin-input mt-1"
        />
      </div>

      {/* Content Editor based on section type */}
      {section.type === 'hero' && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gaming-green">Hero Content</h4>
          <div>
            <Label className="text-gray-300">Headline</Label>
            <Input
              value={section.content.headline}
              onChange={(e) => updateContent({ headline: e.target.value })}
              className="admin-input mt-1"
              placeholder="Premium {{GAME_NAME}} Hosting"
            />
          </div>
          <div>
            <Label className="text-gray-300">Subheadline</Label>
            <Textarea
              value={section.content.subheadline}
              onChange={(e) => updateContent({ subheadline: e.target.value })}
              className="admin-textarea mt-1"
              rows={2}
            />
          </div>
          <div>
            <Label className="text-gray-300">Button Text</Label>
            <Input
              value={section.content.buttonText}
              onChange={(e) => updateContent({ buttonText: e.target.value })}
              className="admin-input mt-1"
            />
          </div>
        </div>
      )}

      {section.type === 'features' && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gaming-green">Features Content</h4>
          <div>
            <Label className="text-gray-300">Headline</Label>
            <Input
              value={section.content.headline}
              onChange={(e) => updateContent({ headline: e.target.value })}
              className="admin-input mt-1"
            />
          </div>
          <div>
            <Label className="text-gray-300">Features</Label>
            <div className="space-y-2 mt-2">
              {section.content.features.map((feature: any, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={feature.title}
                    onChange={(e) => {
                      const newFeatures = [...section.content.features];
                      newFeatures[index] = { ...feature, title: e.target.value };
                      updateContent({ features: newFeatures });
                    }}
                    className="admin-input flex-1"
                    placeholder="Feature title"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const newFeatures = section.content.features.filter((_: any, i: number) => i !== index);
                      updateContent({ features: newFeatures });
                    }}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 px-3"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                size="sm"
                onClick={() => {
                  const newFeatures = [...section.content.features, { title: 'New Feature', description: 'Feature description', icon: 'star' }];
                  updateContent({ features: newFeatures });
                }}
                className="bg-gaming-green/20 text-gaming-green hover:bg-gaming-green/30 w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Style Editor */}
      <div className="space-y-4 border-t border-gaming-green/20 pt-4">
        <h4 className="text-sm font-semibold text-gaming-green flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Section Style
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">Background</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                type="color"
                value={section.style.backgroundColor}
                onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                className="w-12 h-10 rounded border-gaming-green/30"
              />
              <Input
                value={section.style.backgroundColor}
                onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                className="admin-input flex-1"
              />
            </div>
          </div>
          <div>
            <Label className="text-gray-300">Text Color</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                type="color"
                value={section.style.textColor}
                onChange={(e) => updateStyle({ textColor: e.target.value })}
                className="w-12 h-10 rounded border-gaming-green/30"
              />
              <Input
                value={section.style.textColor}
                onChange={(e) => updateStyle({ textColor: e.target.value })}
                className="admin-input flex-1"
              />
            </div>
          </div>
        </div>
        <div>
          <Label className="text-gray-300">Padding</Label>
          <Select value={section.style.padding} onValueChange={(value) => updateStyle({ padding: value })}>
            <SelectTrigger className="admin-input mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1rem">Small</SelectItem>
              <SelectItem value="2rem">Medium</SelectItem>
              <SelectItem value="3rem">Large</SelectItem>
              <SelectItem value="4rem">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}