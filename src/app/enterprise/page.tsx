"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Shield, Globe, Lock, Code, Headphones, Check, X, Server, Building2, Workflow } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

export default function EnterprisePage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-purple-500/30">
            <Header />

            <main className="pt-24 lg:pt-32">
                {/* 1. Story-Driven Hero */}
                <section className="container mx-auto px-6 text-center mb-24 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full opacity-50 pointer-events-none" />

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 text-sm font-medium mb-8">
                        <Building2 className="h-4 w-4 text-blue-400" />
                        <span>Mission Control Enterprise</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-8 relative z-10 leading-tight tracking-tight">
                        Scale Without <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Compromising Control.</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-12 relative z-10 leading-relaxed">
                        For organizations that need to deploy thousands of agents, maintain strict compliance, and integrate deeply with legacy systems.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                        <Link href="/contact">
                            <Button size="lg" className="h-14 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-lg shadow-lg shadow-blue-900/20">
                                Contact Sales
                            </Button>
                        </Link>
                        <Link href="/pricing">
                            <Button size="lg" variant="ghost" className="h-14 px-8 text-slate-300 hover:text-white rounded-full text-lg hover:bg-white/5">
                                View Pricing
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* 2. Trust Center */}
                <section className="py-24 bg-slate-900/50 border-y border-slate-800/50 relative overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                            <div className="md:w-1/2">
                                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                                    <Shield className="h-8 w-8 text-blue-500" />
                                    Security First, Always.
                                </h2>
                                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                    We understand that enterprise data is sacred. That's why Mission Control is built with a zero-trust architecture from day one.
                                </p>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex items-start gap-3">
                                        <Lock className="h-5 w-5 text-green-400 mt-1" />
                                        <div>
                                            <h4 className="font-semibold text-white">SOC2 Type II</h4>
                                            <p className="text-sm text-slate-500">Certified Compliant</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Server className="h-5 w-5 text-blue-400 mt-1" />
                                        <div>
                                            <h4 className="font-semibold text-white">Private Cloud</h4>
                                            <p className="text-sm text-slate-500">AWS/Azure/GCP Deployments</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Globe className="h-5 w-5 text-purple-400 mt-1" />
                                        <div>
                                            <h4 className="font-semibold text-white">GDPR Ready</h4>
                                            <p className="text-sm text-slate-500">Data Sovereignty Control</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Workflow className="h-5 w-5 text-pink-400 mt-1" />
                                        <div>
                                            <h4 className="font-semibold text-white">SSO & Audit Logs</h4>
                                            <p className="text-sm text-slate-500">Okta / SAML Integration</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Visual Trust Badge */}
                            <div className="md:w-1/2 bg-slate-950 rounded-2xl border border-slate-800 p-8 relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                                        <div className="text-3xl font-bold text-white mb-2">99.99%</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider">Uptime SLA</div>
                                    </div>
                                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                                        <div className="text-3xl font-bold text-white mb-2"> &lt; 50ms</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider">Voice Latency</div>
                                    </div>
                                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 col-span-2">
                                        <div className="text-xl font-bold text-white mb-2">Dedicated Infrastructure</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider">No Shared Resources</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Comparison Table */}
                <section className="container mx-auto px-6 py-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Upgrade to Enterprise?</h2>
                        <p className="text-slate-400">Compare features across our standard and enterprise tiers.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 text-left">
                                    <th className="p-4 w-1/3 text-lg font-semibold text-white">Feature</th>
                                    <th className="p-4 w-1/3 text-lg font-semibold text-slate-400">Growth Plan</th>
                                    <th className="p-4 w-1/3 text-lg font-bold text-blue-400 bg-blue-900/10 rounded-t-xl">Enterprise</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {[
                                    { feature: "Concurrent Voice Agents", growth: "Up to 50", enterprise: "Unlimited", highlight: true },
                                    { feature: "Custom LLM Fine-Tuning", growth: <X className="h-5 w-5 text-slate-600" />, enterprise: <Check className="h-5 w-5 text-green-400" />, highlight: false },
                                    { feature: "Dedicated Support Channel", growth: "Email Only", enterprise: "Shared Slack Channel", highlight: false },
                                    { feature: "SLA Guarantees", growth: <X className="h-5 w-5 text-slate-600" />, enterprise: "99.99% Uptime", highlight: true },
                                    { feature: "Single Sign-On (SSO)", growth: <X className="h-5 w-5 text-slate-600" />, enterprise: <Check className="h-5 w-5 text-green-400" />, highlight: false },
                                    { feature: "Private Cloud Deployment", growth: <X className="h-5 w-5 text-slate-600" />, enterprise: <Check className="h-5 w-5 text-green-400" />, highlight: false },
                                    { feature: "API Rate Limits", growth: "100 req/min", enterprise: "Custom / Unlimited", highlight: true },
                                    { feature: "Audit Logs & Compliance", growth: "30 Days Retention", enterprise: "Unlimited Retention", highlight: false },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-900/50 transition-colors">
                                        <td className="p-4 font-medium text-slate-300">{row.feature}</td>
                                        <td className="p-4 text-slate-400 flex items-center gap-2">{row.growth}</td>
                                        <td className={cn("p-4 font-medium text-white bg-blue-900/5", row.highlight && "text-blue-200")}>{row.enterprise}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-slate-500 text-sm mb-6">Need a custom contract? We support MSA and annual invoicing.</p>
                        <Link href="/contact">
                            <Button size="lg" className="px-10 bg-white text-black hover:bg-slate-200 font-bold">
                                Talk to Sales
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function FeatureRow({ icon, title, description }: any) {
    return (
        <div className="flex gap-4">
            <div className="mt-1 bg-blue-500/10 p-2 rounded-lg h-fit">
                {icon}
            </div>
            <div>
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{description}</p>
            </div>
        </div>
    )
}
