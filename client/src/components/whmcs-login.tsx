import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn, User, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface WHMCSLoginProps {
  onLoginSuccess: (clientData: any) => void;
  whmcsConnected: boolean;
}

export default function WHMCSLogin({ onLoginSuccess, whmcsConnected }: WHMCSLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await fetch('/api/whmcs/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success && data.client) {
        // Store client ID in localStorage for session persistence
        localStorage.setItem('whmcs_client_id', data.client.id);
        localStorage.setItem('whmcs_client_data', JSON.stringify(data.client));
        onLoginSuccess(data.client);
        
        // Invalidate and refetch WHMCS data with the new client ID
        queryClient.invalidateQueries({ queryKey: ['/api/whmcs/clients'] });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      loginMutation.mutate({ email, password });
    }
  };

  // Demo login when WHMCS is not connected
  const handleDemoLogin = () => {
    const demoClient = {
      id: 'demo-123',
      firstname: 'Demo',
      lastname: 'User',
      email: 'demo@voltservers.com',
      status: 'Active',
      companyname: 'VoltServers Demo',
      phonenumber: '(555) 123-4567'
    };
    
    localStorage.setItem('whmcs_client_id', demoClient.id);
    localStorage.setItem('whmcs_client_data', JSON.stringify(demoClient));
    onLoginSuccess(demoClient);
  };

  if (!whmcsConnected) {
    return (
      <Card className="bg-gaming-dark border-gaming-green/20">
        <CardHeader className="text-center">
          <CardTitle className="text-gaming-white text-2xl flex items-center justify-center gap-2">
            <AlertCircle className="w-6 h-6 text-yellow-500" />
            Demo Mode Available
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Alert className="bg-gaming-dark border-yellow-500/20">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-gaming-gray">
              WHMCS billing system is temporarily unavailable. You can explore the client portal using demo mode.
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={handleDemoLogin}
            className="w-full bg-gaming-green hover:bg-gaming-green/80 text-gaming-black font-semibold"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Continue with Demo Account
          </Button>
          
          <p className="text-gaming-gray text-sm">
            Demo mode shows sample data and functionality. Contact support for WHMCS access.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gaming-dark border-gaming-green/20 max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-gaming-white text-2xl flex items-center justify-center gap-2">
          <LogIn className="w-6 h-6 text-gaming-green" />
          Client Portal Login
        </CardTitle>
        <p className="text-gaming-gray">
          Login with your WHMCS account credentials to access your services
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gaming-white">Email Address</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gaming-gray" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="pl-10 bg-gaming-black-lighter border-gaming-green/20 text-gaming-white placeholder:text-gaming-gray focus:border-gaming-green"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-gaming-white">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gaming-gray" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="pl-10 bg-gaming-black-lighter border-gaming-green/20 text-gaming-white placeholder:text-gaming-gray focus:border-gaming-green"
                required
              />
            </div>
          </div>

          {loginMutation.error && (
            <Alert className="bg-gaming-dark border-red-500/20">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-400">
                Login failed. Please check your credentials and try again.
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={loginMutation.isPending || !email || !password}
            className="w-full bg-gaming-green hover:bg-gaming-green/80 text-gaming-black font-semibold"
          >
            {loginMutation.isPending ? 'Logging in...' : 'Login to Portal'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gaming-gray text-sm">
            Don't have an account?{' '}
            <a href="/contact" className="text-gaming-green hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}