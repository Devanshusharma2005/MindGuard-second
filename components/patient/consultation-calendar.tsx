"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Video } from "lucide-react";

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Psychiatrist",
    rating: 4.9,
    reviews: 124,
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=256&h=256&auto=format&fit=crop",
    available: true
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Therapist",
    rating: 4.8,
    reviews: 98,
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=256&h=256&auto=format&fit=crop",
    available: true
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Clinical Psychologist",
    rating: 4.7,
    reviews: 87,
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=256&h=256&auto=format&fit=crop",
    available: true
  }
];

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", 
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
];

export function ConsultationCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [consultationType, setConsultationType] = useState("virtual");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-medium">Consultation Type</p>
          <RadioGroup
            value={consultationType}
            onValueChange={setConsultationType}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="virtual" id="virtual" />
              <Label htmlFor="virtual" className="flex items-center gap-2">
                <Video className="h-4 w-4" /> Virtual Consultation
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="in-person" id="in-person" />
              <Label htmlFor="in-person" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> In-Person Visit
              </Label>
            </div>
          </RadioGroup>

          <div className="mt-6">
            <p className="mb-2 text-sm font-medium">Select Date</p>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              disabled={(date) => {
                // Disable past dates and weekends
                const now = new Date();
                now.setHours(0, 0, 0, 0);
                const day = date.getDay();
                return date < now || day === 0 || day === 6;
              }}
            />
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Select Provider</p>
          <div className="space-y-3">
            {doctors.map((doctor) => (
              <Card 
                key={doctor.id} 
                className={`cursor-pointer transition-colors ${selectedDoctor === doctor.id.toString() ? 'border-primary' : ''}`}
                onClick={() => setSelectedDoctor(doctor.id.toString())}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={doctor.avatar} />
                      <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{doctor.name}</p>
                        {doctor.available && (
                          <Badge variant="outline" className="text-xs">Available</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span className="text-amber-500">★</span> {doctor.rating} ({doctor.reviews} reviews)
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedDoctor && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium">Select Time</p>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <Button 
        className="w-full" 
        disabled={!selectedDoctor || !selectedTime || !date}
      >
        Book Appointment
      </Button>
    </div>
  );
}