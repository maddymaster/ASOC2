import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const prismaPath = path.join(process.cwd(), 'node_modules', '.prisma', 'client');
        let files: string[] = [];
        try {
            files = fs.readdirSync(prismaPath);
        } catch (e: any) {
            files = [`Error reading path: ${e.message}`];
        }

        const env = {
            nodeVersion: process.version,
            platform: process.platform,
            arch: process.arch,
            prismaFiles: files,
            opensslVersion: 'Unknown (check container)',
            envVars: {
                PRISMA_QUERY_ENGINE_LIBRARY: process.env.PRISMA_QUERY_ENGINE_LIBRARY,
                BINARY_TARGETS: process.env.BINARY_TARGETS
            }
        };

        // Try to check openssl version via exec? 
        // Not easy in edge/node runtime securely and quickly without import

        return NextResponse.json(env);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
