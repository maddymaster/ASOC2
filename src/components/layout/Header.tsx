"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Header() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    // Initial scroll check
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        // Check initial state
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Helper to determine if link is active
    const isActive = (path: string) => pathname === path;

    return (
        <header
            className={cn(
                "fixed w-full top-0 z-50 transition-all duration-300 border-b border-transparent",
                scrolled || pathname !== "/" ? "bg-slate-950/80 backdrop-blur-md border-white/5" : "bg-transparent"
            )}
        >
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link className="flex items-center gap-2 font-bold text-xl tracking-tight group" href="/">
                    <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-shadow">
                        <Zap className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent group-hover:text-white transition-colors">
                        DataFrontier
                    </span>
                </Link>

                <nav className="hidden md:flex gap-8 items-center">
                    <Link
                        className={cn("text-sm font-medium transition-colors hover:text-white", isActive("/use-cases") ? "text-white" : "text-slate-400")}
                        href="/use-cases"
                    >
                        Use Cases
                    </Link>
                    <Link
                        className={cn("text-sm font-medium transition-colors hover:text-white", isActive("/features") ? "text-white" : "text-slate-400")}
                        href="/features"
                    >
                        Features
                    </Link>
                    <Link
                        className={cn("text-sm font-medium transition-colors hover:text-white", isActive("/pricing") ? "text-white" : "text-slate-400")}
                        href="/pricing"
                    >
                        Pricing
                    </Link>
                    <Link
                        className={cn("text-sm font-medium transition-colors hover:text-white", isActive("/resources") ? "text-white" : "text-slate-400")}
                        href="/resources"
                    >
                        Resources
                    </Link>
                    {/* Added Team/Careers as secondary/hidden or just accessible via footer, 
                        or we can add them here if space permits. 
                        Request said "Fix navigation drift", implying matching the Landing Page.
                        Landing page has: Use Cases, Features, Pricing, Resources.
                        I will stick to that to be exact.
                    */}
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/login" className="hidden sm:block">
                        <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5">Login</Button>
                    </Link>
                    <Link href="/contact">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40">
                            Book Demo
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
