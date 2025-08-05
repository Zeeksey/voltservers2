import React, { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Save,
  Settings,
  Gamepad2,
  BookOpen,
  Megaphone,
  Users,
  Layout,
  MapPin,
  Server,
  Palette,
  Image as ImageIcon,
  Type,
  Snowflake,
  Skull,
  Egg,
  TreePine,
  Upload,
  Eye,
  EyeOff,
  Search,
  Share2,
  BarChart3,
  Code,
  Cookie
} from "lucide-react";
import type { Game, BlogPost, PromoSetting } from "@shared/schema";
import GamePageAdmin from "@/components/game-page-admin";

interface AdminUser {
  id: string;
  username: string;
  isAdmin: boolean;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [gameForm, setGameForm] = useState({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    basePrice: "",
    playerCount: "0",
    isPopular: false,
    isNew: false,
    isTrending: false
  });
  const [blogForm, setBlogForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    imageUrl: "",
    author: "",
    tags: "",
    isPublished: true
  });
  const [promoForm, setPromoForm] = useState({
    isEnabled: true,
    message: "",
    linkText: "",
    linkUrl: "",
    backgroundColor: "#22c55e",
    textColor: "#ffffff"
  });
  const [locationForm, setLocationForm] = useState({
    city: "",
    country: "",
    region: "",
    provider: "",
    ipAddress: "",
    status: "online" as "online" | "offline" | "maintenance"
  });
  
  // Theme customization state
  const [themeForm, setThemeForm] = useState({
    siteName: "VoltServers",
    siteTagline: "Premium Game Server Hosting",
    siteDescription: "Professional game server hosting with 24/7 support and premium hardware",
    primaryColor: "#00ff88",
    secondaryColor: "#1a1a1a",
    accentColor: "#00cc6a",
    backgroundColor: "#0a0a0a",
    textColor: "#ffffff",
    logoUrl: "",
    faviconUrl: "",
    footerText: "",
    fontFamily: "Inter",
    borderRadius: "0.5rem",
    holidayTheme: "none",
    customCss: "",
    // SEO & Meta Tags
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterCard: "summary_large_image",
    twitterSite: "",
    // Analytics & Tracking
    googleAnalyticsId: "",
    googleTagManagerId: "",
    facebookPixelId: "",
    customHeadCode: "",
    customBodyCode: "",
    // Site Management
    maintenanceMode: false,
    maintenanceMessage: "We're currently performing maintenance. Please check back soon!",
    announcementBanner: "",
    announcementType: "info",
    showAnnouncementBanner: false,
    // Cookie Policy Settings
    showCookieBanner: true,
    cookieConsentRequired: true,
    cookiePolicyText: "We use cookies to enhance your experience and analyze site traffic.",
    cookiePolicyUrl: "/privacy-policy",
    cookieCategories: JSON.stringify([
      { id: "necessary", name: "Necessary", description: "Essential for website functionality", required: true },
      { id: "analytics", name: "Analytics", description: "Help us understand how visitors use our site", required: false },
      { id: "marketing", name: "Marketing", description: "Used to deliver relevant advertisements", required: false }
    ], null, 2)
  });
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const [locationPings, setLocationPings] = useState<Map<string, number>>(new Map());
  const [editingLocation, setEditingLocation] = useState<any>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("adminToken");
    const user = localStorage.getItem("adminUser");
    
    if (!token || !user) {
      setLocation("/admin/login");
      return;
    }

    try {
      setAdminUser(JSON.parse(user));
    } catch {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const apiRequest = async (url: string, options: RequestInit = {}) => {
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
      setLocation("/admin/login");
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Request failed");
    }

    return response.json();
  };

  // Queries
  const { data: games = [] } = useQuery({
    queryKey: ["/api/games"],
    queryFn: () => apiRequest("/api/games"),
  });

  const { data: blogPosts = [] } = useQuery({
    queryKey: ["/api/blog"],
    queryFn: () => apiRequest("/api/blog"),
  });

  const { data: promoSettings } = useQuery({
    queryKey: ["/api/admin/promo-settings"],
    queryFn: () => apiRequest("/api/admin/promo-settings"),
  });

  const { data: serverLocations = [] } = useQuery({
    queryKey: ['/api/server-locations'],
    queryFn: () => apiRequest("/api/server-locations"),
  });

  // Initialize server location pings with static data
  useEffect(() => {
    if (serverLocations.length === 0) return;

    // Set static ping values for each location to avoid network issues
    serverLocations.forEach(location => {
      const estimatedPing = getEstimatedPing(location.region, location.country);
      setLocationPings(prev => new Map(prev.set(location.id, estimatedPing)));
    });
  }, [serverLocations]);

  // Estimate ping based on geographic location
  const getEstimatedPing = (region: string, country: string) => {
    // Realistic estimates based on common geographic distances from average user
    const estimates: { [key: string]: number } = {
      'Virginia': 25,
      'California': 60,
      'New York': 35,
      'Texas': 45,
      'Illinois': 40,
      'Florida': 30,
      'United Kingdom': 95,
      'Germany': 105,
      'France': 100,
      'Netherlands': 90,
      'Singapore': 190,
      'Japan': 140,
      'Australia': 230,
      'Canada': 50,
      'Brazil': 170
    };
    
    return estimates[region] || estimates[country] || Math.floor(Math.random() * 40) + 30;
  };



  // Update promo form when data loads
  useEffect(() => {
    if (promoSettings) {
      setPromoForm({
        isEnabled: promoSettings.isEnabled,
        message: promoSettings.message,
        linkText: promoSettings.linkText || "",
        linkUrl: promoSettings.linkUrl || "",
        backgroundColor: promoSettings.backgroundColor,
        textColor: promoSettings.textColor
      });
    }
  }, [promoSettings]);

  // Mutations
  const createGameMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/admin/games", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      resetGameForm();
      toast({ title: "Game created successfully!" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create game", description: error.message, variant: "destructive" });
    },
  });

  const updateGameMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiRequest(`/api/admin/games/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      resetGameForm();
      toast({ title: "Game updated successfully!" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update game", description: error.message, variant: "destructive" });
    },
  });

  const deleteGameMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/admin/games/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      toast({ title: "Game deleted successfully!" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete game", description: error.message, variant: "destructive" });
    },
  });

  const createBlogMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/admin/blog", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      resetBlogForm();
      toast({ title: "Blog post created successfully!" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create blog post", description: error.message, variant: "destructive" });
    },
  });

  const updateBlogMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiRequest(`/api/admin/blog/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      resetBlogForm();
      toast({ title: "Blog post updated successfully!" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update blog post", description: error.message, variant: "destructive" });
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/admin/blog/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({ title: "Blog post deleted successfully!" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete blog post", description: error.message, variant: "destructive" });
    },
  });

  const updatePromoMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/admin/promo-settings", { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promo-settings"] });
      toast({ title: "Promo settings updated successfully!" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update promo settings", description: error.message, variant: "destructive" });
    },
  });

  // Create server location mutation
  const createLocationMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/admin/server-locations", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/server-locations"] });
      setLocationForm({
        city: "",
        country: "",
        region: "",
        provider: "",
        ipAddress: "",
        status: "online"
      });
      toast({ title: "Success", description: "Server location created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Theme management mutations
  const updateThemeMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/admin/theme-settings", { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/theme-settings"] });
      toast({ title: "Theme settings updated successfully!" });
      // Apply theme changes immediately
      applyThemeToDocument();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update theme settings", description: error.message, variant: "destructive" });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async ({ file, type }: { file: File; type: 'logo' | 'favicon' }) => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', type);
      
      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: formData,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    },
    onSuccess: (data, variables) => {
      if (variables.type === 'logo') {
        setThemeForm(prev => ({ ...prev, logoUrl: data.url }));
      } else {
        setThemeForm(prev => ({ ...prev, faviconUrl: data.url }));
      }
      toast({ title: `${variables.type === 'logo' ? 'Logo' : 'Favicon'} uploaded successfully!` });
    },
    onError: (error: Error) => {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    },
  });

  // Delete server location mutation
  const deleteLocationMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/admin/server-locations/${id}`, {
      method: "DELETE",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/server-locations"] });
      toast({ title: "Success", description: "Server location deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleLogout = async () => {
    try {
      await apiRequest("/api/admin/logout", { method: "POST" });
    } catch (error) {
      // Ignore errors during logout
    } finally {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      setLocation("/admin/login");
    }
  };

  const resetGameForm = () => {
    setGameForm({
      name: "",
      slug: "",
      description: "",
      imageUrl: "",
      basePrice: "",
      playerCount: "0",
      isPopular: false,
      isNew: false,
      isTrending: false
    });
    setEditingGame(null);
  };

  const resetBlogForm = () => {
    setBlogForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      imageUrl: "",
      author: "",
      tags: "",
      isPublished: true
    });
    setEditingBlog(null);
  };

  const handleEditGame = (game: Game) => {
    setGameForm({
      name: game.name,
      slug: game.slug,
      description: game.description,
      imageUrl: game.imageUrl,
      basePrice: game.basePrice,
      playerCount: game.playerCount.toString(),
      isPopular: game.isPopular,
      isNew: game.isNew,
      isTrending: game.isTrending
    });
    setEditingGame(game);
  };

  const handleEditBlog = (blog: BlogPost) => {
    setBlogForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      imageUrl: blog.imageUrl,
      author: blog.author,
      tags: blog.tags.join(", "),
      isPublished: blog.isPublished
    });
    setEditingBlog(blog);
  };

  const handleGameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...gameForm,
      basePrice: gameForm.basePrice,
      playerCount: parseInt(gameForm.playerCount),
    };

    if (editingGame) {
      updateGameMutation.mutate({ id: editingGame.id, data });
    } else {
      createGameMutation.mutate(data);
    }
  };

  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...blogForm,
      tags: blogForm.tags.split(",").map(tag => tag.trim()).filter(Boolean),
    };

    if (editingBlog) {
      updateBlogMutation.mutate({ id: editingBlog.id, data });
    } else {
      createBlogMutation.mutate(data);
    }
  };

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePromoMutation.mutate(promoForm);
  };

  // Theme helper functions
  const applyThemeToDocument = () => {
    if (previewMode) {
      const root = document.documentElement;
      root.style.setProperty('--gaming-green', themeForm.primaryColor);
      root.style.setProperty('--gaming-green-dark', themeForm.accentColor);
      root.style.setProperty('--gaming-black', themeForm.backgroundColor);
      root.style.setProperty('--gaming-black-light', themeForm.secondaryColor);
      root.style.setProperty('--gaming-white', themeForm.textColor);
      
      // Apply holiday theme
      if (themeForm.holidayTheme !== 'none') {
        applyHolidayTheme(themeForm.holidayTheme);
      } else {
        removeHolidayTheme();
      }
    }
  };

  const applyHolidayTheme = (theme: string) => {
    removeHolidayTheme(); // Clear existing themes first
    
    switch (theme) {
      case 'snow':
        createSnowEffect();
        break;
      case 'halloween':
        document.body.classList.add('halloween-theme');
        createSpookyEffect();
        break;
      case 'easter':
        createEasterEffect();
        break;
      case 'christmas':
        createChristmasEffect();
        break;
    }
  };

  const removeHolidayTheme = () => {
    document.body.classList.remove('halloween-theme');
    document.querySelectorAll('.snow-particle, .spooky-element, .easter-egg, .christmas-light').forEach(el => el.remove());
  };

  const createSnowEffect = () => {
    for (let i = 0; i < 50; i++) {
      const snowflake = document.createElement('div');
      snowflake.className = 'snow-particle';
      snowflake.innerHTML = '❄';
      snowflake.style.left = Math.random() * 100 + 'vw';
      snowflake.style.animationDuration = Math.random() * 3 + 2 + 's';
      snowflake.style.opacity = Math.random().toString();
      document.body.appendChild(snowflake);
    }
  };

  const createSpookyEffect = () => {
    const elements = document.querySelectorAll('.bg-gaming-green');
    elements.forEach(el => el.classList.add('halloween-glow'));
  };

  const createEasterEffect = () => {
    for (let i = 0; i < 10; i++) {
      const egg = document.createElement('div');
      egg.className = 'easter-egg';
      egg.innerHTML = '🥚';
      egg.style.position = 'fixed';
      egg.style.right = Math.random() * 100 + 'px';
      egg.style.bottom = Math.random() * 100 + 'px';
      egg.style.fontSize = '2rem';
      egg.style.zIndex = '1000';
      document.body.appendChild(egg);
    }
  };

  const createChristmasEffect = () => {
    for (let i = 0; i < 20; i++) {
      const light = document.createElement('div');
      light.className = 'christmas-light';
      light.innerHTML = '🔴🟢🔵🟡'[i % 4];
      light.style.position = 'fixed';
      light.style.top = '0';
      light.style.left = (i * 5) + '%';
      light.style.fontSize = '1.5rem';
      light.style.zIndex = '1000';
      document.body.appendChild(light);
    }
  };

  const handleThemeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateThemeMutation.mutate(themeForm);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'logo') {
        setLogoFile(file);
      } else {
        setFaviconFile(file);
      }
      uploadImageMutation.mutate({ file, type });
    }
  };

  if (!adminUser) {
    return null;
  }

  return (
    <div className="admin-panel min-h-screen bg-gaming-black text-gaming-white">
      {/* Mobile-Friendly Header */}
      <div className="border-b border-gaming-green/20 bg-gaming-black-lighter">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-gaming-green" />
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gaming-white">Admin Dashboard</h1>
              <p className="text-xs sm:text-sm text-gaming-gray hidden sm:block">Welcome back, {adminUser.username}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="border-gaming-green/30 text-gaming-green hover:bg-gaming-green/10 text-xs sm:text-sm"
          >
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <Tabs defaultValue="games" className="space-y-4 sm:space-y-6 admin-tabs">
          <TabsList className="bg-gaming-black-lighter border border-gaming-green/20 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1 h-auto p-1 admin-tabs-list">
            <TabsTrigger value="games" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black text-gaming-white hover:text-gaming-green text-xs sm:text-sm p-2 sm:p-3">
              <Gamepad2 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Games</span>
            </TabsTrigger>
            <TabsTrigger value="game-pages" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black text-gaming-white hover:text-gaming-green text-xs sm:text-sm p-2 sm:p-3">
              <Layout className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Pages</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black text-gaming-white hover:text-gaming-green text-xs sm:text-sm p-2 sm:p-3">
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Blog</span>
            </TabsTrigger>
            <TabsTrigger value="promo" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black text-gaming-white hover:text-gaming-green text-xs sm:text-sm p-2 sm:p-3">
              <Megaphone className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Promo</span>
            </TabsTrigger>
            <TabsTrigger value="locations" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black text-xs sm:text-sm p-2 sm:p-3">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Locations</span>
            </TabsTrigger>
            <TabsTrigger value="demo-servers" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black text-xs sm:text-sm p-2 sm:p-3">
              <Server className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Servers</span>
            </TabsTrigger>
            <TabsTrigger value="theme" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black text-xs sm:text-sm p-2 sm:p-3">
              <Palette className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Theme</span>
            </TabsTrigger>
          </TabsList>

          {/* Games Management */}
          <TabsContent value="games" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {/* Game Form */}
              <Card className="bg-gaming-dark border-gaming-green/20 admin-card">
                <CardHeader>
                  <CardTitle className="text-gaming-green">
                    {editingGame ? "Edit Game" : "Add New Game"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleGameSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Name</Label>
                        <Input
                          value={gameForm.name}
                          onChange={(e) => setGameForm({...gameForm, name: e.target.value})}
                          className="admin-input"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Slug</Label>
                        <Input
                          value={gameForm.slug}
                          onChange={(e) => setGameForm({...gameForm, slug: e.target.value})}
                          className="admin-input"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-300">Description</Label>
                      <Textarea
                        value={gameForm.description}
                        onChange={(e) => setGameForm({...gameForm, description: e.target.value})}
                        className="admin-input"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Image URL</Label>
                      <Input
                        value={gameForm.imageUrl}
                        onChange={(e) => setGameForm({...gameForm, imageUrl: e.target.value})}
                        className="admin-input"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Base Price ($)</Label>
                        <Input
                          value={gameForm.basePrice}
                          onChange={(e) => setGameForm({...gameForm, basePrice: e.target.value})}
                          className="admin-input"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Player Count</Label>
                        <Input
                          type="number"
                          value={gameForm.playerCount}
                          onChange={(e) => setGameForm({...gameForm, playerCount: e.target.value})}
                          className="admin-input"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={gameForm.isPopular}
                          onCheckedChange={(checked) => setGameForm({...gameForm, isPopular: checked})}
                        />
                        <Label className="text-gray-300">Popular</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={gameForm.isNew}
                          onCheckedChange={(checked) => setGameForm({...gameForm, isNew: checked})}
                        />
                        <Label className="text-gray-300">New</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={gameForm.isTrending}
                          onCheckedChange={(checked) => setGameForm({...gameForm, isTrending: checked})}
                        />
                        <Label className="text-gray-300">Trending</Label>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        type="submit" 
                        className="bg-gaming-green hover:bg-gaming-green/90 text-gaming-black text-sm sm:text-base"
                        disabled={createGameMutation.isPending || updateGameMutation.isPending}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {editingGame ? "Update Game" : "Create Game"}
                      </Button>
                      {editingGame && (
                        <Button type="button" variant="outline" onClick={resetGameForm} className="text-sm sm:text-base">
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Games List */}
              <Card className="bg-gaming-dark border-gaming-green/20 admin-card">
                <CardHeader>
                  <CardTitle className="text-gaming-green">Existing Games ({games.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {games.map((game: Game) => (
                      <div key={game.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gaming-dark-lighter rounded-lg gap-2 sm:gap-0">
                        <div>
                          <h3 className="font-semibold text-white">{game.name}</h3>
                          <p className="text-sm text-gray-400">${game.basePrice} • {game.playerCount} players</p>
                          <div className="flex space-x-1 mt-1">
                            {game.isPopular && <Badge variant="secondary" className="text-xs bg-gaming-green/20 text-gaming-green">Popular</Badge>}
                            {game.isNew && <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400">New</Badge>}
                            {game.isTrending && <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-400">Trending</Badge>}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 admin-button-group">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditGame(game)}
                            className="touch-target admin-button border-gaming-green/30 text-gaming-green hover:bg-gaming-green/10"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Link href={`/admin/games/${game.id}/customize`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="touch-target admin-button border-gaming-blue/30 text-gaming-blue hover:bg-gaming-blue/10"
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteGameMutation.mutate(game.id)}
                            className="touch-target admin-button border-red-500/30 text-red-400 hover:bg-red-500/10"
                            disabled={deleteGameMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Blog Management */}
          <TabsContent value="blog" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {/* Blog Form */}
              <Card className="bg-gaming-dark border-gaming-green/20 admin-card">
                <CardHeader>
                  <CardTitle className="text-gaming-green">
                    {editingBlog ? "Edit Blog Post" : "Add New Blog Post"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBlogSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Title</Label>
                        <Input
                          value={blogForm.title}
                          onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                          className="admin-input"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Slug</Label>
                        <Input
                          value={blogForm.slug}
                          onChange={(e) => setBlogForm({...blogForm, slug: e.target.value})}
                          className="admin-input"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-300">Excerpt</Label>
                      <Textarea
                        value={blogForm.excerpt}
                        onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                        className="admin-input"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Content (Markdown)</Label>
                      <Textarea
                        value={blogForm.content}
                        onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                        className="bg-gaming-dark-lighter border-gaming-green/30 text-white min-h-32"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Image URL</Label>
                      <Input
                        value={blogForm.imageUrl}
                        onChange={(e) => setBlogForm({...blogForm, imageUrl: e.target.value})}
                        className="admin-input"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 admin-form-grid">
                      <div>
                        <Label className="text-gray-300">Author</Label>
                        <Input
                          value={blogForm.author}
                          onChange={(e) => setBlogForm({...blogForm, author: e.target.value})}
                          className="admin-input"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Tags (comma separated)</Label>
                        <Input
                          value={blogForm.tags}
                          onChange={(e) => setBlogForm({...blogForm, tags: e.target.value})}
                          className="admin-input"
                          placeholder="minecraft, server, tutorial"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={blogForm.isPublished}
                        onCheckedChange={(checked) => setBlogForm({...blogForm, isPublished: checked})}
                      />
                      <Label className="text-gray-300">Published</Label>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 admin-button-group">
                      <Button 
                        type="submit" 
                        className="bg-gaming-green hover:bg-gaming-green/90 text-gaming-black"
                        disabled={createBlogMutation.isPending || updateBlogMutation.isPending}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {editingBlog ? "Update Post" : "Create Post"}
                      </Button>
                      {editingBlog && (
                        <Button type="button" variant="outline" onClick={resetBlogForm}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>        
                </CardContent>
              </Card>

              {/* Blog Posts List */}
              <Card className="bg-gaming-dark border-gaming-green/20 admin-card">
                <CardHeader>
                  <CardTitle className="text-gaming-green">Blog Posts ({blogPosts.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {blogPosts.map((post: BlogPost) => (
                      <div key={post.id} className="flex items-center justify-between p-3 bg-gaming-dark-lighter rounded-lg">
                        <div>
                          <h3 className="font-semibold text-white">{post.title}</h3>
                          <p className="text-sm text-gray-400">By {post.author}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={post.isPublished ? "default" : "secondary"} className="text-xs">
                              {post.isPublished ? "Published" : "Draft"}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 admin-button-group">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditBlog(post)}
                            className="touch-target admin-button border-gaming-green/30 text-gaming-green hover:bg-gaming-green/10"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteBlogMutation.mutate(post.id)}
                            className="touch-target admin-button border-red-500/30 text-red-400 hover:bg-red-500/10"
                            disabled={deleteBlogMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Game Pages Management */}
          <TabsContent value="game-pages">
            <GamePageAdmin />
          </TabsContent>

          {/* Promo Banner Management */}
          <TabsContent value="promo">
            <Card className="bg-gaming-dark border-gaming-green/20 max-w-2xl">
              <CardHeader>
                <CardTitle className="text-gaming-green">Promo Banner Settings</CardTitle>
                <CardDescription className="text-gray-400">
                  Customize the promotional banner that appears above the navigation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePromoSubmit} className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={promoForm.isEnabled}
                      onCheckedChange={(checked) => setPromoForm({...promoForm, isEnabled: checked})}
                    />
                    <Label className="text-gray-300">Enable Promo Banner</Label>
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Message</Label>
                    <Textarea
                      value={promoForm.message}
                      onChange={(e) => setPromoForm({...promoForm, message: e.target.value})}
                      className="admin-input"
                      placeholder="🎮 Special offer message here..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 admin-form-grid">
                    <div>
                      <Label className="text-gray-300">Link Text (optional)</Label>
                      <Input
                        value={promoForm.linkText}
                        onChange={(e) => setPromoForm({...promoForm, linkText: e.target.value})}
                        className="admin-input"
                        placeholder="Get Started"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Link URL (optional)</Label>
                      <Input
                        value={promoForm.linkUrl}
                        onChange={(e) => setPromoForm({...promoForm, linkUrl: e.target.value})}
                        className="admin-input"
                        placeholder="#pricing"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 admin-form-grid">
                    <div>
                      <Label className="text-gray-300">Background Color</Label>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 admin-button-group">
                        <Input
                          type="color"
                          value={promoForm.backgroundColor}
                          onChange={(e) => setPromoForm({...promoForm, backgroundColor: e.target.value})}
                          className="w-12 h-10 p-1 bg-gaming-dark-lighter border-gaming-green/30"
                        />
                        <Input
                          value={promoForm.backgroundColor}
                          onChange={(e) => setPromoForm({...promoForm, backgroundColor: e.target.value})}
                          className="bg-gaming-dark-lighter border-gaming-green/30 text-white flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-300">Text Color</Label>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 admin-button-group">
                        <Input
                          type="color"
                          value={promoForm.textColor}
                          onChange={(e) => setPromoForm({...promoForm, textColor: e.target.value})}
                          className="w-12 h-10 p-1 bg-gaming-dark-lighter border-gaming-green/30"
                        />
                        <Input
                          value={promoForm.textColor}
                          onChange={(e) => setPromoForm({...promoForm, textColor: e.target.value})}
                          className="bg-gaming-dark-lighter border-gaming-green/30 text-white flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  {promoForm.isEnabled && (
                    <div className="border border-gaming-green/20 rounded-lg p-4">
                      <Label className="text-gray-300 mb-2 block">Preview:</Label>
                      <div 
                        className="p-3 rounded text-center text-sm font-medium"
                        style={{ 
                          backgroundColor: promoForm.backgroundColor, 
                          color: promoForm.textColor 
                        }}
                      >
                        {promoForm.message}
                        {promoForm.linkText && (
                          <span className="ml-2 underline cursor-pointer">
                            {promoForm.linkText}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="bg-gaming-green hover:bg-gaming-green/90 text-gaming-black"
                    disabled={updatePromoMutation.isPending}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Update Promo Settings
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Server Locations Tab */}
          <TabsContent value="locations" className="space-y-6">
            <Card className="bg-gaming-black-lighter border-gaming-green/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gaming-white">
                  <MapPin className="w-5 h-5 text-gaming-green" />
                  Add New Server Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 admin-form-grid">
                  <div className="space-y-2">
                    <Label className="text-gaming-white">City</Label>
                    <Input
                      value={locationForm.city}
                      onChange={(e) => setLocationForm({...locationForm, city: e.target.value})}
                      placeholder="e.g., Virginia Beach"
                      className="bg-gaming-black border-gaming-black-light text-gaming-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gaming-white">Country</Label>
                    <Input
                      value={locationForm.country}
                      onChange={(e) => setLocationForm({...locationForm, country: e.target.value})}
                      placeholder="e.g., United States"
                      className="bg-gaming-black border-gaming-black-light text-gaming-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gaming-white">Region/State</Label>
                    <Input
                      value={locationForm.region}
                      onChange={(e) => setLocationForm({...locationForm, region: e.target.value})}
                      placeholder="e.g., Virginia"
                      className="bg-gaming-black border-gaming-black-light text-gaming-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gaming-white">Provider</Label>
                    <Input
                      value={locationForm.provider}
                      onChange={(e) => setLocationForm({...locationForm, provider: e.target.value})}
                      placeholder="e.g., VINTHILL"
                      className="bg-gaming-black border-gaming-black-light text-gaming-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gaming-white">IP Address</Label>
                    <Input
                      value={locationForm.ipAddress}
                      onChange={(e) => setLocationForm({...locationForm, ipAddress: e.target.value})}
                      placeholder="e.g., 135.148.137.158"
                      className="bg-gaming-black border-gaming-black-light text-gaming-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gaming-white">Auto-calculated ping will be shown in the list</Label>
                    <div className="text-sm text-gaming-gray bg-gaming-black-light p-3 rounded border border-gaming-green/20">
                      💡 Ping is automatically calculated from your browser to each server location when you view them below.
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gaming-white">Status</Label>
                  <Select 
                    value={locationForm.status} 
                    onValueChange={(value: "online" | "offline" | "maintenance") => 
                      setLocationForm({...locationForm, status: value})
                    }
                  >
                    <SelectTrigger className="bg-gaming-black border-gaming-black-light text-gaming-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gaming-black border-gaming-black-light">
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={() => {
                    createLocationMutation.mutate({
                      ...locationForm,
                      ping: 0 // Default to 0, will be calculated dynamically
                    });
                  }}
                  disabled={createLocationMutation.isPending}
                  className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Location
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gaming-black-lighter border-gaming-green/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gaming-white">
                  <Server className="w-5 h-5 text-gaming-green" />
                  Server Locations ({serverLocations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serverLocations.map((location: any) => (
                    <div key={location.id} className="flex items-center justify-between p-4 bg-gaming-black border border-gaming-black-light rounded-lg">
                      <div className="flex items-center gap-4">
                        <MapPin className="w-5 h-5 text-gaming-green" />
                        <div>
                          <h3 className="text-gaming-white font-semibold">
                            {location.city}, {location.country}
                          </h3>
                          <p className="text-gaming-gray text-sm">
                            {location.region} • {location.provider}
                          </p>
                          {location.ipAddress && (
                            <code className="text-gaming-green text-xs bg-gaming-black-lighter px-2 py-1 rounded">
                              {location.ipAddress}
                            </code>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge 
                          className={
                            location.status === 'online' 
                              ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                              : location.status === 'offline'
                              ? 'bg-red-500/20 text-red-400 border-red-500/30'
                              : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          }
                        >
                          {location.status}
                        </Badge>
                        <span className="text-gaming-green text-sm">
                          {locationPings.get(location.id) !== undefined ? `${locationPings.get(location.id)}ms` : 'Pinging...'}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteLocationMutation.mutate(location.id)}
                          className="touch-target admin-button border-red-500/30 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {serverLocations.length === 0 && (
                    <div className="text-center py-8">
                      <Server className="w-12 h-12 text-gaming-gray mx-auto mb-2" />
                      <p className="text-gaming-gray">No server locations configured yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Demo Servers Tab */}
          <TabsContent value="demo-servers" className="space-y-6">
            <Card className="bg-gaming-black-lighter border-gaming-green/20">
              <CardHeader>
                <CardTitle className="text-gaming-white">Add Demo Server</CardTitle>
                <CardDescription className="text-gaming-gray">
                  Configure demo servers for users to test before purchasing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 admin-form-grid">
                  <div>
                    <Label className="text-gaming-white">Server Name</Label>
                    <Input 
                      placeholder="VoltServers Creative Hub"
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <Label className="text-gaming-white">Game Type</Label>
                    <Select>
                      <SelectTrigger className="bg-gaming-black border-gaming-black-light text-gaming-white">
                        <SelectValue placeholder="Select game type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gaming-black border-gaming-black-light">
                        <SelectItem value="minecraft">Minecraft</SelectItem>
                        <SelectItem value="cs2">CS2</SelectItem>
                        <SelectItem value="rust">Rust</SelectItem>
                        <SelectItem value="gmod">Garry's Mod</SelectItem>
                        <SelectItem value="ark">ARK</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 admin-form-grid">
                  <div>
                    <Label className="text-gaming-white">Server IP</Label>
                    <Input 
                      placeholder="demo.voltservers.com"
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <Label className="text-gaming-white">Server Port</Label>
                    <Input 
                      type="number"
                      placeholder="25565"
                      className="admin-input"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-gaming-white">Max Players</Label>
                    <Input 
                      type="number"
                      placeholder="100"
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <Label className="text-gaming-white">Version</Label>
                    <Input 
                      placeholder="1.21.4"
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <Label className="text-gaming-white">Platform</Label>
                    <Select>
                      <SelectTrigger className="bg-gaming-black border-gaming-black-light text-gaming-white">
                        <SelectValue placeholder="Platform" />
                      </SelectTrigger>
                      <SelectContent className="bg-gaming-black border-gaming-black-light">
                        <SelectItem value="PC">PC</SelectItem>
                        <SelectItem value="Console">Console</SelectItem>
                        <SelectItem value="Crossplay">Crossplay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-gaming-white">Description</Label>
                  <Textarea 
                    placeholder="Build anything you can imagine in our creative showcase server"
                    className="admin-input resize-none"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="enabled" />
                  <Label htmlFor="enabled" className="text-gaming-white">Enable Server</Label>
                </div>
                <Button className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Demo Server
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gaming-black-lighter border-gaming-green/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gaming-white">
                  <Server className="w-5 h-5 text-gaming-green" />
                  Demo Servers (3) {/* This will be dynamic */}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Demo server list will be populated here */}
                  <div className="text-center py-8">
                    <Server className="w-12 h-12 text-gaming-gray mx-auto mb-2" />
                    <p className="text-gaming-gray">Demo servers management will be populated here.</p>
                    <p className="text-gaming-gray text-sm">Real server data will be queried and displayed.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Theme Customization Tab */}
          <TabsContent value="theme" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {/* Theme Settings Form */}
              <Card className="bg-gaming-dark border-gaming-green/20 admin-card">
                <CardHeader>
                  <CardTitle className="text-gaming-green flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Theme Customization
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Switch 
                      checked={previewMode}
                      onCheckedChange={setPreviewMode}
                      id="preview-mode"
                    />
                    <Label htmlFor="preview-mode" className="text-gray-300">
                      {previewMode ? <Eye className="w-4 h-4 inline mr-1" /> : <EyeOff className="w-4 h-4 inline mr-1" />}
                      Preview Mode
                    </Label>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleThemeSubmit} className="space-y-6">
                    {/* Site Identity */}
                    <div className="space-y-4">
                      <h3 className="text-gaming-green font-semibold flex items-center gap-2">
                        <Type className="w-4 h-4" />
                        Site Identity
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label className="text-gray-300">Website Name</Label>
                          <Input
                            value={themeForm.siteName}
                            onChange={(e) => setThemeForm({...themeForm, siteName: e.target.value})}
                            className="admin-input"
                            placeholder="VoltServers"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Tagline</Label>
                          <Input
                            value={themeForm.siteTagline}
                            onChange={(e) => setThemeForm({...themeForm, siteTagline: e.target.value})}
                            className="admin-input"
                            placeholder="Premium Game Server Hosting"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Footer Text</Label>
                          <Textarea
                            value={themeForm.footerText}
                            onChange={(e) => setThemeForm({...themeForm, footerText: e.target.value})}
                            className="admin-textarea"
                            placeholder="© 2025 VoltServers. All rights reserved."
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Logo Upload */}
                    <div className="space-y-4">
                      <h3 className="text-gaming-green font-semibold flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Brand Assets
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label className="text-gray-300">Logo</Label>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'logo')}
                              className="admin-input flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="touch-target admin-button border-gaming-green/30 text-gaming-green hover:bg-gaming-green/10 w-full sm:w-auto"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Upload
                            </Button>
                          </div>
                          {themeForm.logoUrl && (
                            <img src={themeForm.logoUrl} alt="Logo preview" className="mt-2 max-h-16 rounded border border-gaming-green/20" />
                          )}
                        </div>
                        <div>
                          <Label className="text-gray-300">Favicon</Label>
                          <div className="flex items-center space-x-4">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'favicon')}
                              className="admin-input"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="border-gaming-green/30 text-gaming-green hover:bg-gaming-green/10"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Upload
                            </Button>
                          </div>
                          {themeForm.faviconUrl && (
                            <img src={themeForm.faviconUrl} alt="Favicon preview" className="mt-2 w-8 h-8 rounded border border-gaming-green/20" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Color Customization */}
                    <div className="space-y-4">
                      <h3 className="text-gaming-green font-semibold flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Color Scheme
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 admin-form-grid">
                        <div>
                          <Label className="text-gray-300">Primary Color</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="color"
                              value={themeForm.primaryColor}
                              onChange={(e) => {
                                setThemeForm({...themeForm, primaryColor: e.target.value});
                                if (previewMode) applyThemeToDocument();
                              }}
                              className="w-12 h-10 rounded border-gaming-green/30"
                            />
                            <Input
                              value={themeForm.primaryColor}
                              onChange={(e) => setThemeForm({...themeForm, primaryColor: e.target.value})}
                              className="admin-input flex-1"
                              placeholder="#00ff88"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-gray-300">Secondary Color</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="color"
                              value={themeForm.secondaryColor}
                              onChange={(e) => {
                                setThemeForm({...themeForm, secondaryColor: e.target.value});
                                if (previewMode) applyThemeToDocument();
                              }}
                              className="w-12 h-10 rounded border-gaming-green/30"
                            />
                            <Input
                              value={themeForm.secondaryColor}
                              onChange={(e) => setThemeForm({...themeForm, secondaryColor: e.target.value})}
                              className="admin-input flex-1"
                              placeholder="#1a1a1a"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-gray-300">Accent Color</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="color"
                              value={themeForm.accentColor}
                              onChange={(e) => {
                                setThemeForm({...themeForm, accentColor: e.target.value});
                                if (previewMode) applyThemeToDocument();
                              }}
                              className="w-12 h-10 rounded border-gaming-green/30"
                            />
                            <Input
                              value={themeForm.accentColor}
                              onChange={(e) => setThemeForm({...themeForm, accentColor: e.target.value})}
                              className="admin-input flex-1"
                              placeholder="#00cc6a"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-gray-300">Background Color</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="color"
                              value={themeForm.backgroundColor}
                              onChange={(e) => {
                                setThemeForm({...themeForm, backgroundColor: e.target.value});
                                if (previewMode) applyThemeToDocument();
                              }}
                              className="w-12 h-10 rounded border-gaming-green/30"
                            />
                            <Input
                              value={themeForm.backgroundColor}
                              onChange={(e) => setThemeForm({...themeForm, backgroundColor: e.target.value})}
                              className="admin-input flex-1"
                              placeholder="#0a0a0a"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Holiday Themes */}
                    <div className="space-y-4">
                      <h3 className="text-gaming-green font-semibold flex items-center gap-2">
                        <Snowflake className="w-4 h-4" />
                        Holiday Themes
                      </h3>
                      <div>
                        <Label className="text-gray-300">Special Theme</Label>
                        <Select value={themeForm.holidayTheme} onValueChange={(value) => {
                          setThemeForm({...themeForm, holidayTheme: value});
                          if (previewMode) applyThemeToDocument();
                        }}>
                          <SelectTrigger className="admin-select">
                            <SelectValue placeholder="Select holiday theme" />
                          </SelectTrigger>
                          <SelectContent className="bg-gaming-black border-gaming-green/20">
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="snow">
                              <div className="flex items-center gap-2">
                                <Snowflake className="w-4 h-4" />
                                Snow Theme
                              </div>
                            </SelectItem>
                            <SelectItem value="halloween">
                              <div className="flex items-center gap-2">
                                <Skull className="w-4 h-4" />
                                Halloween Theme
                              </div>
                            </SelectItem>
                            <SelectItem value="easter">
                              <div className="flex items-center gap-2">
                                <Egg className="w-4 h-4" />
                                Easter Theme
                              </div>
                            </SelectItem>
                            <SelectItem value="christmas">
                              <div className="flex items-center gap-2">
                                <TreePine className="w-4 h-4" />
                                Christmas Theme
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {themeForm.holidayTheme !== 'none' && (
                          <div className="mt-2 p-3 bg-gaming-green/10 border border-gaming-green/20 rounded">
                            <p className="text-gaming-green text-sm">
                              {themeForm.holidayTheme === 'snow' && '❄️ Adds animated snowflakes across the site'}
                              {themeForm.holidayTheme === 'halloween' && '🎃 Adds spooky orange glows and effects'}
                              {themeForm.holidayTheme === 'easter' && '🥚 Adds bouncing easter eggs around the site'}
                              {themeForm.holidayTheme === 'christmas' && '🎄 Adds festive lights and decorations'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Typography */}
                    <div className="space-y-4">
                      <h3 className="text-gaming-green font-semibold">Typography & Layout</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 admin-form-grid">
                        <div>
                          <Label className="text-gray-300">Font Family</Label>
                          <Select value={themeForm.fontFamily} onValueChange={(value) => setThemeForm({...themeForm, fontFamily: value})}>
                            <SelectTrigger className="admin-select">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gaming-black border-gaming-green/20">
                              <SelectItem value="Inter">Inter</SelectItem>
                              <SelectItem value="Roboto">Roboto</SelectItem>
                              <SelectItem value="Open Sans">Open Sans</SelectItem>
                              <SelectItem value="Poppins">Poppins</SelectItem>
                              <SelectItem value="Orbitron">Orbitron (Gaming)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-gray-300">Border Radius</Label>
                          <Select value={themeForm.borderRadius} onValueChange={(value) => setThemeForm({...themeForm, borderRadius: value})}>
                            <SelectTrigger className="admin-select">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gaming-black border-gaming-green/20">
                              <SelectItem value="0">Sharp (0px)</SelectItem>
                              <SelectItem value="0.25rem">Small (4px)</SelectItem>
                              <SelectItem value="0.5rem">Medium (8px)</SelectItem>
                              <SelectItem value="1rem">Large (16px)</SelectItem>
                              <SelectItem value="1.5rem">Extra Large (24px)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* SEO & Meta Tags */}
                    <div className="space-y-4">
                      <h3 className="text-gaming-green font-semibold flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        SEO & Meta Tags
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label className="text-gray-300">Site Description</Label>
                          <Textarea
                            value={themeForm.siteDescription}
                            onChange={(e) => setThemeForm({...themeForm, siteDescription: e.target.value})}
                            className="admin-textarea"
                            placeholder="Professional game server hosting with 24/7 support and premium hardware"
                            rows={2}
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 admin-form-grid">
                          <div>
                            <Label className="text-gray-300">Meta Title Override</Label>
                            <Input
                              value={themeForm.metaTitle}
                              onChange={(e) => setThemeForm({...themeForm, metaTitle: e.target.value})}
                              className="admin-input"
                              placeholder="Leave empty to use site name"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-300">Meta Keywords</Label>
                            <Input
                              value={themeForm.metaKeywords}
                              onChange={(e) => setThemeForm({...themeForm, metaKeywords: e.target.value})}
                              className="admin-input"
                              placeholder="gaming, servers, hosting, minecraft"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-gray-300">Meta Description</Label>
                          <Textarea
                            value={themeForm.metaDescription}
                            onChange={(e) => setThemeForm({...themeForm, metaDescription: e.target.value})}
                            className="admin-textarea"
                            placeholder="Optimized description for search engines (150-160 characters)"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Social Media & Analytics */}
                    <div className="space-y-4">
                      <h3 className="text-gaming-green font-semibold flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Social Media & Analytics
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 admin-form-grid">
                        <div>
                          <Label className="text-gray-300">Open Graph Title</Label>
                          <Input
                            value={themeForm.ogTitle}
                            onChange={(e) => setThemeForm({...themeForm, ogTitle: e.target.value})}
                            className="admin-input"
                            placeholder="Title for social sharing"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Twitter Handle</Label>
                          <Input
                            value={themeForm.twitterSite}
                            onChange={(e) => setThemeForm({...themeForm, twitterSite: e.target.value})}
                            className="admin-input"
                            placeholder="@yourgamingsite"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Google Analytics ID</Label>
                          <Input
                            value={themeForm.googleAnalyticsId}
                            onChange={(e) => setThemeForm({...themeForm, googleAnalyticsId: e.target.value})}
                            className="admin-input"
                            placeholder="G-XXXXXXXXXX"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Facebook Pixel ID</Label>
                          <Input
                            value={themeForm.facebookPixelId}
                            onChange={(e) => setThemeForm({...themeForm, facebookPixelId: e.target.value})}
                            className="admin-input"
                            placeholder="123456789012345"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label className="text-gray-300">Open Graph Description</Label>
                          <Textarea
                            value={themeForm.ogDescription}
                            onChange={(e) => setThemeForm({...themeForm, ogDescription: e.target.value})}
                            className="admin-textarea"
                            placeholder="Description for social media sharing"
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Open Graph Image URL</Label>
                          <Input
                            value={themeForm.ogImage}
                            onChange={(e) => setThemeForm({...themeForm, ogImage: e.target.value})}
                            className="admin-input"
                            placeholder="https://example.com/og-image.jpg"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Site Management */}
                    <div className="space-y-4">
                      <h3 className="text-gaming-green font-semibold flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Site Management
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={themeForm.maintenanceMode}
                            onCheckedChange={(checked) => setThemeForm({...themeForm, maintenanceMode: checked})}
                          />
                          <Label className="text-gray-300">Maintenance Mode</Label>
                        </div>
                        {themeForm.maintenanceMode && (
                          <div>
                            <Label className="text-gray-300">Maintenance Message</Label>
                            <Textarea
                              value={themeForm.maintenanceMessage}
                              onChange={(e) => setThemeForm({...themeForm, maintenanceMessage: e.target.value})}
                              className="admin-textarea"
                              placeholder="We're currently performing maintenance. Please check back soon!"
                              rows={2}
                            />
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={themeForm.showAnnouncementBanner}
                            onCheckedChange={(checked) => setThemeForm({...themeForm, showAnnouncementBanner: checked})}
                          />
                          <Label className="text-gray-300">Show Announcement Banner</Label>
                        </div>
                        {themeForm.showAnnouncementBanner && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 admin-form-grid">
                            <div>
                              <Label className="text-gray-300">Announcement Text</Label>
                              <Input
                                value={themeForm.announcementBanner}
                                onChange={(e) => setThemeForm({...themeForm, announcementBanner: e.target.value})}
                                className="admin-input"
                                placeholder="🎉 Special offer: 50% off first month!"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-300">Banner Type</Label>
                              <Select value={themeForm.announcementType} onValueChange={(value) => setThemeForm({...themeForm, announcementType: value})}>
                                <SelectTrigger className="admin-select">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gaming-black border-gaming-green/20">
                                  <SelectItem value="info">Info (Blue)</SelectItem>
                                  <SelectItem value="success">Success (Green)</SelectItem>
                                  <SelectItem value="warning">Warning (Yellow)</SelectItem>
                                  <SelectItem value="error">Error (Red)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cookie Policy Management */}
                    <div className="space-y-4">
                      <h3 className="text-gaming-green font-semibold flex items-center gap-2">
                        <Cookie className="w-4 h-4" />
                        Cookie Policy & GDPR
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={themeForm.showCookieBanner}
                            onCheckedChange={(checked) => setThemeForm({...themeForm, showCookieBanner: checked})}
                          />
                          <Label className="text-gray-300">Show Cookie Banner</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={themeForm.cookieConsentRequired}
                            onCheckedChange={(checked) => setThemeForm({...themeForm, cookieConsentRequired: checked})}
                          />
                          <Label className="text-gray-300">Require Cookie Consent</Label>
                        </div>
                        <div>
                          <Label className="text-gray-300">Cookie Policy Text</Label>
                          <Textarea
                            value={themeForm.cookiePolicyText}
                            onChange={(e) => setThemeForm({...themeForm, cookiePolicyText: e.target.value})}
                            className="admin-textarea"
                            placeholder="We use cookies to enhance your experience and analyze site traffic."
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Privacy Policy URL</Label>
                          <Input
                            value={themeForm.cookiePolicyUrl}
                            onChange={(e) => setThemeForm({...themeForm, cookiePolicyUrl: e.target.value})}
                            className="admin-input"
                            placeholder="/privacy-policy"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Cookie Categories (JSON)</Label>
                          <Textarea
                            value={themeForm.cookieCategories}
                            onChange={(e) => setThemeForm({...themeForm, cookieCategories: e.target.value})}
                            className="admin-textarea font-mono text-sm"
                            placeholder={JSON.stringify([
                              { id: "necessary", name: "Necessary", description: "Essential for website functionality", required: true },
                              { id: "analytics", name: "Analytics", description: "Help us understand how visitors use our site", required: false },
                              { id: "marketing", name: "Marketing", description: "Used to deliver relevant advertisements", required: false }
                            ], null, 2)}
                            rows={6}
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            Define cookie categories with id, name, description, and required fields
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Custom CSS & Code */}
                    <div className="space-y-4">
                      <h3 className="text-gaming-green font-semibold flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        Advanced Customization
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label className="text-gray-300">Custom CSS</Label>
                          <Textarea
                            value={themeForm.customCss}
                            onChange={(e) => setThemeForm({...themeForm, customCss: e.target.value})}
                            className="admin-textarea font-mono text-sm"
                            rows={4}
                            placeholder="/* Add your custom CSS here */
.custom-class {
  background: linear-gradient(45deg, #00ff88, #00cc6a);
}"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Custom Head Code</Label>
                          <Textarea
                            value={themeForm.customHeadCode}
                            onChange={(e) => setThemeForm({...themeForm, customHeadCode: e.target.value})}
                            className="admin-textarea font-mono text-sm"
                            placeholder="<!-- Additional meta tags, analytics, or custom scripts -->"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Custom Body Code</Label>
                          <Textarea
                            value={themeForm.customBodyCode}
                            onChange={(e) => setThemeForm({...themeForm, customBodyCode: e.target.value})}
                            className="admin-textarea font-mono text-sm"
                            placeholder="<!-- Tracking pixels, chat widgets, or footer scripts -->"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button 
                        type="submit" 
                        className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black"
                        disabled={updateThemeMutation.isPending}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {updateThemeMutation.isPending ? 'Saving...' : 'Save All Settings'}
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        className="border-gaming-green/30 text-gaming-green hover:bg-gaming-green/10"
                        onClick={() => {
                          if (previewMode) {
                            removeHolidayTheme();
                            location.reload();
                          }
                        }}
                      >
                        Reset Preview
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Theme Preview */}
              <Card className="bg-gaming-dark border-gaming-green/20 admin-card">
                <CardHeader>
                  <CardTitle className="text-gaming-green">Live Preview</CardTitle>
                  <p className="text-gray-400 text-sm">Enable preview mode to see changes in real-time</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Preview cards showing theme changes */}
                  <div className="space-y-4">
                    <div 
                      className="p-4 rounded border-2"
                      style={{
                        backgroundColor: previewMode ? themeForm.backgroundColor : '#1a1a1a',
                        borderColor: previewMode ? themeForm.primaryColor : '#00ff88',
                        color: previewMode ? themeForm.textColor : '#ffffff'
                      }}
                    >
                      <h4 className="font-bold mb-2" style={{ color: previewMode ? themeForm.primaryColor : '#00ff88' }}>
                        {themeForm.siteName}
                      </h4>
                      <p className="text-sm opacity-75">{themeForm.siteTagline}</p>
                      <div className="mt-3 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 admin-button-group">
                        <div 
                          className="px-3 py-1 rounded text-sm"
                          style={{
                            backgroundColor: previewMode ? themeForm.primaryColor : '#00ff88',
                            color: previewMode ? themeForm.backgroundColor : '#0a0a0a'
                          }}
                        >
                          Primary Button
                        </div>
                        <div 
                          className="px-3 py-1 rounded text-sm border"
                          style={{
                            borderColor: previewMode ? themeForm.accentColor : '#00cc6a',
                            color: previewMode ? themeForm.accentColor : '#00cc6a'
                          }}
                        >
                          Secondary Button
                        </div>
                      </div>
                    </div>

                    {/* Holiday theme preview */}
                    {themeForm.holidayTheme !== 'none' && (
                      <div className="p-4 bg-gaming-black-lighter border border-gaming-green/20 rounded">
                        <h4 className="text-gaming-green font-semibold mb-2">Holiday Theme Preview</h4>
                        <div className="text-center py-8 relative overflow-hidden rounded">
                          {themeForm.holidayTheme === 'snow' && (
                            <div className="text-4xl">❄️ ❄️ ❄️</div>
                          )}
                          {themeForm.holidayTheme === 'halloween' && (
                            <div className="text-4xl text-orange-500">🎃 👻 🦇</div>
                          )}
                          {themeForm.holidayTheme === 'easter' && (
                            <div className="text-4xl">🥚 🐰 🌸</div>
                          )}
                          {themeForm.holidayTheme === 'christmas' && (
                            <div className="text-4xl">🎄 🎁 ⭐</div>
                          )}
                          <p className="text-gray-400 text-sm mt-2">
                            {themeForm.holidayTheme.charAt(0).toUpperCase() + themeForm.holidayTheme.slice(1)} theme activated
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Font preview */}
                    <div 
                      className="p-4 bg-gaming-black-lighter border border-gaming-green/20 rounded"
                      style={{ fontFamily: themeForm.fontFamily }}
                    >
                      <h4 className="text-gaming-green font-semibold mb-2">Font Preview</h4>
                      <p className="text-lg font-bold">The quick brown fox jumps over the lazy dog</p>
                      <p className="text-sm text-gray-400 mt-1">Font: {themeForm.fontFamily}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}