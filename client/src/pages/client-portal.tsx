import PromoBanner from "@/components/promo-banner";
import Navigation from "@/components/navigation";
import WHMCSIntegration from "@/components/whmcs-integration";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Server, 
  CreditCard, 
  FileText, 
  Settings, 
  BarChart3, 
  Shield,
  Clock,
  Users,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { Link } from "wouter";

export default function ClientPortal() {
  const quickActions = [
    {
      icon: <Server className="w-6 h-6 text-gaming-green" />,
      title: "Manage Servers",
      description: "Control your game servers",
      href: "/dashboard",
      external: false
    },
    {
      icon: <CreditCard className="w-6 h-6 text-gaming-green" />,
      title: "Billing & Invoices",
      description: "View billing history",
      href: "/pricing",
      external: false
    },
    {
      icon: <FileText className="w-6 h-6 text-gaming-green" />,
      title: "Support Tickets",
      description: "Get help from our team",
      href: "/support",
      external: false
    },
    {
      icon: <Settings className="w-6 h-6 text-gaming-green" />,
      title: "Account Settings",
      description: "Update your profile",
      href: "/dashboard",
      external: false
    }
  ];

  const accountStats = [
    { label: "Active Services", value: "3", icon: <Server className="w-5 h-5" /> },
    { label: "Total Uptime", value: "99.9%", icon: <Clock className="w-5 h-5" /> },
    { label: "Data Transfer", value: "2.4TB", icon: <BarChart3 className="w-5 h-5" /> },
    { label: "Support Score", value: "5.0", icon: <Shield className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gaming-black">
      <title>Client Portal - GameHost Pro | Account Management</title>
      <meta name="description" content="Access your GameHost Pro client portal. Manage services, view billing, create support tickets, and monitor your game servers." />
      
      <PromoBanner />
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-gaming">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gaming-white mb-6">
              Client <span className="text-gaming-green">Portal</span>
            </h1>
            <p className="text-xl text-gaming-gray mb-8">
              Manage your services, billing, and support tickets all in one place
            </p>
          </div>
        </div>
      </section>

      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto space-y-8">
          {/* Account Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {accountStats.map((stat, index) => (
              <Card key={index} className="bg-gaming-dark border-gaming-green/20">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-gaming-green/20 rounded-lg mx-auto mb-3">
                    <span className="text-gaming-green">{stat.icon}</span>
                  </div>
                  <div className="text-2xl font-bold text-gaming-green mb-1">{stat.value}</div>
                  <div className="text-gaming-gray text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="bg-gaming-dark border-gaming-green/20">
            <CardHeader>
              <CardTitle className="text-gaming-white text-2xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action, index) => (
                  <div key={index}>
                    {action.external ? (
                      <div className="bg-gaming-black-lighter border border-gaming-green/20 rounded-lg p-6 text-center hover:border-gaming-green/40 transition-colors group cursor-pointer">
                        <div className="flex items-center justify-center w-12 h-12 bg-gaming-green/20 rounded-lg mx-auto mb-4 group-hover:bg-gaming-green/30 transition-colors">
                          {action.icon}
                        </div>
                        <h3 className="text-gaming-white font-semibold mb-2 group-hover:text-gaming-green transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-gaming-gray text-sm mb-4">{action.description}</p>
                        <div className="flex items-center justify-center text-gaming-green text-sm">
                          <span className="mr-1">Access via WHMCS</span>
                          <ExternalLink className="w-4 h-4" />
                        </div>
                      </div>
                    ) : (
                      <Link href={action.href}>
                        <div className="bg-gaming-black-lighter border border-gaming-green/20 rounded-lg p-6 text-center hover:border-gaming-green/40 transition-colors group cursor-pointer">
                          <div className="flex items-center justify-center w-12 h-12 bg-gaming-green/20 rounded-lg mx-auto mb-4 group-hover:bg-gaming-green/30 transition-colors">
                            {action.icon}
                          </div>
                          <h3 className="text-gaming-white font-semibold mb-2 group-hover:text-gaming-green transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-gaming-gray text-sm mb-4">{action.description}</p>
                          <div className="flex items-center justify-center text-gaming-green text-sm">
                            <span className="mr-1">Access Now</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* WHMCS Integration */}
          <WHMCSIntegration />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}