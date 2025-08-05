import PromoBanner from "@/components/promo-banner";
import Navigation from "@/components/navigation";
import ServiceManagement from "@/components/service-management";
import Footer from "@/components/footer";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gaming-black">
      <title>Server Dashboard - GameHost Pro | Manage Your Game Servers</title>
      <meta name="description" content="Manage your game servers with our comprehensive dashboard. Monitor performance, control services, manage files, and view analytics in real-time." />
      
      <PromoBanner />
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-gaming">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gaming-white mb-6">
              Server <span className="text-gaming-green">Dashboard</span>
            </h1>
            <p className="text-xl text-gaming-gray mb-8">
              Complete control and monitoring of your game servers with real-time analytics 
              and professional management tools.
            </p>
          </div>
        </div>
      </section>
      
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <ServiceManagement />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}