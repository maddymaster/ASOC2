"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Mic, Users, BarChart3, Database, MessageSquare, ArrowRight } from "lucide-react";

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">

            {/* Navbar (Reusable) */}
            <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Zap className="h-6 w-6 text-purple-500 fill-purple-500" />
                        <span className="font-bold text-xl tracking-tight">Mission Control</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                        <Link href="/features" className="text-white transition-colors">Features</Link>
                        <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                        <Link href="/enterprise" className="hover:text-white transition-colors">Enterprise</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link href="/signup">
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-20">
                <section className="container mx-auto px-6 text-center mb-24">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">The complete AI sales stack</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Everything you need to automate your outbound workflow from end-to-end.
                    </p>
                </section>

                {/* Feature 1: Voice */}
                <section className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center mb-32">
                    <div className="relative">
                        <div className="absolute top-0 left-0 w-full h-full bg-purple-600/20 blur-[100px] rounded-full opacity-50 pointer-events-none" />
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 relative z-10 backdrop-blur-sm">
                            {/* Mock Waveform */}
                            <div className="flex items-center justify-center gap-1 h-32">
                                {[50, 80, 40, 90, 60, 30, 70, 40, 80, 50].map((h, i) => (
                                    <div key={i} className="w-2 bg-purple-500 rounded-full animate-pulse" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-purple-400 font-semibold">
                            <Mic className="h-5 w-5" /> Voice AI
                        </div>
                        <h2 className="text-4xl font-bold">Agents that sound human.</h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Our voice models are trained on millions of sales calls. They handle objections, book meetings, and qualify leads with &lt; 500ms latency.
                        </p>
                        <Link href="/signup">
                            <Button variant="link" className="text-white p-0 hover:text-purple-400">Listen to demo <ArrowRight className="ml-2 h-4 w-4" /></Button>
                        </Link>
                    </div>
                </section>

                {/* Feature 2: Data */}
                <section className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center mb-32 md:flex-row-reverse">
                    <div className="space-y-6 order-2 md:order-1">
                        <div className="flex items-center gap-2 text-blue-400 font-semibold">
                            <Database className="h-5 w-5" /> Lead Intelligence
                        </div>
                        <h2 className="text-4xl font-bold">275M+ verified contacts.</h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Stop wasting time on bad data. We integrate directly with premium data providers to give you verified emails and direct dials for your ICP.
                        </p>
                    </div>
                    <div className="relative order-1 md:order-2">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 h-64 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-5xl font-bold text-white mb-2">98%</div>
                                <div className="text-muted-foreground">Email Deliverability</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Use Cases */}
                <section className="container mx-auto px-6 py-20">
                    <h2 className="text-3xl font-bold text-center mb-12">Built for every role</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <UseCaseCard title="SDRs" desc="Automate cold outreach and focus on closing." />
                        <UseCaseCard title="Founders" desc="Scale your sales team without hiring headcount." />
                        <UseCaseCard title="Marketing" desc="Test messaging at scale with instant feedback." />
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 py-12 bg-black text-center text-muted-foreground text-sm">
                © 2024 Mission Control AI. All rights reserved.
            </footer>
        </div>
    );
}

function UseCaseCard({ title, desc }: any) {
    return (
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground">{desc}</p>
        </div>
    )
}
