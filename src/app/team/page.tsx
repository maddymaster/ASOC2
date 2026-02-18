"use client";

import Image from 'next/image';
import { Users, Code2, Rocket, BrainCircuit, Github, Linkedin, Twitter } from 'lucide-react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

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
        <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
            <Header />

            <main className="pt-24">
                {/* Hero Section */}
                <section className="relative py-24 px-6 overflow-hidden">
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-900/10 blur-[120px] opacity-50 rounded-full mix-blend-screen" />
                        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-900/10 blur-[100px] opacity-40 rounded-full mix-blend-screen" />
                    </div>

                    <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 text-sm font-medium shadow-xl">
                            <Users className="h-3 w-3 text-indigo-400" />
                            <span>The Humans Behind the Machines</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
                            Practitioners, <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Not Theorists.</span>
                        </h1>

                        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            We don't sell "digital transformation" consulting. We build the autonomous infrastructure
                            that powers the next decade of revenue.
                        </p>
                    </div>
                </section>

                {/* Philosophy Grid */}
                <section className="py-20 bg-slate-900/30 border-y border-slate-800/50 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
                        <PhilosophyCard
                            icon={<Rocket className="h-6 w-6" />}
                            color="blue"
                            title="Execution Beats Intention"
                            description="Ideas are cheap. Deployment is everything. We measure success by lines of code in production, not PowerPoint slides."
                        />
                        <PhilosophyCard
                            icon={<Code2 className="h-6 w-6" />}
                            color="purple"
                            title="Ship Fast, Break Nothing"
                            description="Speed and stability aren't trade-offs. With agentic CI/CD and rigorous testing, we move at startup speed with enterprise reliability."
                        />
                        <PhilosophyCard
                            icon={<BrainCircuit className="h-6 w-6" />}
                            color="indigo"
                            title="Agentic First"
                            description="We use our own tools. Every member of DataFrontier uses agentic workflows to amplify their output by 10x."
                        />
                    </div>
                </section>

                {/* Team Grid */}
                <section className="py-32 px-6 max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-16 text-center">Founding Team</h2>
                    <div className="grid md:grid-cols-3 gap-10">
                        {TEAM_MEMBERS.map((member) => (
                            <div key={member.name} className="group relative bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-800 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/20">
                                <div className="relative h-96 w-full overflow-hidden bg-slate-950">
                                    {/* Placeholder for actual image if simple path fails */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                                        <Users className="h-20 w-20 text-slate-700 opacity-50" />
                                    </div>
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100 mix-blend-overlay"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                                    <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                                    <p className="text-blue-400 font-medium mb-4">{member.role}</p>
                                    <p className="text-slate-300 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        {member.bio}
                                    </p>
                                    <div className="flex gap-4 mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                                        <SocialIcon icon={<Twitter className="h-4 w-4" />} />
                                        <SocialIcon icon={<Linkedin className="h-4 w-4" />} />
                                        <SocialIcon icon={<Github className="h-4 w-4" />} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function PhilosophyCard({ icon, title, description, color }: any) {
    const colorClasses: any = {
        blue: "bg-blue-900/20 text-blue-400 group-hover:text-blue-300",
        purple: "bg-purple-900/20 text-purple-400 group-hover:text-purple-300",
        indigo: "bg-indigo-900/20 text-indigo-400 group-hover:text-indigo-300",
    };

    return (
        <div className="group space-y-4 p-8 rounded-3xl bg-slate-900/20 border border-slate-800 hover:bg-slate-900/80 hover:border-slate-700 transition-all duration-300">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto transition-colors ${colorClasses[color]}`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-white transition-colors">{title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
                {description}
            </p>
        </div>
    );
}

function SocialIcon({ icon }: any) {
    return (
        <a href="#" className="p-2 rounded-full bg-slate-800 text-slate-400 hover:bg-white hover:text-black transition-colors">
            {icon}
        </a>
    )
}
