'use client';

import { useState, useEffect } from 'react';
import { Doughnut } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const engagementData = [
  { name: 'Daily Active', value: 68, color: 'hsl(var(--chart-1))' },
  { name: 'Weekly Active', value: 22, color: 'hsl(var(--chart-2))' },
  { name: 'Monthly Active', value: 10, color: 'hsl(var(--chart-3))' },
];

export function EngagementMetrics() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Daily Active Users</span>
            <span className="text-sm font-medium">68%</span>
          </div>
          <Progress value={68} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Weekly Active Users</span>
            <span className="text-sm font-medium">22%</span>
          </div>
          <Progress value={22} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Monthly Active Users</span>
            <span className="text-sm font-medium">10%</span>
          </div>
          <Progress value={10} className="h-2" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <span className="text-sm font-medium">Retention Rate</span>
          <div className="flex items-center">
            <span className="text-2xl font-bold">78%</span>
            <span className="ml-2 text-xs text-green-500">+5%</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <span className="text-sm font-medium">Avg. Session</span>
          <div className="flex items-center">
            <span className="text-2xl font-bold">12m</span>
            <span className="ml-2 text-xs text-green-500">+2m</span>
          </div>
        </div>
      </div>
    </div>
  );
}