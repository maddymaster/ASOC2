"use client";

import { MissionControlProvider } from "@/context/MissionControlContext";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MissionControlProvider>
            <div className="h-screen overflow-hidden">
                <main className="h-full overflow-y-auto">
                    {children}
                </main>
            </div>
        </MissionControlProvider>
    );
}
