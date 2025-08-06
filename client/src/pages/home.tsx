import StickyHeader from "@/components/sticky-header";
import ProfessionalHero from "@/components/professional-hero";
import TrustIndicators from "@/components/trust-indicators";
import GameCards from "@/components/game-cards";
import GamePanelShowcase from "@/components/game-panel-showcase";
import DemoGamesSection from "@/components/demo-games-section";
import FeaturesSection from "@/components/features-section";
import TestimonialsSection from "@/components/testimonials-section";
import BlogSection from "@/components/blog-section";
import CtaSection from "@/components/cta-section";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo-head";

const homeSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "VoltServers",
  "description": "Professional game server hosting with 99.9% uptime guarantee",
  "url": "https://voltservers.com",
  "logo": "https://voltservers.com/logo.png",
  "sameAs": [
    "https://twitter.com/voltservers",
    "https://discord.gg/voltservers"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-VOLT-SRV",
    "contactType": "customer support",
    "availableLanguage": "English"
  },
  "service": {
    "@type": "Service",
    "name": "Game Server Hosting",
    "description": "Professional gaming server hosting for Minecraft, CS2, Rust, and more",
    "provider": {
      "@type": "Organization",
      "name": "VoltServers"
    }
  }
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="VoltServers - Premium Game Server Hosting | 99.9% Uptime | 2025"
        description="Professional game server hosting with 99.9% uptime guarantee. Deploy Minecraft, CS2, Rust servers instantly. DDoS protection, NVMe SSD, 24/7 support. Starting at $2.99/mo."
        keywords="game server hosting, minecraft hosting, rust server, cs2 server, gaming servers, dedicated hosting, vps gaming, game hosting, server rental, minecraft server hosting, gaming vps"
        ogTitle="VoltServers - Premium Game Server Hosting | 99.9% Uptime"
        ogDescription="Professional game server hosting with 99.9% uptime guarantee. Deploy Minecraft, CS2, Rust servers instantly. DDoS protection, NVMe SSD, 24/7 support. Starting at $2.99/mo."
        twitterTitle="VoltServers - Premium Game Server Hosting"
        twitterDescription="Professional game server hosting with 99.9% uptime guarantee. Deploy Minecraft, CS2, Rust servers instantly. Starting at $2.99/mo."
        canonicalUrl="https://voltservers.com"
        schema={homeSchema}
      />
      
      <StickyHeader />
      <ProfessionalHero />
      <TrustIndicators />
      <GameCards />
      <GamePanelShowcase />
      <DemoGamesSection />
      <FeaturesSection />
      <TestimonialsSection />
      <BlogSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
