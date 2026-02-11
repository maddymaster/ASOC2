import { ExpertAgent } from './src/lib/expert-agent';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

async function main() {
    try {
        const prdPath = path.join(process.cwd(), 'test_prd.txt');
        const prdText = fs.readFileSync(prdPath, 'utf-8');

        console.log("Analyzing PRD...");
        console.log("API Key present:", !!process.env.GOOGLE_API_KEY);

        const result = await ExpertAgent.analyzePRD(prdText);
        console.log("Analysis Result:", JSON.stringify(result, null, 2));

    } catch (error) {
        console.error("Test Failed:", error);
    }
}

main();
