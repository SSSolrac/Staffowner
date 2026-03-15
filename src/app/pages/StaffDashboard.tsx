import { Clock, Coffee, CheckCircle, AlertTriangle, Users, Package } from 'lucide-react';
import { KPICard } from '../components/KPICard';
import { StatusChip, PriorityTag } from '../components/StatusChip';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';

export function StaffDashboard() {
  const activeOrders = [
    { id: '#1248', customer: 'John Doe', items: 3, time: '5 min', status: 'Preparing' as const, priority: 'Normal' as const, type: 'Dine-In' },
    { id: '#1249', customer: 'Jane Smith', items: 2, time: '2 min', status: 'Pending' as const, priority: 'Urgent' as const, type: 'Pickup' },
    { id: '#1250', customer: 'Mike Johnson', items: 4, time: '8 min', status: 'Preparing' as const, priority: 'Normal' as const, type: 'Delivery' },
    { id: '#1251', customer: 'Sarah Williams', items: 1, time: '1 min', status: 'Pending' as const, priority: 'Urgent' as const, type: 'Dine-In' },
  ];

  const lowStockItems = [
    { name: 'Almond Milk', current: 5, minimum: 20, unit: 'bottles' },
    { name: 'Blueberry Muffins', current: 8, minimum: 24, unit: 'pieces' },
    { name: 'Coffee Beans', current: 2, minimum: 10, unit: 'kg' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Shift Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Good morning! You're clocked in at 8:00 AM
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">Take Break</Button>
          <Button variant="destructive">Clock Out</Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Active Orders"
          value="12"
          icon={<Coffee className="h-5 w-5" />}
        />
        <KPICard
          title="Orders Completed"
          value="48"
          trend={{
            value: 15,
            isPositive: true,
            comparison: 'since clock-in',
          }}
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <KPICard
          title="Avg Processing Time"
          value="8 min"
          trend={{
            value: 5,
            isPositive: true,
            comparison: 'faster today',
          }}
          icon={<Clock className="h-5 w-5" />}
        />
        <KPICard
          title="Customers Served"
          value="64"
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      {/* Urgent Actions */}
      <Card style={{ borderLeft: '4px solid #FF4F8B' }}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-pink-600" />
            <CardTitle className="text-base">Urgent Actions Required</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Coffee className="h-4 w-4 text-pink-600" />
                <div>
                  <p className="text-sm font-medium">2 urgent orders waiting</p>
                  <p className="text-xs text-muted-foreground">Orders #1249, #1251 need immediate attention</p>
                </div>
              </div>
              <Button size="sm" style={{ backgroundColor: '#FF4F8B' }}>View Queue</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Package className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">3 items low on stock</p>
                  <p className="text-xs text-muted-foreground">Update inventory or notify manager</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Review</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Orders Queue */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Live Orders Queue</CardTitle>
                <CardDescription>Orders requiring action</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">All</Badge>
                <Badge>Pending</Badge>
                <Badge variant="outline">Preparing</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{order.id}</span>
                        <StatusChip status={order.status} />
                        <PriorityTag priority={order.priority} />
                        <Badge variant="outline" className="text-xs">
                          {order.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.items} items</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-orange-600">{order.time}</div>
                      <div className="text-xs text-muted-foreground">waiting</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {order.status === 'Pending' && (
                      <>
                        <Button size="sm" className="flex-1" style={{ backgroundColor: '#22C55E' }}>
                          Accept
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          Decline
                        </Button>
                      </>
                    )}
                    {order.status === 'Preparing' && (
                      <Button size="sm" className="flex-1" style={{ backgroundColor: '#2E6960' }}>
                        Mark Ready
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Today's Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Today's Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Shift Completion</span>
                  <span className="font-medium">60%</span>
                </div>
                <Progress value={60} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">4.8 hours remaining</p>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Daily Target</span>
                  <span className="font-medium">80%</span>
                </div>
                <Progress value={80} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">48 of 60 orders</p>
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Low Stock Alerts</CardTitle>
              <CardDescription>Items needing attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {lowStockItems.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground">
                      {item.current}/{item.minimum} {item.unit}
                    </span>
                  </div>
                  <Progress
                    value={(item.current / item.minimum) * 100}
                    className="h-1.5"
                  />
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4" size="sm">
                Update Inventory
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Coffee className="h-4 w-4 mr-2" />
                Mark Item Unavailable
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Customer Lookup
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Package className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
