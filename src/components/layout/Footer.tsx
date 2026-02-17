"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
    return (
        <footer className="py-12 bg-slate-950 border-t border-white/5 text-slate-500 text-sm">
            <div className="container px-4 mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-slate-800 flex items-center justify-center">
                        <Zap className="h-3 w-3 text-slate-400" />
                    </div>
                    <span className="font-semibold text-slate-300">DataFrontier</span>
                </div>

                <div className="flex flex-wrap gap-8 justify-center md:justify-end">
                    <Link href="/about" className="hover:text-white transition-colors">About</Link>
                    <Link href="/team" className="hover:text-white transition-colors">Team</Link>
                    <Link href="/careers" className="hover:text-white transition-colors">Careers</Link>
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                    <Link href="/security" className="hover:text-white transition-colors">Security</Link>
                </div>

                <p>© 2026 DataFrontier Inc.</p>
            </div>
        </footer>
    );
}
