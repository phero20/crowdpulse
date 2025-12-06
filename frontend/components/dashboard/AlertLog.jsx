import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Info, CheckCircle, Terminal, AlertCircle } from 'lucide-react';

export default function AlertLog({ isCritical, status, peopleCount, avgSpeed }) {
  const scrollRef = useRef(null);
  const [logHistory, setLogHistory] = useState([
    { time: new Date().toLocaleTimeString(), type: "info", msg: "System Boot Sequence Initiated" },
    { time: new Date().toLocaleTimeString(), type: "success", msg: "Camera Feed [CAM-01] Connected" },
    { time: new Date().toLocaleTimeString(), type: "info", msg: "Background subtraction model loaded" },
  ]);

  // Auto-scroll to bottom whenever new logs are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logHistory]);

  // Add real-time status updates to log
  useEffect(() => {
    if (status) {
      const now = new Date().toLocaleTimeString();
      let logType = "info";
      let logMsg = `Status: ${status}`;

      if (status.includes("RISK") || status.includes("CRITICAL") || isCritical) {
        logType = "error"; // Red
        logMsg = `🚨 CRITICAL: ${status} - ${peopleCount} people, ${avgSpeed.toFixed(1)} px/s avg speed`;
      } else if (status === "WARNING") {
        logType = "warning"; // Yellow
        logMsg = `⚠️ WARNING: High Density Detected - ${peopleCount} people`;
      } else if (status === "NORMAL") {
        logType = "success"; // Green
        logMsg = `Status: ${status} - ${peopleCount} people detected`;
      }

      setLogHistory(prev => {
        const newLog = { time: now, type: logType, msg: logMsg };
        // Only add if status changed or it's a critical alert
        const lastLog = prev[prev.length - 1];

        // Avoid duplicate spam unless it's critical/warning
        if (!lastLog || lastLog.msg !== logMsg || isCritical || logType === 'warning') {
          const updated = [...prev, newLog];
          // Keep only last 50 logs for history
          if (updated.length > 50) updated.shift();
          return updated;
        }
        return prev;
      });
    }
  }, [status, isCritical, peopleCount, avgSpeed]);

  return (
    <div className="glass-panel-hover p-5 rounded-xl h-full flex flex-col">
      <div className="flex justify-between items-center mb-3 border-b border-slate-800/50 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-slate-800/50 rounded-lg float">
            <Terminal size={14} className="text-cyan-400" />
          </div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">System Logs</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_6px_rgba(6,182,212,0.8)]"></div>
          <span className="text-[10px] text-slate-600 font-mono uppercase tracking-wider">Live Tail</span>
        </div>
      </div>

      <div className="overflow-y-auto space-y-2 font-mono text-xs pr-2 flex-1 scroll-smooth" ref={scrollRef}>
        {logHistory.map((log, idx) => (
          <LogItem key={idx} time={log.time} type={log.type} msg={log.msg} />
        ))}
        {/* Invisible element to ensure scrolling hits the very bottom */}
        <div />
      </div>
    </div>
  );
}

function LogItem({ time, type, msg }) {
  const configs = {
    info: {
      color: "text-cyan-400",
      bg: "bg-cyan-500/5 border-cyan-500/20",
      icon: <Info size={13} className="flex-shrink-0" />
    },
    success: {
      color: "text-emerald-400",
      bg: "bg-emerald-500/5 border-emerald-500/20",
      icon: <CheckCircle size={13} className="flex-shrink-0" />
    },
    warning: {
      color: "text-yellow-400",
      bg: "bg-yellow-500/5 border-yellow-500/20",
      icon: <AlertCircle size={13} className="flex-shrink-0" />
    },
    error: {
      color: "text-red-400 font-bold",
      bg: "bg-red-500/10 border-red-500/40",
      icon: <AlertTriangle size={13} className="flex-shrink-0 animate-pulse" />
    },
  };

  const config = configs[type] || configs.info;

  return (
    <div className={`flex gap-2.5 items-start ${config.color} ${config.bg} border p-2.5 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-sm`}>
      <span className="text-slate-600 text-[10px] min-w-[55px] font-semibold mt-0.5">{time}</span>
      <div className="mt-0.5">{config.icon}</div>
      <span className={`flex-1 leading-relaxed ${type === 'error' ? 'tracking-wide' : ''}`}>{msg}</span>
    </div>
  );
}