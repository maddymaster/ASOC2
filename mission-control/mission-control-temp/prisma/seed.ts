import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // Clear existing data
    await prisma.auditLog.deleteMany()
    await prisma.callLog.deleteMany()

    // --- 1. Seed Audit Logs ---
    console.log('... Seeding Audit Logs')
    await prisma.auditLog.createMany({
        data: [
            { action: "EXPORT_LEADS", userId: "sales-exec-1", details: "Exported 50 qualified leads to CSV" },
            { action: "UPDATE_API_KEY", userId: "admin-user", details: "Rotated Retell API Key" },
            { action: "CAMPAIGN_CREATE", userId: "manager-2", details: "Created 'Q1 Outbound' campaign" },
            { action: "TEMPLATE_EDIT", userId: "sales-exec-1", details: "Updated 'Cold Outreach' email template" },
            { action: "USER_LOGIN", userId: "sales-exec-1", details: "Login from IP 192.168.1.1" },
        ]
    })

    // --- 2. Seed Inbound Calls ---
    console.log('... Seeding Inbound Calls')
    const inboundCalls = [
        {
            id: `call-in-1-${Date.now()}`,
            agentId: "agent-inbound-1",
            leadId: "lead-101",
            status: "completed",
            transcript: "Agent: Thanks for calling Mission Control. How can I help? \nCaller: Hi, I'm interested in your pricing for enterprise teams.\nAgent: Great question. For enterprise, we offer custom packages starting at...",
            sentiment: "positive",
            duration: 120,
            userIntent: "interested",
            summary: "Caller asked about enterprise pricing.",
            recordingUrl: "https://example.com/rec1.mp3"
        },
        {
            id: `call-in-2-${Date.now()}`,
            agentId: "agent-inbound-1",
            leadId: "lead-102",
            status: "completed",
            transcript: "Agent: Mission Control, Alex speaking.\nCaller: Do you integrate with Salesforce?\nAgent: Yes, we have a native 2-way sync.\nCaller: Perfect, let's book a demo.",
            sentiment: "positive",
            duration: 245,
            userIntent: "booked",
            summary: "Confirmed Salesforce integration and booked demo.",
            recordingUrl: "https://example.com/rec2.mp3"
        },
        {
            id: `call-in-3-${Date.now()}`,
            agentId: "agent-inbound-1",
            leadId: "lead-103",
            status: "completed",
            transcript: "Agent: Hello.\nCaller: I'm having trouble logging in.\nAgent: I can help with that. Are you on the SSO page?",
            sentiment: "neutral",
            duration: 180,
            userIntent: "support",
            summary: "User login issue resolved.",
            recordingUrl: "https://example.com/rec3.mp3"
        },
        {
            id: `call-in-4-${Date.now()}`,
            agentId: "agent-inbound-1",
            leadId: "lead-104",
            status: "completed",
            transcript: "Agent: Hello.\nCaller: Just looking around, not interested comfortably.\nAgent: No problem.",
            sentiment: "neutral",
            duration: 45,
            userIntent: "not-interested",
            summary: "Tire kicker.",
            recordingUrl: "https://example.com/rec4.mp3"
        },
        {
            id: `call-in-5-${Date.now()}`,
            agentId: "agent-inbound-1",
            leadId: "lead-105",
            status: "completed",
            transcript: "Agent: Hello.\nCaller: Can I speak to a human?\nAgent: One moment.",
            sentiment: "negative",
            duration: 60,
            userIntent: "handoff",
            summary: "Immediate handoff requested.",
            recordingUrl: "https://example.com/rec5.mp3"
        }
    ]

    for (const call of inboundCalls) {
        await prisma.callLog.create({ data: call })
    }

    // --- 3. Seed Outbound Calls with Coaching ---
    console.log('... Seeding Outbound Calls')
    const outboundCalls = [
        {
            id: `call-out-1-${Date.now()}`,
            agentId: "agent-outbound-alex",
            leadId: "lead-201",
            status: "completed",
            transcript: "Alex: Hi, this is Alex from Mission Control. I saw your recent post about scaling sales teams.\nProspect: Yeah, we are growing fast.\nAlex: That's great. We help teams automate the busy work. Is that a challenge you have?\nProspect: Honestly, yes. It's too expensive though.\nAlex: I totally hear you on cost. But think about the ROI of saving 10 hours a week.\nProspect: Hmm, good point.",
            sentiment: "positive",
            duration: 300,
            userIntent: "interested",
            summary: "Objection on price handled well.",
            recordingUrl: "https://example.com/rec-out-1.mp3",
            coachingData: JSON.stringify({
                win: "Excellent pivot on the price objection to ROI.",
                gap: "Could have asked for the meeting immediately after the 'good point' signal.",
                score: 8
            })
        },
        {
            id: `call-out-2-${Date.now()}`,
            agentId: "agent-outbound-alex",
            leadId: "lead-202",
            status: "completed",
            transcript: "Alex: Hi, is this John?\nProspect: Who is this?\nAlex: Alex from Mission Control.\nProspect: Not interested.",
            sentiment: "negative",
            duration: 30,
            userIntent: "not-interested",
            summary: "Immediate hangup.",
            recordingUrl: "https://example.com/rec-out-2.mp3",
            coachingData: JSON.stringify({
                win: "Polite opening.",
                gap: "Failed to hook interest in the first 10 seconds.",
                score: 3
            })
        },
        // ... Add 8 more simply for volume if needed, but 2 generic ones + above is better
    ]

    // Add 8 more generic calls to reach 10
    for (let i = 3; i <= 10; i++) {
        outboundCalls.push({
            id: `call-out-${i}-${Date.now()}`,
            agentId: "agent-outbound-alex",
            leadId: `lead-20${i}`,
            status: "completed",
            transcript: "Alex: Hi, calling about your sales process...",
            sentiment: i % 2 === 0 ? "positive" : "neutral",
            duration: 100 + i * 10,
            userIntent: "follow-up",
            summary: "Generic follow-up call.",
            recordingUrl: `https://example.com/rec-out-${i}.mp3`,
            coachingData: JSON.stringify({
                win: "Consistent pacing.",
                gap: "Need more energy in greeting.",
                score: 7
            })
        })
    }

    for (const call of outboundCalls) {
        await prisma.callLog.create({ data: call })
    }

    console.log('✅ Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
