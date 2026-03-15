import { useState } from 'react';
import { Search, Filter, Download, MoreVertical, Eye, CheckCircle, XCircle } from 'lucide-react';
import { StatusChip, PriorityTag, OrderStatus } from '../components/StatusChip';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

interface Order {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: OrderStatus;
  priority: 'Normal' | 'Urgent';
  type: 'Dine-In' | 'Pickup' | 'Delivery';
  time: string;
  date: string;
}

export function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const orders: Order[] = [
    { id: '#1248', customer: 'John Doe', items: 3, total: 42.50, status: 'Preparing', priority: 'Normal', type: 'Dine-In', time: '10:15 AM', date: 'Today' },
    { id: '#1249', customer: 'Jane Smith', items: 2, total: 28.00, status: 'Pending', priority: 'Urgent', type: 'Pickup', time: '10:20 AM', date: 'Today' },
    { id: '#1250', customer: 'Mike Johnson', items: 4, total: 56.75, status: 'Ready', priority: 'Normal', type: 'Delivery', time: '10:05 AM', date: 'Today' },
    { id: '#1251', customer: 'Sarah Williams', items: 1, total: 18.50, status: 'Pending', priority: 'Urgent', type: 'Dine-In', time: '10:25 AM', date: 'Today' },
    { id: '#1252', customer: 'David Brown', items: 5, total: 67.25, status: 'Accepted', priority: 'Normal', type: 'Delivery', time: '10:10 AM', date: 'Today' },
    { id: '#1253', customer: 'Emma Davis', items: 2, total: 32.00, status: 'Completed', priority: 'Normal', type: 'Pickup', time: '9:45 AM', date: 'Today' },
    { id: '#1254', customer: 'James Wilson', items: 3, total: 45.50, status: 'Preparing', priority: 'Normal', type: 'Dine-In', time: '10:00 AM', date: 'Today' },
    { id: '#1255', customer: 'Lisa Anderson', items: 1, total: 15.00, status: 'Declined', priority: 'Normal', type: 'Delivery', time: '9:30 AM', date: 'Today' },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    console.log(`Updating order ${orderId} to ${newStatus}`);
    // Handle status update
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Orders Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all orders
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID or customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Saved Views */}
          <div className="mt-4 flex gap-2 flex-wrap">
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              Morning Rush
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              Delivery Only
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              Needs Attention
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              High Value
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Order Type Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="dine-in">Dine-In</TabsTrigger>
          <TabsTrigger value="pickup">Pickup</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>Complete list of orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-accent/50">
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.type}</Badge>
                      </TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <StatusChip status={order.status} />
                      </TableCell>
                      <TableCell>
                        <PriorityTag priority={order.priority} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {order.time}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => {
                                  e.preventDefault();
                                  setSelectedOrder(order);
                                }}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                              </DialogTrigger>
                            </Dialog>
                            {order.status === 'Pending' && (
                              <>
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Accepted')}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Accept Order
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Declined')}>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Decline Order
                                </DropdownMenuItem>
                              </>
                            )}
                            {order.status === 'Preparing' && (
                              <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Ready')}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark as Ready
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No orders found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order {selectedOrder.id}</DialogTitle>
              <DialogDescription>
                Order details and customer information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Customer</h4>
                <p className="text-sm text-muted-foreground">{selectedOrder.customer}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Order Type</h4>
                  <Badge variant="outline">{selectedOrder.type}</Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Status</h4>
                  <StatusChip status={selectedOrder.status} />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Items ({selectedOrder.items})</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cappuccino x2</span>
                    <span>$12.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Blueberry Muffin x1</span>
                    <span>$5.50</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" style={{ backgroundColor: '#22C55E' }}>
                  Accept Order
                </Button>
                <Button variant="outline" className="flex-1">
                  Decline
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
