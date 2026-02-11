import { NextResponse } from 'next/server';
import { ExpertAgent } from '@/lib/expert-agent';
// pdf-parse loaded dynamically
import mammoth from 'mammoth';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        let prdText = formData.get('prdText') as string | null;

        // If file is provided, extract text based on Type
        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const fileType = file.type;

            console.log(`Processing file: ${file.name} (${fileType})`);

            if (fileType === 'application/pdf') {
                const pdf = require('pdf-parse');
                const data = await pdf(buffer);
                prdText = data.text;
            }
            else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                const result = await mammoth.extractRawText({ buffer });
                prdText = result.value;
            }
            else if (fileType.startsWith('image/')) {
                // Vision Analysis
                const base64Image = buffer.toString('base64');
                const imageAnalysis = await ExpertAgent.analyzeImage(base64Image);
                prdText = `[IMAGE ANALYSIS OF ${file.name}]:\n${imageAnalysis}`;
            }
            else if (fileType === 'text/plain') {
                prdText = await file.text();
            }
            else {
                return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
            }
        }

        if (!prdText || prdText.trim().length === 0) {
            return NextResponse.json({ error: "Could not extract text from document" }, { status: 400 });
        }

        // Run Expert Analysis on extracted text
        const analysis = await ExpertAgent.analyzePRD(prdText);

        return NextResponse.json({ success: true, analysis });

    } catch (error) {
        console.error("PRD Analysis Error:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to analyze PRD"
        }, { status: 500 });
    }
}
