"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { AlertTriangle, Brain, Heart, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import localData from '../../../backend/data.json';

interface InsightData {
  mainInsight: Record<string, number>;
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
  risk_factors?: string[];
}

interface HealthInsightsProps {
  insights?: InsightData;
}

export function HealthInsights({ insights: propsInsights }: HealthInsightsProps) {
  const [localInsights, setLocalInsights] = useState<InsightData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processLocalData = () => {
      try {
        if (localData && localData.length > 0) {
          const latestEntry = localData[localData.length - 1];
          
          // Process the data into the required format
          const processedInsights: InsightData = {
            mainInsight: Object.fromEntries(
              Object.entries(latestEntry.output.summary.emotions_count)
                .filter(([_, value]) => value !== undefined)
            ),
            riskAnalysis: {
              low: latestEntry.output.disorder_indicators.filter(i => i.toLowerCase().includes('mild')).length,
              moderate: latestEntry.output.disorder_indicators.filter(i => i.toLowerCase().includes('moderate')).length,
              high: latestEntry.output.disorder_indicators.filter(i => i.toLowerCase().includes('severe')).length
            },
            anxietyTrend: {
              status: latestEntry.input.anxiety === 'moderate' || latestEntry.input.anxiety === 'severe' ? 'increasing' : 'stable',
              percentage: latestEntry.output.summary.average_confidence * 100,
              detail: `Based on your responses, your anxiety level appears to be ${latestEntry.input.anxiety}`
            },
            stressResponse: {
              status: latestEntry.input.self_care === 'moderate' || latestEntry.input.self_care === 'extensive' ? 'improving' : 'worsening',
              percentage: Math.round((latestEntry.output.summary.average_valence || latestEntry.input.mood / 10) * 100),
              detail: `Your stress management through ${latestEntry.input.self_care} self-care activities shows ${latestEntry.input.self_care === 'moderate' || latestEntry.input.self_care === 'extensive' ? 'improvement' : 'room for improvement'}`
            },
            moodStability: {
              status: latestEntry.input.mood >= 5 ? 'stable' : 'fluctuating',
              detail: `Your mood rating of ${latestEntry.input.mood}/10 indicates ${latestEntry.input.mood >= 5 ? 'stable mood' : 'mood fluctuations'}`
            },
            patterns: latestEntry.output.disorder_indicators || [],
            risk_factors: latestEntry.output.summary.risk_factors
          };

          setLocalInsights(processedInsights);
        }
      } catch (error) {
        console.error('Error processing local data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    processLocalData();
  }, []);

  // Use either props insights or local insights
  const insights = propsInsights || localInsights;

  if (isLoading) {
    return (
      <div className="text-center text-muted-foreground">
        Loading insights...
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="text-center text-muted-foreground">
        Complete the questionnaire to view your insights
      </div>
    );
  }

  const getEmotionSummary = (emotions: { [key: string]: number }) => {
    const sortedEmotions = Object.entries(emotions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
    
    return sortedEmotions.map(([emotion, count]) => 
      `${emotion} (${count} instances)`
    ).join(", ");
  };

  const riskData = [
    { name: "Low", value: insights.riskAnalysis.low, color: "hsl(var(--chart-2))" },
    { name: "Moderate", value: insights.riskAnalysis.moderate, color: "hsl(var(--chart-4))" },
    { name: "High", value: insights.riskAnalysis.high, color: "hsl(var(--chart-1))" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Emotional Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {getEmotionSummary(insights.mainInsight)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Low Risk:</span>
                <Badge variant="outline" className="bg-green-50">
                  {insights.riskAnalysis.low}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Moderate Risk:</span>
                <Badge variant="outline" className="bg-yellow-50">
                  {insights.riskAnalysis.moderate}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>High Risk:</span>
                <Badge variant="outline" className="bg-red-50">
                  {insights.riskAnalysis.high}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Anxiety Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Status:</span>
                <Badge 
                  variant={insights.anxietyTrend.status === "increasing" ? "destructive" : "outline"}
                  className="flex items-center gap-1"
                >
                  {insights.anxietyTrend.status === "increasing" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {insights.anxietyTrend.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Change:</span>
                <span>{insights.anxietyTrend.percentage}%</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {insights.anxietyTrend.detail}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Stress Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Status:</span>
                <Badge 
                  variant={insights.stressResponse.status === "improving" ? "outline" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {insights.stressResponse.status === "improving" ? (
                    <TrendingDown className="h-3 w-3" />
                  ) : (
                    <TrendingUp className="h-3 w-3" />
                  )}
                  {insights.stressResponse.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Change:</span>
                <span>{insights.stressResponse.percentage}%</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {insights.stressResponse.detail}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Mood Stability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Status:</span>
                <Badge 
                  variant={insights.moodStability.status === "stable" ? "outline" : "secondary"}
                >
                  {insights.moodStability.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {insights.moodStability.detail}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Risk Factors & Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.risk_factors && insights.risk_factors.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Risk Factors</h4>
                <ul className="list-disc pl-4 space-y-1">
                  {insights.risk_factors.map((factor, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {insights.patterns && insights.patterns.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Identified Patterns</h4>
                <ul className="list-disc pl-4 space-y-1">
                  {insights.patterns.map((pattern, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {pattern}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}