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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Download, 
  FileText, 
  Mail, 
  Pill, 
  Plus, 
  Search, 
  Sparkles 
} from "lucide-react";

export default function PrescriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data - in a real app, this would come from an API
  const prescriptions = [
    {
      id: "1",
      patientName: "Sarah Johnson",
      patientImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=128&h=128&auto=format&fit=crop",
      medication: "Sertraline",
      dosage: "50mg",
      frequency: "Once daily",
      startDate: "Aug 15, 2025",
      endDate: "Nov 15, 2025",
      status: "Active",
      notes: "Take in the morning with food",
    },
    {
      id: "2",
      patientName: "Michael Brown",
      patientImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=128&h=128&auto=format&fit=crop",
      medication: "Escitalopram",
      dosage: "10mg",
      frequency: "Once daily",
      startDate: "Jul 20, 2025",
      endDate: "Oct 20, 2025",
      status: "Active",
      notes: "Take before bedtime",
    },
    {
      id: "3",
      patientName: "Emily Davis",
      patientImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=128&h=128&auto=format&fit=crop",
      medication: "Alprazolam",
      dosage: "0.5mg",
      frequency: "As needed",
      startDate: "Aug 5, 2025",
      endDate: "Sep 5, 2025",
      status: "Active",
      notes: "Take only when experiencing severe anxiety, max 3 times per day",
    },
    {
      id: "4",
      patientName: "David Wilson",
      patientImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&h=128&auto=format&fit=crop",
      medication: "Lithium",
      dosage: "300mg",
      frequency: "Twice daily",
      startDate: "Jun 10, 2025",
      endDate: "Dec 10, 2025",
      status: "Active",
      notes: "Take with meals, regular blood tests required",
    },
    {
      id: "5",
      patientName: "Jennifer Lee",
      patientImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=128&h=128&auto=format&fit=crop",
      medication: "Fluoxetine",
      dosage: "20mg",
      frequency: "Once daily",
      startDate: "May 15, 2025",
      endDate: "Aug 15, 2025",
      status: "Expired",
      notes: "Take in the morning",
    },
  ];

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prescription.medication.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const aiSuggestions = [
    {
      medication: "Sertraline",
      dosage: "50mg",
      frequency: "Once daily",
      reason: "Recommended for anxiety with minimal side effects",
    },
    {
      medication: "Escitalopram",
      dosage: "10mg",
      frequency: "Once daily",
      reason: "Effective for depression with anxiety symptoms",
    },
    {
      medication: "Bupropion",
      dosage: "150mg",
      frequency: "Once daily",
      reason: "Alternative with less sexual side effects",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prescriptions</h1>
          <p className="text-muted-foreground">
            Manage patient prescriptions and medications
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Prescription
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Prescription</DialogTitle>
              <DialogDescription>
                Fill in the details for the new prescription
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="patient" className="text-right">
                  Patient
                </label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="michael">Michael Brown</SelectItem>
                    <SelectItem value="emily">Emily Davis</SelectItem>
                    <SelectItem value="david">David Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="medication" className="text-right">
                  Medication
                </label>
                <div className="col-span-3 space-y-2">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select medication" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sertraline">Sertraline</SelectItem>
                      <SelectItem value="escitalopram">Escitalopram</SelectItem>
                      <SelectItem value="alprazolam">Alprazolam</SelectItem>
                      <SelectItem value="lithium">Lithium</SelectItem>
                      <SelectItem value="fluoxetine">Fluoxetine</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="w-full">
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI Medication Suggestions
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="dosage" className="text-right">
                  Dosage
                </label>
                <Input
                  id="dosage"
                  placeholder="e.g., 50mg"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="frequency" className="text-right">
                  Frequency
                </label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Once daily</SelectItem>
                    <SelectItem value="twice">Twice daily</SelectItem>
                    <SelectItem value="three">Three times daily</SelectItem>
                    <SelectItem value="needed">As needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="startDate" className="text-right">
                  Start Date
                </label>
                <Input
                  id="startDate"
                  type="date"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="endDate" className="text-right">
                  End Date
                </label>
                <Input
                  id="endDate"
                  type="date"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="notes" className="text-right">
                  Notes
                </label>
                <Textarea
                  id="notes"
                  placeholder="Additional instructions or notes"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Prescription</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Prescription List</CardTitle>
              <CardDescription>
                View and manage all patient prescriptions
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prescriptions..."
                className="pl-8 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrescriptions.map((prescription) => (
                <TableRow key={prescription.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={prescription.patientImage} />
                        <AvatarFallback>{prescription.patientName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{prescription.patientName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{prescription.medication}</TableCell>
                  <TableCell>{prescription.dosage}</TableCell>
                  <TableCell>{prescription.frequency}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs">From: {prescription.startDate}</span>
                      <span className="text-xs">To: {prescription.endDate}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={prescription.status === "Active" ? "default" : "secondary"}>
                      {prescription.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="icon">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Medication Recommendations</CardTitle>
          <CardDescription>
            Smart suggestions based on patient history and condition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiSuggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start space-x-4 rounded-md border p-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Pill className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="font-medium">{suggestion.medication} {suggestion.dosage}</h4>
                    <Badge variant="outline" className="ml-2">AI Suggested</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {suggestion.frequency}
                  </p>
                  <p className="text-sm mt-2">
                    <span className="font-medium">Reason:</span> {suggestion.reason}
                  </p>
                </div>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Use
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}