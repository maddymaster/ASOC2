import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendVerificationEmail(email: string, name: string, token: string) {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/leads/verify?token=${token}`;

    // If no Resend Key, mock it (Dev/Demo mode)
    if (!resend) {
        console.log('================================================================');
        console.log(`[MOCK EMAIL] To: ${email}`);
        console.log(`[MOCK EMAIL] Subject: Verify your email to download the Whitepaper`);
        console.log(`[MOCK EMAIL] Verification Link: ${verificationUrl}`);
        console.log('================================================================');
        return true;
    }

    try {
        await resend.emails.send({
            from: 'Mission Control <onboarding@resend.dev>', // Update with your verified domain
            to: email,
            subject: 'Unlock your 2026 Strategy Whitepaper',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #0f172a;">Verify your email</h1>
                    <p>Hi ${name},</p>
                    <p>Thanks for requesting "The 2026 Strategy: How Autonomous Agents are Reclaiming 80% of Sales Time".</p>
                    <p>Please click the button below to verify your email and download the PDF.</p>
                    <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">Verify & Download PDF</a>
                    <p style="font-size: 12px; color: #64748b;">If you didn't request this, please ignore this email.</p>
                </div>
            `,
        });
        return true;
    } catch (error) {
        console.error('Error sending email via Resend:', error);
        return false;
    }
}
