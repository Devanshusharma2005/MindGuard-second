"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

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
}

interface ProgressChartsProps {
  progressData?: ProgressData;
}

export function ProgressCharts({ progressData }: ProgressChartsProps) {
  if (!progressData) {
    return (
      <div className="text-center text-muted-foreground">
        Complete the questionnaire to view your progress
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const formatChange = (value: number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return numValue > 0 ? `+${numValue}%` : `${numValue}%`;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mood & Anxiety Trends</CardTitle>
            <CardDescription>
              Track your emotional well-being over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData.moodData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    type="category"
                    interval="preserveStartEnd"
                  />
                  <YAxis domain={[0, 10]} />
                  <Tooltip
                    labelFormatter={(label) => formatDate(label as string)}
                    formatter={(value: number) => [value.toFixed(1), ""]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="hsl(var(--primary))"
                    name="Mood"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="anxiety"
                    stroke="hsl(var(--destructive))"
                    name="Anxiety"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="stress"
                    stroke="hsl(var(--warning))"
                    name="Stress"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Mood Change</div>
                <div className={progressData.summary.mood.change >= 0 ? "text-green-600" : "text-red-600"}>
                  {formatChange(progressData.summary.mood.change)}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Anxiety Change</div>
                <div className={progressData.summary.anxiety.change <= 0 ? "text-green-600" : "text-red-600"}>
                  {formatChange(progressData.summary.anxiety.change)}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Stress Change</div>
                <div className={progressData.summary.stress.change <= 0 ? "text-green-600" : "text-red-600"}>
                  {formatChange(progressData.summary.stress.change)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sleep Patterns</CardTitle>
            <CardDescription>
              Monitor your sleep quality and duration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData.sleepData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    type="category"
                    interval="preserveStartEnd"
                  />
                  <YAxis domain={[0, 10]} />
                  <Tooltip
                    labelFormatter={(label) => formatDate(label as string)}
                    formatter={(value: number) => [value.toFixed(1), ""]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="hsl(var(--primary))"
                    name="Hours"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="quality"
                    stroke="hsl(var(--secondary))"
                    name="Quality"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Duration Change</div>
                <div className={progressData.summary.sleep.durationChange >= 0 ? "text-green-600" : "text-red-600"}>
                  {formatChange(progressData.summary.sleep.durationChange)}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Quality Change</div>
                <div className={progressData.summary.sleep.qualityChange >= 0 ? "text-green-600" : "text-red-600"}>
                  {formatChange(progressData.summary.sleep.qualityChange)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Tracking</CardTitle>
          <CardDescription>
            Monitor your engagement in various activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData.activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  type="category"
                  interval="preserveStartEnd"
                />
                <YAxis domain={[0, 10]} />
                <Tooltip
                  labelFormatter={(label) => formatDate(label as string)}
                  formatter={(value: number) => [value.toFixed(1), ""]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="exercise"
                  stroke="hsl(var(--primary))"
                  name="Exercise"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="meditation"
                  stroke="hsl(var(--secondary))"
                  name="Meditation"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="social"
                  stroke="hsl(var(--accent))"
                  name="Social"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Exercise Change</div>
              <div className={progressData.summary.activities.exerciseChange >= 0 ? "text-green-600" : "text-red-600"}>
                {formatChange(progressData.summary.activities.exerciseChange)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Meditation Change</div>
              <div className={progressData.summary.activities.meditationChange >= 0 ? "text-green-600" : "text-red-600"}>
                {formatChange(progressData.summary.activities.meditationChange)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Social Change</div>
              <div className={progressData.summary.activities.socialChange >= 0 ? "text-green-600" : "text-red-600"}>
                {formatChange(progressData.summary.activities.socialChange)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}