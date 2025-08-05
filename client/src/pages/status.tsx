import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Server, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Clock,
  Wifi,
  Activity,
  MapPin,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react";
import Navigation from "@/components/navigation";
import PromoBanner from "@/components/promo-banner";
import Footer from "@/components/footer";

export default function StatusPage() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [hideIPs, setHideIPs] = useState(false);

  const overallStatus = "operational"; // operational, degraded, down

  const services = [
    { name: "Game Servers", status: "operational", uptime: "99.98%" },
    { name: "Control Panel", status: "operational", uptime: "99.95%" },
    { name: "Website", status: "operational", uptime: "99.99%" },
    { name: "API", status: "operational", uptime: "99.97%" },
    { name: "Support System", status: "operational", uptime: "99.94%" },
    { name: "Billing System", status: "operational", uptime: "99.96%" }
  ];

  const locations = [
    { name: "Virginia, US", status: "operational", ping: "13ms", players: "2,847", ip: "198.51.100.42" },
    { name: "Quebec, Canada", status: "operational", ping: "36ms", players: "1,623", ip: "203.0.113.89" },
    { name: "Florida, US", status: "operational", ping: "42ms", players: "1,945", ip: "192.0.2.156" },
    { name: "Texas, US", status: "operational", ping: "46ms", players: "2,156", ip: "198.51.100.73" },
    { name: "California, US", status: "operational", ping: "86ms", players: "3,214", ip: "203.0.113.201" },
    { name: "Oregon, US", status: "operational", ping: "91ms", players: "1,789", ip: "192.0.2.88" },
    { name: "United Kingdom", status: "operational", ping: "86ms", players: "2,634", ip: "198.51.100.134" },
    { name: "Germany", status: "operational", ping: "99ms", players: "3,521", ip: "203.0.113.67" },
    { name: "Netherlands", status: "operational", ping: "102ms", players: "2,967", ip: "192.0.2.192" },
    { name: "France", status: "operational", ping: "97ms", players: "2,145", ip: "198.51.100.205" },
    { name: "Australia", status: "operational", ping: "221ms", players: "1,456", ip: "203.0.113.123" },
    { name: "Singapore", status: "operational", ping: "252ms", players: "1,789", ip: "192.0.2.45" }
  ];

  const incidents = [
    {
      date: "Jan 15, 2025",
      title: "Brief Network Latency in EU Servers",
      description: "Users experienced slightly higher latency (5-10ms increase) in European servers for approximately 15 minutes.",
      status: "resolved",
      impact: "minor",
      duration: "15 minutes",
      affected: ["Germany", "Netherlands", "France"]
    },
    {
      date: "Jan 10, 2025", 
      title: "Scheduled Maintenance - Control Panel Update",
      description: "Planned maintenance to deploy new control panel features. All services remained operational.",
      status: "completed",
      impact: "none",
      duration: "30 minutes",
      affected: ["Control Panel"]
    },
    {
      date: "Jan 5, 2025",
      title: "DDoS Attack Mitigation",
      description: "Large-scale DDoS attack automatically mitigated by our protection systems. No service interruption.",
      status: "resolved", 
      impact: "none",
      duration: "2 minutes",
      affected: ["All Services"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return "text-green-500";
      case "degraded": return "text-yellow-500";
      case "down": return "text-red-500";
      default: return "text-gaming-gray";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "degraded": return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "down": return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Activity className="w-5 h-5 text-gaming-gray" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational": return <Badge className="bg-green-500/20 text-green-500">Operational</Badge>;
      case "degraded": return <Badge className="bg-yellow-500/20 text-yellow-500">Degraded</Badge>;
      case "down": return <Badge className="bg-red-500/20 text-red-500">Down</Badge>;
      default: return <Badge className="bg-gaming-gray/20 text-gaming-gray">Unknown</Badge>;
    }
  };

  const refreshStatus = () => {
    setLastUpdated(new Date());
  };

  return (
    <div className="min-h-screen bg-gaming-black">
      <PromoBanner />
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-gaming">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gaming-white mb-6">
              Service <span className="text-gaming-green">Status</span>
            </h1>
            <p className="text-xl text-gaming-gray mb-8">
              Real-time status of all GameHost Pro services and server locations.
            </p>
            
            <div className="flex items-center justify-center gap-4 mb-6">
              {getStatusIcon(overallStatus)}
              <span className="text-2xl font-semibold text-gaming-white">
                All Systems {overallStatus === "operational" ? "Operational" : "Issues Detected"}
              </span>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-gaming-gray">
              <Clock className="w-4 h-4" />
              <span>Last updated: {lastUpdated.toLocaleString()}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshStatus}
                className="text-gaming-green hover:text-gaming-green-dark"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Status */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">Core Services</h2>
            <p className="text-gaming-gray text-lg">Current status of our main services</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="bg-gaming-black-lighter border-gaming-black-lighter">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Server className="w-5 h-5 text-gaming-green" />
                      <h3 className="text-lg font-semibold text-gaming-white">{service.name}</h3>
                    </div>
                    {getStatusIcon(service.status)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {getStatusBadge(service.status)}
                    <div className="text-right">
                      <div className="text-gaming-white font-semibold">{service.uptime}</div>
                      <div className="text-gaming-gray text-sm">30-day uptime</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Server Locations */}
      <section className="py-20 bg-gaming-black-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">
              Server <span className="text-gaming-green">Locations</span>
            </h2>
            <p className="text-gaming-gray text-lg">Performance metrics from our global data centers</p>
            
            {/* IP Visibility Toggle */}
            <div className="flex justify-center mb-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setHideIPs(!hideIPs)}
                className="border-gaming-green/30 text-gaming-green hover:bg-gaming-green/10"
              >
                {hideIPs ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                {hideIPs ? 'Show IPs' : 'Hide IPs'}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {locations.map((location, index) => (
              <Card key={index} className="bg-gaming-black-lighter border-gaming-black-lighter hover:border-gaming-green/30 transition-colors">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gaming-green" />
                      <h3 className="text-gaming-white font-semibold text-sm sm:text-base">{location.name}</h3>
                    </div>
                    {getStatusIcon(location.status)}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-gaming-gray" />
                        <span className="text-gaming-gray text-xs sm:text-sm">Ping</span>
                      </div>
                      <span className="text-gaming-green font-semibold text-sm">{location.ping}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-gaming-gray" />
                        <span className="text-gaming-gray text-xs sm:text-sm">Players</span>
                      </div>
                      <span className="text-gaming-white font-semibold text-sm">{location.players}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-gaming-gray" />
                        <span className="text-gaming-gray text-xs sm:text-sm">IP</span>
                      </div>
                      <span className="text-gaming-white font-mono text-sm">
                        {hideIPs ? '•••.•••.•••.•••' : location.ip}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Incidents */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">Recent Events</h2>
            <p className="text-gaming-gray text-lg">Latest incidents and maintenance updates</p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {incidents.map((incident, index) => (
              <Card key={index} className="bg-gaming-black-lighter border-gaming-black-lighter">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gaming-white">{incident.title}</h3>
                        <Badge 
                          className={
                            incident.status === "resolved" ? "bg-green-500/20 text-green-500" :
                            incident.status === "completed" ? "bg-blue-500/20 text-blue-500" :
                            "bg-gaming-green/20 text-gaming-green"
                          }
                        >
                          {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-gaming-gray mb-3">{incident.description}</p>
                    </div>
                    <span className="text-gaming-gray text-sm whitespace-nowrap">{incident.date}</span>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gaming-gray">Impact: </span>
                      <span className={
                        incident.impact === "none" ? "text-green-500" :
                        incident.impact === "minor" ? "text-yellow-500" :
                        "text-red-500"
                      }>
                        {incident.impact.charAt(0).toUpperCase() + incident.impact.slice(1)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gaming-gray">Duration: </span>
                      <span className="text-gaming-white">{incident.duration}</span>
                    </div>
                    <div>
                      <span className="text-gaming-gray">Affected: </span>
                      <span className="text-gaming-white">{incident.affected.join(", ")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe to Updates */}
      <section className="py-20 bg-gradient-gaming">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gaming-white mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-gaming-gray mb-8">
            Get notified about service updates and maintenance windows.
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black font-semibold"
            >
              Subscribe to Updates
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-gaming-black"
            >
              Join Discord
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}