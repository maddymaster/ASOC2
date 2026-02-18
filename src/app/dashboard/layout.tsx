"use client";

import { MissionControlProvider } from "@/context/MissionControlContext";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MissionControlProvider>
            <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-50 relative">
                {/* Fixed Sidebar - z-[40] handled internally by component */}
                <Sidebar />

                {/* Main Content - offset by sidebar width, z-0 base layer */}
                <main
                    className="ml-64 w-[calc(100vw-16rem)] min-h-screen overflow-y-auto bg-slate-900 z-0 relative"
                >
                    {children}
                </main>
            </div>
        </MissionControlProvider>
    );
}
