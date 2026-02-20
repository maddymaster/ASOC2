"use client";

import { useMissionControl } from "@/context/MissionControlContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Building2, Users as UsersIcon, TrendingUp, Loader2, RefreshCw, AlertCircle, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function LeadGenTab() {
    const {
        leads,
        setLeads,
        strategy,
        addActivityEvent,
        setAgentStatus,
        leadScores,
        setLeadScore,
        expertAnalysis,
        setActiveTab,
        setEmailQueue,
        emailTone
    } = useMissionControl();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Auto-fetch leads when strategy is set
    useEffect(() => {
        if (strategy && leads.length === 0) {
            fetchLeads();
        }
    }, [strategy, leads.length]);

    const fetchLeads = async () => {
        if (!strategy) return;

        setIsLoading(true);
        setError(null);
        setAgentStatus('active');

        addActivityEvent({
            type: 'info',
            message: `Fetching leads from Apollo for ${strategy.industry} sector`,
            details: `Target role: ${strategy.targetRole}`
        });

        try {
            // const savedConfig = JSON.parse(localStorage.getItem("mission_control_config") || "{}");

            const res = await fetch('/api/explorium', { // Switched to Explorium
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    strategy,
                    // apiKey: savedConfig.apolloKey // No longer needed on client, env var used on server
                })
            });

            const data = await res.json();

            if (data.success) {
                let fetchedLeads = data.leads || [];

                // INJECT TEST LEAD FOR DEMO (If Enterprise Security)
                // REMOVED TEST LEAD INJECTION FOR PRODUCTION/NUCLEAR RESET
                // if (strategy.industry === "Enterprise Security" || strategy.industry === "Cybersecurity") { ... }

                setLeads(fetchedLeads);

                addActivityEvent({
                    type: 'success',
                    message: `Successfully fetched ${data.leads?.length || 0} leads`,
                    details: data.message
                });

                // Trigger lead scoring for top 5 leads
                if (data.leads && data.leads.length > 0) {
                    scoreTopLeads(data.leads.slice(0, 5));
                }

                if (data.isEmpty) {
                    toast.info("No leads found", {
                        description: data.message
                    });
                }
            } else {
                const errorMsg = data.message || data.error || 'Failed to fetch leads';
                setError(errorMsg);

                addActivityEvent({
                    type: 'error',
                    message: 'Apollo API request failed',
                    details: errorMsg
                });

                if (data.errorType === 'auth') {
                    toast.error("Integration Error", {
                        description: "Valid Apollo API status check failed. Check settings.",
                        action: {
                            label: "Settings",
                            onClick: () => console.log("Navigate to settings")
                        }
                    });
                } else if (data.errorType === 'rate_limit') {
                    toast.warning("Apollo API Rate Limit", {
                        description: `Usage limit reached. Auto-retrying in ${data.retryAfter || 60}s...`,
                        duration: 5000
                    });
                } else if (data.message && data.message.includes("401")) {
                    toast.error("Authentication Failed", {
                        description: "Your Apollo Key is invalid or expired."
                    });
                } else {
                    toast.error("Lead Fetch Failed", {
                        description: errorMsg || "Unknown Apollo API error. Please try again."
                    });
                }
            }
        } catch (e: any) {
            const errorMsg = 'Network error. Please check your connection.';
            setError(errorMsg);

            addActivityEvent({
                type: 'error',
                message: 'Lead fetch failed',
                details: e.message
            });

            toast.error("Connection Error", {
                description: errorMsg
            });
        } finally {
            setIsLoading(false);
            setAgentStatus('idle');
        }
    };

    const scoreTopLeads = async (leadsToScore: any[]) => {
        if (!strategy) return;

        addActivityEvent({
            type: 'info',
            message: 'Scoring lead relevance with AI',
            details: `Analyzing ${leadsToScore.length} prospects...`
        });

        for (const lead of leadsToScore) {
            try {
                const res = await fetch('/api/leads/score', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        lead: {
                            name: lead.name,
                            title: (lead as any).role || lead.email.split('@')[0], // Fallback
                            company: lead.company,
                            employees: (lead as any).employees,
                            location: (lead as any).location
                        },
                        prdCriteria: {
                            targetSector: strategy.industry,
                            targetRoles: [strategy.targetRole],
                            valueProposition: strategy.rationale || "AI-powered sales automation",
                            painPoints: ["Manual lead research", "Poor targeting", "Low conversion rates"],
                            rationale: strategy.rationale
                        }
                    })
                });

                const scoreData = await res.json();

                if (scoreData.success) {
                    const score = scoreData.score;
                    setLeadScore(lead.id, {
                        score: score,
                        reasoning: scoreData.reasoning,
                        confidence: scoreData.confidence,
                        keyFactors: scoreData.keyFactors
                    });

                    // AUTO-DRAFT TRIGGER (Score >= 80)
                    if (score >= 80) {
                        toast.info(`High Value Lead Detected: ${lead.name}`, {
                            description: "Auto-drafting personalized email...",
                            duration: 3000
                        });

                        try {
                            const draftRes = await fetch('/api/email/draft', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    leadId: lead.id,
                                    companyName: lead.company,
                                    contactName: lead.name,
                                    role: (lead as any).role,
                                    rationale: scoreData.reasoning,
                                    valueProp: strategy.rationale
                                })
                            });

                            if (draftRes.ok) {
                                toast.success("Draft Created", {
                                    description: `Ready for review in Email Lab for ${lead.name}`
                                });
                            }
                        } catch (draftError) {
                            console.error("Auto-draft failed", draftError);
                        }
                    }
                }
            } catch (e) {
                console.error(`Failed to score lead ${lead.id}:`, e);
            }
        }

        addActivityEvent({
            type: 'success',
            message: 'Lead scoring complete',
            details: 'AI analysis finished'
        });
    };
    const handleGenerateDraft = async (lead: any) => {
        toast.promise(
            async () => {
                const response = await fetch('/api/assistant/draft-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        leadId: lead.id,
                        companyName: lead.company,
                        contactName: lead.name,
                        role: (lead as any).role || "Decision Maker",
                        rationale: expertAnalysis?.sectors[0]?.rationale || "Strategic Fit",
                        valueProp: expertAnalysis?.sectors[0]?.valueProposition || "AI Automation",
                        tone: emailTone
                    })
                });

                if (!response.ok) throw new Error('Failed to generate draft');

                const data = await response.json();

                // Add to Email Queue (Global State)
                const newDraft: any = {
                    id: Math.random().toString(36).substr(2, 9),
                    leadId: lead.id,
                    leadName: lead.name,
                    subject: data.subject,
                    body: data.body, // API returns 'body'
                    status: 'draft',
                    sequenceStep: 1
                };

                setEmailQueue(prev => [newDraft, ...prev]);

                // Switch tabs to Email Lab to view the draft
                setActiveTab('email-campaigns');

                return data;
            },
            {
                loading: 'Drafting hyper-personalized email...',
                success: 'Draft created! Head to Email Lab to review.',
                error: 'Could not generate draft. Please try again.'
            }
        );
    };


    const triggerOutboundCall = async (lead: any) => {
        toast.info(`Calling ${lead.name}...`, {
            description: "Initiating AI Voice Agent via Retell..."
        });

        try {
            const res = await fetch('/api/calls/outbound', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadId: lead.id,
                    phone: (lead as any).phone_numbers?.[0]?.sanitized_number || lead.phone,
                    name: lead.name,
                    rationale: strategy?.rationale || "Strategic fit",
                    painPoints: ["Manual process", "Inefficiency"] // Dynamic in full version
                })
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Call Initiated", {
                    description: `Agent is dialing ${lead.name} now.`
                });
                addActivityEvent({
                    type: 'success',
                    message: `Outbound call triggered to ${lead.name}`,
                    details: 'Agent: Enterprise Security Bot'
                });
            } else {
                toast.error("Call Failed", {
                    description: data.error || "Could not connect to Retell."
                });
            }
        } catch (error) {
            console.error("Call trigger error:", error);
            toast.error("Call Failed", { description: "Network error." });
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-400 border-green-500/30 bg-green-500/10";
        if (score >= 60) return "text-blue-400 border-blue-500/30 bg-blue-500/10";
        if (score >= 40) return "text-amber-400 border-amber-500/30 bg-amber-500/10";
        return "text-slate-300 border-slate-500/30 bg-slate-500/10";
    };

    const getScoreLabel = (score: number) => {
        if (score >= 80) return "Excellent Match";
        if (score >= 60) return "Good Match";
        if (score >= 40) return "Fair Match";
        return "Poor Match";
    };

    // Empty state
    if (!strategy) {
        return (
            <div className="flex items-center justify-center h-full">
                <Card className="w-full max-w-2xl mx-auto bg-slate-900/40 backdrop-blur-md border border-slate-700/50 shadow-2xl">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-6">
                        <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-500/10 ring-4 ring-blue-500/20">
                            <UsersIcon className="h-10 w-10 text-blue-400" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-xl font-bold text-white tracking-tight">No Strategy Selected</h3>
                            <p className="text-sm text-slate-300 max-w-md leading-relaxed">
                                Visit the Strategy tab to analyze your PRD and deploy an AI agent to fetch targeted leads.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* Metrics Header - Bento Box Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardDescription className="text-xs text-slate-300 uppercase tracking-wider">Total Leads</CardDescription>
                            <UsersIcon className="h-4 w-4 text-blue-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">{leads.length}</div>
                        <p className="text-xs text-slate-500 mt-1">From Apollo.io</p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardDescription className="text-xs text-slate-300 uppercase tracking-wider">Qualified</CardDescription>
                            <TrendingUp className="h-4 w-4 text-green-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">
                            {leads.filter(l => (leadScores.get(l.id)?.score || 0) >= 60).length}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Score ≥ 60</p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardDescription className="text-xs text-slate-300 uppercase tracking-wider">Avg. Score</CardDescription>
                            <Sparkles className="h-4 w-4 text-amber-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">
                            {leads.length > 0
                                ? Math.round(Array.from(leadScores.values()).reduce((sum, s) => sum + s.score, 0) / Math.max(leadScores.size, 1))
                                : 0}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">AI-powered</p>
                    </CardContent>
                </Card>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold text-white">Recent Leads</h3>
                    <p className="text-sm text-slate-300">
                        {strategy.industry} • {strategy.targetRole}
                    </p>
                </div>
                <Button
                    onClick={() => fetchLeads()}
                    disabled={isLoading}
                    variant="outline"
                    size="sm"
                    className="gap-2 border-blue-500/30 hover:bg-blue-500/10 text-blue-300"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Fetching...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="h-4 w-4" />
                            Refresh Leads
                        </>
                    )}
                </Button>
            </div>

            {/* Error State */}
            {error && (
                <Card className="bg-red-500/10 border-red-500/30">
                    <CardContent className="flex items-center gap-3 p-4">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                        <div>
                            <p className="text-sm font-medium text-red-300">Error fetching leads</p>
                            <p className="text-xs text-red-400/70 mt-1">{error}</p>
                        </div>
                        <Button
                            onClick={() => fetchLeads()}
                            size="sm"
                            variant="ghost"
                            className="ml-auto text-red-300 hover:text-red-200"
                        >
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Leads Grid - Bento Box Cards */}
            <div className="flex-1 min-h-0">
                <ScrollArea className="h-full">
                    <div className="px-6 pb-6">
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[1, 2, 3].map((i) => (
                                    <Card key={i} className="bg-slate-900/40 animate-pulse">
                                        <CardHeader>
                                            <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                                            <div className="h-3 bg-slate-800 rounded w-1/2 mt-2"></div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="h-3 bg-slate-800 rounded"></div>
                                                <div className="h-3 bg-slate-800 rounded w-5/6"></div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : leads.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <UsersIcon className="h-12 w-12 text-slate-600 mb-4" />
                                <p className="text-slate-300">No leads found. Click "Refresh Leads" to fetch from Apollo.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {leads.map((lead) => {
                                    const score = leadScores.get(lead.id);
                                    const scoreValue = score?.score || lead.score || 50;

                                    return (
                                        <Card
                                            key={lead.id}
                                            className="group hover:scale-[1.02] transition-all duration-300 bg-slate-900/60 backdrop-blur-sm border-slate-800 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-900/10"
                                        >
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        <CardTitle className="text-base font-semibold text-white group-hover:text-blue-200 transition-colors line-clamp-1">
                                                            {lead.name}
                                                        </CardTitle>
                                                        <CardDescription className="text-xs text-slate-300 mt-1 line-clamp-1">
                                                            {(lead as any).role || 'Contact'}
                                                        </CardDescription>
                                                    </div>
                                                    <Badge className={cn("text-xs font-bold shrink-0", getScoreColor(scoreValue))}>
                                                        {scoreValue}
                                                    </Badge>
                                                </div>
                                            </CardHeader>

                                            <CardContent className="space-y-3">
                                                <div className="flex items-center gap-2 text-xs text-slate-300">
                                                    <Building2 className="h-3 w-3 text-slate-500" />
                                                    <span className="line-clamp-1">{lead.company}</span>
                                                </div>

                                                {(lead as any).location && (
                                                    <div className="flex items-center gap-2 text-xs text-slate-300">
                                                        <MapPin className="h-3 w-3 text-slate-500" />
                                                        <span>{(lead as any).location}</span>
                                                    </div>
                                                )}

                                                {(lead as any).employees && (
                                                    <div className="flex items-center gap-2 text-xs text-slate-300">
                                                        <UsersIcon className="h-3 w-3 text-slate-500" />
                                                        <span>{(lead as any).employees} employees</span>
                                                    </div>
                                                )}

                                                {score && (
                                                    <div className="pt-2 border-t border-slate-800">
                                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">AI Analysis</p>
                                                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                                                            {score.reasoning}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 border-slate-700">
                                                                {getScoreLabel(scoreValue)}
                                                            </Badge>
                                                            <span className="text-[10px] text-slate-600">
                                                                {score.confidence} confidence
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex gap-2 pt-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="flex-1 h-8 text-xs gap-1.5 border-slate-700 hover:bg-blue-500/10 hover:border-blue-500/30"
                                                        onClick={() => handleGenerateDraft(lead)}
                                                    >
                                                        <Mail className="h-3 w-3" />
                                                        Email
                                                    </Button>
                                                    {(lead as any).phone && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="flex-1 h-8 text-xs gap-1.5 border-slate-700 hover:bg-green-500/10 hover:border-green-500/30"
                                                            onClick={() => triggerOutboundCall(lead)}
                                                        >
                                                            <Phone className="h-3 w-3" />
                                                            Call
                                                        </Button>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
