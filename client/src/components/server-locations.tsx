import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Wifi, WifiOff, Clock } from "lucide-react";

interface ServerLocation {
  id: string;
  city: string;
  country: string;
  region: string;
  provider: string;
  ipAddress: string;
  status: string;
  ping: number;
}

export default function ServerLocations() {
  const { data: locations, isLoading } = useQuery<ServerLocation[]>({
    queryKey: ["/api/server-locations"],
    refetchInterval: 30000, // Refresh every 30 seconds to update ping data
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gaming-gray-dark/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gaming-white mb-4">Server Locations</h2>
            <p className="text-gaming-gray">Loading server locations...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!locations || locations.length === 0) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
        return 'bg-green-500';
      case 'maintenance':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
        return <Wifi className="h-4 w-4" />;
      case 'maintenance':
        return <Clock className="h-4 w-4" />;
      case 'offline':
        return <WifiOff className="h-4 w-4" />;
      default:
        return <WifiOff className="h-4 w-4" />;
    }
  };

  const getPingColor = (ping: number) => {
    if (ping <= 50) return 'text-green-400';
    if (ping <= 100) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <section className="py-16 bg-gaming-gray-dark/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gaming-white mb-4">Global Server Locations</h2>
          <p className="text-gaming-gray">Choose from our worldwide network of high-performance servers</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location) => (
            <Card key={location.id} className="bg-gaming-black/60 border-gaming-gray-dark hover:border-gaming-green transition-colors">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gaming-green" />
                    <CardTitle className="text-lg text-gaming-white">
                      {location.city}, {location.country}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(location.status)}
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(location.status)}`} />
                  </div>
                </div>
                <p className="text-gaming-gray text-sm">{location.region}</p>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gaming-gray text-sm">Provider:</span>
                  <Badge variant="secondary" className="bg-gaming-green/20 text-gaming-green">
                    {location.provider}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gaming-gray text-sm">IP Address:</span>
                  <code className="text-gaming-white text-sm bg-gaming-gray-dark px-2 py-1 rounded">
                    {location.ipAddress}
                  </code>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gaming-gray text-sm">Status:</span>
                  <Badge 
                    variant="secondary" 
                    className={`${getStatusColor(location.status)} text-white`}
                  >
                    {location.status.charAt(0).toUpperCase() + location.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gaming-gray text-sm">Ping:</span>
                  <span className={`text-sm font-medium ${getPingColor(location.ping)}`}>
                    {location.ping}ms
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}