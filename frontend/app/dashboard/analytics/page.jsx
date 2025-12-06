'use client';

import React from 'react';
import { Calendar, Users, Activity, AlertTriangle } from 'lucide-react';
import Analytics from '@/components/dashboard/Analytics';
import StatCard from '@/components/dashboard/StatCard';

export default function AnalyticsPage() {
  const [data, setData] = React.useState({ daily: [], weekly: [] });
  const [stats, setStats] = React.useState({ peak: 0, avgStress: 0, critical: 0 });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/analytics/history?limit=100');
        if (res.ok) {
          const apiData = await res.json();

          // Process for Charts
          const chartData = apiData.map(d => ({
            time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            count: d.peopleCount
          }));

          // Mock Weekly (or just slice distinct days if we had them)
          // For now, mapping daily trend again as placeholder or subset
          const weeklyData = chartData.filter((_, i) => i % 5 === 0);

          setData({ daily: chartData, weekly: weeklyData });

          // Calculate Summary Stats
          if (apiData.length > 0) {
            const peak = Math.max(...apiData.map(d => d.peopleCount));
            const avgStress = (apiData.reduce((acc, curr) => acc + curr.stressLevel, 0) / apiData.length).toFixed(1);
            const criticalCount = apiData.filter(d => d.status === 'CRITICAL' || d.status === 'STAMPEDE RISK!').length;

            setStats({ peak, avgStress, critical: criticalCount });
          }
        }
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000); // Live update
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-2">Analytics & Historical Data</h1>
      <p className="text-slate-400 mb-8">Review past crowd data and system performance.</p>

      {/* Date Range Selector */}
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2">
          <Calendar size={18} className="text-cyan-400" />
          <span className="text-sm">Date Range:</span>
          <select className="bg-transparent text-white focus:outline-none">
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Peak Occupancy" value={stats.peak.toString()} subtext="(Session)" icon={Users} />
        <StatCard label="Avg. Stress Level" value={`${stats.avgStress}%`} subtext="(Average)" icon={Activity} />
        <StatCard label="Critical Alerts" value={stats.critical.toString()} subtext="(Recorded)" icon={AlertTriangle} type="stress" isCritical={stats.critical > 0} />
      </div>

      {/* Charts */}
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold text-cyan-400 mb-4">Real-Time Occupancy Trend</h2>
          <div className="h-[350px]">
            <Analytics data={data.daily} />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-cyan-400 mb-4">Weekly Overview (Sampled)</h2>
          <div className="h-[350px]">
            <Analytics data={data.weekly} />
          </div>
        </div>
      </div>
    </div>
  );
}
