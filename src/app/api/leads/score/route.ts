import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

interface LeadScoringRequest {
    lead: {
        name: string;
        title: string;
        company: string;
        industry?: string;
        employees?: string | number;
        location?: string;
    };
    prdCriteria: {
        targetSector: string;
        targetRoles: string[];
        valueProposition: string;
        painPoints: string[];
        rationale?: string;
    };
}

export async function POST(request: Request) {
    try {
        const { lead, prdCriteria }: LeadScoringRequest = await request.json();

        // Validate inputs
        if (!lead || !prdCriteria) {
            return NextResponse.json({
                success: false,
                error: 'Missing required fields: lead and prdCriteria'
            }, { status: 400 });
        }

        // Initialize Gemini
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                success: false,
                error: 'Missing AI API Key',
                score: 50, // Default fallback score
                reasoning: 'AI scoring unavailable - using basic heuristics'
            }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Construct scoring prompt
        const prompt = `You are an expert B2B sales intelligence analyst. Score this lead's fit against the product requirements.

**Lead Profile:**
- Name: ${lead.name}
- Title: ${lead.title}
- Company: ${lead.company}
- Industry: ${lead.industry || 'Unknown'}
- Company Size: ${lead.employees || 'Unknown'} employees
- Location: ${lead.location || 'Unknown'}

**Product Target Criteria:**
- Target Sector: ${prdCriteria.targetSector}
- Target Roles: ${prdCriteria.targetRoles.join(', ')}
- Value Proposition: ${prdCriteria.valueProposition}
- Pain Points Addressed: ${prdCriteria.painPoints.join(', ')}
${prdCriteria.rationale ? `- Strategic Rationale: ${prdCriteria.rationale}` : ''}

**Task:**
Analyze this lead's fit score (0-100) based on:
1. Title alignment with target roles (30% weight)
2. Industry/sector match (25% weight)
3. Company size appropriateness (20% weight)
4. Decision-making authority (15% weight)
5. Pain point relevance (10% weight)

Return ONLY a valid JSON object with this exact structure:
{
  "score": <number 0-100>,
  "reasoning": "<2-3 sentence explanation>",
  "confidence": "<high|medium|low>",
  "keyFactors": {
    "titleMatch": "<yes|partial|no>",
    "sectorMatch": "<yes|partial|no>",
    "sizeMatch": "<yes|partial|no>"
  }
}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Parse JSON response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Invalid JSON response from AI');
        }

        const scoringResult = JSON.parse(jsonMatch[0]);

        // Validate score range
        scoringResult.score = Math.max(0, Math.min(100, scoringResult.score));

        return NextResponse.json({
            success: true,
            ...scoringResult,
            leadId: lead.name.replace(/\s+/g, '_').toLowerCase()
        });

    } catch (error: any) {
        console.error("Lead Scoring Error:", error);

        // Fallback to basic heuristic scoring
        const request: LeadScoringRequest = await new Response(error.request?.body).json().catch(() => ({}));
        const fallbackScore = calculateFallbackScore(request?.lead, request?.prdCriteria);

        return NextResponse.json({
            success: false,
            score: fallbackScore,
            reasoning: 'AI scoring failed - using basic heuristics based on title and industry match',
            confidence: 'low',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Scoring service unavailable'
        }, { status: 200 }); // Return 200 with fallback data
    }
}

// Fallback scoring function (basic heuristics)
function calculateFallbackScore(lead: any, criteria: any): number {
    if (!lead || !criteria) return 50;

    let score = 50; // Base score

    // Title match
    const titleLower = lead.title?.toLowerCase() || '';
    const targetRoles = criteria.targetRoles?.map((r: string) => r.toLowerCase()) || [];
    const hasExactMatch = targetRoles.some((role: string) => titleLower.includes(role));
    const hasSeniorTitle = /ceo|cto|vp|director|head|founder|president/i.test(titleLower);

    if (hasExactMatch) score += 25;
    else if (hasSeniorTitle) score += 15;

    // Industry/sector match (rough heuristics)
    const companyName = lead.company?.toLowerCase() || '';
    const targetSector = criteria.targetSector?.toLowerCase() || '';
    if (companyName.includes(targetSector) || targetSector.includes(companyName)) {
        score += 15;
    }

    // Company size appropriateness
    const employees = parseInt(String(lead.employees || '0').replace(/[^0-9]/g, ''));
    if (employees > 50 && employees < 1000) score += 10; // Sweet spot for most B2B

    return Math.min(score, 100);
}
