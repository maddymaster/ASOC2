"use client";

import { MissionControlProvider } from "@/context/MissionControlContext";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MissionControlProvider>
            {children}
        </MissionControlProvider>
    );
}
