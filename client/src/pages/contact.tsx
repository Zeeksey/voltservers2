import Navigation from "@/components/navigation";
import PromoBanner from "@/components/promo-banner";
import Footer from "@/components/footer";
import EnhancedContact from "@/components/enhanced-contact";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gaming-black">
      <PromoBanner />
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-gaming">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gaming-white mb-6">
              Contact <span className="text-gaming-green">Us</span>
            </h1>
            <p className="text-xl text-gaming-gray mb-8">
              Get expert support from our team of gaming infrastructure specialists
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <EnhancedContact />
        </div>
      </section>

      <Footer />
    </div>
  );
}