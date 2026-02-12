import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Zap, TrendingUp, Clock, Target, Shield, Brain } from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50">
            {/* Sticky Header */}
            <header className="px-6 lg:px-8 h-16 flex items-center border-b border-slate-800/50 sticky top-0 bg-slate-950/95 backdrop-blur-xl z-50">
                <Link className="flex items-center justify-center font-bold text-xl tracking-tight" href="/">
                    <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">DataFrontier</span>
                </Link>
                <nav className="ml-auto flex gap-6 items-center">
                    <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/use-cases">Use Cases</Link>
                    <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/resources">Resources</Link>
                    <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/pricing">Pricing</Link>
                    <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/blog">Blog</Link>
                    <Link href="/login">
                        <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">Login</Button>
                    </Link>
                    <Link href="/contact">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30">
                            Book Demo
                        </Button>
                    </Link>
                </nav>
            </header>

            <main className="flex-1">
                {/* Hero Section - Story-Driven */}
                <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-slate-950 to-slate-950" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950" />

                    <div className="container relative z-10 px-4 md:px-6 mx-auto">
                        <div className="flex flex-col items-center space-y-8 text-center">
                            {/* Eyebrow */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm">
                                <Zap className="h-4 w-4 text-blue-400" />
                                <span className="text-sm font-medium text-blue-300">Trusted by 200+ Enterprise Sales Teams</span>
                            </div>

                            {/* Headline */}
                            <div className="space-y-4 max-w-4xl">
                                <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                                    Turn Your PRD into a{" "}
                                    <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                                        Self-Driving Sales Engine
                                    </span>
                                </h1>
                                <p className="mx-auto max-w-2xl text-xl md:text-2xl text-slate-300 font-light leading-relaxed">
                                    AI-powered orchestration that converts product docs into qualified pipeline in <span className="font-bold text-blue-400">47 seconds</span>. No manual research. No data entry. Just results.
                                </p>
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/dashboard">
                                    <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white text-lg px-8 py-6 shadow-2xl shadow-blue-900/40 group">
                                        Start Free Analysis
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link href="#demo">
                                    <Button size="lg" variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white text-lg px-8 py-6">
                                        Watch It Work
                                    </Button>
                                </Link>
                            </div>

                            {/* Micro-Demo Preview */}
                            <div className="mt-12 w-full max-w-5xl">
                                <div className="relative rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-8 shadow-2xl">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-3 w-3 rounded-full bg-red-500" />
                                            <div className="h-3 w-3 rounded-full bg-yellow-500" />
                                            <div className="h-3 w-3 rounded-full bg-green-500" />
                                        </div>
                                        <span className="text-xs text-slate-500 font-mono">Live Demo</span>
                                    </div>

                                    {/* Animated Flow */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                            <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                                <Target className="h-6 w-6 text-blue-400" />
                                            </div>
                                            <span className="text-sm font-semibold text-white">Upload PRD</span>
                                            <span className="text-xs text-slate-400 text-center">AI extracts ICPs & sectors</span>
                                        </div>

                                        <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                            <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                <Brain className="h-6 w-6 text-emerald-400" />
                                            </div>
                                            <span className="text-sm font-semibold text-white">Agent Analyzes</span>
                                            <span className="text-xs text-slate-400 text-center">Identifies target personas</span>
                                        </div>

                                        <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                            <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                                                <TrendingUp className="h-6 w-6 text-purple-400" />
                                            </div>
                                            <span className="text-sm font-semibold text-white">Leads Flow In</span>
                                            <span className="text-xs text-slate-400 text-center">Real contacts, ready to call</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Proof Bar - Metrics Above Fold */}
                <section className="w-full py-12 border-y border-slate-800/50 bg-slate-900/30">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="flex flex-col items-center text-center">
                                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
                                    320%
                                </div>
                                <div className="text-sm text-slate-400">Increase in Qualified Pipeline</div>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent mb-2">
                                    67%
                                </div>
                                <div className="text-sm text-slate-400">More Leads Per Month</div>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">
                                    47s
                                </div>
                                <div className="text-sm text-slate-400">PRD to Lead Discovery</div>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-2">
                                    0
                                </div>
                                <div className="text-sm text-slate-400">Manual Data Entry</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Problem/Solution Bento Grid */}
                <section className="w-full py-20 md:py-32">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                                From Chaos to <span className="text-blue-400">Clarity</span>
                            </h2>
                            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                                Sales teams waste 64% of their time on non-selling activities. We automate the noise.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Card 1 */}
                            <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/50 to-slate-900/30 p-8 hover:border-blue-500/30 transition-all duration-300">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                        <Shield className="h-6 w-6 text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">Before: Fragmented Data</h3>
                                        <p className="text-slate-400 text-sm">Leads scattered across 12 tools. Stale CRMs. Manual enrichment.</p>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <div className="text-9xl font-bold text-red-500">→</div>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="group relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/30 to-slate-900/30 p-8 shadow-lg shadow-blue-900/20">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
                                        <CheckCircle2 className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">After: Unified Intelligence</h3>
                                        <p className="text-slate-300 text-sm">Real-time data from Apollo, enriched by AI, delivered to your inbox.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/50 to-slate-900/30 p-8 hover:border-blue-500/30 transition-all duration-300">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                        <Clock className="h-6 w-6 text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">Before: Manual Follow-ups</h3>
                                        <p className="text-slate-400 text-sm">10-day sales cycles. Forgotten prospects. Low response rates.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 4 */}
                            <div className="group relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/30 to-slate-900/30 p-8 shadow-lg shadow-blue-900/20">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
                                        <Zap className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">After: Autonomous Agents</h3>
                                        <p className="text-slate-300 text-sm">AI drafts emails, schedules calls, and nurtures leads while you sleep.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Social Proof - Testimonials */}
                <section className="w-full py-20 md:py-32 bg-slate-900/30 border-y border-slate-800/50">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                                Trusted by Revenue Leaders
                            </h2>
                            <p className="text-xl text-slate-400">
                                See what our customers are saying
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Testimonial 1 */}
                            <div className="flex flex-col p-8 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                        SK
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">Sarah Kim</div>
                                        <div className="text-sm text-slate-400">VP of Sales, FinTech Startup</div>
                                    </div>
                                </div>
                                <p className="text-slate-300 leading-relaxed mb-4">
                                    "We increased our qualified pipeline by <span className="font-bold text-blue-400">40% in the first quarter</span>. The AI agents handle prospecting while our team focuses on closing."
                                </p>
                                <div className="flex gap-1 mt-auto">
                                    {[...Array(5)].map((_, i) => (
                                        <CheckCircle2 key={i} className="h-4 w-4 text-blue-400" />
                                    ))}
                                </div>
                            </div>

                            {/* Testimonial 2 */}
                            <div className="flex flex-col p-8 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                                        MP
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">Marcus Patel</div>
                                        <div className="text-sm text-slate-400">CRO, Enterprise SaaS</div>
                                    </div>
                                </div>
                                <p className="text-slate-300 leading-relaxed mb-4">
                                    "From PRD to first meeting in <span className="font-bold text-emerald-400">less than 48 hours</span>. This isn't incremental improvement—it's a paradigm shift."
                                </p>
                                <div className="flex gap-1 mt-auto">
                                    {[...Array(5)].map((_, i) => (
                                        <CheckCircle2 key={i} className="h-4 w-4 text-emerald-400" />
                                    ))}
                                </div>
                            </div>

                            {/* Testimonial 3 */}
                            <div className="flex flex-col p-8 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                        AL
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">Amelia Lee</div>
                                        <div className="text-sm text-slate-400">Head of Growth, ClimateTech</div>
                                    </div>
                                </div>
                                <p className="text-slate-300 leading-relaxed mb-4">
                                    "Finally, a tool that understands our complex ESG buyer personas. <span className="font-bold text-purple-400">Lead quality went from 23% to 71%</span> overnight."
                                </p>
                                <div className="flex gap-1 mt-auto">
                                    {[...Array(5)].map((_, i) => (
                                        <CheckCircle2 key={i} className="h-4 w-4 text-purple-400" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="w-full py-20 md:py-32">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-950/50 via-slate-900 to-slate-950 p-12 md:p-16 text-center shadow-2xl">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent" />

                            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                                <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                                    Ready to <span className="text-blue-400">10x Your Pipeline?</span>
                                </h2>
                                <p className="text-xl md:text-2xl text-slate-300 font-light">
                                    Upload your PRD. Get a free strategic analysis. See how our AI agents find your ideal customers.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href="/dashboard">
                                        <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white text-lg px-10 py-7 shadow-2xl shadow-blue-900/50 group">
                                            Start Free Strategy Analysis
                                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                    <Link href="/contact">
                                        <Button size="lg" variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800 text-lg px-10 py-7">
                                            Talk to Sales
                                        </Button>
                                    </Link>
                                </div>
                                <p className="text-sm text-slate-500">
                                    No credit card required • Free 14-day trial • Cancel anytime
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full py-12 border-t border-slate-800/50 bg-slate-900/30">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="font-semibold text-white mb-4">Product</h3>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                                <li><Link href="/use-cases" className="hover:text-white transition-colors">Use Cases</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-white mb-4">Company</h3>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-white mb-4">Resources</h3>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><Link href="/resources" className="hover:text-white transition-colors">Whitepapers</Link></li>
                                <li><Link href="/blog" className="hover:text-white transition-colors">Case Studies</Link></li>
                                <li><Link href="/resources#calculator" className="hover:text-white transition-colors">ROI Calculator</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-white mb-4">Legal</h3>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                                <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-slate-500">© 2026 DataFrontier Inc. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link href="#" className="text-slate-500 hover:text-white transition-colors">Twitter</Link>
                            <Link href="#" className="text-slate-500 hover:text-white transition-colors">LinkedIn</Link>
                            <Link href="#" className="text-slate-500 hover:text-white transition-colors">GitHub</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
