'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, MoreHorizontal, UserPlus, Download, Trash2, Edit, Eye, Ban } from 'lucide-react';

const users = [
  {
    id: '1',
    name: 'Emma Wilson',
    email: 'emma.w@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
    status: 'active',
    plan: 'Premium',
    joinedAt: 'Jan 12, 2023',
    lastActive: '2 hours ago',
    sessions: 42,
    progress: 'Improving',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    avatar: '',
    status: 'active',
    plan: 'Basic',
    joinedAt: 'Mar 5, 2023',
    lastActive: '5 hours ago',
    sessions: 18,
    progress: 'Stable',
  },
  {
    id: '3',
    name: 'Sophia Rodriguez',
    email: 'sophia.r@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop',
    status: 'active',
    plan: 'Premium',
    joinedAt: 'Feb 18, 2023',
    lastActive: '1 day ago',
    sessions: 36,
    progress: 'Improving',
  },
  {
    id: '4',
    name: 'James Johnson',
    email: 'james.j@example.com',
    avatar: '',
    status: 'inactive',
    plan: 'Basic',
    joinedAt: 'Apr 22, 2023',
    lastActive: '10 days ago',
    sessions: 8,
    progress: 'Declining',
  },
  {
    id: '5',
    name: 'Olivia Brown',
    email: 'olivia.b@example.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop',
    status: 'active',
    plan: 'Premium',
    joinedAt: 'Jan 5, 2023',
    lastActive: '3 hours ago',
    sessions: 52,
    progress: 'Stable',
  },
  {
    id: '6',
    name: 'William Davis',
    email: 'william.d@example.com',
    avatar: '',
    status: 'suspended',
    plan: 'Basic',
    joinedAt: 'May 15, 2023',
    lastActive: '30 days ago',
    sessions: 4,
    progress: 'Unknown',
  },
  {
    id: '7',
    name: 'Ava Martinez',
    email: 'ava.m@example.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop',
    status: 'active',
    plan: 'Premium',
    joinedAt: 'Feb 28, 2023',
    lastActive: '1 hour ago',
    sessions: 38,
    progress: 'Improving',
  },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="suspended">Suspended</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="w-[250px] pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Plan Type</DropdownMenuItem>
                <DropdownMenuItem>Join Date</DropdownMenuItem>
                <DropdownMenuItem>Activity Level</DropdownMenuItem>
                <DropdownMenuItem>Progress Status</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}{user.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          user.status === 'active' ? 'default' : 
                          user.status === 'inactive' ? 'secondary' : 
                          'destructive'
                        }>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.plan}</TableCell>
                      <TableCell>{user.joinedAt}</TableCell>
                      <TableCell>{user.lastActive}</TableCell>
                      <TableCell>{user.sessions}</TableCell>
                      <TableCell>
                        <Badge variant={
                          user.progress === 'Improving' ? 'default' : 
                          user.progress === 'Stable' ? 'secondary' : 
                          user.progress === 'Declining' ? 'destructive' : 
                          'outline'
                        }>
                          {user.progress}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Ban className="mr-2 h-4 w-4" />
                              Suspend User
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
              <CardDescription>
                Manage users who are currently active on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Showing active users only. Filter applied.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inactive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inactive Users</CardTitle>
              <CardDescription>
                Manage users who haven't been active recently.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Showing inactive users only. Filter applied.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="suspended" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Suspended Users</CardTitle>
              <CardDescription>
                Manage users who have been suspended from the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Showing suspended users only. Filter applied.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}