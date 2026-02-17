"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Timer, DollarSign, Users, TrendingUp } from "lucide-react";

export function ROICalculator() {
    const [sdrCount, setSdrCount] = useState([2]);
    const [hoursPerWeek, setHoursPerWeek] = useState([15]); // Hours spent on manual research/drafting per SDR

    // Constants
    const HOURLY_RATE = 50; // Estimated loaded cost of SDR/AE
    const AGENT_COST_PER_LEAD = 1.5; // Blended cost estimate
    const LEAD_VOLUME_PER_HOUR = 5; // Manual human pace

    const manualCost = sdrCount[0] * hoursPerWeek[0] * HOURLY_RATE * 52;
    const manualLeads = sdrCount[0] * hoursPerWeek[0] * LEAD_VOLUME_PER_HOUR * 52;

    // MissionControl: 10x faster, so same volume takes 1/10th time + agent cost
    // Or simplified: We save the manual labor cost minus platform cost
    const platformCost = (manualLeads * AGENT_COST_PER_LEAD);
    const savings = manualCost - platformCost;
    const hoursSaved = sdrCount[0] * hoursPerWeek[0] * 52 * 0.9; // 90% time reduction

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    const formatNumber = (val: number) => new Intl.NumberFormat('en-US').format(val);

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    ROI Calculator
                </CardTitle>
                <CardDescription className="text-slate-400">
                    See how much manual prospecting is costing you.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Inputs */}
                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <Users className="h-4 w-4 text-slate-500" /> SDR Team Size
                            </label>
                            <span className="text-sm font-bold text-white bg-slate-800 px-2 py-1 rounded">{sdrCount[0]}</span>
                        </div>
                        <Slider
                            value={sdrCount}
                            onValueChange={setSdrCount}
                            min={1}
                            max={20}
                            step={1}
                            className="py-2"
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <Timer className="h-4 w-4 text-slate-500" /> Manual Research Hours (Weekly/SDR)
                            </label>
                            <span className="text-sm font-bold text-white bg-slate-800 px-2 py-1 rounded">{hoursPerWeek[0]} Hrs</span>
                        </div>
                        <Slider
                            value={hoursPerWeek}
                            onValueChange={setHoursPerWeek}
                            min={5}
                            max={40}
                            step={5}
                            className="py-2"
                        />
                    </div>
                </div>

                {/* Results */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                        <p className="text-xs text-slate-500 mb-1">Annual Savings</p>
                        <p className="text-2xl font-bold text-emerald-400">{formatCurrency(savings)}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                        <p className="text-xs text-slate-500 mb-1">Hours Reclaimed</p>
                        <p className="text-2xl font-bold text-blue-400">{formatNumber(hoursSaved)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
