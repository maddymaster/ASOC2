import OpenAI from 'openai';
import { prisma } from './prisma';

// const openai = new OpenAI({ ... }); // Removed top-level init

export class DeepResearchService {
    static async generateDraft(
        leadId: string,
        companyName: string,
        contactName: string,
        role: string,
        rationale: string,
        valueProp: string
    ) {
        // Mock or Real Logic depending on API Key presence
        const prompt = `Draft a cold email to ${contactName}, ${role} at ${companyName}.
        Rationale: ${rationale}
        Value Prop: ${valueProp}
        Keep it under 150 words.`;

        let emailBody = "";
        try {
            if (process.env.OPENAI_API_KEY) {
                const openai = new OpenAI({
                    apiKey: process.env.OPENAI_API_KEY,
                });
                const completion = await openai.chat.completions.create({
                    messages: [{ role: "user", content: prompt }],
                    model: "gpt-4-turbo",
                });
                emailBody = completion.choices[0].message.content || "Draft generation failed.";
            } else {
                emailBody = `Hi ${contactName},\n\nI noticed ${companyName} is leading in your sector. ${rationale}\n\n${valueProp}\n\nBest,\nSales Team`;
            }
        } catch (e) {
            console.error("OpenAI Error:", e);
            emailBody = `Hi ${contactName},\n\nI noticed ${companyName} is leading in your sector. ${rationale}\n\n${valueProp}\n\nBest,\nSales Team`;
        }

        return await prisma.emailDraft.create({
            data: {
                leadId,
                subject: `Partnership with ${companyName}`,
                body: emailBody,
                status: 'DRAFT',
                researchContext: JSON.stringify({ rationale })
            }
        });
    }
}
