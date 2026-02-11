import { NextResponse } from 'next/server';
import { ExpertAgent } from '@/lib/expert-agent';

export async function POST(request: Request) {
    try {
        const { currentAnalysis, userFeedback } = await request.json();

        if (!currentAnalysis || !userFeedback) {
            return NextResponse.json({ error: "Missing analysis or feedback" }, { status: 400 });
        }

        const updatedAnalysis = await ExpertAgent.refineStrategy(currentAnalysis, userFeedback);

        return NextResponse.json({ success: true, analysis: updatedAnalysis });

    } catch (error) {
        console.error("Refinement Error:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to refine strategy"
        }, { status: 500 });
    }
}
