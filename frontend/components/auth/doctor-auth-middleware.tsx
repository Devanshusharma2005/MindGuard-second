'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function DoctorAuthMiddleware({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in and is a doctor
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (!token || userType !== 'doctor') {
      // Redirect to doctor login page if not authenticated
      router.push('/doctor-login');
    }
  }, [router]);

  return <>{children}</>;
} 