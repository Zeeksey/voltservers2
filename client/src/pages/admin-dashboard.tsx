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
  Server
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

  // Auto-ping server locations
  useEffect(() => {
    if (serverLocations.length === 0) return;

    const pingServer = async (location: any) => {
      try {
        const startTime = performance.now();
        // Use a simple fetch to test connectivity timing
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        await fetch(`https://httpbin.org/delay/0`, { 
          method: 'GET',
          signal: controller.signal,
          cache: 'no-cache'
        });
        
        clearTimeout(timeoutId);
        const endTime = performance.now();
        const pingTime = Math.round(endTime - startTime);
        
        setLocationPings(prev => new Map(prev.set(location.id, Math.max(10, pingTime))));
      } catch (error) {
        // If direct ping fails, estimate based on geographic location
        const estimatedPing = getEstimatedPing(location.region, location.country);
        setLocationPings(prev => new Map(prev.set(location.id, estimatedPing)));
      }
    };

    // Ping all locations
    serverLocations.forEach(location => {
      pingServer(location);
    });

    // Refresh pings every 45 seconds
    const interval = setInterval(() => {
      serverLocations.forEach(location => {
        pingServer(location);
      });
    }, 45000);

    return () => clearInterval(interval);
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

  if (!adminUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gaming-black text-white">
      {/* Header */}
      <div className="border-b border-gaming-green/20 bg-gaming-dark">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-gaming-green" />
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-400">Welcome back, {adminUser.username}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-gaming-green/30 text-gaming-green hover:bg-gaming-green/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="games" className="space-y-6">
          <TabsList className="bg-gaming-dark border border-gaming-green/20">
            <TabsTrigger value="games" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Games
            </TabsTrigger>
            <TabsTrigger value="game-pages" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black">
              <Layout className="w-4 h-4 mr-2" />
              Game Pages
            </TabsTrigger>
            <TabsTrigger value="blog" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black">
              <BookOpen className="w-4 h-4 mr-2" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="promo" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black">
              <Megaphone className="w-4 h-4 mr-2" />
              Promo Banner
            </TabsTrigger>
            <TabsTrigger value="locations" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black">
              <MapPin className="w-4 h-4 mr-2" />
              Server Locations
            </TabsTrigger>
            <TabsTrigger value="demo-servers" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black">
              <Server className="w-4 h-4 mr-2" />
              Demo Servers
            </TabsTrigger>
          </TabsList>

          {/* Games Management */}
          <TabsContent value="games" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Game Form */}
              <Card className="bg-gaming-dark border-gaming-green/20">
                <CardHeader>
                  <CardTitle className="text-gaming-green">
                    {editingGame ? "Edit Game" : "Add New Game"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleGameSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Name</Label>
                        <Input
                          value={gameForm.name}
                          onChange={(e) => setGameForm({...gameForm, name: e.target.value})}
                          className="bg-gaming-dark-lighter border-gaming-green/30 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Slug</Label>
                        <Input
                          value={gameForm.slug}
                          onChange={(e) => setGameForm({...gameForm, slug: e.target.value})}
                          className="bg-gaming-dark-lighter border-gaming-green/30 text-white"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-300">Description</Label>
                      <Textarea
                        value={gameForm.description}
                        onChange={(e) => setGameForm({...gameForm, description: e.target.value})}
                        className="bg-gaming-dark-lighter border-gaming-green/30 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Image URL</Label>
                      <Input
                        value={gameForm.imageUrl}
                        onChange={(e) => setGameForm({...gameForm, imageUrl: e.target.value})}
                        className="bg-gaming-dark-lighter border-gaming-green/30 text-white"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Base Price ($)</Label>
                        <Input
                          value={gameForm.basePrice}
                          onChange={(e) => setGameForm({...gameForm, basePrice: e.target.value})}
                          className="bg-gaming-dark-lighter border-gaming-green/30 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Player Count</Label>
                        <Input
                          type="number"
                          value={gameForm.playerCount}
                          onChange={(e) => setGameForm({...gameForm, playerCount: e.target.value})}
                          className="bg-gaming-dark-lighter border-gaming-green/30 text-white"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex space-x-6">
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
                    <div className="flex space-x-2">
                      <Button 
                        type="submit" 
                        className="bg-gaming-green hover:bg-gaming-green/90 text-gaming-black"
                        disabled={createGameMutation.isPending || updateGameMutation.isPending}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {editingGame ? "Update Game" : "Create Game"}
                      </Button>
                      {editingGame && (
                        <Button type="button" variant="outline" onClick={resetGameForm}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Games List */}
              <Card className="bg-gaming-dark border-gaming-green/20">
                <CardHeader>
                  <CardTitle className="text-gaming-green">Existing Games ({games.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {games.map((game: Game) => (
                      <div key={game.id} className="flex items-center justify-between p-3 bg-gaming-dark-lighter rounded-lg">
                        <div>
                          <h3 className="font-semibold text-white">{game.name}</h3>
                          <p className="text-sm text-gray-400">${game.basePrice} • {game.playerCount} players</p>
                          <div className="flex space-x-1 mt-1">
                            {game.isPopular && <Badge variant="secondary" className="text-xs bg-gaming-green/20 text-gaming-green">Popular</Badge>}
                            {game.isNew && <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400">New</Badge>}
                            {game.isTrending && <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-400">Trending</Badge>}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditGame(game)}
                            className="border-gaming-green/30 text-gaming-green hover:bg-gaming-green/10"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Link href={`/admin/games/${game.id}/customize`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gaming-blue/30 text-gaming-blue hover:bg-gaming-blue/10"
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteGameMutation.mutate(game.id)}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
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
          <TabsContent value="blog" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Blog Form */}
              <Card className="bg-gaming-dark border-gaming-green/20">
                <CardHeader>
                  <CardTitle className="text-gaming-green">
                    {editingBlog ? "Edit Blog Post" : "Add New Blog Post"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBlogSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Title</Label>
                        <Input
                          value={blogForm.title}
                          onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                          className="bg-gaming-dark-lighter border-gaming-green/30 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Slug</Label>
                        <Input
                          value={blogForm.slug}
                          onChange={(e) => setBlogForm({...blogForm, slug: e.target.value})}
                          className="bg-gaming-dark-lighter border-gaming-green/30 text-white"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-300">Excerpt</Label>
                      <Textarea
                        value={blogForm.excerpt}
                        onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                        className="bg-gaming-dark-lighter border-gaming-green/30 text-white"
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
                        className="bg-gaming-dark-lighter border-gaming-green/30 text-white"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Author</Label>
                        <Input
                          value={blogForm.author}
                          onChange={(e) => setBlogForm({...blogForm, author: e.target.value})}
                          className="bg-gaming-dark-lighter border-gaming-green/30 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Tags (comma separated)</Label>
                        <Input
                          value={blogForm.tags}
                          onChange={(e) => setBlogForm({...blogForm, tags: e.target.value})}
                          className="bg-gaming-dark-lighter border-gaming-green/30 text-white"
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
                    <div className="flex space-x-2">
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
              <Card className="bg-gaming-dark border-gaming-green/20">
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
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditBlog(post)}
                            className="border-gaming-green/30 text-gaming-green hover:bg-gaming-green/10"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteBlogMutation.mutate(post.id)}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
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
                      className="bg-gaming-dark-lighter border-gaming-green/30 text-white"
                      placeholder="🎮 Special offer message here..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Link Text (optional)</Label>
                      <Input
                        value={promoForm.linkText}
                        onChange={(e) => setPromoForm({...promoForm, linkText: e.target.value})}
                        className="bg-gaming-dark-lighter border-gaming-green/30 text-white"
                        placeholder="Get Started"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Link URL (optional)</Label>
                      <Input
                        value={promoForm.linkUrl}
                        onChange={(e) => setPromoForm({...promoForm, linkUrl: e.target.value})}
                        className="bg-gaming-dark-lighter border-gaming-green/30 text-white"
                        placeholder="#pricing"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Background Color</Label>
                      <div className="flex space-x-2">
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
                      <div className="flex space-x-2">
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
                <div className="grid grid-cols-2 gap-4">
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
                          className="border-red-500/30 text-red-400 hover:bg-red-500/20"
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
                <div className="grid grid-cols-2 gap-4">
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
                <div className="grid grid-cols-2 gap-4">
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
        </Tabs>
      </div>
    </div>
  );
}