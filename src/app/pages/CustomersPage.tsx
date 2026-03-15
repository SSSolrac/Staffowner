import { useState } from 'react';
import { Search, User, Mail, Phone, Award, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  lastOrder: string;
}

export function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const customers: Customer[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', phone: '(555) 123-4567', totalOrders: 45, totalSpent: 1250.00, loyaltyPoints: 450, tier: 'Gold', lastOrder: 'Today' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '(555) 234-5678', totalOrders: 32, totalSpent: 890.00, loyaltyPoints: 320, tier: 'Silver', lastOrder: 'Yesterday' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', phone: '(555) 345-6789', totalOrders: 78, totalSpent: 2340.00, loyaltyPoints: 780, tier: 'Platinum', lastOrder: 'Today' },
    { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', phone: '(555) 456-7890', totalOrders: 12, totalSpent: 340.00, loyaltyPoints: 120, tier: 'Bronze', lastOrder: '2 days ago' },
    { id: '5', name: 'David Brown', email: 'david@example.com', phone: '(555) 567-8901', totalOrders: 56, totalSpent: 1680.00, loyaltyPoints: 560, tier: 'Gold', lastOrder: 'Today' },
  ];

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 'bg-purple-100 text-purple-700';
      case 'Gold': return 'bg-yellow-100 text-yellow-700';
      case 'Silver': return 'bg-gray-100 text-gray-700';
      case 'Bronze': return 'bg-orange-100 text-orange-700';
      default: return '';
    }
  };

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Customers & Loyalty
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage customer relationships and loyalty program
          </p>
        </div>
        <Button style={{ backgroundColor: '#C7798E' }}>
          Export Customer Data
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Customers
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active loyalty members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From all customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Order Value
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Per transaction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
          <CardDescription>Complete customer list with loyalty information</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Loyalty Tier</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-accent/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback style={{ backgroundColor: '#C7798E', color: 'white' }}>
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{customer.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{customer.totalOrders}</TableCell>
                  <TableCell className="font-medium">${customer.totalSpent.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getTierColor(customer.tier)}>
                      {customer.tier}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{customer.loyaltyPoints} pts</div>
                      <Progress value={(customer.loyaltyPoints % 100)} className="h-1 w-20" />
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {customer.lastOrder}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
