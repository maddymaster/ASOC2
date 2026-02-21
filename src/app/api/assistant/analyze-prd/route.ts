import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

const ANALYSIS_SCHEMA = `
{
  "coreProductValue": "Deep analysis of the core product value and offering.",
  "targetIndustryPersonas": [
    {
      "industry": "...",
      "personas": ["..."],
      "rationale": "..."
    }
  ],
  "specificSalesPainPoints": ["...", "..."],
  "summary": "Brief 1-2 sentence summary of the product (Core Product).",
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

const PROMPT_TEXT = `
Act as a Senior AI Orchestration Engineer.
Analyze the provided Product Requirement Document (PRD) or product description files.

Task: Perform a deep multimodal extraction. You must extract:
1. **Core Product Value**: Deep analysis of the main offering and its value.
2. **Target Industry/Personas**: Who is this for? Identify specific industries and personas/decision-makers.
3. **Specific Sales Pain Points**: What specific problems does this solve that sales should focus on?

CRITICAL: Do NOT hallucinate. Only use information present in the file. If the file is unclear or contains no product info, return an empty analysis or validation error.
Do NOT default to "Enterprise Security" or "Cybersecurity" unless explicitly stated in the text.

For *each* sector identified, also find:
1. **Sector Name**: Specific industry.
2. **Rationale**: Why this sector?
3. **Target Roles**: Decision makers.
4. **Value Proposition**: Selling point.
5. **Pain Points**: Problems solved.
6. **Strategy Mix**: Outreach channels.
7. **Key News Signals**: Triggers to monitor (e.g., Funding, Hiring).

Return the response as a valid JSON object with this exact structure:
${ANALYSIS_SCHEMA}
`;

export async function POST(request: Request) {
    let formData;
    try {
        formData = await request.formData();
    } catch (e) {
        return NextResponse.json({ success: false, error: 'Invalid Form Data' }, { status: 400 });
    }

    const files = formData.getAll('files') as File[];
    if (!files || files.length === 0) {
        return NextResponse.json({ success: false, error: 'No files uploaded' }, { status: 400 });
    }

    // --- STRATEGY 0: PRE-PROCESS TEXT EXTRACTION ---
    let combinedText = "";

    // Polyfill for DOM objects to prevent pdf-parse from crashing in Node/NextJS
    if (typeof global !== "undefined") {
        (global as any).DOMMatrix = (global as any).DOMMatrix || class DOMMatrix { };
        (global as any).ImageData = (global as any).ImageData || class ImageData { };
        (global as any).Path2D = (global as any).Path2D || class Path2D { };
    }

    const pdfParse = require('pdf-parse');

    for (const file of files) {
        if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            try {
                const data = await pdfParse(buffer);
                combinedText += `\n--- File: ${file.name} ---\n${data.text}\n`;
            } catch (pdfErr) {
                console.error("PDF Parse Error:", pdfErr);
            }
        } else {
            const text = await file.text();
            combinedText += `\n--- File: ${file.name} ---\n${text}\n`;
        }
    }

    if (!combinedText.trim()) {
        return NextResponse.json({ success: false, error: 'Could not extract text from uploaded files.' }, { status: 400 });
    }

    // --- STRATEGY 1: GEMINI 1.5 PRO (Text Analysis) ---
    try {
        console.log("Attempting Analysis with Gemini 1.5 Pro on Extracted Text...");
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) throw new Error("Missing Gemini API Key");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

        const prompt = `${PROMPT_TEXT}\n\nHere is the document content:\n${combinedText}`;
        const result = await model.generateContent([prompt]);
        const response = await result.response;
        let jsonStr = response.text();

        // Cleanup JSON
        jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
        const analysis = JSON.parse(jsonStr);

        return NextResponse.json({ success: true, analysis, source: "gemini-1.5-pro" });

    } catch (geminiError: any) {
        console.error("Gemini Analysis Failed:", geminiError.message);
        console.log("Triggering Failover to OpenAI GPT-4o...");

        // --- STRATEGY 2: OPENAI GPT-4o (Failover) ---
        try {
            const openaiKey = process.env.OPENAI_API_KEY;
            if (!openaiKey) throw new Error("Missing OpenAI API Key");

            const openai = new OpenAI({ apiKey: openaiKey });

            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: "You are a Senior AI Orchestration Engineer." },
                    { role: "user", content: `${PROMPT_TEXT}\n\nHere is the document content:\n${combinedText}` }
                ],
                response_format: { type: "json_object" }
            });

            const content = completion.choices[0].message.content;
            if (!content) throw new Error("Empty response from OpenAI");

            const analysis = JSON.parse(content);
            return NextResponse.json({ success: true, analysis, source: "gpt-4o" });

        } catch (openaiError: any) {
            console.error("OpenAI Failover Failed:", openaiError.message);

            return NextResponse.json({
                success: false,
                error: "All analysis models failed.",
                details: "I am struggling with the formatting of this PDF. Could you paste the text directly into our chat or try a different export?"
            }, { status: 500 });
        }
    }
}
