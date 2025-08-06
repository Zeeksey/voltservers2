import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Gamepad2,
  BookOpen,
  Server,
  Users,
  Settings,
  Eye,
  Save,
  MapPin,
  Palette,
  Zap,
  Loader2
} from "lucide-react";
import type { Game, BlogPost } from "@shared/schema";
import NavigationNew from "@/components/navigation-new";
import Footer from "@/components/footer";

interface AdminUser {
  id: string;
  username: string;
  isAdmin: boolean;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isCreateIncidentOpen, setIsCreateIncidentOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState<any>(null);
  const [themeForm, setThemeForm] = useState({
    siteName: "VoltServers",
    siteTagline: "Professional Game Server Hosting",
    primaryColor: "#00cc6a",
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
    // Hero Section
    heroButtonText: "Get Started",
    heroButtonUrl: "/pricing",
    heroDemoButtonText: "Watch Demo",
    heroDemoButtonUrl: "/demo",
    // Call-to-Action Section
    ctaTitle: "Ready to Start Gaming?",
    ctaDescription: "Join thousands of gamers worldwide with our premium hosting services.",
    ctaButtonText: "Get Started Now",
    ctaButtonUrl: "/pricing",
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
    cookiePolicyUrl: "/privacy-policy"
  });
  const [locationForm, setLocationForm] = useState({
    city: "",
    country: "",
    region: "",
    provider: "",
    ipAddress: "",
    port: "80",
    status: "online" as "online" | "offline" | "maintenance"
  });
  const [demoServerForm, setDemoServerForm] = useState({
    serverName: "",
    gameId: "",
    host: "",
    port: "",
    playerCount: "",
    maxPlayers: "",
    isOnline: true,
    version: "",
    description: "",
    location: "",
    playtime: ""
  });
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const [editingDemoServer, setEditingDemoServer] = useState<any>(null);
  
  const [pingResults, setPingResults] = useState<Map<string, number>>(new Map());
  const [testingPing, setTestingPing] = useState<Set<string>>(new Set());
  
  const { toast } = useToast();
  
  // Ping testing function
  const testLocationPing = async (locationId: string, ipAddress: string, port: string = "80") => {
    if (!ipAddress) return;
    
    setTestingPing(prev => new Set([...prev, locationId]));
    
    try {
      const startTime = Date.now();
      // Use a simple HTTP request to test connectivity
      const response = await fetch(`/api/ping-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host: ipAddress, port: parseInt(port) })
      });
      
      const endTime = Date.now();
      const pingTime = endTime - startTime;
      
      if (response.ok) {
        setPingResults(prev => new Map([...prev, [locationId, pingTime]]));
        toast({
          title: "Ping Test Successful",
          description: `${ipAddress}: ${pingTime}ms`,
        });
      } else {
        setPingResults(prev => new Map([...prev, [locationId, -1]]));
        toast({
          title: "Ping Test Failed",
          description: `Could not reach ${ipAddress}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      setPingResults(prev => new Map([...prev, [locationId, -1]]));
      toast({
        title: "Ping Test Error",
        description: `Network error testing ${ipAddress}`,
        variant: "destructive",
      });
    } finally {
      setTestingPing(prev => {
        const newSet = new Set(prev);
        newSet.delete(locationId);
        return newSet;
      });
    }
  };
  const queryClient = useQueryClient();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation('/admin/login');
      return;
    }

