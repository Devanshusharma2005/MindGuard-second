'use client';

import { useState, useEffect } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  {
    date: 'Jan',
    happy: 65,
    neutral: 25,
    sad: 10,
  },
  {
    date: 'Feb',
    happy: 60,
    neutral: 28,
    sad: 12,
  },
  {
    date: 'Mar',
    happy: 58,
    neutral: 30,
    sad: 12,
  },
  {
    date: 'Apr',
    happy: 62,
    neutral: 28,
    sad: 10,
  },
  {
    date: 'May',
    happy: 68,
    neutral: 24,
    sad: 8,
  },
  {
    date: 'Jun',
    happy: 72,
    neutral: 22,
    sad: 6,
  },
  {
    date: 'Jul',
    happy: 70,
    neutral: 23,
    sad: 7,
  },
  {
    date: 'Aug',
    happy: 74,
    neutral: 20,
    sad: 6,
  },
  {
    date: 'Sep',
    happy: 76,
    neutral: 19,
    sad: 5,
  },
];

export function MoodTrends() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis
          dataKey="date"
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
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="happy"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          dot={{ r: 4 }}
          name="Happy"
        />
        <Line
          type="monotone"
          dataKey="neutral"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2}
          dot={{ r: 4 }}
          name="Neutral"
        />
        <Line
          type="monotone"
          dataKey="sad"
          stroke="hsl(var(--chart-3))"
          strokeWidth={2}
          dot={{ r: 4 }}
          name="Sad"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}