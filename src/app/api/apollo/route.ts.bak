import { NextResponse } from 'next/server';
import { calculateLeadScore } from '@/lib/scoring';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { strategy, apiKey } = await request.json();
        console.log('Apollo Search Strategy:', strategy);

        const APOLLO_API_KEY = apiKey || process.env.APOLLO_API_KEY;

        if (!APOLLO_API_KEY) {
            return NextResponse.json({
                success: false,
                error: 'Missing Apollo API Key',
                errorType: 'auth',
                message: 'Please configure your Apollo API key in Demo Settings'
            }, { status: 401 });
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
                organization_locations: strategy.geo && strategy.geo !== 'Global' ? [strategy.geo] : undefined,
                organization_num_employees_ranges: mapCompanySize(strategy.companySize)
            }),
        });

        const data = await response.json();

        // Handle Apollo API errors
        if (!response.ok) {
            console.error('Apollo API Error:', data);

            // Rate limit detection
            if (response.status === 429) {
                return NextResponse.json({
                    success: false,
                    error: 'Rate limit exceeded',
                    errorType: 'rate_limit',
                    message: 'Apollo API rate limit reached. Please wait a few minutes and try again.',
                    retryAfter: 60
                }, { status: 429 });
            }

            // Invalid API key
            if (response.status === 401 || response.status === 403) {
                return NextResponse.json({
                    success: false,
                    error: 'Invalid API credentials',
                    errorType: 'auth',
                    message: 'Your Apollo API key is invalid or expired. Please update it in Demo Settings.'
                }, { status: 401 });
            }

            // Generic error
            return NextResponse.json({
                success: false,
                error: data.error || 'Apollo API request failed',
                errorType: 'api_error',
                message: `Apollo API error: ${data.error || 'Unknown error'}`
            }, { status: response.status });
        }

        // Handle empty results
        if (!data.people || data.people.length === 0) {
            return NextResponse.json({
                success: true,
                leads: [],
                message: 'No leads found matching your criteria. Try adjusting your search parameters.',
                isEmpty: true
            });
        }

        // Process leads
        const realLeads = await Promise.all(data.people.map(async (person: any) => {
            const leadData = {
                email: person.email || `missing-${person.id}@example.com`,
                name: `${person.first_name || ''} ${person.last_name || ''}`.trim() || 'Unknown Name',
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
                // Include raw Apollo data for enrichment
                apolloData: {
                    linkedin: person.linkedin_url,
                    photoUrl: person.photo_url,
                    headline: person.headline,
                    employmentHistory: person.employment_history?.slice(0, 2) // Last 2 positions
                }
            };
        }));

        return NextResponse.json({
            success: true,
            leads: realLeads,
            totalResults: data.pagination?.total_entries || realLeads.length,
            message: `Successfully fetched ${realLeads.length} leads from Apollo`
        });

    } catch (error: any) {
        console.error("Apollo API Error:", error);

        // Handle network errors
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            return NextResponse.json({
                success: false,
                error: 'Network error',
                errorType: 'network',
                message: 'Unable to connect to Apollo API. Please check your internet connection.'
            }, { status: 503 });
        }

        // Generic internal error
        return NextResponse.json({
            success: false,
            error: 'Internal Server Error',
            errorType: 'server',
            message: 'An unexpected error occurred. Please try again later.',
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
    return ['5000+']; // Default fallback
}
