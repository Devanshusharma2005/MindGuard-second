"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ConsultationHistory } from "./consultation-history";
import { DoctorInfoPopup } from "./doctor-info-popup";
import { Skeleton } from "@/components/ui/skeleton";

interface Doctor {
  id: number;
  name: string;
  email: string;
  specialty: string;
  yearsOfExperience: number;
  rating: number;
  reviews: number;
  avatar: string;
  available: boolean;
  bookingLink: string;
}

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

export function ConsultationCalendar() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showDoctorInfo, setShowDoctorInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [bookedConsultations, setBookedConsultations] = useState<Consultation[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch doctors from the API
    const fetchDoctors = async () => {
      try {
        setFetchingDoctors(true);
        const response = await fetch('/api/doctors');
        
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && Array.isArray(data.data)) {
          setDoctors(data.data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError('Unable to load doctors. Please try again later.');
      } finally {
        setFetchingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleDoctorClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorInfo(true);
  };

  const handleCloseDoctorInfo = () => {
    setShowDoctorInfo(false);
  };

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

  // Loading skeletons for doctors
  const DoctorSkeletons = () => (
    <>
      {[1, 2, 3].map((i) => (
        <Card key={i} className="cursor-not-allowed">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-medium">Select Provider</p>
          
          {error && (
            <div className="text-red-500 mb-4">
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          )}
          
          <div className="space-y-3">
            {fetchingDoctors ? (
              <DoctorSkeletons />
            ) : (
              doctors.map((doctor) => (
                <Card 
                  key={doctor.id} 
                  className={`cursor-pointer transition-colors ${selectedDoctor?.id === doctor.id ? 'border-primary' : ''}`}
                  onClick={() => handleDoctorClick(doctor)}
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
              ))
            )}
            
            {!fetchingDoctors && doctors.length === 0 && !error && (
              <div className="text-center py-8 text-muted-foreground">
                No doctors currently available.
              </div>
            )}
          </div>
        </div>
      </div>

      <Button 
        className="w-full" 
        disabled={!selectedDoctor || loading || fetchingDoctors}
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

      {/* Doctor Info Popup */}
      {showDoctorInfo && selectedDoctor && (
        <DoctorInfoPopup 
          doctor={selectedDoctor} 
          onClose={handleCloseDoctorInfo} 
        />
      )}
    </div>
  );
}
