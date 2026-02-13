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

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Detect MIME type intelligently
        let mimeType = file.type;
        if (!mimeType || mimeType === 'application/octet-stream') {
            const fileName = file.name.toLowerCase();
            if (fileName.endsWith('.pdf')) mimeType = 'application/pdf';
            else if (fileName.endsWith('.txt')) mimeType = 'text/plain';
            else if (fileName.endsWith('.md')) mimeType = 'text/markdown';
            else if (fileName.endsWith('.png')) mimeType = 'image/png';
            else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) mimeType = 'image/jpeg';
            else mimeType = 'application/pdf'; // default fallback
        }

        console.log(`[Analyze] Processing file: ${file.name}, size: ${buffer.length} bytes, mimeType: ${mimeType}`);

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

        let result;
        let parseMethod = 'direct';

        try {
            // PRIMARY METHOD: Direct multimodal upload
            // Gemini 1.5 Pro natively supports PDFs and images
            const base64Data = buffer.toString('base64');

            result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType
                    }
                }
            ]);

            // Validate response
            const testText = result.response.text();
            if (!testText || testText.trim().length < 20) {
                throw new Error('Response empty or too short');
            }

            console.log(`[Analyze] Success via direct upload`);

        } catch (directError: any) {
            console.warn(`[Analyze] Direct parsing failed:`, directError.message);

            // FALLBACK METHOD: Text-only extraction for PDFs
            if (mimeType === 'application/pdf') {
                try {
                    parseMethod = 'text-fallback';
                    // Try sending as base64 with explicit instructions
                    const base64Data = buffer.toString('base64');

                    result = await model.generateContent([
                        prompt + `\n\n**IMPORTANT:** Extract all text content from this PDF document. If the PDF contains images or complex layouts, describe the visual elements and extract any visible text. Be thorough.`,
                        {
                            inlineData: {
                                data: base64Data,
                                mimeType: 'application/pdf'
                            }
                        }
                    ]);

                    console.log(`[Analyze] Success via PDF text fallback`);

                } catch (fallbackError: any) {
                    console.error(`[Analyze] PDF fallback also failed:`, fallbackError.message);
                    throw new Error(
                        `Unable to parse PDF file. Try: (1) Converting to PNG/JPG first, (2) Ensuring PDF is not password-protected, or (3) Using a plain text file instead. Error: ${fallbackError.message}`
                    );
                }
            } else if (mimeType.startsWith('image/')) {
                // Image fallback: retry with explicit image instructions
                try {
                    parseMethod = 'image-OCR';
                    const base64Data = buffer.toString('base64');

                    result = await model.generateContent([
                        prompt + `\n\n**IMPORTANT:** This is an image file. Perform OCR to extract all visible text. Pay special attention to headings, bullet points, and key product information.`,
                        {
                            inlineData: {
                                data: base64Data,
                                mimeType: mimeType
                            }
                        }
                    ]);

                    console.log(`[Analyze] Success via image OCR fallback`);

                } catch (imageError: any) {
                    throw new Error(`Image OCR failed: ${imageError.message}`);
                }
            } else {
                // Not a PDF or image, re-throw original error
                throw new Error(`Parsing failed for ${mimeType}: ${directError.message}`);
            }
        }

        const response = result.response;
        const text = response.text();

        console.log(`[Analyze] Response length: ${text.length} chars`);

        // Robust JSON extraction
        let jsonStr = text.trim();

        // Remove markdown code blocks if present
        jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '');

        // Find JSON object (look for first { and last })
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

        console.log(`[Analyze] Successfully parsed analysis with ${analysis.sectors.length} sectors`);

        return NextResponse.json({
            ...analysis,
            _meta: {
                parseMethod,
                fileName: file.name,
                fileSize: buffer.length,
                mimeType
            }
        });

    } catch (error: any) {
        console.error('[Analyze] Fatal error:', error);
        return NextResponse.json({
            error: 'Failed to analyze document',
            details: error.message,
            suggestion: error.message.includes('PDF')
                ? 'Try converting your PDF to an image (PNG/JPG) or plain text file.'
                : error.message.includes('JSON')
                    ? 'The AI response was not in the expected format. Please try again.'
                    : 'Ensure the file is a valid document format (PDF, TXT, MD, PNG, JPG).'
        }, { status: 500 });
    }
}
