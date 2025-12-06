"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Users, Activity } from 'lucide-react';
import { useCrowdData } from '@/hooks/useCrowdData';

// Components
import Header from '@/components/dashboard/Header';
import LiveFeed from '@/components/dashboard/LiveFeed';
import StatCard from '@/components/dashboard/StatCard';
import Analytics from '@/components/dashboard/Analytics';
import HeatMap from '@/components/dashboard/HeatMap';
import AlertLog from '@/components/dashboard/AlertLog';

export default function DashboardPage() {
  const [streamUrl, setStreamUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const streamRef = useRef(null);

  // Only fetch data when we have an active video stream (not camera for now)
  // With backend live mode, streamUrl IS set, so we fetch data naturally!
  const hasActiveStream = !!streamUrl;
  const { peopleCount, stressLevel, avgSpeed, status, isCritical, chartData, isConnected } = useCrowdData(hasActiveStream);

  // Handle camera toggle (Now uses Backend AI Stream)
  const handleCameraToggle = async () => {
    if (isLiveMode) {
      // Turn off
      setStreamUrl(null);
      setIsLiveMode(false);
    } else {
      // Turn on Live AI Camera
      // Stop any existing stream
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
      setStreamUrl("http://localhost:8000/live");
      setIsLiveMode(true);
    }
  };

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);

    // Stop camera if active
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      streamRef.current = null;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.filename) {
        setStreamUrl(`http://localhost:8000/stream/${data.filename}`);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* 1. Top Header */}
      <Header
        status={status}
        isCritical={isCritical}
        peopleCount={peopleCount}
        avgSpeed={avgSpeed}
        stressLevel={stressLevel}
      />

      {/* Prominent Alert Banner - Shows real status from backend */}


      {/* 2. COMMAND CENTER GRID LAYOUT */}
      <div className="flex-1 flex flex-col gap-6 min-h-0">

        {/* TOP ROW: MONITORING STATION (Video + Key Stats) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[800px] lg:flex-[3]">

          {/* MAIN STAGE: Video Feed (75% Width) */}
          <div className="lg:col-span-9 flex flex-col h-full">
            <div className="flex-1 rounded-2xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.3)] overflow-hidden relative group">
              {/* Wrapper div for LiveFeed */}
              <div className="absolute inset-0 p-2">
                <LiveFeed
                  isCritical={isCritical}
                  streamUrl={streamUrl}
                  onUpload={handleUpload}
                  uploading={uploading}
                  cameraStream={cameraStream}
                  onCameraToggle={handleCameraToggle}
                  isLiveMode={isLiveMode}
                />
              </div>

              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-xl pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-xl pointer-events-none"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyan-500/30 rounded-br-xl pointer-events-none"></div>
            </div>
          </div>

          {/* SIDEBAR: Status Panel (25% Width) */}
          <div className="lg:col-span-3 flex flex-col gap-4 h-full overflow-hidden">

            {/* Critical Data Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 shrink-0">
              <StatCard
                label="Pax Count"
                value={peopleCount}
                subtext="Total Residents"
                icon={Users}
              />
              <StatCard
                label="Stress Level"
                value={`${stressLevel}%`}
                subtext="Crowd Tension"
                icon={Activity}
                isCritical={isCritical}
                type="stress"
              />
            </div>

            {/* Live Event Log - Fills remaining height */}
            <div className="flex-1 min-h-0">
              <AlertLog
                isCritical={isCritical}
                status={status}
                peopleCount={peopleCount}
                avgSpeed={avgSpeed}
              />
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: DEEP ANALYSIS (Heatmap + Charts) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[360px] pb-12">

          <div className="h-full">
            <HeatMap />
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm overflow-hidden p-1 relative h-full">
            <div className="absolute top-2 left-3 z-10 bg-black/40 px-3 py-1 rounded-full text-xs font-mono text-cyan-400 border border-cyan-500/20">
              REAL-TIME TRENDS
            </div>
            <Analytics data={chartData} />
          </div>

        </div>

      </div>
    </div>
  );
}