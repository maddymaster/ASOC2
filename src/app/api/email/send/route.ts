import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { to, subject, html, leadId } = await request.json();

        // 1. Initialize Resend
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ success: false, error: 'Missing Resend API Key' }, { status: 500 });
        }

        const resend = new Resend(apiKey);

        // 2. Send Email
        const { data, error } = await resend.emails.send({
            from: 'Sales Team <onboarding@resend.dev>', // Update this with your verified domain in Prod
            to: [to],
            subject: subject,
            html: html,
        });

        if (error) {
            console.error("Resend Error:", error);
            // Log failure if leadId exists
            if (leadId) {
                await prisma.outboundLog.create({
                    data: {
                        leadId,
                        status: 'FAILED',
                        providerId: null,
                        subject,
                        metadata: JSON.stringify(error)
                    }
                });
            }
            return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }

        console.log("Email sent successfully:", data?.id);

        // 3. Log Success to DB
        if (leadId) {
            await prisma.outboundLog.create({
                data: {
                    leadId,
                    status: 'SENT',
                    providerId: data?.id,
                    subject,
                    metadata: JSON.stringify({ provider: 'resend' })
                }
            });

            // Update Lead Status
            await prisma.lead.update({
                where: { id: leadId },
                data: { status: 'CONTACTED' }
            });

            // Update Draft Status if needed (logic usually handled in UI, but good to be safe)
            // We assume the UI handles the draft update via a separate PATCH call or we could do it here if draftId was passed
        }

        return NextResponse.json({ success: true, messageId: data?.id });

    } catch (error: any) {
        console.error("Email Send Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
