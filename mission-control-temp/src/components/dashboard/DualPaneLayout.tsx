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
        <div className="h-screen w-full bg-background">
            <ResizablePanelGroup direction="horizontal" className="min-h-[200px] border rounded-lg">
                <ResizablePanel defaultSize={30} minSize={20} maxSize={40} className="bg-sidebar/50">
                    <div className="flex h-full items-center justify-center p-6">
                        <ChatInterface />
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={70}>
                    <div className="flex h-full items-center justify-center p-6">
                        <DashboardMain />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
