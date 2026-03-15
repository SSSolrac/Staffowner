import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Coffee, User, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export function LoginPage() {
  const navigate = useNavigate();
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');

  const handleOwnerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/owner/dashboard');
  };

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/staff/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-teal-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4 shadow-lg">
            <Coffee className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Happy Tails Pet Café
          </h1>
          <p className="text-muted-foreground">Admin Management System</p>
        </div>

        <Tabs defaultValue="owner" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="owner">Owner Login</TabsTrigger>
            <TabsTrigger value="staff">Staff Login</TabsTrigger>
          </TabsList>

          {/* Owner Login */}
          <TabsContent value="owner">
            <Card>
              <CardHeader>
                <CardTitle>Owner Portal</CardTitle>
                <CardDescription>
                  Access full management dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleOwnerLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="owner-email">Email</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="owner-email"
                        type="email"
                        placeholder="owner@happytails.com"
                        value={ownerEmail}
                        onChange={(e) => setOwnerEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="owner-password"
                        type="password"
                        placeholder="••••••••"
                        value={ownerPassword}
                        onChange={(e) => setOwnerPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" style={{ backgroundColor: '#C7798E' }}>
                    Sign In as Owner
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staff Login */}
          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle>Staff Portal</CardTitle>
                <CardDescription>
                  Access shift operations dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleStaffLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="staff-email">Email</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="staff-email"
                        type="email"
                        placeholder="staff@happytails.com"
                        value={staffEmail}
                        onChange={(e) => setStaffEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staff-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="staff-password"
                        type="password"
                        placeholder="••••••••"
                        value={staffPassword}
                        onChange={(e) => setStaffPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" style={{ backgroundColor: '#2E6960' }}>
                    Sign In as Staff
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="text-center text-xs text-muted-foreground mt-6">
          For demo purposes, you can login with any credentials
        </p>
      </div>
    </div>
  );
}
