import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config({ path: '.env.local' });

const WEBHOOK_SIGNING_KEY = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;
const URL = "http://localhost:3000/api/calendly/webhook";

if (!WEBHOOK_SIGNING_KEY) {
    console.error("Missing Signing Key");
    process.exit(1);
}

const payload = JSON.stringify({
    event: "invitee.created",
    payload: {
        email: "test.lead@example.com",
        name: "Test Lead",
        scheduled_event: {
            start_time: new Date().toISOString()
        }
    }
});

const t = Date.now().toString();
const signature = crypto
    .createHmac("sha256", WEBHOOK_SIGNING_KEY)
    .update(t + "." + payload)
    .digest("hex");

const header = `t=${t},v1=${signature}`;

async function main() {
    console.log("Sending Webhook...");
    try {
        const res = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Calendly-Webhook-Signature": header
            },
            body: payload
        });

        console.log("Response:", res.status, await res.text());
    } catch (e) {
        console.error("Request Failed", e);
    }
}

main();
