"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { AlertTriangle, Brain, Heart, Sparkles, TrendingDown, TrendingUp } from "lucide-react";

const riskData = [
  { name: "Low", value: 60, color: "hsl(var(--chart-2))" },
  { name: "Moderate", value: 30, color: "hsl(var(--chart-4))" },
  { name: "High", value: 10, color: "hsl(var(--chart-1))" },
];

export function HealthInsights() {
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
              Based on your recent responses, your anxiety symptoms appear to be triggered primarily by work-related stress. Your sleep patterns show improvement when you practice evening meditation. Consider establishing a consistent bedtime routine that includes 10 minutes of meditation.
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
                <TrendingDown className="h-4 w-4 text-green-500" />
                <span className="text-xs font-medium text-green-500">Decreasing</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Your anxiety levels have decreased by 15% over the past two weeks, likely due to your consistent meditation practice.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Stress Response</p>
              </div>
              <div className="flex items-center gap-1">
                <TrendingDown className="h-4 w-4 text-green-500" />
                <span className="text-xs font-medium text-green-500">Improving</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Your physiological response to stressors is showing improvement. Heart rate variability has increased by 8%.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Mood Stability</p>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-medium text-amber-500">Fluctuating</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Your mood shows some variability throughout the week, with lower points typically occurring on Mondays and Tuesdays.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <p className="mb-3 font-medium">Key Patterns Identified</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">Sleep quality affects anxiety</Badge>
          <Badge variant="secondary" className="text-xs">Exercise improves mood</Badge>
          <Badge variant="secondary" className="text-xs">Work stress triggers</Badge>
          <Badge variant="secondary" className="text-xs">Social interaction benefits</Badge>
          <Badge variant="secondary" className="text-xs">Evening routine importance</Badge>
        </div>
      </div>
    </div>
  );
}