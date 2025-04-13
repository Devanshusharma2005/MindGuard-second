"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface HealthReport {
  timestamp: string;
  mood: number;
  anxiety: number;
  energy_levels: number;
}

interface MoodData {
  chartData: Array<{
    date: string;
    anxiety: number;
    depression: number;
    stress: number;
  }>;
  insightText: string;
}

export function MoodTracker() {
  const [loading, setLoading] = useState(true);
  const [moodData, setMoodData] = useState<MoodData>({
    chartData: [],
    insightText: ""
  });

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const userId = localStorage.getItem('mindguard_user_id');
        if (!userId) {
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5000/api/health-tracking/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch mood data');
        }

        const data = await response.json();
        
        if (data && data.healthreports && data.healthreports.length > 0) {
          // Format data for chart - most recent 7 entries
          const recentReports = data.healthreports.slice(0, Math.min(7, data.healthreports.length));
          
          // Reverse the array to get oldest reports first (for left-to-right chronological order)
          const orderedReports = [...recentReports].reverse();
          
          // Use session number instead of date for x-axis
          const formattedData = orderedReports.map((report: HealthReport, index: number) => {
            // Calculate session number (oldest is #1, newest is higher number)
            const sessionNumber = index + 1;
            
            return {
              date: `Session ${sessionNumber}`,
              anxiety: report.anxiety || 0,
              depression: (10 - report.mood) * 10 || 0, // Invert mood to estimate depression level
              stress: (10 - report.energy_levels) * 10 || 0 // Invert energy to estimate stress
            };
          });

          // Get insight text from API data if available
          let insightText = "";
          if (data.insights && data.insights.anxietyTrend) {
            insightText = data.insights.anxietyTrend.detail;
          } else {
            // Generate default insight based on trends
            // Compare first and last assessment instead of dates
            const firstEntry = formattedData[0]; // oldest session
            const lastEntry = formattedData[formattedData.length - 1]; // newest session
            
            const firstAnxiety = firstEntry?.anxiety || 0;
            const lastAnxiety = lastEntry?.anxiety || 0;
            
            if (firstAnxiety === 0) {
              insightText = "Track your progress by completing more assessments";
            } else {
              const anxietyChange = Math.round(((lastAnxiety - firstAnxiety) / firstAnxiety) * 100);
              
              if (anxietyChange < 0) {
                insightText = `Your anxiety levels have decreased by ${Math.abs(anxietyChange)}% since your first assessment`;
              } else if (anxietyChange > 0) {
                insightText = `Your anxiety levels have increased by ${anxietyChange}% since your first assessment`;
              } else {
                insightText = "Your anxiety levels have remained stable across assessments";
              }
            }
          }

          setMoodData({
            chartData: formattedData,
            insightText
          });
        }
      } catch (error) {
        console.error('Error fetching mood data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, []);

  if (loading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Mood Trends</CardTitle>
          <CardDescription>Track your emotional patterns over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[180px]">
            <p className="text-muted-foreground">Loading mood data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Mood Trends</CardTitle>
        <CardDescription>Track your emotional patterns over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={moodData.chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
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
            {moodData.insightText}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}