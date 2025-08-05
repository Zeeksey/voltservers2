import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Gamepad2, Settings, TrendingUp, Users, Zap, Monitor } from "lucide-react";

export default function GameOptimization() {
  const optimizations = [
    {
      game: "Minecraft",
      icon: "🟫",
      improvements: [
        { metric: "Tick Rate", before: "15 TPS", after: "20 TPS", improvement: 33 },
        { metric: "Chunk Loading", before: "3.2s", after: "0.8s", improvement: 75 },
        { metric: "Memory Usage", before: "4.1GB", after: "2.8GB", improvement: 32 }
      ],
      features: ["Paper/Spigot Optimization", "JVM Tuning", "Plugin Management"]
    },
    {
      game: "CS2",
      icon: "🔫",
      improvements: [
        { metric: "Server FPS", before: "64 FPS", after: "128 FPS", improvement: 100 },
        { metric: "Var (variance)", before: "2.1ms", after: "0.3ms", improvement: 86 },
        { metric: "Packet Loss", before: "0.8%", after: "0.1%", improvement: 88 }
      ],
      features: ["Tick Rate Boost", "Anti-Cheat Integration", "Custom Maps Support"]
    },
    {
      game: "Rust",
      icon: "⚙️",
      improvements: [
        { metric: "World Size", before: "3000x3000", after: "4000x4000", improvement: 78 },
        { metric: "Player Slots", before: "100", after: "200", improvement: 100 },
        { metric: "Save Time", before: "45s", after: "12s", improvement: 73 }
      ],
      features: ["Oxide Plugins", "Custom Maps", "Wipe Scheduling"]
    }
  ];

  return (
    <section className="py-20 bg-gaming-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gaming-green">Game-Specific</span> Optimizations
          </h2>
          <p className="text-xl text-gaming-gray max-w-3xl mx-auto">
            We don't just host servers - we optimize them. Each game gets custom configurations 
            and performance tweaks for the best possible player experience.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {optimizations.map((game, index) => (
            <Card key={index} className="bg-gaming-black-lighter border-gaming-black hover:border-gaming-green/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-gaming-white">
                  <span className="text-2xl">{game.icon}</span>
                  {game.game}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {game.improvements.map((improvement, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gaming-gray">{improvement.metric}</span>
                        <span className="text-gaming-green">+{improvement.improvement}%</span>
                      </div>
                      <div className="flex justify-between text-xs text-gaming-gray mb-1">
                        <span>{improvement.before}</span>
                        <span>{improvement.after}</span>
                      </div>
                      <Progress value={improvement.improvement} className="h-2" />
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gaming-black">
                  <h4 className="text-gaming-white font-medium mb-3">Included Features:</h4>
                  <ul className="space-y-1">
                    {game.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gaming-gray flex items-center">
                        <Zap className="h-3 w-3 text-gaming-green mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gaming-green/10 mb-4">
              <Monitor className="h-8 w-8 text-gaming-green" />
            </div>
            <h3 className="text-xl font-bold text-gaming-white mb-2">Real-Time Monitoring</h3>
            <p className="text-gaming-gray">Track server performance with detailed metrics and alerts</p>
          </div>
          <div className="p-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gaming-green/10 mb-4">
              <Settings className="h-8 w-8 text-gaming-green" />
            </div>
            <h3 className="text-xl font-bold text-gaming-white mb-2">Auto-Optimization</h3>
            <p className="text-gaming-gray">Automatic performance tuning based on server load and usage</p>
          </div>
          <div className="p-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gaming-green/10 mb-4">
              <TrendingUp className="h-8 w-8 text-gaming-green" />
            </div>
            <h3 className="text-xl font-bold text-gaming-white mb-2">Performance Reports</h3>
            <p className="text-gaming-gray">Weekly reports showing your server's performance improvements</p>
          </div>
        </div>
      </div>
    </section>
  );
}