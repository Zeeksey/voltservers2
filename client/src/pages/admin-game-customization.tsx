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
  Move, Settings, Copy, ChevronUp, ChevronDown, Palette, Monitor,
  HelpCircle, ArrowRight, Shield
} from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Game } from '@shared/schema';

// Component types for the page builder
interface PageSection {
  id: string;
  type: 'hero' | 'features' | 'pricing' | 'gallery' | 'testimonials' | 'faq' | 'cta' | 'specs';
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
      buttonUrl: '/order',
      backgroundImage: '',
      videoUrl: '',
      features: ['24/7 Support', 'DDoS Protection', 'Instant Setup'],
      showStats: true,
      stats: [
        { label: 'Players Online', value: '{{PLAYER_COUNT}}' },
        { label: 'Uptime', value: '99.9%' },
        { label: 'Servers', value: '1000+' }
      ]
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
      subheadline: 'Discover the advantages that set us apart',
      features: [
        { title: 'High Performance', description: 'Latest hardware for optimal gaming', icon: 'monitor' },
        { title: '24/7 Support', description: 'Expert support whenever you need it', icon: 'users' },
        { title: 'Easy Setup', description: 'Get your server running in minutes', icon: 'settings' },
        { title: 'DDoS Protection', description: 'Advanced security for uninterrupted gameplay', icon: 'shield' },
        { title: 'Automatic Backups', description: 'Your data is safe with daily backups', icon: 'backup' },
        { title: 'Plugin Support', description: 'Customize with thousands of plugins', icon: 'plugin' }
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
      subheadline: 'Choose the perfect plan for your community',
      plans: [
        { name: 'Starter', price: '{{BASE_PRICE}}', originalPrice: '', features: ['4GB RAM', '10 Players', 'Basic Support', '10GB Storage'], highlight: false, buttonText: 'Get Started' },
        { name: 'Pro', price: '{{BASE_PRICE * 2}}', originalPrice: '', features: ['8GB RAM', '25 Players', 'Priority Support', '25GB Storage', 'Plugin Support'], highlight: true, buttonText: 'Most Popular' },
        { name: 'Enterprise', price: '{{BASE_PRICE * 3}}', originalPrice: '', features: ['16GB RAM', 'Unlimited Players', '24/7 Support', '100GB Storage', 'Full Management'], highlight: false, buttonText: 'Contact Us' }
      ]
    },
    style: {
      backgroundColor: '#0f0f0f',
      textColor: '#ffffff',
      padding: '3rem',
      layout: 'cards'
    }
  },
  gallery: {
    type: 'gallery',
    title: 'Screenshots Gallery',
    content: {
      headline: '{{GAME_NAME}} in Action',
      subheadline: 'See what players are building on our servers',
      images: [
        { url: '/images/gallery/screenshot1.jpg', title: 'Epic Build', description: 'Amazing player creation' },
        { url: '/images/gallery/screenshot2.jpg', title: 'Adventure Time', description: 'Exploring new worlds' },
        { url: '/images/gallery/screenshot3.jpg', title: 'Community Event', description: 'Players having fun together' }
      ]
    },
    style: {
      backgroundColor: '#1a1a1a',
      textColor: '#ffffff',
      padding: '3rem',
      layout: 'masonry'
    }
  },
  testimonials: {
    type: 'testimonials',
    title: 'Player Reviews',
    content: {
      headline: 'What Players Say About Us',
      subheadline: 'Join thousands of satisfied customers',
      testimonials: [
        { name: 'Alex Johnson', rating: 5, comment: 'Best server hosting I\'ve used. Great performance and support!', avatar: '', title: 'Server Owner' },
        { name: 'Sarah Chen', rating: 5, comment: 'Setup was incredibly easy. Had my server running in minutes!', avatar: '', title: 'Community Leader' },
        { name: 'Mike Davis', rating: 5, comment: 'Outstanding uptime and customer service. Highly recommend!', avatar: '', title: 'Gaming Streamer' }
      ]
    },
    style: {
      backgroundColor: '#0a0a0a',
      textColor: '#ffffff',
      padding: '3rem',
      layout: 'carousel'
    }
  },
  faq: {
    type: 'faq',
    title: 'Frequently Asked Questions',
    content: {
      headline: 'Common Questions About {{GAME_NAME}} Hosting',
      subheadline: 'Everything you need to know',
      faqs: [
        { question: 'How quickly can I get my server online?', answer: 'Your server will be ready within minutes of completing your order. Our automated setup process ensures instant deployment.' },
        { question: 'Do you provide technical support?', answer: 'Yes! We offer 24/7 technical support through live chat, tickets, and our knowledge base.' },
        { question: 'Can I install plugins and mods?', answer: 'Absolutely! You have full control over your server and can install any compatible plugins or mods.' }
      ]
    },
    style: {
      backgroundColor: '#1a1a1a',
      textColor: '#ffffff',
      padding: '3rem',
      layout: 'accordion'
    }
  },
  cta: {
    type: 'cta',
    title: 'Call to Action',
    content: {
      headline: 'Ready to Start Your {{GAME_NAME}} Server?',
      subheadline: 'Join thousands of players already enjoying lag-free gaming',
      buttonText: 'Start Now',
      buttonUrl: '/order',
      secondaryButtonText: 'View Plans',
      secondaryButtonUrl: '#pricing',
      backgroundImage: ''
    },
    style: {
      backgroundColor: '#00ff88',
      textColor: '#000000',
      padding: '4rem',
      layout: 'center'
    }
  },
  specs: {
    type: 'specs',
    title: 'Server Specifications',
    content: {
      headline: 'Powerful Hardware for {{GAME_NAME}}',
      subheadline: 'Enterprise-grade infrastructure for the best gaming experience',
      specs: [
        { category: 'CPU', items: ['Intel Xeon E5-2697 v3', '14 Cores @ 2.6GHz', 'Turbo Boost up to 3.6GHz'] },
        { category: 'Memory', items: ['DDR4 ECC RAM', 'Up to 128GB per server', 'High-speed memory modules'] },
        { category: 'Storage', items: ['NVMe SSD Storage', 'RAID 1 Configuration', 'Daily automated backups'] },
        { category: 'Network', items: ['1Gbps dedicated bandwidth', 'DDoS protection included', 'Multiple datacenter locations'] }
      ]
    },
    style: {
      backgroundColor: '#0f0f0f',
      textColor: '#ffffff',
      padding: '3rem',
      layout: 'table'
    }
  }
};

