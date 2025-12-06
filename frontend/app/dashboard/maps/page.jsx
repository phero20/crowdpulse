'use client';

import React, { useState } from 'react';
import { MapPin, Video, Users } from 'lucide-react';
import HeatMap from '@/components/dashboard/HeatMap';
import StatCard from '@/components/dashboard/StatCard';
import { useCrowdData } from '@/hooks/useCrowdData';

const floors = [
  {
    name: 'Floor 1 (Main Hall)',
    cameras: [
      { id: 'CAM-01', status: 'active', location: 'Main Entrance' },
      { id: 'CAM-02', status: 'active', location: 'West Corridor' },
      { id: 'CAM-03', status: 'offline', location: 'East Corridor' },
    ],
    // Static fallback stats
    stats: {
      pax: 85,
      risk: 'Low'
    }
  },
  {
    name: 'Floor 2 (Exit)',
    cameras: [
      { id: 'CAM-04', status: 'active', location: 'Exit Hall A' },
      { id: 'CAM-05', status: 'active', location: 'Exit Hall B' },
    ],
    stats: {
      pax: 23,
      risk: 'Nominal'
    }
  },
  {
    name: 'Basement (Parking)',
    cameras: [
      { id: 'CAM-06', status: 'offline', location: 'Parking Lot P1' },
    ],
    stats: {
      pax: 5,
      risk: 'Nominal'
    }
  },
];

export default function MapsPage() {
  const [selectedFloor, setSelectedFloor] = useState(floors[0]);

  // Fetch real-time data
  // Only apply to Floor 1 for this demo (as that's where our cam is)
  const { peopleCount, status } = useCrowdData(true); // Always fetch

  const isLiveFloor = selectedFloor.name === 'Floor 1 (Main Hall)';
  const displayPax = isLiveFloor ? peopleCount : selectedFloor.stats.pax;
  const displayRisk = isLiveFloor ? status : selectedFloor.stats.risk;

  return (
    <div className="p-8 text-white h-screen overflow-y-auto">
      <h1 className="text-3xl font-bold mb-2">Floor Maps & Area Analysis</h1>
      <p className="text-slate-400 mb-8">Select a floor to view its live heatmap and associated camera feeds.</p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Floor Selector & Camera List */}
        <div className="lg:col-span-3 space-y-6">

          {/* Floor Selector */}
          <div>
            <h2 className="text-lg font-bold text-cyan-400 mb-3">Select Floor</h2>
            <div className="space-y-2">
              {floors.map((floor) => (
                <button
                  key={floor.name}
                  onClick={() => setSelectedFloor(floor)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${selectedFloor.name === floor.name ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-slate-800/50 hover:bg-slate-700/50'}`}
                >
                  {floor.name}
                </button>
              ))}
            </div>
          </div>

          {/* Camera List for Selected Floor */}
          <div>
            <h2 className="text-lg font-bold text-cyan-400 mb-3">Active Cameras</h2>
            <div className="space-y-3">
              {selectedFloor.cameras.map(cam => (
                <div key={cam.id} className="flex items-center justify-between p-3 bg-slate-900/70 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-3">
                    <Video size={16} className={cam.status === 'active' ? 'text-green-500' : 'text-slate-600'} />
                    <div>
                      <p className="text-sm font-medium text-slate-300">{cam.id}</p>
                      <p className="text-xs text-slate-500">{cam.location}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${cam.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                    {cam.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Heatmap and Stats */}
        <div className="lg:col-span-9 flex flex-col gap-8">
          <div className="h-[600px]">
            <HeatMap />
          </div>
          <div className="grid grid-cols-2 gap-8">
            <StatCard label="Pax Count (Floor)" value={displayPax} icon={Users} />
            <StatCard
              label="Current Risk"
              value={displayRisk}
              isCritical={displayRisk === 'STAMPEDE RISK!'}
              type={displayRisk === 'STAMPEDE RISK!' ? 'stress' : 'normal'}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
