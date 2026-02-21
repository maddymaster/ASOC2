'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mail, RefreshCw, Send, CheckCircle, ExternalLink } from 'lucide-react';
import { toast } from "sonner";

interface Draft {
    id: string;
    leadId: string;
    status: string;
    subject: string;
    body: string;
    researchContext: string;
    createdAt: string;
    Lead?: {
        name: string;
        company: string;
        email: string;
    };
}

export function EmailLaboratory() {
    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    // Fetch drafts on load
    useEffect(() => {
        fetchDrafts();
    }, []);

    const fetchDrafts = async () => {
        try {
            const res = await fetch('/api/email/draft');
            if (res.ok) {
                const data = await res.json();
                setDrafts(data);
                if (data.length > 0 && !selectedDraft) {
                    setSelectedDraft(data[0]);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Simulate generating a new draft for a demo lead
    const handleGenerateDemo = async () => {
        setGenerating(true);
        try {
            // In a real app, you'd pick a lead ID. Here we'll create a dummy one or use existing?
            // For the demo, let's assume we have a lead related to "Acme Corp"
            // We'll Trigger the API with hardcoded demo data if no leads exist

            // First, check if we have leads, if not, maybe prompt? 
            // For smoothness, let's just trigger for a "Target Company"
            const res = await fetch('/api/email/draft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadId: 'demo-lead-id', // This might fail foreign key constraint if not exists. 
                    // ideally we should create a lead first or pick one. 
                    // Verification Step: We need a valid lead ID. 
                    // Let's rely on the existing leads in DB or create one on the fly?
                    // Safe bet: The user should pick from a list. 
                    // For this component, let's just show "Select a Lead" if empty.
                    companyName: "Stripe",
                    contactName: "Patrick Collison",
                    role: "CEO"
                })
            });

            if (res.ok) {
                toast.success("New Draft Generated!");
                fetchDrafts();
            } else {
                toast.error("Failed to generate. Ensure you have Leads.");
            }
        } catch (e) {
            toast.error("Error generating draft");
        } finally {
            setGenerating(false);
        }
    };

    const handleUpdate = async (id: string, updates: Partial<Draft>) => {
        // Optimistic update
        setDrafts(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
        if (selectedDraft?.id === id) {
            setSelectedDraft(prev => prev ? { ...prev, ...updates } : null);
        }

        await fetch('/api/email/draft', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...updates })
        });
    };

    const handleSendTest = async () => {
        if (!selectedDraft) return;

        const testEmail = window.prompt("Enter email address to receive the test send:", selectedDraft.Lead?.email);
        if (!testEmail) return;

        const sendPromise = async () => {
            // 1. Send via API
            const res = await fetch('/api/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: testEmail,
                    subject: selectedDraft.subject,
                    html: selectedDraft.body.replace(/\n/g, '<br/>'), // Simple formatting
                    leadId: selectedDraft.leadId
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to send email via Provider");
            }

            // 2. Update DB Status
            await handleUpdate(selectedDraft.id, { status: 'SENT' });
        };

        toast.promise(
            sendPromise(),
            {
                loading: 'Dispatching via Resend...',
                success: 'Test Email Sent Successfully!',
                error: (err) => `Failed to dispatch: ${err.message}`
            }
        );
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="flex h-[calc(100vh-140px)] gap-4">
            {/* Left: Draft List */}
            <div className="w-1/3 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold font-display">Email Queue</h2>
                    {/* Only show Generate specific button for demo/testing */}
                    {/* <Button size="sm" onClick={handleGenerateDemo} disabled={generating}>
                        {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                        Auto-Draft
                    </Button> */}
                </div>

                <ScrollArea className="h-full border rounded-lg bg-card">
                    <div className="p-2 space-y-2">
                        {drafts.length === 0 && (
                            <div className="p-8 text-center text-muted-foreground">
                                No drafts queued. Start a campaign to generate outreach.
                            </div>
                        )}
                        {drafts.map(draft => (
                            <div
                                key={draft.id}
                                onClick={() => setSelectedDraft(draft)}
                                className={`p-4 rounded-lg cursor-pointer transition-colors border ${selectedDraft?.id === draft.id
                                    ? 'bg-accent border-primary/50'
                                    : 'hover:bg-accent/50 border-transparent'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold">{draft.Lead?.company || "Unknown Company"}</span>
                                    <Badge variant={draft.status === 'SENT' ? 'default' : 'outline'}>
                                        {draft.status}
                                    </Badge>
                                </div>
                                <p className="text-sm text-foreground/80 truncate font-medium">{draft.subject}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    To: {draft.Lead?.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Right: Editor & Context */}
            <div className="w-2/3 flex flex-col gap-4">
                {selectedDraft ? (
                    <Card className="h-full flex flex-col">
                        <CardHeader className="pb-3 border-b">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Draft Editor</CardTitle>
                                    <CardDescription>
                                        Review and personalize the AI-generated content.
                                    </CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    {selectedDraft.status !== 'SENT' && (
                                        <Button onClick={handleSendTest} className="bg-primary hover:bg-primary/90">
                                            <Send className="w-4 h-4 mr-2" />
                                            Send Test
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardHeader>

                        <div className="flex-1 flex overflow-hidden">
                            {/* Editor */}
                            <div className="w-2/3 p-6 flex flex-col gap-4 border-r overflow-y-auto">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground">Subject Line</label>
                                    <Input
                                        value={selectedDraft.subject}
                                        onChange={(e) => handleUpdate(selectedDraft.id, { subject: e.target.value })}
                                        className="font-medium"
                                    />
                                </div>
                                <div className="space-y-1 flex-1 flex flex-col">
                                    <label className="text-xs font-semibold text-muted-foreground">Email Body</label>
                                    <Textarea
                                        value={selectedDraft.body}
                                        onChange={(e) => handleUpdate(selectedDraft.id, { body: e.target.value })}
                                        className="flex-1 min-h-[300px] resize-none leading-relaxed"
                                    />
                                </div>
                            </div>

                            {/* Research Context Panel */}
                            <div className="w-1/3 bg-muted/20 p-4 overflow-y-auto">
                                <h3 className="text-sm font-semibold mb-3 flex items-center">
                                    <RefreshCw className="w-3 h-3 mr-2" />
                                    Research Context
                                </h3>
                                <div className="space-y-4">
                                    {(() => {
                                        try {
                                            const context = JSON.parse(selectedDraft.researchContext || "[]");
                                            return context.map((news: any, i: number) => (
                                                <div key={i} className="text-xs space-y-1 bg-background p-3 rounded border">
                                                    <a href={news.url} target="_blank" className="font-medium text-primary hover:underline flex items-start gap-1">
                                                        {news.title}
                                                        <ExternalLink className="w-3 h-3 mt-0.5" />
                                                    </a>
                                                    <p className="text-muted-foreground">{news.source} • {news.date}</p>
                                                    <p className="mt-1 opacity-90">{news.snippet}</p>
                                                </div>
                                            ));
                                        } catch (e) {
                                            return <p className="text-xs text-muted-foreground">No context available.</p>;
                                        }
                                    })()}
                                </div>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground border rounded-lg bg-muted/10">
                        Select a draft to view details
                    </div>
                )}
            </div>
        </div>
    );
}
