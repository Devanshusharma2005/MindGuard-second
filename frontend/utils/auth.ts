import { useRouter } from 'next/navigation';

export const handleLogout = async (router: any) => {
  try {
    // Clear all auth related data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('doctor');
    localStorage.removeItem('admin');
    
    // Use setTimeout to ensure state updates are completed before navigation
    setTimeout(() => {
      router.push('/');
    }, 0);
  } catch (error) {
    console.error('Logout error:', error);
    // Fallback navigation
    window.location.href = '/';
  }
}; 