import { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: 'Order' | 'Inventory' | 'Menu' | 'Staff' | 'Customer' | 'System';
  details: string;
}

export function ActivityHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const activities: ActivityLog[] = [
    { id: '1', timestamp: '2 min ago', user: 'Sarah Johnson', action: 'Order Created', category: 'Order', details: 'New order #1248 created for $42.50' },
    { id: '2', timestamp: '15 min ago', user: 'Michael Chen', action: 'Clock In', category: 'Staff', details: 'Started shift at 8:00 AM' },
    { id: '3', timestamp: '1 hour ago', user: 'System', action: 'Inventory Alert', category: 'Inventory', details: 'Almond Milk dropped below minimum level' },
    { id: '4', timestamp: '2 hours ago', user: 'Owner', action: 'Menu Updated', category: 'Menu', details: 'Added new item: Seasonal Pumpkin Latte' },
    { id: '5', timestamp: '3 hours ago', user: 'Emma Davis', action: 'Order Completed', category: 'Order', details: 'Order #1240 marked as completed' },
    { id: '6', timestamp: '4 hours ago', user: 'Owner', action: 'Staff Added', category: 'Staff', details: 'New staff member James Wilson added' },
    { id: '7', timestamp: '5 hours ago', user: 'System', action: 'Daily Backup', category: 'System', details: 'Automated daily backup completed' },
    { id: '8', timestamp: '6 hours ago', user: 'Michael Chen', action: 'Inventory Restocked', category: 'Inventory', details: 'Coffee Beans restocked: +50 kg' },
  ];

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || activity.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Order': return 'bg-blue-100 text-blue-700';
      case 'Inventory': return 'bg-purple-100 text-purple-700';
      case 'Menu': return 'bg-green-100 text-green-700';
      case 'Staff': return 'bg-orange-100 text-orange-700';
      case 'Customer': return 'bg-pink-100 text-pink-700';
      case 'System': return 'bg-gray-100 text-gray-700';
      default: return '';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Activity History
          </h1>
          <p className="text-muted-foreground mt-1">
            Audit log of all system activities
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Log
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="order">Orders</SelectItem>
                <SelectItem value="inventory">Inventory</SelectItem>
                <SelectItem value="menu">Menu</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="customer">Customers</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Chronological record of all activities</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.map((activity) => (
                <TableRow key={activity.id} className="hover:bg-accent/50">
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {activity.timestamp}
                  </TableCell>
                  <TableCell className="font-medium">{activity.user}</TableCell>
                  <TableCell className="font-medium">{activity.action}</TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(activity.category)}>
                      {activity.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {activity.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No activities found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
