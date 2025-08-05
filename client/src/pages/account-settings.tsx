import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  Shield,
  Save,
  Eye,
  EyeOff 
} from "lucide-react";

export default function AccountSettings() {
  const [loggedInClient, setLoggedInClient] = useState<any>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Profile form states
  const [profileData, setProfileData] = useState({
    firstname: '',
    lastname: '',
    companyname: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    phonenumber: ''
  });
  
  // Password form states
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Check for existing login on page load
  useEffect(() => {
    const savedClient = localStorage.getItem('whmcs_client_data');
    if (savedClient) {
      try {
        const clientData = JSON.parse(savedClient);
        setLoggedInClient(clientData);
      } catch (error) {
        localStorage.removeItem('whmcs_client_data');
        localStorage.removeItem('whmcs_client_id');
      }
    }
  }, []);

  // Fetch detailed profile information
  const { data: profileDetails, isLoading: profileLoading } = useQuery({
    queryKey: [`/api/whmcs/account/profile/${loggedInClient?.email}`],
    queryFn: async () => {
      const response = await fetch(`/api/whmcs/account/profile/${loggedInClient.email}?requestorEmail=${loggedInClient.email}`);
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },
    enabled: !!loggedInClient?.email,
  });

  // Update profile data when details are loaded
  useEffect(() => {
    if (profileDetails && profileDetails.result === 'success') {
      setProfileData({
        firstname: profileDetails.firstname || '',
        lastname: profileDetails.lastname || '',
        companyname: profileDetails.companyname || '',
        email: profileDetails.email || '',
        address1: profileDetails.address1 || '',
        address2: profileDetails.address2 || '',
        city: profileDetails.city || '',
        state: profileDetails.state || '',
        postcode: profileDetails.postcode || '',
        country: profileDetails.country || '',
        phonenumber: profileDetails.phonenumber || ''
      });
    }
  }, [profileDetails]);

  // Profile update mutation
  const profileUpdateMutation = useMutation({
    mutationFn: async (updates: typeof profileData) => {
      const response = await fetch(`/api/whmcs/account/profile/${loggedInClient.email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestorEmail: loggedInClient.email,
          ...updates
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/whmcs/account/profile/${loggedInClient?.email}`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Password update mutation
  const passwordUpdateMutation = useMutation({
    mutationFn: async (passwordInfo: { newPassword: string }) => {
      const response = await fetch(`/api/whmcs/account/password/${loggedInClient.email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestorEmail: loggedInClient.email,
          newPassword: passwordInfo.newPassword
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update password');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Password Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    profileUpdateMutation.mutate(profileData);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    passwordUpdateMutation.mutate({ newPassword: passwordData.newPassword });
  };

  if (!loggedInClient) {
    return (
      <div className="min-h-screen bg-gaming-black p-4">
        <div className="max-w-2xl mx-auto pt-20">
          <Card className="bg-gaming-dark border-gaming-green/20">
            <CardHeader className="text-center">
              <CardTitle className="text-gaming-white text-2xl flex items-center justify-center gap-2">
                <Shield className="w-6 h-6 text-gaming-green" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Alert className="bg-gaming-dark border-gaming-green/20">
                <AlertCircle className="h-4 w-4 text-gaming-green" />
                <AlertDescription className="text-gaming-gray">
                  Please log in to your client portal to access account settings.
                </AlertDescription>
              </Alert>
              <Button 
                onClick={() => window.location.href = '/client-portal'} 
                className="mt-4 bg-gaming-green hover:bg-gaming-green/80 text-gaming-black"
              >
                Go to Client Portal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-black p-4">
      <div className="max-w-4xl mx-auto pt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gaming-white mb-2">Account Settings</h1>
          <p className="text-gaming-gray">Manage your profile and account preferences</p>
        </div>

        {/* Account Status Card */}
        <Card className="bg-gaming-dark border-gaming-green/20 mb-6">
          <CardHeader>
            <CardTitle className="text-gaming-white flex items-center gap-2">
              <User className="w-5 h-5 text-gaming-green" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gaming-gray">Account Status</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/20">
                <CheckCircle className="w-3 h-3 mr-1" />
                {profileDetails?.status || 'Active'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gaming-gray">Client ID</span>
              <span className="text-gaming-white font-mono">#{profileDetails?.userid || loggedInClient.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gaming-gray">Member Since</span>
              <span className="text-gaming-white">{profileDetails?.datecreated || 'Unknown'}</span>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-gaming-dark border-gaming-green/20">
            <TabsTrigger value="profile" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black">
              Profile Information
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-gaming-green data-[state=active]:text-gaming-black">
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="bg-gaming-dark border-gaming-green/20">
              <CardHeader>
                <CardTitle className="text-gaming-white flex items-center gap-2">
                  <User className="w-5 h-5 text-gaming-green" />
                  Profile Information
                </CardTitle>
                <CardDescription className="text-gaming-gray">
                  Update your personal information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gaming-white flex items-center gap-2">
                      <User className="w-4 h-4 text-gaming-green" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstname" className="text-gaming-white">First Name</Label>
                        <Input
                          id="firstname"
                          type="text"
                          value={profileData.firstname}
                          onChange={(e) => setProfileData(prev => ({ ...prev, firstname: e.target.value }))}
                          className="bg-gaming-dark-lighter border-gaming-green/30 text-gaming-white"
                          disabled={profileLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastname" className="text-gaming-white">Last Name</Label>
                        <Input
                          id="lastname"
                          type="text"
                          value={profileData.lastname}
                          onChange={(e) => setProfileData(prev => ({ ...prev, lastname: e.target.value }))}
                          className="bg-gaming-dark-lighter border-gaming-green/30 text-gaming-white"
                          disabled={profileLoading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyname" className="text-gaming-white">Company Name (Optional)</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gaming-green" />
                        <Input
                          id="companyname"
                          type="text"
                          value={profileData.companyname}
                          onChange={(e) => setProfileData(prev => ({ ...prev, companyname: e.target.value }))}
                          className="bg-gaming-dark-lighter border-gaming-green/30 text-gaming-white pl-10"
                          disabled={profileLoading}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-gaming-green/20" />

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gaming-white flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gaming-green" />
                      Contact Information
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gaming-white">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gaming-green" />
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          className="bg-gaming-dark-lighter border-gaming-green/30 text-gaming-white pl-10"
                          disabled={profileLoading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phonenumber" className="text-gaming-white">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gaming-green" />
                        <Input
                          id="phonenumber"
                          type="tel"
                          value={profileData.phonenumber}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phonenumber: e.target.value }))}
                          className="bg-gaming-dark-lighter border-gaming-green/30 text-gaming-white pl-10"
                          disabled={profileLoading}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-gaming-green/20" />

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gaming-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gaming-green" />
                      Address Information
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="address1" className="text-gaming-white">Address Line 1</Label>
                      <Input
                        id="address1"
                        type="text"
                        value={profileData.address1}
                        onChange={(e) => setProfileData(prev => ({ ...prev, address1: e.target.value }))}
                        className="bg-gaming-dark-lighter border-gaming-green/30 text-gaming-white"
                        disabled={profileLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address2" className="text-gaming-white">Address Line 2 (Optional)</Label>
                      <Input
                        id="address2"
                        type="text"
                        value={profileData.address2}
                        onChange={(e) => setProfileData(prev => ({ ...prev, address2: e.target.value }))}
                        className="bg-gaming-dark-lighter border-gaming-green/30 text-gaming-white"
                        disabled={profileLoading}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-gaming-white">City</Label>
                        <Input
                          id="city"
                          type="text"
                          value={profileData.city}
                          onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                          className="bg-gaming-dark-lighter border-gaming-green/30 text-gaming-white"
                          disabled={profileLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-gaming-white">State/Province</Label>
                        <Input
                          id="state"
                          type="text"
                          value={profileData.state}
                          onChange={(e) => setProfileData(prev => ({ ...prev, state: e.target.value }))}
                          className="bg-gaming-dark-lighter border-gaming-green/30 text-gaming-white"
                          disabled={profileLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postcode" className="text-gaming-white">Postal Code</Label>
                        <Input
                          id="postcode"
                          type="text"
                          value={profileData.postcode}
                          onChange={(e) => setProfileData(prev => ({ ...prev, postcode: e.target.value }))}
                          className="bg-gaming-dark-lighter border-gaming-green/30 text-gaming-white"
                          disabled={profileLoading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-gaming-white">Country</Label>
                      <Input
                        id="country"
                        type="text"
                        value={profileData.country}
                        onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
                        className="bg-gaming-dark-lighter border-gaming-green/30 text-gaming-white"
                        disabled={profileLoading}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={profileUpdateMutation.isPending || profileLoading}
                      className="bg-gaming-green hover:bg-gaming-green/80 text-gaming-black flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {profileUpdateMutation.isPending ? 'Updating...' : 'Update Profile'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="bg-gaming-dark border-gaming-green/20">
              <CardHeader>
                <CardTitle className="text-gaming-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-gaming-green" />
                  Security Settings
                </CardTitle>
                <CardDescription className="text-gaming-gray">
                  Update your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <Alert className="bg-gaming-dark border-gaming-green/20">
                    <Shield className="h-4 w-4 text-gaming-green" />
                    <AlertDescription className="text-gaming-gray">
                      For security reasons, you'll need to log in again after changing your password.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-gaming-white">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gaming-green" />
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="bg-gaming-dark-lighter border-gaming-green/30 text-gaming-white pl-10 pr-10"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gaming-gray hover:text-gaming-white"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gaming-white">Confirm New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gaming-green" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="bg-gaming-dark-lighter border-gaming-green/30 text-gaming-white pl-10 pr-10"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gaming-gray hover:text-gaming-white"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Password Requirements */}
                    <div className="space-y-2">
                      <p className="text-sm text-gaming-gray">Password Requirements:</p>
                      <ul className="text-xs text-gaming-gray space-y-1">
                        <li className={`flex items-center gap-2 ${passwordData.newPassword.length >= 8 ? 'text-green-400' : ''}`}>
                          <CheckCircle className={`w-3 h-3 ${passwordData.newPassword.length >= 8 ? 'text-green-400' : 'text-gaming-gray'}`} />
                          At least 8 characters long
                        </li>
                        <li className={`flex items-center gap-2 ${passwordData.newPassword === passwordData.confirmPassword && passwordData.newPassword ? 'text-green-400' : ''}`}>
                          <CheckCircle className={`w-3 h-3 ${passwordData.newPassword === passwordData.confirmPassword && passwordData.newPassword ? 'text-green-400' : 'text-gaming-gray'}`} />
                          Passwords match
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={
                        passwordUpdateMutation.isPending || 
                        !passwordData.newPassword || 
                        passwordData.newPassword !== passwordData.confirmPassword ||
                        passwordData.newPassword.length < 8
                      }
                      className="bg-gaming-green hover:bg-gaming-green/80 text-gaming-black flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      {passwordUpdateMutation.isPending ? 'Updating...' : 'Update Password'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}