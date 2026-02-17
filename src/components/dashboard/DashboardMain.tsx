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
import { LeadGenTab } from "./LeadGenTab";
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


        <Tabs value={activeTab} className="flex-1 flex flex-col p-8">
            <div className="flex justify-between items-center mb-6 shrink-0">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-1">
                        {activeTab === 'strategy' && 'Strategic Analysis'}
                        {activeTab === 'email-lab' && 'Email Laboratory'}
                        {activeTab === 'lead-gen' && 'Lead Generation'}
                        {activeTab === 'email-campaigns' && 'Campaign Management'}
                        {activeTab === 'call-analytics' && 'Call Analytics'}
                    </h2>
                    <p className="text-slate-400">
                        {activeTab === 'strategy' && 'AI-driven market analysis and sector targeting.'}
                        {activeTab === 'email-lab' && 'Draft, refine, and optimize your email sequences.'}
                        {activeTab === 'lead-gen' && 'Find and qualify high-value prospects.'}
                        {activeTab === 'email-campaigns' && 'Manage your active outreach campaigns.'}
                        {activeTab === 'call-analytics' && 'Review call performance and sentiment analysis.'}
                    </p>
                </div>

                <div className="flex gap-3">
                    <SettingsModal />
                    <CampaignWizardModal />
                    <UserNav />
                </div>
            </div>

            {/* Strategy Tab - Allow natural height */}
            <TabsContent value="strategy" className="flex-1 p-1 outline-none">
                <StrategyCanvas />
            </TabsContent>

            <TabsContent value="email-lab" className="flex-1 h-full overflow-hidden p-6">
                <EmailLaboratory />
            </TabsContent>

            {/* Lead Gen Tab */}
            <TabsContent value="lead-gen" className="flex-1 h-full p-6">
                <LeadGenTab />
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
    );
}
