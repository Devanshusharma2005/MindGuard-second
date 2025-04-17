'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Brain, MessageSquare, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from '@/components/ui/use-toast';
import useAdminWebSocket from '@/hooks/useAdminWebSocket';

interface DashboardStats {
  totalUsers: number;
  totalTherapists: number;
  totalSessions: number;
  crisisAlerts: number;
  usersTrend?: number;
  therapistsTrend?: number;
  sessionsTrend?: number;
  alertsTrend?: number;
}

export function DashboardCardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Get token from localStorage or sessionStorage
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Get the token from storage
    const storedToken = localStorage.getItem('token') || 
                        localStorage.getItem('mindguard_token') || 
                        sessionStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Handle stats updates from WebSocket
  const handleStatsUpdate = useCallback((updatedStats: DashboardStats) => {
    console.log('Received stats update:', updatedStats);
    if (updatedStats) {
      setStats(updatedStats);
      setLoading(false);
    }
  }, []);

  // Handle WebSocket connection changes
  const handleConnectionChange = useCallback((isConnected: boolean) => {
    if (isConnected) {
      toast({
        title: "Real-time Updates",
        description: "Connected to dashboard stats updates",
        variant: "default"
      });
    }
  }, [toast]);

  // Handle WebSocket errors
  const handleError = useCallback((error: string) => {
    console.error("WebSocket error:", error);
    toast({ 
      variant: "destructive", 
      title: "Connection Error", 
      description: "Using offline mode for dashboard data" 
    });
  }, [toast]);

  // Initialize WebSocket connection
  const {
    isConnected,
    fetchDashboardStats
  } = useAdminWebSocket({
    token: token || undefined,
    userType: 'admin',
    onStatsUpdate: handleStatsUpdate,
    onConnectionChange: handleConnectionChange,
    onError: handleError
  });

  // Fetch stats data on initial load
  useEffect(() => {
    const loadData = async () => {
      try {
        if (!isConnected) {
          // If WebSocket is not connected, use HTTP fallback
          const fetchedStats = await fetchDashboardStats();
          if (!fetchedStats) {
            // If no stats returned, use default values
            setStats({
              totalUsers: 0,
              totalTherapists: 0,
              totalSessions: 0,
              crisisAlerts: 0,
              usersTrend: 0,
              therapistsTrend: 0,
              sessionsTrend: 0,
              alertsTrend: 0
            });
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    
    // Set up a periodic refresh if WebSocket is not available
    const refreshInterval = !isConnected ? 
      setInterval(async () => {
        await fetchDashboardStats();
      }, 30000) : null;
    
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [isConnected, fetchDashboardStats]);

  // Manual refresh function
  const handleManualRefresh = async () => {
    setLoading(true);
    await fetchDashboardStats();
    setLoading(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(index => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-4 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const defaultStats: DashboardStats = {
    totalUsers: stats?.totalUsers || 0,
    totalTherapists: stats?.totalTherapists || 0,
    totalSessions: stats?.totalSessions || 0,
    crisisAlerts: stats?.crisisAlerts || 0,
    usersTrend: stats?.usersTrend || 4,
    therapistsTrend: stats?.therapistsTrend || 2,
    sessionsTrend: stats?.sessionsTrend || 24,
    alertsTrend: stats?.alertsTrend || -7
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{defaultStats.totalUsers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {defaultStats.usersTrend >= 0 ? '+' : ''}{defaultStats.usersTrend}% from last month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Therapists</CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{defaultStats.totalTherapists}</div>
          <p className="text-xs text-muted-foreground">
            {defaultStats.therapistsTrend >= 0 ? '+' : ''}{defaultStats.therapistsTrend}% from last month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{defaultStats.totalSessions.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {defaultStats.sessionsTrend >= 0 ? '+' : ''}{defaultStats.sessionsTrend}% from last month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Crisis Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{defaultStats.crisisAlerts}</div>
          <p className="text-xs text-muted-foreground">
            {defaultStats.alertsTrend}% from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}