"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    rationale?: string;
}

export type StrategyMode = 'IDLE' | 'UPLOADING' | 'ANALYZING' | 'ERROR' | 'COMPLETE';

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

export interface ActivityEvent {
    id: string;
    timestamp: Date;
    type: 'info' | 'success' | 'error' | 'warning';
    message: string;
    details?: string;
}

export interface LeadScore {
    score: number;
    reasoning: string;
    confidence: 'high' | 'medium' | 'low';
    keyFactors?: {
        titleMatch: 'yes' | 'partial' | 'no';
        sectorMatch: 'yes' | 'partial' | 'no';
        sizeMatch: 'yes' | 'partial' | 'no';
    };
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
    activeTab: string;
    setActiveTab: (tab: string) => void;
    selectedSector: string | null;
    setSelectedSector: React.Dispatch<React.SetStateAction<string | null>>;

    // Strategies & Context
    uploadedFiles: File[];
    setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
    removeUploadedFile: (index: number) => void;

    // AI Agent Orchestration
    agentStatus: 'idle' | 'analyzing' | 'ready' | 'active' | 'error';
    setAgentStatus: (status: 'idle' | 'analyzing' | 'ready' | 'active' | 'error') => void;
    activityLog: ActivityEvent[];
    addActivityEvent: (event: Omit<ActivityEvent, 'id' | 'timestamp'>) => void;
    leadScores: Map<string, LeadScore>;
    setLeadScore: (leadId: string, score: LeadScore) => void;
    // State Machine & Reset
    strategyMode: StrategyMode;
    setStrategyMode: (mode: StrategyMode) => void;
    resetCombinedState: () => void;
    // Wizard Persistence
    wizardStep: "upload" | "analyzing" | "chat";
    setWizardStep: (step: "upload" | "analyzing" | "chat") => void;
    wizardMessages: Message[];
    setWizardMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    addWizardMessage: (msg: Message) => void;
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
        keyNewsSignals?: string[];
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

    // File Context State
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const removeUploadedFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Persistence for Analysis
    useEffect(() => {
        const saved = localStorage.getItem('mission_control_analysis');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setExpertAnalysis(parsed);
                setStrategyApproved(true);
            } catch (e) {
                console.error("Failed to restore analysis", e);
            }
        }
    }, []);

    useEffect(() => {
        if (expertAnalysis) {
            localStorage.setItem('mission_control_analysis', JSON.stringify(expertAnalysis));
        }
    }, [expertAnalysis]);

    const [campaignConfig, setCampaignConfig] = useState({
        emailSequence: true,
        outboundVoice: false,
        inboundReceptionist: false
    });
    const [isStrategyApproved, setStrategyApproved] = useState(false);
    const [activeTab, setActiveTab] = useState("lead-gen");

    const [selectedSector, setSelectedSector] = useState<string | null>(null);

    // AI Agent Orchestration State
    const [agentStatus, setAgentStatus] = useState<'idle' | 'analyzing' | 'ready' | 'active' | 'error'>('idle');
    const [activityLog, setActivityLog] = useState<ActivityEvent[]>([]);
    const [leadScores, setLeadScores] = useState<Map<string, LeadScore>>(new Map());

    // State Machine
    const [strategyMode, setStrategyMode] = useState<StrategyMode>('IDLE');

    const addMessage = (msg: Message) => {
        setMessages((prev) => [...prev, msg]);
    };

    const updateEmail = (id: string, updates: Partial<EmailDraft>) => {
        setEmailQueue((prev) => prev.map(email => email.id === id ? { ...email, ...updates } : email));
    };

    const resetStrategy = () => {
        resetCombinedState();
    };

    const [wizardStep, setWizardStep] = useState<"upload" | "analyzing" | "chat">("upload");
    const [wizardMessages, setWizardMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Welcome to Mission Control. I am your Strategic Supervisor. Please upload your PRD, Service Document, or Product Spec to begin our analysis."
        }
    ]);

    const addWizardMessage = (msg: Message) => {
        setWizardMessages((prev) => [...prev, msg]);
    };

    const resetCombinedState = () => {
        // 1. Clear Analysis & Strategy
        setExpertAnalysis(null);
        setStrategy(null);
        setSelectedSector(null);
        setStrategyApproved(false);
        setStrategyMode('IDLE');
        setUploadedFiles([]); // Clear files
        setWizardStep("upload"); // Reset Wizard Step

        // 2. Clear Operational Data
        setLeads([]);
        setEmailQueue([]);
        setActiveCall(null);
        setCallHistory([]);
        setLeadScores(new Map());
        setActivityLog([]);
        setAgentStatus('idle');

        // 3. Reset Messages to Initial Greeting
        setMessages([
            {
                role: 'assistant',
                content: "Hello! I'm your Mission Control assistant. Upload your PRD or tell me about your service to generate a targeted lead strategy."
            }
        ]);

        // Reset Wizard Messages
        setWizardMessages([
            {
                role: 'assistant',
                content: "Welcome to Mission Control. I am your Strategic Supervisor. Please upload your PRD, Service Document, or Product Spec to begin our analysis."
            }
        ]);

        // 4. Reset Config to Defaults
        setCampaignConfig({
            emailSequence: true,
            outboundVoice: false,
            inboundReceptionist: false
        });

        // 5. Navigate to Strategy
        setActiveTab("strategy");

        // 6. Clear Local Storage
        try {
            localStorage.removeItem('mission_control_analysis');
        } catch (e) {
            console.error("Failed to clear local storage", e);
        }
    };

    const addToHistory = (analysis: PRDAnalysisResult) => {
        setAnalysisHistory(prev => [analysis, ...prev]);
    };

    const addActivityEvent = (event: Omit<ActivityEvent, 'id' | 'timestamp'>) => {
        const newEvent: ActivityEvent = {
            id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
            ...event
        };
        setActivityLog(prev => [newEvent, ...prev].slice(0, 50)); // Keep last 50 events
    };

    const setLeadScore = (leadId: string, score: LeadScore) => {
        setLeadScores(prev => new Map(prev).set(leadId, score));
    };

    return (
        <MissionControlContext.Provider value={{
            messages, addMessage,
            leads, setLeads,
            strategy, setStrategy,
            selectedSector, setSelectedSector,
            emailQueue, setEmailQueue, updateEmail,
            activeCall, setActiveCall,
            callHistory, setCallHistory,
            expertAnalysis, setExpertAnalysis,
            resetStrategy,
            analysisHistory, addToHistory,
            campaignConfig, setCampaignConfig,
            isStrategyApproved, setStrategyApproved,
            activeTab, setActiveTab,
            // AI Agent Orchestration
            agentStatus, setAgentStatus,
            activityLog, addActivityEvent,
            leadScores, setLeadScore,
            strategyMode, setStrategyMode, resetCombinedState,
            // File Context
            uploadedFiles, setUploadedFiles, removeUploadedFile,
            // Wizard Persistence
            wizardStep, setWizardStep,
            wizardMessages, setWizardMessages, addWizardMessage
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
