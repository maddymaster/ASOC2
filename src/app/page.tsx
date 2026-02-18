import { Header } from "@/components/layout/Header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Zap, TrendingUp, Clock, Target, Shield, Brain, Globe, Lock, Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
    // Structured Data for SEO (SoftwareApplication)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "DataFrontier Mission Control",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
        },
        "description": "Autonomous revenue infrastructure for enterprise sales teams. AI agents that research, qualify, and engage leads."
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Standardized Global Header */}
            <Header />


            <main className="flex-1 pt-16">
                {/* Hero Section */}
                <section className="relative w-full py-24 md:py-32 overflow-hidden">
                    {/* Background Effects */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
                    <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

                    <div className="container relative z-10 px-4 mx-auto text-center">
                        <Badge variant="outline" className="mb-8 border-blue-500/30 bg-blue-500/10 text-blue-400 px-4 py-1.5 backdrop-blur-sm rounded-full">
                            <span className="mr-2">✨</span>
                            The Operating System for Autonomous Revenue
                        </Badge>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
                            Scale Your Sales Team <br />
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                                Without Hiring
                            </span>
                        </h1>

                        <p className="mx-auto max-w-2xl text-xl text-slate-400 font-light leading-relaxed mb-10">
                            Deploy AI agents that analyze your product, identify perfect-fit accounts,
                            and generate qualified pipeline autonomously. <span className="text-white font-medium">SOC2 Type II Ready.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                            <Link href="/dashboard">
                                <Button size="lg" className="h-14 px-8 bg-white text-slate-950 hover:bg-slate-200 font-semibold text-lg shadow-xl shadow-white/5 transition-all">
                                    Start Free Analysis
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/use-cases">
                                <Button size="lg" variant="outline" className="h-14 px-8 border-slate-700 bg-transparent text-white hover:bg-slate-800 text-lg">
                                    View Use Cases
                                </Button>
                            </Link>
                        </div>

                        {/* Logo Strip Trust Signal */}
                        <div className="mt-20 pt-10 border-t border-white/5">
                            <p className="text-sm font-medium text-slate-500 mb-6 uppercase tracking-widest">Trusted by Next-Gen Revenue Teams</p>
                            <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                                {/* Placeholders for logos - using text for now, but style implies logos */}
                                <span className="text-xl font-bold text-slate-300">ACME Corp</span>
                                <span className="text-xl font-bold text-slate-300">GlobalTech</span>
                                <span className="text-xl font-bold text-slate-300">Nebula AI</span>
                                <span className="text-xl font-bold text-slate-300">Vertex Ventures</span>
                                <span className="text-xl font-bold text-slate-300">BlueSky</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Micro-Demo / Dashboard Preview */}
                <section className="py-12 md:py-24 relative">
                    <div className="container px-4 mx-auto">
                        <div className="relative rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-2 md:p-4 shadow-2xl">
                            {/* Fake Browser Toolbar */}
                            <div className="h-8 flex items-center gap-2 px-4 border-b border-white/5 mb-4">
                                <div className="flex gap-1.5">
                                    <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                    <div className="h-3 w-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                    <div className="h-3 w-3 rounded-full bg-green-500/20 border border-green-500/50" />
                                </div>
                                <div className="ml-4 flex-1 max-w-sm h-5 bg-slate-800/50 rounded text-xs flex items-center px-3 text-slate-500 font-mono">
                                    mission-control.datafrontier.ai/dashboard
                                </div>
                            </div>

                            {/* Abstract Representation of Dashboard for Landing Page */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 md:p-8">
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Strategy Card */}
                                    <div className="p-6 rounded-xl bg-slate-800/30 border border-white/5 flex gap-4 items-start">
                                        <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400 mt-1">
                                            <Target className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white mb-1">Active Campaign: FinTech Enterprise</h3>
                                            <p className="text-slate-400 text-sm mb-4">Targeting VP Sales at Series B+ FinTechs in North America.</p>
                                            <div className="flex gap-4 text-xs font-mono text-slate-500">
                                                <span className="px-2 py-1 bg-blue-500/10 rounded text-blue-300">Status: ACTIVE</span>
                                                <span>•</span>
                                                <span className="text-emerald-400">142 Leads Found</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Lead List Stub */}
                                    <div className="space-y-3">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/20 border border-white/5 hover:bg-slate-800/40 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-slate-700/50" />
                                                    <div>
                                                        <div className="h-3 w-24 bg-slate-700/50 rounded mb-1.5" />
                                                        <div className="h-2 w-16 bg-slate-800 rounded" />
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-emerald-400 font-mono text-sm">9{8 - i}% Match</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-800/20 border border-white/5 rounded-xl p-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Brain className="h-32 w-32" />
                                    </div>
                                    <h3 className="font-semibold text-white mb-6">Agent Analysis</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                                            <p className="text-sm text-slate-300">Analyzed your 42-page PRD</p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                                            <p className="text-sm text-slate-300">Identified 3 core ICPs</p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                                            <p className="text-sm text-slate-300">Generated 5 email variants</p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                                            <p className="text-sm text-blue-300">Engaging leads...</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features / Value Prop - Bento Grid */}
                <section id="features" className="py-24 bg-slate-950">
                    <div className="container px-4 mx-auto">
                        <div className="max-w-3xl mx-auto text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Enterprise-Grade Infrastructure</h2>
                            <p className="text-lg text-slate-400">
                                Built for scale, security, and control. This isn't just another lead list tool—it's your entire outbound revenue stack.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                            {/* Card 1: Large */}
                            <div className="md:col-span-2 rounded-3xl bg-slate-900 border border-white/10 p-8 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] group-hover:bg-blue-500/20 transition-all" />
                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div className="p-3 bg-blue-500/20 w-fit rounded-xl text-blue-400 mb-4">
                                        <Globe className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Global Data Coverage</h3>
                                        <p className="text-slate-400 max-w-md">Access 275M+ contacts with mobile numbers and verified emails. Powered by Apollo.io and enriched with proprietary intent signals.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Security */}
                            <div className="rounded-3xl bg-slate-900 border border-white/10 p-8 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px]" />
                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div className="p-3 bg-emerald-500/20 w-fit rounded-xl text-emerald-400 mb-4">
                                        <Lock className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">SOC2 Ready</h3>
                                        <p className="text-slate-400 text-sm">Enterprise security standards. RBAC, SSO, and data encryption at rest.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Integration */}
                            <div className="rounded-3xl bg-slate-900 border border-white/10 p-8 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                                <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 blur-[50px]" />
                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div className="p-3 bg-purple-500/20 w-fit rounded-xl text-purple-400 mb-4">
                                        <Server className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">CRM Sync</h3>
                                        <p className="text-slate-400 text-sm">Bi-directional sync with Salesforce and HubSpot. No more data silos.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 4: Speed */}
                            <div className="md:col-span-2 rounded-3xl bg-slate-900 border border-white/10 p-8 relative overflow-hidden group hover:border-orange-500/30 transition-colors">
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-500/10 blur-[80px]" />
                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div className="p-3 bg-orange-500/20 w-fit rounded-xl text-orange-400 mb-4">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-2">47 Second Setup</h3>
                                        <p className="text-slate-400 max-w-md">Why spend weeks onboarding? Upload your docs, pick a strategy, and launch. Our agents handle the complexity.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24 bg-gradient-to-b from-slate-950 to-blue-950/20 border-t border-white/5">
                    <div className="container px-4 mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to reclaim 80% of your day?</h2>
                        <div className="flex flex-col sm:flex-row gap-5 justify-center">
                            <Link href="/dashboard">
                                <Button size="lg" className="h-14 px-10 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg shadow-xl shadow-blue-500/20">
                                    Get Started Free
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="outline" className="h-14 px-10 border-slate-700 hover:bg-slate-800 text-slate-300 text-lg">
                                    Talk to Sales
                                </Button>
                            </Link>
                        </div>
                        <p className="mt-6 text-sm text-slate-500">Includes 50 free leads • No credit card required</p>
                    </div>
                </section>
            </main>

            <footer className="py-12 bg-slate-950 border-t border-white/5 text-slate-500 text-sm">
                <div className="container px-4 mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-slate-800 flex items-center justify-center">
                            <Zap className="h-3 w-3 text-slate-400" />
                        </div>
                        <span className="font-semibold text-slate-300">DataFrontier</span>
                    </div>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/security" className="hover:text-white transition-colors">Security</Link>
                    </div>
                    <p>© 2026 DataFrontier Inc.</p>
                </div>
            </footer>
        </div >
    );
}
