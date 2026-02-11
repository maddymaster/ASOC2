'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Database, ArrowRight, BrainCircuit, XCircle, CheckCircle } from 'lucide-react';

export function GapVisualization() {
    return (
        <section className="py-24 bg-black/50 overflow-hidden relative border-y border-white/10">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">The Operational Gap</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Most sales teams are drowning in disconnected data. MissionControl bridges the gap.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-center">
                    {/* Before: Chaos */}
                    <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-8 relative overflow-hidden group">
                        <div className="absolute -right-12 -top-12 w-32 h-32 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all" />
                        <h3 className="text-xl font-bold text-red-400 mb-6 flex items-center">
                            <XCircle className="w-5 h-5 mr-2" />
                            Broken Pipelines
                        </h3>
                        <ul className="space-y-4 text-red-100/60">
                            {[
                                "Leads lost in spreadsheet silos",
                                "No context for follow-up calls",
                                "Manual data entry errors",
                                "Reactive, slow decision making"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-2 mr-3" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* The Bridge: Mission Control */}
                    <div className="flex flex-col items-center justify-center relative">
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-red-900/0 via-violet-500/50 to-emerald-900/0 -z-10" />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="bg-background border border-violet-500/50 p-6 rounded-2xl shadow-2xl shadow-violet-500/20 flex flex-col items-center text-center max-w-xs"
                        >
                            <div className="h-12 w-12 bg-violet-500/20 rounded-xl flex items-center justify-center mb-4 border border-violet-500/30">
                                <BrainCircuit className="w-6 h-6 text-violet-400" />
                            </div>
                            <h4 className="font-bold text-lg mb-2">ASOC Engine</h4>
                            <p className="text-xs text-muted-foreground">
                                Transforming raw data into agentic actions in real-time.
                            </p>
                            <ArrowRight className="w-5 h-5 text-violet-500 mt-4 animate-pulse" />
                        </motion.div>
                    </div>

                    {/* After: Order */}
                    <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-8 relative overflow-hidden group">
                        <div className="absolute -right-12 -top-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all" />
                        <h3 className="text-xl font-bold text-emerald-400 mb-6 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Automated Intelligence
                        </h3>
                        <ul className="space-y-4 text-emerald-100/60">
                            {[
                                "Unified, real-time customer view",
                                "AI-driven context & mining",
                                "Zero-latency automated outreach",
                                "Proactive strategy shifts"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 mt-2 mr-3" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
