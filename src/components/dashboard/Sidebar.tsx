"use client";

import { useMissionControl } from "@/context/MissionControlContext";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Target,
    FlaskConical,
    Users,
    Mail,
    Phone,
    Settings,
    LogOut,
    Shield
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { setActiveTab, resetCombinedState } = useMissionControl();

    const navItems = [
        { id: "strategy", label: "Strategy", icon: Target, href: "/dashboard" },
        { id: "email-lab", label: "Email Lab", icon: FlaskConical, href: "/dashboard" },
        { id: "lead-gen", label: "Lead Gen", icon: Users, href: "/dashboard" },
        { id: "email-campaigns", label: "Campaigns", icon: Mail, href: "/dashboard" },
        { id: "call-analytics", label: "Call Analytics", icon: Phone, href: "/dashboard" },
    ];

    const handleNavClick = (item: typeof navItems[0]) => {
        // Sync context state for tab switching
        setActiveTab(item.id);

        // Navigate to the route
        if (pathname !== item.href) {
            router.push(item.href);
        }
    };

    const isActive = (item: typeof navItems[0]) => {
        // For now, all nav items point to /dashboard and use activeTab from context
        // This maintains existing tab-based behavior while adding URL awareness
        return pathname === item.href || pathname.startsWith(item.href);
    };

    return (
        <div className="w-64 h-full bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
            {/* Logo Area */}
            <div className="p-6 border-b border-slate-800">
                <Link href="/dashboard" onClick={() => setActiveTab('strategy')} className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <LayoutDashboard className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-lg text-white tracking-tight">Mission Control</span>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item);

                    return (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                active
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                            )}
                        >
                            <Icon className={cn("h-4 w-4", active ? "text-white" : "text-slate-500")} />
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-800 space-y-2">
                <Link href="/dashboard/admin">
                    <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-900">
                        <Shield className="h-4 w-4 mr-2" />
                        Admin
                    </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-900">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                </Button>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/30"
                    onClick={() => {
                        if (confirm("⚠️ NUCLEAR RESET: This will wipe all campaign data, leads, and history. Are you sure?")) {
                            resetCombinedState();
                            window.location.reload(); // Force hard refresh to clear any lingering React state
                        }
                    }}
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Reset System
                </Button>
            </div>
        </div >
    );
}
