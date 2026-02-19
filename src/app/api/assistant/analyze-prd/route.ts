import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

// Schema for consistent output
const ANALYSIS_SCHEMA = `
{
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

Task: Perform a deep extraction to identify 3-4 key target sectors/industries.
CRITICAL: Do NOT hallucinate. Only use information present in the file. If the file is unclear or contains no product info, return an empty analysis or validation error.
Do NOT default to "Enterprise Security" or "Cybersecurity" unless explicitly stated in the text.

For *each* sector, find:
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

    // --- STRATEGY 1: GEMINI 1.5 PRO (Multimodal) ---
    try {
        console.log("Attempting Analysis with Gemini 1.5 Pro...");
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) throw new Error("Missing Gemini API Key");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Using Pro as requested

        const contentParts: any[] = [{ text: PROMPT_TEXT }];

        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64Data = buffer.toString('base64');
            const mimeType = file.type || 'application/pdf'; // Default to PDF for most docs

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

            // Prepare files for OpenAI (Vision)
            // Note: OpenAI API doesn't accept raw PDF bytes directly in 'messages' for typical chat completions 
            // the same way Gemini does inline. 
            // For true PDF parsing with pure GPT-4o via API, we usually need text extraction or image conversion.
            // HOWEVER, since "Nuclear Prompt" says "OCR/Vision capabilities", we'll assume text extraction is mostly needed 
            // or we use the 'uploads' endpoint if we were full agent. 
            // FOR ROBUSTNESS in this "Nuclear" step without adding massive PDF deps:
            // We'll rely on a basic text extraction if possible, OR if they are images, send them.
            // Given the constraints and typical "PRD" being PDF, we'll try a fallback:
            // If it's a PDF, we might struggle without a parser lib. 
            // BUT, wait, the "Nuclear Prompt" says "extract text and core product features from the PDF".
            // If we don't have a PDF parser installed (we removed pdf-parse?), we can't extract text easily.
            // Let's check package.json again. 
            // 'pdf-parse' IS in dependencies! "^1.1.1" or similar?
            // Actually, in previous steps I saw pdf-parse in package.json.
            // Let's use it for the OpenAI fallback to ensure we send TEXT.

            let combinedText = "";
            for (const file of files) {
                if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    try {
                        const pdfParse = require('pdf-parse');
                        const data = await pdfParse(buffer);
                        combinedText += `\n--- File: ${file.name} ---\n${data.text}\n`;
                    } catch (pdfErr) {
                        console.error("PDF Parse Error (OpenAI flow):", pdfErr);
                        // If PDF parse fails, we can't do much with OpenAI unless we use Vision on images
                    }
                } else {
                    // Text files
                    const text = await file.text();
                    combinedText += `\n--- File: ${file.name} ---\n${text}\n`;
                }
            }

            if (!combinedText.trim()) {
                throw new Error("Could not extract text for OpenAI analysis");
            }

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

            // --- FINAL FALLBACK: ERROR ---
            return NextResponse.json({
                success: false,
                error: "All analysis models failed.",
                details: "I encountered an issue reading that specific file format. Could you try a PDF or a clearer text version?"
            }, { status: 500 });
        }
    }
}
