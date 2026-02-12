import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DeepResearchService } from '@/lib/deep-research';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const drafts = await prisma.emailDraft.findMany({
            include: { Lead: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(drafts);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch drafts' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { leadId, companyName, contactName, role, rationale, valueProp } = await req.json();

        if (!leadId || !companyName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const draft = await DeepResearchService.generateDraft(
            leadId,
            companyName,
            contactName || "Decision Maker",
            role || "Executive",
            rationale,
            valueProp
        );

        return NextResponse.json(draft);
    } catch (error) {
        console.error("Draft Generation Error:", error);
        return NextResponse.json({ error: 'Failed to generate draft' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { id, subject, body, status } = await req.json();

        const updated = await prisma.emailDraft.update({
            where: { id },
            data: {
                subject,
                body,
                status // e.g. 'APPROVED', 'SENT'
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update draft' }, { status: 500 });
    }
}
