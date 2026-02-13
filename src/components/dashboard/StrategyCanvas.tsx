"use client";

import { useMissionControl } from "@/context/MissionControlContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Target, Lightbulb, AlertTriangle, ArrowRight, Clock, Plus, ChevronDown, ChevronUp, Cpu, Sparkles, Activity, FileText, Upload, RefreshCw, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";

export function StrategyCanvas() {
    const {
        expertAnalysis,
        resetCombinedState,
        analysisHistory,
        setExpertAnalysis,
        setStrategy,
        setActiveTab,
        setSelectedSector,
        agentStatus,
        setAgentStatus,
        addActivityEvent,
        strategyMode,
        setStrategyMode,
        setCampaignConfig
    } = useMissionControl();

    const [expandedSectors, setExpandedSectors] = useState<Set<number>>(new Set());
    const [sectorAgentStatus, setSectorAgentStatus] = useState<Map<number, 'idle' | 'analyzing' | 'ready'>>(new Map());

    // File Upload State
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Timeout Ref
    const analysisTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Clear timeout on unmount or state change
    useEffect(() => {
        return () => {
            if (analysisTimeoutRef.current) {
                clearTimeout(analysisTimeoutRef.current);
            }
        };
    }, []);

    // Also sync local state with context if needed, but primarily drive from context
    const activeAnalysis = expertAnalysis || analysisHistory[0];

    // Effect to auto-transition to COMPLETE if analysis exists and we are not in IDLE/ERROR
    useEffect(() => {
        if (activeAnalysis && strategyMode !== 'COMPLETE') {
            setStrategyMode('COMPLETE');
        }
    }, [activeAnalysis, strategyMode, setStrategyMode]);


    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
        let file: File | null = null;

        if ('files' in e.target && e.target.files && e.target.files.length > 0) {
            file = e.target.files[0];
        } else if ('dataTransfer' in e && e.dataTransfer.files.length > 0) {
            file = e.dataTransfer.files[0];
        }

        if (!file) return;

        // Start Uploading
        setStrategyMode('UPLOADING');

        // Simulating Upload & Analysis Start
        setTimeout(() => {
            startAnalysis(file!);
        }, 1500);
    };

    const startAnalysis = async (file: File) => {
        setStrategyMode('ANALYZING');

        // Set Safety Timeout (45s)
        if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);

        analysisTimeoutRef.current = setTimeout(() => {
            if (strategyMode === 'ANALYZING') {
                setStrategyMode('ERROR');
                toast.error("Analysis Timed Out", {
                    description: " The AI inference took too long. Please try again with a smaller file or plain text."
                });
            }
        }, 45000); // 45 Seconds

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/strategy/analyze', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                throw new Error(`Analysis failed: ${res.statusText}`);
            }

            const result = await res.json();

            // Clear timeout on success
            if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);

            // Set the analysis result
            setExpertAnalysis({
                id: Math.random().toString(),
                fileName: file.name,
                timestamp: new Date().toISOString(),
                summary: result.summary,
                sectors: result.sectors
            });

            // Auto-configure campaign settings based on AI suggestion
            if (result.suggestedConfig) {
                setCampaignConfig({
                    emailSequence: result.suggestedConfig.emailSequence,
                    outboundVoice: result.suggestedConfig.outboundVoice,
                    inboundReceptionist: result.suggestedConfig.inboundReceptionist
                });

                toast.success("Campaign Configured", {
                    description: `Email: ${result.suggestedConfig.emailSequence ? 'ON' : 'OFF'}, Voice: ${result.suggestedConfig.outboundVoice ? 'ON' : 'OFF'}, Receptionist: ${result.suggestedConfig.inboundReceptionist ? 'ON' : 'OFF'}`
                });
            }

            setStrategyMode('COMPLETE');
            toast.success("Strategy Analysis Complete");

        } catch (error: any) {
            if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);
            setStrategyMode('ERROR');

            // Extract error details from API response
            let errorMessage = 'Analysis Failed';
            let errorDescription = 'Unknown error occurred';

            if (error.message) {
                errorDescription = error.message;
            }

            // If it's a fetch error, try to extract JSON error details
            try {
                const errorData = await error.json?.();
                if (errorData) {
                    errorDescription = errorData.details || errorData.error || errorDescription;
                    if (errorData.suggestion) {
                        errorDescription += `\n\n💡 ${errorData.suggestion}`;
                    }
                }
            } catch {
                // JSON parsing failed, use error message as-is
            }

            toast.error(errorMessage, {
                description: errorDescription,
                duration: 8000
            });
        }
    };

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

    // --- RENDER STATES ---

    // 1. IDLE STATE (Upload)
    if (strategyMode === 'IDLE') {
        return (
            <div className="flex items-center justify-center h-full p-6">
                <Card
                    className={cn(
                        "w-full max-w-2xl mx-auto bg-slate-900/40 backdrop-blur-md border border-slate-700/50 shadow-2xl transition-all duration-300",
                        isDragging ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-500/5" : ""
                    )}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        handleFileSelect(e);
                    }}
                >
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-8">
                        <div className="relative">
                            <div className="flex items-center justify-center h-24 w-24 rounded-full bg-blue-500/10 ring-4 ring-blue-500/20">
                                <Upload className="h-10 w-10 text-blue-400" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-slate-900 rounded-full p-1.5 border border-slate-700">
                                <FileText className="h-4 w-4 text-slate-400" />
                            </div>
                        </div>

                        <div className="space-y-3 max-w-md">
                            <h3 className="text-2xl font-bold text-white tracking-tight">Upload Product Context</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Drag & drop your PRD, Product Spec, or Marketing One-Pager (PDF/TXT) to initialize the strategy agent.
                            </p>
                            <p className="text-xs text-blue-400/70 flex items-center gap-1.5 justify-center">
                                <Sparkles className="h-3 w-3" />
                                Powered by Gemini 1.5 Pro (Multimodal Vision)
                            </p>
                        </div>

                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <input
                                type="file"
                                id="prd-upload"
                                className="hidden"
                                accept=".pdf,.txt,.md,.png,.jpg,.jpeg"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                            />
                            <Button size="lg" className="w-full gap-2 text-base" onClick={() => fileInputRef.current?.click()}>
                                <FileText className="h-4 w-4" />
                                Select Document
                            </Button>
                            <p className="text-xs text-slate-500 mt-2">
                                Supported formats: PDF, TXT, MD, PNG, JPG (Max 10MB)
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // 2. UPLOADING & ANALYZING STATE
    if (strategyMode === 'UPLOADING' || strategyMode === 'ANALYZING') {
        const step = strategyMode === 'UPLOADING' ? 'Uploading Document...' : 'Analyzing Strategy...';
        const subtext = strategyMode === 'UPLOADING'
            ? 'Encrypting and transferring your context...'
            : 'AI Agent is identifying market sectors and personas...';

        return (
            <div className="flex items-center justify-center h-full">
                <Card className="w-full max-w-lg mx-auto bg-slate-900/60 backdrop-blur-md border border-slate-700/50">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-6">
                        <div className="relative h-20 w-20">
                            <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Cpu className="h-8 w-8 text-blue-400 animate-pulse" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-white">{step}</h3>
                            <p className="text-sm text-slate-400 max-w-xs mx-auto animate-pulse">
                                {subtext}
                            </p>
                        </div>
                        {strategyMode === 'ANALYZING' && (
                            <Badge variant="outline" className="mt-4 border-amber-500/30 text-amber-400 bg-amber-500/5">
                                <Clock className="h-3 w-3 mr-1.5" /> Est. Time: &lt; 45s
                            </Badge>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }

    // 3. ERROR STATE
    if (strategyMode === 'ERROR') {
        return (
            <div className="flex items-center justify-center h-full">
                <Card className="w-full max-w-lg mx-auto bg-red-950/20 backdrop-blur-md border border-red-900/50">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-6">
                        <div className="flex items-center justify-center h-20 w-20 rounded-full bg-red-500/10 ring-4 ring-red-500/20">
                            <AlertCircle className="h-10 w-10 text-red-400" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-white">Analysis Failed</h3>
                            <p className="text-sm text-red-200/70 max-w-xs mx-auto">
                                The AI agent timed out or encountered an error while processing your document.
                            </p>
                        </div>
                        <div className="flex gap-4 w-full justify-center">
                            <Button variant="outline" onClick={resetCombinedState} className="border-slate-700 hover:bg-slate-800">
                                Cancel
                            </Button>
                            <Button onClick={() => {
                                // Clear file input buffer
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = '';
                                }
                                // Reset to IDLE for fresh upload
                                resetCombinedState();
                                setStrategyMode('IDLE');
                                toast.info('Ready for new upload');
                            }} className="bg-red-600 hover:bg-red-700">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Retry Upload
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // 4. COMPLETE STATE (Main Dashboard)
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
                                    activeAnalysis?.id === item.id
                                        ? "bg-blue-500/10 border-blue-500/30 text-blue-100"
                                        : "border-transparent hover:bg-slate-800/50 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                                )}
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 transition-opacity duration-200"
                                    style={{ opacity: activeAnalysis?.id === item.id ? 1 : 0 }} />

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
                    <Button variant="outline" size="sm" onClick={resetCombinedState}
                        className="w-full gap-2 border-dashed border-red-500/30 hover:border-red-500/50 text-slate-400 hover:text-red-300 hover:bg-red-950/10 transition-colors">
                        <Plus className="h-4 w-4" /> Start New Analysis
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="col-span-12 md:col-span-9 lg:col-span-10 flex flex-col space-y-8 h-full">
                {/* Header Card */}
                {activeAnalysis && (
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
                                    {activeAnalysis.summary}
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white" onClick={resetCombinedState}>
                                    <RefreshCw className="h-4 w-4 mr-2" /> Reset
                                </Button>
                                <Badge className="bg-blue-500/10 text-blue-300 border-blue-500/20 gap-2">
                                    <Sparkles className="h-3 w-3" />
                                    {activeAnalysis.sectors.length} Agents
                                </Badge>
                            </div>
                        </CardHeader>
                    </Card>
                )}

                <ScrollArea className="flex-1 -mx-6 px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                        {activeAnalysis?.sectors.map((sector, idx) => (
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
