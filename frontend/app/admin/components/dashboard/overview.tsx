'use client';

import { useState, useEffect } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const data = [
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
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
          name="Users"
        />
        <Bar
          dataKey="therapists"
          fill="hsl(var(--chart-2))"
          radius={[4, 4, 0, 0]}
          name="Therapists"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}