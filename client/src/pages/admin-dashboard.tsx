import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Eye
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
  const { toast } = useToast();
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

  // Statistics
  const stats = {
    totalGames: games.length,
    totalPosts: blogs.length,
    activeServers: demoServers.filter((server: any) => server.isOnline !== false).length,
    totalPlayers: demoServers.reduce((sum: number, server: any) => sum + (server.playerCount || 0), 0)
  };

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
            <TabsTrigger value="settings" className="data-[state=active]:bg-gaming-green data-[state=active]:text-black">
              <Settings className="w-4 h-4 mr-2" />
              Settings
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

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-gaming-black-light border-gaming-green/30">
              <CardHeader>
                <CardTitle className="text-gaming-white">Site Settings</CardTitle>
                <CardDescription className="text-gaming-gray">
                  Basic site configuration and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-gaming-white">
                    <h3 className="text-lg font-medium mb-2">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        onClick={() => window.open('/', '_blank')}
                        className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-black justify-start"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Site
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setLocation('/admin/theme')}
                        className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-black justify-start"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Theme Settings
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gaming-green/20 pt-6">
                    <h3 className="text-gaming-white text-lg font-medium mb-4">System Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gaming-gray">Total Games:</span>
                        <span className="text-gaming-white ml-2">{stats.totalGames}</span>
                      </div>
                      <div>
                        <span className="text-gaming-gray">Blog Posts:</span>
                        <span className="text-gaming-white ml-2">{stats.totalPosts}</span>
                      </div>
                      <div>
                        <span className="text-gaming-gray">Demo Servers:</span>
                        <span className="text-gaming-white ml-2">{stats.activeServers}</span>
                      </div>
                      <div>
                        <span className="text-gaming-gray">Online Players:</span>
                        <span className="text-gaming-white ml-2">{stats.totalPlayers}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}