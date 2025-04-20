import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent, 
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, Mail, Phone, Clock, AlertCircle, CheckCircle, XCircle, FileText, Heart, Trash2 } from "lucide-react";
import { userIdKey } from "@/lib/config";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { PatientProfileView } from "./patient-profile-view";

interface PatientDetails {
  _id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  patientName: string;
  patientEmail: string;
  patientAge: string;
  patientGender: string;
  hasCompletedQuestionnaire: boolean;
  mentalHealthConcern?: string;
  appointmentRequestDate: string;
  status?: string;
  medicalHistory?: string;
  currentMedications?: string[];
  allergies?: string[];
  symptoms?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Appointment {
  _id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientAge: string;
  patientGender: string;
  mentalHealthConcern?: string;
  hasCompletedQuestionnaire: boolean;
  appointmentDate: string;
  status: string;
  notes?: string;
  createdAt: string;
}

export function PatientList() {
  const [patients, setPatients] = useState<PatientDetails[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<PatientDetails | null>(null);
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletePatientId, setDeletePatientId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const storedDoctorId = localStorage.getItem(userIdKey);
    if (storedDoctorId) {
      setDoctorId(storedDoctorId);
      fetchExtraDetailsPatientsData(storedDoctorId);
    } else {
      setError("Doctor ID not found. Please log in again.");
      setLoading(false);
    }
  }, []);

