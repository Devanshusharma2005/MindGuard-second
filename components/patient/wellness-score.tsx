"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", score: 65 },
  { day: "Tue", score: 59 },
  { day: "Wed", score: 80 },
  { day: "Thu", score: 81 },
  { day: "Fri", score: 76 },
  { day: "Sat", score: 85 },
  { day: "Sun", score: 87 },
];

export function WellnessScore() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Wellness Score</CardTitle>
        <CardDescription>Your overall mental health score</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-4xl font-bold">87</p>
            <p className="text-xs text-muted-foreground">+8 from last week</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Weekly Average</p>
            <p className="text-2xl font-semibold">76</p>
          </div>
        </div>
        <div className="h-[180px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="wellnessGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 100]} />
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
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
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="hsl(var(--chart-1))" 
                fillOpacity={1} 
                fill="url(#wellnessGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}