"use client";

import { ArrowRight, Code, Zap, Globe, Cpu } from 'lucide-react';
import { Button } from "@/components/ui/button";
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
        description: "Design the cognitive architecture for autonomous SDRs. You will build state machines, memory systems, and tool interfaces that allow LLMs to execute complex sales workflows.",
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
        description: "Own the Mission Control dashboard. You will build high-performance, real-time interfaces that give humans visibility and control over their agent workforce.",
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
        description: "Build the ears and voice of our agents. You will optimize latency, handle interruptions, and ensure natural turn-taking using telephony APIs.",
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
        description: "Teach our agents how to sell. You will codify top-tier sales methodologies (Sandler, Challenger) into prompt templates and conversation flows.",
        requirements: [
            "5+ years in B2B SaaS Sales (Closing role)",
            "Passion for AI and automation",
            "Ability to think systematically about persuasion"
        ]
    }
];

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-100">
            {/* Hero */}
            <section className="py-24 px-6 text-center">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                    Build the Infrastructure
                    <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">of 2026 Today.</span>
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                    We are rewriting the operating system of revenue.
                    Join the team that is replacing "sales activities" with "agentic outcomes."
                </p>
            </section>

            {/* How We Build (Culture) */}
            <section className="py-20 bg-slate-950/50 border-y border-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/50 border border-indigo-800 text-indigo-300 text-sm font-medium">
                                <Zap className="h-3 w-3" />
                                <span>Velocity is our Strategy</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white">How We Build: Antigravity</h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                We believe the future of coding is agentic. We don't just build agents for our customers; we use them to build our company.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="bg-blue-900/20 p-2 rounded-lg text-blue-400 mt-1"><Code className="h-5 w-5" /></div>
                                    <div>
                                        <h4 className="font-semibold text-white">10x Developer Velocity</h4>
                                        <p className="text-sm text-slate-400">We pair with advanced AI coding agents to ship features in hours, not weeks.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="bg-purple-900/20 p-2 rounded-lg text-purple-400 mt-1"><Cpu className="h-5 w-5" /></div>
                                    <div>
                                        <h4 className="font-semibold text-white">Automate the Boring</h4>
                                        <p className="text-sm text-slate-400">If it's repetitive, we build an agent for it. Human attention is reserved for high-leverage creativity.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        {/* Visual Placeholder */}
                        <div className="relative h-96 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center group hover:border-blue-700 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-950/50" />
                            <div className="text-center space-y-4 z-10">
                                <Globe className="h-16 w-16 text-slate-700 mx-auto group-hover:text-blue-500 transition-colors duration-500" />
                                <p className="text-slate-500 font-mono text-sm">[ Agentic Workflow Visualization ]</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Open Roles */}
            <section className="py-24 px-6 max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-12 text-center">Open Positions</h2>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    {OPEN_ROLES.map((role) => (
                        <AccordionItem key={role.id} value={role.id} className="border border-slate-800 rounded-lg bg-slate-900/50 px-4 overflow-hidden data-[state=open]:bg-slate-900 data-[state=open]:border-blue-900/50 transition-all">
                            <AccordionTrigger className="hover:no-underline py-6">
                                <div className="flex flex-col md:flex-row md:items-center w-full text-left gap-2 md:gap-6">
                                    <span className="text-xl font-semibold text-white">{role.title}</span>
                                    <div className="flex gap-3 text-sm">
                                        <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">{role.department}</span>
                                        <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">{role.location}</span>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-6 text-slate-400">
                                <p className="mb-4 text-base">{role.description}</p>
                                <div className="mb-6">
                                    <h4 className="font-semibold text-slate-200 mb-2">Requirements:</h4>
                                    <ul className="list-disc pl-5 space-y-1">
                                        {role.requirements.map((req, i) => (
                                            <li key={i}>{req}</li>
                                        ))}
                                    </ul>
                                </div>
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>
        </div>
    );
}
