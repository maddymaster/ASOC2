import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const instructions = formData.get('instructions') as string || '';

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        // Convert file to base64 for Gemini
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Data = buffer.toString('base64');
        const mimeType = file.type || 'application/pdf'; // Default to PDF if missing

        const prompt = `
            You are an expert Chief Strategy Officer and AI Systems Architect. 
            Analyze this uploaded document (PRD, Product Spec, or Marketing One-Pager).
            
            **Goal:** 
            Identify the top 3 target market sectors for this product and recommend an AI agent strategy for each.
            Also, determine the optimal "Campaign Configuration" (Email vs. Voice vs. Receptionist) based on the product type.

            **Additional User Instructions:**
            ${instructions}

            **Output Format:**
            Return a purely valid JSON object (no markdown, no backticks) with the following specific structure:
            {
                "summary": "High-level summary of the product and strategy reasoning (max 2 sentences).",
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
            - **outboundVoice**: True if the product is high-value B2B, local service, or requires complex qualification that a voice agent handles well. False for pure PLG or dev tools.
            - **inboundReceptionist**: True if the business seems to be a service provider (agency, clinic, firm) that receives inbound calls.
        `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType
                }
            }
        ]);

        const response = result.response;
        const text = response.text();

        // Clean markdown if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const analysis = JSON.parse(jsonStr);

        return NextResponse.json(analysis);

    } catch (error: any) {
        console.error('Analysis Error:', error);
        return NextResponse.json({
            error: 'Failed to analyze document',
            details: error.message
        }, { status: 500 });
    }
}
