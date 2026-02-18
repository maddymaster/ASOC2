import { NextResponse } from 'next/server';
import Retell from 'retell-sdk';

export async function POST(request: Request) {
    try {
        const { leadId, phone, name, rationale, painPoints } = await request.json();

        // 1. Validate Env
        const apiKey = process.env.RETELL_API_KEY;
        const agentId = process.env.RETELL_AGENT_ID;

        if (!apiKey || !agentId || apiKey.includes('placeholder')) {
            console.warn("Missing Retell credentials");
            return NextResponse.json({
                success: false,
                error: "Retell API Key or Agent ID not configured"
            }, { status: 500 });
        }

        // 2. Initialize SDK
        const client = new Retell({
            apiKey: apiKey,
        });

        // 3. Prepare Dynamic Variables (Context Injection)
        const dynamicVariables: Record<string, any> = {
            prospect_name: name,
            company_name: "The Prospect Company",
            rationale: rationale || "High fit based on sector analysis",
            pain_points: painPoints ? painPoints.join(", ") : "Inefficiency in current process"
        };

        console.log(`Triggering Outbound Call to ${phone} for ${name}...`);

        // 4. Register Call
        const callResponse = await client.call.createPhoneCall({
            from_number: process.env.RETELL_FROM_NUMBER || "+14155552671",
            to_number: phone,
            override_agent_id: agentId,
            retell_llm_dynamic_variables: dynamicVariables,
            metadata: {
                lead_id: leadId
            }
        });

        console.log("Retell Outbound Call Initiated:", callResponse.call_id);

        return NextResponse.json({
            success: true,
            callId: callResponse.call_id,
            status: 'dialing'
        });

    } catch (error: any) {
        console.error("Retell Outbound Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "Failed to trigger call"
        }, { status: 500 });
    }
}
