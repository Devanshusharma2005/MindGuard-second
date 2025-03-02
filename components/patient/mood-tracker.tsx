"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { date: "6/1", anxiety: 70, depression: 65, stress: 60 },
  { date: "6/5", anxiety: 65, depression: 60, stress: 55 },
  { date: "6/10", anxiety: 60, depression: 55, stress: 50 },
  { date: "6/15", anxiety: 55, depression: 50, stress: 45 },
  { date: "6/20", anxiety: 50, depression: 45, stress: 40 },
  { date: "6/25", anxiety: 45, depression: 40, stress: 35 },
  { date: "6/30", anxiety: 40, depression: 35, stress: 30 },
];

export function MoodTracker() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Mood Trends</CardTitle>
        <CardDescription>Track your emotional patterns over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 100]} />
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
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle" 
                iconSize={8}
                wrapperStyle={{ fontSize: "12px" }}
              />
              <Line 
                type="monotone" 
                dataKey="anxiety" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2} 
                dot={{ r: 3 }} 
                activeDot={{ r: 5 }} 
              />
              <Line 
                type="monotone" 
                dataKey="depression" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2} 
                dot={{ r: 3 }} 
                activeDot={{ r: 5 }} 
              />
              <Line 
                type="monotone" 
                dataKey="stress" 
                stroke="hsl(var(--chart-3))" 
                strokeWidth={2} 
                dot={{ r: 3 }} 
                activeDot={{ r: 5 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-center">
          <p className="text-sm text-muted-foreground">
            Your anxiety levels have decreased by 30% in the last month
          </p>
        </div>
      </CardContent>
    </Card>
  );
}