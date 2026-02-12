import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { to, subject, html, smtpSettings } = await request.json();

        // 1. Determine Credentials (Priority: Request Body > Env Vars)
        const host = smtpSettings?.host || process.env.SMTP_HOST;
        const port = smtpSettings?.port || process.env.SMTP_PORT;
        const user = smtpSettings?.user || process.env.SMTP_USER;
        const pass = smtpSettings?.pass || process.env.SMTP_PASS;

        if (!host || !user || !pass) {
            return NextResponse.json({ success: false, error: 'Missing SMTP Credentials' }, { status: 400 });
        }

        // 2. Create Transporter
        const transporter = nodemailer.createTransport({
            host,
            port: Number(port) || 587,
            secure: Number(port) === 465, // true for 465, false for other ports
            auth: { user, pass },
        });

        // 3. Send Email
        const info = await transporter.sendMail({
            from: `"${user}" <${user}>`, // Default to auth user
            to,
            subject,
            html,
        });

        console.log("Message sent: %s", info.messageId);
        return NextResponse.json({ success: true, messageId: info.messageId });

    } catch (error: any) {
        console.error("Email Send Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
