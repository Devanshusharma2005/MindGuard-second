'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock } from 'lucide-react';
import { Overview } from '@/app/admin/components/dashboard/overview';
import { RecentUsers } from '@/app/admin/components/dashboard/recent-users';
import { RecentTherapists } from '@/app/admin/components/dashboard/recent-therapists';
import { CrisisAlerts } from '@/app/admin/components/dashboard/crisis-alerts';
import { EngagementMetrics } from '@/app/admin/components/dashboard/engagement-metrics';
import { MoodTrends } from '@/app/admin/components/dashboard/mood-trends';
import { SystemStatus } from '@/app/admin/components/dashboard/system-status';
import { UserManagement } from '@/app/admin/components/dashboard/user-management';
import { TherapistManagement } from '@/app/admin/components/dashboard/therapist-management';
import { DashboardCardStats } from '@/app/admin/components/dashboard/dashboard-stats';

export default function AdminDashboard() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="therapists">Therapists</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <DashboardCardStats />
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>User Activity Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Mood Trends</CardTitle>
                <CardDescription>
                  Aggregated user mood data over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MoodTrends />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>
                  New user registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentUsers />
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Therapists</CardTitle>
                <CardDescription>
                  Newly onboarded therapists
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentTherapists />
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Crisis Alerts</CardTitle>
                <CardDescription>
                  Recent high-risk interventions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CrisisAlerts />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>
                  User engagement and retention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EngagementMetrics />
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>
                  Platform health and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SystemStatus />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                View and manage all platform users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <UserManagement />
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="therapists" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Therapist Management</CardTitle>
              <CardDescription>
                View and manage all platform therapists
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <TherapistManagement />
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
              <CardDescription>
                Detailed analytics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Navigate to the Analytics section for detailed platform metrics.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}