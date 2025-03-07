"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsultationCalendar } from "@/components/patient/consultation-calendar";
import { ConsultationHistory } from "@/components/patient/consultation-history";
import { SecureChat } from "@/components/patient/secure-chat";
import { RoomBookingProvider } from "@/lib/hooks/use-room-booking";

export default function Consultations() {
  const [activeTab, setActiveTab] = useState("book");
  
  useEffect(() => {
    // Load the Cal.com embed script
    const script = document.createElement("script");
    script.src = "https://app.cal.com/embed/embed.js";
    script.async = true;
    script.onload = () => {
      // Initialize the calendar after the script loads
      if (window.Cal) {
        window.Cal("init", "secret", { origin: "https://cal.com" });
        window.Cal.ns.secret("inline", {
          elementOrSelector: "#my-cal-inline",
          config: { layout: "month_view" },
          calLink: "devanshu-sharma-9noi9z/secret",
        });
      }
    };
    document.body.appendChild(script);

    // Cleanup script on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <RoomBookingProvider>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Doctor Consultations</h1>
            <p className="text-muted-foreground">
              Book appointments with licensed therapists and manage your medical support
            </p>
          </div>
          <Button>Book New Consultation</Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="book">Book Appointment</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="chat">Secure Chat</TabsTrigger>
          </TabsList>
          <TabsContent value="book">
            <Card>
              <CardHeader>
                <CardTitle>Schedule a Consultation</CardTitle>
                <CardDescription>
                  Choose between virtual or in-person appointments with our licensed professionals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConsultationCalendar />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Consultation History</CardTitle>
                <CardDescription>
                  View your past appointments, prescriptions, and diagnoses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConsultationHistory />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle>Secure Messaging</CardTitle>
                <CardDescription>
                  Follow up with your healthcare providers in a secure environment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SecureChat />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RoomBookingProvider>
  );
}