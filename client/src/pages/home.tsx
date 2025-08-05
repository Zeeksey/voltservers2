import PromoBanner from "@/components/promo-banner";
import Navigation from "@/components/navigation";
import ProfessionalHero from "@/components/professional-hero";
import TrustIndicators from "@/components/trust-indicators";
import GameCards from "@/components/game-cards";
import FeaturesSection from "@/components/features-section";
import PricingSection from "@/components/pricing-section";
import TestimonialsSection from "@/components/testimonials-section";
import BlogSection from "@/components/blog-section";
import CtaSection from "@/components/cta-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <title>GameHost Pro - Premium Game Server Hosting | 99.9% Uptime | 2025</title>
      <meta name="description" content="Professional game server hosting with 99.9% uptime guarantee. Deploy Minecraft, CS2, Rust servers instantly. DDoS protection, NVMe SSD, 24/7 support. Starting at $2.99/mo." />
      <meta name="keywords" content="game server hosting, minecraft hosting, rust server, cs2 server, gaming servers, dedicated hosting, vps gaming" />
      
      <PromoBanner />
      <Navigation />
      <ProfessionalHero />
      <TrustIndicators />
      <GameCards />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <BlogSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
