import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Globe, Globe2 } from "lucide-react";
import type { ServerStatus as ServerStatusType, ServerLocation } from "@shared/schema";

export default function ServerStatus() {
  const { data: statusData, isLoading: statusLoading } = useQuery<ServerStatusType[]>({
    queryKey: ['/api/server-status'],
  });

  const { data: locations, isLoading: locationsLoading } = useQuery<ServerLocation[]>({
    queryKey: ['/api/server-locations'],
  });

  if (statusLoading || locationsLoading) {
    return (
      <section id="status" className="py-20 bg-gaming-black-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-gaming-green">Server</span> Status
            </h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-gaming-black-lighter rounded-xl p-6 animate-pulse">
              <div className="h-8 bg-gaming-black rounded mb-6" />
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 bg-gaming-black rounded" />
                ))}
              </div>
            </div>
            <div className="bg-gaming-black-lighter rounded-xl p-6 animate-pulse">
              <div className="h-8 bg-gaming-black rounded mb-6" />
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gaming-black rounded" />
                    <div className="h-2 bg-gaming-black rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const overallStatus = statusData?.every(s => s.status === 'operational') ? 'operational' : 'degraded';

  return (
    <section id="status" className="py-20 bg-gaming-black-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gaming-green">Server</span> Status
          </h2>
          <p className="text-xl text-gaming-gray max-w-3xl mx-auto">
            Real-time monitoring of our infrastructure. All systems operational with 99.9% uptime.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Overall Status */}
          <Card className="bg-gaming-black-lighter border-gaming-black-lighter">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gaming-white">Overall Status</h3>
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${overallStatus === 'operational' ? 'bg-gaming-green animate-pulse-green' : 'bg-red-500'}`} />
                  <span className={`font-semibold ${overallStatus === 'operational' ? 'text-gaming-green' : 'text-red-500'}`}>
                    {overallStatus === 'operational' ? 'All Systems Operational' : 'Some Issues Detected'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                {statusData?.map((service) => (
                  <div key={service.id} className="flex items-center justify-between">
                    <span className="text-gaming-gray">{service.service}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${service.status === 'operational' ? 'bg-gaming-green animate-pulse-green' : 'bg-red-500'}`} />
                      <span className={`text-sm ${service.status === 'operational' ? 'text-gaming-green' : 'text-red-500'}`}>
                        {service.status === 'operational' ? 'Operational' : 'Degraded'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="bg-gaming-black-lighter border-gaming-black-lighter">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gaming-white mb-6">Performance Metrics</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gaming-gray">Average Response Time</span>
                    <span className="text-gaming-green font-semibold">
                      {statusData?.[0]?.responseTime || 12}ms
                    </span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gaming-gray">Server Uptime</span>
                    <span className="text-gaming-green font-semibold">
                      {statusData?.[0]?.uptime || "99.97"}%
                    </span>
                  </div>
                  <Progress value={parseFloat(statusData?.[0]?.uptime?.toString() || "99.97")} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gaming-gray">Network Quality</span>
                    <span className="text-gaming-green font-semibold">Excellent</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Server Locations */}
        <Card className="bg-gaming-black-lighter border-gaming-black-lighter">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gaming-white mb-6">Server Locations</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {locations?.map((location) => (
                <div key={location.id} className="text-center p-4 bg-gaming-black rounded-lg">
                  <div className="text-gaming-green text-2xl mb-2">
                    {location.region === 'North America' && <Globe />}
                    {location.region === 'Europe' && <Globe2 />}
                    {location.region === 'Asia Pacific' && <Globe />}
                    {location.region === 'Australia' && <Globe2 />}
                  </div>
                  <div className="text-gaming-white font-semibold">{location.region}</div>
                  <div className="text-gaming-gray text-sm">{location.name}</div>
                  <div className="flex items-center justify-center mt-2">
                    <span className={`w-2 h-2 rounded-full mr-2 ${location.status === 'online' ? 'bg-gaming-green animate-pulse-green' : 'bg-red-500'}`} />
                    <span className={`text-sm ${location.status === 'online' ? 'text-gaming-green' : 'text-red-500'}`}>
                      {location.status === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
