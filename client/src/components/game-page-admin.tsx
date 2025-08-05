import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save,
  X,
  BookOpen,
  Tag
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Game, BlogPost } from "@shared/schema";

interface GamePageCustomization {
  gameId: string;
  relatedArticles: string[];
  customSections: Array<{
    title: string;
    content: string;
    order: number;
  }>;
}

export default function GamePageAdmin() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [customization, setCustomization] = useState<GamePageCustomization>({
    gameId: "",
    relatedArticles: [],
    customSections: []
  });
  const [newSection, setNewSection] = useState({ title: "", content: "" });
  const [showAddSection, setShowAddSection] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch games
  const { data: games = [] } = useQuery<Game[]>({
    queryKey: ["/api/games"],
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Fetch blog posts for related articles selection
  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  // Fetch customization data for selected game
  const { data: gameCustomization } = useQuery({
    queryKey: ["/api/admin/game-pages", selectedGame?.id],
    queryFn: async () => {
      if (!selectedGame) return null;
      const response = await fetch(`/api/admin/game-pages/${selectedGame.id}`);
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!selectedGame,
  });

  // Update customization when data is loaded
  useEffect(() => {
    if (gameCustomization && selectedGame) {
      setCustomization({
        gameId: selectedGame.id,
        relatedArticles: gameCustomization.relatedArticles || [],
        customSections: gameCustomization.customSections || []
      });
    } else if (selectedGame) {
      setCustomization({
        gameId: selectedGame.id,
        relatedArticles: [],
        customSections: []
      });
    }
  }, [gameCustomization, selectedGame]);

  const saveCustomizationMutation = useMutation({
    mutationFn: (data: GamePageCustomization) => 
      apiRequest(`/api/admin/game-pages/${data.gameId}`, { 
        method: "PUT", 
        body: JSON.stringify(data) 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/game-pages"] });
      toast({ title: "Game page customization saved successfully!" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to save customization", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });

  const handleSaveCustomization = () => {
    if (!selectedGame) return;
    saveCustomizationMutation.mutate(customization);
  };

  const addRelatedArticle = (articleSlug: string) => {
    if (!customization.relatedArticles.includes(articleSlug)) {
      setCustomization(prev => ({
        ...prev,
        relatedArticles: [...prev.relatedArticles, articleSlug]
      }));
    }
  };

  const removeRelatedArticle = (articleSlug: string) => {
    setCustomization(prev => ({
      ...prev,
      relatedArticles: prev.relatedArticles.filter(slug => slug !== articleSlug)
    }));
  };

  const addCustomSection = () => {
    if (!newSection.title || !newSection.content) return;
    
    setCustomization(prev => ({
      ...prev,
      customSections: [...prev.customSections, {
        ...newSection,
        order: prev.customSections.length
      }]
    }));
    
    setNewSection({ title: "", content: "" });
    setShowAddSection(false);
  };

  const removeCustomSection = (index: number) => {
    setCustomization(prev => ({
      ...prev,
      customSections: prev.customSections.filter((_, i) => i !== index)
    }));
  };

  const availableArticles = blogPosts.filter(post => 
    post.isPublished && !customization.relatedArticles.includes(post.slug)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gaming-white">Game Page Customization</h2>
      </div>

      {/* Game Selection */}
      <Card className="bg-gaming-black-lighter border-gaming-black-lighter">
        <CardHeader>
          <CardTitle className="text-gaming-white">Select Game to Customize</CardTitle>
          <CardDescription className="text-gaming-gray">
            Choose a game to customize its page content and related articles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {games.map((game) => (
              <Card 
                key={game.id}
                className={`cursor-pointer transition-all ${
                  selectedGame?.id === game.id 
                    ? 'border-gaming-green bg-gaming-green/10' 
                    : 'border-gaming-black-light hover:border-gaming-green/50'
                }`}
                onClick={() => setSelectedGame(game)}
              >
                <CardContent className="p-4">
                  <img 
                    src={game.imageUrl} 
                    alt={game.name}
                    className="w-full h-20 object-cover rounded mb-2"
                  />
                  <h3 className="text-gaming-white font-semibold text-sm">{game.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedGame && (
        <>
          {/* Related Articles Management */}
          <Card className="bg-gaming-black-lighter border-gaming-black-lighter">
            <CardHeader>
              <CardTitle className="text-gaming-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gaming-green" />
                Related Articles for {selectedGame.name}
              </CardTitle>
              <CardDescription className="text-gaming-gray">
                Select blog articles to display on the {selectedGame.name} game page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Currently Selected Articles */}
              {customization.relatedArticles.length > 0 && (
                <div>
                  <Label className="text-gaming-white mb-2 block">Selected Articles</Label>
                  <div className="flex flex-wrap gap-2">
                    {customization.relatedArticles.map((slug) => {
                      const article = blogPosts.find(post => post.slug === slug);
                      return article ? (
                        <Badge 
                          key={slug}
                          className="bg-gaming-green text-gaming-black flex items-center gap-1"
                        >
                          {article.title}
                          <X 
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => removeRelatedArticle(slug)}
                          />
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Available Articles */}
              {availableArticles.length > 0 && (
                <div>
                  <Label className="text-gaming-white mb-2 block">Available Articles</Label>
                  <div className="grid md:grid-cols-2 gap-2">
                    {availableArticles.slice(0, 6).map((article) => (
                      <Card 
                        key={article.id}
                        className="bg-gaming-black border-gaming-black-light hover:border-gaming-green/50 cursor-pointer"
                        onClick={() => addRelatedArticle(article.slug)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gaming-green/20 rounded flex items-center justify-center">
                              <BookOpen className="w-4 h-4 text-gaming-green" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-gaming-white text-sm font-medium truncate">
                                {article.title}
                              </h4>
                              <p className="text-gaming-gray text-xs truncate">
                                {article.tags.join(", ")}
                              </p>
                            </div>
                            <Plus className="w-4 h-4 text-gaming-green" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Custom Sections Management */}
          <Card className="bg-gaming-black-lighter border-gaming-black-lighter">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-gaming-white">Custom Sections</CardTitle>
                <CardDescription className="text-gaming-gray">
                  Add custom content sections to the {selectedGame.name} page
                </CardDescription>
              </div>
              <Button
                onClick={() => setShowAddSection(true)}
                className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Custom Sections */}
              {customization.customSections.map((section, index) => (
                <Card key={index} className="bg-gaming-black border-gaming-black-light">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-gaming-white font-semibold">{section.title}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomSection(index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-gaming-gray text-sm">{section.content}</p>
                  </CardContent>
                </Card>
              ))}

              {/* Add New Section Form */}
              {showAddSection && (
                <Card className="bg-gaming-black border-gaming-green">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-gaming-white font-semibold">Add New Section</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAddSection(false)}
                        className="text-gaming-gray"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="section-title" className="text-gaming-white">Section Title</Label>
                        <Input
                          id="section-title"
                          value={newSection.title}
                          onChange={(e) => setNewSection(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter section title"
                          className="bg-gaming-black-light border-gaming-black-light text-gaming-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="section-content" className="text-gaming-white">Section Content</Label>
                        <Textarea
                          id="section-content"
                          value={newSection.content}
                          onChange={(e) => setNewSection(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Enter section content"
                          rows={4}
                          className="bg-gaming-black-light border-gaming-black-light text-gaming-white"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={addCustomSection}
                          className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Add Section
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowAddSection(false)}
                          className="border-gaming-gray text-gaming-gray"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Save Changes */}
          <div className="flex justify-center">
            <Button
              onClick={handleSaveCustomization}
              disabled={saveCustomizationMutation.isPending}
              className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black font-semibold px-8"
            >
              <Save className="w-4 h-4 mr-2" />
              {saveCustomizationMutation.isPending ? "Saving..." : "Save All Changes"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}