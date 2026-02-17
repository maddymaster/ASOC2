"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ROICalculator } from "@/components/pricing/ROICalculator";
import { InfraToggle } from "@/components/pricing/InfraToggle";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, CheckCircle2, Zap, ArrowRight, XCircle, Brain, FileText, Send, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PricingPage() {
    const [showInfra, setShowInfra] = useState(false);

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30">
            <Header />

            <main className="pt-24">
                {/* Hero */}
                <section className="relative py-20 px-4 text-center overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

                    <div className="relative z-10 max-w-4xl mx-auto space-y-6">
                        <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400 px-4 py-1.5 backdrop-blur-sm rounded-full mb-4">
                            Transparent Billing
                        </Badge>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
                            Pricing for <span className="text-blue-500">Builders</span>, <br />
                            Not Seat-Fillers.
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Stop paying unseen "AI Tax." We separate platform fees from infrastructure costs so you can scale efficiently.
                        </p>

                        <div className="pt-8">
                            <InfraToggle show={showInfra} onToggle={setShowInfra} />
                        </div>
                    </div>
                </section>

                {/* Pricing Cards */}
                <section className="py-12 px-4">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 items-start">
                        {/* Starter */}
                        <div className="relative p-8 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-sm hover:border-white/20 transition-colors">
                            <h3 className="text-xl font-bold text-white">Starter</h3>
                            <p className="text-sm text-slate-400 mt-2 h-10">Perfect for validating the agentic workflow.</p>
                            <div className="my-8">
                                <span className="text-4xl font-bold text-white">$499</span>
                                <span className="text-slate-500">/mo</span>
                            </div>
                            <Button variant="outline" className="w-full h-12 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white mb-8 rounded-xl">
                                Deploy Your First Agent
                            </Button>
                            <ul className="space-y-4">
                                <FeatureItem text="100 Verified Leads/mo" />
                                <FeatureItem text="Basic Email Drafting Agent" />
                                <FeatureItem text="1 User Seat" />
                                <FeatureItem text="Standard Support" />
                            </ul>
                        </div>

                        {/* Growth - Glowing */}
                        <div className="relative p-8 rounded-3xl bg-slate-900 border border-blue-500/50 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] transform lg:-translate-y-4 z-10">
                            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-2xl shadow-lg">
                                MOST POPULAR
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-bold text-white">Growth</h3>
                                <Zap className="h-5 w-5 text-blue-400 fill-blue-400 animate-pulse" />
                            </div>
                            <p className="text-sm text-blue-100/70 mt-2 h-10">Scale your revenue engine with voice.</p>
                            <div className="my-8">
                                <span className="text-5xl font-bold text-white">$1,499</span>
                                <span className="text-slate-500">/mo</span>
                            </div>
                            <Button className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-semibold mb-8 rounded-xl shadow-lg shadow-blue-500/25">
                                Scale Your Engine
                            </Button>
                            <ul className="space-y-4">
                                <FeatureItem text="1,000 Verified Leads/mo" highlight />
                                <FeatureItem text="500 Voice Minutes Included" highlight />
                                <FeatureItem text="Advanced AI Personalization" />
                                <FeatureItem text="CRM Integration (SFDC, HubSpot)" />
                                <FeatureItem text="5 User Seats" />
                            </ul>
                        </div>

                        {/* Enterprise */}
                        <div className="relative p-8 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-sm hover:border-white/20 transition-colors">
                            <h3 className="text-xl font-bold text-white">Enterprise</h3>
                            <p className="text-sm text-slate-400 mt-2 h-10">Custom models and dedicated architecture.</p>
                            <div className="my-8">
                                <span className="text-4xl font-bold text-white">Custom</span>
                            </div>
                            <Button variant="outline" className="w-full h-12 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white mb-8 rounded-xl">
                                Schedule Architecture Call
                            </Button>
                            <ul className="space-y-4">
                                <FeatureItem text="Unlimited Agents & Leads" />
                                <FeatureItem text="Custom PRD Parsing Models" />
                                <FeatureItem text="Private Cloud / On-Prem" />
                                <FeatureItem text="SSO & Audit Logs" />
                                <FeatureItem text="Dedicated Success Manager" />
                            </ul>
                        </div>
                    </div>
                </section>

                {/* ROI Section + Scenario */}
                <section className="py-24 bg-slate-950/50 border-y border-white/5">
                    <div className="container px-4 mx-auto grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-4">The Cost of Inaction</h2>
                                <p className="text-slate-400 text-lg">
                                    Manual prospecting isn't just slow—it's expensive. See how MissionControl compares to traditional SDR scaling.
                                </p>
                            </div>
                            <ROICalculator />
                        </div>

                        <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 space-y-8">
                            <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4">Scaling a Campaign to 1,000 Leads</h3>

                            {/* Manual */}
                            <div className="space-y-4 opacity-50 hover:opacity-100 transition-opacity">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-500/10 rounded-lg text-red-400"><XCircle className="h-5 w-5" /></div>
                                        <span className="font-medium text-slate-300">Manual Approach</span>
                                    </div>
                                    <span className="text-red-400 font-mono">$5,000+ Cost</span>
                                </div>
                                <div className="pl-12 space-y-2 text-sm text-slate-500">
                                    <p>• 40 hours LinkedIn research</p>
                                    <p>• 15 hours drafting emails</p>
                                    <p>• High burnout risk</p>
                                </div>
                            </div>

                            {/* MissionControl */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><CheckCircle2 className="h-5 w-5" /></div>
                                        <span className="font-bold text-white">MissionControl</span>
                                    </div>
                                    <span className="text-emerald-400 font-bold font-mono">$149 Total</span>
                                </div>
                                <div className="pl-12 space-y-2 text-sm text-slate-400">
                                    <p className="flex items-center gap-2"><Zap className="h-3 w-3 text-emerald-500" /> 3 minutes PRD analysis</p>
                                    <p className="flex items-center gap-2"><Zap className="h-3 w-3 text-emerald-500" /> 1 click to deploy</p>
                                    <p className="flex items-center gap-2"><Zap className="h-3 w-3 text-emerald-500" /> Auto-enriched & verified</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Process Map */}
                <section className="py-24 px-4 overflow-hidden">
                    <div className="container mx-auto">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
                            <p className="text-slate-400">From raw document to booked meeting in 4 autonomous steps.</p>
                        </div>

                        <div className="relative grid md:grid-cols-4 gap-8">
                            {/* Connector Line */}
                            <div className="hidden md:block absolute top-[28px] left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0" />

                            <ProcessStep
                                icon={<FileText className="h-6 w-6" />}
                                title="1. Ingest PRD"
                                desc="Upload your Product Requirement Doc. We extract ICPs and value props automatically."
                            />
                            <ProcessStep
                                icon={<Database className="h-6 w-6" />}
                                title="2. Build List"
                                desc="Agents scour Apollo & LinkedIn to find 95%+ matches for your ICP."
                            />
                            <ProcessStep
                                icon={<Brain className="h-6 w-6" />}
                                title="3. Enrich & Verify"
                                desc="Waterfalls across 3 providers to verify emails and mobile numbers."
                            />
                            <ProcessStep
                                icon={<Send className="h-6 w-6" />}
                                title="4. Execute"
                                desc="Omnichannel outreach via Email and Voice with personalized hooks."
                            />
                        </div>
                    </div>
                </section>

                {/* Trust/Social Proof */}
                <section className="py-12 border-y border-white/5 bg-white/[0.02]">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-8">Trusted by Practitioners at</p>
                        <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            {/* Logo Placeholders */}
                            {["FinTech Inc", "CloudScale", "DataFlow", "MarketAI", "SecureNet"].map((name) => (
                                <span key={name} className="text-xl font-bold text-slate-300 font-display">{name}</span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-24 container max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        <FAQItem
                            q="How do you prevent AI hallucinations?"
                            a="We use a multi-agent critique architecture. One agent generates the draft, and a second 'Reviewer' agent validates it against your PRD constraints before it ever reaches your queue."
                        />
                        <FAQItem
                            q="Is my PRD data secure?"
                            a="Absolutely. We are SOC2 Type II ready. Your data is encrypted at rest and in transit, and we never train our base models on your proprietary data."
                        />
                        <FAQItem
                            q="Can I bring my own API keys?"
                            a="Yes. On the Enterprise plan, you can plug in your own Retell, Vapi, or OpenAI keys to keep full control over your billing and rate limits."
                        />
                        <FAQItem
                            q="What happens if I exceed my lead limit?"
                            a="You can easily upgrade to the next tier or purchase add-on blocks of 500 leads for $50. No service interruption."
                        />
                    </Accordion>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function FeatureItem({ text, highlight = false }: { text: string, highlight?: boolean }) {
    return (
        <li className="flex items-start gap-3 text-sm">
            <Check className={`h-5 w-5 shrink-0 ${highlight ? "text-blue-400" : "text-green-500"}`} />
            <span className={highlight ? "text-white font-medium" : "text-slate-300"}>{text}</span>
        </li>
    );
}

function ProcessStep({ icon, title, desc }: any) {
    return (
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-blue-400 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300">
                {icon}
            </div>
            <h3 className="font-bold text-white text-lg">{title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
        </div>
    );
}

function FAQItem({ q, a }: { q: string, a: string }) {
    return (
        <AccordionItem value={q} className="border-slate-800 bg-slate-900/40 px-6 rounded-xl data-[state=open]:border-blue-500/30 transition-all">
            <AccordionTrigger className="text-slate-200 hover:text-white hover:no-underline py-6 text-left">{q}</AccordionTrigger>
            <AccordionContent className="text-slate-400 pb-6 leading-relaxed">
                {a}
            </AccordionContent>
        </AccordionItem>
    );
}
