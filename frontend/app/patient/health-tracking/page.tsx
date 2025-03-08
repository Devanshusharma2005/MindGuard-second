"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HealthQuestionnaire } from "@/components/patient/health-questionnaire";
import { VoiceQuestionnaire } from "@/components/patient/voice-questionnaire";
import { HealthInsights } from "@/components/patient/health-insights";
import { ProgressCharts } from "@/components/patient/progress-charts";
import Recommendations from "@/components/patient/recommendations";

interface HealthData {
  insights: {
    mainInsight: {
      [key: string]: number;
    };
    riskAnalysis: {
      low: number;
      moderate: number;
      high: number;
    };
    anxietyTrend: {
      status: "increasing" | "decreasing" | "stable";
      percentage: number;
      detail: string;
    };
    stressResponse: {
      status: "improving" | "worsening" | "stable";
      percentage: number;
      detail: string;
    };
    moodStability: {
      status: "stable" | "fluctuating";
      detail: string;
    };
    patterns: string[];
  };
  progress: {
    moodData: Array<{
      date: string;
      mood: number;
      anxiety: number;
      stress: number;
    }>;
    sleepData: Array<{
      date: string;
      hours: number;
      quality: number;
    }>;
    activityData: Array<{
      date: string;
      exercise: number;
      meditation: number;
      social: number;
    }>;
    summary: {
      mood: { change: number };
      anxiety: { change: number };
      stress: { change: number };
      sleep: {
        durationChange: number;
        qualityChange: number;
      };
      activities: {
        exerciseChange: number;
        meditationChange: number;
        socialChange: number;
      };
    };
  };
  recommendations: {
    articles: Array<{
      title: string;
      type: string;
      duration: string;
      description: string;
      action: {
        label: string;
        url: string;
      };
    }>;
    videos: Array<{
      title: string;
      type: string;
      duration: string;
      description: string;
      action: {
        label: string;
        url: string;
      };
    }>;
    wellness: Array<{
      title: string;
      type: string;
      duration: string;
      description: string;
      action: {
        label: string;
        url: string;
      };
    }>;
  };
}

export default function HealthTracking() {
  const [activeTab, setActiveTab] = useState("questionnaire");
  const [assessmentType, setAssessmentType] = useState<"text" | "voice">("text");
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const userId = localStorage.getItem("mindguard_user_id");
    if (userId) {
      fetchHealthHistory(userId);
    }
  }, []);

  const fetchHealthHistory = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/health-tracking/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch health history");
      const data = await response.json();
      setHealthData(data);
    } catch (err) {
      console.error("Error fetching health history:", err);
      setError("Failed to load health history");
    }
  };

  const handleQuestionnaireSubmit = async (data: any) => {
    setLoading(true);
    setError("");
    
    try {
      console.log("Submitting questionnaire data:", data);
      const response = await fetch("http://localhost:5000/health-tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Failed to submit questionnaire: ${response.status}`);
      }

      const result = await response.json();
      console.log("Received response:", result);
      setHealthData(result);
      setActiveTab("insights");
    } catch (err) {
      console.error("Error submitting questionnaire:", err);
      setError(err instanceof Error ? err.message : "Failed to submit questionnaire");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health Tracking</h1>
          <p className="text-muted-foreground">
            Monitor your mental health progress and receive personalized insights
          </p>
        </div>
        {error && (
          <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
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
                Choose your preferred way to complete the assessment
              </CardDescription>
              <div className="flex gap-4 mt-4">
                <Button
                  variant={assessmentType === "text" ? "default" : "outline"}
                  onClick={() => setAssessmentType("text")}
                >
                  Text Questionnaire
                </Button>
                <Button
                  variant={assessmentType === "voice" ? "default" : "outline"}
                  onClick={() => setAssessmentType("voice")}
                >
                  Voice Assessment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {assessmentType === "text" ? (
                <HealthQuestionnaire 
                  onSubmit={handleQuestionnaireSubmit}
                  isLoading={loading}
                />
              ) : (
                <VoiceQuestionnaire 
                  onSubmit={handleQuestionnaireSubmit}
                  isLoading={loading}
                />
              )}
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
              <HealthInsights insights={healthData?.insights} />
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
              <ProgressCharts progressData={healthData?.progress} />
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
              <Recommendations recommendations={healthData?.recommendations} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}