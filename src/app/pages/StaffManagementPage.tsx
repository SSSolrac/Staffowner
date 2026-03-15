import { useState } from 'react';
import { Search, Plus, UserCheck, Clock, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'active' | 'on-break' | 'off-duty';
  hoursThisWeek: number;
  performanceScore: number;
}

export function StaffManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const staff: StaffMember[] = [
    { id: '1', name: 'Sarah Johnson', role: 'Barista', email: 'sarah@happytails.com', phone: '(555) 111-2222', status: 'active', hoursThisWeek: 32, performanceScore: 95 },
    { id: '2', name: 'Michael Chen', role: 'Shift Supervisor', email: 'michael@happytails.com', phone: '(555) 222-3333', status: 'active', hoursThisWeek: 40, performanceScore: 98 },
    { id: '3', name: 'Emma Davis', role: 'Barista', email: 'emma@happytails.com', phone: '(555) 333-4444', status: 'on-break', hoursThisWeek: 28, performanceScore: 92 },
    { id: '4', name: 'James Wilson', role: 'Kitchen Staff', email: 'james@happytails.com', phone: '(555) 444-5555', status: 'off-duty', hoursThisWeek: 35, performanceScore: 88 },
  ];

  const filteredStaff = staff.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'on-break': return 'bg-orange-100 text-orange-700';
      case 'off-duty': return 'bg-gray-100 text-gray-700';
      default: return '';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Staff Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage team members and schedules
          </p>
        </div>
        <Button style={{ backgroundColor: '#C7798E' }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Staff
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staff.filter(s => s.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Currently on shift</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Hours
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staff.reduce((sum, s) => sum + s.hoursThisWeek, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Performance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(staff.reduce((sum, s) => sum + s.performanceScore, 0) / staff.length).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Team average</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Staff Members</CardTitle>
          <CardDescription>Team overview and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hours (Week)</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((member) => (
                <TableRow key={member.id} className="hover:bg-accent/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback style={{ backgroundColor: '#2E6960', color: 'white' }}>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{member.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{member.role}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {member.email}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(member.status)}>
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{member.hoursThisWeek}h</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${member.performanceScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{member.performanceScore}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View Details
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
