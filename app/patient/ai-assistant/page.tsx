"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIChat } from "@/components/patient/ai-chat";
import { WellnessReminders } from "@/components/patient/wellness-reminders";
import { CrisisResources } from "@/components/patient/crisis-resources";

export default function AIAssistant() {
  const [activeTab, setActiveTab] = useState("chat");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Mental Health Assistant</h1>
          <p className="text-muted-foreground">
            Get guidance, relaxation techniques, and support from our AI assistant
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
          <TabsTrigger value="reminders">Wellness Reminders</TabsTrigger>
          <TabsTrigger value="crisis">Crisis Resources</TabsTrigger>
        </TabsList>
        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Chat with Your AI Assistant</CardTitle>
              <CardDescription>
                Ask questions, get mental health guidance, and learn relaxation techniques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIChat />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reminders">
          <Card>
            <CardHeader>
              <CardTitle>Daily Wellness Reminders</CardTitle>
              <CardDescription>
                Customize your self-care tips and wellness notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WellnessReminders />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="crisis">
          <Card>
            <CardHeader>
              <CardTitle>Crisis Intervention Resources</CardTitle>
              <CardDescription>
                Access immediate support resources when you need them most
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CrisisResources />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}