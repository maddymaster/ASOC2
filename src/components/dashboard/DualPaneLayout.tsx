"use strict";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import ChatInterface from "@/components/chat/ChatInterface";
import DashboardMain from "@/components/dashboard/DashboardMain";

export default function DualPaneLayout() {
    return (
        <div className="h-full w-full bg-background overflow-hidden flex flex-col">
            <ResizablePanelGroup direction="horizontal" className="h-full border rounded-lg">
                <ResizablePanel defaultSize={30} minSize={20} maxSize={40} className="bg-sidebar/50">
                    <div className="flex h-full items-center justify-center p-6">
                        <ChatInterface />
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={70}>
                    <div className="flex h-full w-full overflow-y-auto p-6 bg-secondary/10">
                        <DashboardMain />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
