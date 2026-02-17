"use client";

import Image from 'next/image';
import { Users, Code2, Rocket, BrainCircuit } from 'lucide-react';

const TEAM_MEMBERS = [
    {
        name: "Sarah Chen",
        role: "Chief Architect & Founder",
        bio: "Ex-Google DeepMind. Built autonomous trading systems before they were cool. Believes in shipping code, not slide decks.",
        image: "/assets/team/sarah.png"
    },
    {
        name: "Marcus Rodriguez",
        role: "Head of Agentic Engineering",
        bio: "10 years in distributed systems. Scaling AI agents from prototype to production is his obsession.",
        image: "/assets/team/marcus.png"
    },
    {
        name: "Elena Volkov",
        role: "Sales Strategy Lead",
        bio: "A killer closer who learned to code. She bridges the gap between revenue targets and technical reality.",
        image: "/assets/team/elena.png"
    }
];

export default function TeamPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-100">
            {/* Hero Section */}
            <section className="relative py-24 px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-900/10 blur-3xl opacity-50" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/50 border border-blue-800 text-blue-300 text-sm font-medium">
                        <Users className="h-3 w-3" />
                        <span>The Humans Behind the Machines</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                        Practitioners, <span className="text-slate-500">not Theorists.</span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        We don't sell "digital transformation" consulting. We build the autonomous infrastructure
                        that powers the next decade of revenue.
                    </p>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-20 bg-slate-950 border-y border-slate-900">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
                    <div className="space-y-4 p-6 rounded-2xl bg-slate-900/50 hover:bg-slate-900 transition-colors">
                        <div className="bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-blue-400">
                            <Rocket className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Execution Beats Intention</h3>
                        <p className="text-slate-400">
                            Ideas are cheap. Deployment is everything. We measure success by lines of code in production, not PowerPoint slides.
                        </p>
                    </div>
                    <div className="space-y-4 p-6 rounded-2xl bg-slate-900/50 hover:bg-slate-900 transition-colors">
                        <div className="bg-purple-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-purple-400">
                            <Code2 className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Ship Fast, Break Nothing</h3>
                        <p className="text-slate-400">
                            Speed and stability aren't trade-offs. With agentic CI/CD and rigorous testing, we move at startup speed with enterprise reliability.
                        </p>
                    </div>
                    <div className="space-y-4 p-6 rounded-2xl bg-slate-900/50 hover:bg-slate-900 transition-colors">
                        <div className="bg-indigo-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-indigo-400">
                            <BrainCircuit className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Agentic First</h3>
                        <p className="text-slate-400">
                            We use our own tools. Every member of DataFrontier uses agentic workflows to amplify their output by 10x.
                        </p>
                    </div>
                </div>
            </section>

            {/* Team Grid */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-16 text-center">Founding Team</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {TEAM_MEMBERS.map((member) => (
                        <div key={member.name} className="group relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all">
                            <div className="relative h-80 w-full overflow-hidden bg-slate-950">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                                <p className="text-blue-400 text-sm font-medium mb-2">{member.role}</p>
                                <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    {member.bio}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
