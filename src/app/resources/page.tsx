"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { ResourceCard, ResourceProps } from '@/components/resources/ResourceCard';
import { toast } from "sonner";
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Mock Data for Resources
const RESOURCES: ResourceProps[] = [
    {
        id: 'agentic-sdr-2026',
        title: 'The 2026 State of Agentic SDRs',
        description: 'A comprehensive analysis of how autonomous agents are reclaiming 80% of sales time, reshaping the SDR role from grinder to orchestrator.',
        thumbnailUrl: '/assets/thumbnails/agentic-sdr.png',
        pdfUrl: '/assets/documents/The_2026_State_of_Agentic_SDRs.pdf',
    },
    {
        id: 'gap-execution-playbook',
        title: 'Closing the Gap: The DataFrontier Execution Playbook',
        description: 'Practical strategies for implementing autonomous revenue infrastructure today. Learn how to bridge the gap between AI hype and revenue reality.',
        thumbnailUrl: '/assets/thumbnails/execution-playbook.png',
        pdfUrl: '/assets/documents/Closing_the_Gap_Execution_Playbook.pdf',
    },
    {
        id: 'seed-to-series-a',
        title: 'Scaling from Seed to Series A: The Automated Outbound Playbook',
        description: 'How to replace your first 5 sales hires with 1 engineer and an army of agents. A guide for technical founders.',
        thumbnailUrl: '/assets/thumbnails/seed-series-a.png',
        pdfUrl: '/assets/documents/Seed_to_Series_A_Playbook.pdf',
    },
    {
        id: 'high-ticket-services',
        title: 'High-Ticket Service Sales: Booking 50+ Meetings/Week',
        description: 'For agencies and consultancies: How finding "Needle in a Haystack" clients becomes trivial with AI-driven signal detection.',
        thumbnailUrl: '/assets/thumbnails/high-ticket-service.png',
        pdfUrl: '/assets/documents/High_Ticket_Service_Sales.pdf',
    },
    {
        id: 'dev-shop-growth',
        title: 'The Dev Shop Growth Engine: Finding Enterprise Clients',
        description: 'Stop relying on referrals. How top tier dev shops use agentic SDRs to penetrate the Fortune 500.',
        thumbnailUrl: '/assets/thumbnails/dev-shop-growth.png',
        pdfUrl: '/assets/documents/Dev_Shop_Growth_Engine.pdf',
    },
    {
        id: 'clinical-trials',
        title: 'Accelerating Clinical Trials: Patient Recruitment via Agents',
        description: 'Case Study: How a violently complex sales cycle (healthcare providers) was shortened by 40% using empathetic AI voice agents.',
        thumbnailUrl: '/assets/thumbnails/clinical-trials.png',
        pdfUrl: '/assets/documents/Accelerating_Clinical_Trials.pdf',
    },
    {
        id: 'fraud-detection-sales',
        title: 'Selling Trust: Automating Enterprise Fraud Detection Sales',
        description: 'Selling to CISOs is hard. See how hyper-personalized, research-backed outreach broke through the noise for a Series B Fintech.',
        thumbnailUrl: '/assets/thumbnails/fraud-detection.png',
        pdfUrl: '/assets/documents/Selling_Trust_Fintech.pdf',
    },
    {
        id: 'logistics-saas',
        title: 'Supply Chain Optimization: Breaking into Legacy Markets',
        description: 'Case Study: Selling modern SaaS to old-school logistics companies. How voice agents handled phone-heavy industries at scale.',
        thumbnailUrl: '/assets/thumbnails/logistics-saas.png',
        pdfUrl: '/assets/documents/Supply_Chain_Optimization.pdf',
    }
];

function ResourcesContent() {
    const searchParams = useSearchParams();
    const verifiedParam = searchParams.get('verified');
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        if (verifiedParam === 'true') {
            setIsVerified(true);
            toast.success("Email verified! You can now download the whitepapers.", {
                icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
            });
            // Optional: Store in localStorage to persist verification across reloads
            localStorage.setItem('mission_control_verified', 'true');
        } else {
            // Check localStorage
            const stored = localStorage.getItem('mission_control_verified');
            if (stored === 'true') setIsVerified(true);
        }
    }, [verifiedParam]);

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
            <Header />

            <main className="pt-32 pb-24 container mx-auto px-6 relative z-10">
                {/* Background Effects (Subtler Global Style) */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />

                {/* Header */}
                <div className="text-center mb-20 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/50 border border-blue-800 text-blue-300 text-sm font-medium mb-4">
                        <Sparkles className="h-3 w-3" />
                        <span>Generic Knowledge is Free. Execution is Gated.</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
                        Mission Critical <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Intelligence</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Access the playbooks defining the future of autonomous revenue.
                        Join 2,500+ revenue leaders building the infrastructure of 2026.
                    </p>
                </div>

                {/* Resource Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {RESOURCES.map((resource) => (
                        <ResourceCard
                            key={resource.id}
                            resource={resource}
                            isVerified={isVerified}
                        />
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function ResourcesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Loading resources...</div>}>
            <ResourcesContent />
        </Suspense>
    );
}
