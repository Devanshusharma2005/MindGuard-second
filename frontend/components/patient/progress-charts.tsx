"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ProgressData {
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
    sleep: { durationChange: number; qualityChange: number };
    activities: {
      exerciseChange: number;
      meditationChange: number;
      socialChange: number;
    };
  };
}

interface ProgressChartsProps {
  progressData?: ProgressData;
}

export function ProgressCharts({ progressData }: ProgressChartsProps) {
  if (!progressData) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Complete the questionnaire to see your progress charts.
      </div>
    );
  }

  const { moodData, sleepData, activityData, summary } = progressData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Tracking Period</p>
        <Select defaultValue="8weeks">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4weeks">Last 4 Weeks</SelectItem>
            <SelectItem value="8weeks">Last 8 Weeks</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="mood">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mood">Mood & Emotions</TabsTrigger>
          <TabsTrigger value="sleep">Sleep Patterns</TabsTrigger>
          <TabsTrigger value="activities">Wellness Activities</TabsTrigger>
        </TabsList>
        <TabsContent value="mood">
          <Card>
            <CardContent className="pt-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)",
                        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
                      }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                      labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="mood" 
                      name="Mood (higher is better)"
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2} 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="anxiety" 
                      name="Anxiety (lower is better)"
                      stroke="hsl(var(--chart-1))" 
                      strokeWidth={2} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="stress" 
                      name="Stress (lower is better)"
                      stroke="hsl(var(--chart-3))" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-4 text-sm text-muted-foreground text-center">
                Your mood has improved by {summary.mood.change}% while anxiety and stress have decreased by {summary.anxiety.change}% and {summary.stress.change}% respectively.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sleep">
          <Card>
            <CardContent className="pt-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sleepData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="sleepHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="sleepQuality" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-5))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" domain={[0, 10]} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)",
                        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
                      }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                      labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="hours" 
                      name="Sleep Hours"
                      yAxisId="left"
                      stroke="hsl(var(--chart-4))" 
                      fillOpacity={1} 
                      fill="url(#sleepHours)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="quality" 
                      name="Sleep Quality (1-10)"
                      yAxisId="right"
                      stroke="hsl(var(--chart-5))" 
                      fillOpacity={1} 
                      fill="url(#sleepQuality)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-4 text-sm text-muted-foreground text-center">
                Your sleep duration has increased by {summary.sleep.durationChange}% and sleep quality has improved by {summary.sleep.qualityChange}%.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activities">
          <Card>
            <CardContent className="pt-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 7]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)",
                        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
                      }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                      labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="exercise" 
                      name="Exercise (days/week)" 
                      fill="hsl(var(--chart-1))" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="meditation" 
                      name="Meditation (days/week)" 
                      fill="hsl(var(--chart-2))" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="social" 
                      name="Social Activities (times/week)" 
                      fill="hsl(var(--chart-3))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-4 text-sm text-muted-foreground text-center">
                Your weekly exercise has increased by {summary.activities.exerciseChange}%, meditation by {summary.activities.meditationChange}%, and social activities by {summary.activities.socialChange}%.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}