import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// Mock User ID - In prod this comes from Auth
const MOCK_USER_ID = "admin-user-id";

export async function GET() {
    try {
        // Ensure mock user exists for demo
        let user = await prisma.user.findFirst({ where: { email: "admin@missioncontrol.ai" } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    id: MOCK_USER_ID,
                    email: "admin@missioncontrol.ai",
                    name: "Admin User",
                    role: "SUPER_ADMIN"
                }
            });
        }

        const sessions = await prisma.chatSession.findMany({
            where: { userId: user.id },
            orderBy: { updatedAt: 'desc' },
            take: 20
        });

        return NextResponse.json({ success: true, sessions });
    } catch (error) {
        console.error("Failed to fetch sessions:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch sessions" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { title } = await req.json();

        // Ensure mock user exists
        let user = await prisma.user.findFirst({ where: { email: "admin@missioncontrol.ai" } });
        if (!user) {
            // Create fallback if not found (mostly for dev envs where seed might be wiped)
            user = await prisma.user.create({
                data: {
                    id: MOCK_USER_ID,
                    email: "admin@missioncontrol.ai",
                    name: "Admin User",
                    role: "SUPER_ADMIN"
                }
            });
        }

        const session = await prisma.chatSession.create({
            data: {
                userId: user.id,
                title: title || "New Strategy Session"
            }
        });

        return NextResponse.json({ success: true, session });
    } catch (error) {
        console.error("Failed to create session:", error);
        return NextResponse.json({ success: false, error: "Failed to create session" }, { status: 500 });
    }
}
