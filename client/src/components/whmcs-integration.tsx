import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ExternalLink, 
  CreditCard, 
  FileText, 
  Settings, 
  Users,
  Shield,
  BarChart3,
  HelpCircle,
  Calendar,
  Download
} from "lucide-react";

export default function WHMCSIntegration() {
  const whmcsServices = [
    {
      icon: <CreditCard className="w-6 h-6 text-gaming-green" />,
      title: "Billing Management",
      description: "View invoices, payment history, and manage payment methods",
      features: ["Invoice Downloads", "Payment History", "Auto-Pay Setup", "Billing Alerts"],
      status: "Active"
    },
    {
      icon: <FileText className="w-6 h-6 text-gaming-green" />,
      title: "Support Tickets",
      description: "Create and manage support tickets with our team",
      features: ["Priority Support", "File Attachments", "Live Updates", "Ticket History"],
      status: "Available"
    },
    {
      icon: <Settings className="w-6 h-6 text-gaming-green" />,
      title: "Account Management",
      description: "Update your profile, security settings, and preferences",
      features: ["Profile Updates", "Security Settings", "Notifications", "API Access"],
      status: "Active"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-gaming-green" />,
      title: "Usage Analytics",
      description: "Monitor your resource usage and service statistics",
      features: ["Bandwidth Usage", "Storage Analytics", "Performance Metrics", "Cost Tracking"],
      status: "Beta"
    }
  ];

  const recentActivity = [
    {
      type: "invoice",
      title: "Invoice #INV-2024-001 Generated",
      description: "Monthly hosting services - $29.99",
      date: "2 hours ago",
      status: "pending"
    },
    {
      type: "payment",
      title: "Payment Processed",
      description: "Credit Card ending in 4242 - $29.99",
      date: "1 day ago",
      status: "completed"
    },
    {
      type: "support",
      title: "Support Ticket Resolved",
      description: "Server configuration assistance",
      date: "3 days ago",
      status: "resolved"
    },
    {
      type: "update",
      title: "Service Upgraded",
      description: "Minecraft Pro plan activated",
      date: "1 week ago",
      status: "completed"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Available': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Beta': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gaming-green/20 text-gaming-green border-gaming-green/30';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'invoice': return <FileText className="w-4 h-4" />;
      case 'payment': return <CreditCard className="w-4 h-4" />;
      case 'support': return <HelpCircle className="w-4 h-4" />;
      case 'update': return <Settings className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* WHMCS Services Grid */}
      <Card className="bg-gaming-dark border-gaming-green/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gaming-white text-2xl flex items-center">
              <Shield className="w-6 h-6 text-gaming-green mr-3" />
              WHMCS Integration
            </CardTitle>
            <Badge className="bg-gaming-green/20 text-gaming-green border-gaming-green/30">
              Secure Connection
            </Badge>
          </div>
          <p className="text-gaming-gray">
            Access advanced account management features through our secure WHMCS integration
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whmcsServices.map((service, index) => (
              <div key={index} className="bg-gaming-black-lighter border border-gaming-green/20 rounded-lg p-6 hover:border-gaming-green/40 transition-colors group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gaming-green/20 rounded-lg group-hover:bg-gaming-green/30 transition-colors">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="text-gaming-white font-semibold">{service.title}</h3>
                      <Badge className={getStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="text-gaming-gray text-sm mb-4">{service.description}</p>
                <div className="space-y-2 mb-4">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gaming-gray">
                      <div className="w-1.5 h-1.5 bg-gaming-green rounded-full mr-3 flex-shrink-0"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-gaming-green/30 text-gaming-green hover:bg-gaming-green/10"
                  disabled={service.status === 'Beta'}
                >
                  {service.status === 'Beta' ? 'Coming Soon' : 'Access Now'}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-gaming-dark border-gaming-green/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gaming-white text-xl">Recent Account Activity</CardTitle>
            <Button variant="outline" size="sm" className="border-gaming-green/30 text-gaming-green">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gaming-black-lighter rounded-lg border border-gaming-green/10">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gaming-green/20 rounded-lg flex items-center justify-center">
                    <span className="text-gaming-green">
                      {getActivityIcon(activity.type)}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-gaming-white font-medium">{activity.title}</h4>
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                  </div>
                  <p className="text-gaming-gray text-sm">{activity.description}</p>
                  <p className="text-gaming-gray text-xs mt-1">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration Info */}
      <Card className="bg-gradient-to-r from-gaming-green/10 to-gaming-green/5 border-gaming-green/20">
        <CardContent className="p-8 text-center">
          <Shield className="w-12 h-12 text-gaming-green mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gaming-white mb-2">
            Secure WHMCS Integration
          </h3>
          <p className="text-gaming-gray mb-6 max-w-2xl mx-auto">
            Our WHMCS integration provides enterprise-grade billing, support, and account management 
            with bank-level security and 99.9% uptime guarantee.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black">
              Access Full Portal
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" className="border-gaming-green/30 text-gaming-green">
              Integration Guide
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}