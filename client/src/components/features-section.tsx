import { 
  Zap, 
  Shield, 
  Headphones, 
  HardDrive, 
  CloudUpload, 
  Globe 
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Zap className="text-gaming-green text-2xl" />,
      title: "Instant Setup",
      description: "Your server is ready in under 60 seconds. No waiting, no complex configuration required."
    },
    {
      icon: <Shield className="text-gaming-green text-2xl" />,
      title: "DDoS Protection",
      description: "Enterprise-grade DDoS protection keeps your server online even during the largest attacks."
    },
    {
      icon: <Headphones className="text-gaming-green text-2xl" />,
      title: "24/7 Expert Support",
      description: "Our gaming specialists are available around the clock with average response time under 5 minutes."
    },
    {
      icon: <HardDrive className="text-gaming-green text-2xl" />,
      title: "NVMe SSD Storage",
      description: "Ultra-fast NVMe SSDs with 10x faster read/write speeds than traditional storage."
    },
    {
      icon: <CloudUpload className="text-gaming-green text-2xl" />,
      title: "Automatic Backups",
      description: "Hourly automated backups with 30-day retention. Restore any version with one click."
    },
    {
      icon: <Globe className="text-gaming-green text-2xl" />,
      title: "Global Network",
      description: "8 strategic locations worldwide with premium network carriers for ultra-low latency."
    }
  ];

  return (
    <section className="py-20 bg-gaming-black-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gaming-green">Enterprise-Grade</span> Features
          </h2>
          <p className="text-xl text-gaming-gray max-w-3xl mx-auto">
            We provide enterprise-grade infrastructure with gaming-focused optimizations to deliver the best possible experience for your players worldwide.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6">
              <div className="w-16 h-16 bg-gaming-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gaming-white mb-4">{feature.title}</h3>
              <p className="text-gaming-gray">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
