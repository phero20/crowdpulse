'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Info, CheckCircle, Filter, Download } from 'lucide-react';

export default function AlertsPage() {
  const [logs, setLogs] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/logs');
        if (res.ok) {
          const data = await res.json();
          // Transform backend format to UI format if needed
          const formattedLogs = data.map(log => ({
            time: new Date(log.timestamp).toLocaleTimeString(),
            type: log.type,
            msg: log.message
          }));
          setLogs(formattedLogs);
        }
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      }
    };
    fetchLogs();

    // Auto-refresh logs every 5 seconds
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = activeFilter === 'all'
    ? logs
    : logs.filter(log => log.type === activeFilter);

  const getFilterClass = (filter) => {
    const isActive = activeFilter === filter;
    const baseClass = "px-3 py-1 text-sm rounded-full transition-colors";

    if (isActive) {
      if (filter === 'all') return `${baseClass} bg-cyan-500/10 text-cyan-400 border border-cyan-500/20`;
      if (filter === 'error') return `${baseClass} bg-red-500/10 text-red-500 border border-red-500/20`;
      if (filter === 'warning') return `${baseClass} bg-yellow-500/10 text-yellow-500 border border-yellow-500/20`;
      if (filter === 'success') return `${baseClass} bg-emerald-500/10 text-emerald-500 border border-emerald-500/20`;
      if (filter === 'info') return `${baseClass} bg-blue-500/10 text-blue-400 border border-blue-500/20`; // Added info specific style
      return `${baseClass} bg-slate-700 text-white`;
    }
    return `${baseClass} bg-slate-800 text-slate-400 hover:bg-slate-700`;
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-2">System Alerts & Event Logs</h1>
      <p className="text-slate-400 mb-8">Search, filter, and export historical system event data.</p>

      {/* Filtering and Actions */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <span className="text-sm">Filter by:</span>
          </div>
          <button onClick={() => setActiveFilter('all')} className={getFilterClass('all')}>All</button>
          <button onClick={() => setActiveFilter('error')} className={getFilterClass('error')}>Critical</button>
          <button onClick={() => setActiveFilter('warning')} className={getFilterClass('warning')}>Warning</button>
          <button onClick={() => setActiveFilter('info')} className={getFilterClass('info')}>Info</button>
          <button onClick={() => setActiveFilter('success')} className={getFilterClass('success')}>Success</button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700">
          <Download size={16} />
          Export Logs
        </button>
      </div>

      {/* Log Table */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="font-mono text-xs text-slate-400 uppercase grid grid-cols-12 p-4 border-b border-slate-800">
          <div className="col-span-2">Timestamp</div>
          <div className="col-span-2">Event Type</div>
          <div className="col-span-8">Message</div>
        </div>
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
          {filteredLogs.map((log, i) => <LogTableRow key={i} {...log} />)}
          {filteredLogs.length === 0 && (
            <div className="p-8 text-center text-slate-500 italic">No logs found matching this filter.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function LogTableRow({ time, type, msg }) {
  const configs = {
    info: { color: 'text-cyan-400', bg: 'hover:bg-cyan-500/10', border: 'border-slate-800/50', icon: <Info size={16} /> },
    success: { color: 'text-emerald-400', bg: 'bg-emerald-500/5 hover:bg-emerald-500/10', border: 'border-emerald-500/20', icon: <CheckCircle size={16} /> },
    warning: { color: 'text-yellow-400', bg: 'bg-yellow-500/5 hover:bg-yellow-500/10', border: 'border-yellow-500/20', icon: <AlertTriangle size={16} /> },
    error: { color: 'text-red-500', bg: 'bg-red-500/10 hover:bg-red-500/20', border: 'border-red-500/30', icon: <AlertTriangle size={16} className="animate-pulse" /> },
  };

  const config = configs[type] || configs.info;

  return (
    <div className={`font-mono text-sm grid grid-cols-12 items-center p-4 border-b ${config.border} ${config.bg} transition-colors`}>
      <div className="col-span-2 text-slate-500">{time}</div>
      <div className={`col-span-2 flex items-center gap-2 ${config.color} font-bold`}>
        {config.icon}
        <span className="capitalize">{type === 'error' ? 'CRITICAL' : type}</span>
      </div>
      <div className={`col-span-8 ${type === 'error' || type === 'warning' ? 'text-white font-medium' : 'text-slate-300'}`}>
        {msg}
      </div>
    </div>
  );
}
