import PromoBanner from "@/components/promo-banner";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import GameCards from "@/components/game-cards";
import PricingSection from "@/components/pricing-section";
import DemoServers from "@/components/demo-servers";
import ServerStatus from "@/components/server-status";
import MinecraftTools from "@/components/minecraft-tools";
import BlogSection from "@/components/blog-section";
import FeaturesSection from "@/components/features-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <title>GameHost Pro - Premium Game Server Hosting | 2025</title>
      <meta name="description" content="Professional game server hosting with 99.9% uptime. Minecraft, CS2, Rust, and more. Get your game server online in minutes with our modern hosting platform." />
      <meta name="keywords" content="game server hosting, minecraft hosting, rust server, cs2 server, gaming servers" />
      
      <PromoBanner />
      <Navigation />
      <HeroSection />
      <GameCards />
      <PricingSection />
      <DemoServers />
      <ServerStatus />
      <MinecraftTools />
      <BlogSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
}
