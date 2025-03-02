"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Video, MapPin } from "lucide-react";

const appointments = [
  {
    id: 1,
    doctor: "Dr. Sarah Johnson",
    specialty: "Psychiatrist",
    date: "June 15, 2025",
    time: "2:00 PM",
    type: "virtual",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=256&h=256&auto=format&fit=crop"
  },
  {
    id: 2,
    doctor: "Dr. Michael Chen",
    specialty: "Therapist",
    date: "June 22, 2025",
    time: "10:30 AM",
    type: "in-person",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=256&h=256&auto=format&fit=crop"
  }
];

export function UpcomingAppointments() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
        <CardDescription>Your scheduled consultations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="flex items-start space-x-4 rounded-md border p-3">
              <Avatar>
                <AvatarImage src={appointment.avatar} />
                <AvatarFallback>{appointment.doctor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{appointment.doctor}</p>
                  <div className="flex items-center">
                    {appointment.type === "virtual" ? (
                      <Video className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{appointment.specialty}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <CalendarDays className="mr-1 h-3 w-3" />
                  {appointment.date} at {appointment.time}
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full">View All Appointments</Button>
        </div>
      </CardContent>
    </Card>
  );
}