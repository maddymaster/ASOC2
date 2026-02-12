"use client";

import { useMissionControl } from "@/context/MissionControlContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Target, Lightbulb, AlertTriangle, ArrowRight, Clock, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function StrategyCanvas() {
    const { expertAnalysis, setStrategy, resetStrategy, analysisHistory, setExpertAnalysis, setActiveTab, setSelectedSector } = useMissionControl();

    if (!expertAnalysis && analysisHistory.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 border-2 border-dashed rounded-lg bg-muted/10">
                <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Strategy Analyzed Yet</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                    Upload a PRD or product description in the "New Campaign" wizard to let our Expert Agent identify your best target markets.
                </p>
            </div>
        );
    }

    const activeAnalysis = expertAnalysis || analysisHistory[0];
    const { summary, sectors } = activeAnalysis;

    const handleApplyStrategy = (sector: any) => {
        setSelectedSector(sector.sector);
        setStrategy({
            industry: sector.sector,
            geo: "Global",
            companySize: "Mid-Market",
            targetRole: sector.targetRoles[0],
            domain: "",
            rationale: sector.rationale
        });
        setActiveTab("lead-gen");
    };

    return (
        <div className="grid grid-cols-12 gap-6 h-full">
            {/* History Sidebar */}
            <div className="col-span-12 md:col-span-3 lg:col-span-2 border-r border-border/50 pr-4 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-2">
                    <Clock className="h-4 w-4" /> History
                </div>
                <ScrollArea className="flex-1 -mr-2 pr-2">
                    <div className="space-y-2">
                        {analysisHistory.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setExpertAnalysis(item)}
                                className={cn(
                                    "w-full text-left p-3 rounded-lg border text-sm transition-colors hover:bg-accent",
                                    activeAnalysis.id === item.id ? "bg-accent border-primary/50" : "border-transparent bg-muted/20"
                                )}
                            >
                                <div className="font-medium truncate">{item.fileName || "Unknown PRD"}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : "Just now"}
                                </div>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
                <div className="mt-auto">
                    <Button variant="outline" size="sm" onClick={resetStrategy} className="w-full gap-2">
                        <Plus className="h-4 w-4" /> New Analysis
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="col-span-12 md:col-span-9 lg:col-span-10 flex flex-col space-y-6 h-full">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Target className="h-5 w-5 text-primary" />
                                {activeAnalysis.id ? `Analysis: ${activeAnalysis.fileName}` : "PRD Analysis Summary"}
                            </CardTitle>
                            <CardDescription className="text-base text-foreground/90 mt-2">
                                {summary}
                            </CardDescription>
                        </div>
                    </CardHeader>
                </Card>

                <ScrollArea className="flex-1 -mx-6 px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                        {sectors.map((sector, idx) => (
                            <Card key={idx} className="flex flex-col h-full hover:shadow-lg transition-shadow border-t-4 border-t-primary">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <Badge variant="secondary" className="mb-2 text-primary bg-primary/10">
                                            Recommendation #{idx + 1}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-xl">{sector.sector}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 flex-1 flex flex-col">
                                    <section>
                                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                            <Lightbulb className="h-4 w-4 text-amber-500" /> Rationale
                                        </h4>
                                        <p className="text-sm text-muted-foreground">{sector.rationale}</p>
                                    </section>

                                    <section>
                                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                            <Users className="h-4 w-4 text-blue-500" /> Target Roles
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {sector.targetRoles.map((role, rIdx) => (
                                                <Badge key={rIdx} variant="outline">{role}</Badge>
                                            ))}
                                        </div>
                                    </section>

                                    <section>
                                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                            <Target className="h-4 w-4 text-green-500" /> Strategy Mix
                                        </h4>
                                        <p className="text-sm font-medium text-green-400">
                                            {sector.strategyMix || "Multi-channel approach recommended."}
                                        </p>
                                    </section>

                                    <section>
                                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4 text-red-500" /> Pain Points
                                        </h4>
                                        <ul className="text-sm text-muted-foreground list-disc list-inside">
                                            {sector.painPoints.slice(0, 3).map((pt, pIdx) => (
                                                <li key={pIdx}>{pt}</li>
                                            ))}
                                        </ul>
                                    </section>

                                    <div className="mt-auto pt-6">
                                        <Button className="w-full group" onClick={() => handleApplyStrategy(sector)}>
                                            Target this Sector
                                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}

function Users({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}
