import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher';

// Type Definition based on User Request
interface VoiceWebhookPayload {
    call_id: string;
    agent_id: string;
    status: 'completed' | 'ongoing';
    recording_url: string;
    transcript: string;
    analysis: {
        sentiment: 'positive' | 'neutral' | 'negative';
        objections_detected: string[];
        call_summary: string;
        user_intent: 'booked' | 'interested' | 'follow-up' | 'not-interested';
    };
    duration_seconds: number;
    metadata: {
        lead_id: string;
        campaign_id: string;
    };
}

export async function POST(request: Request) {
    try {
        const payload: VoiceWebhookPayload = await request.json();

        // Log receipt of webhook
        console.log("------------------------------------------------");
        console.log("📞 Voice Webhook Received for Call:", payload.call_id);
        console.log("   Status:", payload.status);
        console.log("------------------------------------------------");

        // 1. Database Sync (Prisma)
        const callLog = await prisma.callLog.upsert({
            where: { id: payload.call_id },
            update: {
                status: payload.status,
                transcript: payload.transcript,
                sentiment: payload.analysis.sentiment,
                duration: payload.duration_seconds,
                summary: payload.analysis.call_summary,
                userIntent: payload.analysis.user_intent,
                recordingUrl: payload.recording_url,
            },
            create: {
                id: payload.call_id,
                agentId: payload.agent_id,
                leadId: payload.metadata.lead_id,
                status: payload.status,
                transcript: payload.transcript,
                sentiment: payload.analysis.sentiment,
                duration: payload.duration_seconds,
                summary: payload.analysis.call_summary,
                userIntent: payload.analysis.user_intent,
                recordingUrl: payload.recording_url,
            }
        });

        // 2. Real-time Update (Pusher)
        await pusherServer.trigger('mission-control', 'call-completed', callLog);

        return NextResponse.json({ success: true, message: "Webhook processed", data: callLog });

    } catch (error) {
        console.error("❌ Webhook Error:", error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
