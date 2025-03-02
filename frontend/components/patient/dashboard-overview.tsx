"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MessageSquare, Sparkles } from "lucide-react";

export function DashboardOverview() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Jessica</h1>
          <p className="text-muted-foreground">
            Here's an overview of your mental health journey
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            Book Consultation
          </Button>
          <Button className="gap-2">
            <Sparkles className="h-4 w-4" />
            Daily Check-in
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Your Wellness Journey</CardTitle>
          <CardDescription>
            You've been making steady progress over the past 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Mood Stability</p>
                <Badge variant="outline">Improving</Badge>
              </div>
              <Progress value={68} className="h-2" />
              <p className="text-xs text-muted-foreground">
                68% improvement from last month
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Anxiety Level</p>
                <Badge variant="outline">Decreasing</Badge>
              </div>
              <Progress value={42} className="h-2" />
              <p className="text-xs text-muted-foreground">
                42% reduction in anxiety symptoms
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Sleep Quality</p>
                <Badge variant="outline">Stable</Badge>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground">
                75% of optimal sleep achieved
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Wellness Streak</p>
                <Badge variant="outline">12 Days</Badge>
              </div>
              <Progress value={40} className="h-2" />
              <p className="text-xs text-muted-foreground">
                12 days of consecutive check-ins
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 md:flex-row">
            <Card className="flex-1">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">AI Insight</CardTitle>
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your anxiety patterns show improvement after morning meditation. Consider adding 5 more minutes to your routine.
                </p>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">Dr. Sarah Johnson</p>
                <p className="text-sm text-muted-foreground">Tomorrow at 2:00 PM</p>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Community</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  3 new responses to your post in "Anxiety Management" group
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}