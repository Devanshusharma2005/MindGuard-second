'use client';

import { useState, useEffect } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { apiUrl } from '@/lib/config';
import { format, subWeeks, eachWeekOfInterval } from 'date-fns';

// Mock data as fallback
const mockData = [
  {
    name: 'Jan',
    users: 2400,
    therapists: 240,
    interactions: 24000,
  },
  {
    name: 'Feb',
    users: 3000,
    therapists: 270,
    interactions: 28000,
  },
  {
    name: 'Mar',
    users: 4500,
    therapists: 290,
    interactions: 35000,
  },
  {
    name: 'Apr',
    users: 5200,
    therapists: 305,
    interactions: 40000,
  },
  {
    name: 'May',
    users: 6800,
    therapists: 310,
    interactions: 48000,
  },
  {
    name: 'Jun',
    users: 8200,
    therapists: 315,
    interactions: 56000,
  },
  {
    name: 'Jul',
    users: 9600,
    therapists: 320,
    interactions: 65000,
  },
  {
    name: 'Aug',
    users: 10800,
    therapists: 322,
    interactions: 72000,
  },
  {
    name: 'Sep',
    users: 11500,
    therapists: 324,
    interactions: 78000,
  },
];

export function Overview() {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    fetchRecentUserActivity();
  }, []);

  const fetchRecentUserActivity = async () => {
    setLoading(true);
    try {
      // Create an array of the last 4 weeks (starting dates)
      const today = new Date();
      const fourWeeksAgo = subWeeks(today, 4);
      
      // Get weekly intervals
      const weekIntervals = eachWeekOfInterval({
        start: fourWeeksAgo,
        end: today
      });
      
      // Format for API request
      const startDate = format(fourWeeksAgo, 'yyyy-MM-dd');
      const endDate = format(today, 'yyyy-MM-dd');
      
      // Fetch user registrations from API - Using the correct path: /api/user/registrations
      const response = await fetch(`${apiUrl}/api/user/registrations?startDate=${startDate}&endDate=${endDate}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user activity data');
      }
      
      const data = await response.json();
      
      // Process the data into weekly format
      const processedData = weekIntervals.map((weekStart, index) => {
        const weekEnd = index < weekIntervals.length - 1 
          ? weekIntervals[index + 1] 
          : today;
        
        const weekLabel = format(weekStart, 'MMM d');
        
        // Filter user registrations for this week
        const weekUsers = data.registrations?.filter((reg: any) => {
          const regDate = new Date(reg.registrationDate);
          return regDate >= weekStart && regDate < weekEnd;
        }) || [];
        
        return {
          name: weekLabel,
          users: weekUsers.length,
          // Include other metrics as available or leave as 0
          therapists: data.therapists?.[index] || 0,
          interactions: data.interactions?.[index] || 0
        };
      });
      
      setUserData(processedData.length > 0 ? processedData : mockData);
      
    } catch (err) {
      console.error('Error fetching user activity:', err);
      setError('Failed to load user activity data');
      setUserData(mockData); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[350px]">
        <div className="animate-pulse text-muted-foreground">Loading user activity data...</div>
      </div>
    );
  }

  if (error) {
    console.error('Error in user activity data:', error);
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={userData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Bar
          dataKey="users"
          fill="hsl(var(--chart-1))"
          radius={[4, 4, 0, 0]}
          name="New Users"
        />
        <Bar
          dataKey="therapists"
          fill="hsl(var(--chart-2))"
          radius={[4, 4, 0, 0]}
          name="New Therapists"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}