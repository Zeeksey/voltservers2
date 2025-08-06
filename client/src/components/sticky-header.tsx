import PromoBanner from "@/components/promo-banner";
import Navigation from "@/components/navigation";

export default function StickyHeader() {
  return (
    <div className="sticky top-0 z-50">
      <PromoBanner />
      <Navigation />
    </div>
  );
}