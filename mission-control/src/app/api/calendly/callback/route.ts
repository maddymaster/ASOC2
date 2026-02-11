import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CALENDLY_TOKEN_URL = "https://auth.calendly.com/oauth/token";
const CLIENT_ID = process.env.CALENDLY_CLIENT_ID;
const CLIENT_SECRET = process.env.CALENDLY_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/calendly/callback`;

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code || !CLIENT_ID || !CLIENT_SECRET) {
        return NextResponse.json({ error: "Invalid request or missing credentials" }, { status: 400 });
    }

    try {
        // Exchange code for token
        const authString = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

        const response = await fetch(CALENDLY_TOKEN_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Basic ${authString}`
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: REDIRECT_URI
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Calendly Token Error", data);
            return NextResponse.json({ error: "Failed to exchange token", details: data }, { status: 500 });
        }

        // TODO: Store tokens securely associated with the user/organization
        // For now, we'll log it and maybe update a system setting if we had one
        console.log("Calendly Tokens Received:", {
            access_token: "REDACTED",
            refresh_token: "REDACTED",
            expires_in: data.expires_in
        });

        // In a real app: await prisma.integration.upsert(...)

        return NextResponse.redirect(new URL("/dashboard?calendly=connected", req.url));

    } catch (error) {
        console.error("Calendly Callback Error", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
