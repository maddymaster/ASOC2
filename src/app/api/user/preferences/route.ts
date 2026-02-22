import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch User and Preferences (Upsert dummy user to satisfy relation if missing)
        const user = await prisma.user.upsert({
            where: { clerkUserId: userId },
            update: {},
            create: {
                clerkUserId: userId,
                email: `${userId}@clerk.local`, // Fallback
                name: "Clerk User",
            },
            include: { UserPreference: true }
        });

        // Initialize defaults if no preferences
        let preferences = user.UserPreference;
        if (!preferences) {
            preferences = await prisma.userPreference.create({
                data: {
                    userId: user.id
                }
            });
        }

        return NextResponse.json({ preferences });

    } catch (error) {
        console.error("Preferences GET Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId }
        });

        if (!user) return NextResponse.json({ error: 'User setup incomplete' }, { status: 400 });

        const updatedPrefs = await prisma.userPreference.upsert({
            where: { userId: user.id },
            update: {
                missionStyle: body.missionStyle,
                maxEmailsPerDay: body.maxEmailsPerDay,
                maxCallsPerDay: body.maxCallsPerDay,
                emailFollowUpCount: body.emailFollowUpCount,
                emailDelayDays: body.emailDelayDays,
                callFollowUpCount: body.callFollowUpCount,
                callDelayDays: body.callDelayDays
            },
            create: {
                userId: user.id,
                missionStyle: body.missionStyle,
                maxEmailsPerDay: body.maxEmailsPerDay,
                maxCallsPerDay: body.maxCallsPerDay,
                emailFollowUpCount: body.emailFollowUpCount,
                emailDelayDays: body.emailDelayDays,
                callFollowUpCount: body.callFollowUpCount,
                callDelayDays: body.callDelayDays
            }
        });

        return NextResponse.json({ preferences: updatedPrefs });
    } catch (error) {
        console.error("Preferences POST Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
