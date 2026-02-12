import { NextResponse } from 'next/server';
import { calculateLeadScore } from '@/lib/scoring';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { strategy, apiKey } = await request.json();
        console.log('Apollo Search Strategy:', strategy);

        const APOLLO_API_KEY = apiKey || process.env.APOLLO_API_KEY;

        if (!APOLLO_API_KEY) {
            return NextResponse.json({ success: false, error: 'Missing Apollo API Key' }, { status: 401 });
        }

        console.log('Fetching Real Leads from Apollo...');
        const response = await fetch('https://api.apollo.io/v1/mixed_people/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            },
            body: JSON.stringify({
                api_key: APOLLO_API_KEY,
                q_organization_domains: strategy.domain ? [strategy.domain] : undefined,
                page: 1,
                per_page: 10,
                person_titles: strategy.targetRole ? [strategy.targetRole] : undefined,
                organization_locations: strategy.geo ? [strategy.geo] : undefined,
                organization_num_employees_ranges: mapCompanySize(strategy.companySize)
            }),
        });

        const data = await response.json();

        if (data.people) {
            const realLeads = await Promise.all(data.people.map(async (person: any) => {
                const leadData = {
                    email: person.email || `missing-${person.id}@example.com`,
                    name: `${person.first_name || ''} ${person.last_name || ''}`.trim(),
                    company: person.organization?.name || 'Unknown Corp',
                    role: person.title || 'Unknown Role',
                    phone: person.phone_numbers?.[0]?.sanitized_number || null,
                    status: 'NEW',
                    score: calculateLeadScore(person),
                    source: 'apollo'
                };

                // Upsert to avoid duplicates
                const savedLead = await prisma.lead.upsert({
                    where: { email: leadData.email },
                    update: leadData,
                    create: leadData
                });

                return {
                    ...savedLead,
                    location: person.city ? `${person.city}, ${person.state}` : (person.organization?.primary_location?.city || 'Unknown'),
                    employees: person.organization?.estimated_num_employees || 'Unknown',
                };
            }));

            return NextResponse.json({ success: true, leads: realLeads });
        } else {
            return NextResponse.json({ success: false, error: 'No leads found from Apollo' });
        }

    } catch (error) {
        console.error("Apollo API Error:", error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

function mapCompanySize(size: string | undefined) {
    if (!size) return undefined;
    if (size.includes('1-10')) return ['1,10'];
    if (size.includes('11-50')) return ['11,50'];
    if (size.includes('51-200')) return ['51,200'];
    if (size.includes('201-500')) return ['201,500'];
    if (size.includes('501-1000')) return ['501,1000'];
    return ['5000+']; // Default fallback
}
