"use client";

import { useMissionControl } from "@/context/MissionControlContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Users, Plus, BarChart3, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { EmailCampaignsTab } from "./EmailCampaignsTab";
import { CallAnalyticsTab } from "./CallAnalyticsTab";
import { SettingsModal } from "./SettingsModal";
import { CampaignWizardModal } from "./CampaignWizardModal";
import { EmailLaboratory } from "./EmailLaboratory";
import { StrategyCanvas } from "./StrategyCanvas";
import { UserNav } from "./UserNav";
import { useEffect } from "react";

export default function DashboardMain() {
    const { leads, strategy, setActiveCall, setCallHistory, activeTab, setActiveTab, setLeads } = useMissionControl();

    useEffect(() => {
        if (activeTab === 'lead-gen' && strategy) {
            const fetchAndDraft = async () => {
                try {
                    // Get keys from settings
                    const savedConfig = JSON.parse(localStorage.getItem("mission_control_config") || "{}");

                    // 1. Fetch Leads
                    const res = await fetch('/api/apollo', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            strategy,
                            apiKey: savedConfig.apolloKey
                        })
                    });
                    const data = await res.json();

                    if (data.success && data.leads) {
                        setLeads(data.leads);

                        // 2. Automated Enrichment & Drafting (Top 5)
                        const topLeads = data.leads.slice(0, 5);

                        topLeads.forEach(async (lead: any) => {
                            await fetch('/api/email/draft', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    leadId: lead.id,
                                    companyName: lead.company,
                                    contactName: lead.name,
                                    role: lead.title,
                                    rationale: strategy.rationale,
                                    valueProp: "AI-Driven Sales Operations"
                                    // openAIKey could be passed here if needed by the backend
                                })
                            });
                        });
                    }
                } catch (e) {
                    console.error("Pipeline Error:", e);
                }
            };
            fetchAndDraft();
        }
    }, [activeTab, strategy, setLeads]);

    const handleCall = async (lead: any) => {
        console.log("Calling", lead.name);

        const newCall = {
            id: 'temp-call',
            leadId: lead.id,
            leadName: lead.name,
            status: 'dialing' as const,
            duration: '00:00',
            transcript: '',
            sentiment: 'neutral' as const,
            timestamp: new Date()
        };
        setActiveCall(newCall);

        try {
            const savedConfig = JSON.parse(localStorage.getItem("mission_control_config") || "{}");

            // Use the new Trigger Route
            const res = await fetch("/api/calls/trigger", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    leadId: lead.id,
                    phone: lead.phone || savedConfig.testPhone || "+15550101234", // Use real phone if available
                    name: lead.name,
                    rationale: strategy?.rationale,
                    // Pass keys explicitly to override server env if needed (depends on route impl)
                }),
            });
            const data = await res.json();

            if (data.success) {
                setActiveCall({ ...newCall, id: data.callId });
                toast.success("Call Initiated via Retell");
            } else {
                toast.error("Call Failed: " + data.error);
                setActiveCall(null);
            }
        } catch (e) {
            console.error("Call failed", e);
            toast.error("Call failed to connect");
            setActiveCall(null);
        }
    };

    return (
        <div className="w-full max-h-screen overflow-y-auto flex flex-col bg-muted/20">
            <div className="p-6 pb-2 shrink-0">
                <h2 className="text-2xl font-bold tracking-tight mb-4">Sales Dashboard</h2>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col px-6 pb-6 overflow-hidden">
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <TabsList className="grid w-[500px] grid-cols-4">
                        <TabsTrigger value="strategy">Strategy</TabsTrigger>
                        <TabsTrigger value="email-lab">Email Lab</TabsTrigger>
                        <TabsTrigger value="lead-gen">Lead Gen</TabsTrigger>
                        <TabsTrigger value="email-campaigns">Email</TabsTrigger>
                        <TabsTrigger value="call-analytics">Calls</TabsTrigger>
                    </TabsList>
                    <div className="flex gap-2">
                        <Link href="/dashboard/admin">
                            <Button size="sm" variant="ghost">
                                <Shield className="h-4 w-4" />
                            </Button>
                        </Link>
                        <SettingsModal />
                        <CampaignWizardModal />
                        <UserNav />
                    </div>
                </div>

                {/* Strategy Tab */}
                <TabsContent value="strategy" className="flex-1 h-full p-1">
                    <StrategyCanvas />
                </TabsContent>

                <TabsContent value="email-lab" className="flex-1 h-full overflow-hidden p-6">
                    <EmailLaboratory />
                </TabsContent>

                {/* Lead Gen Tab */}
                <TabsContent value="lead-gen" className="flex-1 space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{leads.length > 0 ? leads.length + 1240 : '1,240'}</div>
                                <p className="text-xs text-muted-foreground">+10% from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Qualified</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">320</div>
                                <p className="text-xs text-muted-foreground">+5% from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">25.8%</div>
                                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Leads Table */}
                    <Card className="flex-1">
                        <CardHeader>
                            <CardTitle>Recent Leads</CardTitle>
                            <CardDescription>
                                {strategy
                                    ? `Targeting: ${strategy.industry} in ${strategy.geo} (${strategy.companySize})`
                                    : "Recently generated leads from your campaigns."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {leads.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No leads generated yet. Chat with the agent to start a campaign.
                                    </div>
                                ) : (
                                    leads.map((lead) => (
                                        <div key={lead.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-4">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-2 ring-background">
                                                    {lead.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{lead.name}</p>
                                                    <p className="text-xs text-muted-foreground">{lead.company} • {lead.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={lead.score > 70 ? "default" : "secondary"} className={lead.score > 70 ? "bg-green-600 hover:bg-green-700" : ""}>
                                                    Score: {lead.score}
                                                </Badge>
                                                <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => handleCall(lead)}>
                                                    <Phone className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                {/* ... (Other tabs remain unchanged) ... */}

                {/* Email Campaigns Tab */}
                <TabsContent value="email-campaigns" className="flex-1 space-y-4">
                    <EmailCampaignsTab />
                </TabsContent>

                {/* Call Analytics Tab */}
                <TabsContent value="call-analytics" className="flex-1 space-y-4">
                    <CallAnalyticsTab />
                </TabsContent>

            </Tabs>
        </div>
    );
}
