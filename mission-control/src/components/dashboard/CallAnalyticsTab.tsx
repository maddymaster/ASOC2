"use client";

import { useMissionControl } from "@/context/MissionControlContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, BarChart3, Clock, Mic, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MOCK_TRANSCRIPTS } from "@/lib/voice-persona";
import { DYNAMIC_VARS, interpolateScript } from "@/lib/dynamic-vars";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export function CallAnalyticsTab() {
    const { activeCall, setActiveCall, setCallHistory, callHistory } = useMissionControl();
    const [selectedCall, setSelectedCall] = useState<any>(null);
    const [coachingData, setCoachingData] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = async (call: any) => {
        setIsAnalyzing(true);
        setSelectedCall(call);
        setCoachingData(null);

        // Check if we have analyzing data in call object (if persisted)
        // For now, simulate API call
        try {
            // In real app: call /api/analysis/coaching with { callId: call.id, transcript: call.transcript }
            // Mocking the response for demo
            setTimeout(() => {
                setCoachingData({
                    win: "Great job validating the 'Too Expensive' objection by pivoting to ROI.",
                    gap: "Missed the opportunity to confirm the 'Tuesday at 10am' slot immediately.",
                    score: 8
                });
                setIsAnalyzing(false);
            }, 1500);
        } catch (e) {
            toast.error("Analysis Failed");
            setIsAnalyzing(false);
        }
    };

    useEffect(() => {
        const channel = pusherClient.subscribe('mission-control');

        channel.bind('call-completed', (data: any) => {
            console.log("Real-time Call Update:", data);
            toast.success(`New Call Log logged from ${data.leadId}`);

            // Transform data to match context Call interface
            const newCall = {
                id: data.id,
                leadId: data.leadId || 'unknown',
                leadName: data.leadId || 'Unknown Lead', // Ideally fetch name from lead ID
                status: data.status,
                duration: `${Math.floor(data.duration / 60)}:${(data.duration % 60).toString().padStart(2, '0')}`,
                transcript: data.transcript || '',
                sentiment: data.sentiment as any,
                timestamp: new Date(data.createdAt)
            };

            setCallHistory(prev => [newCall, ...prev]);
        });

        return () => {
            pusherClient.unsubscribe('mission-control');
        };
    }, [setCallHistory]);

    const simulateInboundCall = () => {
        const id = `inbound-${Date.now()}`;
        const mockLead = {
            first_name: "Sarah",
            company_name: "TechFlow",
            industry: "SaaS",
            job_title: "VP of Sales",
            selected_slot: "Tuesday at 10 AM"
        };

        const personalizedGreeting = interpolateScript(DYNAMIC_VARS.templates.greeting, mockLead);
        const personalizedContext = interpolateScript(DYNAMIC_VARS.templates.context, mockLead);

        toast.info(`Incoming Call from ${mockLead.first_name} at ${mockLead.company_name}...`);

        setActiveCall({
            id,
            leadId: 'mock-sarah',
            leadName: `${mockLead.first_name} (${mockLead.company_name})`,
            status: 'connected',
            duration: '00:00',
            transcript: `Alex: ${personalizedGreeting}\nSarah: Hi Alex, yes that's right.`,
            sentiment: 'positive',
            timestamp: new Date()
        });

        setTimeout(() => {
            setActiveCall(prev => prev ? {
                ...prev,
                status: 'completed',
                duration: '00:55',
                sentiment: 'positive',
                transcript: `Alex: ${personalizedGreeting}\nSarah: Hi Alex, yes that's right.\nAlex: ${personalizedContext}\nSarah: We are looking for help there actually.\nAlex: Awesome. ${DYNAMIC_VARS.templates.validation.replace('{{selected_slot}}', mockLead.selected_slot)}`
            } : null);

            toast.success("Call Completed");

            setCallHistory(prev => [{
                id,
                leadId: 'mock-sarah',
                leadName: `${mockLead.first_name} (${mockLead.company_name})`,
                status: 'completed',
                duration: '00:55',
                transcript: `Alex: ${personalizedGreeting}\nSarah: Hi Alex, yes that's right.\nAlex: ${personalizedContext}\nSarah: We are looking for help there actually.\nAlex: Awesome. ${DYNAMIC_VARS.templates.validation.replace('{{selected_slot}}', mockLead.selected_slot)}`,
                sentiment: 'positive',
                timestamp: new Date()
            }, ...prev]);
        }, 5000);
    };

    return (
        <div className="space-y-4">
            {/* Active Call Panel */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Live Operations</h3>
                <Button variant="outline" size="sm" onClick={simulateInboundCall}>
                    <Phone className="h-4 w-4 mr-2" />
                    Simulate Inbound Call
                </Button>
            </div>

            {activeCall && (
                <Card className="border-primary/50 bg-primary/5 animate-pulse">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center text-primary">
                            <Phone className="h-4 w-4 mr-2 animate-bounce" />
                            Live Call in Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold">{activeCall.leadName}</h3>
                                <p className="text-muted-foreground text-sm">Status: {activeCall.status.toUpperCase()}</p>
                            </div>
                            <div className="text-2xl font-mono">
                                {activeCall.duration || '00:00'}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Analytics Overview */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Call Volume</CardTitle>
                        <CardDescription>Daily call activity</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[200px] flex items-center justify-center bg-muted/10">
                        <BarChart3 className="h-10 w-10 text-muted-foreground/20" />
                        <span className="text-muted-foreground ml-2 text-sm">Chart Placeholder</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Sentiment Analysis</CardTitle>
                        <CardDescription>Overall interaction quality</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[200px] flex items-center justify-center bg-muted/10">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">85%</div>
                            <div className="text-sm text-muted-foreground">Positive</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Call History */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Calls</CardTitle>
                    <CardDescription>History of AI agent interactions.</CardDescription>
                </CardHeader>
                <CardContent>
                    {callHistory.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No recent calls. Start dialing from the "Lead Gen" tab.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {callHistory.map((call) => (
                                <div key={call.id} className="p-4 border rounded-lg bg-card">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <Smartphone className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-semibold">{call.leadName}</span>
                                            <Badge variant={call.sentiment === 'positive' ? 'default' : 'secondary'}>
                                                {call.sentiment}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-xs text-muted-foreground flex items-center">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {call.duration}
                                            </div>

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => handleAnalyze(call)}>
                                                        <Sparkles className="h-3 w-3 mr-1 text-purple-500" />
                                                        Review
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Sales Coaching Insight</DialogTitle>
                                                        <DialogDescription>AI Analysis of Call with {call.leadName}</DialogDescription>
                                                    </DialogHeader>

                                                    {isAnalyzing ? (
                                                        <div className="flex items-center justify-center py-8 text-muted-foreground">
                                                            <Sparkles className="h-5 w-5 animate-spin mr-2" />
                                                            Analyzing Transcript...
                                                        </div>
                                                    ) : coachingData ? (
                                                        <div className="space-y-4">
                                                            <div className="flex items-center justify-between bg-muted/20 p-3 rounded-lg">
                                                                <span className="font-semibold">ASOC Score</span>
                                                                <span className="text-2xl font-bold text-primary">{coachingData.score}/10</span>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <div className="flex items-start gap-2">
                                                                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                                                                    <div>
                                                                        <p className="font-semibold text-sm">The Win</p>
                                                                        <p className="text-sm text-muted-foreground">{coachingData.win}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-start gap-2">
                                                                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                                                                    <div>
                                                                        <p className="font-semibold text-sm">The Gap</p>
                                                                        <p className="text-sm text-muted-foreground">{coachingData.gap}</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="mt-4 pt-4 border-t">
                                                                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Transcript Snippet</h4>
                                                                <p className="text-xs font-mono bg-muted p-2 rounded max-h-40 overflow-y-auto">
                                                                    {call.transcript}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                    <div className="bg-muted p-3 rounded text-xs whitespace-pre-wrap font-mono text-muted-foreground">
                                        <Mic className="h-3 w-3 inline mr-1" />
                                        {call.transcript}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
