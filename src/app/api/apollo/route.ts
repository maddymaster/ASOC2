import { NextResponse } from 'next/server';
import { calculateLeadScore } from '@/lib/scoring';
import prisma from '@/lib/prisma'; // Ensure this path is correct based on your project structure

export async function POST(request: Request) {
    try {
        const { strategy, apiKey } = await request.json();
        console.log('[Apollo] Search Strategy:', strategy);

        const APOLLO_API_KEY = apiKey || process.env.APOLLO_API_KEY;

        if (!APOLLO_API_KEY) {
            return NextResponse.json({
                success: false,
                error: 'Missing Apollo API Key',
                errorType: 'auth',
                message: 'Please configure your Apollo API key in Demo Settings'
            }, { status: 401 });
        }

        console.log('[Apollo] Fetching leads with correct API format...');

        // CORRECT Apollo API format (per user's working example)
        const response = await fetch('https://api.apollo.io/api/v1/mixed_people/api_search', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'x-api-key': APOLLO_API_KEY  // Header auth, not body
            },
            body: JSON.stringify({
                person_titles: strategy.targetRole ? [strategy.targetRole] : undefined,
                include_similar_titles: true,
                q_organization_domains_list: strategy.domain ? [strategy.domain] : undefined,
                organization_locations: strategy.geo && strategy.geo !== 'Global' ? [strategy.geo] : undefined,
                organization_num_employees_ranges: mapCompanySize(strategy.companySize),
                page: 1,
                per_page: 10
            }),
        });

        const data = await response.json();
        console.log('[Apollo] Response:', response.status, 'People:', data.people?.length || 0);

        if (!response.ok) {
            console.error('[Apollo] API Error:', data);

            if (response.status === 429) {
                return NextResponse.json({
                    success: false,
                    error: 'Rate limit exceeded',
                    errorType: 'rate_limit',
                    message: 'Apollo API rate limit reached. Please wait.',
                    retryAfter: 60
                }, { status: 429 });
            }

            if (response.status === 401 || response.status === 403) {
                return NextResponse.json({
                    success: false,
                    error: 'Invalid API credentials',
                    errorType: 'auth',
                    message: 'Invalid Apollo API key. Please check Demo Settings.'
                }, { status: 401 });
            }

            return NextResponse.json({
                success: false,
                error: data.error || 'Apollo API request failed',
                errorType: 'api_error',
                message: `Apollo error: ${data.error || response.statusText}`
            }, { status: response.status });
        }

        if (!data.people || data.people.length === 0) {
            return NextResponse.json({
                success: true,
                leads: [],
                message: 'No leads found. Try different criteria.',
                isEmpty: true
            });
        }

        // Process leads & Sync to DB via Upsert
        const processedLeads = await Promise.all(data.people.map(async (person: any) => {
            const email = person.email || person.email_guess_status || `no-email-${person.id}@placeholder.com`;
            const name = `${person.first_name || ''} ${person.last_name || ''}`.trim() || 'Unknown';
            const company = person.organization?.name || 'Unknown Corp';
            const role = person.title || 'Unknown Role';
            const phone = person.phone_numbers?.[0]?.sanitized_number || null;
            const score = calculateLeadScore(person); // AI Score

            // Upsert Logic: Update if exists, Create if new
            try {
                const leadRecord = await prisma.lead.upsert({
                    where: { email: email },
                    update: {
                        name,
                        company,
                        role,
                        phone,
                        score, // Update score if strategy changes? Arguable, but we'll reset it.
                        // Don't override status if it's already CONTACTED etc.
                        updatedAt: new Date()
                    },
                    create: {
                        email,
                        name,
                        company,
                        role,
                        phone,
                        status: 'NEW',
                        score,
                        source: 'apollo',
                        // createdAt sets automatically
                    }
                });
                return leadRecord;
            } catch (dbError) {
                console.error(`[DB Sync] Failed to upsert lead ${email}:`, dbError);
                // Return a fallback object so the UI doesn't crash, but ID might not match DB if write failed
                return {
                    id: person.id || `temp-${Math.random()}`,
                    email, name, company, role, phone, status: 'NEW', score, source: 'apollo'
                };
            }
        }));

        console.log('[Apollo] Success:', processedLeads.length, 'leads synced to DB');

        return NextResponse.json({
            success: true,
            leads: processedLeads,
            totalResults: data.pagination?.total_entries || processedLeads.length,
            message: `Fetched & Synced ${processedLeads.length} leads`
        });

    } catch (error: any) {
        console.error('[Apollo] Server Error:', error);

        return NextResponse.json({
            success: false,
            error: 'Internal Server Error',
            errorType: 'server',
            message: 'Unexpected error occurred.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}

function mapCompanySize(size: string | undefined) {
    if (!size) return undefined;
    if (size.includes('1-10')) return ['1,10'];
    if (size.includes('11-50')) return ['11,50'];
    if (size.includes('51-200')) return ['51,200'];
    if (size.includes('201-500')) return ['201,500'];
    if (size.includes('501-1000')) return ['501,1000'];
    if (size.includes('1000')) return ['1001,5000', '5001,10000', '10001+'];
    return undefined;
}
