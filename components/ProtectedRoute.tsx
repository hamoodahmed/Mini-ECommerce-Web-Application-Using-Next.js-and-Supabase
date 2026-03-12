'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

const ProtectedRoute = ({
  children,
  allowedRoles = ['ADMIN', 'CUSTOMER'],
  redirectTo = '/admin/login'
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If user is not logged in
      if (!user) {
        router.push(redirectTo);
        return;
      }

      // If user doesn't have the required role
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [user, loading, allowedRoles, redirectTo, router]);

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  // If user is authenticated and has required role, render children
  if (user && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  // Otherwise, return null while redirect happens
  return null;
};

export default ProtectedRoute;