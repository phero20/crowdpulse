'use client';

import React, { useState, useEffect } from 'react';

export default function StatCard({ label, value, subtext, icon: Icon, isCritical, type = "normal" }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue)) {
      setDisplayValue(numericValue);
    }
  }, [value]);

  // Determine color based on critical state
  let colorClass = "text-cyan-400";
  let iconColorClass = "text-cyan-400";
  let bgGradient = "from-cyan-500/10 to-blue-500/5";
  let borderClass = "border-cyan-500/30";

  if (type === "stress" && isCritical) {
    colorClass = "text-red-400 text-glow-red";
    iconColorClass = "text-red-500 icon-glow-red";
    bgGradient = "from-red-500/20 to-orange-500/10";
    borderClass = "border-red-500/60";
  }

  return (
    <div className={`glass-panel-hover p-5 rounded-xl flex flex-col justify-between relative overflow-hidden group ${borderClass}`}>
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

      {/* Shimmer effect */}
      <div className="shimmer absolute inset-0"></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-slate-400 text-xs font-bold tracking-widest uppercase block mb-1">
              {label}
            </span>
            <div className="h-0.5 w-8 bg-gradient-to-r from-cyan-500 to-transparent rounded-full"></div>
          </div>
          {Icon && (
            <div className="float">
              <Icon className={`${iconColorClass} opacity-80 transition-all duration-300 group-hover:scale-110`} size={24} />
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <span className={`stat-card-value ${type === 'stress' && isCritical ? 'text-gradient-vibrant' : ''}`}>
            {type === 'stress' ? value : Math.round(displayValue)}
          </span>
          {subtext && (
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
              {subtext}
            </span>
          )}
        </div>

        {/* Trend indicator (decorative) */}
        <div className="mt-3 flex items-center gap-2">
          <div className={`h-1 w-12 rounded-full ${type === 'stress' && isCritical ? 'bg-gradient-to-r from-red-500 to-orange-500 animate-pulse' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}></div>
          <span className="text-[10px] text-slate-600 font-mono">REAL-TIME</span>
        </div>
      </div>
    </div>
  );
}