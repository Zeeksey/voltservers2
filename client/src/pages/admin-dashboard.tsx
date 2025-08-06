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
  Cookie,
  Zap,
  HelpCircle,
  DollarSign
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
  const [editingFaqCategory, setEditingFaqCategory] = useState<any>(null);
  const [editingFaqItem, setEditingFaqItem] = useState<any>(null);
  const [faqCategoryForm, setFaqCategoryForm] = useState({
    title: "",
    slug: "",
    description: "",
    sortOrder: "0",
    isVisible: true
  });
  const [faqItemForm, setFaqItemForm] = useState({
    categoryId: "",
    question: "",
    answer: "",
    sortOrder: "0",
    isVisible: true,
    tags: ""
  });
  const [gameForm, setGameForm] = useState({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    basePrice: "",
    playerCount: "0",
    isPopular: false,
    isNew: false,
    isTrending: false,
    features: "",
    heroSubtitle: "",
    category: "survival",
    minRam: "2GB",
    recommendedRam: "4GB", 
    setupComplexity: "Easy"
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

  const [demoServerForm, setDemoServerForm] = useState({
    serverName: "",
    gameId: "",
    host: "",
    port: "",
    playerCount: "0",
    maxPlayers: "100",
    isOnline: true,
    version: "",
    description: "",
    location: "",
    playtime: ""
  });

  const [editingDemoServer, setEditingDemoServer] = useState<any>(null);
  
  // Pricing plan management state
  const [pricingPlanForm, setPricingPlanForm] = useState({
    gameId: "",
    name: "",
    description: "",
    players: "",
    ram: "",
    storage: "",
    monthlyPrice: "",
    biannualPrice: "",
    annualPrice: "",
    isPopular: false,
    features: ""
  });
  const [editingPricingPlan, setEditingPricingPlan] = useState<any>(null);
  const [showPricingPlanForm, setShowPricingPlanForm] = useState(false);
  
  // Theme customization state
  const [themeForm, setThemeForm] = useState({
    siteName: "VoltServers",
    siteTagline: "Premium Game Server Hosting",
    siteDescription: "Professional game server hosting with 24/7 support and premium hardware",
    heroTitle: "Deploy Your Game Server in Minutes",
    heroSubtitle: "Experience lightning-fast deployment with our premium game server hosting platform", 
    heroDescription: "Join thousands of gamers who trust our reliable infrastructure for their Minecraft, CS2, Rust, and other game servers.",
    heroButtonText: "Get Started",
    heroButtonUrl: "/pricing",
    // CTA Section
    ctaBadgeText: "Limited Time: 30% Off First Month",
    ctaTitle: "Ready to Level Up Your Game Server?",
    ctaDescription: "Join over 50,000 players worldwide. Get your game server online in under 60 seconds with our enterprise-grade infrastructure and 24/7 expert support.",
    ctaPrimaryButtonText: "Get Started Today",
    ctaPrimaryButtonUrl: "/games",
    ctaSecondaryButtonText: "View Live Demo", 
    ctaSecondaryButtonUrl: "/minecraft-tools",
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

  // FAQ queries
  const { data: faqCategories = [] } = useQuery({
    queryKey: ["/api/faqs"],
  });

  const faqCategoryMutation = useMutation({
    mutationFn: async (faqCategory: any) => {
      const url = editingFaqCategory 
        ? `/api/admin/faq-categories/${editingFaqCategory.id}`
        : '/api/admin/faq-categories';
      const method = editingFaqCategory ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faqCategory),
      });
      
      if (!response.ok) throw new Error('Failed to save FAQ category');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faqs"] });
      setFaqCategoryForm({
        title: "",
        slug: "",
        description: "",
        sortOrder: "0",
        isVisible: true
      });
      setEditingFaqCategory(null);
      toast({
        title: "Success",
        description: `FAQ category ${editingFaqCategory ? 'updated' : 'created'} successfully`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${editingFaqCategory ? 'update' : 'create'} FAQ category`,
        variant: "destructive",
      });
    },
  });

  // Pricing plan mutation
  const pricingPlanMutation = useMutation({
    mutationFn: async (planData: any) => {
      const url = editingPricingPlan 
        ? `/api/admin/pricing-plans/${editingPricingPlan.id}`
        : '/api/admin/pricing-plans';
      const method = editingPricingPlan ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...planData,
          players: parseInt(planData.players),
          monthlyPrice: parseFloat(planData.monthlyPrice),
          biannualPrice: parseFloat(planData.biannualPrice),
          annualPrice: parseFloat(planData.annualPrice),
          features: planData.features.split(',').map((f: string) => f.trim()).filter(Boolean)
        })
      });
      
      if (!response.ok) throw new Error('Failed to save pricing plan');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      setPricingPlanForm({
        gameId: "",
        name: "",
        description: "",
        players: "",
        ram: "",
        storage: "",
        monthlyPrice: "",
        biannualPrice: "",
        annualPrice: "",
        isPopular: false,
        features: ""
      });
      setEditingPricingPlan(null);
      setShowPricingPlanForm(false);
      toast({
        title: "Success",
        description: `Pricing plan ${editingPricingPlan ? 'updated' : 'created'} successfully`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${editingPricingPlan ? 'update' : 'create'} pricing plan`,
        variant: "destructive",
      });
    },
  });

  const faqItemMutation = useMutation({
    mutationFn: async (faqItem: any) => {
      const url = editingFaqItem 
        ? `/api/admin/faq-items/${editingFaqItem.id}`
        : '/api/admin/faq-items';
      const method = editingFaqItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...faqItem,
          tags: faqItem.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
        })
      });
      
      if (!response.ok) throw new Error('Failed to save FAQ item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faqs"] });
      setFaqItemForm({
        categoryId: "",
        question: "",
        answer: "",
        sortOrder: "0",
        isVisible: true,
        tags: ""
      });
      setEditingFaqItem(null);
      toast({
        title: "Success",
        description: `FAQ item ${editingFaqItem ? 'updated' : 'created'} successfully`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${editingFaqItem ? 'update' : 'create'} FAQ item`,
        variant: "destructive",
      });
    },
  });

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
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
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

  const { data: demoServers = [] } = useQuery({
    queryKey: ['/api/demo-servers'],
    queryFn: () => apiRequest("/api/demo-servers"),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const { data: themeSettings } = useQuery({
    queryKey: ["/api/theme-settings"],
    queryFn: () => apiRequest("/api/theme-settings"),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Initialize server location pings with static data
  useEffect(() => {
    if (serverLocations.length === 0) return;

    // Set static ping values for each location to avoid network issues
    serverLocations.forEach((location: any) => {
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

  // Update theme form when data loads
  useEffect(() => {
    if (themeSettings) {
      setThemeForm({
        siteName: themeSettings.siteName || "VoltServers",
        siteTagline: themeSettings.siteTagline || "Premium Game Server Hosting",
        siteDescription: themeSettings.siteDescription || "Professional game server hosting with 24/7 support and premium hardware",
        heroTitle: themeSettings.heroTitle || "Deploy Your Game Server in Minutes",
        heroSubtitle: themeSettings.heroSubtitle || "Experience lightning-fast deployment with our premium game server hosting platform", 
        heroDescription: themeSettings.heroDescription || "Join thousands of gamers who trust our reliable infrastructure for their Minecraft, CS2, Rust, and other game servers.",
        heroButtonText: themeSettings.heroButtonText || "Get Started",
        heroButtonUrl: themeSettings.heroButtonUrl || "/pricing",
        // CTA Section
        ctaBadgeText: themeSettings.ctaBadgeText || "Limited Time: 30% Off First Month",
        ctaTitle: themeSettings.ctaTitle || "Ready to Level Up Your Game Server?",
        ctaDescription: themeSettings.ctaDescription || "Join over 50,000 players worldwide. Get your game server online in under 60 seconds with our enterprise-grade infrastructure and 24/7 expert support.",
        ctaPrimaryButtonText: themeSettings.ctaPrimaryButtonText || "Get Started Today",
        ctaPrimaryButtonUrl: themeSettings.ctaPrimaryButtonUrl || "/games",
        ctaSecondaryButtonText: themeSettings.ctaSecondaryButtonText || "View Live Demo", 
        ctaSecondaryButtonUrl: themeSettings.ctaSecondaryButtonUrl || "/minecraft-tools",
        primaryColor: themeSettings.primaryColor || "#00ff88",
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
        showCookieBanner: themeSettings.showCookieBanner !== undefined ? themeSettings.showCookieBanner : true,
        cookieConsentRequired: themeSettings.cookieConsentRequired !== undefined ? themeSettings.cookieConsentRequired : true,
        cookiePolicyText: themeSettings.cookiePolicyText || "We use cookies to enhance your experience and analyze site traffic.",
        cookiePolicyUrl: themeSettings.cookiePolicyUrl || "/privacy-policy",
        cookieCategories: themeSettings.cookieCategories || JSON.stringify([
          { id: "necessary", name: "Necessary", description: "Essential for website functionality", required: true },
          { id: "analytics", name: "Analytics", description: "Help us understand how visitors use our site", required: false },
          { id: "marketing", name: "Marketing", description: "Used to deliver relevant advertisements", required: false }
        ], null, 2)
      });
    }
  }, [themeSettings]);

  // Mutations
  const createGameMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/admin/games", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      // Use proper cache invalidation to prevent flashing
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      // Immediately refetch to ensure smooth update
      queryClient.refetchQueries({ queryKey: ["/api/games"] });
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
      // Use proper cache invalidation to prevent flashing  
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      // Immediately refetch to ensure smooth update
      queryClient.refetchQueries({ queryKey: ["/api/games"] });
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
      // Use proper cache invalidation to prevent flashing
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      // Immediately refetch to ensure smooth update
      queryClient.refetchQueries({ queryKey: ["/api/games"] });
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
      queryClient.invalidateQueries({ queryKey: ["/api/theme-settings"] }); // Invalidate public endpoint too
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

  // Demo server mutations
  const createDemoServerMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/admin/demo-servers", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/demo-servers"] });
      resetDemoServerForm();
      toast({ title: "Demo server created successfully!" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create demo server", description: error.message, variant: "destructive" });
    },
  });

  const updateDemoServerMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiRequest(`/api/admin/demo-servers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/demo-servers"] });
      resetDemoServerForm();
      toast({ title: "Demo server updated successfully!" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update demo server", description: error.message, variant: "destructive" });
    },
  });

  const deleteDemoServerMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/admin/demo-servers/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/demo-servers"] });
      toast({ title: "Demo server deleted successfully!" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete demo server", description: error.message, variant: "destructive" });
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
      isTrending: false,
      features: "",
      heroSubtitle: "",
      category: "survival",
      minRam: "2GB",
      recommendedRam: "4GB",
      setupComplexity: "Easy"
    });
    setEditingGame(null);
  };

  // Game template system
  const gameTemplates = {
    minecraft: {
      name: "Minecraft Java Edition",
      slug: "minecraft-java",
      description: "The classic Minecraft experience with unlimited potential for creativity and adventure.",
      heroSubtitle: "Build, explore, and survive in the ultimate sandbox world",
      category: "sandbox",
      basePrice: "5.99",
      playerCount: "50000",
      minRam: "2GB",
      recommendedRam: "4GB",
      setupComplexity: "Easy",
      features: "Unlimited Players\nPlugin Support\nMod Support\nFull Control Panel\n24/7 Support\nAutomatic Backups"
    },
    rust: {
      name: "Rust",
      slug: "rust",
      description: "Survive, build, and thrive in the ultimate survival multiplayer experience.",
      heroSubtitle: "Forge alliances and survive in a harsh, unforgiving world",
      category: "survival",
      basePrice: "12.99",
      playerCount: "25000", 
      minRam: "4GB",
      recommendedRam: "8GB",
      setupComplexity: "Medium",
      features: "Up to 300 Players\nOxide Plugin Support\nAdmin Tools\nAutomatic Updates\nRCON Access\nCustom Maps"
    },
    ark: {
      name: "ARK: Survival Evolved",
      slug: "ark",
      description: "Tame dinosaurs and build your tribe in this prehistoric survival adventure.",
      heroSubtitle: "Survive and thrive in a world full of dinosaurs",
      category: "survival",
      basePrice: "15.99",
      playerCount: "15000",
      minRam: "6GB",
      recommendedRam: "12GB",
      setupComplexity: "Hard",
      features: "Dinosaur Taming\nTribe System\nCustom Maps\nMod Support\nCluster Support\nAdmin Tools"
    },
    valheim: {
      name: "Valheim",
      slug: "valheim",
      description: "Explore and survive in a Norse mythology-inspired world with friends.",
      heroSubtitle: "Prove your worth to the gods in Viking purgatory",
      category: "survival",
      basePrice: "8.99",
      playerCount: "12000",
      minRam: "4GB",
      recommendedRam: "6GB",
      setupComplexity: "Easy",
      features: "Co-op Gameplay\nWorld Seed Control\nBackup System\nMod Support\nDedicated Server\nPvP Options"
    },
    csgo: {
      name: "Counter-Strike 2",
      slug: "cs2",
      description: "The legendary tactical FPS returns with enhanced graphics and gameplay.",
      heroSubtitle: "Master the art of tactical combat",
      category: "fps",
      basePrice: "9.99",
      playerCount: "30000",
      minRam: "2GB",
      recommendedRam: "4GB",
      setupComplexity: "Medium",
      features: "Custom Maps\nPlugin Support\nAnti-Cheat\nRank System\nMatch Making\nDemo Recording"
    }
  };

  const applyGameTemplate = (templateKey: string) => {
    const template = gameTemplates[templateKey as keyof typeof gameTemplates];
    if (template) {
      setGameForm({
        ...gameForm,
        ...template,
        imageUrl: `/images/games/${template.slug}.svg`
      });
    }
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

  const resetDemoServerForm = () => {
    setDemoServerForm({
      serverName: "",
      gameId: "",
      host: "",
      port: "",
      playerCount: "0",
      maxPlayers: "100",
      isOnline: true,
      version: "",
      description: "",
      location: "",
      playtime: ""
    });
    setEditingDemoServer(null);
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
      isTrending: game.isTrending,
      features: Array.isArray(game.features) ? game.features.join('\n') : '',
      heroSubtitle: game.heroSubtitle || '',
      category: game.category || 'survival',
      minRam: game.minRam || '2GB',
      recommendedRam: game.recommendedRam || '4GB',
      setupComplexity: game.setupComplexity || 'Easy'
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

  const handlePricingPlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pricingPlanForm.gameId || !pricingPlanForm.name) {
      toast({
        title: "Error",
        description: "Please select a game and enter a plan name",
        variant: "destructive",
      });
      return;
    }
    pricingPlanMutation.mutate(pricingPlanForm);
  };

  const handleEditDemoServer = (server: any) => {
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
    setEditingDemoServer(server);
  };

  const handleGameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure proper image URL fallback for new games
    let imageUrl = gameForm.imageUrl;
    if (!imageUrl && gameForm.slug) {
      // Set default image based on game slug
      imageUrl = `/images/games/${gameForm.slug}.svg`;
    } else if (!imageUrl) {
      // Ultimate fallback to default game icon
      imageUrl = `/images/games/default.svg`;
    }
    
    const data = {
      ...gameForm,
      imageUrl,
      basePrice: gameForm.basePrice,
      playerCount: parseInt(gameForm.playerCount),
      features: gameForm.features.split('\n').filter(f => f.trim()),
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

  const handleDemoServerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
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
      updateDemoServerMutation.mutate({ id: editingDemoServer.id, data });
    } else {
      createDemoServerMutation.mutate(data);
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

  const handleFaqCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    faqCategoryMutation.mutate({
      ...faqCategoryForm,
      sortOrder: parseInt(faqCategoryForm.sortOrder)
    });
  };

  const handleFaqItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    faqItemMutation.mutate({
      ...faqItemForm,
      sortOrder: parseInt(faqItemForm.sortOrder)
    });
  };

  const handleEditFaqCategory = (category: any) => {
    setEditingFaqCategory(category);
    setFaqCategoryForm({
      title: category.title,
      slug: category.slug,
      description: category.description || "",
      sortOrder: category.sortOrder.toString(),
      isVisible: category.isVisible
    });
  };

  const handleEditFaqItem = (item: any) => {
    setEditingFaqItem(item);
    setFaqItemForm({
      categoryId: item.categoryId,
      question: item.question,
      answer: item.answer,
      sortOrder: item.sortOrder.toString(),
      isVisible: item.isVisible,
      tags: (item.tags || []).join(', ')
    });
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
            <TabsTrigger value="faq" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black text-xs sm:text-sm p-2 sm:p-3">
              <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="pricing" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black text-xs sm:text-sm p-2 sm:p-3">
              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Pricing</span>
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
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gaming-green">
                      {editingGame ? "Edit Game" : "Add New Game"}
                    </CardTitle>
                    {editingGame && (
                      <Button
                        variant="outline" 
                        size="sm"
                        onClick={resetGameForm}
                        className="border-gaming-green/30 text-gaming-green hover:bg-gaming-green/10"
                      >
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                  {!editingGame && (
                    <div className="pt-4">
                      <Label className="text-gray-300 mb-2 block">Quick Start Templates</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
                        {Object.entries(gameTemplates).map(([key, template]) => (
                          <Button
                            key={key}
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => applyGameTemplate(key)}
                            className="border-gaming-blue/30 text-gaming-blue hover:bg-gaming-blue/10 text-xs p-2"
                          >
                            {template.name.split(' ')[0]}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
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
                        placeholder="https://example.com/game-image.png or /images/games/game.svg"
                        required
                      />
                      {gameForm.imageUrl && (
                        <div className="mt-2">
                          <img 
                            src={gameForm.imageUrl} 
                            alt="Game image preview" 
                            className="max-h-20 w-auto rounded border border-gaming-green/20 object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
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
                    
                    <div>
                      <Label className="text-gray-300">Hero Subtitle</Label>
                      <Textarea
                        value={gameForm.heroSubtitle}
                        onChange={(e) => setGameForm({...gameForm, heroSubtitle: e.target.value})}
                        className="admin-textarea"
                        placeholder="Engaging subtitle for the game hero section"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300">Game Features</Label>
                      <Textarea
                        value={gameForm.features}
                        onChange={(e) => setGameForm({...gameForm, features: e.target.value})}
                        className="admin-textarea"
                        placeholder="Enter features, one per line"
                        rows={5}
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter each feature on a new line</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-gray-300">Category</Label>
                        <Select value={gameForm.category} onValueChange={(value) => setGameForm({...gameForm, category: value})}>
                          <SelectTrigger className="admin-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sandbox">Sandbox</SelectItem>
                            <SelectItem value="survival">Survival</SelectItem>
                            <SelectItem value="fps">FPS</SelectItem>
                            <SelectItem value="mmo">MMO</SelectItem>
                            <SelectItem value="strategy">Strategy</SelectItem>
                            <SelectItem value="racing">Racing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-gray-300">Min RAM</Label>
                        <Select value={gameForm.minRam} onValueChange={(value) => setGameForm({...gameForm, minRam: value})}>
                          <SelectTrigger className="admin-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1GB">1GB</SelectItem>
                            <SelectItem value="2GB">2GB</SelectItem>
                            <SelectItem value="4GB">4GB</SelectItem>
                            <SelectItem value="6GB">6GB</SelectItem>
                            <SelectItem value="8GB">8GB</SelectItem>
                            <SelectItem value="16GB">16GB</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-gray-300">Recommended RAM</Label>
                        <Select value={gameForm.recommendedRam} onValueChange={(value) => setGameForm({...gameForm, recommendedRam: value})}>
                          <SelectTrigger className="admin-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2GB">2GB</SelectItem>
                            <SelectItem value="4GB">4GB</SelectItem>
                            <SelectItem value="6GB">6GB</SelectItem>
                            <SelectItem value="8GB">8GB</SelectItem>
                            <SelectItem value="12GB">12GB</SelectItem>
                            <SelectItem value="16GB">16GB</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300">Setup Complexity</Label>
                      <Select value={gameForm.setupComplexity} onValueChange={(value) => setGameForm({...gameForm, setupComplexity: value})}>
                        <SelectTrigger className="admin-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
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
{!editingGame && (
                        <div className="bg-gaming-blue/10 border border-gaming-blue/20 rounded-lg p-3 mt-4">
                          <h4 className="text-gaming-blue font-semibold text-sm mb-2">How to Create a Complete Game Page:</h4>
                          <ol className="text-xs text-gray-300 space-y-1">
                            <li>1. Fill out the form above and click "Create Game"</li>
                            <li>2. Once created, click the Settings button (⚙️) next to your game</li>
                            <li>3. Customize all page sections: Hero, Features, Pricing, FAQ, etc.</li>
                            <li>4. Your game page will be live at /games/your-game-slug</li>
                          </ol>
                        </div>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Games List */}
              <Card className="bg-gaming-dark border-gaming-green/20 admin-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gaming-green">Existing Games ({games.length})</CardTitle>
                    <div className="text-xs text-gray-400">
                      Edit: Game details • Settings: Page content • Delete: Remove game
                    </div>
                  </div>
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
                              title="Customize Game Page"
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

          {/* Pricing Plans Management */}
          <TabsContent value="pricing" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {/* Pricing Plan Form */}
              <Card className="bg-gaming-dark border-gaming-green/20 admin-card">
                <CardHeader>
                  <CardTitle className="text-gaming-green">Pricing Plan Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Select Game</Label>
                    <select 
                      className="admin-input w-full" 
                      onChange={(e) => {
                        // Handle game selection for pricing management
                        console.log('Selected game:', e.target.value);
                      }}
                    >
                      <option value="">Choose a game...</option>
                      {games.map((game: Game) => (
                        <option key={game.id} value={game.id}>{game.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-4 p-4 bg-gaming-black-lighter rounded-lg">
                    <h4 className="text-gaming-green font-semibold">Add Pricing Plan</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Plan Name</Label>
                        <Input className="admin-input" placeholder="Starter Plan" />
                      </div>
                      <div>
                        <Label className="text-gray-300">Players</Label>
                        <Input className="admin-input" placeholder="10" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-gray-300">Monthly Price ($)</Label>
                        <Input className="admin-input" placeholder="9.99" />
                      </div>
                      <div>
                        <Label className="text-gray-300">6-Month Price ($)</Label>
                        <Input className="admin-input" placeholder="49.99" />
                        <p className="text-xs text-gaming-green font-medium mt-1">Save 16%</p>
                      </div>
                      <div>
                        <Label className="text-gray-300">Annual Price ($)</Label>
                        <Input className="admin-input" placeholder="89.99" />
                        <p className="text-xs text-gaming-green font-medium mt-1">Save 25%</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">RAM</Label>
                        <Input className="admin-input" placeholder="4GB" />
                      </div>
                      <div>
                        <Label className="text-gray-300">Storage</Label>
                        <Input className="admin-input" placeholder="25GB SSD" />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-gray-300">Features (one per line)</Label>
                      <Textarea 
                        className="admin-textarea" 
                        placeholder="24/7 Support&#10;DDoS Protection&#10;Instant Setup&#10;Full FTP Access"
                        rows={4}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch />
                        <Label className="text-gray-300">Popular Plan</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch />
                        <Label className="text-gray-300">Enabled</Label>
                      </div>
                    </div>
                    
                    <Button className="bg-gaming-green hover:bg-gaming-green/90 text-gaming-black w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Pricing Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing Plans List */}
              <Card className="bg-gaming-dark border-gaming-green/20 admin-card">
                <CardHeader>
                  <CardTitle className="text-gaming-green">Existing Pricing Plans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {games.map((game: Game) => (
                      <div key={game.id} className="p-3 bg-gaming-dark-lighter rounded-lg">
                        <h4 className="font-semibold text-white mb-2">{game.name}</h4>
                        
                        <div className="space-y-2">
                          {/* Sample pricing plans - this would come from API */}
                          <div className="flex items-center justify-between p-3 bg-gaming-black rounded border border-gaming-green/20">
                            <div>
                              <span className="text-sm font-medium text-white">Starter Plan</span>
                              <div className="text-xs text-gray-300 mt-1">
                                10 players • 4GB RAM • 25GB SSD
                              </div>
                              <div className="text-xs text-gaming-green font-medium mt-1">
                                $9.99/mo • $49.99/6mo <span className="text-gaming-green">(Save 16%)</span> • $89.99/year <span className="text-gaming-green">(Save 25%)</span>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="outline" className="border-gaming-green/30 text-gaming-green hover:bg-gaming-green/10">
                                <Edit2 className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-gaming-black rounded border border-yellow-500/20">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-white">Pro Plan</span>
                                <Badge className="text-xs bg-gaming-green/20 text-gaming-green">Popular</Badge>
                              </div>
                              <div className="text-xs text-gray-300 mt-1">
                                25 players • 8GB RAM • 50GB SSD
                              </div>
                              <div className="text-xs text-gaming-green font-medium mt-1">
                                $19.99/mo • $99.99/6mo <span className="text-gaming-green">(Save 17%)</span> • $179.99/year <span className="text-gaming-green">(Save 25%)</span>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="outline" className="border-gaming-green/30 text-gaming-green hover:bg-gaming-green/10">
                                <Edit2 className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="w-full text-gaming-green hover:bg-gaming-green/10"
                            onClick={() => {
                              setPricingPlanForm({
                                ...pricingPlanForm,
                                gameId: game.id
                              });
                              setShowPricingPlanForm(true);
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Plan for {game.name}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Pricing Plan Form Modal/Dialog */}
            {showPricingPlanForm && (
              <Card className="bg-gaming-dark border-gaming-green/20 admin-card mt-6">
                <CardHeader>
                  <CardTitle className="text-gaming-green flex items-center justify-between">
                    {editingPricingPlan ? "Edit Pricing Plan" : "Add New Pricing Plan"}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setShowPricingPlanForm(false);
                        setEditingPricingPlan(null);
                        setPricingPlanForm({
                          gameId: "",
                          name: "",
                          description: "",
                          players: "",
                          ram: "",
                          storage: "",
                          monthlyPrice: "",
                          biannualPrice: "",
                          annualPrice: "",
                          isPopular: false,
                          features: ""
                        });
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePricingPlanSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Game</Label>
                        <Select value={pricingPlanForm.gameId} onValueChange={(value) => setPricingPlanForm({...pricingPlanForm, gameId: value})}>
                          <SelectTrigger className="admin-input">
                            <SelectValue placeholder="Select a game" />
                          </SelectTrigger>
                          <SelectContent>
                            {games.map((game: any) => (
                              <SelectItem key={game.id} value={game.id}>
                                {game.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-gray-300">Plan Name</Label>
                        <Input
                          value={pricingPlanForm.name}
                          onChange={(e) => setPricingPlanForm({...pricingPlanForm, name: e.target.value})}
                          className="admin-input"
                          placeholder="Starter Plan"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-gray-300">Description</Label>
                      <Input
                        value={pricingPlanForm.description}
                        onChange={(e) => setPricingPlanForm({...pricingPlanForm, description: e.target.value})}
                        className="admin-input"
                        placeholder="Perfect for small communities"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-gray-300">Max Players</Label>
                        <Input
                          type="number"
                          value={pricingPlanForm.players}
                          onChange={(e) => setPricingPlanForm({...pricingPlanForm, players: e.target.value})}
                          className="admin-input"
                          placeholder="10"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">RAM</Label>
                        <Input
                          value={pricingPlanForm.ram}
                          onChange={(e) => setPricingPlanForm({...pricingPlanForm, ram: e.target.value})}
                          className="admin-input"
                          placeholder="4GB"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Storage</Label>
                        <Input
                          value={pricingPlanForm.storage}
                          onChange={(e) => setPricingPlanForm({...pricingPlanForm, storage: e.target.value})}
                          className="admin-input"
                          placeholder="25GB SSD"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-gray-300">Monthly Price ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={pricingPlanForm.monthlyPrice}
                          onChange={(e) => setPricingPlanForm({...pricingPlanForm, monthlyPrice: e.target.value})}
                          className="admin-input"
                          placeholder="9.99"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">6-Month Price ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={pricingPlanForm.biannualPrice}
                          onChange={(e) => setPricingPlanForm({...pricingPlanForm, biannualPrice: e.target.value})}
                          className="admin-input"
                          placeholder="49.99"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Annual Price ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={pricingPlanForm.annualPrice}
                          onChange={(e) => setPricingPlanForm({...pricingPlanForm, annualPrice: e.target.value})}
                          className="admin-input"
                          placeholder="89.99"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-gray-300">Features (comma-separated)</Label>
                      <Textarea
                        value={pricingPlanForm.features}
                        onChange={(e) => setPricingPlanForm({...pricingPlanForm, features: e.target.value})}
                        className="admin-textarea"
                        placeholder="24/7 Support, DDoS Protection, Instant Setup, Full FTP Access"
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={pricingPlanForm.isPopular}
                        onCheckedChange={(checked) => setPricingPlanForm({...pricingPlanForm, isPopular: checked})}
                      />
                      <Label className="text-gray-300">Mark as Popular Plan</Label>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        className="bg-gaming-green hover:bg-gaming-green/90 text-black flex-1"
                        disabled={pricingPlanMutation.isPending}
                      >
                        {pricingPlanMutation.isPending ? "Saving..." : (editingPricingPlan ? "Update Plan" : "Create Plan")}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowPricingPlanForm(false)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
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
                        placeholder="https://example.com/blog-image.jpg"
                        required
                      />
                      {blogForm.imageUrl && (
                        <div className="mt-2">
                          <img 
                            src={blogForm.imageUrl} 
                            alt="Blog image preview" 
                            className="max-h-20 w-auto rounded border border-gaming-green/20 object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
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
                <CardTitle className="flex items-center gap-2 text-gaming-white">
                  <Server className="w-5 h-5 text-gaming-green" />
                  {editingDemoServer ? 'Edit Demo Server' : 'Add New Demo Server'}
                </CardTitle>
                <CardDescription className="text-gaming-gray">
                  Manage demo servers that appear on the main page for visitors to try
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDemoServerSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="serverName" className="text-gaming-white">Server Name</Label>
                      <Input
                        id="serverName"
                        value={demoServerForm.serverName}
                        onChange={(e) => setDemoServerForm({...demoServerForm, serverName: e.target.value})}
                        className="bg-gaming-black text-gaming-white border-gaming-green/30"
                        placeholder="Minecraft Survival"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="gameId" className="text-gaming-white">Game</Label>
                      <Select value={demoServerForm.gameId} onValueChange={(value) => setDemoServerForm({...demoServerForm, gameId: value})}>
                        <SelectTrigger className="bg-gaming-black text-gaming-white border-gaming-green/30">
                          <SelectValue placeholder="Select a game" />
                        </SelectTrigger>
                        <SelectContent className="bg-gaming-black border-gaming-green/20">
                          {games.map((game: any) => (
                            <SelectItem key={game.id} value={game.id}>
                              {game.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="host" className="text-gaming-white">Server IP/Host</Label>
                      <Input
                        id="host"
                        value={demoServerForm.host}
                        onChange={(e) => setDemoServerForm({...demoServerForm, host: e.target.value})}
                        className="bg-gaming-black text-gaming-white border-gaming-green/30"
                        placeholder="mc.demo.gamehost.pro"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="port" className="text-gaming-white">Port</Label>
                      <Input
                        id="port"
                        type="number"
                        value={demoServerForm.port}
                        onChange={(e) => setDemoServerForm({...demoServerForm, port: e.target.value})}
                        className="bg-gaming-black text-gaming-white border-gaming-green/30"
                        placeholder="25565"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="playerCount" className="text-gaming-white">Current Players</Label>
                      <Input
                        id="playerCount"
                        type="number"
                        value={demoServerForm.playerCount}
                        onChange={(e) => setDemoServerForm({...demoServerForm, playerCount: e.target.value})}
                        className="bg-gaming-black text-gaming-white border-gaming-green/30"
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxPlayers" className="text-gaming-white">Max Players</Label>
                      <Input
                        id="maxPlayers"
                        type="number"
                        value={demoServerForm.maxPlayers}
                        onChange={(e) => setDemoServerForm({...demoServerForm, maxPlayers: e.target.value})}
                        className="bg-gaming-black text-gaming-white border-gaming-green/30"
                        min="1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="playtime" className="text-gaming-white">Demo Time Limit (minutes)</Label>
                      <Input
                        id="playtime"
                        type="number"
                        value={demoServerForm.playtime}
                        onChange={(e) => setDemoServerForm({...demoServerForm, playtime: e.target.value})}
                        className="bg-gaming-black text-gaming-white border-gaming-green/30"
                        placeholder="30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="version" className="text-gaming-white">Server Version</Label>
                      <Input
                        id="version"
                        value={demoServerForm.version}
                        onChange={(e) => setDemoServerForm({...demoServerForm, version: e.target.value})}
                        className="bg-gaming-black text-gaming-white border-gaming-green/30"
                        placeholder="1.20.4"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location" className="text-gaming-white">Location</Label>
                      <Input
                        id="location"
                        value={demoServerForm.location}
                        onChange={(e) => setDemoServerForm({...demoServerForm, location: e.target.value})}
                        className="bg-gaming-black text-gaming-white border-gaming-green/30"
                        placeholder="US East"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-gaming-white">Description</Label>
                    <Textarea
                      id="description"
                      value={demoServerForm.description}
                      onChange={(e) => setDemoServerForm({...demoServerForm, description: e.target.value})}
                      className="bg-gaming-black text-gaming-white border-gaming-green/30"
                      placeholder="A friendly survival server with amazing community builds"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={demoServerForm.isOnline}
                      onCheckedChange={(checked) => setDemoServerForm({...demoServerForm, isOnline: checked})}
                    />
                    <Label className="text-gaming-white">Server Online</Label>
                  </div>

                  <div className="flex space-x-4">
                    <Button 
                      type="submit" 
                      className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black"
                      disabled={createDemoServerMutation.isPending || updateDemoServerMutation.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingDemoServer ? 'Update Server' : 'Create Server'}
                    </Button>
                    {editingDemoServer && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="border-gaming-green/30 text-gaming-green hover:bg-gaming-green/10"
                        onClick={resetDemoServerForm}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Demo Servers List */}
            <Card className="bg-gaming-black-lighter border-gaming-green/20">
              <CardHeader>
                <CardTitle className="text-gaming-white">Demo Servers</CardTitle>
                <CardDescription className="text-gaming-gray">
                  Manage all demo servers visible to visitors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demoServers.length === 0 ? (
                    <div className="text-center py-8 text-gaming-gray">
                      <Server className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No demo servers configured yet.</p>
                      <p className="text-sm">Create your first demo server above.</p>
                    </div>
                  ) : (
                    demoServers.map((server: any) => (
                      <div key={server.id} className="bg-gaming-black p-6 rounded-lg border border-gaming-green/20">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gaming-white">
                                {server.serverName || server.name}
                              </h3>
                              <Badge className={server.isOnline ? "bg-gaming-green text-gaming-black" : "bg-red-500 text-white"}>
                                {server.isOnline ? "Online" : "Offline"}
                              </Badge>
                            </div>
                            <p className="text-gaming-gray mb-2">{server.description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gaming-gray">Game:</span>
                                <span className="text-gaming-white ml-1">
                                  {games.find((g: any) => g.id === server.gameId)?.name || server.gameId}
                                </span>
                              </div>
                              <div>
                                <span className="text-gaming-gray">Address:</span>
                                <span className="text-gaming-white ml-1 font-mono">
                                  {server.host || server.serverIp}:{server.port || server.serverPort}
                                </span>
                              </div>
                              <div>
                                <span className="text-gaming-gray">Players:</span>
                                <span className="text-gaming-white ml-1">
                                  {server.playerCount}/{server.maxPlayers}
                                </span>
                              </div>
                              <div>
                                <span className="text-gaming-gray">Location:</span>
                                <span className="text-gaming-white ml-1">{server.location}</span>
                              </div>
                            </div>
                            {server.version && (
                              <div className="mt-2 text-sm">
                                <span className="text-gaming-gray">Version:</span>
                                <span className="text-gaming-white ml-1">{server.version}</span>
                              </div>
                            )}
                            {server.playtime && (
                              <div className="mt-1 text-sm">
                                <span className="text-gaming-gray">Demo Time:</span>
                                <span className="text-gaming-white ml-1">{server.playtime} minutes</span>
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditDemoServer(server)}
                              className="text-gaming-green hover:text-gaming-green-dark hover:bg-gaming-green/10"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteDemoServerMutation.mutate(server.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              disabled={deleteDemoServerMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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

                    {/* Hero Section Customization */}
                    <div className="space-y-4">
                      <h3 className="text-gaming-green font-semibold flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Hero Section Content
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label className="text-gray-300">Hero Title</Label>
                          <Input
                            value={themeForm.heroTitle}
                            onChange={(e) => setThemeForm({...themeForm, heroTitle: e.target.value})}
                            className="admin-input"
                            placeholder="Deploy Your Game Server in Minutes"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Hero Subtitle</Label>
                          <Input
                            value={themeForm.heroSubtitle}
                            onChange={(e) => setThemeForm({...themeForm, heroSubtitle: e.target.value})}
                            className="admin-input"
                            placeholder="Experience lightning-fast deployment with our premium game server hosting platform"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Hero Description</Label>
                          <Textarea
                            value={themeForm.heroDescription}
                            onChange={(e) => setThemeForm({...themeForm, heroDescription: e.target.value})}
                            className="admin-textarea"
                            placeholder="Join thousands of gamers who trust our reliable infrastructure for their Minecraft, CS2, Rust, and other game servers."
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-gray-300">Button Text</Label>
                            <Input
                              value={themeForm.heroButtonText}
                              onChange={(e) => setThemeForm({...themeForm, heroButtonText: e.target.value})}
                              className="admin-input"
                              placeholder="Get Started"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-300">Button URL</Label>
                            <Input
                              value={themeForm.heroButtonUrl}
                              onChange={(e) => setThemeForm({...themeForm, heroButtonUrl: e.target.value})}
                              className="admin-input"
                              placeholder="/pricing"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CTA Section Customization */}
                    <div className="space-y-4">
                      <h3 className="text-gaming-green font-semibold flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        CTA Section Content
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label className="text-gray-300">CTA Badge Text</Label>
                          <Input
                            value={themeForm.ctaBadgeText}
                            onChange={(e) => setThemeForm({...themeForm, ctaBadgeText: e.target.value})}
                            className="admin-input"
                            placeholder="Limited Time: 30% Off First Month"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">CTA Title</Label>
                          <Textarea
                            value={themeForm.ctaTitle}
                            onChange={(e) => setThemeForm({...themeForm, ctaTitle: e.target.value})}
                            className="admin-textarea"
                            placeholder="Ready to Level Up Your Game Server?"
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">CTA Description</Label>
                          <Textarea
                            value={themeForm.ctaDescription}
                            onChange={(e) => setThemeForm({...themeForm, ctaDescription: e.target.value})}
                            className="admin-textarea"
                            placeholder="Join over 50,000 players worldwide. Get your game server online in under 60 seconds with our enterprise-grade infrastructure and 24/7 expert support."
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-gray-300">Primary CTA Button Text</Label>
                            <Input
                              value={themeForm.ctaPrimaryButtonText}
                              onChange={(e) => setThemeForm({...themeForm, ctaPrimaryButtonText: e.target.value})}
                              className="admin-input"
                              placeholder="Get Started Today"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-300">Primary CTA Button URL</Label>
                            <Input
                              value={themeForm.ctaPrimaryButtonUrl}
                              onChange={(e) => setThemeForm({...themeForm, ctaPrimaryButtonUrl: e.target.value})}
                              className="admin-input"
                              placeholder="/games"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-gray-300">Secondary CTA Button Text</Label>
                            <Input
                              value={themeForm.ctaSecondaryButtonText}
                              onChange={(e) => setThemeForm({...themeForm, ctaSecondaryButtonText: e.target.value})}
                              className="admin-input"
                              placeholder="View Live Demo"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-300">Secondary CTA Button URL</Label>
                            <Input
                              value={themeForm.ctaSecondaryButtonUrl}
                              onChange={(e) => setThemeForm({...themeForm, ctaSecondaryButtonUrl: e.target.value})}
                              className="admin-input"
                              placeholder="/minecraft-tools"
                            />
                          </div>
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

          {/* FAQ Management */}
          <TabsContent value="faq" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {/* FAQ Category Form */}
              <Card className="bg-gaming-dark border-gaming-green/20 admin-card">
                <CardHeader>
                  <CardTitle className="text-gaming-green">
                    {editingFaqCategory ? "Edit FAQ Category" : "Add New FAQ Category"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleFaqCategorySubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Title</Label>
                        <Input
                          value={faqCategoryForm.title}
                          onChange={(e) => setFaqCategoryForm({...faqCategoryForm, title: e.target.value})}
                          className="admin-input"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Slug</Label>
                        <Input
                          value={faqCategoryForm.slug}
                          onChange={(e) => setFaqCategoryForm({...faqCategoryForm, slug: e.target.value})}
                          className="admin-input"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-300">Description</Label>
                      <Textarea
                        value={faqCategoryForm.description}
                        onChange={(e) => setFaqCategoryForm({...faqCategoryForm, description: e.target.value})}
                        className="admin-input"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Sort Order</Label>
                        <Input
                          type="number"
                          value={faqCategoryForm.sortOrder}
                          onChange={(e) => setFaqCategoryForm({...faqCategoryForm, sortOrder: e.target.value})}
                          className="admin-input"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={faqCategoryForm.isVisible}
                          onCheckedChange={(checked) => setFaqCategoryForm({...faqCategoryForm, isVisible: checked})}
                        />
                        <Label className="text-gray-300">Visible</Label>
                      </div>
                    </div>
                    <Button type="submit" className="bg-gaming-green text-gaming-black hover:bg-gaming-green/80">
                      <Save className="w-4 h-4 mr-2" />
                      {editingFaqCategory ? "Update Category" : "Add Category"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* FAQ Item Form */}
              <Card className="bg-gaming-dark border-gaming-green/20 admin-card">
                <CardHeader>
                  <CardTitle className="text-gaming-green">
                    {editingFaqItem ? "Edit FAQ Item" : "Add New FAQ Item"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleFaqItemSubmit} className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Category</Label>
                      <Select value={faqItemForm.categoryId} onValueChange={(value) => setFaqItemForm({...faqItemForm, categoryId: value})}>
                        <SelectTrigger className="admin-input">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {faqCategories.map((category: any) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Question</Label>
                      <Input
                        value={faqItemForm.question}
                        onChange={(e) => setFaqItemForm({...faqItemForm, question: e.target.value})}
                        className="admin-input"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Answer (Markdown)</Label>
                      <Textarea
                        value={faqItemForm.answer}
                        onChange={(e) => setFaqItemForm({...faqItemForm, answer: e.target.value})}
                        className="admin-input min-h-32"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Tags (comma-separated)</Label>
                        <Input
                          value={faqItemForm.tags}
                          onChange={(e) => setFaqItemForm({...faqItemForm, tags: e.target.value})}
                          className="admin-input"
                          placeholder="minecraft, setup, troubleshooting"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Sort Order</Label>
                        <Input
                          type="number"
                          value={faqItemForm.sortOrder}
                          onChange={(e) => setFaqItemForm({...faqItemForm, sortOrder: e.target.value})}
                          className="admin-input"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={faqItemForm.isVisible}
                        onCheckedChange={(checked) => setFaqItemForm({...faqItemForm, isVisible: checked})}
                      />
                      <Label className="text-gray-300">Visible</Label>
                    </div>
                    <Button type="submit" className="bg-gaming-green text-gaming-black hover:bg-gaming-green/80">
                      <Save className="w-4 h-4 mr-2" />
                      {editingFaqItem ? "Update FAQ Item" : "Add FAQ Item"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Categories List */}
            <Card className="bg-gaming-dark border-gaming-green/20 admin-card">
              <CardHeader>
                <CardTitle className="text-gaming-green">FAQ Categories</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage FAQ categories and items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqCategories.map((category: any) => (
                    <div key={category.id} className="p-4 border border-gaming-green/20 rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gaming-white">{category.title}</h4>
                          <p className="text-sm text-gray-400">{category.description || 'No description'}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-gray-500">Sort: {category.sortOrder}</span>
                            <Badge variant="outline" className={category.isVisible ? "text-gaming-green border-gaming-green/30" : "text-gray-400 border-gray-400/30"}>
                              {category.isVisible ? 'Visible' : 'Hidden'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gaming-green/30 text-gaming-green hover:bg-gaming-green/10"
                            onClick={() => handleEditFaqCategory(category)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {category.items && category.items.length > 0 && (
                        <div className="mt-4 pl-4 border-l-2 border-gaming-green/20">
                          <div className="space-y-2">
                            {category.items.map((item: any) => (
                              <div key={item.id} className="flex items-center justify-between p-2 bg-gaming-black-lighter rounded">
                                <span className="text-sm">{item.question}</span>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditFaqItem(item)}
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {faqCategories.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No FAQ categories found. Create one above to get started.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}