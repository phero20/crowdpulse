"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldAlert, Activity, Eye, Users, Brain, Zap, AlertTriangle, TrendingUp, MapPin, Radio, BarChart3, Gauge, Shield, ChevronRight, CheckCircle, Target, Cpu, Network, Bell } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';
import Link from 'next/link';

export default function LandingPage() {
  const [metrics, setMetrics] = useState({ crowd: 0, alerts: 0, zones: 0, accuracy: 0 });
  const [activeDemo, setActiveDemo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        crowd: Math.floor(Math.random() * 500) + 200,
        alerts: Math.floor(Math.random() * 5),
        zones: Math.floor(Math.random() * 8) + 3,
        accuracy: (Math.random() * 2 + 97).toFixed(1)
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const demoInterval = setInterval(() => {
      setActiveDemo(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(demoInterval);
  }, []);

  // Data for charts
  const densityData = [
    { time: '00:00', count: 45 },
    { time: '04:00', count: 78 },
    { time: '08:00', count: 156 },
    { time: '12:00', count: 312 },
    { time: '16:00', count: 245 },
    { time: '20:00', count: 189 },
    { time: '24:00', count: 67 }
  ];

  const detectionData = [
    { name: 'Faces', value: 98.4, fill: '#06b6d4' },
    { name: 'Bodies', value: 96.8, fill: '#3b82f6' },
    { name: 'Movement', value: 99.1, fill: '#10b981' },
    { name: 'Emotion', value: 94.2, fill: '#0ea5e9' }
  ];

  const incidentData = [
    { month: 'Jan', prevented: 12, detected: 45 },
    { month: 'Feb', prevented: 19, detected: 52 },
    { month: 'Mar', prevented: 25, detected: 48 },
    { month: 'Apr', prevented: 31, detected: 61 },
    { month: 'May', prevented: 28, detected: 55 },
    { month: 'Jun', prevented: 35, detected: 67 }
  ];

  const zoneData = [
    { name: 'Safe', value: 68, fill: '#10b981' },
    { name: 'Moderate', value: 24, fill: '#f59e0b' },
    { name: 'Critical', value: 8, fill: '#ef4444' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden relative">

      {/* Subtle Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-20 pb-16">
        <div className="text-center space-y-8 max-w-6xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700"
          >
            <Zap className="text-cyan-400" size={16} />
            <span className="text-cyan-400 text-sm font-semibold tracking-wide">
              Advanced Stampede Prediction & Crowd Analytics
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-8xl font-bold leading-tight"
          >
            <span className="block text-white mb-3">
              AI-Powered Stampede
            </span>
            {/* Removed gradient text, kept simple accent color */}
            <span className="block text-cyan-400">
              Prevention System
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Real-time crowd density monitoring, stress analysis, and stampede prediction
            using YOLOv8 computer vision and predictive ML models to{' '}
            <span className="text-cyan-400 font-semibold">stop tragedies before they happen</span>.
          </motion.p>

          {/* Animated Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12"
          >
            <AnimatedMetric icon={Users} value={metrics.crowd} label="Live Pax" color="cyan" />
            <AnimatedMetric icon={AlertTriangle} value={metrics.alerts} label="Risk Alerts" color="amber" />
            <AnimatedMetric icon={MapPin} value={metrics.zones} label="Active Cameras" color="emerald" />
            <AnimatedMetric icon={Target} value={`${metrics.accuracy}%`} label="Model Acc." color="cyan" />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.6,
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-lg rounded-xl shadow-md"
              >
                <span className="flex items-center gap-3">
                  <Radio size={20} />
                  Launch Live Dashboard
                  <ArrowRight className="transition-transform" size={20} />
                </span>
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="px-8 py-4 rounded-xl border border-slate-700 text-white font-semibold text-lg bg-slate-900/60 hover:bg-slate-900"
            >
              <span className="flex items-center gap-2">
                <Activity size={20} />
                View Demo
              </span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 mb-6"
            >
              <Activity className="text-cyan-400" size={16} />
              <span className="text-cyan-400 text-sm font-semibold tracking-wide">
                Live Demo
              </span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              See CrowdPulse <span className="text-cyan-400">In Action</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              See our YOLOv8-powered engine detect people, analyze flow, and flag stampede risks with &lt;0.5s latency.
            </p>
          </div>


          {/* Video Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative group"
          >
            {/* Outer Container with Animated Border */}
            <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-cyan-500/50 via-blue-500/50 to-emerald-500/50">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 shadow-2xl">

                {/* Corner Brackets */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-400 z-30 rounded-tl-2xl"></div>
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-400 z-30 rounded-tr-2xl"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-emerald-400 z-30 rounded-bl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-emerald-400 z-30 rounded-br-2xl"></div>

                {/* Scanline Effect */}
                <div className="absolute inset-0 pointer-events-none z-20" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, rgba(6, 182, 212, 0.03) 0px, transparent 1px, transparent 2px, rgba(6, 182, 212, 0.03) 3px)'
                }}></div>

                {/* Overlay gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/40 pointer-events-none z-10"></div>

                {/* Pulsing Glow Effect */}
                <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none z-5" style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.15), transparent 70%)'
                }}></div>

                {/* Video */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto relative z-0"
                >
                  <source src="/crowd.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Live Indicator Badge - Enhanced */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-6 left-6 z-30 flex items-center gap-2 px-4 py-2.5 bg-slate-900/95 backdrop-blur-md rounded-xl border-2 border-emerald-500/60 shadow-lg shadow-emerald-500/20"
                >
                  <div className="relative">
                    <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></div>
                  </div>
                  <span className="text-emerald-400 text-sm font-bold tracking-wider">LIVE</span>
                </motion.div>

                {/* Processing Badge - Enhanced */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-6 right-6 z-30 flex items-center gap-2 px-4 py-2.5 bg-slate-900/95 backdrop-blur-md rounded-xl border-2 border-cyan-500/60 shadow-lg shadow-cyan-500/20"
                >
                  <Brain className="text-cyan-400 animate-pulse" size={16} />
                  <span className="text-cyan-400 text-sm font-bold tracking-wider">YOLOv8 ACTIVE</span>
                </motion.div>

                {/* Bottom Info Bar */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="absolute bottom-6 left-6 right-6 z-30 flex items-center justify-between px-5 py-3 bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-700/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Eye className="text-cyan-400" size={16} />
                      <span className="text-white text-sm font-semibold">Real-time Detection</span>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-slate-600 rounded-full"></div>
                      <span className="text-slate-400 text-xs">60 FPS</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                    <Gauge className="text-cyan-400" size={14} />
                    <span className="text-cyan-400 text-xs font-bold">98.4% ACC</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Glow Effect Behind Container */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity -z-10"></div>
          </motion.div>


          {/* Video Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
          >
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-1">240+</div>
              <div className="text-xs text-slate-400 font-semibold">People Detected</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-2xl font-bold text-emerald-400 mb-1">99.2%</div>
              <div className="text-xs text-slate-400 font-semibold">Accuracy Rate</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">&lt;50ms</div>
              <div className="text-xs text-slate-400 font-semibold">Response Time</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-2xl font-bold text-amber-400 mb-1">8</div>
              <div className="text-xs text-slate-400 font-semibold">Active Zones</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Live Analytics Dashboard */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Real-Time <span className="text-cyan-400">Analytics</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Live AI-powered insights and predictive analytics
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Crowd Density Over Time */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800"
            >
              <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <TrendingUp size={20} />
                Crowd Density Trends
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={densityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.5} />
                  <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#020617',
                      border: '1px solid #1f2937',
                      borderRadius: '8px'
                    }}
                  />
                  {/* Removed gradient fill; using solid professional color */}
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fill="#075985"
                    fillOpacity={0.25}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Detection Accuracy */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800"
            >
              <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <Cpu size={20} />
                AI Detection Accuracy
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={detectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.5} />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} domain={[90, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#020617',
                      border: '1px solid #1f2937',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {detectionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Incident Prevention Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800"
            >
              <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <ShieldAlert size={20} />
                Incident Prevention Impact
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={incidentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.5} />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#020617',
                      border: '1px solid #1f2937',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="prevented" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="detected" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Zone Safety Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800"
            >
              <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <Network size={20} />
                Zone Safety Status
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={zoneData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {zoneData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#020617',
                      border: '1px solid #1f2937',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#e5e7eb' }} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Key Features with Icons */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
          >
            Why Choose <span className="text-cyan-400">CrowdPulse AI</span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 cursor-pointer"
              >
                <motion.div
                  className="w-16 h-16 bg-slate-900 border border-slate-700 rounded-2xl flex items-center justify-center mb-6"
                  whileHover={{ scale: 1.05 }}
                >
                  <feature.icon className="text-cyan-400" size={32} />
                </motion.div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{feature.desc}</p>
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                  <CheckCircle size={16} />
                  {feature.benefit}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Heatmap Visualization Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Live <span className="text-cyan-400">Heatmap</span> Visualization
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Real-time density mapping shows crowd concentration and identifies potential risk zones instantly
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Heatmap Demo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative p-8 rounded-2xl bg-slate-900/80 border border-slate-800"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <MapPin className="text-cyan-400" size={24} />
                Density Heatmap
              </h3>

              {/* Heatmap Visual Representation */}
              <div className="relative h-64 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                <div className="absolute inset-0" style={{
                  background: 'radial-gradient(ellipse at 30% 40%, rgba(239, 68, 68, 0.6), transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(251, 191, 36, 0.4), transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(16, 185, 129, 0.3), transparent 50%)'
                }}></div>

                {/* Grid overlay */}
                <div className="absolute inset-0" style={{
                  backgroundImage: 'linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)',
                  backgroundSize: '30px 30px'
                }}></div>

                {/* Markers */}
                <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-lg shadow-amber-500/50"></div>
                <div className="absolute bottom-1/4 left-1/2 w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
              </div>

              {/* Legend */}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm text-slate-400">Critical</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-500 rounded"></div>
                  <span className="text-sm text-slate-400">Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                  <span className="text-sm text-slate-400">Safe</span>
                </div>
              </div>
            </motion.div>

            {/* Crowd Flow Analysis */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold">North Entrance</span>
                  <span className="text-red-400 text-sm font-bold">HIGH RISK</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "85%" }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-red-500 to-red-600"
                  ></motion.div>
                </div>
                <p className="text-slate-400 text-xs mt-2">450 people • 85% capacity</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold">Main Hall</span>
                  <span className="text-amber-400 text-sm font-bold">MODERATE</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "60%" }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600"
                  ></motion.div>
                </div>
                <p className="text-slate-400 text-xs mt-2">320 people • 60% capacity</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold">Exit Area</span>
                  <span className="text-emerald-400 text-sm font-bold">SAFE</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "35%" }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                  ></motion.div>
                </div>
                <p className="text-slate-400 text-xs mt-2">120 people • 35% capacity</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Emotion Detection Showcase */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              AI-Powered <span className="text-cyan-400">Emotion</span> Detection
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Analyze body posture and facial expressions to detect stress, panic, and fatigue in real-time
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {emotionData.map((emotion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${emotion.bgColor}`}>
                  <emotion.icon className={emotion.color} size={32} />
                </div>
                <h3 className="text-white font-bold mb-2">{emotion.name}</h3>
                <div className="text-2xl font-bold text-cyan-400 mb-1">{emotion.percentage}%</div>
                <p className="text-xs text-slate-500">{emotion.count} detected</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stampede Prevention Timeline */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Stampede <span className="text-cyan-400">Prevention</span> System
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Our AI predicts dangerous situations 4-6 minutes before they occur
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-amber-500 to-red-500"></div>

            {/* Timeline Steps */}
            <div className="space-y-12">
              {preventionSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-6 rounded-2xl bg-slate-900/80 border border-slate-800 ${index % 2 === 0 ? 'mr-0' : 'ml-0'}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${step.bgColor}`}>
                          <step.icon className={step.color} size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-white">{step.title}</h3>
                      </div>
                      <p className="text-slate-400 text-sm">{step.description}</p>
                      <div className="mt-3 text-xs text-cyan-400 font-semibold">{step.time}</div>
                    </div>
                  </div>

                  <div className={`w-6 h-6 rounded-full ${step.dotColor} border-4 border-slate-950 z-10`}></div>

                  <div className="flex-1"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Use Cases Gallery */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Trusted Across <span className="text-cyan-400">Multiple</span> Scenarios
            </h2>
            <p className="text-slate-400 text-lg">
              From concerts to religious gatherings, we keep crowds safe
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative p-6 rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden"
              >
                {/* Icon Background */}
                <div className="absolute top-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity">
                  <useCase.icon size={120} className="text-cyan-400" />
                </div>

                <div className="relative z-10">
                  <div className="w-14 h-14 mb-4 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
                    <useCase.icon className="text-cyan-400" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{useCase.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{useCase.description}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Users className="text-cyan-400" size={14} />
                      <span className="text-slate-400">{useCase.capacity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="text-emerald-400" size={14} />
                      <span className="text-slate-400">{useCase.incidents} prevented</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              How <span className="text-cyan-400">It Works</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Simple integration, powerful protection
            </p>
          </div>

          {/* Workflow Steps - Clean Horizontal Design */}
          <div className="max-w-6xl mx-auto">
            {/* Numbers Row with Connecting Lines */}
            <div className="relative" style={{ minHeight: '500px' }}>
              {/* More Curvy Wave - SVG Path */}
              <div className="absolute left-0 right-0 hidden md:block pointer-events-none" style={{ top: '40%' }}>
                <svg
                  className="w-full"
                  viewBox="0 0 1200 200"
                  preserveAspectRatio="none"
                  style={{ height: '200px' }}
                >
                  <path
                    d="M 50 100 Q 200 20, 350 100 Q 500 180, 650 100 Q 800 20, 950 100 Q 1100 180, 1150 100"
                    fill="none"
                    stroke="rgba(6, 182, 212, 0.4)"
                    strokeWidth="3"
                    strokeDasharray="10 10"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Number Circles and Content */}
              <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {workflowSteps.map((step, index) => {
                  const isAbove = index % 2 === 0; // Alternate above/below

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: isAbove ? -30 : 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
                      className="flex flex-col items-center justify-center"
                      style={{
                        marginTop: isAbove ? '0' : '330px',
                        paddingBottom: isAbove ? '170px' : '0'
                      }}
                    >
                      {/* Content Above (if isAbove is true) */}
                      {isAbove && (
                        <div className="flex flex-col items-center  mb-1">
                          {/* Icon */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 + 0.1 }}
                          >
                            <div className="w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                              <step.icon className="text-cyan-400" size={28} />
                            </div>
                          </motion.div>

                          {/* Title */}
                          <motion.h3
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 + 0.2 }}
                            className="text-xl font-bold text-white mb-2 text-center"
                          >
                            {step.title}
                          </motion.h3>

                          {/* Description */}
                          <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 + 0.3 }}
                            className="text-slate-400 text-sm text-center max-w-[200px] mb-3"
                          >
                            {step.description}
                          </motion.p>
                        </div>
                      )}

                      {/* Number Circle - Always in middle */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2, type: "spring", stiffness: 200 }}
                        className="relative z-10"
                      >
                        <div className="w-14 h-14 rounded-full bg-slate-950 border-4 border-cyan-500 flex items-center justify-center shadow-xl shadow-cyan-500/30">
                          <span className="text-xl font-bold text-cyan-400">{index + 1}</span>
                        </div>
                      </motion.div>

                      {/* Content Below (if isAbove is false) */}
                      {!isAbove && (
                        <div className="flex flex-col items-center mt-8">
                          {/* Icon */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 + 0.1 }}
                          >
                            <div className="w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                              <step.icon className="text-cyan-400" size={28} />
                            </div>
                          </motion.div>

                          {/* Title */}
                          <motion.h3
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 + 0.2 }}
                            className="text-xl font-bold text-white mb-2 text-center"
                          >
                            {step.title}
                          </motion.h3>

                          {/* Description */}
                          <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 + 0.3 }}
                            className="text-slate-400 text-sm text-center max-w-[200px]"
                          >
                            {step.description}
                          </motion.p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Live Impact Statistics */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Our <span className="text-cyan-400">Impact</span> in Numbers
            </h2>
            <p className="text-slate-400 text-lg">
              Real results from real deployments worldwide
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring" }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative p-8 rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden group"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/10 group-hover:to-transparent transition-all duration-500"></div>

                <div className="relative z-10">
                  <stat.icon className="text-cyan-400 mb-4 mx-auto" size={40} />
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400 font-semibold">{stat.label}</div>
                  <div className="mt-3 text-xs text-emerald-400">{stat.subtext}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Trust & Testimonials */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Trusted by <span className="text-cyan-400">Industry Leaders</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Securing crowds at the world's largest events
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 relative"
              >
                <div className="absolute top-6 right-6 text-cyan-500/20">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor">
                    <path d="M10 16c0-3.866 3.134-7 7-7v4c-1.657 0-3 1.343-3 3v1h3v7h-7v-8zm16 0c0-3.866 3.134-7 7-7v4c-1.657 0-3 1.343-3 3v1h3v7h-7v-8z" />
                  </svg>
                </div>

                <p className="text-slate-300 mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Enhanced Final CTA */}
      <section className="relative z-10 container mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-center"
        >
          {/* Icon - Simple without pulse */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-8"
          >
            <div className="w-20 h-20 mx-auto bg-cyan-500 rounded-2xl flex items-center justify-center">
              <Shield className="text-white" size={40} />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6 text-white"
          >
            Ready to <span className="text-cyan-400">Transform</span> Safety?
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-xl mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Join leading organizations using CrowdPulse AI for proactive crowd management
          </motion.p>

          {/* Stats Row - Spaced Out */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-12 md:gap-16 mb-12"
          >
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">500K+</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider">Lives Protected</div>
            </div>
            <div className="w-px bg-slate-800 hidden md:block"></div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-emerald-400 mb-2">99.2%</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider">Accuracy</div>
            </div>
            <div className="w-px bg-slate-800 hidden md:block"></div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider">Monitoring</div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-lg rounded-xl transition-colors"
              >
                <span className="flex items-center justify-center gap-3">
                  Get Started Free
                  <ArrowRight size={20} />
                </span>
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 border-2 border-slate-700 hover:border-cyan-500/50 text-white font-bold text-lg rounded-xl hover:bg-slate-900/50 transition-all"
            >
              Schedule Demo
            </motion.button>
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-2 text-sm text-slate-500"
          >
            <CheckCircle className="text-emerald-400" size={16} />
            <span>No credit card required • Free 30-day trial • Cancel anytime</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 bg-slate-950/95 mt-16">
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center">
                <Eye className="text-white" size={16} />
              </div>
              <span className="text-lg font-bold">
                CROWD<span className="text-cyan-400">PULSE</span>
              </span>
            </div>
            <span className="text-slate-500 text-sm">
              © 2024 CrowdPulse AI. All rights reserved.
            </span>
            <div className="flex gap-2 items-center">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 text-sm font-medium">All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AnimatedMetric({ icon: Icon, value, label, color }) {
  const colors = {
    cyan: 'border-cyan-500/30 text-cyan-400',
    amber: 'border-amber-500/30 text-amber-400',
    emerald: 'border-emerald-500/30 text-emerald-400'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className={`p-6 rounded-2xl bg-slate-900/80 border ${colors[color]} transition-all group`}
    >
      <Icon className="mx-auto mb-4 group-hover:scale-110 transition-transform" size={28} />
      <motion.div
        key={value}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-4xl mb-2"
      >
        {value}
      </motion.div>
      <div className="text-sm text-slate-400 font-semibold tracking-wide">{label}</div>
    </motion.div>
  );
}

const features = [
  {
    icon: Eye,
    title: "YOLOv8 Computer Vision",
    desc: "State-of-the-art object detection engine tuned for high-density crowd counting.",
    benefit: "99%+ Accuracy"
  },
  {
    icon: Brain,
    title: "Predictive ML Models",
    desc: "Custom algorithms that analyze velocity and density to forecast stampede risks.",
    benefit: "4-Minute Warning"
  },
  {
    icon: Activity,
    title: "Stress & Panic analysis",
    desc: "Detects erratic movement patterns and sudden velocity changes indicative of panic.",
    benefit: "Real-time Alerts"
  },
  {
    icon: ShieldAlert,
    title: "Instant Intervention",
    desc: "Automated trigger system that notifies security teams via Dashboard and SMS.",
    benefit: "< 1s Response"
  },
  {
    icon: BarChart3,
    title: "Historical Analytics",
    desc: "MongoDB-backed storage for reviewing incident logs and long-term crowd trends.",
    benefit: "Data Persistence"
  },
  {
    icon: Network,
    title: "Scalable Architecture",
    desc: "Built on Next.js and FastAPI to handle multiple camera feeds simultaneously.",
    benefit: "Enterprise Ready"
  }
];

// Emotion Detection Data
const emotionData = [
  { name: "Calm", icon: Users, percentage: 65, count: 156, color: "text-emerald-400", bgColor: "bg-emerald-500/20" },
  { name: "Stressed", icon: AlertTriangle, percentage: 22, count: 53, color: "text-amber-400", bgColor: "bg-amber-500/20" },
  { name: "Panic", icon: Zap, percentage: 8, count: 19, color: "text-red-400", bgColor: "bg-red-500/20" },
  { name: "Fatigued", icon: Activity, percentage: 5, count: 12, color: "text-blue-400", bgColor: "bg-blue-500/20" }
];

// Stampede Prevention Steps
const preventionSteps = [
  {
    icon: Eye,
    title: "Monitoring",
    description: "Continuous surveillance of crowd density and movement patterns using AI-powered cameras",
    time: "T-6 minutes",
    bgColor: "bg-emerald-500/20",
    color: "text-emerald-400",
    dotColor: "bg-emerald-500"
  },
  {
    icon: Brain,
    title: "Analysis",
    description: "Real-time pattern recognition identifies abnormal crowd behavior and density spikes",
    time: "T-4 minutes",
    bgColor: "bg-cyan-500/20",
    color: "text-cyan-400",
    dotColor: "bg-cyan-500"
  },
  {
    icon: AlertTriangle,
    title: "Early Warning",
    description: "Automated alerts sent to security personnel highlighting potential risk zones",
    time: "T-2 minutes",
    bgColor: "bg-amber-500/20",
    color: "text-amber-400",
    dotColor: "bg-amber-500"
  },
  {
    icon: Shield,
    title: "Intervention",
    description: "Security teams redirect crowd flow and implement safety protocols to prevent incidents",
    time: "T-0 minutes",
    bgColor: "bg-red-500/20",
    color: "text-red-400",
    dotColor: "bg-red-500"
  }
];

// Use Cases
const useCases = [
  {
    icon: Radio,
    title: "Concerts & Festivals",
    description: "Monitor large music events with thousands of attendees, ensuring safe crowd flow during performances",
    capacity: "50K+",
    incidents: "127"
  },
  {
    icon: Users,
    title: "Religious Gatherings",
    description: "Manage pilgrimages and religious events where crowd safety is critical during peak hours",
    capacity: "100K+",
    incidents: "89"
  },
  {
    icon: Target,
    title: "Sports Stadiums",
    description: "Track spectator movement in real-time, preventing bottlenecks at entry and exit points",
    capacity: "75K+",
    incidents: "156"
  },
  {
    icon: MapPin,
    title: "Public Transport Hubs",
    description: "Ensure passenger safety at metro stations, airports, and bus terminals during rush hours",
    capacity: "200K+",
    incidents: "243"
  },
  {
    icon: ShieldAlert,
    title: "Shopping Malls",
    description: "Manage crowd density during sales events and holidays, preventing stampedes in retail spaces",
    capacity: "30K+",
    incidents: "67"
  },
  {
    icon: Gauge,
    title: "Convention Centers",
    description: "Monitor trade shows and exhibitions with multiple halls and dynamic crowd patterns",
    capacity: "40K+",
    incidents: "94"
  }
];

// Workflow Steps
const workflowSteps = [
  {
    icon: Eye,
    title: "Input Stream",
    description: "Ingest live feeds from standard CCTV, Drones, or Webcams"
  },
  {
    icon: Cpu,
    title: "Edge AI Inference",
    description: "FastAPI server processes frames using YOLOv8 & Pytorch"
  },
  {
    icon: BarChart3,
    title: "Real-Time Dashboard",
    description: "Visualize live heatmaps, counts, and risks on Next.js UI"
  },
  {
    icon: Bell,
    title: "Incident Response",
    description: "System logs alerts to DB and notifies security instantly"
  }
];

// Impact Statistics
const impactStats = [
  { icon: Users, value: "500K+", label: "Lives Protected", subtext: "Across 250+ events" },
  { icon: TrendingUp, value: "872", label: "Incidents Prevented", subtext: "In the last year" },
  { icon: MapPin, value: "45+", label: "Countries", subtext: "Worldwide deployment" },
  { icon: Gauge, value: "99.8%", label: "Uptime", subtext: "24/7 Reliability" }
];

// Testimonials
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Head of Security, MegaFest",
    quote: "CrowdPulse AI helped us manage over 100,000 attendees safely. The real-time alerts prevented what could have been a major incident during our peak hours."
  },
  {
    name: "Dr. Raj Patel",
    role: "Director, City Stadium",
    quote: "The predictive analytics are game-changing. We can now anticipate crowd surges 5 minutes before they happen and take preventive action immediately."
  },
  {
    name: "Maria Garcia",
    role: "Event Manager, Global Tours",
    quote: "Implementation was seamless, and the dashboard is incredibly intuitive. Our team was up and running within hours, not days."
  }
];

