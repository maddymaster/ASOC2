import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
// const pdf = require('pdf-parse'); // Moved inside handler

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ success: false, error: 'No files uploaded' }, { status: 400 });
        }

        // Initialize Gemini
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ success: false, error: 'Missing AI API Key' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Using 1.5 Flash for availability

        const prompt = `
        Act as a Senior AI Orchestration Engineer.
        Analyze the provided Product Requirement Document (PRD) or product description files.
        
        Task: Perform a deep extraction to identify 3-4 key target sectors/industries.
        
        For *each* sector, you must provide the following details:
        1. **Sector Name**: Specific industry (e.g., "Enterprise Fintech", "Healthcare Providers").
        2. **Rationale**: Explain *why* this sector is a good fit. Connect the product features to the sector's needs.
        3. **Target Roles**: Job titles of the decision-makers (e.g., "CISO", "VP of Operations").
        4. **Value Proposition**: The main selling point specifically for this sector.
        5. **Pain Points**: Specific problems or challenges this sector faces that this product solves.
        6. **Strategy Mix**: Suggested outreach channels (e.g., "Cold Email + LinkedIn", "Direct Sales").
        7. **Key News Signals**: Specific triggers to monitor via Apollo.io (e.g., "Series B Funding", "New CTO Hiring", "Regulatory Fine").

        Return the response as a valid JSON object with this exact structure:
        {
          "summary": "Brief 1-2 sentence summary of the product.",
          "sectors": [
            {
              "sector": "...",
              "rationale": "...",
              "targetRoles": ["..."],
              "valueProposition": "...",
              "painPoints": ["..."],
              "strategyMix": "...",
              "keyNewsSignals": ["..."]
            }
          ]
        }
        `;

        const contentParts: any[] = [
            { text: prompt }
        ];

        // Process files into inlineData
        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64Data = buffer.toString('base64');

            let mimeType = file.type;
            // Fallback mime type detection if empty
            if (!mimeType || mimeType === 'application/octet-stream') {
                if (file.name.toLowerCase().endsWith('.pdf')) mimeType = 'application/pdf';
                else if (file.name.toLowerCase().endsWith('.txt')) mimeType = 'text/plain';
                else mimeType = 'application/pdf'; // Default
            }

            contentParts.push({
                inlineData: {
                    data: base64Data,
                    mimeType
                }
            });
        }

        const result = await model.generateContent(contentParts);
        const response = await result.response;
        let jsonStr = response.text();

        // Clean markdown code blocks if present
        jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();

        let analysis;
        try {
            analysis = JSON.parse(jsonStr);
        } catch (e) {
            console.error("JSON Parse Error:", e);
            console.log("Raw Response:", jsonStr);
            throw new Error("Failed to parse AI response as JSON");
        }

        return NextResponse.json({ success: true, analysis });

    } catch (error: any) {
        console.error("PRD Analysis Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal Server Error',
            details: error.toString()
        }, { status: 500 });
    }
}
