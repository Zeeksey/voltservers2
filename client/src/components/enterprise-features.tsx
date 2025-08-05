import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Zap,
  Users,
  Database,
  Globe,
  Clock,
  PhoneCall,
  Award,
  Lock,
  BarChart3,
  Settings,
  Headphones
} from "lucide-react";

export default function EnterpriseFeatures() {
  const enterpriseFeatures = [
    {
      icon: <Shield className="w-8 h-8 text-gaming-green" />,
      title: "Advanced DDoS Protection",
      description: "1.2 Tbps enterprise-grade protection with automatic mitigation",
      benefits: ["Layer 3/4/7 protection", "Real-time attack monitoring", "Zero downtime guarantee"]
    },
    {
      icon: <Database className="w-8 h-8 text-gaming-green" />,
      title: "Dedicated Infrastructure",
      description: "Isolated hardware resources for maximum performance",
      benefits: ["Dedicated CPU cores", "Private network", "Custom configurations"]
    },
    {
      icon: <Users className="w-8 h-8 text-gaming-green" />,
      title: "Multi-User Management",
      description: "Advanced team collaboration and permission controls",
      benefits: ["Role-based access", "Audit logging", "Team workspaces"]
    },
    {
      icon: <Headphones className="w-8 h-8 text-gaming-green" />,
      title: "Priority Support",
      description: "Dedicated support team with guaranteed response times",
      benefits: ["2-minute response", "Dedicated account manager", "Phone support"]
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-gaming-green" />,
      title: "Advanced Analytics",
      description: "Comprehensive insights and performance monitoring",
      benefits: ["Real-time metrics", "Custom dashboards", "API access"]
    },
    {
      icon: <Lock className="w-8 h-8 text-gaming-green" />,
      title: "Enterprise Security",
      description: "Advanced security features for mission-critical applications",
      benefits: ["SSL certificates", "VPN access", "Security audits"]
    }
  ];

  const complianceStandards = [
    { name: "SOC 2 Type II", status: "Certified" },
    { name: "GDPR Compliant", status: "Verified" },
    { name: "PCI DSS Level 1", status: "Certified" },
    { name: "ISO 27001", status: "Certified" }
  ];

  return (
    <section className="py-20 bg-gaming-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-gaming-green/20 text-gaming-green border-gaming-green/30 mb-4">
            Enterprise Solutions
          </Badge>
          <h2 className="text-4xl font-bold text-gaming-white mb-6">
            Built for <span className="text-gaming-green">Enterprise</span>
          </h2>
          <p className="text-xl text-gaming-gray max-w-3xl mx-auto">
            Scale your gaming infrastructure with enterprise-grade features, 
            dedicated support, and compliance-ready solutions.
          </p>
        </div>

        {/* Enterprise Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {enterpriseFeatures.map((feature, index) => (
            <Card key={index} className="bg-gaming-dark border-gaming-green/20 hover:border-gaming-green/40 transition-all group">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-gaming-green/20 rounded-lg group-hover:bg-gaming-green/30 transition-colors">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-gaming-white text-lg">{feature.title}</CardTitle>
                </div>
                <p className="text-gaming-gray">{feature.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gaming-gray">
                      <div className="w-1.5 h-1.5 bg-gaming-green rounded-full mr-3 flex-shrink-0"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Compliance & Certifications */}
        <Card className="bg-gaming-dark border-gaming-green/20 mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-gaming-white text-2xl flex items-center justify-center">
              <Award className="w-6 h-6 text-gaming-green mr-3" />
              Compliance & Certifications
            </CardTitle>
            <p className="text-gaming-gray">
              We maintain the highest security and compliance standards
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              {complianceStandards.map((standard, index) => (
                <div key={index} className="text-center p-6 bg-gaming-black-lighter rounded-lg border border-gaming-green/20">
                  <div className="w-12 h-12 bg-gaming-green/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-gaming-green" />
                  </div>
                  <h3 className="text-gaming-white font-semibold mb-1">{standard.name}</h3>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    {standard.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enterprise Support Tiers */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gaming-dark border-gaming-green/20">
            <CardHeader>
              <CardTitle className="text-gaming-white">Business</CardTitle>
              <p className="text-gaming-gray">Enhanced support for growing teams</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center text-gaming-gray">
                  <Clock className="w-4 h-4 mr-2 text-gaming-green" />
                  4-hour response time
                </div>
                <div className="flex items-center text-gaming-gray">
                  <Headphones className="w-4 h-4 mr-2 text-gaming-green" />
                  Email & chat support
                </div>
                <div className="flex items-center text-gaming-gray">
                  <Settings className="w-4 h-4 mr-2 text-gaming-green" />
                  Advanced configurations
                </div>
              </div>
              <Button variant="outline" className="w-full border-gaming-green/30 text-gaming-green">
                Contact Sales
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gaming-dark border-gaming-green/40 ring-2 ring-gaming-green/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-gaming-white">Enterprise</CardTitle>
                <Badge className="bg-gaming-green/20 text-gaming-green border-gaming-green/30">
                  Popular
                </Badge>
              </div>
              <p className="text-gaming-gray">Complete enterprise solution</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center text-gaming-gray">
                  <Clock className="w-4 h-4 mr-2 text-gaming-green" />
                  2-minute response time
                </div>
                <div className="flex items-center text-gaming-gray">
                  <PhoneCall className="w-4 h-4 mr-2 text-gaming-green" />
                  24/7 phone support
                </div>
                <div className="flex items-center text-gaming-gray">
                  <Users className="w-4 h-4 mr-2 text-gaming-green" />
                  Dedicated account manager
                </div>
              </div>
              <Button className="w-full bg-gaming-green hover:bg-gaming-green-dark text-gaming-black">
                Get Enterprise Quote
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gaming-dark border-gaming-green/20">
            <CardHeader>
              <CardTitle className="text-gaming-white">Custom</CardTitle>
              <p className="text-gaming-gray">Tailored solutions for unique needs</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center text-gaming-gray">
                  <Zap className="w-4 h-4 mr-2 text-gaming-green" />
                  Custom SLA agreements
                </div>
                <div className="flex items-center text-gaming-gray">
                  <Globe className="w-4 h-4 mr-2 text-gaming-green" />
                  Private cloud options
                </div>
                <div className="flex items-center text-gaming-gray">
                  <Database className="w-4 h-4 mr-2 text-gaming-green" />
                  Custom integrations
                </div>
              </div>
              <Button variant="outline" className="w-full border-gaming-green/30 text-gaming-green">
                Discuss Requirements
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-gaming-green/10 to-gaming-green/5 rounded-2xl p-12">
          <h3 className="text-3xl font-bold text-gaming-white mb-4">
            Ready to Scale Your Infrastructure?
          </h3>
          <p className="text-gaming-gray text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of enterprises trusting GameHost Pro for their 
            mission-critical gaming infrastructure needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black">
              Schedule Demo
            </Button>
            <Button size="lg" variant="outline" className="border-gaming-green/30 text-gaming-green">
              Download Enterprise Brochure
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}