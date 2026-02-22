import { NextResponse } from 'next/server';
import { DeepResearchService } from '@/lib/deep-research';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        let missionStyle = "Consultative";

        if (userId) {
            const user = await prisma.user.findUnique({
                where: { clerkUserId: userId },
                include: { UserPreference: true }
            });
            if (user?.UserPreference) {
                missionStyle = user.UserPreference.missionStyle;
            }
        }

        const { leadId, companyName, contactName, role, rationale, valueProp, tone } = await req.json();

        if (!leadId || !companyName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const generatedTone = tone ? tone : missionStyle;

        const draft = await DeepResearchService.generateDraft(
            leadId,
            companyName,
            contactName || "Decision Maker",
            role || "Executive",
            rationale,
            valueProp,
            generatedTone
        );

        return NextResponse.json(draft);
    } catch (error) {
        console.error("Email Generation Error:", error);
        return NextResponse.json({ error: 'Failed to generate email' }, { status: 500 });
    }
}
