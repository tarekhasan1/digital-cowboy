'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VisitorTracker from '@/components/VisitorTracker';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin') ?? false;
  const isLoginRoute = pathname === '/login';

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && !isLoginRoute && <VisitorTracker />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
}
