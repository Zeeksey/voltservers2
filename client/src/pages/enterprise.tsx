import PromoBanner from "@/components/promo-banner";
import Navigation from "@/components/navigation";
import EnterpriseFeatures from "@/components/enterprise-features";
import Footer from "@/components/footer";
import LiveChat from "@/components/live-chat";

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-gaming-black">
      <title>Enterprise Solutions - GameHost Pro | Scalable Game Server Infrastructure</title>
      <meta name="description" content="Enterprise-grade game server hosting with dedicated resources, 24/7 priority support, advanced security, and compliance certifications. Scale your gaming business with GameHost Pro." />
      <meta name="keywords" content="enterprise game hosting, dedicated game servers, business gaming infrastructure, enterprise support, gaming compliance" />
      
      <PromoBanner />
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-32 bg-gradient-gaming">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold text-gaming-white mb-6">
              Enterprise <span className="text-gaming-green">Solutions</span>
            </h1>
            <p className="text-xl text-gaming-gray mb-8">
              Scale your gaming infrastructure with enterprise-grade features, dedicated support, 
              and compliance-ready solutions built for mission-critical applications.
            </p>
          </div>
        </div>
      </section>
      
      <EnterpriseFeatures />
      <Footer />
      <LiveChat />
    </div>
  );
}