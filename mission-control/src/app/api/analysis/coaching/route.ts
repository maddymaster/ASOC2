import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(request: Request) {
    try {
        const { callId, transcript } = await request.json();

        if (!transcript) {
            return NextResponse.json({ success: false, error: 'No transcript provided' }, { status: 400 });
        }

        // AI Analysis Logic
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `
      Analyze the following sales call transcript based on the "ASOC" Sales Framework.
      
      Transcript:
      "${transcript}"
      
      Your Goal: Provide coaching feedback for the agent (Alex).
      
      Output JSON format:
      {
        "win": "What the agent did well (e.g., empathy, pacing)",
        "gap": "Where the agent could improve (e.g., missed objection handling)",
        "score": 8  // A number 1-10
      }
      
      Return ONLY valid JSON.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean and parse JSON
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const coachingData = JSON.parse(jsonStr);

        // Save to DB (if callId exists)
        if (callId) {
            await prisma.callLog.update({
                where: { id: callId },
                data: { coachingData: JSON.stringify(coachingData) } as any
            });
        }

        return NextResponse.json({ success: true, analysis: coachingData });

    } catch (error) {
        console.error("Coaching Analysis Error:", error);
        return NextResponse.json({ success: false, error: 'Analysis Failed' }, { status: 500 });
    }
}
