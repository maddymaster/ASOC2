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
                {/* Fixed Sidebar - z-[40] for consistent layering above content but below modals */}
                <aside className="fixed left-0 top-0 h-full w-64 z-[40] bg-slate-950">
                    <Sidebar />
                </aside>

                {/* Main Content - offset by sidebar width, z-0 base layer */}
                <main
                    className="ml-64 flex-1 h-full overflow-y-auto bg-slate-900 z-0"
                    style={{ width: 'calc(100vw - 16rem)' }}
                >
                    {children}
                </main>
            </div>
        </MissionControlProvider>
    );
}
