import { useState } from 'react';
import { Download, TrendingUp, DollarSign, ShoppingBag, Target } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { KPICard } from '../components/KPICard';

export function SalesReportsPage() {
  const [dateRange, setDateRange] = useState('week');

  const dailySales = [
    { date: 'Mon', revenue: 4200, orders: 45, avgOrder: 93 },
    { date: 'Tue', revenue: 3800, orders: 38, avgOrder: 100 },
    { date: 'Wed', revenue: 5100, orders: 52, avgOrder: 98 },
    { date: 'Thu', revenue: 4600, orders: 48, avgOrder: 96 },
    { date: 'Fri', revenue: 6200, orders: 65, avgOrder: 95 },
    { date: 'Sat', revenue: 7800, orders: 82, avgOrder: 95 },
    { date: 'Sun', revenue: 7200, orders: 76, avgOrder: 95 },
  ];

  const monthlySales = [
    { month: 'Jan', revenue: 95000, target: 100000 },
    { month: 'Feb', revenue: 88000, target: 100000 },
    { month: 'Mar', revenue: 102000, target: 100000 },
    { month: 'Apr', revenue: 98000, target: 100000 },
    { month: 'May', revenue: 115000, target: 100000 },
    { month: 'Jun', revenue: 108000, target: 100000 },
  ];

  const categoryBreakdown = [
    { category: 'Hot Beverages', sales: 15400, percentage: 38 },
    { category: 'Cold Beverages', sales: 9800, percentage: 24 },
    { category: 'Food', sales: 11200, percentage: 28 },
    { category: 'Bakery', sales: 4200, percentage: 10 },
  ];

  const hourlyPerformance = [
    { hour: '8am', orders: 12, revenue: 340 },
    { hour: '9am', orders: 18, revenue: 520 },
    { hour: '10am', orders: 25, revenue: 680 },
    { hour: '11am', orders: 32, revenue: 890 },
    { hour: '12pm', orders: 45, revenue: 1250 },
    { hour: '1pm', orders: 42, revenue: 1180 },
    { hour: '2pm', orders: 28, revenue: 760 },
    { hour: '3pm', orders: 22, revenue: 590 },
    { hour: '4pm', orders: 30, revenue: 820 },
    { hour: '5pm', orders: 38, revenue: 1050 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Sales & Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive business analytics and insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button style={{ backgroundColor: '#C7798E' }}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Revenue"
          value="$38,945"
          trend={{
            value: 12.5,
            isPositive: true,
            comparison: 'vs last week',
          }}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <KPICard
          title="Total Orders"
          value="406"
          trend={{
            value: 8.2,
            isPositive: true,
            comparison: 'vs last week',
          }}
          icon={<ShoppingBag className="h-5 w-5" />}
        />
        <KPICard
          title="Avg Order Value"
          value="$95.91"
          trend={{
            value: 3.8,
            isPositive: true,
            comparison: 'vs last week',
          }}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <KPICard
          title="Target Progress"
          value="97.8%"
          trend={{
            value: 2.2,
            isPositive: false,
            comparison: 'of monthly goal',
          }}
          icon={<Target className="h-5 w-5" />}
        />
      </div>

      {/* Main Reports */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="hourly">Hourly Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Sales */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Revenue</CardTitle>
                <CardDescription>Last 7 days performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dailySales}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#C7798E" fill="#C7798E" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
                <CardDescription>Revenue vs Target</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlySales}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#2E6960" name="Revenue" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="target" fill="#E5E7EB" name="Target" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>Revenue distribution across product categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryBreakdown.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category.category}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">${category.sales.toLocaleString()}</span>
                        <span className="text-sm font-medium w-12 text-right">{category.percentage}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${category.percentage}%`,
                          backgroundColor: '#C7798E',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Weekly revenue and order trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={dailySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis yAxisId="left" stroke="#6B7280" />
                  <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#C7798E" strokeWidth={2} name="Revenue ($)" />
                  <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#2E6960" strokeWidth={2} name="Orders" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
              <CardDescription>Sales comparison by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={categoryBreakdown} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#6B7280" />
                  <YAxis type="category" dataKey="category" stroke="#6B7280" width={120} />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#FF4F8B" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hourly" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Performance</CardTitle>
              <CardDescription>Peak hours and revenue distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={hourlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="hour" stroke="#6B7280" />
                  <YAxis yAxisId="left" stroke="#6B7280" />
                  <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="#2E6960" name="Revenue ($)" radius={[8, 8, 0, 0]} />
                  <Bar yAxisId="right" dataKey="orders" fill="#C7798E" name="Orders" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
