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
            <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-50">
                <Sidebar />
                <main className="flex-1 h-full overflow-y-auto bg-slate-900">
                    {children}
                </main>
            </div>
        </MissionControlProvider>
    );
}
