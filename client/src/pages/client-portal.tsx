import PromoBanner from "@/components/promo-banner";
import Navigation from "@/components/navigation";
import WHMCSIntegration from "@/components/whmcs-integration";
import Footer from "@/components/footer";

export default function ClientPortal() {
  return (
    <div className="min-h-screen bg-gaming-black">
      <title>Client Portal - GameHost Pro | WHMCS Integration</title>
      <meta name="description" content="Access your game server management portal. View services, manage billing, and control your servers through our WHMCS integration." />
      
      <PromoBanner />
      <Navigation />
      
      <main className="pt-44 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <WHMCSIntegration />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}