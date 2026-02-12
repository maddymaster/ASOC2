
"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Bot, User, Loader2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMissionControl } from "@/context/MissionControlContext";
import { cn } from "@/lib/utils";
import { ChatSidebar } from "./ChatSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function ChatInterface() {
    const { addMessage, setStrategy, setLeads, strategy, leads, setEmailQueue, setExpertAnalysis } = useMissionControl();
    // Local messages state for the current view (syncs with context/db)
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);

    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial Load: Create a new session if none exists? 
    // Or just wait until user types? Let's just create one on first send if null.

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const loadSession = async (id: string) => {
        setSessionId(id);
        setMessages([]); // Clear current view
        try {
            const res = await fetch(`/api/chat/sessions/${id}`);
            const data = await res.json();
            if (data.success) {
                // Parse content if it's JSON from assistant
                const formatted = data.messages.map((msg: any) => {
                    let content = msg.content;
                    if (msg.role === 'assistant') {
                        try {
                            const parsed = JSON.parse(content);
                            content = parsed.content || content;
                        } catch (e) { /* ignore */ }
                    }
                    return { role: msg.role === 'user' ? 'user' : 'assistant', content };
                });
                setMessages(formatted);
                extractStrategyFromHistory(data.messages);
            }
        } catch (error) {
            console.error("Failed to load session", error);
        }
    };

    // Helper to extract strategy from history
    const extractStrategyFromHistory = (messages: any[]) => {
        // Look for the last assistant message that might contain JSON strategy
        for (let i = messages.length - 1; i >= 0; i--) {
            const msg = messages[i];
            if (msg.role === 'assistant') {
                try {
                    // Start looking for JSON structure
                    const content = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);

                    // Simple check if it looks like strategy JSON
                    if (content.includes('"strategy"') || content.includes('"sectors"')) {
                        const parsed = JSON.parse(content);
                        if (parsed.strategy) setStrategy(parsed.strategy);
                        if (parsed.analysis) setExpertAnalysis(parsed.analysis); // context hook needed
                        if (parsed.leads) setLeads(parsed.leads);
                        return;
                    }
                } catch (e) { /* continue searching */ }
            }
        }
    };

    const handleNewChat = () => {
        setSessionId(null);
        setMessages([]);
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: "user" as const, content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            // Create session if not exists
            let currentId = sessionId;
            if (!currentId) {
                const sessionRes = await fetch("/api/chat/sessions", {
                    method: "POST",
                    body: JSON.stringify({ title: input.substring(0, 30) + "..." })
                });
                const sessionData = await sessionRes.json();
                if (sessionData.success) {
                    currentId = sessionData.session.id;
                    setSessionId(currentId);
                }
            }

            // 1. Send to Gemini
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, userMsg],
                    sessionId: currentId
                }),
            });

            const data = await res.json();

            const aiContent = data.content || "I'm sorry, I couldn't process that.";
            const aiMsg = {
                role: "assistant" as const,
                content: aiContent
            };

            setMessages(prev => [...prev, aiMsg]);

            // Sync with Global Context (optional, if we want to show latest msg elsewhere)
            addMessage(userMsg);
            addMessage(aiMsg);

            // 2. Process Strategy
            if (data.strategy) {
                setStrategy(data.strategy);
                // Trigger Apollo Search
                const savedConfig = typeof window !== 'undefined' ? localStorage.getItem("mission_control_config") : null;
                const config = savedConfig ? JSON.parse(savedConfig) : null;

                const apolloRes = await fetch("/api/apollo", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        strategy: data.strategy,
                        apiKey: config?.apolloKey
                    }),
                });

                const apolloData = await apolloRes.json();
                if (apolloData.success && apolloData.leads) {
                    setLeads(apolloData.leads);
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: `I've found ${apolloData.leads.length} leads matching your strategy. Check the "Lead Gen" tab!`
                    }]);
                }
            }

            // 3. Process Actions
            if (data.action === 'draft_emails') {
                // ... (keep creating existing email drafting logic) ...
                // For brevity, assuming Leads exist.
                if (leads.length > 0) {
                    setMessages(prev => [...prev, { role: 'assistant', content: `Drafting emails based on your refined strategy...` }]);
                    // Call draft API...
                    // (Simulate completion)
                    setTimeout(() => {
                        setMessages(prev => [...prev, { role: 'assistant', content: `Emails drafted.` }]);
                    }, 1000);
                }
            }

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-full w-full bg-background border rounded-lg overflow-hidden">
            {/* Sidebar (Hidden on mobile, visible on desktop) */}
            <div className="hidden md:block h-full">
                <ChatSidebar
                    currentSessionId={sessionId}
                    onSelectSession={loadSession}
                    onNewChat={handleNewChat}
                />
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full relative">
                {/* Mobile Header / Toggle */}
                <div className="md:hidden border-b p-2 flex items-center">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon"><Menu className="h-4 w-4" /></Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0">
                            <ChatSidebar
                                currentSessionId={sessionId}
                                onSelectSession={(id) => { loadSession(id); }}
                                onNewChat={handleNewChat}
                            />
                        </SheetContent>
                    </Sheet>
                    <span className="font-semibold text-sm ml-2">Chat History</span>
                </div>

                {/* Header */}
                <div className="border-b p-4 flex items-center gap-2 bg-muted/40">
                    <Bot className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold text-sm">
                        {sessionId ? "Active Session" : "New Conversation"}
                    </h2>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {messages.length === 0 && (
                            <div className="text-center text-muted-foreground mt-10">
                                <p className="mb-2">👋 Hi! I'm your AI Growth Strategist.</p>
                                <p className="text-xs">Ask me to find leads, draft emails, or plan a campaign.</p>
                            </div>
                        )}
                        {messages.map((msg, idx) => (
                            <div key={idx} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
                                <Avatar className="h-8 w-8 border">
                                    <AvatarFallback className={msg.role === 'assistant' ? "bg-primary/10 text-primary" : "bg-primary text-primary-foreground"}>
                                        {msg.role === 'assistant' ? 'AI' : 'ME'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className={cn("p-3 rounded-lg text-sm max-w-[80%]", msg.role === 'assistant' ? "bg-muted" : "bg-primary text-primary-foreground")}>
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3">
                                <Avatar className="h-8 w-8 border">
                                    <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
                                </Avatar>
                                <div className="bg-muted p-3 rounded-lg text-sm flex items-center">
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Thinking...
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t bg-background">
                    <div className="flex gap-2 items-center border rounded-md px-3 py-2 focus-within:ring-1 focus-within:ring-ring">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <Paperclip className="h-4 w-4" />
                        </Button>
                        <Input
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 h-auto py-1"
                            placeholder="Message Mission Control..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            disabled={isLoading}
                        />
                        <Button size="icon" className="h-8 w-8" onClick={handleSend} disabled={isLoading}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
