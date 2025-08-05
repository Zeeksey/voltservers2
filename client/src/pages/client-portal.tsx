import PromoBanner from "@/components/promo-banner";
import Navigation from "@/components/navigation";
import ServiceManagement from "@/components/service-management";
import Footer from "@/components/footer";
import LiveChat from "@/components/live-chat";

export default function ClientPortal() {
  return (
    <div className="min-h-screen bg-gaming-black">
      <title>Client Portal - GameHost Pro | WHMCS Integration</title>
      <meta name="description" content="Access your game server management portal. View services, manage billing, and control your servers through our WHMCS integration." />
      
      <PromoBanner />
      <Navigation />
      
      <main className="pt-44 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gaming-white mb-2">
              Service Management
            </h1>
            <p className="text-gaming-gray">
              Manage your game servers, view performance metrics, and control your services
            </p>
          </div>
          <ServiceManagement />
        </div>
      </main>
      
      <Footer />
      <LiveChat />
    </div>
  );
}