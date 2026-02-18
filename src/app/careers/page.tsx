"use client";

import { ArrowRight, Code, Zap, Globe, Cpu, Sparkles, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const OPEN_ROLES = [
    {
        id: "ai-agent-architect",
        title: "AI Agent Architect",
        department: "Engineering",
        location: "Remote / SF",
        description: "The Problem: Current AI agents get stuck in loops. We need you to build a cognitive architecture that allows an agent to realize it's stuck, backtrack, and try a different strategy—in under 500ms.",
        requirements: [
            "Deep experience with LLM orchestration (LangChain, AutoGen, or custom)",
            "Strong backend engineering skills (Python/TypeScript)",
            "Understanding of vector databases and RAG pipelines"
        ]
    },
    {
        id: "full-stack-lead",
        title: "Full-Stack Lead (Next.js/Postgres)",
        department: "Engineering",
        location: "Remote",
        description: "The Problem: We are streaming real-time voice data from thousands of concurrent calls. The dashboard needs to visualize this chaos without melting the browser. Can you optimize React render cycles to the millisecond?",
        requirements: [
            "Expert in Next.js 14+ (App Router, Server Actions)",
            "PostgreSQL & Prisma mastery",
            "Experience with real-time data (WebSockets/SSE)"
        ]
    },
    {
        id: "voice-infra-engineer",
        title: "Voice Infrastructure Engineer",
        department: "Engineering",
        location: "Remote",
        description: "The Problem: Latency kills deals. We need to shave 50ms off our turn-taking logic. You will live at the intersection of SIP, WebRTC, and LLM inference.",
        requirements: [
            "Experience with Twilio, Retell AI, or Vapi",
            "WebRTC knowledge",
            "Low-level audio processing skills are a plus"
        ]
    },
    {
        id: "sales-strategy-lead",
        title: "Sales Strategy Lead",
        department: "Go-To-Market",
        location: "New York / Remote",
        description: "The Problem: AI agents are polite but bad at closing. We need you to teach them 'The Challenger Sale'. You will encode human persuasion techniques into system prompts.",
        requirements: [
            "5+ years in B2B SaaS Sales (Closing role)",
            "Passion for AI and automation",
            "Ability to think systematically about persuasion"
        ]
    }
];

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-purple-500/30">
            <Header />

            <main className="pt-24">
                {/* Hero */}
                <section className="py-24 px-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 relative z-10">
                        Build the Infrastructure
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">of 2026 Today.</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto relative z-10 leading-relaxed">
                        We are rewriting the operating system of revenue.
                        Join the team that is replacing "sales activities" with "agentic outcomes."
                    </p>
                </section>

                {/* Culture Section (Antigravity) */}
                <section className="py-24 bg-slate-900/30 border-y border-slate-800/50 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-20 items-center">
                            <div className="space-y-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium">
                                    <Zap className="h-4 w-4" />
                                    <span>Velocity is our Strategy</span>
                                </div>
                                <h2 className="text-4xl font-bold text-white leading-tight">How We Build: <br />The Antigravity Way</h2>
                                <p className="text-slate-400 text-lg leading-relaxed">
                                    We believe the future of coding is agentic. We don't just build agents for our customers; we use them to build our company.
                                </p>
                                <ul className="space-y-6">
                                    <li className="flex items-start gap-4">
                                        <div className="bg-blue-500/10 p-3 rounded-xl text-blue-400"><Code className="h-6 w-6" /></div>
                                        <div>
                                            <h4 className="font-bold text-white text-lg">10x Developer Velocity</h4>
                                            <p className="text-slate-400 mt-1">We pair with advanced AI coding agents to ship features in hours, not weeks.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="bg-purple-500/10 p-3 rounded-xl text-purple-400"><Cpu className="h-6 w-6" /></div>
                                        <div>
                                            <h4 className="font-bold text-white text-lg">Automate the Boring</h4>
                                            <p className="text-slate-400 mt-1">If it's repetitive, we build an agent for it. Human attention is reserved for high-leverage creativity.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* Visual Placeholder: Agentic Dashboard */}
                            <div className="relative h-[500px] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group hover:border-blue-500/30 transition-all duration-500">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-slate-950/50" />

                                {/* UI Mockup */}
                                <div className="absolute inset-4 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-6 flex flex-col gap-4">
                                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                        <div className="flex gap-2">
                                            <div className="h-3 w-3 rounded-full bg-red-500/50" />
                                            <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                                            <div className="h-3 w-3 rounded-full bg-green-500/50" />
                                        </div>
                                        <div className="text-xs text-slate-500 font-mono">agent_swarm_v2.py</div>
                                    </div>
                                    <div className="flex-1 space-y-3 opacity-70">
                                        <div className="h-4 bg-slate-800 rounded w-3/4 animate-pulse" />
                                        <div className="h-4 bg-slate-800 rounded w-1/2 animate-pulse delay-75" />
                                        <div className="h-4 bg-slate-800 rounded w-5/6 animate-pulse delay-150" />
                                        <div className="h-24 bg-slate-800/50 rounded-lg border border-slate-800/50 mt-4 p-4 font-mono text-xs text-green-400">
                                            &gt; Supervising Agents: 12 Active<br />
                                            &gt; Optimizing Context Windows...<br />
                                            &gt; Deployment Successful.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Open Roles */}
                <section className="py-32 px-6 max-w-4xl mx-auto" id="jobs">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Open Positions</h2>
                        <p className="text-slate-400">Join the team building the future.</p>
                    </div>

                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {OPEN_ROLES.map((role) => (
                            <AccordionItem key={role.id} value={role.id} className="border border-slate-800 rounded-xl bg-slate-900/40 px-6 overflow-hidden data-[state=open]:bg-slate-900 data-[state=open]:border-blue-500/50 data-[state=open]:shadow-xl transition-all duration-300">
                                <AccordionTrigger className="hover:no-underline py-8">
                                    <div className="flex flex-col md:flex-row md:items-center w-full text-left gap-4 md:gap-8 pr-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white mb-1">{role.title}</h3>
                                            <p className="text-sm text-slate-500">{role.department} · {role.location}</p>
                                        </div>
                                        <div className="hidden md:flex items-center gap-2 text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                            View Details <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-8 text-slate-300">
                                    <div className="p-6 bg-slate-950/50 rounded-lg border border-slate-800/50 mb-6">
                                        <p className="text-lg leading-relaxed text-slate-300 font-light">
                                            <span className="font-bold text-white">The Challenge:</span> {role.description.replace("The Problem: ", "")}
                                        </p>
                                    </div>

                                    <div className="mb-8">
                                        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                            <Filter className="h-4 w-4 text-blue-500" />
                                            Requirements
                                        </h4>
                                        <ul className="grid gap-3">
                                            {role.requirements.map((req, i) => (
                                                <li key={i} className="flex items-start gap-3 text-slate-400">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2" />
                                                    {req}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <Button size="lg" className="w-full md:w-auto h-12 px-8 bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-lg shadow-blue-900/20">
                                        Apply for this Role
                                    </Button>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </section>
            </main>

            <Footer />
        </div>
    );
}
