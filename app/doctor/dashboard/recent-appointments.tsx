import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video } from "lucide-react";

interface Appointment {
  id: string;
  patientName: string;
  patientImage?: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  type: "in-person" | "video";
}

interface RecentAppointmentsProps {
  appointments: Appointment[];
}

export function RecentAppointments({ appointments }: RecentAppointmentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Appointments</CardTitle>
        <CardDescription>You have {appointments.length} appointments scheduled for today.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between space-x-4 rounded-md border p-4"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={appointment.patientImage} />
                  <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{appointment.patientName}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>{appointment.date}</span>
                    <Clock className="ml-3 mr-1 h-3 w-3" />
                    <span>{appointment.time}</span>
                    {appointment.type === "video" && (
                      <Video className="ml-3 mr-1 h-3 w-3" />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    appointment.status === "upcoming"
                      ? "default"
                      : appointment.status === "completed"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {appointment.status}
                </Badge>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}