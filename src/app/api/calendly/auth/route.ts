import { NextResponse } from "next/server";

const CALENDLY_AUTH_URL = "https://auth.calendly.com/oauth/authorize";
const CLIENT_ID = process.env.CALENDLY_CLIENT_ID;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/calendly/callback`;

export async function GET() {
    if (!CLIENT_ID) {
        return NextResponse.json({ error: "Missing Calendly Client ID" }, { status: 500 });
    }

    const url = new URL(CALENDLY_AUTH_URL);
    url.searchParams.append("client_id", CLIENT_ID);
    url.searchParams.append("response_type", "code");
    url.searchParams.append("redirect_uri", REDIRECT_URI);

    return NextResponse.redirect(url.toString());
}
