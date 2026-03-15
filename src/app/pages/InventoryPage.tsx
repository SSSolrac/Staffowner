import { useState } from 'react';
import { Search, Plus, AlertTriangle, Package, TrendingDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Progress } from '../components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  current: number;
  minimum: number;
  maximum: number;
  unit: string;
  daysLeft: number;
  status: 'healthy' | 'low' | 'critical';
}

export function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const inventoryItems: InventoryItem[] = [
    { id: '1', name: 'Coffee Beans (Arabica)', category: 'Beverages', current: 25, minimum: 20, maximum: 100, unit: 'kg', daysLeft: 12, status: 'healthy' },
    { id: '2', name: 'Almond Milk', category: 'Dairy', current: 5, minimum: 20, maximum: 50, unit: 'bottles', daysLeft: 2, status: 'critical' },
    { id: '3', name: 'Blueberry Muffins', category: 'Bakery', current: 8, minimum: 24, maximum: 48, unit: 'pieces', daysLeft: 1, status: 'critical' },
    { id: '4', name: 'Whole Milk', category: 'Dairy', current: 18, minimum: 15, maximum: 40, unit: 'bottles', daysLeft: 5, status: 'healthy' },
    { id: '5', name: 'Croissants', category: 'Bakery', current: 12, minimum: 20, maximum: 40, unit: 'pieces', daysLeft: 1, status: 'low' },
    { id: '6', name: 'Sugar', category: 'Ingredients', current: 8, minimum: 10, maximum: 50, unit: 'kg', daysLeft: 6, status: 'low' },
    { id: '7', name: 'Avocado', category: 'Produce', current: 30, minimum: 15, maximum: 50, unit: 'pieces', daysLeft: 3, status: 'healthy' },
    { id: '8', name: 'Eggs', category: 'Dairy', current: 96, minimum: 60, maximum: 120, unit: 'pieces', daysLeft: 8, status: 'healthy' },
  ];

  const filteredItems = inventoryItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const criticalItems = inventoryItems.filter(item => item.status === 'critical');
  const lowItems = inventoryItems.filter(item => item.status === 'low');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-700';
      case 'low': return 'bg-orange-100 text-orange-700';
      case 'critical': return 'bg-red-100 text-red-700';
      default: return '';
    }
  };

  const getStockPercentage = (item: InventoryItem) => {
    return (item.current / item.maximum) * 100;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Inventory Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage stock levels
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: '#C7798E' }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Inventory Item</DialogTitle>
              <DialogDescription>Add a new item to your inventory</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="item-name">Item Name</Label>
                <Input id="item-name" placeholder="e.g., Coffee Beans" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beverages">Beverages</SelectItem>
                    <SelectItem value="dairy">Dairy</SelectItem>
                    <SelectItem value="bakery">Bakery</SelectItem>
                    <SelectItem value="produce">Produce</SelectItem>
                    <SelectItem value="ingredients">Ingredients</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Current Stock</Label>
                  <Input id="current" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input id="unit" placeholder="e.g., kg, bottles" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minimum">Minimum Level</Label>
                  <Input id="minimum" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maximum">Maximum Level</Label>
                  <Input id="maximum" type="number" placeholder="0" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button style={{ backgroundColor: '#C7798E' }}>Add Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alerts */}
      {criticalItems.length > 0 && (
        <Card style={{ borderLeft: '4px solid #EF4444' }}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-base">Critical Stock Levels</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {criticalItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Only {item.current} {item.unit} left - {item.daysLeft} days remaining
                    </p>
                  </div>
                  <Button size="sm" style={{ backgroundColor: '#C7798E' }}>
                    Reorder
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stock Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Items
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryItems.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Low Stock Items
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowItems.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Needs attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Critical Items
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalItems.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Immediate reorder required
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
              placeholder="Search inventory by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>Complete stock overview with reorder suggestions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Days Left</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-accent/50">
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {item.current} / {item.maximum} {item.unit}
                  </TableCell>
                  <TableCell>
                    <div className="w-32">
                      <Progress 
                        value={getStockPercentage(item)} 
                        className="h-2"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={item.daysLeft <= 2 ? 'text-red-600 font-medium' : ''}>
                      {item.daysLeft} days
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                      {item.status !== 'healthy' && (
                        <Button size="sm" style={{ backgroundColor: '#C7798E' }}>
                          Reorder
                        </Button>
                      )}
                    </div>
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
