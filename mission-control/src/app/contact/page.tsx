'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, ArrowRight } from 'lucide-react';

export default function ContactPage() {
    const [path, setPath] = useState<'demo' | 'team' | null>(null);
    const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

    // Audit Logging Simulator
    const logAudit = (action: string, metadata: any) => {
        console.log(`[AUDIT] ${action}`, metadata);
        // In a real app, this would POST to /api/audit
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('submitting');
        logAudit('contact_form_submission_attempt', { path });

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Create a dummy lead in the system (Verified via dashboard later)
        // Here we just simulate success for the UI
        setFormState('success');
        logAudit('contact_form_submission_success', { path });
    };

    return (
        <div className="min-h-screen bg-black pt-32 pb-24 relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-violet-900/10 rounded-full blur-[120px] -z-10" />

            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-display font-bold mb-6">Make Contact</h1>
                    <p className="text-xl text-gray-400">
                        Choose your path. Do you need the tool, or the team?
                    </p>
                </div>

                {formState === 'success' ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-neutral-900 border border-emerald-500/30 p-12 rounded-2xl text-center"
                    >
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Transmission Received</h2>
                        <p className="text-gray-400">Our agents are analyzing your request. Expect a reply within 28 minutes.</p>
                    </motion.div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Path Selection */}
                        <div className="space-y-4">
                            <PathCard
                                active={path === 'demo'}
                                onClick={() => setPath('demo')}
                                title="Deploy MissionControl"
                                desc="I want access to the AI platform to run my own campaigns."
                            />

                            <PathCard
                                active={path === 'team'}
                                onClick={() => setPath('team')}
                                title="Engage DataFrontier"
                                desc="I need an embedded team of engineers to build my sales machine."
                            />
                        </div>

                        {/* Form */}
                        <div className={`bg-neutral-900/50 border border-white/10 p-8 rounded-2xl transition-opacity duration-300 ${!path ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
                            <h3 className="text-lg font-bold mb-6">
                                {path === 'demo' ? 'Request Access' : path === 'team' ? 'Project Brief' : 'Select a path first'}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Work Email</label>
                                    <input required type="email" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors" placeholder="name@company.com" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">First Name</label>
                                        <input required type="text" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Company</label>
                                        <input required type="text" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors" />
                                    </div>
                                </div>

                                {path === 'team' && (
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Budget Range</label>
                                        <select className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors">
                                            <option>$10k - $25k / mo</option>
                                            <option>$25k - $50k / mo</option>
                                            <option>$50k+ / mo</option>
                                        </select>
                                    </div>
                                )}

                                <button
                                    disabled={formState === 'submitting'}
                                    className="w-full bg-white text-black font-bold h-12 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 mt-4"
                                >
                                    {formState === 'submitting' ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Initiate <ArrowRight className="w-4 h-4" /></>}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function PathCard({ active, onClick, title, desc }: any) {
    return (
        <div
            onClick={onClick}
            className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 ${active
                    ? 'bg-violet-900/20 border-violet-500/50 shadow-[0_0_30px_rgba(139,92,246,0.1)]'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className={`font-bold text-lg ${active ? 'text-violet-300' : 'text-white'}`}>{title}</h4>
                {active && <div className="w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
            </div>
            <p className="text-sm text-gray-400">{desc}</p>
        </div>
    );
}
