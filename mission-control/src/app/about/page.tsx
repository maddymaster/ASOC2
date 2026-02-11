'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Zap, LayoutGrid, Users, ShieldCheck, Target, TrendingUp, Cpu } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-violet-500/30">
            {/* Navbar overlay (reused for consistency) */}
            {/* 1. The Why - Origin Story */}
            <section className="pt-48 pb-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-900/10 rounded-full blur-[120px] -z-10" />
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8">
                                Born out of necessity, <br />
                                <span className="text-gray-500">not theory.</span>
                            </h1>
                            <div className="text-xl md:text-2xl text-gray-300 leading-relaxed space-y-8 max-w-3xl">
                                <p>
                                    DataFrontier wasn't founded in a classroom. It was forged in the fires of high-stakes environments:
                                    <span className="text-white font-semibold"> Climate Intelligence</span>,
                                    <span className="text-white font-semibold"> Healthcare AI</span>, and
                                    <span className="text-white font-semibold"> Enterprise Analytics</span>.
                                </p>
                                <p>
                                    We saw the same pattern everywhere: incredible data, broken pipelines, and paralyzed decision-making.
                                    We built MissionControl to be the operating system we always wished we had.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. The 4 Pillars - Interactive Cards */}
            <section className="py-24 bg-neutral-950 border-y border-white/5">
                <div className="container mx-auto px-6">
                    <div className="mb-16">
                        <h2 className="text-sm font-semibold text-violet-400 uppercase tracking-widest mb-2">Our Philosophy</h2>
                        <h3 className="text-3xl font-display font-bold">The 4 Pillars of DataFrontier</h3>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <PillarCard
                            icon={<Zap className="w-6 h-6" />}
                            title="Execution beats intention"
                            description="Strategy is useless without shipping. We prioritize operational velocity over perfect planning."
                            color="text-amber-400"
                            bg="bg-amber-950/20"
                            border="group-hover:border-amber-500/50"
                        />
                        <PillarCard
                            icon={<LayoutGrid className="w-6 h-6" />}
                            title="Data is a product"
                            description="Internal data should be treated with the same rigor as user-facing features. Clean, documented, and reliable."
                            color="text-blue-400"
                            bg="bg-blue-950/20"
                            border="group-hover:border-blue-500/50"
                        />
                        <PillarCard
                            icon={<Target className="w-6 h-6" />}
                            title="Simplicity scales"
                            description="Complexity is the enemy of execution. We ruthlessly simplify workflows to ensure adoption."
                            color="text-emerald-400"
                            bg="bg-emerald-950/20"
                            border="group-hover:border-emerald-500/50"
                        />
                        <PillarCard
                            icon={<Cpu className="w-6 h-6" />}
                            title="AI reduces load"
                            description="AI shouldn't add noise. It should subtract work. If it doesn't save time, we don't build it."
                            color="text-violet-400"
                            bg="bg-violet-950/20"
                            border="group-hover:border-violet-500/50"
                        />
                    </div>
                </div>
            </section>

            {/* 3. Operating Model - How We Work */}
            <section className="py-24 relative">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">How We Work</h2>
                            <p className="text-gray-400 text-lg mb-8">
                                We don't just hand over a login and walk away. We embed with your team to ensure the "Intelligence" actually leads to "Operations".
                            </p>

                            <div className="space-y-6">
                                <ModelItem
                                    title="Embedded Teams"
                                    desc="We integrate directly into your Slack and Jira. We aren't a vendor; we're a forward-deployed engineering unit."
                                />
                                <ModelItem
                                    title="Sprint-Based Delivery"
                                    desc="No 6-month waterfall projects. We ship value in 2-week sprints, iterating on real feedback from your sales floor."
                                />
                                <ModelItem
                                    title="Replacement Guarantees"
                                    desc="If a feature or agent doesn't perform, we replace it. Our incentives are aligned with your revenue, not your usage metrics."
                                />
                            </div>
                        </div>
                        <div className="relative">
                            {/* Visual representation of 'Embedded' */}
                            <div className="aspect-square rounded-2xl bg-neutral-900 border border-white/10 p-8 relative overflow-hidden flex flex-col justify-center">
                                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                                <div className="flex items-center gap-4 mb-4 opacity-50">
                                    <div className="w-12 h-12 rounded-full bg-gray-800" />
                                    <div className="h-4 w-32 bg-gray-800 rounded" />
                                </div>
                                <div className="flex items-center gap-4 mb-4 pl-8">
                                    <div className="w-12 h-12 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold">DF</div>
                                    <div className="bg-violet-900/30 border border-violet-500/30 p-3 rounded-lg text-sm text-violet-200">
                                        Optimization deployed to prod. Pipeline velocity up 15%.
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 opacity-50">
                                    <div className="w-12 h-12 rounded-full bg-gray-800" />
                                    <div className="h-4 w-24 bg-gray-800 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. The Frontier Concept - Cinematic Outro */}
            <section className="py-32 bg-black relative border-t border-white/10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/5 rounded-full blur-[150px] pointer-events-none" />

                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6">The Concept</h2>
                    <h3 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-tight">
                        Why "DataFrontier"?
                    </h3>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        The "Frontier" is the edge between the known and the unknown.
                        It's where unstructured chaos meets operational order.
                        <br /><br />
                        We live on that line. We push it forward so you can build behind it.
                    </p>

                    <div className="mt-16">
                        <Link href="/dashboard" className="px-10 py-5 rounded-full bg-white text-black font-bold text-lg hover:bg-gray-200 transition-all hover:scale-105 inline-flex items-center gap-2">
                            Deploy to the Frontier
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

function PillarCard({ icon, title, description, color, bg, border }: any) {
    return (
        <div className={`p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-neutral-900 transition-all duration-300 group ${border}`}>
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-6 transition-colors ${bg} ${color}`}>
                {icon}
            </div>
            <h4 className={`text-xl font-bold mb-3 group-hover:text-white transition-colors`}>{title}</h4>
            <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
    );
}

function ModelItem({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="flex gap-4">
            <div className="mt-1 h-6 w-6 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-violet-400" />
            </div>
            <div>
                <h4 className="font-bold text-lg mb-1">{title}</h4>
                <p className="text-gray-400 text-sm">{desc}</p>
            </div>
        </div>
    );
}
