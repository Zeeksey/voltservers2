import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ClientPortal from "@/pages/client-portal";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import MinecraftHosting from "@/pages/minecraft-hosting";
import GamePage from "@/pages/game-page";
import BlogPostPage from "@/pages/blog-post";
import HardwarePage from "@/pages/hardware";
import AboutPage from "@/pages/about";
import SupportPage from "@/pages/support";
import ContactPage from "@/pages/contact";
import PricingPage from "@/pages/pricing";
import KnowledgebasePage from "@/pages/knowledgebase";
import StatusPage from "@/pages/status";
import GamesPage from "@/pages/games";
import MinecraftHostingPage from "@/pages/minecraft-hosting";
import EnterprisePage from "@/pages/enterprise";
import DashboardPage from "@/pages/dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/client-portal" component={ClientPortal} />
      <Route path="/games/:slug" component={GamePage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route path="/hardware" component={HardwarePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/support" component={SupportPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/knowledgebase" component={KnowledgebasePage} />
      <Route path="/status" component={StatusPage} />
      <Route path="/games" component={GamesPage} />
      <Route path="/games/minecraft" component={MinecraftHostingPage} />
      <Route path="/enterprise" component={EnterprisePage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/minecraft" component={MinecraftHosting} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
