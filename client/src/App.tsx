import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense, lazy, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import HolidayEffects from "@/components/holiday-effects";
import CookieBanner from "@/components/cookie-banner";

// Critical pages loaded immediately
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";

// Lazy load non-critical pages for better performance
const ClientPortal = lazy(() => import("@/pages/client-portal"));
const AdminLogin = lazy(() => import("@/pages/admin-login"));
const AdminDashboard = lazy(() => import("@/pages/admin-dashboard"));
const AdminGameCustomization = lazy(() => import("@/pages/admin-game-customization"));
const MinecraftToolPage = lazy(() => import("@/pages/minecraft-tool-page"));
const MinecraftToolsPage = lazy(() => import("@/pages/minecraft-tools"));
const MinecraftHosting = lazy(() => import("@/pages/minecraft-hosting"));
const GamePage = lazy(() => import("@/pages/game-page"));
const BlogPostPage = lazy(() => import("@/pages/blog-post"));
const HardwarePage = lazy(() => import("@/pages/hardware"));
const AboutPage = lazy(() => import("@/pages/about"));
const SupportPage = lazy(() => import("@/pages/support"));
const ContactPage = lazy(() => import("@/pages/contact"));
const PricingPage = lazy(() => import("@/pages/pricing"));
const KnowledgebasePage = lazy(() => import("@/pages/knowledgebase"));
const StatusPage = lazy(() => import("@/pages/status"));
const GamesPage = lazy(() => import("@/pages/games"));
const MinecraftHostingPage = lazy(() => import("@/pages/minecraft-hosting"));
const EnterprisePage = lazy(() => import("@/pages/enterprise"));
const DashboardPage = lazy(() => import("@/pages/dashboard"));
const ServerManagementPage = lazy(() => import("@/pages/server-management"));
const BillingManagementPage = lazy(() => import("@/pages/billing-management"));
const TicketDetailsPage = lazy(() => import("@/pages/ticket-details"));
const AccountSettingsPage = lazy(() => import("@/pages/account-settings"));

// Loading component for Suspense
const PageLoader = () => (
  <div className="min-h-screen bg-gaming-black flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-gaming-green/30 border-t-gaming-green rounded-full animate-spin"></div>
  </div>
);

// Wrap lazy components to work with wouter
const LazyWrapper = ({ Component, ...props }) => (
  <Suspense fallback={<PageLoader />}>
    <Component {...props} />
  </Suspense>
);

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/client-portal" component={(props) => <LazyWrapper Component={ClientPortal} {...props} />} />
      <Route path="/ticket/:ticketId" component={(props) => <LazyWrapper Component={TicketDetailsPage} {...props} />} />
      <Route path="/games/:slug" component={(props) => <LazyWrapper Component={GamePage} {...props} />} />
      <Route path="/blog/:slug" component={(props) => <LazyWrapper Component={BlogPostPage} {...props} />} />
      <Route path="/hardware" component={(props) => <LazyWrapper Component={HardwarePage} {...props} />} />
      <Route path="/about" component={(props) => <LazyWrapper Component={AboutPage} {...props} />} />
      <Route path="/support" component={(props) => <LazyWrapper Component={SupportPage} {...props} />} />
      <Route path="/contact" component={(props) => <LazyWrapper Component={ContactPage} {...props} />} />
      <Route path="/pricing" component={(props) => <LazyWrapper Component={PricingPage} {...props} />} />
      <Route path="/knowledgebase" component={(props) => <LazyWrapper Component={KnowledgebasePage} {...props} />} />
      <Route path="/status" component={(props) => <LazyWrapper Component={StatusPage} {...props} />} />
      <Route path="/games" component={(props) => <LazyWrapper Component={GamesPage} {...props} />} />
      <Route path="/minecraft-hosting" component={(props) => <LazyWrapper Component={MinecraftHostingPage} {...props} />} />
      <Route path="/minecraft-tools" component={(props) => <LazyWrapper Component={MinecraftToolsPage} {...props} />} />
      <Route path="/minecraft-tool/:toolSlug" component={(props) => <LazyWrapper Component={MinecraftToolPage} {...props} />} />
      <Route path="/enterprise" component={(props) => <LazyWrapper Component={EnterprisePage} {...props} />} />
      <Route path="/dashboard" component={(props) => <LazyWrapper Component={DashboardPage} {...props} />} />
      <Route path="/admin/login" component={(props) => <LazyWrapper Component={AdminLogin} {...props} />} />
      <Route path="/admin/games/:gameId/customize" component={(props) => <LazyWrapper Component={AdminGameCustomization} {...props} />} />
      <Route path="/admin" component={(props) => <LazyWrapper Component={AdminDashboard} {...props} />} />
      <Route path="/server-management" component={(props) => <LazyWrapper Component={ServerManagementPage} {...props} />} />
      <Route path="/billing-management" component={(props) => <LazyWrapper Component={BillingManagementPage} {...props} />} />
      <Route path="/account-settings" component={(props) => <LazyWrapper Component={AccountSettingsPage} {...props} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Remove initial loader when React app is ready
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.remove();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  const { data: themeSettings } = useQuery({
    queryKey: ["/api/theme-settings"],
  });

  const holidayTheme = (themeSettings?.holidayTheme || 'none') as 'none' | 'snow' | 'halloween' | 'easter' | 'christmas';

  return (
    <>
      <HolidayEffects theme={holidayTheme} />
      <Toaster />
      <Router />
      <CookieBanner />
    </>
  );
}

export default App;
