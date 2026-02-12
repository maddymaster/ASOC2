"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function SettingsModal() {
    const [config, setConfig] = useState({
        // Voice
        retellKey: "",
        vapiKey: "",
        // Email
        smtpHost: "",
        smtpPort: "587",
        smtpUser: "",
        smtpPass: "",
        // Data
        apolloKey: "",
        openAIKey: "",
        // Scheduling
        calendlyToken: "",
        calendlyLink: ""
    });

    const [testing, setTesting] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("mission_control_config");
        if (saved) {
            const parsed = JSON.parse(saved);
            setConfig(prev => ({ ...prev, ...parsed }));
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem("mission_control_config", JSON.stringify(config));
        toast.success("Settings Saved");
        window.location.reload();
    };

    const testConnection = async (type: string) => {
        setTesting(type);
        let credentials = {};

        if (type === 'apollo') credentials = { apiKey: config.apolloKey };
        if (type === 'retell') credentials = { apiKey: config.retellKey };
        if (type === 'vapi') credentials = { apiKey: config.vapiKey };
        if (type === 'calendly') credentials = { token: config.calendlyToken };
        if (type === 'smtp') credentials = {
            host: config.smtpHost,
            port: config.smtpPort,
            user: config.smtpUser,
            pass: config.smtpPass
        };

        try {
            const res = await fetch("/api/integrations/test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, credentials })
            });
            const data = await res.json();

            if (data.success) {
                toast.success(data.message);
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("Validation request failed");
        } finally {
            setTesting(null);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Mission Control Settings</DialogTitle>
                    <DialogDescription>
                        Configure and validate your integration credentials.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="voice" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="voice">Voice</TabsTrigger>
                        <TabsTrigger value="email">Email</TabsTrigger>
                        <TabsTrigger value="data">Data</TabsTrigger>
                        <TabsTrigger value="sched">Sched</TabsTrigger>
                    </TabsList>

                    {/* VOICE TAB */}
                    <TabsContent value="voice" className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label>Retell AI API Key</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="password"
                                    value={config.retellKey}
                                    onChange={(e) => setConfig({ ...config, retellKey: e.target.value })}
                                    placeholder="re_..."
                                />
                                <Button size="sm" variant="secondary" onClick={() => testConnection('retell')} disabled={testing === 'retell'}>
                                    {testing === 'retell' ? "Testing..." : "Test"}
                                </Button>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Vapi API Key</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="password"
                                    value={config.vapiKey}
                                    onChange={(e) => setConfig({ ...config, vapiKey: e.target.value })}
                                    placeholder="Private Key"
                                />
                                <Button size="sm" variant="secondary" onClick={() => testConnection('vapi')} disabled={testing === 'vapi'}>
                                    {testing === 'vapi' ? "Testing..." : "Test"}
                                </Button>
                            </div>
                        </div>
                    </TabsContent>

                    {/* EMAIL TAB */}
                    <TabsContent value="email" className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Host</Label>
                                <Input value={config.smtpHost} onChange={(e) => setConfig({ ...config, smtpHost: e.target.value })} placeholder="smtp.gmail.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Port</Label>
                                <Input value={config.smtpPort} onChange={(e) => setConfig({ ...config, smtpPort: e.target.value })} placeholder="587" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>User</Label>
                            <Input value={config.smtpUser} onChange={(e) => setConfig({ ...config, smtpUser: e.target.value })} placeholder="email@example.com" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Password</Label>
                            <div className="flex gap-2">
                                <Input type="password" value={config.smtpPass} onChange={(e) => setConfig({ ...config, smtpPass: e.target.value })} />
                                <Button size="sm" variant="secondary" onClick={() => testConnection('smtp')} disabled={testing === 'smtp'}>
                                    {testing === 'smtp' ? "Testing..." : "Test"}
                                </Button>
                            </div>
                        </div>
                    </TabsContent>

                    {/* DATA TAB */}
                    <TabsContent value="data" className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label>Apollo API Key</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="password"
                                    value={config.apolloKey}
                                    onChange={(e) => setConfig({ ...config, apolloKey: e.target.value })}
                                    placeholder="To enrich leads..."
                                />
                                <Button size="sm" variant="secondary" onClick={() => testConnection('apollo')} disabled={testing === 'apollo'}>
                                    {testing === 'apollo' ? "Testing..." : "Test"}
                                </Button>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>OpenAI API Key</Label>
                            <Input
                                type="password"
                                value={config.openAIKey}
                                onChange={(e) => setConfig({ ...config, openAIKey: e.target.value })}
                                placeholder="sk-..."
                            />
                        </div>
                    </TabsContent>

                    {/* SCHEDULING TAB */}
                    <TabsContent value="sched" className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label>Calendly Personal Token</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="password"
                                    value={config.calendlyToken}
                                    onChange={(e) => setConfig({ ...config, calendlyToken: e.target.value })}
                                    placeholder="For checking availability"
                                />
                                <Button size="sm" variant="secondary" onClick={() => testConnection('calendly')} disabled={testing === 'calendly'}>
                                    {testing === 'calendly' ? "Testing..." : "Test"}
                                </Button>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Calendly Event URL</Label>
                            <Input value={config.calendlyLink} onChange={(e) => setConfig({ ...config, calendlyLink: e.target.value })} placeholder="https://calendly.com/me/30min" />
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end pt-4 border-t">
                    <Button onClick={handleSave}>Save Configuration</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
