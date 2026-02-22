"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export function PreferencesModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    const { user } = useUser();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [missionStyle, setMissionStyle] = useState("Consultative");
    const [maxEmails, setMaxEmails] = useState(50);
    const [maxCalls, setMaxCalls] = useState(20);

    const [emailFollowUps, setEmailFollowUps] = useState(7);
    const [emailDelay, setEmailDelay] = useState(3);
    const [callFollowUps, setCallFollowUps] = useState(3);
    const [callDelay, setCallDelay] = useState(2);

    useEffect(() => {
        if (open && user) {
            fetchPreferences();
        }
    }, [open, user]);

    const fetchPreferences = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/user/preferences');
            if (res.ok) {
                const data = await res.json();
                if (data.preferences) {
                    setMissionStyle(data.preferences.missionStyle);
                    setMaxEmails(data.preferences.maxEmailsPerDay);
                    setMaxCalls(data.preferences.maxCallsPerDay);
                    setEmailFollowUps(data.preferences.emailFollowUpCount);
                    setEmailDelay(data.preferences.emailDelayDays);
                    setCallFollowUps(data.preferences.callFollowUpCount);
                    setCallDelay(data.preferences.callDelayDays);
                }
            }
        } catch (error) {
            console.error("Failed to load preferences", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await fetch('/api/user/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    missionStyle,
                    maxEmailsPerDay: maxEmails,
                    maxCallsPerDay: maxCalls,
                    emailFollowUpCount: emailFollowUps,
                    emailDelayDays: emailDelay,
                    callFollowUpCount: callFollowUps,
                    callDelayDays: callDelay
                })
            });

            if (res.ok) {
                toast.success("Preferences updated securely");
                onOpenChange(false);
            } else {
                toast.error("Failed to save preferences");
            }
        } catch {
            toast.error("Network error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-slate-950 border-slate-800 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <Settings2 className="h-5 w-5 text-blue-500" />
                        Agent Configuration
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-blue-500" /></div>
                ) : (
                    <div className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <Label className="text-slate-300 font-medium">Mission Style</Label>
                            <p className="text-xs text-slate-500 mb-2">Dictates the Agent Supervisor's messaging and operational approach.</p>
                            <Select value={missionStyle} onValueChange={setMissionStyle}>
                                <SelectTrigger className="bg-slate-900 border-slate-700">
                                    <SelectValue placeholder="Select style" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                    <SelectItem value="Consultative">Consultative (Default)</SelectItem>
                                    <SelectItem value="Aggressive">Aggressive (High-Volume)</SelectItem>
                                    <SelectItem value="Educational">Educational (Value-First)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-300 font-medium">Daily Email Throttle</Label>
                            <Input
                                type="number"
                                value={maxEmails}
                                onChange={(e) => setMaxEmails(Number(e.target.value))}
                                className="bg-slate-900 border-slate-700"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-300 font-medium">Daily Call Throttle</Label>
                            <Input
                                type="number"
                                value={maxCalls}
                                onChange={(e) => setMaxCalls(Number(e.target.value))}
                                className="bg-slate-900 border-slate-700"
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-800">
                            <h4 className="text-sm font-semibold text-slate-300 mb-4">Sequence Dynamics (Drip)</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-400">Email Follow-ups</Label>
                                    <Input
                                        type="number"
                                        value={emailFollowUps}
                                        onChange={(e) => setEmailFollowUps(Number(e.target.value))}
                                        className="bg-slate-900 border-slate-700 h-8 text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-400">Email Delay (Days)</Label>
                                    <Input
                                        type="number"
                                        value={emailDelay}
                                        onChange={(e) => setEmailDelay(Number(e.target.value))}
                                        className="bg-slate-900 border-slate-700 h-8 text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-400">Call Follow-ups</Label>
                                    <Input
                                        type="number"
                                        value={callFollowUps}
                                        onChange={(e) => setCallFollowUps(Number(e.target.value))}
                                        className="bg-slate-900 border-slate-700 h-8 text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-400">Call Delay (Days)</Label>
                                    <Input
                                        type="number"
                                        value={callDelay}
                                        onChange={(e) => setCallDelay(Number(e.target.value))}
                                        className="bg-slate-900 border-slate-700 h-8 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Lock in Preferences
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
