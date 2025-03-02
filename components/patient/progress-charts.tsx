"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const moodData = [
  { date: "Week 1", mood: 4, anxiety: 7, stress: 8 },
  { date: "Week 2", mood: 5, anxiety: 6, stress: 7 },
  { date: "Week 3", mood: 6, anxiety: 5, stress: 6 },
  { date: "Week 4", mood: 7, anxiety: 4, stress: 5 },
  { date: "Week 5", mood: 6, anxiety: 5, stress: 6 },
  { date: "Week 6", mood: 7, anxiety: 4, stress: 4 },
  { date: "Week 7", mood: 8, anxiety: 3, stress: 3 },
  { date: "Week 8", mood: 8, anxiety: 3, stress: 3 },
];

const sleepData = [
  { date: "Week 1", hours: 5.5, quality: 4 },
  { date: "Week 2", hours: 6.0, quality: 5 },
  { date: "Week 3", hours: 6.5, quality: 6 },
  { date: "Week 4", hours: 7.0, quality: 7 },
  { date: "Week 5", hours: 7.5, quality: 8 },
  { date: "Week 6", hours: 7.0, quality: 7 },
  { date: "Week 7", hours: 7.5, quality: 8 },
  { date: "Week 8", hours: 8.0, quality: 9 },
];

const activityData = [
  { date: "Week 1", exercise: 2, meditation: 1, social: 3 },
  { date: "Week 2", exercise: 3, meditation: 2, social: 2 },
  { date: "Week 3", exercise: 3, meditation: 3, social: 4 },
  { date: "Week 4", exercise: 4, meditation: 4, social: 3 },
  { date: "Week 5", exercise: 4, meditation: 5, social: 4 },
  { date: "Week 6", exercise: 5, meditation: 5, social: 5 },
  { date: "Week 7", exercise: 5, meditation: 6, social: 4 },
  { date: "Week 8", exercise: 6, meditation: 6, social: 5 },
];

export function ProgressCharts() {
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
                Your mood has improved by 100% while anxiety and stress have decreased by 57% and 62% respectively over the past 8 weeks.
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
                Your sleep duration has increased by 45% and sleep quality has improved by 125% over the past 8 weeks.
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
                Your weekly exercise has increased by 200%, meditation by 500%, and social activities by 67% over the past 8 weeks.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}