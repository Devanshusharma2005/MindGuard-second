"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ConsultationHistory } from "./consultation-history";
import { DoctorInfoPopup } from "./doctor-info-popup";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";

interface Doctor {
  id: number | string;
  _id?: string; // Optional MongoDB-style ID that might be present
  name: string;
  fullName?: string; // Optional property from backend
  email: string;
  specialty: string;
  specialization?: string; // Optional property from backend
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
          console.log("Received doctors data:", data.data);
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
      
      // Use _id if available, otherwise fall back to id
      const doctorIdToStore = selectedDoctor._id || String(selectedDoctor.id);
      console.log("Storing doctor ID in localStorage:", doctorIdToStore);
      
      // Store the selected doctor ID in localStorage for the patient form
      localStorage.setItem('scheduled_doctor_id', doctorIdToStore);
      
      // Get patient info from localStorage
      const patientId = localStorage.getItem('mindguard_user_id');
      const patientName = localStorage.getItem('username');
      const patientEmail = localStorage.getItem('email');
      
      if (patientId && patientName && patientEmail) {
        // Create and submit initial patient data record for the doctor
        submitInitialPatientData(doctorIdToStore, patientId, patientName, patientEmail)
          .then(() => {
            // After successful data submission, open Cal.com
            window.open(selectedDoctor.bookingLink, "_blank");
          })
          .catch(error => {
            console.error("Error submitting initial patient data:", error);
            // Open Cal.com anyway even if data submission fails
            window.open(selectedDoctor.bookingLink, "_blank");
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        // If patient info is not available, just open Cal.com
        window.open(selectedDoctor.bookingLink, "_blank");
        setLoading(false);
      }

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
    }
  };
  
  // Function to submit initial patient data to the doctor
  const submitInitialPatientData = async (doctorId: string, patientId: string, patientName: string, patientEmail: string) => {
    try {
      // Get auth token
      const token = localStorage.getItem('token') || localStorage.getItem('mindguard_token');
      
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      // Format token properly with Bearer prefix if it doesn't have it
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      // Prepare initial patient data
      const patientData = {
        doctorId,
        patientId,
        patientName,
        patientEmail,
        patientAge: '', // These will be filled in the patient profile form later
        patientGender: '',
        hasCompletedQuestionnaire: false,
        mentalHealthConcern: 'Initial consultation',
        appointmentRequestDate: new Date().toISOString(),
        status: 'requested'
      };
      
      console.log("Submitting initial patient data to doctor:", patientData);
      
      // Submit data to API
      const response = await fetch('/api/extra-details-patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken
        },
        body: JSON.stringify(patientData)
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to submit patient data');
      }
      
      console.log("Initial patient data submitted successfully");
      
      // Also notify the patient they need to complete their profile
      toast({
        title: "Appointment Requested",
        description: "Please complete your medical profile for the doctor after scheduling your appointment time.",
        duration: 5000
      });
      
      return true;
    } catch (error) {
      console.error("Error submitting initial patient data:", error);
      
      toast({
        title: "Warning",
        description: "We couldn't save your initial data. Please make sure to complete your profile after scheduling.",
        variant: "destructive",
        duration: 5000
      });
      
      return false;
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
