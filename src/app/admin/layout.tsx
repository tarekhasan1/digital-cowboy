/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, Mail, LogOut, User, Shield, BarChart3, FileText, MessageSquare, Zap, Settings, ChevronDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Auth Context Types
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Auth Provider
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    // Capture current pathname to avoid race conditions
    const currentPath = pathname;
    
    try {
      const response = await fetch('/api/auth/me');
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
        // Only redirect if not already on login page
        if (currentPath !== '/login') {
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      if (currentPath !== '/login') {
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Main Layout
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminContent>{children}</AdminContent>
    </AuthProvider>
  );
}

// Admin Content
function AdminContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const isEmailVARoute = pathname?.startsWith('/admin/email-va') ?? false;

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white/5 border-b border-white/10 sticky top-0 z-50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Skeleton className="h-6 w-32 bg-white/10" />
                <nav className="hidden md:flex items-center gap-4">
                  <Skeleton className="h-9 w-24 bg-white/10" />
                  {isEmailVARoute && <Skeleton className="h-9 w-24 bg-white/10" />}
                </nav>
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-9 w-24 bg-white/10" />
                <Skeleton className="h-9 w-24 bg-white/10" />
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto p-6">
          <Skeleton className="h-64 w-full bg-white/10 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  const modules = [
    { name: 'Inbox', icon: <Mail className="w-4 h-4 mr-2" />, href: '/admin/inbox' },
    { name: 'CRM Contacts', icon: <User className="w-4 h-4 mr-2" />, href: '/admin/crm' },
    { name: 'Campaigns', icon: <MessageSquare className="w-4 h-4 mr-2" />, href: '/admin/campaigns' },
    { name: 'Automations', icon: <Zap className="w-4 h-4 mr-2" />, href: '/admin/automations' },
    { name: 'Analytics', icon: <BarChart3 className="w-4 h-4 mr-2" />, href: '/admin/analytics' },
    { name: 'Content', icon: <FileText className="w-4 h-4 mr-2" />, href: '/admin/content' },
    { name: 'Settings', icon: <Settings className="w-4 h-4 mr-2" />, href: '/admin/settings' },
  ];

  const activeModule = modules.find(m => pathname?.startsWith(m.href));

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Admin Header */}
      <header className="bg-white/5 border-b border-white/10 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="flex items-center gap-2 group">
                <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight">Admin<span className="text-white/50">Panel</span></h1>
              </Link>
              <nav className="hidden md:flex items-center gap-2 border-l border-white/10 pl-6 ml-2">
                <Link href="/admin">
                  <Button
                    variant={pathname === '/admin' ? 'secondary' : 'ghost'}
                    size="sm"
                    className={pathname === '/admin' ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={activeModule ? 'secondary' : 'ghost'} size="sm" className={activeModule ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}>
                      {activeModule ? (
                        <>
                          {activeModule.icon}
                          {activeModule.name}
                        </>
                      ) : (
                        <>Modules</>
                      )}
                      <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48 bg-zinc-900 border-white/10 text-white">
                    {modules.map((module) => (
                      <Link key={module.name} href={module.href}>
                        <DropdownMenuItem className="cursor-pointer focus:bg-white/10 transition-colors">
                          {module.icon}
                          {module.name}
                        </DropdownMenuItem>
                      </Link>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-3 hover:bg-white/5 text-white/90">
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:inline font-medium">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-white/10 text-white">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-white/50">{user.email}</p>
                      <p className="text-xs text-primary mt-1 capitalize font-medium">{user.role}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-400/10 hover:bg-red-400/10 transition-colors">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Link href="/">
                <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/10 hover:text-white text-white/70">
                  Exit to Website
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

export { AuthContext };