"use client";

import { useMissionControl } from "@/context/MissionControlContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Target, Lightbulb, AlertTriangle, ArrowRight, Clock, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function StrategyCanvas() {
    const { expertAnalysis, setStrategy, resetStrategy, analysisHistory, setExpertAnalysis, setActiveTab, setSelectedSector } = useMissionControl();

    // Empty State: Nordic Noir "No Strategy" view
    if (!expertAnalysis && analysisHistory.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center p-12 border border-dashed border-slate-700/50 rounded-xl bg-slate-900/30 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative z-10 p-4 rounded-full bg-slate-800/50 mb-6 border border-slate-700/50 shadow-xl shadow-blue-500/10">
                    <Lightbulb className="h-10 w-10 text-blue-400 animate-pulse" />
                </div>

                <h3 className="relative z-10 text-2xl font-semibold mb-3 tracking-tight text-slate-100">
                    Awaiting Strategic Analysis
                </h3>

                <p className="relative z-10 text-slate-400 max-w-lg mb-8 text-lg font-light leading-relaxed">
                    Upload your product documentation in the generic "New Campaign" wizard to activate the Expert Agent.
                    We'll identify high-value sectors and tailor your outreach strategy.
                </p>

                <div className="relative z-10 flex gap-4">
                    {/* Retry / Recovery Action */}
                    <Button
                        variant="outline"
                        onClick={resetStrategy}
                        className="border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
                    >
                        Reset System State
                    </Button>
                </div>
            </div>
        );
    }

    const activeAnalysis = expertAnalysis || analysisHistory[0];
    const { summary, sectors } = activeAnalysis;

    const handleApplyStrategy = (sector: any) => {
        setSelectedSector(sector.sector);
        setStrategy({
            industry: sector.sector,
            geo: "Global",
            companySize: "Mid-Market",
            targetRole: sector.targetRoles[0],
            domain: "",
            rationale: sector.rationale
        });
        setActiveTab("lead-gen");
    };

    return (
        <div className="grid grid-cols-12 gap-8 h-full">
            {/* History Sidebar - Glassmorphism */}
            <div className="col-span-12 md:col-span-3 lg:col-span-2 border-r border-slate-800/60 pr-6 flex flex-col gap-6">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">
                    <Clock className="h-4 w-4 text-blue-500" /> History
                </div>
                <ScrollArea className="flex-1 -mr-4 pr-4">
                    <div className="space-y-3">
                        {analysisHistory.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setExpertAnalysis(item)}
                                className={cn(
                                    "w-full text-left p-4 rounded-lg border transition-all duration-200 group relative overflow-hidden",
                                    activeAnalysis.id === item.id
                                        ? "bg-blue-500/10 border-blue-500/30 text-blue-100"
                                        : "border-transparent hover:bg-slate-800/50 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                                )}
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 transition-opacity duration-200"
                                    style={{ opacity: activeAnalysis.id === item.id ? 1 : 0 }} />

                                <div className="font-medium truncate text-sm">{item.fileName || "Unknown PRD"}</div>
                                <div className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : "Just now"}
                                </div>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
                <div className="mt-auto pt-4 border-t border-slate-800/60">
                    <Button variant="outline" size="sm" onClick={resetStrategy}
                        className="w-full gap-2 border-dashed border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50">
                        <Plus className="h-4 w-4" /> New Analysis
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="col-span-12 md:col-span-9 lg:col-span-10 flex flex-col space-y-8 h-full">
                {/* Header Card */}
                <Card className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50 shadow-2xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-6">
                        <div className="space-y-1">
                            <CardTitle className="text-xl flex items-center gap-3 text-white font-semibold tracking-tight">
                                <span className="flex items-center justify-center h-8 w-8 rounded bg-blue-500/20 ring-1 ring-blue-500/50">
                                    <Target className="h-4 w-4 text-blue-400" />
                                </span>
                                {activeAnalysis.id ? `Analysis: ${activeAnalysis.fileName}` : "Strategic Analysis"}
                            </CardTitle>
                            <CardDescription className="text-base text-slate-300/80 leading-relaxed max-w-4xl">
                                {summary}
                            </CardDescription>
                        </div>
                    </CardHeader>
                </Card>

                <ScrollArea className="flex-1 -mx-6 px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                        {sectors.map((sector, idx) => (
                            <Card key={idx} className="flex flex-col h-full group hover:scale-[1.01] transition-all duration-300 bg-slate-900/60 backdrop-blur-sm border-slate-800 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-900/20">
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <Badge variant="outline" className="text-blue-400 border-blue-500/20 bg-blue-500/5 uppercase tracking-widest text-[10px] font-bold px-2 py-0.5">
                                            Sector {idx + 1}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">
                                        {sector.sector}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-6 flex-1 flex flex-col">
                                    {/* Glass Separator */}
                                    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

                                    <section>
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <Lightbulb className="h-3 w-3 text-amber-400" /> Strategic Rationale
                                        </h4>
                                        <p className="text-sm text-slate-300 leading-relaxed">
                                            {sector.rationale}
                                        </p>
                                    </section>

                                    <section>
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <Users className="h-3 w-3 text-indigo-400" /> Decision Makers
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {sector.targetRoles.map((role, rIdx) => (
                                                <Badge key={rIdx} variant="secondary" className="bg-slate-800 text-slate-200 border border-slate-700/50 hover:bg-slate-700 transition-colors">
                                                    {role}
                                                </Badge>
                                            ))}
                                        </div>
                                    </section>

                                    <section>
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <Target className="h-3 w-3 text-emerald-400" /> Outreach Mix
                                        </h4>
                                        <p className="text-sm font-medium text-emerald-400/90 bg-emerald-950/30 px-3 py-1.5 rounded-md border border-emerald-900/50 inline-block">
                                            {sector.strategyMix || "Multi-channel approach recommended."}
                                        </p>
                                    </section>

                                    <section className="flex-1">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <AlertTriangle className="h-3 w-3 text-rose-400" /> Key Pain Points
                                        </h4>
                                        <ul className="text-sm text-slate-400 space-y-1.5">
                                            {sector.painPoints.slice(0, 3).map((pt, pIdx) => (
                                                <li key={pIdx} className="flex items-start gap-2">
                                                    <span className="mt-1.5 h-1 w-1 rounded-full bg-rose-500 flex-shrink-0" />
                                                    <span className="leading-snug">{pt}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </section>

                                    <div className="mt-auto pt-6">
                                        <Button
                                            className="w-full group bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 border border-blue-500/20"
                                            onClick={() => handleApplyStrategy(sector)}
                                        >
                                            <span className="mr-2">Target this Sector</span>
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}

function Users({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}
