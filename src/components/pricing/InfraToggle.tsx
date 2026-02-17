"use client";

import { Info, Phone, Server, Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface InfraToggleProps {
    show: boolean;
    onToggle: (val: boolean) => void;
}

export function InfraToggle({ show, onToggle }: InfraToggleProps) {
    return (
        <div className="flex flex-col items-center animate-in fade-in duration-700">
            <div className="flex items-center justify-center gap-3 p-1.5 pl-4 pr-2 bg-slate-900/80 rounded-full border border-slate-800 backdrop-blur-sm">
                <Label htmlFor="infra-mode" className={`text-sm font-medium transition-colors ${!show ? 'text-white' : 'text-slate-500'}`}>
                    Platform Only
                </Label>
                <Switch
                    id="infra-mode"
                    checked={show}
                    onCheckedChange={onToggle}
                    className="data-[state=checked]:bg-blue-600"
                />
                <Label htmlFor="infra-mode" className={`text-sm font-medium transition-colors cursor-pointer ${show ? 'text-white' : 'text-slate-500'}`}>
                    Show Logic & Infrastructure Cost
                </Label>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center cursor-help hover:bg-slate-700 transition-colors">
                                <Info className="h-3 w-3 text-slate-400" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 border-slate-800 text-slate-300 max-w-xs p-3">
                            <p>We believe in radical transparency. We pass through telephony, data, and inference costs at near-zero markup.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className={`
                mt-4 grid grid-cols-3 gap-3 w-full max-w-lg transition-all duration-500 overflow-hidden
                ${show ? 'opacity-100 max-h-24 translate-y-0' : 'opacity-0 max-h-0 -translate-y-4'}
            `}>
                <CostItem icon={<Phone className="h-3 w-3" />} label="Retell AI" cost="$0.12" unit="/min" color="text-blue-400" bg="bg-blue-950/30" border="border-blue-900/50" />
                <CostItem icon={<Server className="h-3 w-3" />} label="Vapi" cost="$0.10" unit="/min" color="text-purple-400" bg="bg-purple-950/30" border="border-purple-900/50" />
                <CostItem icon={<Search className="h-3 w-3" />} label="Apollo" cost="$0.02" unit="/lead" color="text-emerald-400" bg="bg-emerald-950/30" border="border-emerald-900/50" />
            </div>
        </div>
    );
}

function CostItem({ icon, label, cost, unit, color, bg, border }: any) {
    return (
        <div className={`flex flex-col items-center justify-center p-2 rounded-lg border ${bg} ${border}`}>
            <div className={`flex items-center gap-1.5 ${color} mb-1`}>
                {icon}
                <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
            </div>
            <div className="text-sm font-mono text-slate-300">
                <span className="font-bold text-white">{cost}</span>
                <span className="text-slate-500 text-xs">{unit}</span>
            </div>
        </div>
    );
}
