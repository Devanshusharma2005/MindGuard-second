"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { AlertTriangle, Brain, Heart, Sparkles, TrendingDown, TrendingUp } from "lucide-react";

interface InsightData {
  mainInsight: string;
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
}

interface HealthInsightsProps {
  insights?: InsightData;
}

export function HealthInsights({ insights }: HealthInsightsProps) {
  if (!insights) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Complete the questionnaire to see your health insights.
      </div>
    );
  }

  const riskData = [
    { name: "Low", value: insights.riskAnalysis.low, color: "hsl(var(--chart-2))" },
    { name: "Moderate", value: insights.riskAnalysis.moderate, color: "hsl(var(--chart-4))" },
    { name: "High", value: insights.riskAnalysis.high, color: "hsl(var(--chart-1))" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-2">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="font-medium">AI-Generated Insight</p>
            <p className="text-sm text-muted-foreground">
              {insights.mainInsight}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Risk Analysis</p>
                <p className="text-xs text-muted-foreground">
                  Current mental health risk factors
                </p>
              </div>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="h-[200px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle" 
                    iconSize={8}
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Anxiety Levels</p>
              </div>
              <div className="flex items-center gap-1">
                {insights.anxietyTrend.status === "decreasing" ? (
                  <>
                    <TrendingDown className="h-4 w-4 text-green-500" />
                    <span className="text-xs font-medium text-green-500">Decreasing</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4 text-amber-500" />
                    <span className="text-xs font-medium text-amber-500">Increasing</span>
                  </>
                )}
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {insights.anxietyTrend.detail}
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Stress Response</p>
              </div>
              <div className="flex items-center gap-1">
                {insights.stressResponse.status === "improving" ? (
                  <>
                    <TrendingDown className="h-4 w-4 text-green-500" />
                    <span className="text-xs font-medium text-green-500">Improving</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4 text-amber-500" />
                    <span className="text-xs font-medium text-amber-500">Worsening</span>
                  </>
                )}
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {insights.stressResponse.detail}
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Mood Stability</p>
              </div>
              <div className="flex items-center gap-1">
                {insights.moodStability.status === "stable" ? (
                  <>
                    <TrendingDown className="h-4 w-4 text-green-500" />
                    <span className="text-xs font-medium text-green-500">Stable</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4 text-amber-500" />
                    <span className="text-xs font-medium text-amber-500">Fluctuating</span>
                  </>
                )}
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {insights.moodStability.detail}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <p className="mb-3 font-medium">Key Patterns Identified</p>
        <div className="flex flex-wrap gap-2">
          {insights.patterns.map((pattern, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {pattern}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}