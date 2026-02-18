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

        let text = '';

        for (const file of files) {
            if (file.type === 'application/pdf') {
                const pdf = require('pdf-parse');
                const buffer = Buffer.from(await file.arrayBuffer());
                const data = await pdf(buffer);
                text += `\n--- File: ${file.name} ---\n${data.text}\n`;
            } else {
                // Assume text/plain or similar
                const fileText = await file.text();
                text += `\n--- File: ${file.name} ---\n${fileText}\n`;
            }
        }

        // Initialize Gemini
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ success: false, error: 'Missing AI API Key' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Latest stable Flash model

        const prompt = `
        Analyze the following Product Requirement Document (PRD) or product description.
        
        Task: Identify 3-4 key target sectors/industries that would be ideal customers for this product.
        
        For *each* sector, you must provide the following details:
        1. **Sector Name**: Specific industry (e.g., "Enterprise Fintech", "Healthcare Providers").
        2. **Rationale**: Explain *why* this sector is a good fit. Connect the product features to the sector's needs.
        3. **Target Roles**: Job titles of the decision-makers (e.g., "CISO", "VP of Operations").
        4. **Value Proposition**: The main selling point specifically for this sector.
        5. **Pain Points**: Specific problems or challenges this sector faces that this product solves.
        6. **Strategy Mix**: Suggested outreach channels (e.g., "Cold Email + LinkedIn", "Direct Sales").

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
              "strategyMix": "..."
            }
          ]
        }
        
        Document Content:
        ${text.substring(0, 30000)} 
        `; // Limit text to avoid token limits if very large

        const result = await model.generateContent(prompt);
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
            // Fallback or retry logic could go here
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
