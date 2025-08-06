import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Zap,
  Globe,
  Shield,
  Activity,
  MapPin,
  RefreshCw,
  Cpu
} from "lucide-react";
import Navigation from "@/components/navigation";
import PromoBanner from "@/components/promo-banner";
import Footer from "@/components/footer";
import NewsletterSubscription from "@/components/newsletter-subscription";
import { useQuery } from '@tanstack/react-query';

export default function StatusPage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Fetch server locations
  const { data: serverLocations = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/server-locations'],
  });

  const systemStatuses = [
    { name: "Game Servers", status: "operational", uptime: "99.98%" },
    { name: "Web Console", status: "operational", uptime: "99.95%" },
    { name: "Database", status: "operational", uptime: "99.99%" },
    { name: "File Manager", status: "operational", uptime: "99.92%" },
    { name: "Backups System", status: "operational", uptime: "99.97%" },
    { name: "Monitoring", status: "operational", uptime: "99.99%" },
    { name: "API Services", status: "operational", uptime: "99.96%" },
    { name: "Support System", status: "operational", uptime: "99.94%" },
    { name: "Billing System", status: "operational", uptime: "99.96%" }
  ];

  // Fetch incidents from the database
  const { data: incidents = [], isLoading: incidentsLoading } = useQuery<any[]>({
    queryKey: ['/api/incidents'],
  });

  // Convert server locations to status format
  const locations = serverLocations.map(location => ({
    name: `${location.city}, ${location.country}`,
    status: location.status,
    ping: location.ping ? `${location.ping}ms` : 'N/A',
    specs: 'High-Performance Gaming Server'
  }));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
      case "online":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "degraded":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "maintenance":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "offline":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
      case "online":
        return "text-green-500";
      case "degraded":
        return "text-yellow-500";
      case "maintenance":
        return "text-blue-500";
      case "offline":
        return "text-red-500";
      default:
        return "text-green-500";
    }
  };

  const getIncidentStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs rounded-full";
    switch (status) {
      case "resolved":
        return `${baseClasses} bg-green-500/10 text-green-500 border border-green-500/20`;
      case "investigating":
        return `${baseClasses} bg-yellow-500/10 text-yellow-500 border border-yellow-500/20`;
      case "identified":
        return `${baseClasses} bg-orange-500/10 text-orange-500 border border-orange-500/20`;
      case "monitoring":
        return `${baseClasses} bg-blue-500/10 text-blue-500 border border-blue-500/20`;
      case "completed":
        return `${baseClasses} bg-green-500/10 text-green-500 border border-green-500/20`;
      default:
        return `${baseClasses} bg-gray-500/10 text-gray-500 border border-gray-500/20`;
    }
  };

  return (
    <div className="min-h-screen bg-gaming-black text-gaming-white">
      <PromoBanner />
      <Navigation />
      
      {/* Header */}
      <section className="pt-20 pb-12 bg-gradient-gaming">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="w-8 h-8 text-gaming-green" />
              <Badge className="bg-green-500/10 text-green-500 border border-green-500/20">
                All Systems Operational
              </Badge>
            </div>
            <h1 className="text-5xl font-bold text-gaming-white mb-4">System Status</h1>
            <p className="text-xl text-gaming-gray mb-6">
              Real-time status of all VoltServers services and infrastructure
            </p>
            <p className="text-gaming-gray">
              Last updated: {currentTime.toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      {/* Overall Status */}
      <section className="py-12 bg-gaming-black-light">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gaming-black-lighter border-gaming-green/30">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-gaming-green mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gaming-white mb-2">System Health</h3>
                <p className="text-3xl font-bold text-gaming-green mb-1">99.97%</p>
                <p className="text-gaming-gray">Overall Uptime</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gaming-black-lighter border-gaming-green/30">
              <CardContent className="p-6 text-center">
                <Globe className="w-12 h-12 text-gaming-green mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gaming-white mb-2">Active Servers</h3>
                <p className="text-3xl font-bold text-gaming-green mb-1">2,847</p>
                <p className="text-gaming-gray">Currently Running</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gaming-black-lighter border-gaming-green/30">
              <CardContent className="p-6 text-center">
                <Activity className="w-12 h-12 text-gaming-green mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gaming-white mb-2">Response Time</h3>
                <p className="text-3xl font-bold text-gaming-green mb-1">12ms</p>
                <p className="text-gaming-gray">Average Latency</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* System Status */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gaming-white mb-8 text-center">Service Status</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systemStatuses.map((service, index) => (
              <Card key={index} className="bg-gaming-black-lighter border-gaming-green/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gaming-white">{service.name}</h3>
                    {getStatusIcon(service.status)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gaming-gray text-sm">Status</span>
                      <span className={`capitalize font-semibold ${getStatusColor(service.status)}`}>
                        {service.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gaming-gray text-sm">Uptime</span>
                      <span className="text-gaming-green font-semibold">{service.uptime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Server Locations */}
      <section className="py-16 bg-gaming-black-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">Global Infrastructure</h2>
            <p className="text-gaming-gray text-lg">Our worldwide network of high-performance servers</p>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gaming-green mx-auto"></div>
              <p className="text-gaming-gray mt-4">Loading server locations...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map((location, index) => (
                <Card key={index} className="bg-gaming-black-lighter border-gaming-green/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gaming-green" />
                        <h3 className="text-lg font-semibold text-gaming-white">{location.name}</h3>
                      </div>
                      {getStatusIcon(location.status)}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 text-gaming-gray" />
                          <span className="text-gaming-gray text-xs sm:text-sm">Ping</span>
                        </div>
                        <span className="text-gaming-green font-semibold text-sm">{location.ping}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-gaming-gray" />
                          <span className="text-gaming-gray text-xs sm:text-sm">Server Type</span>
                        </div>
                        <span className="text-gaming-white font-semibold text-sm">{location.specs}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Events */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gaming-white mb-4">Recent Events</h2>
            <p className="text-gaming-gray text-lg">Latest incidents and maintenance updates</p>
          </div>
          
          {incidentsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gaming-green mx-auto"></div>
              <p className="text-gaming-gray mt-4">Loading recent events...</p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {incidents.map((incident, index) => (
                <Card key={index} className="bg-gaming-black-lighter border-gaming-black-lighter">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gaming-white mb-2">
                          {incident.title}
                        </h3>
                        <p className="text-gaming-gray mb-4">{incident.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getIncidentStatusBadge(incident.status)}>
                          {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                        </Badge>
                        <span className="text-gaming-gray text-sm whitespace-nowrap">
                          {new Date(incident.incidentDate || incident.date).toLocaleDateString()}
                        </span>
                      </div>
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
                        <span className="text-gaming-white">{incident.affectedServices?.join(", ") || incident.affected?.join(", ") || 'N/A'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Subscribe to Updates */}
      <NewsletterSubscription />

      <Footer />
    </div>
  );
}