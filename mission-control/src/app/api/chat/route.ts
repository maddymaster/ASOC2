import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// System Prompt
const SYSTEM_PROMPT = `
  You are a specialized Growth Strategist & Lead Generation Agent for "Mission Control".
  Your goal is to analyze the user's product or service description and recommend a lead generation strategy.
  
  If the user provides a product description, you must:
  1. Analyze the target audience.
  2. Recommend:
     - Target Sectors (Industries)
     - Target Geographies
     - Company Size (Employee count)
  3. Ask for confirmation to proceed with finding leads.

  Format your response as a JSON object with this structure:
  {
     "content": "Your natural language response...",
     "strategy": { ... } // Only if defining a new strategy
     "action": "draft_emails" // Set this ONLY if the user explicitly asks to draft/write emails for the leads.
  }
  
  If the user asks to "Draft emails" or "Start campaign", set "action": "draft_emails".
  Otherwise, leave "action" null or omit it.

  IMPORTANT: If you are NOT yet ready to recommend a strategy (e.g. user said "Hi"), 
  return "strategy": null in the JSON.
  ALWAYS return valid JSON. Do not use markdown code blocks.
`;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { messages, sessionId } = body;
        const lastMessage = messages[messages.length - 1];

        if (!lastMessage) {
            return NextResponse.json({ error: 'No message provided' }, { status: 400 });
        }

        // 1. Save User Message
        if (sessionId) {
            await prisma.chatMessage.create({
                data: {
                    sessionId,
                    role: 'user',
                    content: lastMessage.content
                }
            });
        }

        // 2. Build History
        let history = [
            {
                role: "user",
                parts: [{ text: SYSTEM_PROMPT }]
            },
            {
                role: "model",
                parts: [{ text: "Understood. I am ready to act as the Mission Control Growth Strategist. I will return valid JSON responses." }]
            }
        ];

        // If session exists, fetch recent history
        if (sessionId) {
            const dbMessages = await prisma.chatMessage.findMany({
                where: { sessionId },
                orderBy: { createdAt: 'asc' },
                take: 10 // Last 10 messages for context
            });

            const formattedHistory = dbMessages.map((msg: any) => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }));

            // Remove the last one if it was the one we just saved (to avoid duplication in prompt)
            // Actually, we don't include the *current* message in history, we send it as the prompt.
            // So we should exclude the very last inserted message or better yet, query *before* insertion or just map correctly.
            // Let's filter out the one we just inserted by ID or just logic.
            // Simplified: The `sendMessage` takes the new message. History should contain *past* messages.

            // We'll just take the DB messages excluding the one we just saved? 
            // Or simpler: We load history, THEN save current message, THEN send to AI.
            // For now, let's just append the dbMessages (minus the last one we just added) to history.

            history = [...history, ...formattedHistory.slice(0, -1)];
        }

        // 3. Generate Response
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const chat = model.startChat({
            history: history,
            generationConfig: { maxOutputTokens: 1000 },
        });

        const result = await chat.sendMessage(lastMessage.content);
        const responseText = result.response.text();

        // Clean JSON
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        // 4. Save AI Response
        if (sessionId) {
            await prisma.chatMessage.create({
                data: {
                    sessionId,
                    role: 'assistant',
                    content: cleanJson // Save the raw JSON or parsed content? Storing raw for now to preserve structure.
                }
            });
        }

        try {
            const parsedResponse = JSON.parse(cleanJson);
            return NextResponse.json(parsedResponse);
        } catch (e) {
            console.error("Failed to parse JSON from Gemini:", responseText);
            return NextResponse.json({
                content: responseText,
                strategy: null
            });
        }

    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
