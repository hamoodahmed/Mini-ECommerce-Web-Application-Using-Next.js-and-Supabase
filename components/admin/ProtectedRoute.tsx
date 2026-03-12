'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import LoadingSpinner from '../LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = true }: ProtectedRouteProps) {
  const router = useRouter();
  const { loading, user, isAdmin } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // User is not logged in, redirect to login
        router.push('/admin/login');
      } else if (requireAdmin && !isAdmin) {
        // User is logged in but not an admin, redirect to home
        router.push('/');
      }
    }
  }, [user, loading, isAdmin, requireAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // If user is not an admin and we require admin access, don't render anything while redirect happens
  if (requireAdmin && !isAdmin) {
    return null;
  }

  // If user is not logged in, don't render anything while redirect happens
  if (!user) {
    return null;
  }

  return <>{children}</>;
}