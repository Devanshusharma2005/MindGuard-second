'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, MoreHorizontal, UserPlus, Download, Trash2, Edit, Eye, CheckCircle, XCircle } from 'lucide-react';

const therapists = [
  {
    id: '1',
    name: 'Dr. Sarah Miller',
    email: 'dr.miller@mindguard.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop',
    status: 'verified',
    specialty: 'Cognitive Behavioral Therapy',
    clients: 28,
    joinedAt: 'Jan 5, 2023',
    lastActive: '2 hours ago',
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Dr. Robert Kim',
    email: 'dr.kim@mindguard.com',
    avatar: '',
    status: 'pending',
    specialty: 'Trauma Therapy',
    clients: 0,
    joinedAt: 'May 12, 2023',
    lastActive: 'N/A',
    rating: 0,
  },
  {
    id: '3',
    name: 'Dr. Lisa Patel',
    email: 'dr.patel@mindguard.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop',
    status: 'verified',
    specialty: 'Anxiety & Depression',
    clients: 32,
    joinedAt: 'Feb 18, 2023',
    lastActive: '1 day ago',
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Dr. John Davis',
    email: 'dr.davis@mindguard.com',
    avatar: '',
    status: 'pending',
    specialty: 'Family Therapy',
    clients: 0,
    joinedAt: 'Apr 22, 2023',
    lastActive: 'N/A',
    rating: 0,
  },
  {
    id: '5',
    name: 'Dr. Maria Gonzalez',
    email: 'dr.gonzalez@mindguard.com',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=100&auto=format&fit=crop',
    status: 'verified',
    specialty: 'Mindfulness & Stress Management',
    clients: 25,
    joinedAt: 'Jan 15, 2023',
    lastActive: '5 hours ago',
    rating: 4.8,
  },
  {
    id: '6',
    name: 'Dr. James Wilson',
    email: 'dr.wilson@mindguard.com',
    avatar: '',
    status: 'rejected',
    specialty: 'Addiction Counseling',
    clients: 0,
    joinedAt: 'Mar 8, 2023',
    lastActive: 'N/A',
    rating: 0,
  },
  {
    id: '7',
    name: 'Dr. Emily Chen',
    email: 'dr.chen@mindguard.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop',
    status: 'verified',
    specialty: 'Child & Adolescent Therapy',
    clients: 18,
    joinedAt: 'Feb 28, 2023',
    lastActive: '3 hours ago',
    rating: 4.6,
  },
];

export default function TherapistsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredTherapists = therapists.filter(therapist => 
    therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    therapist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    therapist.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Therapist Management</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Therapist
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Therapists</TabsTrigger>
            <TabsTrigger value="verified">Verified</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search therapists..."
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
                <DropdownMenuItem>Specialty</DropdownMenuItem>
                <DropdownMenuItem>Join Date</DropdownMenuItem>
                <DropdownMenuItem>Rating</DropdownMenuItem>
                <DropdownMenuItem>Client Count</DropdownMenuItem>
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
                    <TableHead>Therapist</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Clients</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTherapists.map((therapist) => (
                    <TableRow key={therapist.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={therapist.avatar} alt={therapist.name} />
                            <AvatarFallback>{therapist.name.charAt(0)}{therapist.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{therapist.name}</span>
                            <span className="text-xs text-muted-foreground">{therapist.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          therapist.status === 'verified' ? 'default' : 
                          therapist.status === 'pending' ? 'secondary' : 
                          'destructive'
                        }>
                          {therapist.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{therapist.specialty}</TableCell>
                      <TableCell>{therapist.clients}</TableCell>
                      <TableCell>{therapist.joinedAt}</TableCell>
                      <TableCell>{therapist.lastActive}</TableCell>
                      <TableCell>
                        {therapist.rating > 0 ? (
                          <div className="flex items-center">
                            <span className="font-medium">{therapist.rating}</span>
                            <span className="text-yellow-500 ml-1">★</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
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
                              Edit Details
                            </DropdownMenuItem>
                            {therapist.status === 'pending' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <XCircle className="mr-2 h-4 w-4 text-destructive" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove
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
        
        <TabsContent value="verified" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Verified Therapists</CardTitle>
              <CardDescription>
                Manage therapists who have been verified and are active on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Showing verified therapists only. Filter applied.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Verification</CardTitle>
              <CardDescription>
                Review and verify therapists who have applied to join the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Showing pending therapists only. Filter applied.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rejected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Applications</CardTitle>
              <CardDescription>
                Review therapists whose applications have been rejected.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Showing rejected therapists only. Filter applied.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}