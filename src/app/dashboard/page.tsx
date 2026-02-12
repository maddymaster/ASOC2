"use strict";

import DualPaneLayout from "@/components/dashboard/DualPaneLayout";

export default function DashboardPage() {
    return (
        <main className="h-[calc(100vh-64px)] w-full overflow-y-auto">
            <DualPaneLayout />
        </main>
    );
}
