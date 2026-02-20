import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { messages, expertAnalysis } = body;

        const openaiKey = process.env.OPENAI_API_KEY;
        if (!openaiKey) {
            return NextResponse.json({ error: "Missing OpenAI API Key" }, { status: 500 });
        }

        const openai = new OpenAI({ apiKey: openaiKey });

        // Build context string from expertAnalysis
        let contextString = "No product data provided yet.";
        let productName = "Unknown Product";
        let industry = "Unknown Industry";
        let feature = "Unknown Feature";

        if (expertAnalysis) {
            productName = expertAnalysis.summary ? expertAnalysis.summary.split('.')[0] : "Your Product";
            industry = expertAnalysis.targetIndustryPersonas?.[0]?.industry || expertAnalysis.sectors?.[0]?.sector || "your target industry";
            feature = expertAnalysis.coreProductValue || expertAnalysis.sectors?.[0]?.valueProposition || "your core features";

            contextString = `
PRODUCT ANALYSIS CONTEXT:
- Core Product Value / Summary: ${expertAnalysis.coreProductValue || expertAnalysis.summary}
- Target Industry/Personas: ${JSON.stringify(expertAnalysis.targetIndustryPersonas || [])}
- Sectors (Fallback): ${JSON.stringify(expertAnalysis.sectors || [])}
- Specific Sales Pain Points: ${JSON.stringify(expertAnalysis.specificSalesPainPoints || [])}
`;
        }

        const systemPrompt = `
You are a Sales Strategy Expert.

IDENTITY: 
If asked 'Who are you?', you MUST respond exactly: "I am your Mission Control Supervisor. I analyze your product data to orchestrate lead generation, voice outreach, and email campaigns."

BUSINESS GUARDRAILS: 
Implement a strict System Prompt Guardrail. Any queries regarding generic topics (weather, general advice, unrelated hobbies, etc.) MUST be redirected exactly with: "I’m here to focus on your sales mission. Let’s get back to your campaign strategy."

CONTEXTUAL INTELLIGENCE:
When the user asks 'How can I sell my product?' or asks for a sales strategy, you MUST reference the uploaded PRD data. Formulate your response similar to: "Based on the [Product Name or Description] PRD you provided, we should target [Industry] by highlighting [Feature X]. Shall I deploy the agents for this?"
Use the information in the attached PRODUCT ANALYSIS CONTEXT. 
If no PRD is provided yet, you can say: "Please upload your Product Requirement Document or paste your product features first, so I can analyze it before we plan the execution."

JSON COMMAND EXECUTION:
You must ALWAYS respond with a structured JSON object containing a "reply" string, and optionally a "command" object if the user issues a direct instruction.
1. If the user says "Deploy Agents", "Deploy the Outbound Voice agent", or "Launch Campaign", set:
   "command": {"action": "deploy_agents"}
2. If the user says "Make the email more aggressive", "make it short", "concise", "creative", etc., set:
   "command": {"action": "refine_emails", "tone": "[The requested tone, e.g., aggressive, short, professional]"}

Format:
{
  "reply": "Your conversational response here.",
  "command": {
    "action": "deploy_agents | refine_emails",
    "tone": "..." // Only if action is refine_emails
  } // omit command block if no action needed
}

PRODUCT ANALYSIS CONTEXT:
${contextString}
`;

        const formattedMessages = messages.map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
        }));

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                ...formattedMessages
            ],
            response_format: { type: "json_object" },
            temperature: 0.2
        });

        const content = completion.choices[0].message.content || "{}";
        const parsedContext = JSON.parse(content);

        return NextResponse.json({ success: true, reply: parsedContext.reply, command: parsedContext.command });

    } catch (error: any) {
        console.error("Chat API Error:", error.message);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
