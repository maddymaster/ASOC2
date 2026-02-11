'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal, Code2, Users, Briefcase, ChevronRight, Hammer, Flame, Shield } from 'lucide-react';

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-violet-500/30">
            {/* Navbar overlay */}
            {/* 1. Culture Statement - Hero */}
            <section className="pt-48 pb-24 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-red-900/10 rounded-full blur-[120px] -z-10" />
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-medium mb-8 uppercase tracking-widest">
                            <Flame className="w-3 h-3" />
                            No Slideware Allowed
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8">
                            We hire for execution, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                                not intention.
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12">
                            We are a team of system builders, not black-box vendors.
                            If you prefer polishing pitch decks over shipping production code,
                            <span className="text-white italic"> this is not the place for you.</span>
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 2. Open Roles */}
            <section className="py-24 bg-neutral-950 border-y border-white/5">
                <div className="container mx-auto px-6">
                    <div className="mb-16 flex items-end justify-between">
                        <div>
                            <h2 className="text-sm font-semibold text-violet-400 uppercase tracking-widest mb-2">Join the Frontier</h2>
                            <h3 className="text-3xl font-display font-bold">Open Positions</h3>
                        </div>
                        <Link href="#" className="hidden md:flex items-center text-sm text-gray-400 hover:text-white">
                            View all 12 roles <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </div>

                    <div className="grid gap-4">
                        <JobCard
                            title="AI Engineer (Agentic Workflows)"
                            dept="Engineering"
                            type="Remote / SF"
                            desc="Build the brain of MissionControl. Design autonomous agents that can navigate complex sales objections and CRM architectures."
                            icon={<Terminal className="w-5 h-5 text-violet-400" />}
                        />
                        <JobCard
                            title="Data Platform Architect"
                            dept="Infrastructure"
                            type="New York"
                            desc="Scale our real-time ingestion engine. You'll worry about millisecond latency and data consistency across millions of events."
                            icon={<Code2 className="w-5 h-5 text-blue-400" />}
                        />
                        <JobCard
                            title="Sales Development Rep (Human-AI Hybrid)"
                            dept="GTM"
                            type="Remote"
                            desc="The hardest SDR job you'll ever love. You won't just dial; you'll pilot a fleet of AI agents and close the deals they unearth."
                            icon={<Users className="w-5 h-5 text-emerald-400" />}
                        />
                    </div>
                </div>
            </section>

            {/* 3. The Team - Grid Layout */}
            <section className="py-24 relative">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mb-16">
                        <h2 className="text-3xl font-display font-bold mb-6">The Practitioners</h2>
                        <p className="text-gray-400 text-lg">
                            We don't have "Managers" who just manage. Everyone at DataFrontier builds, breaks, fixes, and scales real systems.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <TeamCard
                            name="Sarah Chen"
                            role="Founder & CEO"
                            bio="Ex-CTO of ClimateScale. Built data pipelines processing 50PB of satellite imagery. Obsessed with operational efficiency."
                        />
                        <TeamCard
                            name="David Ross"
                            role="Head of AI"
                            bio="15 years in Healthcare AI. Shipped models that diagnose rare diseases. Now turning that precision to revenue operations."
                        />
                        <TeamCard
                            name="Elena Rodriguez"
                            role="Head of Customer Ops"
                            bio="Started as a Support Rep, became VP of Ops. Knows exactly where the bodies are buried in enterprise CRM implementations."
                        />
                        <TeamCard
                            name="Marcus Thorne"
                            role="Founding Engineer"
                            bio="Rust evangelist. Rewrote our entire ingestion layer over a weekend because 'it felt sluggish'. It was 10x faster."
                        />
                        <TeamCard
                            name="You?"
                            role="Future Builder"
                            bio="Ready to get your hands dirty? We're looking for builders who want to define the future of agentic sales."
                            highlight={true}
                        />
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-20 border-t border-white/10 bg-black text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-2xl font-bold mb-8">Ready to build?</h2>
                    <Link href="mailto:careers@datafrontier.com" className="px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors inline-block">
                        Apply Now
                    </Link>
                </div>
            </section>
        </div>
    );
}

function JobCard({ title, dept, type, desc, icon }: any) {
    return (
        <div className="group p-6 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-violet-500/30 transition-all cursor-pointer flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="h-12 w-12 rounded-lg bg-black border border-white/10 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div className="flex-1">
                <div className="flex flex-wrap gap-3 items-center mb-2">
                    <h4 className="text-lg font-bold group-hover:text-violet-400 transition-colors">{title}</h4>
                    <span className="text-xs px-2 py-1 rounded bg-white/10 text-gray-300">{dept}</span>
                    <span className="text-xs px-2 py-1 rounded bg-white/10 text-gray-300">{type}</span>
                </div>
                <p className="text-gray-400 text-sm max-w-2xl">{desc}</p>
            </div>
            <div className="hidden md:block">
                <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <ChevronRight className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
}

function TeamCard({ name, role, bio, highlight }: any) {
    return (
        <div className={`p-8 rounded-2xl border ${highlight ? 'border-dashed border-violet-500/50 bg-violet-900/10' : 'border-white/10 bg-neutral-900/50'} flex flex-col h-full relative group overflow-hidden`}>
            {!highlight && <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/10 transition-all" />}

            <div className="mb-6">
                <div className={`h-16 w-16 rounded-xl ${highlight ? 'bg-violet-500/20' : 'bg-white/10'} flex items-center justify-center mb-4`}>
                    {highlight ? <Briefcase className="w-6 h-6 text-violet-400" /> : <span className="font-display font-bold text-xl">{name.charAt(0)}</span>}
                </div>
                <h4 className="text-xl font-bold">{name}</h4>
                <p className={`text-sm ${highlight ? 'text-violet-300' : 'text-gray-400'} font-medium`}>{role}</p>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mt-auto border-t border-white/5 pt-4">
                {bio}
            </p>
        </div>
    );
}
