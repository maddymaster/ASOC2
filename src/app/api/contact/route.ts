import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { name, email, company, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const inquiry = await prisma.inquiry.create({
            data: {
                name,
                email,
                company: company || '',
                message
            }
        });

        return NextResponse.json(inquiry);
    } catch (error) {
        console.error("Contact Form Error:", error);
        return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
    }
}
