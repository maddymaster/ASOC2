import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const messages = await prisma.chatMessage.findMany({
            where: { sessionId: id },
            orderBy: { createdAt: 'asc' }
        });

        return NextResponse.json({ success: true, messages });
    } catch (error) {
        console.error("Failed to fetch messages:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch messages" }, { status: 500 });
    }
}