export default function AdminGameCustomization() {
  const [match, params] = useRoute('/admin/games/:gameId/customize');
  const gameId = params?.gameId;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch game data with proper error handling and fallback
  const { data: game, isLoading: gameLoading, error: gameError } = useQuery<Game>({
    queryKey: ['/api/games', gameId],
    enabled: !!gameId,
    queryFn: async () => {
      // First try to get game from the general games API
      try {
        const response = await fetch(`/api/games/${gameId}`);
        if (response.ok) {
          return response.json();
        }
      } catch (error) {
        console.log('Failed to fetch individual game, trying from games list');
      }
      
      // Fallback: get all games and find the one we need
      const allGamesResponse = await fetch('/api/games');
      if (!allGamesResponse.ok) {
        throw new Error('Failed to fetch games data');
      }
      
      const allGames = await allGamesResponse.json();
      const foundGame = allGames.find((g: any) => g.id === gameId);
      
      if (!foundGame) {
        throw new Error('Game not found');
      }
      
      return foundGame;
    },
    retry: 2,
    staleTime: 0,
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

  // API request helper function for admin operations
  const makeApiRequest = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("adminToken");
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (response.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Request failed");
    }

    return response.json();
  };

  // Save page structure mutation
  const savePageMutation = useMutation({
    mutationFn: async () => {
      const pageStructure = JSON.stringify({ sections });
      
      return makeApiRequest(`/api/admin/games/${gameId}`, {
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
      case 'gallery':
        return (
          <div style={style}>
            <h2 className="text-2xl font-bold mb-6 text-center">{section.content.headline}</h2>
            <p className="text-center mb-8 opacity-80">{section.content.subheadline}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {section.content.images.map((img: any, index: number) => (
                <div key={index} className="rounded-lg overflow-hidden bg-gaming-green/10 p-4">
                  <div className="aspect-video bg-gaming-green/20 rounded mb-2 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gaming-green/50" />
                  </div>
                  <h3 className="font-semibold">{img.title}</h3>
                  <p className="text-sm opacity-70">{img.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'testimonials':
        return (
          <div style={style}>
            <h2 className="text-2xl font-bold mb-6 text-center">{section.content.headline}</h2>
            <p className="text-center mb-8 opacity-80">{section.content.subheadline}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {section.content.testimonials.map((testimonial: any, index: number) => (
                <div key={index} className="border border-gaming-green/20 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gaming-green/20 rounded-full flex items-center justify-center mr-3">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm opacity-70">{testimonial.title}</p>
                    </div>
                  </div>
                  <div className="flex mb-2">
                    {Array.from({length: testimonial.rating}).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gaming-green text-gaming-green" />
                    ))}
                  </div>
                  <p className="italic">"{testimonial.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'faq':
        return (
          <div style={style}>
            <h2 className="text-2xl font-bold mb-6 text-center">{section.content.headline}</h2>
            <p className="text-center mb-8 opacity-80">{section.content.subheadline}</p>
            <div className="max-w-3xl mx-auto space-y-4">
              {section.content.faqs.map((faq: any, index: number) => (
                <div key={index} className="border border-gaming-green/20 rounded-lg">
                  <div className="p-4 border-b border-gaming-green/10">
                    <h3 className="font-semibold flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-gaming-green" />
                      {faq.question}
                    </h3>
                  </div>
                  <div className="p-4">
                    <p className="opacity-80">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'cta':
        return (
          <div style={style} className="text-center">
            <h2 className="text-3xl font-bold mb-4">{section.content.headline}</h2>
            <p className="text-xl mb-8">{section.content.subheadline}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-current text-black" size="lg">
                {section.content.buttonText}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              {section.content.secondaryButtonText && (
                <Button variant="outline" size="lg" className="border-current text-current">
                  {section.content.secondaryButtonText}
                </Button>
              )}
            </div>
          </div>
        );
      case 'specs':
        return (
          <div style={style}>
            <h2 className="text-2xl font-bold mb-6 text-center">{section.content.headline}</h2>
            <p className="text-center mb-8 opacity-80">{section.content.subheadline}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {section.content.specs.map((spec: any, index: number) => (
                <div key={index} className="border border-gaming-green/20 rounded-lg p-4">
                  <h3 className="font-bold text-gaming-green mb-3 flex items-center gap-2">
                    <Monitor className="w-5 h-5" />
                    {spec.category}
                  </h3>
                  <ul className="space-y-2">
                    {spec.items.map((item: string, i: number) => (
                      <li key={i} className="text-sm opacity-80">• {item}</li>
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
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(defaultSections).map(([key, section]) => (
                <Button
                  key={key}
                  onClick={() => addSection(key)}
                  className="w-full justify-start bg-gaming-black-lighter border-gaming-green/30 text-gaming-green hover:bg-gaming-green/10 p-3 h-auto"
                >
                  <div className="flex items-center gap-3">
                    {key === 'hero' && <Layout className="w-4 h-4" />}
                    {key === 'features' && <Star className="w-4 h-4" />}
                    {key === 'pricing' && <DollarSign className="w-4 h-4" />}
                    {key === 'gallery' && <ImageIcon className="w-4 h-4" />}
                    {key === 'testimonials' && <Users className="w-4 h-4" />}
                    {key === 'faq' && <HelpCircle className="w-4 h-4" />}
                    {key === 'cta' && <ArrowRight className="w-4 h-4" />}
                    {key === 'specs' && <Monitor className="w-4 h-4" />}
                    <div className="text-left">
                      <div className="font-medium text-sm">{section.title}</div>
                      <div className="text-xs text-gray-400 capitalize">{key}</div>
                    </div>
                  </div>
                </Button>
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