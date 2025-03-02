'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LineChart, BarChart, DoughnutChart } from "@/app/admin/components/ui/charts"
import { Calendar, TrendingUp, Users, Clock, Activity } from "lucide-react"

// Mock data - Replace with actual API calls
const analyticsData = {
  overview: {
    totalUsers: 1250,
    activeTherapists: 48,
    totalSessions: 3240,
    averageRating: 4.8
  },
  sessionStats: [
    { month: 'Jan', sessions: 280 },
    { month: 'Feb', sessions: 310 },
    { month: 'Mar', sessions: 345 },
    { month: 'Apr', sessions: 380 },
    { month: 'May', sessions: 420 },
    { month: 'Jun', sessions: 450 }
  ],
  therapistSpecializations: [
    { specialization: 'Anxiety & Depression', count: 15 },
    { specialization: 'Trauma & PTSD', count: 10 },
    { specialization: 'Family Therapy', count: 8 },
    { specialization: 'Cognitive Behavioral Therapy', count: 12 },
    { specialization: 'Addiction Recovery', count: 7 }
  ],
  userGrowth: [
    { month: 'Jan', users: 850 },
    { month: 'Feb', users: 950 },
    { month: 'Mar', users: 1050 },
    { month: 'Apr', users: 1150 },
    { month: 'May', users: 1200 },
    { month: 'Jun', users: 1250 }
  ]
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("6M")

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Overview</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1M">Last Month</SelectItem>
            <SelectItem value="3M">Last 3 Months</SelectItem>
            <SelectItem value="6M">Last 6 Months</SelectItem>
            <SelectItem value="1Y">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Therapists</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.activeTherapists}</div>
            <p className="text-xs text-muted-foreground">
              +3 this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.averageRating}</div>
            <p className="text-xs text-muted-foreground">
              +0.2 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Session Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <LineChart
                data={analyticsData.sessionStats.map(item => ({
                  month: item.month,
                  value: item.sessions
                }))}
                label="Monthly Sessions"
                color="rgb(99, 102, 241)"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <BarChart
                data={analyticsData.userGrowth.map(item => ({
                  label: item.month,
                  value: item.users
                }))}
                title="Monthly Active Users"
                color="rgb(59, 130, 246)"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Therapist Specializations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <DoughnutChart
                data={analyticsData.therapistSpecializations.map(item => ({
                  label: item.specialization,
                  value: item.count
                }))}
                title="Specialization Distribution"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}