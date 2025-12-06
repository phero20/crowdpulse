"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Login attempt:', { email, password });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background Grid */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
            `,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-xl">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center">
                                <Eye className="text-cyan-400" size={24} />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">
                                CROWD<span className="text-cyan-400">PULSE</span>
                            </span>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
                    <p className="text-slate-400 text-center mb-8">Sign in to access your dashboard</p>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold mb-2 text-slate-300">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-500"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold mb-2 text-slate-300">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-500"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg"
                        >
                            <LogIn size={20} />
                            Sign In
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-slate-900 text-slate-500">OR</span>
                        </div>
                    </div>

                    {/* Sign Up Linkdd */}
                    <div className="text-center">
                        <p className="text-slate-400 mb-4">Don't have an account?</p>
                        <Link href="/signup">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all border border-slate-700"
                            >
                                <UserPlus size={20} />
                                Create Account
                            </motion.button>
                        </Link>
                    </div>

                    {/* System Status */}
                    <div className="mt-8 flex items-center justify-center gap-3">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-emerald-400 text-xs font-semibold tracking-wider">SYSTEM SECURE</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
