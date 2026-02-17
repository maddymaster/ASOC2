"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Timer, DollarSign, Users, TrendingUp, Info, ArrowRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ROICalculatorProps {
    onLeadsChange?: (leads: number) => void;
}

export function ROICalculator({ onLeadsChange }: ROICalculatorProps) {
    // Inputs
    const [teamSize, setTeamSize] = useState([5]); // Default: 5 SDRs
    const [researchTime, setResearchTime] = useState([0.5]); // Default: 30 mins per lead
    const [salary, setSalary] = useState([85000]); // Default: $85k fully loaded
    const [monthlyLeads, setMonthlyLeads] = useState([500]); // Default: 500 leads/mo

    useEffect(() => {
        if (onLeadsChange) {
            onLeadsChange(monthlyLeads[0]);
        }
    }, [monthlyLeads, onLeadsChange]);

    // Constants
    const WORK_HOURS_PER_YEAR = 2000;
    const INFRA_COST_PER_LEAD = 0.05; // Enrichment
    const INFRA_COST_VOICE_PER_MIN = 0.12;
    const AVG_MINS_PER_LEAD = 2; // Conservative estimate for voice agent duration per lead attempted/connected

    // Derived Metrics
    const hourlyRate = salary[0] / WORK_HOURS_PER_YEAR; // $85k / 2000 = $42.5/hr

    // 1. Manual Cost Calculation
    // Cost per lead = (Hourly Rate * Research Time)
    const manualCostPerLead = hourlyRate * researchTime[0];
    const totalManualCostMonthly = manualCostPerLead * monthlyLeads[0];
    const totalManualCostAnnual = totalManualCostMonthly * 12;

    // 2. MissionControl Cost Calculation
    // Plan Fee Logic
    let planFee = 499; // Starter
    if (monthlyLeads[0] > 1000) planFee = 1499; // Growth
    if (monthlyLeads[0] > 5000) planFee = 3500; // Enterprise (Estimated base)

    // Infra Cost = (Enrichment + Voice) * Leads
    const infraCostMonthly = (INFRA_COST_PER_LEAD + (INFRA_COST_VOICE_PER_MIN * AVG_MINS_PER_LEAD)) * monthlyLeads[0];

    const totalMCCostMonthly = planFee + infraCostMonthly;
    const mcCostPerLead = totalMCCostMonthly / monthlyLeads[0];
    const totalMCCostAnnual = totalMCCostMonthly * 12;

    // 3. Savings & Efficiency
    const annualSavings = totalManualCostAnnual - totalMCCostAnnual;
    const hoursReclaimed = teamSize[0] * researchTime[0] * monthlyLeads[0] * 12; // Wait, researchTime * leads is total hours spent manually.
    // Actually, logic: Manual hours = ResearchTime * MonthlyLeads * 12. 
    // MissionControl is instant. So reclaimed is effectively all of it.
    // But let's scale by Team Size? No, "Monthly Leads" is total target. 
    // Usually Team Size implies capacity. Let's assume the "Monthly Leads" is the TOTAL target for the org.
    const totalManualHoursAnnual = researchTime[0] * monthlyLeads[0] * 12;


    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    const formatNumber = (val: number) => new Intl.NumberFormat('en-US').format(val);

    return (
        <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden">
            <CardHeader className="border-b border-white/5 pb-8">
                <CardTitle className="text-2xl text-white flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-blue-500" />
                    Economic Impact Analysis
                </CardTitle>
                <CardDescription className="text-slate-400 text-base">
                    Compare the cost of scaling manually vs. with MissionControl's autonomous agents.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid lg:grid-cols-12 gap-12 pt-8">
                {/* Inputs Column */}
                <div className="lg:col-span-5 space-y-8">
                    {/* Team Size */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <Users className="h-4 w-4 text-slate-500" /> Current SDR Team
                            </label>
                            <span className="text-sm font-bold text-white bg-slate-800 px-3 py-1 rounded-md border border-white/5">{teamSize[0]}</span>
                        </div>
                        <Slider value={teamSize} onValueChange={setTeamSize} min={1} max={50} step={1} className="py-2" />
                    </div>

                    {/* Salary */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-slate-500" /> Avg. Fully Loaded Salary
                            </label>
                            <span className="text-sm font-bold text-white bg-slate-800 px-3 py-1 rounded-md border border-white/5">{formatCurrency(salary[0])}</span>
                        </div>
                        <Slider value={salary} onValueChange={setSalary} min={40000} max={200000} step={5000} className="py-2" />
                    </div>

                    {/* Monthly Leads */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-slate-500" /> Monthly Leads Target
                            </label>
                            <span className="text-sm font-bold text-white bg-slate-800 px-3 py-1 rounded-md border border-white/5">{formatNumber(monthlyLeads[0])}</span>
                        </div>
                        <Slider value={monthlyLeads} onValueChange={setMonthlyLeads} min={100} max={10000} step={100} className="py-2" />
                        <p className="text-xs text-slate-500">Updates recommended plan automatically.</p>
                    </div>

                    {/* Research Time */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <Timer className="h-4 w-4 text-slate-500" /> Manual Hours / Lead
                            </label>
                            <span className="text-sm font-bold text-white bg-slate-800 px-3 py-1 rounded-md border border-white/5">{researchTime[0]} hrs</span>
                        </div>
                        <Slider value={researchTime} onValueChange={setResearchTime} min={0.1} max={2.0} step={0.1} className="py-2" />
                        <p className="text-xs text-slate-500">Research, drafting, CRM entry.</p>
                    </div>
                </div>

                {/* Results Column */}
                <div className="lg:col-span-7 bg-slate-950/50 rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
                    {/* Top Metrics */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="space-y-1">
                            <p className="text-sm text-slate-500 font-medium">Manual Cost / Lead</p>
                            <p className="text-3xl font-bold text-slate-300">{formatCurrency(manualCostPerLead)}</p>
                            <p className="text-xs text-red-400">Inefficient scaling</p>
                        </div>
                        <div className="space-y-1 relative">
                            <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                                MC Cost / Lead
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Info className="h-3.5 w-3.5 text-slate-600 hover:text-blue-400 transition-colors" />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-slate-900 border-slate-800 p-3 max-w-xs">
                                            <p className="font-bold text-white mb-1">No AI Tax</p>
                                            <p className="text-xs text-slate-400">
                                                Traditional agencies charge 30-40% markup on top of tools. We pass through infrastructure costs directly.
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </p>
                            <p className="text-3xl font-bold text-blue-400">{formatCurrency(mcCostPerLead)}</p>
                            <p className="text-xs text-emerald-400 flex items-center gap-1">
                                <ArrowRight className="h-3 w-3" />
                                {Math.round(((manualCostPerLead - mcCostPerLead) / manualCostPerLead) * 100)}% Cheaper
                            </p>
                        </div>
                    </div>

                    {/* Chart Visualization */}
                    <div className="flex-1 min-h-[150px] flex items-end gap-8 pb-4 border-b border-white/5 mb-6 px-4">
                        {/* Manual Bar */}
                        <div className="w-full flex flex-col gap-2 group">
                            <div className="relative w-full bg-slate-800 rounded-t-lg overflow-hidden h-[150px]">
                                <div
                                    className="absolute bottom-0 w-full bg-slate-700/50 transition-all duration-500 group-hover:bg-slate-700"
                                    style={{ height: '100%' }} // Represents high cost
                                />
                            </div>
                            <span className="text-xs font-medium text-slate-400 text-center">Manual Approach</span>
                        </div>

                        {/* MC Bar */}
                        <div className="w-full flex flex-col gap-2 group">
                            <div className="relative w-full bg-slate-800 rounded-t-lg overflow-hidden h-[150px]">
                                <div
                                    className="absolute bottom-0 w-full bg-blue-600/20 transition-all duration-500 group-hover:bg-blue-600/40 border-t-2 border-blue-500"
                                    style={{ height: `${(mcCostPerLead / manualCostPerLead) * 100}%` }}
                                />
                            </div>
                            <span className="text-xs font-bold text-blue-400 text-center">MissionControl</span>
                        </div>
                    </div>

                    {/* Verification / Total Savings */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-400">Total Annual Savings</p>
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                {formatNumber(totalManualHoursAnnual)} Hours Reclaimed
                            </Badge>
                        </div>
                        <p className="text-5xl font-bold text-white tracking-tight">
                            {formatCurrency(annualSavings)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

import { Badge } from "@/components/ui/badge";
