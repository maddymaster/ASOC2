"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogPortal } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, CheckCircle2, Loader2, Send, Bot, User, Users as UsersIcon, Plus, Target, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMissionControl } from "@/context/MissionControlContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function CampaignWizardModal() {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<"upload" | "analyzing" | "chat">("upload");
    const [files, setFiles] = useState<File[]>([]);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
        { role: 'assistant', content: "I've analyzed your document. It seems you're launching a new 'Enterprise Security' product. Shall I target CISOs in FinTech?" }
    ]);

    // Mission Control Context
    const {
        setStrategy,
        setLeads,
        setExpertAnalysis,
        addToHistory,
        expertAnalysis,
        campaignConfig,
        setCampaignConfig,
        isStrategyApproved,
        setStrategyApproved,
        resetStrategy,
        selectedSector,
        setSelectedSector,
        setActiveTab
    } = useMissionControl();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const startAnalysis = async () => {
        if (files.length === 0) return;

        setStep("analyzing");
        let progress = 0;

        // Mock progress for visual feedback
        const interval = setInterval(() => {
            setAnalysisProgress(prev => {
                if (prev >= 90) return prev;
                return prev + 10;
            });
        }, 500);

        try {
            // Create FormData to send file
            const formData = new FormData();
            files.forEach(f => formData.append('files', f));

            // Call API
            const res = await fetch("/api/assistant/analyze-prd", {
                method: "POST",
                body: formData // No Content-Type header needed, browser sets it for FormData
            });

            const data = await res.json();

            clearInterval(interval);
            setAnalysisProgress(100);

            if (data.success && data.analysis) {
                const analysisWithMeta = {
                    ...data.analysis,
                    id: Math.random().toString(36).substr(2, 9),
                    timestamp: new Date().toISOString(),
                    fileName: files.map(f => f.name).join(', ')
                };

                setExpertAnalysis(analysisWithMeta);
                addToHistory(analysisWithMeta);

                // Update local chat
                setMessages(prev => [
                    ...prev,
                    {
                        role: 'assistant',
                        content: `I've analyzed ${files.length} document(s). \n\n${data.analysis.summary}\n\nI've identified ${data.analysis.sectors.length} key sectors. Check the "Strategy" tab for details!`
                    }
                ]);

                setTimeout(() => setStep("chat"), 800);
            } else {
                setMessages(prev => [
                    ...prev,
                    { role: 'assistant', content: "I encountered an issue analyzing the document. Please try again." }
                ]);
                setTimeout(() => setStep("chat"), 800);
            }

        } catch (error) {
            console.error("Analysis failed", error);
            clearInterval(interval);
            setStep("upload");
            setFiles([]); // Force re-upload to clear stale state
        }
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;

        const userMsg = chatInput;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setChatInput("");

        // If strategy is already approved, user shouldn't be chatting (UI handles this via disable), 
        // but as a safe guard:
        if (isStrategyApproved) return;

        // Call Refinement API
        setMessages(prev => [...prev, { role: 'assistant', content: "Refining strategy based on your feedback..." }]);

        try {
            const res = await fetch("/api/assistant/refine-strategy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentAnalysis: expertAnalysis,
                    userFeedback: userMsg
                })
            });
            const data = await res.json();

            if (data.success && data.analysis) {
                setExpertAnalysis(data.analysis);
                setMessages(prev => {
                    const newArr = [...prev];
                    newArr.pop(); // Remove "Refining..." loading message
                    return [...newArr, {
                        role: 'assistant',
                        content: `Strategy updated! I've adjusted the focus to: ${data.analysis.sectors[0].sector}. \n\nCheck the preview on the right.`
                    }];
                });
            }
        } catch (error) {
            console.error("Refinement failed", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't update the strategy. Please try again." }]);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="default"
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => {
                        resetStrategy();
                        setStep("upload");
                        setFiles([]);
                        setAnalysisProgress(0);
                        // Reset local chat state to remove "ghost" conversations
                        setMessages([
                            { role: 'assistant', content: "I've analyzed your document. It seems you're launching a new 'Enterprise Security' product. Shall I target CISOs in FinTech?" }
                        ]);
                    }}
                >
                    <Plus className="h-4 w-4 mr-2" /> New Campaign
                </Button>
            </DialogTrigger>

            {/* z-[9999] Modal with High Priority Isolation - Overriding default Dialog positioning */}
            <DialogPortal>
                <DialogPrimitive.Content className="fixed inset-0 z-[9999] grid place-items-center p-4 sm:p-6 outline-none focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">

                    {/* Backdrop overlay - z-[9998] */}
                    <div
                        className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-md"
                        onClick={() => setOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Modal Box - z-[10000] - 3-Column Layout */}
                    <div className="relative z-[10000] w-full max-w-7xl h-[85vh] bg-slate-950 rounded-2xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                        {/* Header */}
                        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-800 bg-slate-900/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <Sparkles className="h-5 w-5 text-purple-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white">New Campaign Wizard</h2>
                                    <p className="text-xs text-slate-400">AI-Driven Strategy & Execution</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                                <span className="sr-only">Close</span>
                                <span className="text-2xl text-slate-400 hover:text-white">&times;</span>
                            </Button>
                        </div>

                        {/* 3-Column Grid Content */}
                        <div className="grid grid-cols-10 h-full overflow-hidden">

                            {/* LEFT COLUMN (30%): Agent Supervisor Chat */}
                            <div className="col-span-3 border-r border-slate-800 bg-slate-900/20 flex flex-col h-full">
                                <div className="p-4 border-b border-slate-800/50">
                                    <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                                        <Bot className="h-4 w-4 text-purple-500" /> Agent Supervisor
                                    </h3>
                                </div>
                                <ScrollArea className="flex-1 p-4">
                                    <div className="space-y-4">
                                        {messages.map((msg, i) => (
                                            <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
                                                <div className={cn(
                                                    "p-3 rounded-lg text-sm max-w-[90%]",
                                                    msg.role === 'assistant' ? "bg-slate-800 text-slate-200" : "bg-purple-600 text-white"
                                                )}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                                <div className="p-4 border-t border-slate-800 bg-slate-900/40">
                                    <div className="flex gap-2">
                                        <Input
                                            className="bg-slate-950 border-slate-700 focus-visible:ring-purple-500"
                                            placeholder="Refine strategy..."
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                            disabled={step === "upload" || step === "analyzing" || isStrategyApproved}
                                        />
                                        <Button
                                            size="icon"
                                            onClick={handleSendMessage}
                                            disabled={step === "upload" || step === "analyzing" || isStrategyApproved}
                                            className="bg-purple-600 hover:bg-purple-700"
                                        >
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* MIDDLE COLUMN (40%): Strategic Context (Upload & Analysis) */}
                            <div className="col-span-4 flex flex-col h-full bg-slate-950/50 relative">
                                <div className="p-4 border-b border-slate-800/50 flex justify-between items-center">
                                    <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                                        <FileText className="h-4 w-4 text-blue-500" /> Strategic Context
                                    </h3>
                                    {files.length > 0 && (
                                        <span className="text-xs text-slate-500">{files.length} file(s) added</span>
                                    )}
                                </div>
                                <div className="flex-1 overflow-hidden p-6 relative">
                                    {step === "upload" && (
                                        <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/20 p-8 text-center hover:border-purple-500/30 transition-colors">
                                            <div className="bg-slate-800 p-4 rounded-full mb-4">
                                                <Upload className="h-8 w-8 text-slate-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-white mb-2">Upload Mission Data</h3>
                                            <p className="text-sm text-slate-400 mb-6 max-w-xs">
                                                Drag & drop multiple PRDs, Service Docs, or Sales Decks.
                                            </p>

                                            <Input
                                                id="file-upload"
                                                type="file"
                                                multiple
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />

                                            {files.length === 0 ? (
                                                <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()} className="border-slate-700 text-slate-300 hover:bg-slate-800">
                                                    Select Files
                                                </Button>
                                            ) : (
                                                <div className="space-y-4 w-full">
                                                    <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                                                        {files.map((f, idx) => (
                                                            <div key={idx} className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg border border-slate-800">
                                                                <FileText className="h-4 w-4 text-blue-400 shrink-0" />
                                                                <div className="flex-1 text-left truncate font-medium text-sm text-slate-300">
                                                                    {f.name}
                                                                </div>
                                                                <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-500 hover:text-red-400" onClick={() => removeFile(idx)}>
                                                                    <span className="sr-only">Remove</span>&times;
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-3 pt-2">
                                                        <Button variant="outline" className="flex-1 border-slate-700 text-slate-300" onClick={() => document.getElementById('file-upload')?.click()}>
                                                            Add More
                                                        </Button>
                                                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={startAnalysis}>
                                                            Analyze All
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {step === "analyzing" && (
                                        <div className="h-full flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
                                                <Loader2 className="h-16 w-16 text-purple-500 animate-spin relative z-10" />
                                            </div>
                                            <div className="text-center space-y-3 max-w-xs">
                                                <h3 className="text-xl font-bold text-white">Processing Context...</h3>
                                                <p className="text-sm text-slate-400">Extracting ICPs, Value Props, and Objections from {files.length} document(s).</p>
                                            </div>
                                            <div className="w-full max-w-xs h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
                                                    style={{ width: `${analysisProgress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {step === "chat" && expertAnalysis && (
                                        <div className="h-full overflow-y-auto space-y-4 pr-2">
                                            {expertAnalysis.sectors.map((sector, idx) => (
                                                <div key={idx} className="border border-purple-500/30 rounded-xl p-5 bg-purple-500/5 relative overflow-hidden group hover:border-purple-500/50 transition-colors">
                                                    <div className="absolute top-0 right-0 bg-purple-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-bl-lg">
                                                        Top Strategy
                                                    </div>
                                                    <h4 className="font-bold text-lg text-white mb-2">{sector.sector}</h4>
                                                    <p className="text-sm text-slate-300 mb-4 leading-relaxed">{sector.valueProposition}</p>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1">
                                                            <span className="text-xs font-semibold text-slate-500 uppercase">Target Roles</span>
                                                            <div className="flex flex-wrap gap-1">
                                                                {sector.targetRoles.slice(0, 3).map((role, rAx) => (
                                                                    <span key={rAx} className="text-xs bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                                                                        {role}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <span className="text-xs font-semibold text-slate-500 uppercase">Pain Points</span>
                                                            <div className="flex flex-wrap gap-1">
                                                                {sector.painPoints.slice(0, 2).map((pp, pAx) => (
                                                                    <span key={pAx} className="text-xs bg-red-900/20 text-red-300 px-1.5 py-0.5 rounded border border-red-900/30">
                                                                        {pp}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                                                <h5 className="text-xs font-bold text-slate-500 uppercase mb-3">Analysis Summary</h5>
                                                <p className="text-sm text-slate-400 leading-relaxed">
                                                    {expertAnalysis.summary}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT COLUMN (30%): Campaign Configuration */}
                            <div className="col-span-3 border-l border-slate-800 bg-slate-900/20 flex flex-col h-full">
                                <div className="p-4 border-b border-slate-800/50">
                                    <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-200">
                                        <Target className="h-4 w-4 text-green-500" /> Campaign Config
                                    </h3>
                                </div>
                                <div className="flex-1 p-6 space-y-6 overflow-y-auto">

                                    <div className="space-y-3">
                                        <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Outreach Channels</Label>
                                        <ConfigCard
                                            title="Email Sequence"
                                            icon={<FileText className="h-4 w-4" />}
                                            active={campaignConfig.emailSequence}
                                            onClick={() => setCampaignConfig(p => ({ ...p, emailSequence: !p.emailSequence }))}
                                        />
                                        <ConfigCard
                                            title="AI Voice Agent"
                                            icon={<Bot className="h-4 w-4" />}
                                            active={campaignConfig.outboundVoice}
                                            onClick={() => setCampaignConfig(p => ({ ...p, outboundVoice: !p.outboundVoice }))}
                                        />
                                        <ConfigCard
                                            title="Inbound Receptionist"
                                            icon={<User className="h-4 w-4" />}
                                            active={campaignConfig.inboundReceptionist}
                                            onClick={() => setCampaignConfig(p => ({ ...p, inboundReceptionist: !p.inboundReceptionist }))}
                                        />
                                    </div>

                                    <div className="pt-4 border-t border-slate-800">
                                        <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3 block">Approval Status</Label>
                                        {isStrategyApproved ? (
                                            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-center gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-green-400" />
                                                <div>
                                                    <p className="text-sm font-bold text-green-400">Strategy Approved</p>
                                                    <p className="text-xs text-green-300/70">Ready for execution</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-center gap-3">
                                                <Loader2 className="h-5 w-5 text-amber-400 animate-pulse" />
                                                <div>
                                                    <p className="text-sm font-bold text-amber-400">Pending Approval</p>
                                                    <p className="text-xs text-amber-300/70">Review analysis first</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>

                                {/* Footer Actions */}
                                <div className="p-6 border-t border-slate-800 bg-slate-900/40 space-y-3">
                                    {!isStrategyApproved ? (
                                        <Button
                                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 text-sm shadow-lg shadow-green-900/20"
                                            onClick={() => {
                                                setStrategyApproved(true);
                                                // Don't close yet, user might want to launch immediately
                                                toast.success("Strategy Approved!");
                                            }}
                                            disabled={!expertAnalysis || step !== 'chat'}
                                        >
                                            <CheckCircle2 className="h-4 w-4 mr-2" /> Approve Strategy
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            className="w-full border-slate-700 text-slate-400 hover:text-white"
                                            onClick={() => setStrategyApproved(false)}
                                        >
                                            Modify Strategy
                                        </Button>
                                    )}

                                    <Button
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-sm shadow-lg shadow-blue-900/20"
                                        disabled={!isStrategyApproved}
                                        onClick={() => {
                                            setOpen(false);
                                            setActiveTab('lead-gen');
                                            // The LeadGenTab will auto-fetch based on strategy
                                        }}
                                    >
                                        <UsersIcon className="h-4 w-4 mr-2" /> Find Leads & Exec
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </div>
                </DialogPrimitive.Content>
            </DialogPortal>
        </Dialog>
    );
}

function ConfigCard({ title, icon, active, onClick }: any) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "cursor-pointer border rounded-lg p-3 flex flex-col gap-2 transition-all",
                active ? "bg-purple-600/10 border-purple-600 text-purple-600" : "bg-muted hover:bg-muted/80 text-muted-foreground"
            )}
        >
            <div className="flex justify-between items-center">
                {icon}
                <div className={cn("w-3 h-3 rounded-full border", active ? "bg-purple-600 border-purple-600" : "border-gray-400")} />
            </div>
            <span className="text-xs font-semibold">{title}</span>
        </div>
    )
}

function StepItem({ icon: Icon, label, active, completed }: any) {
    return (
        <div className={cn(
            "flex items-center gap-3 p-2 rounded-lg transition-all",
            active ? "bg-blue-500/10 text-blue-400" : "text-slate-500",
            completed ? "text-green-400" : ""
        )}>
            <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border transition-colors bg-slate-950 z-10",
                active ? "border-blue-500 text-blue-400" : "border-slate-700",
                completed ? "border-green-500 bg-green-500/10 text-green-400" : ""
            )}>
                {completed ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
            </div>
            <span className={cn("text-sm font-medium", active ? "text-white" : "")}>{label}</span>
        </div>
    )
}
