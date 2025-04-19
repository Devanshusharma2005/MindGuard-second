"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, User, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { userIdKey } from "@/lib/config";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";

interface PatientSubmission {
  _id: string;
  patientName: string;
  patientEmail: string;
  appointmentRequestDate: string;
  mentalHealthConcern?: string;
  status: string;
}

export function NewPatientSubmissions() {
  const [submissions, setSubmissions] = useState<PatientSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewSubmissions = async () => {
      try {
        setLoading(true);
        
        // Get doctor ID from localStorage
        const doctorId = localStorage.getItem(userIdKey);
        if (!doctorId) {
          setError("Doctor ID not found. Please log in again.");
          setLoading(false);
          return;
        }
        
        // Get auth token
        const token = localStorage.getItem('mindguard_token');
        if (!token) {
          setError("Authentication token not found. Please log in again.");
          setLoading(false);
          return;
        }
        
        // Format token properly with Bearer prefix if it doesn't have it
        const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        
        // Fetch the new patient submissions (requested status only)
        const response = await fetch(`/api/extra-details-patients?doctorId=${doctorId}&status=requested`, {
          headers: {
            'Authorization': authToken,
          },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch new patient submissions");
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && data.data) {
          const patientData = Array.isArray(data.data) ? data.data : [];
          setSubmissions(patientData);
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching new patient submissions:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewSubmissions();
    
    // Refresh data every 5 minutes
    const intervalId = setInterval(fetchNewSubmissions, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            <span>New Patient Submissions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            <span>New Patient Submissions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          <span>New Patient Submissions</span>
          {submissions.length > 0 && (
            <Badge className="ml-2 bg-primary">{submissions.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <User className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>No new patient submissions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div key={submission._id} className="flex items-start gap-3 border-b pb-3 last:border-0">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {submission.patientName.split(' ').map(name => name[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{submission.patientName}</p>
                    <Badge>New</Badge>
                  </div>
                  
                  {submission.mentalHealthConcern && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {submission.mentalHealthConcern}
                    </p>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    Submitted on {new Date(submission.appointmentRequestDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            
            <div className="pt-2">
              <Link href="/doctor/patients">
                <Button className="w-full" variant="outline">
                  View All Patients
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 