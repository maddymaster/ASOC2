
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { type, credentials } = await request.json();

        if (!type || !credentials) {
            return NextResponse.json({ error: "Missing type or credentials" }, { status: 400 });
        }

        switch (type) {
            case 'apollo':
                return await testApollo(credentials.apiKey);
            case 'retell':
                return await testRetell(credentials.apiKey);
            case 'vapi':
                return await testVapi(credentials.apiKey);
            case 'calendly':
                return await testCalendly(credentials.token);
            case 'smtp':
                return await testSMTP(credentials);
            default:
                return NextResponse.json({ error: "Invalid integration type" }, { status: 400 });
        }

    } catch (error) {
        console.error("Integration Test Error:", error);
        return NextResponse.json({
            success: false,
            error: "Validation failed"
        }, { status: 500 });
    }
}

async function testApollo(apiKey: string) {
    if (!apiKey) return fail("API Key is missing");
    try {
        const res = await fetch("https://api.apollo.io/v1/auth/health", {
            headers: { "Cache-Control": "no-cache", "Content-Type": "application/json", "X-Api-Key": apiKey }
        });
        if (res.ok) return success("Apollo Connected");
        return fail("Invalid Apollo API Key");
    } catch (e) { return fail("Network Error to Apollo"); }
}

async function testRetell(apiKey: string) {
    if (!apiKey) return fail("API Key is missing");
    try {
        const res = await fetch("https://api.retellai.com/list-agents", {
            headers: { "Authorization": `Bearer ${apiKey}` }
        });
        if (res.ok) return success("Retell Connected");
        return fail("Invalid Retell API Key");
    } catch (e) { return fail("Network Error to Retell"); }
}

async function testVapi(apiKey: string) {
    if (!apiKey) return fail("API Key is missing");
    try {
        const res = await fetch("https://api.vapi.ai/assistant", {
            headers: { "Authorization": `Bearer ${apiKey}` }
        });
        if (res.ok) return success("Vapi Connected");
        return fail("Invalid Vapi API Key");
    } catch (e) { return fail("Network Error to Vapi"); }
}

async function testCalendly(token: string) {
    if (!token) return fail("Token is missing");
    try {
        const res = await fetch("https://api.calendly.com/users/me", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) return success("Calendly Connected");
        return fail("Invalid Calendly Token");
    } catch (e) { return fail("Network Error to Calendly"); }
}

async function testSMTP(creds: any) {
    if (!creds.host || !creds.user || !creds.pass) return fail("Missing SMTP details");

    try {
        const transporter = nodemailer.createTransport({
            host: creds.host,
            port: Number(creds.port) || 587,
            secure: Number(creds.port) === 465,
            auth: {
                user: creds.user,
                pass: creds.pass
            }
        });

        await transporter.verify();
        return success("SMTP Connected");
    } catch (e: any) {
        return fail(`SMTP Failed: ${e.message}`);
    }
}

function success(message: string) {
    return NextResponse.json({ success: true, message });
}

function fail(error: string) {
    return NextResponse.json({ success: false, error }, { status: 400 });
}
