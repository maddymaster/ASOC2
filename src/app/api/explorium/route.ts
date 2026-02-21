import { NextResponse } from 'next/server';
import { ExploriumService } from '@/lib/explorium';
import prisma from '@/lib/prisma';
import { calculateLeadScore } from '@/lib/scoring';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { strategy } = await request.json();
        console.log('[Explorium] Strategy:', strategy);

        if (!process.env.EXPLORIUM_API_KEY) {
            return NextResponse.json({
                success: false,
                error: 'Missing Explorium API Key',
                errorType: 'auth'
            }, { status: 401 });
        }

        // 1. Discovery: Find Companies (Mocking Discovery for now as strict Match requires names)
        // In a real "Discovery" flow, we'd search businesses by industry.
        // Since we are migrating from Apollo (Search), we simulate "finding" companies to "Match".
        const seedCompanies = [
            { name: `${strategy.industry} Global`, domain: "global.example.com" }
        ];

        const leads: any[] = [];

        // 2. Full Flow Implementation
        for (const company of seedCompanies) {
            try {
                // Step A: Match Business
                const bizMatch = await ExploriumService.matchBusiness(company.name, company.domain);
                const businessId = bizMatch.business_id || bizMatch.id;

                if (!businessId) continue;

                // Step B: Match/Search Prospects in that Business
                const prospectsRes = await ExploriumService.matchProspects(businessId, strategy.targetRole || "VP of Sales");

                // Assuming response structure has 'prospects' array
                const rawProspects = prospectsRes.prospects || [];

                for (const p of rawProspects.slice(0, 5)) { // Limit to 5 for Lead Gen Test
                    // Step C: Enrich Prospect
                    const prospectId = p.prospect_id || p.id;
                    if (!prospectId) continue;

                    const enrichRes = await ExploriumService.enrichProspect(prospectId);
                    const enriched = enrichRes.data || enrichRes; // Adjust based on actual response

                    // Map to Lead Model
                    const email = enriched.emails?.[0]?.email || `u-${prospectId}@explorium-placeholder.com`;
                    const name = `${p.first_name} ${p.last_name}`;

                    const score = calculateLeadScore({
                        title: p.title,
                        employees: '1000+', // Mock if missing
                        location: p.location || 'Unknown'
                    });

                    // DB Upsert
                    const lead = await prisma.lead.upsert({
                        where: { email },
                        update: {
                            name,
                            company: company.name,
                            role: p.title,
                            score,
                            updatedAt: new Date()
                        },
                        create: {
                            email,
                            name,
                            company: company.name,
                            role: p.title,
                            status: 'NEW',
                            score,
                            source: 'explorium'
                        }
                    });

                    leads.push(lead);
                }

            } catch (stepError) {
                console.warn(`[Explorium] Step failed for ${company.name}:`, stepError);
            }
        }

        // If no actual API calls succeeded (likely due to Mock Discovery), generate 5 Test Leads
        if (leads.length === 0) {
            console.log("[Explorium] No live leads found, generating 5 Test Leads as requested.");
            for (let i = 1; i <= 5; i++) {
                const testLead = await prisma.lead.upsert({
                    where: { email: `test.lead.${i}@explorium.io` },
                    update: {},
                    create: {
                        email: `test.lead.${i}@explorium.io`,
                        name: `Test Explorium Lead ${i}`,
                        company: "Explorium Test Corp",
                        role: strategy.targetRole || "Head of Testing",
                        status: 'NEW',
                        score: 85 + i,
                        source: 'explorium-test'
                    }
                });
                leads.push(testLead);
            }
        }

        return NextResponse.json({
            success: true,
            leads,
            message: `Generated ${leads.length} leads via Explorium flow`
        });

    } catch (error: any) {
        console.error('[Explorium] Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
