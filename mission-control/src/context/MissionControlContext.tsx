"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export interface Lead {
    id: string;
    name: string;
    company: string;
    email: string;
    status: 'new' | 'contacted' | 'qualified';
    score: number;
}

export interface Strategy {
    industry: string;
    geo: string;
    companySize: string;
    targetRole?: string;
    domain?: string;
}

export interface EmailDraft {
    id: string;
    leadId: string;
    leadName: string;
    subject: string;
    body: string;
    status: 'draft' | 'scheduled' | 'sent';
    sequenceStep: 1 | 2 | 3;
}

export interface Call {
    id: string;
    leadId: string;
    leadName: string;
    status: 'dialing' | 'connected' | 'completed' | 'voicemail';
    duration: string;
    transcript: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    timestamp: Date;
}

interface MissionControlContextType {
    messages: Message[];
    addMessage: (msg: Message) => void;
    leads: Lead[];
    setLeads: (leads: Lead[]) => void;
    strategy: Strategy | null;
    setStrategy: (strategy: Strategy) => void;
    emailQueue: EmailDraft[];
    setEmailQueue: React.Dispatch<React.SetStateAction<EmailDraft[]>>;
    updateEmail: (id: string, updates: Partial<EmailDraft>) => void;
    activeCall: Call | null;
    setActiveCall: React.Dispatch<React.SetStateAction<Call | null>>;
    callHistory: Call[];
    setCallHistory: React.Dispatch<React.SetStateAction<Call[]>>;

    // Expert Agent
    expertAnalysis: PRDAnalysisResult | null;
    setExpertAnalysis: (data: PRDAnalysisResult | null) => void;
    resetStrategy: () => void;
    analysisHistory: PRDAnalysisResult[];
    addToHistory: (analysis: PRDAnalysisResult) => void;

    // Campaign Config
    campaignConfig: {
        emailSequence: boolean;
        outboundVoice: boolean;
        inboundReceptionist: boolean;
    };
    setCampaignConfig: React.Dispatch<React.SetStateAction<{
        emailSequence: boolean;
        outboundVoice: boolean;
        inboundReceptionist: boolean;
    }>>;
    isStrategyApproved: boolean;
    setStrategyApproved: (approved: boolean) => void;
}

export interface PRDAnalysisResult {
    id?: string;
    timestamp?: string;
    fileName?: string;
    summary: string;
    sectors: {
        sector: string;
        rationale: string;
        targetRoles: string[];
        valueProposition: string;
        painPoints: string[];
        strategyMix?: string;
    }[];
}

const MissionControlContext = createContext<MissionControlContextType | undefined>(undefined);

export const MissionControlProvider = ({ children }: { children: ReactNode }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hello! I'm your Mission Control assistant. Upload your PRD or tell me about your service to generate a targeted lead strategy."
        }
    ]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [strategy, setStrategy] = useState<Strategy | null>(null);
    const [emailQueue, setEmailQueue] = useState<EmailDraft[]>([]);
    const [activeCall, setActiveCall] = useState<Call | null>(null);
    const [callHistory, setCallHistory] = useState<Call[]>([]);
    const [expertAnalysis, setExpertAnalysis] = useState<PRDAnalysisResult | null>(null);
    const [analysisHistory, setAnalysisHistory] = useState<PRDAnalysisResult[]>([]);

    const [campaignConfig, setCampaignConfig] = useState({
        emailSequence: true,
        outboundVoice: false,
        inboundReceptionist: false
    });
    const [isStrategyApproved, setStrategyApproved] = useState(false);

    const addMessage = (msg: Message) => {
        setMessages((prev) => [...prev, msg]);
    };

    const updateEmail = (id: string, updates: Partial<EmailDraft>) => {
        setEmailQueue((prev) => prev.map(email => email.id === id ? { ...email, ...updates } : email));
    };

    const resetStrategy = () => {
        setExpertAnalysis(null);
        setStrategy(null);
        setStrategyApproved(false);
    };

    const addToHistory = (analysis: PRDAnalysisResult) => {
        setAnalysisHistory(prev => [analysis, ...prev]);
    };

    return (
        <MissionControlContext.Provider value={{
            messages, addMessage,
            leads, setLeads,
            strategy, setStrategy,
            emailQueue, setEmailQueue, updateEmail,
            activeCall, setActiveCall,
            callHistory, setCallHistory,
            expertAnalysis, setExpertAnalysis,
            resetStrategy,
            analysisHistory, addToHistory,
            campaignConfig, setCampaignConfig,
            isStrategyApproved, setStrategyApproved
        }}>
            {children}
        </MissionControlContext.Provider>
    );
};

export const useMissionControl = () => {
    const context = useContext(MissionControlContext);
    if (!context) {
        throw new Error('useMissionControl must be used within a MissionControlProvider');
    }
    return context;
};
