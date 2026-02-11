import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const WEBHOOK_SIGNING_KEY = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;

export async function POST(req: Request) {
    if (!WEBHOOK_SIGNING_KEY) {
        console.error("Missing CALENDLY_WEBHOOK_SIGNING_KEY");
        return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    const signatureHeader = req.headers.get("Calendly-Webhook-Signature");
    if (!signatureHeader) {
        return NextResponse.json({ error: "Missing Signature" }, { status: 403 });
    }

    const text = await req.text();

    // 1. Verify Signature
    try {
        const { t, v1 } = signatureHeader.split(',').reduce((acc, part) => {
            const [key, value] = part.split('=');
            if (key === 't') acc.t = value;
            if (key === 'v1') acc.v1 = value;
            return acc;
        }, { t: '', v1: '' });

        if (!t || !v1) throw new Error("Invalid Signature Format");

        const expectedSignature = crypto
            .createHmac("sha256", WEBHOOK_SIGNING_KEY)
            .update(t + "." + text)
            .digest("hex");

        if (expectedSignature !== v1) {
            console.error("Invalid Webhook Signature");
            return NextResponse.json({ error: "Invalid Signature" }, { status: 403 });
        }

        // Prevent Replay Attacks (optional: check timestamp vs now)
        // const Tolerance = 3 * 60 * 1000; // 3 mins

    } catch (e) {
        console.error("Signature Verification Failed", e);
        return NextResponse.json({ error: "Verification Failed" }, { status: 403 });
    }

    // 2. Process Event
    const event = JSON.parse(text);
    const eventType = event.event;
    const payload = event.payload;

    console.log(`Received Calendly Event: ${eventType}`, payload.email);

    if (eventType === "invitee.created") {
        const email = payload.email;

        // Update Lead Status if exists
        // Note: In real app, might need to match by email across all leads
        // Assuming we look up by email in 'Lead' table (which we don't strictly have in schema yet, 
        // relying on 'leads' context mostly? No, let's assume we might have a DB model or log it).

        // For now, let's log the success for the dashboard to pick up via polling or ws
        console.log(`CONFIRMED MEETING for ${email}`);

        // Update or Create Lead
        try {
            const lead = await prisma.lead.upsert({
                where: { email: email },
                update: {
                    status: 'MEETING_BOOKED',
                    meetingTime: new Date(payload.scheduled_event.start_time),
                    updatedAt: new Date()
                },
                create: {
                    email: email,
                    name: payload.name || "Unknown",
                    status: 'MEETING_BOOKED',
                    source: 'inbound_calendly',
                    meetingTime: new Date(payload.scheduled_event.start_time),
                }
            });
            console.log("Lead updated:", lead.id);
        } catch (dbError) {
            console.error("Failed to update Lead:", dbError);
        }
    }

    return NextResponse.json({ success: true });
}
