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
import GamePage from "@/pages/game-page";
import BlogPostPage from "@/pages/blog-post";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/client-portal" component={ClientPortal} />
      <Route path="/games/:slug" component={GamePage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
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
