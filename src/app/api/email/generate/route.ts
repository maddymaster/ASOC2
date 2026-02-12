import { NextResponse } from 'next/server';
import { DeepResearchService } from '@/lib/deep-research';

export const dynamic = 'force-dynamic';

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
        console.error("Email Generation Error:", error);
        return NextResponse.json({ error: 'Failed to generate email' }, { status: 500 });
    }
}
