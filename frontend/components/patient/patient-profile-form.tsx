"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const formSchema = z.object({
  doctorId: z.string().min(1, {
    message: "Doctor ID is required.",
  }),
  medicalHistory: z.string().optional(),
  currentMedications: z.string().optional(),
  allergies: z.string().optional(),
  symptoms: z.string().min(1, {
    message: "Please describe your symptoms.",
  }),
  mentalHealthConcern: z.string().min(1, {
    message: "Please describe your mental health concern.",
  }),
  notes: z.string().optional(),
});

export function PatientProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      doctorId: "",
      medicalHistory: "",
      currentMedications: "",
      allergies: "",
      symptoms: "",
      mentalHealthConcern: "",
      notes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      
      // Get patient data from localStorage
      const patientId = localStorage.getItem('mindguard_user_id');
      const patientName = localStorage.getItem('username');
      const patientEmail = localStorage.getItem('email');
      
      if (!patientId || !patientName || !patientEmail) {
        toast({
          title: "Error",
          description: "Patient information not found. Please log in again.",
          variant: "destructive",
        });
        return;
      }
      
      // Get auth token
      const token = localStorage.getItem('token') || localStorage.getItem('mindguard_token');
      
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token not found. Please log in again.",
          variant: "destructive",
        });
        return;
      }
      
      // Format token properly with Bearer prefix if it doesn't have it
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      // Format medications and allergies as arrays
      const formattedData = {
        ...values,
        patientId,
        patientName,
        patientEmail,
        currentMedications: values.currentMedications ? values.currentMedications.split(',').map(m => m.trim()) : [],
        allergies: values.allergies ? values.allergies.split(',').map(a => a.trim()) : [],
      };
      
      console.log("Submitting patient data to doctor:", formattedData);
      
      const response = await fetch('/api/extra-details-patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken,
        },
        body: JSON.stringify(formattedData),
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        toast({
          title: "Success",
          description: "Your details have been sent to the doctor successfully",
        });
        
        // Reset the form
        form.reset();
        
        // Redirect to patient dashboard
        router.push('/patient');
      } else {
        throw new Error(data.message || 'Failed to submit patient details');
      }
    } catch (error) {
      console.error('Error submitting patient details:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit patient details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit Your Details to Doctor</CardTitle>
        <CardDescription>
          Fill out this form to share your medical details with the doctor you want to consult.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="doctorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doctor ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the doctor ID" {...field} />
                  </FormControl>
                  <FormDescription>
                    You can find the doctor ID on their profile or appointment card.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="mentalHealthConcern"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mental Health Concern</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your mental health concerns"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Symptoms</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your current symptoms"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="medicalHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical History</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your medical history"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="currentMedications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Medications</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter medications separated by commas"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter medications separated by commas (e.g. Prozac, Lexapro)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="allergies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allergies</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter allergies separated by commas"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter allergies separated by commas (e.g. Penicillin, Peanuts)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes you want to share with the doctor"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Details to Doctor"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 