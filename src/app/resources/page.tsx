"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { ResourceCard, ResourceProps } from '@/components/resources/ResourceCard';
import { toast } from "sonner";
// standard imports
import { Sparkles, CheckCircle2 } from 'lucide-react';

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
        <div className="min-h-screen bg-[#020617] text-slate-100 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl opacity-30 animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl opacity-30 animate-pulse delay-1000" />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-24">
                {/* Header */}
                <div className="text-center mb-20 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/50 border border-blue-800 text-blue-300 text-sm font-medium mb-4">
                        <Sparkles className="h-3 w-3" />
                        <span>Generic Knowledge is Free. Execution is Gated.</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                        Mission Critical Intelligence
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Access the playbooks defining the future of autonomous revenue.
                        Join 2,500+ revenue leaders building the infrastructure of 2026.
                    </p>
                </div>

                {/* Resource Grid */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {RESOURCES.map((resource) => (
                        <ResourceCard
                            key={resource.id}
                            resource={resource}
                            isVerified={isVerified}
                        />
                    ))}
                </div>

                {/* Social Proof / Footer Note */}
                <div className="mt-24 text-center border-t border-slate-800 pt-12">
                    <p className="text-slate-500 text-sm">
                        TRUSTED BY REVENUE LEADERS AT
                    </p>
                    <div className="flex justify-center gap-8 mt-6 opacity-40 grayscale">
                        {/* Placeholders for logos if we had them */}
                        <div className="h-8 w-24 bg-slate-700 rounded animate-pulse" />
                        <div className="h-8 w-24 bg-slate-700 rounded animate-pulse" />
                        <div className="h-8 w-24 bg-slate-700 rounded animate-pulse" />
                        <div className="h-8 w-24 bg-slate-700 rounded animate-pulse" />
                    </div>
                </div>
            </main>
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
