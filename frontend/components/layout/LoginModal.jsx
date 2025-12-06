"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Building, Key } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginModal({ isOpen, onClose }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, signup } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        organization: '',
        areaLoginKey: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        let res;
        if (isSignUp) {
            res = await signup(formData);
        } else {
            res = await login(formData.email, formData.password);
        }

        setLoading(false);

        if (res.success) {
            onClose();
            // Reset form
            setFormData({
                name: '',
                email: '',
                password: '',
                organization: '',
                areaLoginKey: ''
            });
        } else {
            setError(res.error || 'Authentication failed');
        }
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setError('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Container */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 w-full max-w-md rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.6)] overflow-hidden relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="p-8">
                                {/* Header */}
                                <div className="mb-8 text-center">
                                    <h2 className="text-2xl font-bold text-white mb-2">
                                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                                    </h2>
                                    <p className="text-slate-400 text-sm">
                                        {isSignUp
                                            ? 'Join CrowdPulse to monitor real-time data.'
                                            : 'Sign in to access your dashboard.'}
                                    </p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-4">

                                    {isSignUp && (
                                        <InputGroup
                                            icon={User}
                                            type="text"
                                            name="name"
                                            placeholder="Full Name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    )}

                                    <InputGroup
                                        icon={Mail}
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />

                                    {isSignUp && (
                                        <InputGroup
                                            icon={Building}
                                            type="text"
                                            name="organization"
                                            placeholder="Organization"
                                            value={formData.organization}
                                            onChange={handleChange}
                                            required
                                        />
                                    )}

                                    <InputGroup
                                        icon={Lock}
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />

                                    {isSignUp && (
                                        <InputGroup
                                            icon={Key}
                                            type="text"
                                            name="areaLoginKey"
                                            placeholder="Area Login Key (Optional)"
                                            value={formData.areaLoginKey}
                                            onChange={handleChange}
                                        />
                                    )}

                                    {/* Error Message */}
                                    {error && (
                                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                                            {error}
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                                    >
                                        {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                                    </button>
                                </form>

                                {/* Footer Toggle */}
                                <div className="mt-6 text-center">
                                    <p className="text-slate-400 text-sm">
                                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                                        <button
                                            onClick={toggleMode}
                                            className="ml-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                                        >
                                            {isSignUp ? 'Sign In' : 'Sign Up'}
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function InputGroup({ icon: Icon, ...props }) {
    return (
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon size={18} className="text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            </div>
            <input
                {...props}
                className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all backdrop-blur-sm hover:bg-black/30"
            />
        </div>
    );
}
