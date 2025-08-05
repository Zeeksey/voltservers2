import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  CreditCard, 
  Server, 
  ShoppingCart, 
  Eye, 
  Lock, 
  LogIn,
  UserPlus,
  Package,
  Bell,
  Calendar,
  DollarSign
} from "lucide-react";

interface WHMCSAccount {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  status: 'active' | 'inactive' | 'suspended';
  credit: number;
  services: WHMCSService[];
  invoices: WHMCSInvoice[];
}

interface WHMCSService {
  id: string;
  productName: string;
  domain: string;
  status: 'active' | 'suspended' | 'terminated';
  nextDueDate: string;
  recurringAmount: number;
  billingCycle: string;
}

interface WHMCSInvoice {
  id: string;
  date: string;
  dueDate: string;
  total: number;
  status: 'paid' | 'unpaid' | 'overdue';
  description: string;
}

// Mock WHMCS data for demo purposes
const mockAccount: WHMCSAccount = {
  id: "12345",
  email: "demo@gamehostpro.com",
  firstName: "John",
  lastName: "Gamer",
  companyName: "Pro Gaming Corp",
  status: "active",
  credit: 45.50,
  services: [
    {
      id: "svc001",
      productName: "Minecraft Server - Premium",
      domain: "mc.example.com",
      status: "active",
      nextDueDate: "2025-02-15",
      recurringAmount: 19.99,
      billingCycle: "Monthly"
    },
    {
      id: "svc002", 
      productName: "CS2 Server - Pro",
      domain: "cs2.example.com",
      status: "active",
      nextDueDate: "2025-02-10",
      recurringAmount: 24.99,
      billingCycle: "Monthly"
    }
  ],
  invoices: [
    {
      id: "inv001",
      date: "2025-01-15",
      dueDate: "2025-01-30",
      total: 19.99,
      status: "paid",
      description: "Minecraft Server - Premium (Jan 2025)"
    },
    {
      id: "inv002",
      date: "2025-01-10", 
      dueDate: "2025-01-25",
      total: 24.99,
      status: "unpaid",
      description: "CS2 Server - Pro (Jan 2025)"
    }
  ]
};

export default function WHMCSIntegration() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    companyName: ""
  });
  const [account, setAccount] = useState<WHMCSAccount | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo login - accept any credentials
    setIsLoggedIn(true);
    setAccount(mockAccount);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo registration
    const newAccount: WHMCSAccount = {
      id: "new123",
      email: registerForm.email,
      firstName: registerForm.firstName,
      lastName: registerForm.lastName,
      companyName: registerForm.companyName,
      status: "active",
      credit: 0,
      services: [],
      invoices: []
    };
    setIsLoggedIn(true);
    setAccount(newAccount);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAccount(null);
    setLoginForm({ email: "", password: "" });
  };

  if (!isLoggedIn) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gaming-white mb-4">Client Portal</h2>
          <p className="text-gaming-gray">Manage your game servers and billing through our WHMCS integration</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </TabsTrigger>
            <TabsTrigger value="register">
              <UserPlus className="h-4 w-4 mr-2" />
              Register
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login to Your Account</CardTitle>
                <CardDescription>Access your servers and billing information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gaming-green text-gaming-black hover:shadow-lg">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login to Portal
                  </Button>
                  <p className="text-sm text-gaming-gray text-center">
                    Demo: Use any email/password to login
                  </p>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create New Account</CardTitle>
                <CardDescription>Join GameHost Pro and start hosting servers</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={registerForm.firstName}
                        onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={registerForm.lastName}
                        onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="companyName">Company Name (Optional)</Label>
                    <Input
                      id="companyName"
                      value={registerForm.companyName}
                      onChange={(e) => setRegisterForm({ ...registerForm, companyName: e.target.value })}
                      placeholder="Your Company"
                    />
                  </div>
                  <div>
                    <Label htmlFor="regEmail">Email Address</Label>
                    <Input
                      id="regEmail"
                      type="email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="regPassword">Password</Label>
                    <Input
                      id="regPassword"
                      type="password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gaming-green text-gaming-black hover:shadow-lg">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Account
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gaming-white">
            Welcome back, {account?.firstName}!
          </h2>
          <p className="text-gaming-gray">Manage your services and account</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="border-gaming-green text-gaming-green">
            <DollarSign className="h-3 w-3 mr-1" />
            Credit: ${account?.credit.toFixed(2)}
          </Badge>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Server className="h-5 w-5 mr-2 text-gaming-green" />
              Active Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gaming-green mb-1">
              {account?.services.filter(s => s.status === 'active').length || 0}
            </div>
            <p className="text-sm text-gaming-gray">Running servers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-yellow-500" />
              Unpaid Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500 mb-1">
              {account?.invoices.filter(i => i.status === 'unpaid').length || 0}
            </div>
            <p className="text-sm text-gaming-gray">Pending payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-500" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge 
              variant="outline" 
              className={`mb-2 ${account?.status === 'active' ? 'border-gaming-green text-gaming-green' : 'border-red-500 text-red-500'}`}
            >
              {account?.status?.toUpperCase()}
            </Badge>
            <p className="text-sm text-gaming-gray">Current status</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Services</CardTitle>
            <CardDescription>Manage your active game servers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {account?.services.map((service) => (
                <div key={service.id} className="border border-gaming-black rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gaming-white">{service.productName}</h4>
                      <p className="text-sm text-gaming-gray">{service.domain}</p>
                    </div>
                    <Badge 
                      variant="outline"
                      className={service.status === 'active' ? 'border-gaming-green text-gaming-green' : 'border-red-500 text-red-500'}
                    >
                      {service.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gaming-gray">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      Due: {service.nextDueDate}
                    </span>
                    <span className="font-semibold text-gaming-green">
                      ${service.recurringAmount}/{service.billingCycle.toLowerCase()}
                    </span>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Manage
                    </Button>
                    <Button size="sm" variant="outline">
                      <Lock className="h-3 w-3 mr-1" />
                      Control Panel
                    </Button>
                  </div>
                </div>
              ))}
              {(!account?.services || account.services.length === 0) && (
                <div className="text-center py-8 text-gaming-gray">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No active services</p>
                  <Button className="mt-4 bg-gaming-green text-gaming-black">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Order New Service
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>Your billing history and pending payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {account?.invoices.map((invoice) => (
                <div key={invoice.id} className="border border-gaming-black rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gaming-white">Invoice #{invoice.id}</h4>
                      <p className="text-sm text-gaming-gray">{invoice.description}</p>
                    </div>
                    <Badge 
                      variant="outline"
                      className={
                        invoice.status === 'paid' ? 'border-gaming-green text-gaming-green' :
                        invoice.status === 'overdue' ? 'border-red-500 text-red-500' :
                        'border-yellow-500 text-yellow-500'
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gaming-gray">Due: {invoice.dueDate}</span>
                    <span className="font-semibold text-gaming-white">${invoice.total}</span>
                  </div>
                  {invoice.status !== 'paid' && (
                    <Button size="sm" className="mt-3 bg-gaming-green text-gaming-black">
                      <CreditCard className="h-3 w-3 mr-1" />
                      Pay Now
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}