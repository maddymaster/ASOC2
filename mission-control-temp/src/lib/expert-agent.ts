import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface SectorAnalysis {
    sector: string;
    rationale: string;
    targetRoles: string[];
    valueProposition: string;
    painPoints: string[];
    strategyMix: string;
}

export interface PRDAnalysisResult {
    sectors: SectorAnalysis[];
    summary: string;
}

export const ExpertAgent = {
    /**
     * Analyzes a PRD text and identifies 3-4 high-relevance sectors.
     */
    analyzePRD: async (prdText: string): Promise<PRDAnalysisResult> => {
        const systemPrompt = `
            You are a Senior Market Strategy Consultant. 
            Analyze the following Product Requirement Document (PRD) or Product Description to identify the most viable target markets.

            TASK:
            1. Summarize the core value proposition in 1 sentence.
            2. Identify 3-4 high-relevance industry sectors (e.g., Fintech, Healthcare, Ecommerce, Manufacturing).
            3. For EACH sector, provide:
               - Rationale: Why this sector? (Cite specific regulatory, operational, or market drivers).
               - Target Roles: Specific job titles (e.g., "VP of Supply Chain", "Chief Compliance Officer").
               - Value Proposition: A tailored pitch for that specific role/sector.
               - Pain Points: 3 key problems this product solves for them.
               - Strategy Mix: Recommended GTM approach (e.g., "Cold Email + LinkedIn", "Inbound Content + Webinars", "Direct Sales").

            OUTPUT FORMAT:
            Return ONLY valid JSON with this structure:
            {
                "summary": "...",
                "sectors": [
                    {
                        "sector": "Fintech",
                        "rationale": "...",
                        "targetRoles": ["Role 1", "Role 2"],
                        "valueProposition": "...",
                        "painPoints": ["Point 1", "Point 2", "Point 3"],
                        "strategyMix": "Cold Email sequences targeting Compliance Officers + LinkedIn thought leadership."
                    }
                ]
            }
        `;

        try {
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `PRD CONTENT:\n"${prdText.substring(0, 15000)}"` }
                ],
                model: "gpt-4-turbo-preview", // or gpt-3.5-turbo if rate limits apply
                response_format: { type: "json_object" }
            });

            const response = completion.choices[0].message.content || "{}";
            return JSON.parse(response);

        } catch (error) {
            console.error("OpenAI Analysis Failed:", error);
            throw new Error("Failed to analyze PRD with Expert Agent.");
        }
    },

    /**
     * Analyzes an image (Screenshot/Diagram) to extract PRD context.
     */
    analyzeImage: async (base64Image: string): Promise<string> => {
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: "Analyze this image. If it's a screenshot of a software product or a diagram, describe its core functionality, target users, and key value propositions in detail. Treat this as a PRD input." },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${base64Image}`,
                                    detail: "high"
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 1000
            });
            return completion.choices[0].message.content || "";
        } catch (error) {
            console.error("Vision Analysis Failed:", error);
            return "";
        }
    },

    /**
     * Generates a chat response from the perspective of a specific Industry Expert.
     */
    getExpertResponse: async (
        sector: string,
        lastMessage: string,
        history: { role: string, content: string }[]
    ) => {
        const systemPrompt = `
            You are a deep-domain ${sector} Industry Expert and Consultant.
            You are advising a founder who has a product targeting your industry.
            
            YOUR GOAL:
            Provide specific, jargon-rich (but accessible), and highly relevant advice about selling to ${sector}.
            Cite specific regulations, typical organizational structures, and buying behaviors of ${sector} companies.
            
            TONE:
            Professional, experienced, insightful, slightly critical but constructive.
        `;

        const messages: any[] = [
            { role: "system", content: systemPrompt },
            ...history.map(m => ({
                role: m.role,
                content: m.content
            })),
            { role: "user", content: lastMessage }
        ];

        try {
            const completion = await openai.chat.completions.create({
                messages: messages,
                model: "gpt-4-turbo-preview",
            });

            return completion.choices[0].message.content || "";
        } catch (error) {
            console.error("OpenAI Chat Failed:", error);
            return "I apologize, but I'm having trouble connecting to my expert knowledge base right now.";
        }
    },
    /**
     * Refines an existing analysis based on user feedback.
     */
    refineStrategy: async (currentAnalysis: PRDAnalysisResult, userFeedback: string): Promise<PRDAnalysisResult> => {
        const systemPrompt = `
            You are a Senior Market Strategy Consultant. 
            You previously analyzed a PRD and provided a strategy. 
            The user now wants to REFINE that strategy based on specific feedback.

            YOUR GOAL:
            Update the "sectors", "valueProposition", "painPoints", and "strategyMix" based on the user's feedback.
            Keep the structure valid and consistent.
            
            USER FEEDBACK: "${userFeedback}"

            CURRENT ANALYSIS JSON:
            ${JSON.stringify(currentAnalysis)}

            OUTPUT:
            Return the UPDATED JSON only.
        `;

        try {
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: "Update the strategy now." }
                ],
                model: "gpt-4-turbo-preview",
                response_format: { type: "json_object" }
            });

            const response = completion.choices[0].message.content || "{}";
            return JSON.parse(response);

        } catch (error) {
            console.error("Strategy Refinement Failed:", error);
            throw new Error("Failed to refine strategy.");
        }
    }
};
