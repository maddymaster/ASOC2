import dotenv from 'dotenv';
import OpenAI from 'openai';

// Load env vars
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

async function main() {
    const apiKey = process.env.OPENAI_API_KEY;
    console.log("Testing OpenAI Key:", apiKey ? "Present" : "Missing");

    if (!apiKey) {
        console.error("No OPENAI_API_KEY found.");
        return;
    }

    const openai = new OpenAI({ apiKey });

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: "Hello, are you working?" }],
            model: "gpt-3.5-turbo",
        });

        console.log("OpenAI Response:", completion.choices[0].message.content);
        console.log("SUCCESS: OpenAI API Key is valid.");
    } catch (error) {
        console.error("FAILURE: OpenAI API Key check failed.", error);
    }
}

main();
