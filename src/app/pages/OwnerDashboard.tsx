import { DollarSign, ShoppingBag, Users, TrendingUp, AlertCircle, Package } from 'lucide-react';
import { KPICard } from '../components/KPICard';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function OwnerDashboard() {
  const revenueData = [
    { date: 'Mon', revenue: 4200, orders: 45 },
    { date: 'Tue', revenue: 3800, orders: 38 },
    { date: 'Wed', revenue: 5100, orders: 52 },
    { date: 'Thu', revenue: 4600, orders: 48 },
    { date: 'Fri', revenue: 6200, orders: 65 },
    { date: 'Sat', revenue: 7800, orders: 82 },
    { date: 'Sun', revenue: 7200, orders: 76 },
  ];

  const orderVolumeByHour = [
    { hour: '8am', orders: 12 },
    { hour: '9am', orders: 18 },
    { hour: '10am', orders: 25 },
    { hour: '11am', orders: 32 },
    { hour: '12pm', orders: 45 },
    { hour: '1pm', orders: 42 },
    { hour: '2pm', orders: 28 },
    { hour: '3pm', orders: 22 },
    { hour: '4pm', orders: 30 },
    { hour: '5pm', orders: 38 },
  ];

  const topItems = [
    { name: 'Cappuccino', sales: 156 },
    { name: 'Blueberry Muffin', sales: 142 },
    { name: 'Avocado Toast', sales: 128 },
    { name: 'Latte', sales: 115 },
    { name: 'Croissant', sales: 98 },
  ];

  const channelMix = [
    { name: 'Dine-In', value: 45, color: '#C7798E' },
    { name: 'Pickup', value: 30, color: '#2E6960' },
    { name: 'Delivery', value: 25, color: '#FF4F8B' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Owner Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="today">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button style={{ backgroundColor: '#C7798E' }}>
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Revenue"
          value="$38,945"
          trend={{
            value: 12.5,
            isPositive: true,
            comparison: 'vs last week',
          }}
          sparklineData={[4200, 3800, 5100, 4600, 6200, 7800, 7200]}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <KPICard
          title="Orders Today"
          value="156"
          trend={{
            value: 8.2,
            isPositive: true,
            comparison: 'vs yesterday',
          }}
          sparklineData={[45, 38, 52, 48, 65, 82, 76]}
          icon={<ShoppingBag className="h-5 w-5" />}
        />
        <KPICard
          title="Active Customers"
          value="1,247"
          trend={{
            value: 5.3,
            isPositive: true,
            comparison: 'vs last month',
          }}
          icon={<Users className="h-5 w-5" />}
        />
        <KPICard
          title="Avg Order Value"
          value="$24.50"
          trend={{
            value: 2.1,
            isPositive: false,
            comparison: 'vs last week',
          }}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Alerts Section */}
      <Card style={{ borderLeft: '4px solid #F59E0B' }}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            <CardTitle className="text-base">Attention Required</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <Package className="h-4 w-4 text-orange-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Low Stock Alert</p>
                <p className="text-sm text-muted-foreground">5 items are running low and need reordering</p>
              </div>
              <Button variant="outline" size="sm">View</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#C7798E" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Volume by Hour */}
        <Card>
          <CardHeader>
            <CardTitle>Order Volume by Hour</CardTitle>
            <CardDescription>Today's distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderVolumeByHour}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="hour" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Bar dataKey="orders" fill="#2E6960" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Items */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
            <CardDescription>This week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topItems} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" stroke="#6B7280" />
                <YAxis type="category" dataKey="name" stroke="#6B7280" width={120} />
                <Tooltip />
                <Bar dataKey="sales" fill="#FF4F8B" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Channel Mix */}
        <Card>
          <CardHeader>
            <CardTitle>Order Channel Mix</CardTitle>
            <CardDescription>Distribution by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={channelMix}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {channelMix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions across the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: '2 min ago', action: 'New order received', detail: 'Order #1247 - $42.50' },
              { time: '15 min ago', action: 'Staff member clocked in', detail: 'Sarah Johnson started shift' },
              { time: '1 hour ago', action: 'Inventory updated', detail: 'Almond Milk restocked (50 units)' },
              { time: '2 hours ago', action: 'Menu item updated', detail: 'Seasonal Pumpkin Latte added' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.detail}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
