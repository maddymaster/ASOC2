import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    let fileCount = 0;

    try {
        const formData = await req.formData();
        const files = formData.getAll('files') as File[];
        const instructions = formData.get('instructions') as string || '';

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files provided' }, { status: 400 });
        }

        fileCount = files.length;
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Ensure 1.5 Pro for best multimodal

        console.log(`[Analyze] Processing ${fileCount} files...`);

        // Prepare prompt content parts
        const promptText = `
            You are an expert Chief Strategy Officer and AI Systems Architect. 
            Analyze the following uploaded context documents (PRDs, Product Specs, Marketing/Sales collateral).
            
            **Goal:** 
            Synthesize the information from ALL provided documents to identify the top 3 target market sectors for this product and recommend an AI agent strategy for each.
            Also, determine the optimal "Campaign Configuration" (Email vs. Voice vs. Receptionist) based on the comprehensive product understanding.

            **Additional User Instructions:**
            ${instructions}

            **Output Format:**
            Return a purely valid JSON object (no markdown, no backticks) with the following structure:
            {
                "summary": "High-level summary of the product and consolidated strategy reasoning (max 2 sentences).",
                "sectors": [
                    {
                        "sector": "Name of the sector (e.g., Enterprise Fintech)",
                        "rationale": "Why this sector is a good fit.",
                        "targetRoles": ["Role 1", "Role 2"],
                        "valueProposition": "Specific value prop for this sector.",
                        "painPoints": ["Pain point 1", "Pain point 2"]
                    }
                ],
                "suggestedConfig": {
                    "emailSequence": true,
                    "outboundVoice": boolean, 
                    "inboundReceptionist": boolean
                }
            }
            
            **Configuration Logic:**
            - **emailSequence**: Always true (base layer).
            - **outboundVoice**: True if the product is high-value B2B, local service, or requires complex qualification.
            - **inboundReceptionist**: True if the business seems to be a service provider (agency, clinic, firm).
        `;

        const contentParts: any[] = [
            { text: promptText }
        ];

        // Process each file
        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64Data = buffer.toString('base64');

            let mimeType = file.type;
            if (!mimeType || mimeType === 'application/octet-stream') {
                const lowerName = file.name.toLowerCase();
                if (lowerName.endsWith('.pdf')) mimeType = 'application/pdf';
                else if (lowerName.endsWith('.txt')) mimeType = 'text/plain';
                else if (lowerName.endsWith('.md')) mimeType = 'text/markdown';
                else if (lowerName.endsWith('.png')) mimeType = 'image/png';
                else if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) mimeType = 'image/jpeg';
                else mimeType = 'application/pdf';
            }

            console.log(`[Analyze] Adding file: ${file.name} (${mimeType})`);

            contentParts.push({
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType
                }
            });
        }

        const result = await model.generateContent(contentParts);
        const response = result.response;
        const text = response.text();

        console.log(`[Analyze] Response length: ${text.length} chars`);

        // Robust JSON extraction
        let jsonStr = text.trim();
        jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '');
        const firstBrace = jsonStr.indexOf('{');
        const lastBrace = jsonStr.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
        }

        const analysis = JSON.parse(jsonStr);

        // Validate required fields
        if (!analysis.summary || !analysis.sectors || !Array.isArray(analysis.sectors)) {
            throw new Error('Invalid analysis structure: missing required fields');
        }

        return NextResponse.json({
            ...analysis,
            _meta: {
                fileCount,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error: any) {
        console.error('[Analyze] Fatal error:', error);

        // Error handling logic
        let userMessage = 'Failed to analyze documents';
        let suggestion = 'Please try again or contact support.';

        if (error.message?.includes('API key')) {
            userMessage = 'API Configuration Error';
            suggestion = 'The Gemini API key is not configured.';
        } else if (error.message?.includes('JSON')) {
            userMessage = 'AI Response Format Error';
            suggestion = 'The AI returned an unexpected format. Try simplfying your files.';
        }

        return NextResponse.json({
            error: userMessage,
            details: error.message,
            suggestion,
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
