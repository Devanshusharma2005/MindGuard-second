"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Download, FileText, MapPin, Pill, Video } from "lucide-react";

const pastConsultations = [
  {
    id: 1,
    doctor: "Dr. Sarah Johnson",
    specialty: "Psychiatrist",
    date: "May 15, 2025",
    time: "2:00 PM",
    type: "virtual",
    status: "completed",
    notes: true,
    prescription: true,
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=256&h=256&auto=format&fit=crop"
  },
  {
    id: 2,
    doctor: "Dr. Michael Chen",
    specialty: "Therapist",
    date: "April 22, 2025",
    time: "10:30 AM",
    type: "in-person",
    status: "completed",
    notes: true,
    prescription: false,
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=256&h=256&auto=format&fit=crop"
  },
  {
    id: 3,
    doctor: "Dr. Emily Rodriguez",
    specialty: "Clinical Psychologist",
    date: "March 10, 2025",
    time: "3:15 PM",
    type: "virtual",
    status: "completed",
    notes: true,
    prescription: true,
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=256&h=256&auto=format&fit=crop"
  }
];

const prescriptions = [
  {
    id: 1,
    medication: "Sertraline",
    dosage: "50mg",
    frequency: "Once daily",
    prescribed: "May 15, 2025",
    doctor: "Dr. Sarah Johnson",
    refills: 2,
    active: true
  },
  {
    id: 2,
    medication: "Lorazepam",
    dosage: "0.5mg",
    frequency: "As needed for anxiety",
    prescribed: "May 15, 2025",
    doctor: "Dr. Sarah Johnson",
    refills: 0,
    active: true
  },
  {
    id: 3,
    medication: "Trazodone",
    dosage: "50mg",
    frequency: "Once at bedtime",
    prescribed: "March 10, 2025",
    doctor: "Dr. Emily Rodriguez",
    refills: 1,
    active: false
  }
];

export function ConsultationHistory() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="appointments">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="appointments">Past Appointments</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>
        <TabsContent value="appointments" className="space-y-4">
          {pastConsultations.map((consultation) => (
            <Card key={consultation.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={consultation.avatar} />
                      <AvatarFallback>{consultation.doctor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{consultation.doctor}</p>
                      <p className="text-sm text-muted-foreground">{consultation.specialty}</p>
                      <div className="mt-1 flex items-center text-xs text-muted-foreground">
                        <CalendarDays className="mr-1 h-3 w-3" />
                        {consultation.date} at {consultation.time}
                      </div>
                      <div className="mt-1 flex items-center text-xs text-muted-foreground">
                        {consultation.type === "virtual" ? (
                          <>
                            <Video className="mr-1 h-3 w-3" />
                            Virtual Consultation
                          </>
                        ) : (
                          <>
                            <MapPin className="mr-1 h-3 w-3" />
                            In-Person Visit
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge variant={consultation.status === "completed" ? "outline" : "secondary"}>
                    {consultation.status === "completed" ? "Completed" : consultation.status}
                  </Badge>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  {consultation.notes && (
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <FileText className="h-3 w-3" />
                      View Notes
                    </Button>
                  )}
                  {consultation.prescription && (
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Pill className="h-3 w-3" />
                      View Prescription
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="h-8 gap-1 ml-auto">
                    <Download className="h-3 w-3" />
                    Download Summary
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" className="w-full">Load More</Button>
        </TabsContent>
        <TabsContent value="prescriptions" className="space-y-4">
          {prescriptions.map((prescription) => (
            <Card key={prescription.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{prescription.medication}</p>
                      <Badge variant={prescription.active ? "outline" : "secondary"}>
                        {prescription.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm">{prescription.dosage} - {prescription.frequency}</p>
                    <p className="text-xs text-muted-foreground">Prescribed by {prescription.doctor}</p>
                    <p className="text-xs text-muted-foreground">Date: {prescription.prescribed}</p>
                    <p className="text-xs text-muted-foreground">Refills remaining: {prescription.refills}</p>
                  </div>
                  <div className="flex gap-2">
                    {prescription.active && prescription.refills > 0 && (
                      <Button variant="outline" size="sm">Request Refill</Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}