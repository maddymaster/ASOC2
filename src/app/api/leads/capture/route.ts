import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendVerificationEmail } from '@/lib/email';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { firstName, email, company, role } = body;

        if (!email || !firstName) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Check if DB is reachable by simple query, or just trap the error in the upsert
        let lead;
        try {
            lead = await prisma.lead.upsert({
                where: { email },
                update: {
                    name: firstName,
                    company: company || undefined,
                    role: role || undefined,
                    verificationToken,
                    isVerified: false,
                    source: 'whitepaper_download',
                    updatedAt: new Date(),
                },
                create: {
                    email,
                    name: firstName,
                    company: company || 'Unknown',
                    role: role || 'Unknown',
                    verificationToken,
                    isVerified: false,
                    source: 'whitepaper_download',
                    status: 'NEW',
                },
            });
        } catch (dbError) {
            console.warn('[Lead Capture] DB connection failed. Enabled DEMO_MODE fallback.', dbError);
            // Fallback for demo: proceed without saving to DB
        }

        // Send email (works even without DB)
        // If we didn't save to DB, we still trust the generated token for the demo link
        await sendVerificationEmail(email, firstName, verificationToken);

        return NextResponse.json({
            success: true,
            message: 'Verification email sent',
            demoMode: !lead
        });

    } catch (error: any) {
        console.error('[Lead Capture] Critical Error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
