"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, LogIn, Menu, X, LogOut, LayoutDashboard, User } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import LoginModal from './LoginModal';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const { user, logout } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Check for login query param to auto-open modal
    useEffect(() => {
        const loginParam = searchParams.get('login');
        if (loginParam === 'true') {
            setIsLoginModalOpen(true);
            // Optional: Clean up the URL
            // router.replace('/', { scroll: false });
        }
    }, [searchParams]);

    const handleDashboardClick = (e) => {
        if (!user) {
            e.preventDefault();
            setIsLoginModalOpen(true);
        }
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                    type: "spring",
                    stiffness: 100
                }}
                className="sticky top-3 z-50 bg-slate-950/70 backdrop-blur-xl border border-slate-800/50 mx-4 mt-4 rounded-2xl shadow-lg shadow-black/20"
            >
                <div className="container mx-auto px-4 md:px-6 py-6">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <Link href="/">
                            <div className="flex items-center gap-3 cursor-pointer">
                                <motion.div
                                    className="w-10 h-10 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Eye className="text-white" size={20} />
                                </motion.div>
                                <span className="text-lg md:text-xl font-bold tracking-tight">
                                    CROWD<span className="text-cyan-400">PULSE</span>
                                    <span className="text-xs text-slate-500 font-normal ml-2">AI</span>
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex items-center gap-4">
                            {/* Dashboard Button */}
                            {user ? (
                                <Link href="/dashboard">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-5 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-semibold text-sm rounded-lg transition-all flex items-center gap-2"
                                    >
                                        <LayoutDashboard size={16} />
                                        Dashboard
                                    </motion.button>
                                </Link>
                            ) : (
                                <motion.button
                                    onClick={() => setIsLoginModalOpen(true)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-5 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-sm rounded-lg transition-all"
                                >
                                    Dashboard
                                </motion.button>
                            )}

                            {/* Auth Button */}
                            {user ? (
                                <motion.button
                                    onClick={logout}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-5 py-2 bg-slate-900 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/50 text-slate-300 hover:text-red-400 font-semibold text-sm rounded-lg flex items-center gap-2 transition-all"
                                >
                                    <LogOut size={16} />
                                    Disconnect
                                </motion.button>
                            ) : (
                                <motion.button
                                    onClick={() => setIsLoginModalOpen(true)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm rounded-lg flex items-center gap-2 transition-all"
                                >
                                    <LogIn size={16} />
                                    Login
                                </motion.button>
                            )}

                            {/* System Status */}
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 rounded-lg border border-emerald-500/40">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                <span className="text-emerald-400 text-xs font-semibold tracking-wider">SYSTEM ONLINE</span>
                            </div>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleMenu}
                            className="md:hidden p-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </motion.button>
                    </div>

                    {/* Mobile Navigation Menu */}
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="md:hidden overflow-hidden"
                            >
                                <div className="pb-2 space-y-3 flex flex-col gap-3  border-t border-slate-800 mt-4 pt-8">
                                    {/* Dashboard Button - Mobile */}
                                    <button
                                        onClick={() => {
                                            if (user) {
                                                router.push('/dashboard');
                                            } else {
                                                setIsLoginModalOpen(true);
                                            }
                                            toggleMenu();
                                        }}
                                        className={`w-full px-5 py-3 border font-semibold text-sm rounded-lg transition-all text-left flex items-center gap-2 ${user ? 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-400' : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700 text-slate-300'}`}
                                    >
                                        <LayoutDashboard size={16} />
                                        Dashboard
                                    </button>

                                    {/* Login/Logout Button - Mobile */}
                                    {user ? (
                                        <button
                                            onClick={() => {
                                                logout();
                                                toggleMenu();
                                            }}
                                            className="w-full px-5 py-3 bg-slate-900 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/50 text-slate-300 hover:text-red-400 font-semibold text-sm rounded-lg flex items-center gap-2 transition-all"
                                        >
                                            <LogOut size={16} />
                                            Disconnect
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setIsLoginModalOpen(true);
                                                toggleMenu();
                                            }}
                                            className="w-full px-5 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm rounded-lg flex items-center gap-2 transition-all"
                                        >
                                            <LogIn size={16} />
                                            Login
                                        </button>
                                    )}

                                    {/* System Status - Mobile */}
                                    <div className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900/80 rounded-lg border border-emerald-500/40">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                        <span className="text-emerald-400 text-xs font-semibold tracking-wider">SYSTEM ONLINE</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.nav>

            {/* Login Modal */}
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        </>
    );
}
