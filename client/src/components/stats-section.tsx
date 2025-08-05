import { Users, Server, Clock, Trophy } from "lucide-react";

export default function StatsSection() {
  const stats = [
    {
      icon: <Users className="text-gaming-green text-3xl" />,
      number: "50K+",
      label: "Active Players",
      description: "Playing on our servers daily"
    },
    {
      icon: <Server className="text-gaming-green text-3xl" />,
      number: "15K+",
      label: "Servers Deployed",
      description: "Across 8 global locations"
    },
    {
      icon: <Clock className="text-gaming-green text-3xl" />,
      number: "99.9%",
      label: "Uptime Guarantee",
      description: "Enterprise-grade reliability"
    },
    {
      icon: <Trophy className="text-gaming-green text-3xl" />,
      number: "4.9/5",
      label: "Customer Rating",
      description: "Based on 2000+ reviews"
    }
  ];

  return (
    <section className="py-16 bg-gaming-black-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="w-20 h-20 bg-gaming-green/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gaming-green/20 transition-colors duration-300">
                {stat.icon}
              </div>
              <div className="text-4xl font-bold text-gaming-green mb-2">{stat.number}</div>
              <div className="text-xl font-semibold text-gaming-white mb-1">{stat.label}</div>
              <div className="text-gaming-gray text-sm">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}