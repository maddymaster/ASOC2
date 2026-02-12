import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
const pdf = require('pdf-parse');

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
        }

        let text = '';

        if (file.type === 'application/pdf') {
            const buffer = Buffer.from(await file.arrayBuffer());
            const data = await pdf(buffer);
            text = data.text;
        } else {
            // Assume text/plain or similar
            text = await file.text();
        }

        // Initialize Gemini
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ success: false, error: 'Missing AI API Key' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        Analyze the following Product Requirement Document (PRD) or product description.
        Extract the following:
        1. A brief summary of the product.
        2. Identify 3 key target sectors/industries that would be ideal customers.
        3. For each sector, provide:
           - Rationale: Why isn't a good fit?
           - Target Roles: Who executes the purchase decision?
           - Value Proposition: What is the main selling point?
           - Pain Points: What problems does it solve?
           - Strategy Mix: Suggested outreach channel (Email, basic call, etc.)

        Return the response as a JSON object with this structure:
        {
          "summary": "...",
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

        const analysis = JSON.parse(jsonStr);

        return NextResponse.json({ success: true, analysis });

    } catch (error) {
        console.error("PRD Analysis Error:", error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
