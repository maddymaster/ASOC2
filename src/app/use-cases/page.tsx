"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Download,
    ChevronRight,
    CheckCircle2,
    Clock,
    Zap,
    ShieldCheck,
    TrendingUp,
    Users,
    Building2,
    ArrowRight
} from "lucide-react";
import LeadCaptureModal from "@/components/use-cases/LeadCaptureModal";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

function VerificationToast() {
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get('verified') === 'true') {
            toast.success("Email verified successfully! Downloading whitepaper...", {
                duration: 5000,
            });
            // Auto-trigger download or show success state
            const link = document.createElement('a');
            link.href = '/assets/whitepaper-2026-strategy.pdf';
            link.download = 'DataFrontier_2026_Strategy.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }, [searchParams]);

    return null;
}

export default function UseCasesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const industries = [
        {
            id: "fintech",
            title: "Fintech & Neobanks",
            icon: <ShieldCheck className="h-6 w-6 text-blue-400" />,
            problem: "70% drop-off in KYC applications due to slow manual follow-ups.",
            solution: "Instant, compliant autonomous calls trigger within 30s of sign-up issues.",
            stats: "3.5x Conversion Rate",
            before: ["Manual application review (24-48h)", "Generic 'please wait' emails", "High churn during onboarding"],
            after: ["Instant AI Document Verification Call", "Real-time compliance checks", "Immediate account activation assistance"]
        },
        {
            id: "climate",
            title: "ClimateTech & ESG",
            icon: <Building2 className="h-6 w-6 text-green-400" />,
            problem: "Sales teams waste 20h/week incorrectly qualifying complex ESG leads.",
            solution: "Deep-research agents map regulatory alignment before first contact.",
            stats: "80% Qualification Accuracy",
            before: ["Manual sustainability report reading", "Cold calling generic facility managers", "Low response rates"],
            after: ["Automated regulatory gap analysis", "Precision outreach to Sustainability VPs", "Value-first conversation starters"]
        },
        {
            id: "saas",
            title: "Enterprise SaaS",
            icon: <Zap className="h-6 w-6 text-purple-400" />,
            problem: "Gap between product updates and sales talk-tracks.",
            solution: "Agent Supervisor ingests PRDs instantly to update objection handling.",
            stats: "0-Day Sales Readiness",
            before: ["Sales disconnected from Product", "Outdated pitch decks", "Missed upsell opportunities"],
            after: ["Instant PRD-to-Pitch transformation", "Dynamic feature explanation", "Automated technical deep-dives"]
        },
        {
            id: "healthcare",
            title: "Healthcare AI",
            icon: <Users className="h-6 w-6 text-red-400" />,
            problem: "Overwhelmed front-desk staff missing 40% of inbound patient inquiries.",
            solution: "HIPAA-compliant Voice Receptionist handles FAQ & Scheduling 24/7.",
            stats: "100% Call Answer Rate",
            before: ["Long hold times", "Missed appointments", "Staff burnout"],
            after: ["Zero hold time", "Direct EMR integration", "Complex triage routing"]
        },
        {
            id: "logistics",
            title: "Logistics",
            icon: <Clock className="h-6 w-6 text-orange-400" />,
            problem: "Slow response to spot-market freight quote requests.",
            solution: "Real-time intent monitoring and instant voice quoting.",
            stats: "< 60s Response Time",
            before: ["Email-based quoting lag", "Lost loads to competitors", "Manual carrier vetting"],
            after: ["Instant rate negotiation", "24/7 Dispatch coverage", "Automated load matching"]
        },
        {
            id: "vc",
            title: "Venture Capital",
            icon: <TrendingUp className="h-6 w-6 text-emerald-400" />,
            problem: "Associates spending 90% of time filtering noise, not closing deals.",
            solution: "Autonomous sourcing agents scan GitHub/LinkedIn for growth signals.",
            stats: "10x Deal Flow",
            before: ["Reactive inbound reliance", "Manual LinkedIn scraping", "Missed stealth startups"],
            after: ["Proactive signal detection", "Automated founder outreach", "Pre-qualified deal memos"]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden">
            <Suspense fallback={null}>
                <VerificationToast />
            </Suspense>

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-blue-900/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-full h-[500px] bg-purple-900/10 blur-[120px] pointer-events-none" />

            {/* Navigation Placeholder (if needed, or assume layout handles it) */}
            <div className="container mx-auto px-4 py-8 relative z-10 text-center">
                <Link href="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8 inline-block">
                    ← Back to Home
                </Link>

                <div className="max-w-3xl mx-auto mb-16">
                    <Badge variant="outline" className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1">
                        MISSION CONTROL USE CASES
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-slate-400">
                        Autonomous Agents for <br className="hidden md:block" /> Every High-Stakes Industry
                    </h1>
                    <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                        See how Mission Control transforms manual sales drudgery into
                        autonomous revenue engines across 6 key sectors.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            size="lg"
                            className="h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all w-full sm:w-auto"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Download 2026 Strategy Guide
                        </Button>
                        <Link href="/contact" className="w-full sm:w-auto">
                            <Button size="lg" variant="outline" className="h-12 px-8 border-slate-700 hover:bg-slate-800 text-slate-300 w-full">
                                Book Strategy Call
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Industry Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {industries.map((ind) => (
                        <div key={ind.id} className="group relative bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all hover:bg-slate-900/80">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-slate-800/50 rounded-lg text-blue-400 group-hover:text-blue-300 transition-colors">
                                    {ind.icon}
                                </div>
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                    {ind.stats}
                                </Badge>
                            </div>

                            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-200 transition-colors">{ind.title}</h3>
                            <p className="text-sm text-slate-400 mb-6 h-10">{ind.problem}</p>

                            <div className="space-y-4">
                                <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3">
                                    <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <Clock className="h-3 w-3" /> Manual (Before)
                                    </p>
                                    <ul className="space-y-1.5">
                                        {ind.before.map((item, i) => (
                                            <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                                                <span className="text-red-500/50 mt-0.5">×</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3">
                                    <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <Zap className="h-3 w-3" /> Autonomous (After)
                                    </p>
                                    <ul className="space-y-1.5">
                                        {ind.after.map((item, i) => (
                                            <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                                <CheckCircle2 className="h-3 w-3 text-emerald-500/70 mt-0.5 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-24 mb-16 max-w-4xl mx-auto text-center bg-gradient-to-b from-slate-900/50 to-slate-900 border border-slate-800 rounded-3xl p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] pointer-events-none rounded-full" />

                    <h2 className="text-3xl font-bold text-white mb-4 relative z-10">Ready to automate your revenue engine?</h2>
                    <p className="text-slate-400 mb-8 max-w-2xl mx-auto relative z-10">
                        Join the forward-thinking teams reclaiming 80% of their sales time with DataFrontier Mission Control.
                    </p>
                    <div className="relative z-10">
                        <Button
                            size="lg"
                            className="h-14 px-8 bg-white text-slate-900 hover:bg-slate-100 font-semibold text-lg"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Get the Playbook
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            <LeadCaptureModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
