'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, Mail } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isEmailVARoute = pathname?.startsWith('/admin/email-va') ?? false;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin">
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              </Link>
              <nav className="hidden md:flex items-center gap-4">
                <Link href="/admin">
                  <Button
                    variant={pathname === '/admin' ? 'default' : 'ghost'}
                    size="sm"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                {isEmailVARoute && (
                  <>
                    <Link href="/admin/email-va">
                      <Button
                        variant={pathname === '/admin/email-va' ? 'default' : 'ghost'}
                        size="sm"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Email VA
                      </Button>
                    </Link>
                  </>
                )}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  Back to Website
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
