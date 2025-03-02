"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HealthQuestionnaire } from "@/components/patient/health-questionnaire";
import { HealthInsights } from "@/components/patient/health-insights";
import { ProgressCharts } from "@/components/patient/progress-charts";
import  Recommendations  from "@/components/patient/recommendations";

export default function HealthTracking() {
  const [activeTab, setActiveTab] = useState("questionnaire");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health Tracking</h1>
          <p className="text-muted-foreground">
            Monitor your mental health progress and receive personalized insights
          </p>
        </div>
        <Button>Complete Today's Check-in</Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="questionnaire">Questionnaire</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        <TabsContent value="questionnaire">
          <Card>
            <CardHeader>
              <CardTitle>Daily Health Assessment</CardTitle>
              <CardDescription>
                Answer a few questions to help us understand how you're feeling today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HealthQuestionnaire />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Your Health Insights</CardTitle>
              <CardDescription>
                AI-generated analysis based on your responses and patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HealthInsights />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>
                Visualize your mental health journey over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressCharts />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>
                Tailored suggestions to improve your mental wellbeing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Recommendations />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}