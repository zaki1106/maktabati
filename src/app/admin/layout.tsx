"use client";

import React, { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdminAuthenticated } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait for authentication status to be determined from localStorage
    if (typeof isAdminAuthenticated === 'boolean') {
      if (!isAdminAuthenticated && pathname !== '/admin/login') {
        router.replace('/admin/login');
      } else if (isAdminAuthenticated && pathname === '/admin/login') {
        router.replace('/admin/dashboard');
      }
    }
  }, [isAdminAuthenticated, pathname, router]);

  // Render a loading state or null while checking auth
  if (typeof isAdminAuthenticated !== 'boolean') {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div>يتم التحميل...</div>
        </div>
    );
  }

  // If not authenticated and not on login page, render nothing to prevent flash of content
  if (!isAdminAuthenticated && pathname !== '/admin/login') {
    return null;
  }

  return (
    <div className="w-full">
      {children}
    </div>
  );
}
