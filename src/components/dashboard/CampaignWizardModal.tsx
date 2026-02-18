"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, CheckCircle2, Loader2, Send, Bot, User, Plus, Target, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMissionControl } from "@/context/MissionControlContext";
import { cn } from "@/lib/utils";

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

            {/* z-[9999] Modal with High Priority Isolation */}
            <DialogContent className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 border-0 bg-transparent gap-0 max-w-none w-full h-full pointer-events-none">
                {/* Backdrop overlay - z-[9998] */}
                <div
                    className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-md pointer-events-auto"
                    onClick={() => setOpen(false)}
                    aria-hidden="true"
                />

                {/* Modal content - z-[9999] - Centered & Responsive */}
                <div className="relative z-[9999] w-full max-w-5xl h-[90vh] max-h-[90vh] bg-slate-900 rounded-xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden pointer-events-auto animate-in zoom-in-95 duration-200">
                    <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-700">
                        <DialogTitle>New Campaign Wizard</DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-hidden p-1">
                        {step === "upload" && (
                            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-xl bg-muted/10 p-10 text-center">
                                <div className="bg-muted p-4 rounded-full mb-4">
                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Upload Context</h3>
                                <div className="flex items-center gap-1.5 mb-6 bg-blue-500/10 px-2 py-1 rounded text-blue-300 border border-blue-500/20">
                                    <Sparkles className="h-3 w-3" />
                                    <span className="text-[10px] font-medium tracking-wide">Powered by Gemini 1.5 Pro (Multimodal Vision)</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                                    Drag and drop your PRD, Service Document, or Sales Deck (PDF, TXT).
                                </p>

                                <Input
                                    id="file-upload"
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileChange}
                                />

                                {files.length === 0 ? (
                                    <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                                        Select Files
                                    </Button>
                                ) : (
                                    <div className="space-y-4 w-full px-10">
                                        <div className="max-h-40 overflow-y-auto space-y-2">
                                            {files.map((f, idx) => (
                                                <div key={idx} className="flex items-center gap-3 p-3 bg-muted rounded-lg border">
                                                    <FileText className="h-5 w-5 text-purple-500" />
                                                    <div className="flex-1 text-left truncate font-medium text-sm">
                                                        {f.name}
                                                    </div>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => removeFile(idx)}>
                                                        <span className="sr-only">Remove</span>x
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" className="flex-1" onClick={() => document.getElementById('file-upload')?.click()}>
                                                Add More
                                            </Button>
                                            <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={startAnalysis}>
                                                Analyze {files.length} Document{files.length > 1 ? 's' : ''}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {step === "analyzing" && (
                            <div className="h-full flex flex-col items-center justify-center space-y-6">
                                <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
                                <div className="text-center space-y-2">
                                    <h3 className="text-lg font-semibold">Analyzing Documents...</h3>
                                    <p className="text-sm text-muted-foreground">Extracting ICP, Value Props, and Objections.</p>
                                </div>
                                <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-purple-600 transition-all duration-200"
                                        style={{ width: `${analysisProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}


                        {step === "chat" && (
                            <div className="grid grid-cols-12 h-full gap-6">
                                {/* LEFT: Supervisor Chat */}
                                <div className="col-span-5 flex flex-col h-full border-r pr-6">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <Bot className="h-5 w-5 text-purple-600" /> Agent Supervisor
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Refine the strategy or ask for adjustments.
                                        </p>
                                    </div>

                                    <ScrollArea className="flex-1 pr-4 mb-4">
                                        <div className="space-y-4">
                                            {messages.map((msg, i) => (
                                                <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
                                                    <div className={cn(
                                                        "p-3 rounded-lg text-sm max-w-[90%]",
                                                        msg.role === 'assistant' ? "bg-muted" : "bg-purple-600 text-white"
                                                    )}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>

                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="E.g., 'Target only SaaS companies'..."
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                            disabled={isStrategyApproved}
                                        />
                                        <Button size="icon" onClick={handleSendMessage} disabled={isStrategyApproved}>
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* RIGHT: Strategy & Config */}
                                <div className="col-span-7 flex flex-col h-full overflow-hidden">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <Target className="h-5 w-5 text-primary" /> Campaign Configuration
                                        </h3>
                                        {isStrategyApproved ? (
                                            <span className="flex items-center gap-1 text-green-500 text-sm font-bold bg-green-500/10 px-2 py-1 rounded">
                                                <CheckCircle2 className="h-4 w-4" /> APPROVED
                                            </span>
                                        ) : (
                                            <span className="text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded font-medium">
                                                Pending Approval
                                            </span>
                                        )}
                                    </div>

                                    <ScrollArea className="flex-1 pr-2 mb-4">
                                        <div className="space-y-6">
                                            {/* Toggles */}
                                            <div className="grid grid-cols-3 gap-4">
                                                <ConfigCard
                                                    title="Email Sequence"
                                                    icon={<FileText className="h-4 w-4" />}
                                                    active={campaignConfig.emailSequence}
                                                    onClick={() => setCampaignConfig(p => ({ ...p, emailSequence: !p.emailSequence }))}
                                                />
                                                <ConfigCard
                                                    title="Outbound Voice"
                                                    icon={<Bot className="h-4 w-4" />}
                                                    active={campaignConfig.outboundVoice}
                                                    onClick={() => setCampaignConfig(p => ({ ...p, outboundVoice: !p.outboundVoice }))}
                                                />
                                                <ConfigCard
                                                    title="Inbound Reception"
                                                    icon={<User className="h-4 w-4" />}
                                                    active={campaignConfig.inboundReceptionist}
                                                    onClick={() => setCampaignConfig(p => ({ ...p, inboundReceptionist: !p.inboundReceptionist }))}
                                                />
                                            </div>

                                            {/* Strategy Preview */}
                                            {expertAnalysis?.sectors.slice(0, 1).map((sector, idx) => (
                                                <div key={idx} className="border rounded-xl p-4 bg-muted/20">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-semibold text-base">{sector.sector}</h4>
                                                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Top Pick</span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-3">{sector.valueProposition}</p>

                                                    <div className="space-y-2">
                                                        <div className="flex gap-2 text-xs">
                                                            <span className="font-semibold text-purple-600">Roles:</span>
                                                            <span>{sector.targetRoles.join(", ")}</span>
                                                        </div>
                                                        <div className="flex gap-2 text-xs">
                                                            <span className="font-semibold text-green-600">Mix:</span>
                                                            <span>{sector.strategyMix || "Standard Outreach"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>

                                    <div className="border-t pt-4 flex gap-3">
                                        {!isStrategyApproved ? (
                                            <Button
                                                className="flex-1 bg-green-600 hover:bg-green-700"
                                                onClick={() => {
                                                    setStrategyApproved(true);
                                                    setActiveTab('lead-gen');
                                                    setOpen(false);
                                                }}
                                            >
                                                <CheckCircle2 className="h-4 w-4 mr-2" /> Approve & Find Leads
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                className="flex-1"
                                                onClick={() => setStrategyApproved(false)}
                                            >
                                                Modify Strategy
                                            </Button>
                                        )}

                                        <Button
                                            className="flex-1"
                                            disabled={!isStrategyApproved}
                                            onClick={() => {
                                                setOpen(false);
                                                setActiveTab('email-campaigns');
                                            }}
                                        >
                                            Launch Campaign
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
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