    // Try to get admin user info from localStorage or make an API call
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      setAdminUser(JSON.parse(storedUser));
    } else {
      setAdminUser({ id: "admin", username: "admin", isAdmin: true });
    }
  }, [setLocation]);

  // Data queries
  const { data: games = [] } = useQuery({
    queryKey: ['/api/games'],
    queryFn: async () => {
      const response = await fetch('/api/games');
      if (!response.ok) throw new Error('Failed to fetch games');
      return response.json();
    }
  });

  const { data: blogs = [] } = useQuery({
    queryKey: ['/api/blog'],
    queryFn: async () => {
      const response = await fetch('/api/blog');
      if (!response.ok) throw new Error('Failed to fetch blog posts');
      return response.json();
    }
  });

  const { data: demoServers = [] } = useQuery({
    queryKey: ['/api/demo-servers'],
    queryFn: async () => {
      const response = await fetch('/api/demo-servers');
      if (!response.ok) throw new Error('Failed to fetch demo servers');
      return response.json();
    }
  });

  const { data: serverLocations = [] } = useQuery({
    queryKey: ['/api/server-locations'],
    queryFn: async () => {
      const response = await fetch('/api/server-locations');
      if (!response.ok) throw new Error('Failed to fetch server locations');
      return response.json();
    }
  });

  const { data: themeSettings } = useQuery({
    queryKey: ['/api/theme-settings'],
    queryFn: async () => {
      const response = await fetch('/api/theme-settings');
      if (!response.ok) throw new Error('Failed to fetch theme settings');
      return response.json();
    }
  });

  const { data: incidents = [] } = useQuery({
    queryKey: ['/api/incidents'],
    queryFn: async () => {
      const response = await fetch('/api/incidents');
      if (!response.ok) throw new Error('Failed to fetch incidents');
      return response.json();
    }
  });

  // Helper functions for incident management
  const editIncident = (incident: any) => {
    setEditingIncident(incident);
    setIsCreateIncidentOpen(true);
  };

  // Statistics
  const stats = {
    totalGames: games.length,
    totalPosts: blogs.length,
    activeServers: demoServers.filter((server: any) => server.isOnline !== false).length,
    totalPlayers: demoServers.reduce((sum: number, server: any) => sum + (server.playerCount || 0), 0)
  };

  // Update theme settings when data loads
  React.useEffect(() => {
    if (themeSettings) {
      setThemeForm({
        siteName: themeSettings.siteName || "VoltServers",
        siteTagline: themeSettings.siteTagline || "Professional Game Server Hosting",
        primaryColor: themeSettings.primaryColor || "#00cc6a",
        secondaryColor: themeSettings.secondaryColor || "#1a1a1a",
        accentColor: themeSettings.accentColor || "#00cc6a",
        backgroundColor: themeSettings.backgroundColor || "#0a0a0a",
        textColor: themeSettings.textColor || "#ffffff",
        logoUrl: themeSettings.logoUrl || "",
        faviconUrl: themeSettings.faviconUrl || "",
        footerText: themeSettings.footerText || "",
        fontFamily: themeSettings.fontFamily || "Inter",
        borderRadius: themeSettings.borderRadius || "0.5rem",
        holidayTheme: themeSettings.holidayTheme || "none",
        customCss: themeSettings.customCss || "",
        // SEO & Meta Tags
        metaTitle: themeSettings.metaTitle || "",
        metaDescription: themeSettings.metaDescription || "",
        metaKeywords: themeSettings.metaKeywords || "",
        ogTitle: themeSettings.ogTitle || "",
        ogDescription: themeSettings.ogDescription || "",
        ogImage: themeSettings.ogImage || "",
        twitterCard: themeSettings.twitterCard || "summary_large_image",
        twitterSite: themeSettings.twitterSite || "",
        // Analytics & Tracking
        googleAnalyticsId: themeSettings.googleAnalyticsId || "",
        googleTagManagerId: themeSettings.googleTagManagerId || "",
        facebookPixelId: themeSettings.facebookPixelId || "",
        customHeadCode: themeSettings.customHeadCode || "",
        customBodyCode: themeSettings.customBodyCode || "",
        // Site Management
        maintenanceMode: themeSettings.maintenanceMode || false,
        maintenanceMessage: themeSettings.maintenanceMessage || "We're currently performing maintenance. Please check back soon!",
        announcementBanner: themeSettings.announcementBanner || "",
        announcementType: themeSettings.announcementType || "info",
        showAnnouncementBanner: themeSettings.showAnnouncementBanner || false,
        // Cookie Policy Settings
        showCookieBanner: themeSettings.showCookieBanner !== false,
        cookieConsentRequired: themeSettings.cookieConsentRequired !== false,
        cookiePolicyText: themeSettings.cookiePolicyText || "We use cookies to enhance your experience and analyze site traffic.",
        cookiePolicyUrl: themeSettings.cookiePolicyUrl || "/privacy-policy"
      });
    }
  }, [themeSettings]);

  // Theme mutation
  const updateThemeMutation = useMutation({
    mutationFn: async (themeData: any) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch('/api/admin/theme-settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(themeData)
      });
      if (!response.ok) throw new Error('Failed to update theme settings');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/theme-settings'] });
      toast({ title: "Success", description: "Theme settings updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update theme settings", variant: "destructive" });
    }
  });

  // Location mutations
  const createLocationMutation = useMutation({
    mutationFn: async (locationData: any) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch('/api/admin/server-locations', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(locationData)
      });
      if (!response.ok) throw new Error('Failed to create server location');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/server-locations'] });
      setLocationForm({ city: "", country: "", region: "", provider: "", ipAddress: "", status: "online" });
      toast({ title: "Success", description: "Server location created successfully" });
    }
  });

  const updateLocationMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/server-locations/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update server location');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/server-locations'] });
      setEditingLocation(null);
      setLocationForm({ city: "", country: "", region: "", provider: "", ipAddress: "", status: "online" });
      toast({ title: "Success", description: "Server location updated successfully" });
    }
  });

  const deleteLocationMutation = useMutation({
    mutationFn: async (locationId: string) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/server-locations/${locationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete server location');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/server-locations'] });
      toast({ title: "Success", description: "Server location deleted successfully" });
    }
  });

  // Demo server mutations
  const createDemoServerMutation = useMutation({
    mutationFn: async (serverData: any) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch('/api/admin/demo-servers', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(serverData)
      });
      if (!response.ok) throw new Error('Failed to create demo server');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/demo-servers'] });
      setDemoServerForm({
        serverName: "", gameId: "", host: "", port: "", playerCount: "", 
        maxPlayers: "", isOnline: true, version: "", description: "", location: "", playtime: ""
      });
      toast({ title: "Success", description: "Demo server created successfully" });
    }
  });

  const updateDemoServerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/demo-servers/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update demo server');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/demo-servers'] });
      setEditingDemoServer(null);
      setDemoServerForm({
        serverName: "", gameId: "", host: "", port: "", playerCount: "", 
        maxPlayers: "", isOnline: true, version: "", description: "", location: "", playtime: ""
      });
      toast({ title: "Success", description: "Demo server updated successfully" });
    }
  });

  const deleteDemoServerMutation = useMutation({
    mutationFn: async (serverId: string) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/demo-servers/${serverId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete demo server');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/demo-servers'] });
      toast({ title: "Success", description: "Demo server deleted successfully" });
    }
  });

  // Delete mutations
  const deleteGameMutation = useMutation({
    mutationFn: async (gameId: string) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/games/${gameId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete game');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/games'] });
      toast({ title: "Success", description: "Game deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete game", variant: "destructive" });
    }
  });

  const deleteBlogMutation = useMutation({
    mutationFn: async (blogId: string) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/blog/${blogId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete blog post');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      toast({ title: "Success", description: "Blog post deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete blog post", variant: "destructive" });
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setAdminUser(null);
    toast({ title: "Success", description: "Logged out successfully" });
    setLocation('/admin/login');
  };

  if (!adminUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gaming-black">
      <NavigationNew />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gaming-white mb-2">Admin Dashboard</h1>
            <p className="text-gaming-gray">Welcome back, {adminUser.username}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-black"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gaming-black-light border-gaming-green/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gaming-white">Games</CardTitle>
              <Gamepad2 className="h-4 w-4 text-gaming-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gaming-white">{stats.totalGames}</div>
              <p className="text-xs text-gaming-gray">Total game types</p>
            </CardContent>
          </Card>

          <Card className="bg-gaming-black-light border-gaming-green/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gaming-white">Blog Posts</CardTitle>
              <BookOpen className="h-4 w-4 text-gaming-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gaming-white">{stats.totalPosts}</div>
              <p className="text-xs text-gaming-gray">Published articles</p>
            </CardContent>
          </Card>

          <Card className="bg-gaming-black-light border-gaming-green/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gaming-white">Demo Servers</CardTitle>
              <Server className="h-4 w-4 text-gaming-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gaming-white">{stats.activeServers}</div>
              <p className="text-xs text-gaming-gray">Online servers</p>
            </CardContent>
          </Card>

          <Card className="bg-gaming-black-light border-gaming-green/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gaming-white">Players</CardTitle>
              <Users className="h-4 w-4 text-gaming-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gaming-white">{stats.totalPlayers}</div>
              <p className="text-xs text-gaming-gray">Currently online</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="games" className="space-y-6">
          <TabsList className="bg-gaming-black-light border-gaming-green/30">
            <TabsTrigger value="games" className="data-[state=active]:bg-gaming-green data-[state=active]:text-black">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Games
            </TabsTrigger>
            <TabsTrigger value="blog" className="data-[state=active]:bg-gaming-green data-[state=active]:text-black">
              <BookOpen className="w-4 h-4 mr-2" />
              Blog Posts
            </TabsTrigger>
            <TabsTrigger value="demos" className="data-[state=active]:bg-gaming-green data-[state=active]:text-black">
              <Server className="w-4 h-4 mr-2" />
              Demo Servers
            </TabsTrigger>
            <TabsTrigger value="locations" className="data-[state=active]:bg-gaming-green data-[state=active]:text-black">
              <MapPin className="w-4 h-4 mr-2" />
              Locations
            </TabsTrigger>
            <TabsTrigger value="theme" className="data-[state=active]:bg-gaming-green data-[state=active]:text-black">
              <Palette className="w-4 h-4 mr-2" />
              Theme
            </TabsTrigger>
            <TabsTrigger value="incidents" className="data-[state=active]:bg-gaming-green data-[state=active]:text-black">
              <Zap className="w-4 h-4 mr-2" />
              Status & Incidents
            </TabsTrigger>
          </TabsList>

          {/* Games Tab */}
          <TabsContent value="games">
            <Card className="bg-gaming-black-light border-gaming-green/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gaming-white">Game Management</CardTitle>
                    <CardDescription className="text-gaming-gray">
                      Manage your game hosting options
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setLocation('/admin/games/new/edit')}
                    className="bg-gaming-green text-black hover:bg-gaming-green/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Game
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {games.map((game: Game) => (
                    <div key={game.id} className="flex items-center justify-between p-4 border border-gaming-green/20 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={game.imageUrl || '/api/placeholder/64/64'} 
                          alt={game.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="text-gaming-white font-medium">{game.name}</h3>
                          <p className="text-gaming-gray text-sm">{game.description}</p>
                          <div className="flex gap-2 mt-1">
                            {game.isPopular && (
                              <Badge variant="outline" className="border-gaming-green text-gaming-green text-xs">
                                Popular
                              </Badge>
                            )}
                            {game.isNew && (
                              <Badge variant="outline" className="border-blue-500 text-blue-500 text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/games/${game.slug}`, '_blank')}
                          className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-black"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setLocation(`/admin/games/${game.id}/edit`)}
                          className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-black"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteGameMutation.mutate(game.id)}
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog">
            <Card className="bg-gaming-black-light border-gaming-green/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gaming-white">Blog Management</CardTitle>
                    <CardDescription className="text-gaming-gray">
                      Manage your blog posts and articles
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setLocation('/admin/blog/new')}
                    className="bg-gaming-green text-black hover:bg-gaming-green/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Post
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {blogs.map((post: BlogPost) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border border-gaming-green/20 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={post.imageUrl || '/api/placeholder/64/64'} 
                          alt={post.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="text-gaming-white font-medium">{post.title}</h3>
                          <p className="text-gaming-gray text-sm">{post.excerpt}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className={`text-xs ${
                              post.isPublished 
                                ? 'border-gaming-green text-gaming-green' 
                                : 'border-yellow-500 text-yellow-500'
                            }`}>
                              {post.isPublished ? 'Published' : 'Draft'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                          className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-black"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setLocation(`/admin/blog/${post.id}/edit`)}
                          className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-black"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteBlogMutation.mutate(post.id)}
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Demo Servers Tab */}
          <TabsContent value="demos">
            <Card className="bg-gaming-black-light border-gaming-green/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gaming-white">Demo Server Management</CardTitle>
                    <CardDescription className="text-gaming-gray">
                      Manage demo servers shown on the homepage
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      setEditingDemoServer(null);
                      setDemoServerForm({
                        serverName: "", gameId: "", host: "", port: "", playerCount: "", 
                        maxPlayers: "", isOnline: true, version: "", description: "", location: "", playtime: ""
                      });
                    }}
                    className="bg-gaming-green text-black hover:bg-gaming-green/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Demo Server
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 mb-6">
                  {demoServers.map((server: any) => (
                    <div key={server.id} className="flex items-center justify-between p-4 border border-gaming-green/20 rounded-lg">
                      <div>
                        <h3 className="text-gaming-white font-medium">{server.name || server.serverName}</h3>
                        <p className="text-gaming-gray text-sm">{server.host || server.serverIp}:{server.port || server.serverPort}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className={`text-xs ${
                            server.isOnline !== false ? 'border-gaming-green text-gaming-green' : 'border-red-500 text-red-500'
                          }`}>
                            {server.isOnline !== false ? 'Online' : 'Offline'}
                          </Badge>
                          <Badge variant="outline" className="border-blue-500 text-blue-500 text-xs">
                            {server.playerCount || 0}/{server.maxPlayers || 100} players
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingDemoServer(server);
                            setDemoServerForm({
                              serverName: server.name || server.serverName || "",
                              gameId: server.gameId || "",
                              host: server.host || server.serverIp || "",
                              port: server.port?.toString() || server.serverPort?.toString() || "",
                              playerCount: server.playerCount?.toString() || "0",
                              maxPlayers: server.maxPlayers?.toString() || "100",
                              isOnline: server.isOnline ?? true,
                              version: server.version || "",
                              description: server.description || "",
                              location: server.location || "",
                              playtime: server.playtime?.toString() || ""
                            });
                          }}
                          className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-black"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteDemoServerMutation.mutate(server.id)}
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Demo Server Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const serverData = {
                      serverName: demoServerForm.serverName,
                      gameId: demoServerForm.gameId,
                      serverIp: demoServerForm.host,
                      serverPort: parseInt(demoServerForm.port),
                      playerCount: parseInt(demoServerForm.playerCount),
                      maxPlayers: parseInt(demoServerForm.maxPlayers),
                      isOnline: demoServerForm.isOnline,
                      version: demoServerForm.version,
                      description: demoServerForm.description,
                      location: demoServerForm.location,
                      playtime: demoServerForm.playtime ? parseInt(demoServerForm.playtime) : null
                    };
                    
                    if (editingDemoServer) {
                      updateDemoServerMutation.mutate({ id: editingDemoServer.id, data: serverData });
                    } else {
                      createDemoServerMutation.mutate(serverData);
                    }
                  }}
                  className="space-y-4 border-t border-gaming-green/20 pt-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gaming-white">Server Name</Label>
                      <Input
                        value={demoServerForm.serverName}
                        onChange={(e) => setDemoServerForm({...demoServerForm, serverName: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="My Awesome Server"
                      />
                    </div>
                    <div>
                      <Label className="text-gaming-white">Game</Label>
                      <Select value={demoServerForm.gameId} onValueChange={(value) => setDemoServerForm({...demoServerForm, gameId: value})}>
                        <SelectTrigger className="bg-gaming-black border-gaming-green/30 text-gaming-white">
                          <SelectValue placeholder="Select game" />
                        </SelectTrigger>
                        <SelectContent>
                          {games.map((game: Game) => (
                            <SelectItem key={game.id} value={game.id}>{game.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gaming-white">Host/IP</Label>
                      <Input
                        value={demoServerForm.host}
                        onChange={(e) => setDemoServerForm({...demoServerForm, host: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="127.0.0.1"
                      />
                    </div>
                    <div>
                      <Label className="text-gaming-white">Port</Label>
                      <Input
                        value={demoServerForm.port}
                        onChange={(e) => setDemoServerForm({...demoServerForm, port: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="25565"
                      />
                    </div>
                    <div>
                      <Label className="text-gaming-white">Player Count</Label>
                      <Input
                        type="number"
                        value={demoServerForm.playerCount}
                        onChange={(e) => setDemoServerForm({...demoServerForm, playerCount: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label className="text-gaming-white">Max Players</Label>
                      <Input
                        type="number"
                        value={demoServerForm.maxPlayers}
                        onChange={(e) => setDemoServerForm({...demoServerForm, maxPlayers: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="100"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={demoServerForm.isOnline}
                      onCheckedChange={(checked) => setDemoServerForm({...demoServerForm, isOnline: checked})}
                    />
                    <Label className="text-gaming-white">Server Online</Label>
                  </div>
                  <Button type="submit" className="bg-gaming-green text-black hover:bg-gaming-green/90">
                    <Save className="w-4 h-4 mr-2" />
                    {editingDemoServer ? 'Update' : 'Create'} Demo Server
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Server Locations Tab */}
          <TabsContent value="locations">
            <Card className="bg-gaming-black-light border-gaming-green/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gaming-white">Server Location Management</CardTitle>
                    <CardDescription className="text-gaming-gray">
                      Manage server locations displayed to users
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      setEditingLocation(null);
                      setLocationForm({ city: "", country: "", region: "", provider: "", ipAddress: "", port: "80", status: "online" });
                    }}
                    className="bg-gaming-green text-black hover:bg-gaming-green/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Location
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 mb-6">
                  {serverLocations.map((location: any) => (
                    <div key={location.id} className="flex items-center justify-between p-4 border border-gaming-green/20 rounded-lg">
                      <div>
                        <h3 className="text-gaming-white font-medium">{location.city}, {location.country}</h3>
                        <p className="text-gaming-gray text-sm">{location.provider} - {location.region}</p>
                        {location.ipAddress && (
                          <p className="text-gaming-gray text-xs">IP: {location.ipAddress}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={`text-xs ${
                            location.status === 'online' ? 'border-gaming-green text-gaming-green' :
                            location.status === 'maintenance' ? 'border-yellow-500 text-yellow-500' :
                            'border-red-500 text-red-500'
                          }`}>
                            {location.status}
                          </Badge>
                          {pingResults.has(location.id) && (
                            <Badge variant="outline" className={`text-xs ${
                              pingResults.get(location.id) === -1 
                                ? 'border-red-500 text-red-500' 
                                : 'border-gaming-green text-gaming-green'
                            }`}>
                              {pingResults.get(location.id) === -1 
                                ? 'Unreachable' 
                                : `${pingResults.get(location.id)}ms`
                              }
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {location.ipAddress && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => testLocationPing(location.id, location.ipAddress, "80")}
                            disabled={testingPing.has(location.id)}
                            className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                          >
                            {testingPing.has(location.id) ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                Testing
                              </>
                            ) : (
                              <>
                                <Zap className="w-4 h-4" />
                              </>
                            )}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingLocation(location);
                            setLocationForm({
                              city: location.city,
                              country: location.country,
                              region: location.region,
                              provider: location.provider,
                              ipAddress: location.ipAddress || "",
                              port: location.port?.toString() || "80",
                              status: location.status
                            });
                          }}
                          className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-black"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteLocationMutation.mutate(location.id)}
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Location Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (editingLocation) {
                      updateLocationMutation.mutate({ id: editingLocation.id, data: locationForm });
                    } else {
                      createLocationMutation.mutate(locationForm);
                    }
                  }}
                  className="space-y-4 border-t border-gaming-green/20 pt-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gaming-white">City</Label>
                      <Input
                        value={locationForm.city}
                        onChange={(e) => setLocationForm({...locationForm, city: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="New York"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gaming-white">Country</Label>
                      <Input
                        value={locationForm.country}
                        onChange={(e) => setLocationForm({...locationForm, country: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="United States"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gaming-white">Region</Label>
                      <Input
                        value={locationForm.region}
                        onChange={(e) => setLocationForm({...locationForm, region: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="North America"
                      />
                    </div>
                    <div>
                      <Label className="text-gaming-white">Provider</Label>
                      <Input
                        value={locationForm.provider}
                        onChange={(e) => setLocationForm({...locationForm, provider: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="AWS"
                      />
                    </div>
                    <div>
                      <Label className="text-gaming-white">IP Address</Label>
                      <Input
                        value={locationForm.ipAddress}
                        onChange={(e) => setLocationForm({...locationForm, ipAddress: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="192.168.1.1"
                      />
                    </div>
                    <div>
                      <Label className="text-gaming-white">Port (for ping test)</Label>
                      <Input
                        value={locationForm.port}
                        onChange={(e) => setLocationForm({...locationForm, port: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="80"
                      />
                    </div>
                    <div>
                      <Label className="text-gaming-white">Status</Label>
                      <Select value={locationForm.status} onValueChange={(value: any) => setLocationForm({...locationForm, status: value})}>
                        <SelectTrigger className="bg-gaming-black border-gaming-green/30 text-gaming-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="offline">Offline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" className="bg-gaming-green text-black hover:bg-gaming-green/90">
                    <Save className="w-4 h-4 mr-2" />
                    {editingLocation ? 'Update' : 'Create'} Location
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Theme Settings Tab */}
          <TabsContent value="theme">
            <div className="space-y-6">
              {/* Basic Theme Settings */}
              <Card className="bg-gaming-black-light border-gaming-green/30">
                <CardHeader>
                  <CardTitle className="text-gaming-white">Basic Theme Settings</CardTitle>
                  <CardDescription className="text-gaming-gray">
                    Customize site branding and appearance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gaming-white">Site Name</Label>
                      <Input
                        value={themeForm.siteName}
                        onChange={(e) => setThemeForm({...themeForm, siteName: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="VoltServers"
                      />
                    </div>
                    <div>
                      <Label className="text-gaming-white">Site Tagline</Label>
                      <Input
                        value={themeForm.siteTagline}
                        onChange={(e) => setThemeForm({...themeForm, siteTagline: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="Professional Game Server Hosting"
                      />
                    </div>
                    <div>
                      <Label className="text-gaming-white">Logo URL</Label>
                      <Input
                        value={themeForm.logoUrl}
                        onChange={(e) => setThemeForm({...themeForm, logoUrl: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                    <div>
                      <Label className="text-gaming-white">Font Family</Label>
                      <Select value={themeForm.fontFamily} onValueChange={(value) => setThemeForm({...themeForm, fontFamily: value})}>
                        <SelectTrigger className="bg-gaming-black border-gaming-green/30 text-gaming-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Open Sans">Open Sans</SelectItem>
                          <SelectItem value="Poppins">Poppins</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-gaming-white">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={themeForm.primaryColor}
                          onChange={(e) => setThemeForm({...themeForm, primaryColor: e.target.value})}
                          className="w-16 h-10 bg-gaming-black border-gaming-green/30"
                        />
                        <Input
                          value={themeForm.primaryColor}
                          onChange={(e) => setThemeForm({...themeForm, primaryColor: e.target.value})}
                          className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                          placeholder="#00cc6a"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gaming-white">Secondary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={themeForm.secondaryColor}
                          onChange={(e) => setThemeForm({...themeForm, secondaryColor: e.target.value})}
                          className="w-16 h-10 bg-gaming-black border-gaming-green/30"
                        />
                        <Input
                          value={themeForm.secondaryColor}
                          onChange={(e) => setThemeForm({...themeForm, secondaryColor: e.target.value})}
                          className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                          placeholder="#1a1a1a"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gaming-white">Background Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={themeForm.backgroundColor}
                          onChange={(e) => setThemeForm({...themeForm, backgroundColor: e.target.value})}
                          className="w-16 h-10 bg-gaming-black border-gaming-green/30"
                        />
                        <Input
                          value={themeForm.backgroundColor}
                          onChange={(e) => setThemeForm({...themeForm, backgroundColor: e.target.value})}
                          className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                          placeholder="#0a0a0a"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gaming-white">Text Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={themeForm.textColor}
                          onChange={(e) => setThemeForm({...themeForm, textColor: e.target.value})}
                          className="w-16 h-10 bg-gaming-black border-gaming-green/30"
                        />
                        <Input
                          value={themeForm.textColor}
                          onChange={(e) => setThemeForm({...themeForm, textColor: e.target.value})}
                          className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hero Section Content */}
              <Card className="bg-gaming-black-light border-gaming-green/30">
                <CardHeader>
                  <CardTitle className="text-gaming-white">Hero Section Content</CardTitle>
                  <CardDescription className="text-gaming-gray">
                    Customize the main hero section text and messaging
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gaming-white">Hero Title</Label>
                    <Input
                      value={themeForm.heroTitle || ""}
                      onChange={(e) => setThemeForm({...themeForm, heroTitle: e.target.value})}
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                      placeholder="Deploy Your Game Server in Minutes"
                    />
                  </div>
                  <div>
                    <Label className="text-gaming-white">Hero Subtitle</Label>
                    <Input
                      value={themeForm.heroSubtitle || ""}
                      onChange={(e) => setThemeForm({...themeForm, heroSubtitle: e.target.value})}
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                      placeholder="Experience lightning-fast deployment with our premium hosting platform"
                    />
                  </div>
                  <div>
                    <Label className="text-gaming-white">Hero Description</Label>
                    <Textarea
                      value={themeForm.heroDescription || ""}
                      onChange={(e) => setThemeForm({...themeForm, heroDescription: e.target.value})}
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                      placeholder="Join thousands of gamers who trust our reliable infrastructure for their Minecraft, CS2, Rust, and other game servers."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gaming-white">Primary Button Text</Label>
                      <Input
                        value={themeForm.heroButtonText || "Get Started"}
                        onChange={(e) => setThemeForm({...themeForm, heroButtonText: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="Get Started"
                      />
                    </div>
                    <div>
                      <Label className="text-gaming-white">Primary Button URL</Label>
                      <Input
                        value={themeForm.heroButtonUrl || "/pricing"}
                        onChange={(e) => setThemeForm({...themeForm, heroButtonUrl: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="/pricing"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gaming-white">Demo Button Text</Label>
                      <Input
                        value={themeForm.heroDemoButtonText || "Watch Demo"}
                        onChange={(e) => setThemeForm({...themeForm, heroDemoButtonText: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="Watch Demo"
                      />
                    </div>
                    <div>
                      <Label className="text-gaming-white">Demo Button URL</Label>
                      <Input
                        value={themeForm.heroDemoButtonUrl || "/demo"}
                        onChange={(e) => setThemeForm({...themeForm, heroDemoButtonUrl: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="/demo"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Call-to-Action Settings */}
              <Card className="bg-gaming-black-light border-gaming-green/30">
                <CardHeader>
                  <CardTitle className="text-gaming-white">Call-to-Action Section</CardTitle>
                  <CardDescription className="text-gaming-gray">
                    Customize CTA section content and buttons
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gaming-white">CTA Title</Label>
                    <Input
                      value={themeForm.ctaTitle || "Ready to Start Gaming?"}
                      onChange={(e) => setThemeForm({...themeForm, ctaTitle: e.target.value})}
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                      placeholder="Ready to Start Gaming?"
                    />
                  </div>
                  <div>
                    <Label className="text-gaming-white">CTA Description</Label>
                    <Textarea
                      value={themeForm.ctaDescription || "Join thousands of gamers worldwide with our premium hosting services."}
                      onChange={(e) => setThemeForm({...themeForm, ctaDescription: e.target.value})}
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                      placeholder="Join thousands of gamers worldwide with our premium hosting services."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gaming-white">CTA Button Text</Label>
                      <Input
                        value={themeForm.ctaButtonText || "Get Started Now"}
                        onChange={(e) => setThemeForm({...themeForm, ctaButtonText: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="Get Started Now"
                      />
                    </div>
                    <div>
                      <Label className="text-gaming-white">CTA Button URL</Label>
                      <Input
                        value={themeForm.ctaButtonUrl || "/pricing"}
                        onChange={(e) => setThemeForm({...themeForm, ctaButtonUrl: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="/pricing"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SEO Settings */}
              <Card className="bg-gaming-black-light border-gaming-green/30">
                <CardHeader>
                  <CardTitle className="text-gaming-white">SEO & Meta Tags</CardTitle>
                  <CardDescription className="text-gaming-gray">
                    Optimize your site for search engines and social media
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gaming-white">Meta Title</Label>
                      <Input
                        value={themeForm.metaTitle}
                        onChange={(e) => setThemeForm({...themeForm, metaTitle: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="VoltServers - Game Server Hosting"
                      />
                    </div>
                    <div>
                      <Label className="text-gaming-white">Twitter Site</Label>
                      <Input
                        value={themeForm.twitterSite}
                        onChange={(e) => setThemeForm({...themeForm, twitterSite: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="@voltservers"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gaming-white">Meta Description</Label>
                    <Textarea
                      value={themeForm.metaDescription}
                      onChange={(e) => setThemeForm({...themeForm, metaDescription: e.target.value})}
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                      placeholder="Professional game server hosting with DDoS protection..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label className="text-gaming-white">Meta Keywords</Label>
                    <Input
                      value={themeForm.metaKeywords}
                      onChange={(e) => setThemeForm({...themeForm, metaKeywords: e.target.value})}
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                      placeholder="game server hosting, minecraft hosting, gaming"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Analytics & Tracking */}
              <Card className="bg-gaming-black-light border-gaming-green/30">
                <CardHeader>
                  <CardTitle className="text-gaming-white">Analytics & Tracking</CardTitle>
                  <CardDescription className="text-gaming-gray">
                    Add tracking codes and analytics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-gaming-white">Google Analytics ID</Label>
                      <Input
                        value={themeForm.googleAnalyticsId}
                        onChange={(e) => setThemeForm({...themeForm, googleAnalyticsId: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="GA-XXXXXXXXX-X"
                      />
                    </div>
                    <div>
                      <Label className="text-gaming-white">Google Tag Manager ID</Label>
                      <Input
                        value={themeForm.googleTagManagerId}
                        onChange={(e) => setThemeForm({...themeForm, googleTagManagerId: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="GTM-XXXXXXX"
                      />
                    </div>
                    <div>
                      <Label className="text-gaming-white">Facebook Pixel ID</Label>
                      <Input
                        value={themeForm.facebookPixelId}
                        onChange={(e) => setThemeForm({...themeForm, facebookPixelId: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="123456789012345"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gaming-white">Custom Head Code</Label>
                    <Textarea
                      value={themeForm.customHeadCode}
                      onChange={(e) => setThemeForm({...themeForm, customHeadCode: e.target.value})}
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white font-mono text-sm"
                      placeholder="<script>...</script>"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Brand Assets */}
              <Card className="bg-gaming-black-light border-gaming-green/30">
                <CardHeader>
                  <CardTitle className="text-gaming-white">Brand Assets</CardTitle>
                  <CardDescription className="text-gaming-gray">
                    Logo, favicon, and footer text customization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gaming-white">Logo URL</Label>
                      <Input
                        value={themeForm.logoUrl || ""}
                        onChange={(e) => setThemeForm({...themeForm, logoUrl: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                    <div>
                      <Label className="text-gaming-white">Favicon URL</Label>
                      <Input
                        value={themeForm.faviconUrl || ""}
                        onChange={(e) => setThemeForm({...themeForm, faviconUrl: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="https://example.com/favicon.ico"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gaming-white">Footer Text</Label>
                    <Input
                      value={themeForm.footerText || ""}
                      onChange={(e) => setThemeForm({...themeForm, footerText: e.target.value})}
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                      placeholder="© 2025 VoltServers. All rights reserved."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Typography & Layout */}
              <Card className="bg-gaming-black-light border-gaming-green/30">
                <CardHeader>
                  <CardTitle className="text-gaming-white">Typography & Layout</CardTitle>
                  <CardDescription className="text-gaming-gray">
                    Font family and border radius settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gaming-white">Font Family</Label>
                      <Select value={themeForm.fontFamily || "Inter"} onValueChange={(value) => setThemeForm({...themeForm, fontFamily: value})}>
                        <SelectTrigger className="bg-gaming-black border-gaming-green/30 text-gaming-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gaming-black border-gaming-green/30">
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Open Sans">Open Sans</SelectItem>
                          <SelectItem value="Poppins">Poppins</SelectItem>
                          <SelectItem value="Montserrat">Montserrat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gaming-white">Border Radius</Label>
                      <Select value={themeForm.borderRadius || "Medium (8px)"} onValueChange={(value) => setThemeForm({...themeForm, borderRadius: value})}>
                        <SelectTrigger className="bg-gaming-black border-gaming-green/30 text-gaming-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gaming-black border-gaming-green/30">
                          <SelectItem value="None (0px)">None (0px)</SelectItem>
                          <SelectItem value="Small (4px)">Small (4px)</SelectItem>
                          <SelectItem value="Medium (8px)">Medium (8px)</SelectItem>
                          <SelectItem value="Large (12px)">Large (12px)</SelectItem>
                          <SelectItem value="XLarge (16px)">Extra Large (16px)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Holiday Themes */}
              <Card className="bg-gaming-black-light border-gaming-green/30">
                <CardHeader>
                  <CardTitle className="text-gaming-white">Holiday Themes</CardTitle>
                  <CardDescription className="text-gaming-gray">
                    Special seasonal themes and decorations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gaming-white">Special Theme</Label>
                    <Select value={themeForm.specialTheme || "None"} onValueChange={(value) => setThemeForm({...themeForm, specialTheme: value})}>
                      <SelectTrigger className="bg-gaming-black border-gaming-green/30 text-gaming-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gaming-black border-gaming-green/30">
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Halloween">Halloween</SelectItem>
                        <SelectItem value="Christmas">Christmas</SelectItem>
                        <SelectItem value="New Year">New Year</SelectItem>
                        <SelectItem value="Valentine">Valentine's Day</SelectItem>
                        <SelectItem value="Easter">Easter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media Links */}
              <Card className="bg-gaming-black-light border-gaming-green/30">
                <CardHeader>
                  <CardTitle className="text-gaming-white">Social Media Links</CardTitle>
                  <CardDescription className="text-gaming-gray">
                    Manage your social media presence and community links
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gaming-white">Discord Server</Label>
                      <Input
                        value={themeForm.discordUrl || ""}
                        onChange={(e) => setThemeForm({...themeForm, discordUrl: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="https://discord.gg/your-server"
                      />
                    </div>
                    <div>
                      <Label className="text-gaming-white">Twitter/X Profile</Label>
                      <Input
                        value={themeForm.twitterUrl || ""}
                        onChange={(e) => setThemeForm({...themeForm, twitterUrl: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="https://twitter.com/voltservers"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gaming-white">YouTube Channel</Label>
                      <Input
                        value={themeForm.youtubeUrl || ""}
                        onChange={(e) => setThemeForm({...themeForm, youtubeUrl: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="https://youtube.com/@voltservers"
                      />
                    </div>
                    <div>
                      <Label className="text-gaming-white">Reddit Community</Label>
                      <Input
                        value={themeForm.redditUrl || ""}
                        onChange={(e) => setThemeForm({...themeForm, redditUrl: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="https://reddit.com/r/voltservers"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gaming-white">Facebook Page</Label>
                      <Input
                        value={themeForm.facebookUrl || ""}
                        onChange={(e) => setThemeForm({...themeForm, facebookUrl: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="https://facebook.com/voltservers"
                      />
                    </div>
                    <div>
                      <Label className="text-gaming-white">Instagram Profile</Label>
                      <Input
                        value={themeForm.instagramUrl || ""}
                        onChange={(e) => setThemeForm({...themeForm, instagramUrl: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="https://instagram.com/voltservers"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gaming-white">TikTok Profile</Label>
                      <Input
                        value={themeForm.tiktokUrl || ""}
                        onChange={(e) => setThemeForm({...themeForm, tiktokUrl: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="https://tiktok.com/@voltservers"
                      />
                    </div>
                    <div>
                      <Label className="text-gaming-white">GitHub Repository</Label>
                      <Input
                        value={themeForm.githubUrl || ""}
                        onChange={(e) => setThemeForm({...themeForm, githubUrl: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="https://github.com/voltservers"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 pt-2">
                    <Switch
                      checked={themeForm.showSocialIcons || true}
                      onCheckedChange={(checked) => setThemeForm({...themeForm, showSocialIcons: checked})}
                    />
                    <Label className="text-gaming-white">Show Social Media Icons in Footer</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Open Graph & SEO Meta */}
              <Card className="bg-gaming-black-light border-gaming-green/30">
                <CardHeader>
                  <CardTitle className="text-gaming-white">Open Graph & Social Sharing</CardTitle>
                  <CardDescription className="text-gaming-gray">
                    Configure how your site appears when shared on social media
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gaming-white">Open Graph Title</Label>
                      <Input
                        value={themeForm.ogTitle || ""}
                        onChange={(e) => setThemeForm({...themeForm, ogTitle: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="Title for social sharing"
                      />
                    </div>
                    <div>
                      <Label className="text-gaming-white">Twitter Handle</Label>
                      <Input
                        value={themeForm.twitterHandle || ""}
                        onChange={(e) => setThemeForm({...themeForm, twitterHandle: e.target.value})}
                        className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                        placeholder="@voltservers"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gaming-white">Open Graph Description</Label>
                    <Textarea
                      value={themeForm.ogDescription || ""}
                      onChange={(e) => setThemeForm({...themeForm, ogDescription: e.target.value})}
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                      placeholder="Description for social media sharing"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label className="text-gaming-white">Open Graph Image URL</Label>
                    <Input
                      value={themeForm.ogImageUrl || ""}
                      onChange={(e) => setThemeForm({...themeForm, ogImageUrl: e.target.value})}
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                      placeholder="https://example.com/og-image.jpg"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Cookie Policy & GDPR */}
              <Card className="bg-gaming-black-light border-gaming-green/30">
                <CardHeader>
                  <CardTitle className="text-gaming-white">Cookie Policy & GDPR</CardTitle>
                  <CardDescription className="text-gaming-gray">
                    Cookie consent and privacy compliance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={themeForm.showCookieBanner || false}
                      onCheckedChange={(checked) => setThemeForm({...themeForm, showCookieBanner: checked})}
                    />
                    <Label className="text-gaming-white">Show Cookie Banner</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={themeForm.requireCookieConsent || false}
                      onCheckedChange={(checked) => setThemeForm({...themeForm, requireCookieConsent: checked})}
                    />
                    <Label className="text-gaming-white">Require Cookie Consent</Label>
                  </div>
                  <div>
                    <Label className="text-gaming-white">Cookie Policy Text</Label>
                    <Textarea
                      value={themeForm.cookiePolicyText || ""}
                      onChange={(e) => setThemeForm({...themeForm, cookiePolicyText: e.target.value})}
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                      placeholder="We use cookies to enhance your experience and analyze site traffic."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label className="text-gaming-white">Privacy Policy URL</Label>
                    <Input
                      value={themeForm.privacyPolicyUrl || ""}
                      onChange={(e) => setThemeForm({...themeForm, privacyPolicyUrl: e.target.value})}
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                      placeholder="/privacy-policy"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Customization */}
              <Card className="bg-gaming-black-light border-gaming-green/30">
                <CardHeader>
                  <CardTitle className="text-gaming-white">Advanced Customization</CardTitle>
                  <CardDescription className="text-gaming-gray">
                    Custom CSS and additional body code
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gaming-white">Custom CSS</Label>
                    <Textarea
                      value={themeForm.customCss || ""}
                      onChange={(e) => setThemeForm({...themeForm, customCss: e.target.value})}
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white font-mono text-sm"
                      placeholder="/* Add your custom CSS here */&#10;.custom-class {&#10;  background: linear-gradient(45deg, #00ff88, #00cc6a);&#10;}"
                      rows={8}
                    />
                  </div>
                  <div>
                    <Label className="text-gaming-white">Custom Body Code</Label>
                    <Textarea
                      value={themeForm.customBodyCode || ""}
                      onChange={(e) => setThemeForm({...themeForm, customBodyCode: e.target.value})}
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white font-mono text-sm"
                      placeholder="<!-- Custom scripts at end of body -->"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Site Management */}
              <Card className="bg-gaming-black-light border-gaming-green/30">
                <CardHeader>
                  <CardTitle className="text-gaming-white">Site Management</CardTitle>
                  <CardDescription className="text-gaming-gray">
                    Maintenance mode and announcement settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={themeForm.maintenanceMode || false}
                      onCheckedChange={(checked) => setThemeForm({...themeForm, maintenanceMode: checked})}
                    />
                    <Label className="text-gaming-white">Maintenance Mode</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={themeForm.showAnnouncementBanner || false}
                      onCheckedChange={(checked) => setThemeForm({...themeForm, showAnnouncementBanner: checked})}
                    />
                    <Label className="text-gaming-white">Show Announcement Banner</Label>
                  </div>
                  <div>
                    <Label className="text-gaming-white">Maintenance Message</Label>
                    <Textarea
                      value={themeForm.maintenanceMessage}
                      onChange={(e) => setThemeForm({...themeForm, maintenanceMessage: e.target.value})}
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                      placeholder="We're currently performing maintenance..."
                      rows={2}
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={themeForm.showAnnouncementBanner}
                      onCheckedChange={(checked) => setThemeForm({...themeForm, showAnnouncementBanner: checked})}
                    />
                    <Label className="text-gaming-white">Show Announcement Banner</Label>
                  </div>
                  <div>
                    <Label className="text-gaming-white">Announcement Text</Label>
                    <Input
                      value={themeForm.announcementBanner}
                      onChange={(e) => setThemeForm({...themeForm, announcementBanner: e.target.value})}
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white"
                      placeholder="New features available now!"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Settings */}
              <Card className="bg-gaming-black-light border-gaming-green/30">
                <CardHeader>
                  <CardTitle className="text-gaming-white">Advanced Settings</CardTitle>
                  <CardDescription className="text-gaming-gray">
                    Custom CSS and additional customizations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gaming-white">Holiday Theme</Label>
                    <Select value={themeForm.holidayTheme} onValueChange={(value) => setThemeForm({...themeForm, holidayTheme: value})}>
                      <SelectTrigger className="bg-gaming-black border-gaming-green/30 text-gaming-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="snow">Snow Effect</SelectItem>
                        <SelectItem value="green-snow">🟢 Green Snow</SelectItem>
                        <SelectItem value="bolts">⚡ VoltServers Bolts</SelectItem>
                        <SelectItem value="halloween">Halloween</SelectItem>
                        <SelectItem value="christmas">Christmas</SelectItem>
                        <SelectItem value="easter">Easter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gaming-white">Custom CSS</Label>
                    <Textarea
                      value={themeForm.customCss}
                      onChange={(e) => setThemeForm({...themeForm, customCss: e.target.value})}
                      className="bg-gaming-black border-gaming-green/30 text-gaming-white font-mono text-sm"
                      placeholder=".custom-class { color: #00cc6a; }"
                      rows={6}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.open('/', '_blank')}
                  className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-black"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Site
                </Button>
                <Button 
                  onClick={() => updateThemeMutation.mutate(themeForm)}
                  className="bg-gaming-green text-black hover:bg-gaming-green/90"
                  disabled={updateThemeMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateThemeMutation.isPending ? 'Saving...' : 'Save Theme Settings'}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Status & Incidents Tab */}
          <TabsContent value="incidents" className="space-y-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gaming-white mb-2">Status & Incidents Management</h2>
                  <p className="text-gaming-gray">Manage service status and incident reports for your status page</p>
                </div>
                <Button 
                  onClick={() => setIsCreateIncidentOpen(true)}
                  className="bg-gaming-green text-black hover:bg-gaming-green/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Incident
                </Button>
              </div>

              {/* Current Incidents */}
              <Card className="bg-gaming-black-light border-gaming-green/30">
                <CardHeader>
                  <CardTitle className="text-gaming-white">Active Incidents</CardTitle>
                  <CardDescription className="text-gaming-gray">
                    Current ongoing service issues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {incidents.filter((incident: any) => !incident.isResolved).length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gaming-green/20 rounded-full flex items-center justify-center">
                          <Zap className="w-8 h-8 text-gaming-green" />
                        </div>
                        <p className="text-gaming-gray mb-2">All systems operational</p>
                        <p className="text-sm text-gaming-gray/70">No active incidents to display</p>
                      </div>
                    ) : (
                      incidents.filter((incident: any) => !incident.isResolved).map((incident: any) => (
                        <div key={incident.id} className="border border-gaming-green/30 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-gaming-white font-semibold">{incident.title}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant={incident.severity === 'critical' ? 'destructive' : incident.severity === 'major' ? 'secondary' : 'default'}>
                                {incident.severity}
                              </Badge>
                              <Badge variant={incident.status === 'resolved' ? 'default' : 'secondary'}>
                                {incident.status}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => editIncident(incident)}
                                className="text-gaming-green hover:text-gaming-green/80"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-gaming-gray text-sm mb-2">{incident.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gaming-gray/70">
                            <span>Started: {new Date(incident.startTime).toLocaleString()}</span>
                            {incident.affectedServices?.length > 0 && (
                              <span>Services: {incident.affectedServices.join(', ')}</span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Resolved Incidents */}
              <Card className="bg-gaming-black-light border-gaming-green/30">
                <CardHeader>
                  <CardTitle className="text-gaming-white">Recent Resolved Incidents</CardTitle>
                  <CardDescription className="text-gaming-gray">
                    Previously resolved issues (last 30 days)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {incidents.filter((incident: any) => incident.isResolved).length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-gaming-gray text-sm">No recent incidents</p>
                      </div>
                    ) : (
                      incidents.filter((incident: any) => incident.isResolved).slice(0, 5).map((incident: any) => (
                        <div key={incident.id} className="border border-gaming-green/20 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-gaming-white text-sm font-medium">{incident.title}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {incident.severity}
                              </Badge>
                              <Badge variant="default" className="text-xs">
                                resolved
                              </Badge>
                            </div>
                          </div>
                          <p className="text-gaming-gray text-xs mb-2">{incident.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gaming-gray/50">
                            <span>Duration: {incident.endTime ? 
                              Math.round((new Date(incident.endTime) - new Date(incident.startTime)) / (1000 * 60)) + ' minutes' 
                              : 'Unknown'}</span>
                            <span>Resolved: {incident.endTime ? new Date(incident.endTime).toLocaleString() : 'N/A'}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}