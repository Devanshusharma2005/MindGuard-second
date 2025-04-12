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
import { ReportSubmission } from "@/components/patient/report-submission";

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
    wellness: {
      lifestyle: {
        title: string;
        type: string;
        duration: string;
        description: string;
        steps: string[];
      }[];
      exercises: {
        title: string;
        type: string;
        duration: string;
        description: string;
        routine: string[];
      }[];
      mindfulness: {
        title: string;
        type: string;
        duration: string;
        description: string;
        techniques: string[];
      }[];
      natural_remedies: {
        title: string;
        type: string;
        description: string;
        remedies: string[];
        disclaimer: string;
      }[];
    };
  };
}

export default function HealthTracking() {
  const [activeTab, setActiveTab] = useState("questionnaire");
  const [assessmentType, setAssessmentType] = useState<"text" | "voice" | "report">("text");
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    // Check if it's first time from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    setIsFirstTime(urlParams.get('firstTime') === 'true');

    const userId = localStorage.getItem("mindguard_user_id");
    if (userId) {
      fetchHealthHistory(userId);
    }
  }, []);

  const fetchHealthHistory = async (userId: string) => {
    try {
      console.log("Fetching health history for user:", userId);
      const response = await fetch(`http://localhost:5000/health-tracking/${userId}`);
      console.log("Health history response status:", response.status);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log("No health data found for user");
          setIsFirstTime(true);
          return;
        }
        throw new Error("Failed to fetch health history");
      }
      
      const data = await response.json();
      console.log("Received health data:", data);
      console.log("Progress data:", data.progress);
      
      setHealthData(data);
      setIsFirstTime(false);
    } catch (err) {
      console.error("Error fetching health history:", err);
      setError("Failed to load health history");
    }
  };

  const handleQuestionnaireSubmit = async (data: any) => {
    setLoading(true);
    setError("");
    
    try {
      const userId = localStorage.getItem("mindguard_user_id");
      console.log("Submitting questionnaire data:", { ...data, userId });
      
      const response = await fetch("http://localhost:5000/health-tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          userId,
          assessmentType: 'text'
        }),
      });

      console.log("Questionnaire submission response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Failed to submit questionnaire: ${response.status}`);
      }

      const result = await response.json();
      console.log("Received questionnaire response:", result);
      console.log("Progress data in response:", result.progress);
      
      setHealthData(result);
      setIsFirstTime(false);
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
            {isFirstTime 
              ? "Welcome! Please complete your first mental health assessment"
              : "Monitor your mental health progress and receive personalized insights"}
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
          <TabsTrigger value="insights" disabled={isFirstTime}>Insights</TabsTrigger>
          <TabsTrigger value="progress" disabled={isFirstTime}>Progress</TabsTrigger>
          <TabsTrigger value="recommendations" disabled={isFirstTime}>Recommendations</TabsTrigger>
        </TabsList>
        <TabsContent value="questionnaire">
          <Card>
            <CardHeader>
              <CardTitle>
                {isFirstTime ? "Initial Health Assessment" : "Daily Health Assessment"}
              </CardTitle>
              <CardDescription>
                {isFirstTime 
                  ? "Please complete this assessment to help us understand your mental health needs"
                  : "Choose your preferred way to complete the assessment"}
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
                {!isFirstTime && (
                  <Button
                    variant={assessmentType === "report" ? "default" : "outline"}
                    onClick={() => setAssessmentType("report")}
                  >
                    Report Submission
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {assessmentType === "text" ? (
                <HealthQuestionnaire 
                  onSubmit={handleQuestionnaireSubmit}
                  isLoading={loading}
                />
              ) : assessmentType === "voice" ? (
                <VoiceQuestionnaire/>
              ) : (
                <ReportSubmission />
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