  const fetchExtraDetailsPatientsData = async (id: string) => {
    try {
      setLoading(true);
      
      // Get auth token from localStorage or your auth system
      const token = localStorage.getItem('mindguard_token');
      
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }
      
      // Format token properly with Bearer prefix if it doesn't have it
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      console.log("Fetching extraDetailsPatients data for doctor ID:", id);
      
      // Make a direct API call to extraDetailsPatients
      const response = await fetch(`/api/extra-details-patients/doctor/${id}`, {
        headers: {
          'Authorization': authToken
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch patient data');
      }
      
      const data = await response.json();
      console.log("Received extraDetailsPatients data:", data);
      
      if (data.status === 'success' && data.data && Array.isArray(data.data)) {
        console.log("Setting patients state with:", data.data);
        setPatients(data.data);
        setError(null);
      } else if (Array.isArray(data)) {
        // Handle case where API directly returns array
        console.log("Setting patients state with direct array:", data);
        setPatients(data);
        setError(null);
      } else {
        console.error("Unexpected data format:", data);
        throw new Error('Failed to fetch patient data: Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching extraDetailsPatients data:', error);
      setError('Unable to load patient data. Please try again later.');
      
      // Fall back to alternative methods if the direct approach fails
      fetchDoctorDashboardData(id);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorDashboardData = async (id: string) => {
    try {
      setLoading(true);
      
      // Get auth token
      const token = localStorage.getItem('mindguard_token');
      
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }
      
      // Format token properly with Bearer prefix
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      console.log("Falling back to dashboard data for doctor ID:", id);
      
      // Fetch dashboard data
      const dashboardResponse = await fetch(`/api/doctor/dashboard?doctorId=${id}`, {
        headers: {
          'Authorization': authToken
        },
        cache: 'no-store'
      });
      
      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        console.log("Received dashboard data:", dashboardData);
        
        if (dashboardData.status === 'success' && dashboardData.data) {
          // Set appointments
          if (Array.isArray(dashboardData.data.appointments)) {
            console.log("Setting appointments state with:", dashboardData.data.appointments);
            setAppointments(dashboardData.data.appointments);
          }
          
          // Convert appointments to patient details as a fallback
          if (patients.length === 0 && Array.isArray(dashboardData.data.appointments)) {
            const convertedPatients = dashboardData.data.appointments.map((appointment: Appointment) => ({
              _id: appointment._id,
              doctorId: appointment.doctorId,
              doctorName: '',
              doctorSpecialty: '',
              patientName: appointment.patientName,
              patientEmail: appointment.patientEmail,
              patientAge: appointment.patientAge,
              patientGender: appointment.patientGender,
              hasCompletedQuestionnaire: appointment.hasCompletedQuestionnaire,
              mentalHealthConcern: appointment.mentalHealthConcern,
              appointmentRequestDate: appointment.appointmentDate || appointment.createdAt,
              status: appointment.status
            }));
            console.log("Creating patient data from appointments:", convertedPatients);
            setPatients(convertedPatients);
          }
        }
      }
    } catch (error) {
      console.error('Error in fallback data fetching:', error);
    }
  };

  const updatePatientStatus = async (id: string, status: string) => {
    try {
      // Get auth token
      const token = localStorage.getItem('mindguard_token');
      
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token not found. Please log in again.",
          variant: "destructive"
        });
        return;
      }
      
      // Format token properly with Bearer prefix
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      const response = await fetch(`/api/extra-details-patients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update patient status');
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        // Update the patient status in the local state
        setPatients(patients.map(patient => 
          patient._id === id ? { ...patient, status } : patient
        ));
        
        // Also update the selected patient if it's the one being modified
        if (selectedPatient && selectedPatient._id === id) {
          setSelectedPatient({ ...selectedPatient, status });
        }
        
        toast({
          title: "Success",
          description: `Patient status updated to ${status}`,
        });
      } else {
        throw new Error(data.message || 'Failed to update patient status');
      }
    } catch (error) {
      console.error('Error updating patient status:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update patient status",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
      case 'confirmed':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500">Inactive</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };

  const renderSkeletons = () => {
    return Array(3).fill(0).map((_, index) => (
      <Card key={index} className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  // Function to delete a patient
  const deletePatient = async (id: string) => {
    try {
      setIsDeleting(true);
      
      // Get auth token
      const token = localStorage.getItem('mindguard_token');
      
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token not found. Please log in again.",
          variant: "destructive"
        });
        setIsDeleting(false);
        return;
      }
      
      // Format token properly with Bearer prefix
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      const response = await fetch(`/api/extra-details-patients/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': authToken
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete patient record');
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        // Remove the patient from the local state
        setPatients(patients.filter(patient => patient._id !== id));
        
        toast({
          title: "Success",
          description: "Patient record deleted successfully",
        });
        
        // Close the dialog if open
        setShowDeleteDialog(false);
      } else {
        throw new Error(data.message || 'Failed to delete patient record');
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to delete patient record",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setDeletePatientId(null);
    }
  };
  
