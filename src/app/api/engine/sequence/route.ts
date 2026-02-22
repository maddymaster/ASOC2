import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch user preferences for sequence rules
        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
            include: { UserPreference: true }
        });

        const prefs = user?.UserPreference;
        if (!prefs) {
            return NextResponse.json({ error: 'User preferences not found' }, { status: 400 });
        }

        const {
            emailFollowUpCount,
            emailDelayDays,
            callFollowUpCount,
            callDelayDays
        } = prefs;

        // Fetch all active leads
        const activeLeads = await prisma.lead.findMany({
            where: {
                status: {
                    in: ['NEW', 'CONTACTED']
                }
            }
        });

        const now = new Date();
        const results = {
            deadLeads: 0,
            emailsQueued: 0,
            callsQueued: 0,
            actions: [] as any[]
        };

        for (const lead of activeLeads) {
            let markDead = false;
            let needsEmail = false;
            let needsCall = false;

            const daysSinceEmail = lead.lastEmailAt ? (now.getTime() - lead.lastEmailAt.getTime()) / (1000 * 3600 * 24) : Infinity;
            const daysSinceCall = lead.lastCallAt ? (now.getTime() - lead.lastCallAt.getTime()) / (1000 * 3600 * 24) : Infinity;

            // 1. Check if sequence is completely exhausted
            if (lead.emailCount >= emailFollowUpCount && lead.callCount >= callFollowUpCount) {
                // If the maximum delay has passed since the LAST contact without a reply/change to Meeting_Booked
                const maxDelay = Math.max(emailDelayDays, callDelayDays);
                const lastContactTime = lead.lastContact || lead.lastCallAt || lead.lastEmailAt || lead.createdAt;
                const daysSinceLastContact = (now.getTime() - lastContactTime.getTime()) / (1000 * 3600 * 24);

                if (daysSinceLastContact >= maxDelay) {
                    markDead = true;
                }
            }

            if (markDead) {
                await prisma.lead.update({
                    where: { id: lead.id },
                    data: { status: 'DEAD' }
                });
                results.deadLeads++;
                results.actions.push({ leadId: lead.id, action: 'Marked DEAD (Sequence Exhausted)' });
                continue;
            }

            // 2. Evaluate next Email Step
            if (lead.emailCount < emailFollowUpCount) {
                if (daysSinceEmail >= emailDelayDays || lead.emailCount === 0) {
                    needsEmail = true;
                }
            }

            // 3. Evaluate next Call Step
            if (lead.callCount < callFollowUpCount) {
                if (daysSinceCall >= callDelayDays || lead.callCount === 0) {
                    needsCall = true;
                }
            }

            if (needsEmail) {
                results.emailsQueued++;
                results.actions.push({ leadId: lead.id, action: 'Email Follow-Up Required', step: lead.emailCount + 1 });
                // In a full executor, you would push this to a queue or draft endpoint.
            }

            if (needsCall) {
                results.callsQueued++;
                results.actions.push({ leadId: lead.id, action: 'Call Follow-Up Required', step: lead.callCount + 1 });
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Sequence Engine Processed',
            results
        });

    } catch (error: any) {
        console.error("Sequence Engine Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
