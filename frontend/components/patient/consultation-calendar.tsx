"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ConsultationHistory } from "./consultation-history"; // Import the ConsultationHistory component

interface Consultation {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: string;
  status: string;
  avatar: string;
}

const doctors = [
  {
    id: 1,
    name: "Dr. Devanshu Sharma",
    specialty: "Psychiatrist",
    rating: 4.9,
    reviews: 124,
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=256&h=256&auto=format&fit=crop",
    available: true,
    bookingLink: "https://cal.com/devanshu-sharma-9noi9z"
  },
  {
    id: 2,
    name: "Dr. Priyanshu Thapliyal",
    specialty: "Therapist",
    rating: 4.8,
    reviews: 98,
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=256&h=256&auto=format&fit=crop",
    available: true,
    bookingLink: "https://cal.com/pandathap"
  }
];

export function ConsultationCalendar() {
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [bookedConsultations, setBookedConsultations] = useState<Consultation[]>([]);

  const handleBooking = () => {
    if (selectedDoctor) {
      setLoading(true);
      window.open(selectedDoctor.bookingLink, "_blank");

      // Create a consultation entry
      const newConsultation: Consultation = {
        id: bookedConsultations.length + 1,
        doctor: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        type: "virtual",
        status: "scheduled",
        avatar: selectedDoctor.avatar
      };

      // Update booked consultations
      setBookedConsultations([...bookedConsultations, newConsultation]);

      setConfirmationMessage(`Booking initiated for ${selectedDoctor.name}. Please check your email for confirmation.`);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-medium">Select Provider</p>
          <div className="space-y-3">
            {doctors.map((doctor) => (
              <Card 
                key={doctor.id} 
                className={`cursor-pointer transition-colors ${selectedDoctor?.id === doctor.id ? 'border-primary' : ''}`}
                onClick={() => setSelectedDoctor(doctor)}
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
                        {doctor.available ? (
                          <Badge variant="outline" className="text-xs">Available</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-red-500">Unavailable</Badge>
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
        </div>
      </div>

      <Button 
        className="w-full" 
        disabled={!selectedDoctor || loading}
        onClick={handleBooking}
      >
        {loading ? "Booking..." : "Book Appointment"}
      </Button>

      {confirmationMessage && (
        <div className="mt-4 text-green-600">
          {confirmationMessage}
        </div>
      )}

      {/* Pass the booked consultations to ConsultationHistory */}
      <ConsultationHistory consultations={bookedConsultations} />
    </div>
  );
}
