'use client';

import React, { useState } from 'react';
import { Save, Server, Cpu, Eye, Activity } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

export default function SettingsPage() {
  const [selectedModel, setSelectedModel] = useState('yolov8l.pt');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Fetch current model on mount to persist state
  useState(() => {
    fetch(`${API_BASE_URL}/settings/model`)
      .then(res => res.json())
      .then(data => {
        if (data.model) setSelectedModel(data.model);
      })
      .catch(err => console.error("Failed to fetch current settings", err));
  }, []);

  const changeModel = async (modelName) => {
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/settings/model?model_name=${modelName}`, {
        method: 'POST'
      });
      if (res.ok) {
        setSelectedModel(modelName);
        setMsg(`Successfully switched to ${modelName}`);
      } else {
        setMsg('Failed to switch model');
      }
    } catch (e) {
      console.error(e);
      setMsg('Error connecting to backend');
    }
    setLoading(false);
  };

  const models = [
    { id: 'yolov8n.pt', name: 'YOLOv8 Nano', desc: 'Fastest, Lowest Accuracy' },
    { id: 'yolov8s.pt', name: 'YOLOv8 Small', desc: 'Fast, Low Accuracy' },
    { id: 'yolov8m.pt', name: 'YOLOv8 Medium', desc: 'Balanced' },
    { id: 'yolov8l.pt', name: 'YOLOv8 Large', desc: 'Slow, High Accuracy' },
    { id: 'yolov8x.pt', name: 'YOLOv8 X-Large', desc: 'Slowest, Max Accuracy' },
  ];

  return (
    <div className="p-8 text-white max-w-4xl mx-auto h-screen overflow-y-auto">
      <h1 className="text-3xl font-bold mb-2">System Configuration</h1>
      <p className="text-slate-400 mb-8">Manage AI parameters and detection thresholds.</p>

      {/* Configuration Form */}
      <div className="space-y-6">

        {/* Section 1: AI Model Selection */}
        <div className="glass-panel p-6 rounded-xl border border-cyan-900/30">
          <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
            <Cpu size={20} /> AI Model Engine
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-400 mb-3">Select Detection Model</label>
              <div className="space-y-2">
                {models.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => changeModel(m.id)}
                    disabled={loading}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex justify-between items-center ${selectedModel === m.id
                      ? 'bg-cyan-500/20 border-cyan-500 text-white'
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700'
                      }`}
                  >
                    <span className="font-bold">{m.name}</span>
                    <span className="text-xs opacity-70">{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-black/40 p-4 rounded-lg border border-slate-800 flex flex-col justify-center">
              <h3 className="text-slate-300 font-bold mb-2 flex items-center gap-2">
                <Activity size={16} className="text-cyan-500" /> Performance Impact
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Switching models happens in real-time.
                <br /><br />
                <strong className="text-green-400">Nano/Small</strong>: Best for older hardware or very high framerates.
                <br />
                <strong className="text-yellow-400">Medium/Large</strong>: Standard for modern CPUs.
                <br />
                <strong className="text-red-400">X-Large</strong>: Requires powerful hardware. May cause delay in detection boxes (async mode).
              </p>
              {msg && (
                <div className="mt-4 p-3 bg-cyan-900/50 border border-cyan-500/50 rounded text-cyan-200 text-sm text-center animate-pulse">
                  {msg}
                </div>
              )}
              {loading && <p className="text-center text-xs text-slate-500 mt-2">Switching...</p>}
            </div>
          </div>
        </div>

        {/* Section 2: Camera Sources */}
        <div className="glass-panel p-6 rounded-xl">
          <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
            <Eye size={20} /> Camera Sources
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-slate-700 rounded bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>CAM-01 (Main Entrance)</span>
              </div>
              <span className="text-xs bg-cyan-900/30 text-cyan-400 px-2 py-1 rounded">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-slate-700 rounded bg-slate-900 opacity-50">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>CAM-02 (Exit Hall B)</span>
              </div>
              <span className="text-xs bg-slate-800 text-slate-500 px-2 py-1 rounded">Offline</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}