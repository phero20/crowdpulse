'use client';

import React, { useEffect } from 'react';
import { LayoutDashboard, History, Settings, LogOut, Map, Bell } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { href: '/dashboard', label: 'Live Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/maps', label: 'Floor Maps', icon: Map },
  { href: '/dashboard/analytics', label: 'Analytics History', icon: History },
  { href: '/dashboard/alerts', label: 'Alerts & Logs', icon: Bell },
  { href: '/dashboard/settings', label: 'System Config', icon: Settings },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/?login=true');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-cyan-500">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          <p className="text-sm font-mono animate-pulse">AUTHENTICATING...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in but loading is done, we are redirecting.
  // We can return null or the loader.
  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-950">

      {/* Sidebar */}
      <aside className="w-64 border-r border-cyan-900/30 bg-slate-900/50 hidden md:flex flex-col p-4">

        {/* Logo Area */}
        <div className="mb-10 flex items-center gap-2 px-2">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center font-bold text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            CP
          </div>
          <span className="font-bold text-xl tracking-wider text-white">CrowdPulse</span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href}>
              <NavItem
                icon={item.icon}
                label={item.label}
                active={pathname === item.href}
              />
            </Link>
          ))}
        </nav>

        {/* User Profile / Logout */}
        <div className="border-t border-slate-800 pt-4 mt-auto">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 text-slate-400 hover:text-red-400 transition-colors px-2 py-2"
          >
            <LogOut size={18} />
            <span className="text-sm font-mono">Disconnect</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}

// Simple Helper Component for Sidebar Links
function NavItem({ icon: Icon, label, active }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all ${active ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
      <Icon size={18} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
