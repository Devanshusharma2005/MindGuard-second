'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardOverview } from "@/components/patient/dashboard-overview";
import { UpcomingAppointments } from "@/components/patient/upcoming-appointments";
import { MoodTracker } from "@/components/patient/mood-tracker";
import { WellnessScore } from "@/components/patient/wellness-score";
import { RecommendedActivities } from "@/components/patient/recommended-activities";
import { CommunityHighlights } from "@/components/patient/community-highlights";

interface UserData {
  username: string;
  email: string;
}

export default function PatientDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (!storedData) {
      router.push('/login');
      return;
    }

    try {
      const data = JSON.parse(storedData);
      setUserData(data);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    
    // Redirect to login page
    router.push('/');
  };

  if (!userData) return null;

  return (
    <div className="space-y-8">

      {/* Rest of your dashboard content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardOverview />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <WellnessScore />
          <MoodTracker />
          <UpcomingAppointments />
        </div>
        
      </div>
    </div>
  );
}