"use client";

import { useMissionControl } from "@/context/MissionControlContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Target, Lightbulb, AlertTriangle, ArrowRight, Clock, Plus, ChevronDown, ChevronUp, Cpu, Sparkles, Activity } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function StrategyCanvas() {
    const {
        expertAnalysis,
        resetStrategy,
        analysisHistory,
        setExpertAnalysis,
        setStrategy,
        setActiveTab,
        setSelectedSector,
        agentStatus,
        setAgentStatus,
        addActivityEvent
    } = useMissionControl();

    const [expandedSectors, setExpandedSectors] = useState<Set<number>>(new Set());
    const [sectorAgentStatus, setSectorAgentStatus] = useState<Map<number, 'idle' | 'analyzing' | 'ready'>>(new Map());

    const activeAnalysis = expertAnalysis || analysisHistory[0];

    if (!activeAnalysis) {
        return (
            <div className="flex items-center justify-center h-full">
                <Card className="w-full max-w-2xl mx-auto bg-slate-900/40 backdrop-blur-md border border-slate-700/50 shadow-2xl">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-6">
                        <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-500/10 ring-4 ring-blue-500/20">
                            <Target className="h-10 w-10 text-blue-400 animate-pulse" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-xl font-bold text-white tracking-tight">Awaiting Strategic Analysis</h3>
                            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                                No Strategy Analyzed Yet. Upload a PRD or product description to identify target sectors and deploy AI agents.
                            </p>
                        </div>
                        <Button onClick={resetStrategy} variant="outline" size="lg" className="gap-2 border-blue-500/30 hover:bg-blue-500/10 hover:border-blue-400 text-blue-300">
                            <Plus className="h-4 w-4" /> Start New Analysis
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const { summary, sectors } = activeAnalysis;

    const toggleSectorExpansion = (idx: number) => {
        setExpandedSectors(prev => {
            const newSet = new Set(prev);
            if (newSet.has(idx)) {
                newSet.delete(idx);
            } else {
                newSet.add(idx);
            }
            return newSet;
        });
    };

    const handleDeployAgent = (sector: any, idx: number) => {
        // Set sector agent status to analyzing
        setSectorAgentStatus(prev => new Map(prev).set(idx, 'analyzing'));
        setAgentStatus('active');

        // Log activity
        addActivityEvent({
            type: 'info',
            message: `Deploying agent for ${sector.sector} sector`,
            details: `Target role: ${sector.targetRoles[0]}`
        });

        // Set strategy after a brief delay to show status change
        setTimeout(() => {
            setSectorAgentStatus(prev => new Map(prev).set(idx, 'ready'));

            setSelectedSector(sector.sector);
            setStrategy({
                industry: sector.sector,
                geo: "Global",
                companySize: "Mid-Market",
                targetRole: sector.targetRoles[0],
                domain: "",
                rationale: sector.rationale
            });

            addActivityEvent({
                type: 'success',
                message: `Agent deployed for ${sector.sector}`,
                details: 'Navigating to Lead Generation...'
            });

            setActiveTab("lead-gen");
        }, 1200);
    };

    const getAgentStatusForSector = (idx: number): 'idle' | 'analyzing' | 'ready' => {
        return sectorAgentStatus.get(idx) || 'idle';
    };

    const getStatusBadge = (status: 'idle' | 'analyzing' | 'ready') => {
        switch (status) {
            case 'analyzing':
                return (
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 gap-1.5 animate-pulse">
                        <Activity className="h-3 w-3" />
                        Analyzing Personas
                    </Badge>
                );
            case 'ready':
                return (
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 gap-1.5">
                        <Check className="h-3 w-3" />
                        Ready to Deploy
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="text-slate-400 border-slate-700 gap-1.5">
                        <Cpu className="h-3 w-3" />
                        Agent Idle
                    </Badge>
                );
        }
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
                        <div className="flex items-center gap-2">
                            <Badge className="bg-blue-500/10 text-blue-300 border-blue-500/20 gap-2">
                                <Sparkles className="h-3 w-3" />
                                {sectors.length} Agents
                            </Badge>
                        </div>
                    </CardHeader>
                </Card>

                <ScrollArea className="flex-1 -mx-6 px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                        {sectors.map((sector, idx) => (
                            <Card key={idx} className="flex flex-col h-full group hover:scale-[1.01] transition-all duration-300 bg-slate-900/60 backdrop-blur-sm border-slate-800 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-900/20">
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start mb-3 gap-2">
                                        <Badge variant="outline" className="text-blue-400 border-blue-500/20 bg-blue-500/5 uppercase tracking-widest text-[10px] font-bold px-2 py-0.5">
                                            Sector {idx + 1}
                                        </Badge>
                                        {getStatusBadge(getAgentStatusForSector(idx))}
                                    </div>
                                    <CardTitle className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">
                                        {sector.sector}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-6 flex-1 flex flex-col">
                                    {/* Glass Separator */}
                                    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

                                    {/* AI Reasoning Dropdown */}
                                    <Collapsible
                                        open={expandedSectors.has(idx)}
                                        onOpenChange={() => toggleSectorExpansion(idx)}
                                    >
                                        <CollapsibleTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-full justify-between h-9 px-3 text-slate-300 hover:text-blue-300 hover:bg-blue-500/5"
                                            >
                                                <span className="flex items-center gap-2 text-xs font-semibold">
                                                    <Lightbulb className="h-3 w-3 text-amber-400" />
                                                    AI Reasoning
                                                </span>
                                                {expandedSectors.has(idx) ?
                                                    <ChevronUp className="h-4 w-4" /> :
                                                    <ChevronDown className="h-4 w-4" />
                                                }
                                            </Button>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="mt-3">
                                            <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800/50">
                                                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                                                    {sector.rationale}
                                                </p>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-wider">
                                                    <div className="h-1 w-1 rounded-full bg-green-500"></div>
                                                    Confidence: High
                                                </div>
                                            </div>
                                        </CollapsibleContent>
                                    </Collapsible>

                                    <section>
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <Target className="h-3 w-3 text-blue-400" /> Target Roles
                                        </h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {sector.targetRoles.map((role, i) => (
                                                <Badge key={i} variant="secondary" className="text-xs bg-slate-800/60 text-slate-200 border-slate-700">
                                                    {role}
                                                </Badge>
                                            ))}
                                        </div>
                                    </section>

                                    <section>
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Value Proposition</h4>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            {sector.valueProposition}
                                        </p>
                                    </section>

                                    <section className="flex-1">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <AlertTriangle className="h-3 w-3 text-orange-400" /> Pain Points
                                        </h4>
                                        <ul className="space-y-2 text-xs text-slate-300">
                                            {sector.painPoints.map((pain, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0"></span>
                                                    <span className="leading-relaxed">{pain}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </section>

                                    <Button
                                        onClick={() => handleDeployAgent(sector, idx)}
                                        disabled={getAgentStatusForSector(idx) === 'analyzing'}
                                        className="w-full mt-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold shadow-lg shadow-blue-900/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {getAgentStatusForSector(idx) === 'analyzing' ? (
                                            <>
                                                <Activity className="h-4 w-4 mr-2 animate-spin" />
                                                Deploying Agent...
                                            </>
                                        ) : getAgentStatusForSector(idx) === 'ready' ? (
                                            <>
                                                <Sparkles className="h-4 w-4 mr-2" />
                                                Agent Ready - View Leads
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </>
                                        ) : (
                                            <>
                                                <Cpu className="h-4 w-4 mr-2" />
                                                Deploy Agent
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
