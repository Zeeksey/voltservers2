import { Badge } from "@/components/ui/badge";
import { Shield, Award, Clock, Headphones } from "lucide-react";

export default function TrustIndicators() {
  const indicators = [
    {
      icon: <Shield className="text-gaming-green w-6 h-6" />,
      title: "Enterprise Security",
      description: "SOC 2 Type II Certified"
    },
    {
      icon: <Award className="text-gaming-green w-6 h-6" />,
      title: "Industry Leader",
      description: "5 Years of Excellence"
    },
    {
      icon: <Clock className="text-gaming-green w-6 h-6" />,
      title: "99.9% SLA",
      description: "Guaranteed Uptime"
    },
    {
      icon: <Headphones className="text-gaming-green w-6 h-6" />,
      title: "Expert Support",
      description: "24/7 Gaming Specialists"
    }
  ];

  return (
    <section className="py-12 bg-gaming-black border-t border-gaming-gray/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <h3 className="text-2xl font-bold text-gaming-white mb-2">
              Trusted by <span className="text-gaming-green">15,000+</span> Gaming Communities
            </h3>
            <p className="text-gaming-gray">
              Join the most reliable game hosting platform with industry-leading uptime and support.
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {indicators.map((indicator, index) => (
              <div key={index} className="flex flex-col items-center text-center min-w-[140px]">
                <div className="w-12 h-12 bg-gaming-green/10 rounded-full flex items-center justify-center mb-3">
                  {indicator.icon}
                </div>
                <div className="font-semibold text-gaming-white text-sm mb-1">{indicator.title}</div>
                <div className="text-gaming-gray text-xs">{indicator.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}