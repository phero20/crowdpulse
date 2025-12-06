'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Upload, Camera, Video } from 'lucide-react';

export default function LiveFeed({ isCritical, streamUrl, onUpload, uploading, cameraStream, onCameraToggle, isLiveMode }) {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Handle camera stream display
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    } else if (videoRef.current && !cameraStream) {
      videoRef.current.srcObject = null;
    }
  }, [cameraStream]);

  const handleFileChange = (e) => {
    if (e.target.files[0] && onUpload) {
      onUpload(e.target.files[0]);
    }
  };

  const handleVideoButtonClick = () => {
    // Stop camera if active
    if (cameraStream || isLiveMode) {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      onCameraToggle(); // Toggle off
    }
    // Trigger file input if not in live mode (allows replacing video)
    if (!isLiveMode && fileInputRef.current) {
      // If we are already playing a video, we can still open dialog to switch
      fileInputRef.current.click();
    }
  };

  // If we have a streamUrl, it is a video stream (whether file or live backend)
  const isVideoStream = !!streamUrl;
  // Camera is active if we have a local stream OR we remain in backend live mode
  const isCameraActive = !!cameraStream || isLiveMode;
  const hasAnyStream = isVideoStream || isCameraActive;

  return (
    <div className="flex flex-col h-full w-full">
      {/* Toggle Switch - Modern Design */}
      <div className="flex justify-center mb-3 shrink-0">
        <div className="glass-panel px-1.5 py-1.5 rounded-xl flex items-center gap-1.5 border-slate-700">
          <button
            onClick={handleVideoButtonClick}
            className={`px-5 py-2.5 rounded-lg flex items-center gap-2.5 transition-all duration-300 font-semibold text-sm ${isVideoStream
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_4px_16px_rgba(6,182,212,0.4)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            disabled={uploading}
          >
            <Video size={18} className={isVideoStream ? 'icon-glow' : ''} />
            <span>Video Feed</span>
          </button>
          <button
            onClick={onCameraToggle}
            className={`px-5 py-2.5 rounded-lg flex items-center gap-2.5 transition-all duration-300 font-semibold text-sm ${isCameraActive
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_4px_16px_rgba(6,182,212,0.4)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            disabled={uploading}
          >
            <Camera size={18} className={isCameraActive ? 'icon-glow' : ''} />
            <span>Live Camera</span>
          </button>
        </div>
      </div>

      {/* Hidden file input for video upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />

      <div className={`relative w-full flex-1 rounded-xl overflow-hidden border border-slate-700/50 bg-black/40 group transition-all duration-500 ${isCritical
        ? 'shadow-[0_0_40px_rgba(239,68,68,0.3)] border-red-500/50'
        : 'shadow-[0_0_30px_rgba(6,182,212,0.1)] hover:shadow-[0_0_50px_rgba(6,182,212,0.2)] hover:border-cyan-500/50'
        }`}>

        {/* Gradient border effect */}
        {isCritical && (
          <div className="absolute inset-0 rounded-xl" style={{
            background: 'linear-gradient(45deg, #ef4444, #f97316, #ef4444)',
            backgroundSize: '200% 200%',
            animation: 'gradientRotate 3s linear infinite',
            padding: '1px',
            zIndex: -1
          }}></div>
        )}

        {/* Video/Camera Display */}
        <div className="absolute inset-0 bg-slate-950 flex items-center justify-center">
          {isVideoStream ? (
            <img
              src={streamUrl}
              alt="Live Stream"
              className="w-full h-full object-contain"
            />
          ) : isCameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
          )}
        </div>

        {/* Status Badges (Top Left/Right) */}
        {hasAnyStream && (
          <>
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 z-20">
              <div className={`w-2 h-2 rounded-full ${isCritical ? 'bg-red-500 animate-ping' : 'bg-green-500 animate-pulse'}`}></div>
              <span className="text-xs font-mono font-bold tracking-wider text-white">
                {isLiveMode ? 'LIVE FEED' : 'PLAYBACK'}
              </span>
            </div>

            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 z-20">
              <span className="text-xs font-mono font-bold text-cyan-400">
                {isCritical ? 'CRITICAL DETECTED' : 'SYSTEM ACTIVE'}
              </span>
            </div>
          </>
        )}

        {/* Upload Overlay - ONLY Visible when NO Stream */}
        {!hasAnyStream && (
          <div className="absolute inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-30">
            <label
              className="cursor-pointer flex flex-col items-center gap-4 p-8 rounded-2xl hover:bg-white/5 transition-all duration-300 glass-panel border-dashed border-2 border-cyan-500/30 hover:border-cyan-400 hover:scale-105 group/upload"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={`p-5 rounded-2xl ${uploading ? 'bg-cyan-500/20 animate-pulse' : 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 group-hover/upload:from-cyan-500/20 group-hover/upload:to-blue-500/20'}`}>
                <Upload className={`w-12 h-12 ${uploading ? 'text-cyan-400 animate-bounce' : 'text-cyan-300'}`} />
              </div>
              <div className="text-center">
                <span className="block text-sm font-bold text-cyan-300 mb-1 tracking-wide">
                  {uploading ? 'PROCESSING CORE...' : 'INITIALIZE FEED'}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  DROP VIDEO FILE
                </span>
              </div>
            </label>
          </div>
        )}

        {/* AI Scanner Animation - Enhanced */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {/* Horizontal scan line */}
          <div className={`w-full h-[1px] absolute ${isCritical ? 'bg-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.8)]' : 'bg-cyan-400/30 shadow-[0_0_10px_rgba(34,211,238,0.6)]'
            } animate-[scan_4s_ease-in-out_infinite]`} style={{ top: '50%' }}></div>

          {/* Subtle Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] opacity-10"></div>
        </div>
      </div>
    </div>
  );
}