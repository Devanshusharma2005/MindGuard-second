"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Download, 
  FileText, 
  Filter, 
  MoreHorizontal, 
  Plus, 
  Search, 
  UserPlus 
} from "lucide-react";

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data - in a real app, this would come from an API
  const patients = [
    {
      id: "1",
      name: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=128&h=128&auto=format&fit=crop",
      age: 32,
      gender: "Female",
      condition: "Anxiety",
      status: "Active",
      lastVisit: "Today",
      nextAppointment: "Aug 25, 2025",
      sentiment: "Improving",
    },
    {
      id: "2",
      name: "Michael Brown",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=128&h=128&auto=format&fit=crop",
      age: 45,
      gender: "Male",
      condition: "Depression",
      status: "Active",
      lastVisit: "Yesterday",
      nextAppointment: "Aug 22, 2025",
      sentiment: "Stable",
    },
    {
      id: "3",
      name: "Emily Davis",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=128&h=128&auto=format&fit=crop",
      age: 28,
      gender: "Female",
      condition: "PTSD",
      status: "Active",
      lastVisit: "Aug 10, 2025",
      nextAppointment: "Aug 24, 2025",
      sentiment: "Needs attention",
    },
    {
      id: "4",
      name: "David Wilson",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&h=128&auto=format&fit=crop",
      age: 52,
      gender: "Male",
      condition: "Bipolar",
      status: "Active",
      lastVisit: "Aug 12, 2025",
      nextAppointment: "Aug 26, 2025",
      sentiment: "Improving",
    },
    {
      id: "5",
      name: "Jennifer Lee",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=128&h=128&auto=format&fit=crop",
      age: 35,
      gender: "Female",
      condition: "Anxiety",
      status: "Inactive",
      lastVisit: "Jul 28, 2025",
      nextAppointment: "Not scheduled",
      sentiment: "Unknown",
    },
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">
            Manage your patients and their information
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Patient
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Patient List</CardTitle>
              <CardDescription>
                View and manage all your patients
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  className="pl-8 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Next Appointment</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={patient.image} />
                        <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">{patient.gender}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.condition}</TableCell>
                  <TableCell>
                    <Badge variant={patient.status === "Active" ? "default" : "secondary"}>
                      {patient.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{patient.lastVisit}</TableCell>
                  <TableCell>{patient.nextAppointment}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        patient.sentiment === "Improving"
                          ? "default"
                          : patient.sentiment === "Stable"
                          ? "secondary"
                          : patient.sentiment === "Needs attention"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {patient.sentiment}
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
                          <FileText className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule Appointment
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Prescription
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download Records
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
    </div>
  );
}