  // Add a function to confirm delete
  const confirmDelete = (id: string) => {
    setDeletePatientId(id);
    setShowDeleteDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Your Patients</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => doctorId && fetchExtraDetailsPatientsData(doctorId)}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </>
            ) : "Refresh"}
          </Button>
        </div>
      </div>

      {loading ? (
        renderSkeletons()
      ) : error ? (
        <Card className="p-6 text-red-500 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-4"
            onClick={() => doctorId && fetchExtraDetailsPatientsData(doctorId)}
          >
            Retry
          </Button>
        </Card>
      ) : patients.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No patient data found.</p>
          <p className="text-sm text-muted-foreground mt-2">When patients submit their details, they'll appear here.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {console.log("Rendering patients:", patients)}
          {patients.map((patient) => (
            <Card key={patient._id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 flex flex-wrap items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {patient.patientName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{patient.patientName}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Mail className="h-3.5 w-3.5" />
                        <span>{patient.patientEmail}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    {getStatusBadge(patient.status)}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => confirmDelete(patient._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={() => setSelectedPatient(patient)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-5xl">
                        <DialogHeader>
                          <DialogTitle>Patient Details</DialogTitle>
                        </DialogHeader>
                        {selectedPatient && selectedPatient._id === patient._id && (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                                <dl className="space-y-2">
                                  <div className="flex flex-col">
                                    <dt className="text-sm font-medium text-muted-foreground">Full Name</dt>
                                    <dd className="text-sm">{selectedPatient.patientName}</dd>
                                  </div>
                                  <div className="flex flex-col">
                                    <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                                    <dd className="text-sm">{selectedPatient.patientEmail}</dd>
                                  </div>
                                  <div className="flex flex-col">
                                    <dt className="text-sm font-medium text-muted-foreground">Age</dt>
                                    <dd className="text-sm">{selectedPatient.patientAge || 'Not provided'}</dd>
                                  </div>
                                  <div className="flex flex-col">
                                    <dt className="text-sm font-medium text-muted-foreground">Gender</dt>
                                    <dd className="text-sm">{selectedPatient.patientGender || 'Not provided'}</dd>
                                  </div>
                                  <div className="flex flex-col">
                                    <dt className="text-sm font-medium text-muted-foreground">Appointment Status</dt>
                                    <dd className="text-sm">{selectedPatient.status || 'Not set'}</dd>
                                  </div>
                                  <div className="flex flex-col">
                                    <dt className="text-sm font-medium text-muted-foreground">Request Date</dt>
                                    <dd className="text-sm">
                                      {selectedPatient.appointmentRequestDate
                                        ? new Date(selectedPatient.appointmentRequestDate).toLocaleString()
                                        : 'Not provided'}
                                    </dd>
                                  </div>
                                </dl>
                              </div>
                              
                              <div>
                                <h3 className="text-lg font-semibold mb-4">Health Information</h3>
                                <dl className="space-y-4">
                                  <div className="flex flex-col">
                                    <dt className="text-sm font-medium text-muted-foreground">Mental Health Concern</dt>
                                    <dd className="text-sm">{selectedPatient.mentalHealthConcern || 'Not provided'}</dd>
                                  </div>
                                  <div className="flex flex-col">
                                    <dt className="text-sm font-medium text-muted-foreground">Completed Questionnaire</dt>
                                    <dd className="text-sm">{selectedPatient.hasCompletedQuestionnaire ? 'Yes' : 'No'}</dd>
                                  </div>
                                </dl>
                              </div>
                            </div>
                            
                            <DialogFooter className="flex justify-between border-t pt-3">
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline"
                                  onClick={() => setShowFullProfile(true)}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  Full Medical Profile
                                </Button>
                                <Link href={`/doctor/patients/${selectedPatient._id}`}>
                                  <Button variant="outline">
                                    View Patient Page
                                  </Button>
                                </Link>
                              </div>
                              
                              {(!selectedPatient.status || selectedPatient.status === 'requested') && (
                                <div className="flex gap-2">
                                  <Button
                                    variant="destructive"
                                    onClick={() => updatePatientStatus(selectedPatient._id, 'cancelled')}
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="default"
                                    onClick={() => updatePatientStatus(selectedPatient._id, 'confirmed')}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Confirm
                                  </Button>
                                </div>
                              )}
                            </DialogFooter>
                          </>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                
                <div className="border-t border-border p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center text-muted-foreground">
                      <User className="h-3.5 w-3.5 mr-1" />
                      <span>Age</span>
                    </div>
                    <span className="font-medium">{patient.patientAge || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center text-muted-foreground">
                      <User className="h-3.5 w-3.5 mr-1" />
                      <span>Gender</span>
                    </div>
                    <span className="font-medium">{patient.patientGender || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>Appointment Date</span>
                    </div>
                    <span className="font-medium">
                      {patient.appointmentRequestDate ? new Date(patient.appointmentRequestDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center text-muted-foreground">
                      <Heart className="h-3.5 w-3.5 mr-1" />
                      <span>Concern</span>
                    </div>
                    <span className="font-medium line-clamp-1">
                      {patient.mentalHealthConcern || 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Delete Patient Record</DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to delete this patient record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletePatientId && deletePatient(deletePatientId)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 