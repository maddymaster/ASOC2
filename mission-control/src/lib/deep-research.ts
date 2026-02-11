import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface NewsItem {
    title: string;
    source: string;
    date: string;
    snippet: string;
    url: string;
}

export const DeepResearchService = {
    /**
     * Simulates fetching recent news about a company.
     * In a real production app, this would call Tavily, Bing, or Google Search API.
     */
    findCompanyNews: async (companyName: string): Promise<NewsItem[]> => {
        console.log(`Searching news for ${companyName}...`);

        // Mocking "Live" retrieval for the demo to ensure reliability without extra API keys
        // We can randomise this slightly to make it feel dynamic
        return [
            {
                title: `${companyName} raises Series B to expand Market presence`,
                source: "TechCrunch",
                date: "2 days ago",
                snippet: `${companyName} has secured $50M in Series B funding led by Sequoia. The funds will be used to scale the sales team and expand into Europe.`,
                url: "https://techcrunch.com/example"
            },
            {
                title: `${companyName} launches new AI-powered Analytics Dashboard`,
                source: "PR Newswire",
                date: "1 week ago",
                snippet: `New features include predictive modeling and real-time collaboration. ${companyName} aims to disrupt the legacy analytics market.`,
                url: "https://prnewswire.com/example"
            },
            {
                title: "Hiring Spree: Engineering and Sales roles open",
                source: "LinkedIn",
                date: "3 days ago",
                snippet: `${companyName} is aggressively hiring for their New York and London offices.`,
                url: "https://linkedin.com/example"
            }
        ];
    },

    /**
     * Generates a personalized email draft using the news context.
     */
    generateDraft: async (leadId: string, companyName: string, contactName: string, role: string) => {
        const news = await DeepResearchService.findCompanyNews(companyName);

        const systemPrompt = `
            You are a top-tier SDR (Sales Development Representative) specializing in "Deep Research" outreach.
            
            GOAL:
            Write a "First Touch" email to a prospect.
            
            RULES:
            1. The email MUST reference specific recent news from the context provided.
            2. Connect the news to our value proposition (ASSUME we sell "Mission Control", an AI Sales Operation Platform).
            3. Keep it under 150 words.
            4. Tone: Professional, slightly casual, not salesy. "Helping, not selling".
            5. Subject line must be catchy and relevant to the news.
            
            OUTPUT FORMAT:
            JSON object: { "subject": "...", "body": "..." }
        `;

        const userPrompt = `
            Prospect: ${contactName}, ${role} at ${companyName}.
            
            Recent News Context:
            ${JSON.stringify(news, null, 2)}
        `;

        try {
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                model: "gpt-4-turbo-preview",
                response_format: { type: "json_object" }
            });

            const content = JSON.parse(completion.choices[0].message.content || "{}");

            // Save to DB
            const draft = await prisma.emailDraft.create({
                data: {
                    leadId: leadId,
                    subject: content.subject,
                    body: content.body,
                    status: 'DRAFT',
                    researchContext: JSON.stringify(news)
                }
            });

            return draft;

        } catch (error) {
            console.error("Deep Research Generation Failed:", error);
            throw new Error("Failed to generate email draft");
        }
    }
};
