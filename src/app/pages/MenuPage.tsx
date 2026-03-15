import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  available: boolean;
  popular: boolean;
  sales: number;
}

export function MenuPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { id: '1', name: 'Cappuccino', description: 'Classic Italian coffee with steamed milk foam', category: 'Hot Beverages', price: 6.00, available: true, popular: true, sales: 156 },
    { id: '2', name: 'Latte', description: 'Espresso with steamed milk', category: 'Hot Beverages', price: 5.50, available: true, popular: true, sales: 115 },
    { id: '3', name: 'Iced Coffee', description: 'Cold brew coffee over ice', category: 'Cold Beverages', price: 5.00, available: true, popular: false, sales: 78 },
    { id: '4', name: 'Blueberry Muffin', description: 'Fresh baked with wild blueberries', category: 'Bakery', price: 5.50, available: true, popular: true, sales: 142 },
    { id: '5', name: 'Avocado Toast', description: 'Smashed avocado on sourdough', category: 'Food', price: 12.50, available: true, popular: true, sales: 128 },
    { id: '6', name: 'Croissant', description: 'Buttery French pastry', category: 'Bakery', price: 4.50, available: true, popular: true, sales: 98 },
    { id: '7', name: 'Green Tea', description: 'Premium Japanese green tea', category: 'Hot Beverages', price: 4.00, available: true, popular: false, sales: 56 },
    { id: '8', name: 'Chocolate Chip Cookie', description: 'Homemade with Belgian chocolate', category: 'Bakery', price: 3.50, available: false, popular: false, sales: 45 },
  ];

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(menuItems.map(item => item.category)));

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Menu Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage menu items and pricing
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: '#C7798E' }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Menu Item</DialogTitle>
              <DialogDescription>Create a new item for your menu</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input id="name" placeholder="e.g., Cappuccino" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe your item..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hot-beverages">Hot Beverages</SelectItem>
                      <SelectItem value="cold-beverages">Cold Beverages</SelectItem>
                      <SelectItem value="bakery">Bakery</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="desserts">Desserts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" type="number" step="0.01" placeholder="0.00" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Item Image</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary cursor-pointer transition-colors">
                  <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload image</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="available">Available for sale</Label>
                <Switch id="available" defaultChecked />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button style={{ backgroundColor: '#C7798E' }}>Add Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Menu Items */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Items ({menuItems.length})</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-pink-100 to-teal-100 flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-muted-foreground" />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">
                        {item.description}
                      </CardDescription>
                    </div>
                    {item.popular && (
                      <Badge style={{ backgroundColor: '#FF4F8B' }}>
                        Popular
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{item.category}</Badge>
                      <span className="text-lg font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Sales this week</span>
                      <span className="font-medium">{item.sales} orders</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Availability</span>
                      <Switch checked={item.available} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button variant="outline" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" className="flex-1 text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
