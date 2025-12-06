import React, { useState, useEffect } from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Header({ status, isCritical, peopleCount, avgSpeed, stressLevel }) {
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("LOCATING...");
  const { user } = useAuth(); // Get user from context

  useEffect(() => {
    // Clock
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    // Dynamic Location (City/Timezone)
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      // User Preference: Show HYDERABAD for IST
      if (timeZone === 'Asia/Calcutta' || timeZone === 'Asia/Kolkata') {
        setLocation('HYDERABAD');
      } else {
        setLocation(timeZone.split('/')[1]?.replace('_', ' ').toUpperCase() || timeZone.toUpperCase());
      }
    } catch (e) {
      setLocation("HYDERABAD"); // Fallback preference
    }

    return () => clearInterval(interval);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'CP';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const displayName = user?.name || 'Guest User';
  const displayRole = user?.role === 'user' ? (user?.email || 'User') : user?.role; // specific role or email
  const subText = user?.organization ? `${displayRole} • ${user?.organization}` : displayRole;

  return (
    <header className="flex justify-between items-center mb-1 pb-6 border-b border-slate-800/50 relative h-12">

      {/* Decorative gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

      {/* Left Side: Status Monitor */}
      {status ? (
        <div className={`flex items-center gap-3 px-12 py-3 rounded-lg border transition-all duration-300 ${isCritical
            ? "bg-red-500/10 border-red-500/50 text-red-500"
            : status === "WARNING"
              ? "bg-yellow-500/10 border-yellow-500/50 text-yellow-500"
              : status === "NORMAL"
                ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500"
                : "bg-slate-800/50 border-slate-700 text-slate-400"
          }`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isCritical ? "bg-red-500 animate-ping" : status === "NORMAL" ? "bg-emerald-500" : "bg-yellow-500"}`}></div>
            <span className="text-xs font-bold tracking-wider uppercase">{status}</span>
          </div>
          <div className="h-4 w-px bg-current opacity-20 mx-1"></div>
          <span className="text-[10px] font-mono opacity-80">
            {peopleCount || 0} PAX • {avgSpeed ? avgSpeed.toFixed(1) : 0} PX/S
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-500">
          <div className="w-2 h-2 rounded-full bg-slate-600"></div>
          <span className="text-xs font-bold tracking-wider uppercase">IDLE</span>
        </div>
      )}

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">

        {/* Live Clock with Gradient */}
        <div className="hidden md:flex flex-col items-end group cursor-default">
          <span className="text-lg font-mono font-bold text-gradient tracking-tight">
            {time}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
            <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
              LIVE • {location}
            </span>
          </div>
        </div>

        {/* Notifications with Badge */}
        <div className="relative cursor-pointer group">
          <div className="p-1.5 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <Bell className="text-slate-400 group-hover:text-cyan-400 transition-colors icon-glow group-hover:opacity-100 opacity-60" size={16} />
          </div>
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-[0_0_10px_rgba(239,68,68,0.6)] animate-pulse">
            3
          </span>
        </div>

        {/* Profile Dropdown */}
        <div className="flex items-center gap-2 border-l border-slate-800/50 pl-4 cursor-pointer group">
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-900/50 transition-all duration-300 border border-transparent hover:border-slate-800">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] ring-1 ring-slate-800 ring-offset-1 ring-offset-slate-950">
                {getInitials(displayName)}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-slate-950 shadow-[0_0_6px_rgba(34,197,94,0.6)]"></div>
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-sm text-white font-semibold">{displayName}</div>
              <div className="text-xs text-slate-500 font-medium max-w-[120px] truncate" title={subText || displayRole}>
                {subText || displayRole}
              </div>
            </div>
            <ChevronDown size={16} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </div>
        </div>

      </div>
    </header>
  );
}