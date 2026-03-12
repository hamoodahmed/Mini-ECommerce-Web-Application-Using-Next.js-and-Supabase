'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If user is not logged in
      if (!user) {
        router.push('/admin/login');
        return;
      }

      // If user doesn't have admin role
      if (user.role !== 'ADMIN') {
        router.push('/unauthorized');
        return;
      }
    }
  }, [user, loading, router]);

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  // If user is authenticated and is admin, render children
  if (user && user.role === 'ADMIN') {
    return <>{children}</>;
  }

  // Otherwise, return null while redirect happens
  return null;
};

export default AdminProtectedRoute;