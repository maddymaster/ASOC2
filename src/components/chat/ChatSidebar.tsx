"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatSession {
    id: string;
    title: string;
    updatedAt: string;
}

interface ChatSidebarProps {
    currentSessionId: string | null;
    onSelectSession: (id: string) => void;
    onNewChat: () => void;
}

export function ChatSidebar({ currentSessionId, onSelectSession, onNewChat }: ChatSidebarProps) {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSessions();
    }, [currentSessionId]); // Refetch when session changes (e.g. after creating new one)

    const fetchSessions = async () => {
        try {
            const res = await fetch("/api/chat/sessions");
            const data = await res.json();
            if (data.success) {
                setSessions(data.sessions);
            }
        } catch (error) {
            console.error("Failed to load sessions", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-64 border-r h-full flex flex-col bg-muted/10">
            <div className="p-4 border-b">
                <Button onClick={onNewChat} className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> New Chat
                </Button>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    {loading ? (
                        <div className="flex justify-center p-4"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
                    ) : sessions.length === 0 ? (
                        <div className="text-center text-xs text-muted-foreground p-4">No history yet.</div>
                    ) : (
                        sessions.map(session => (
                            <Button
                                key={session.id}
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start text-xs font-normal truncate",
                                    currentSessionId === session.id ? "bg-muted font-medium" : "text-muted-foreground"
                                )}
                                onClick={() => onSelectSession(session.id)}
                            >
                                <MessageSquare className="mr-2 h-3 w-3" />
                                <span className="truncate">{session.title}</span>
                            </Button>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
