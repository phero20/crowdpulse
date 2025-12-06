import React from 'react';
import { MapPin } from 'lucide-react';

export default function HeatMap() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full flex flex-col relative overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 z-10">
        <MapPin className="text-cyan-400" size={20} />
        <h3 className="text-white text-lg font-bold">Density Heatmap</h3>
      </div>

      {/* Heatmap Visualization Area */}
      <div className="relative flex-1 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 min-h-[200px]">
        {/* 1. Underlying Gradients (Simulated Heat) */}
        <div className="absolute inset-0 z-0" style={{
          background: 'radial-gradient(ellipse at 30% 40%, rgba(239, 68, 68, 0.4), transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(251, 191, 36, 0.3), transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(16, 185, 129, 0.2), transparent 50%)'
        }}></div>

        {/* 2. Grid Overlay */}
        <div className="absolute inset-0 z-10" style={{
          backgroundImage: 'linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>

        {/* 3. Live Feed Overlay (If Active) */}
        <img
          src="http://localhost:8000/heatmap_feed"
          alt="Live Heatmap"
          className="absolute inset-0 w-full h-full object-cover z-20 mix-blend-screen opacity-90"
          onError={(e) => { e.target.style.display = 'none'; }}
        />

        {/* 4. Pulsing Markers (Decorative/Placeholder for when stream is off or to enhance it) */}
        <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50 z-30"></div>
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-lg shadow-amber-500/50 z-30"></div>
        <div className="absolute bottom-1/4 left-1/2 w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50 z-30"></div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-md shadow-sm shadow-red-500/50"></div>
          <span className="text-sm text-slate-400 font-medium">Critical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-amber-500 rounded-md shadow-sm shadow-amber-500/50"></div>
          <span className="text-sm text-slate-400 font-medium">Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-500 rounded-md shadow-sm shadow-emerald-500/50"></div>
          <span className="text-sm text-slate-400 font-medium">Safe</span>
        </div>
      </div>
    </div>
  );
}