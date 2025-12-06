"use client"; // Required for Recharts
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function Analytics({ data }) {
  return (
    <div className="glass-panel-hover p-5 rounded-xl h-[300px] w-full relative overflow-hidden group">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-cyan-400 text-sm font-bold flex items-center gap-2.5">
          <div className="p-1.5 bg-cyan-500/20 rounded-lg float">
            <TrendingUp size={14} className="text-cyan-400" />
          </div>
          <span className="uppercase tracking-wider">Real-Time Density Trend</span>
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
          <span className="text-[10px] text-slate-600 font-mono uppercase tracking-wider">Live Data</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[240px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.2} />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={11}
              tick={{ fill: '#64748b' }}
              axisLine={{ stroke: '#1e293b' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              domain={[0, 200]}
              tick={{ fill: '#64748b' }}
              axisLine={{ stroke: '#1e293b' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderColor: '#06b6d4',
                borderRadius: '0.75rem',
                boxShadow: '0 8px 32px rgba(6, 182, 212, 0.25)',
                padding: '8px 12px',
                backdropFilter: 'blur(12px)'
              }}
              itemStyle={{ color: '#22d3ee', fontWeight: 600, fontSize: '12px' }}
              labelStyle={{ color: '#94a3b8', fontSize: '11px', marginBottom: '4px' }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#22d3ee"
              strokeWidth={3}
              fill="url(#colorCount)"
              dot={false}
              activeDot={{ r: 6, fill: '#22d3ee', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}