"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Zap, Shield, ArrowRight } from "lucide-react";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">

            {/* Navbar (Reusable - Inline for now) */}
            <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Zap className="h-6 w-6 text-purple-500 fill-purple-500" />
                        <span className="font-bold text-xl tracking-tight">Mission Control</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                        <Link href="/features" className="hover:text-white transition-colors">Features</Link>
                        <Link href="/pricing" className="text-white transition-colors">Pricing</Link>
                        <Link href="/enterprise" className="hover:text-white transition-colors">Enterprise</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost" className="text-white hover:text-purple-400">Sign In</Button>
                        </Link>
                        <Link href="/signup">
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-20">
                <section className="container mx-auto px-6 text-center mb-20">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Simple pricing for scaling teams</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Start for free, scale as you grow. No hidden fees.
                    </p>
                </section>

                <section className="container mx-auto px-6 grid md:grid-cols-3 gap-8 max-w-6xl">
                    {/* Starter */}
                    <PricingCard
                        title="Starter"
                        price="$0"
                        description="For individuals exploring AI agents."
                        features={[
                            "50 Leads / month",
                            "Basic Email Sequencing",
                            "1 Active Campaign",
                            "Community Support"
                        ]}
                        buttonText="Start Free"
                        href="/signup"
                    />
                    {/* Growth */}
                    <PricingCard
                        title="Growth"
                        price="$99"
                        description="For startups ramping up outbound."
                        features={[
                            "1,000 Leads / month",
                            "Voice AI Agents (Beta)",
                            "Unlimited Campaigns",
                            "Apollo Integration",
                            "Priority Email Support"
                        ]}
                        highlighted
                        buttonText="Get Growth"
                        href="/signup"
                    />
                    {/* Enterprise */}
                    <PricingCard
                        title="Enterprise"
                        price="Custom"
                        description="For large teams needing scale & control."
                        features={[
                            "Unlimited Leads",
                            "Dedicated Success Manager",
                            "SSO & Custom Integrations",
                            "SLA & Compliance",
                            "Custom AI Model Training"
                        ]}
                        buttonText="Contact Sales"
                        href="/contact"
                    />
                </section>
            </main>

            <footer className="border-t border-white/10 py-12 bg-black text-center text-muted-foreground text-sm">
                © 2024 Mission Control AI. All rights reserved.
            </footer>
        </div>
    );
}

function PricingCard({ title, price, description, features, highlighted = false, buttonText, href }: any) {
    return (
        <div className={`p-8 rounded-2xl border flex flex-col ${highlighted ? 'bg-white/10 border-purple-500/50 relative overflow-hidden' : 'bg-white/5 border-white/10'}`}>
            {highlighted && (
                <div className="absolute top-0 right-0 bg-purple-600 text-xs font-bold px-3 py-1 rounded-bl-xl text-white">
                    POPULAR
                </div>
            )}
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            <div className="text-4xl font-bold mb-2">{price}<span className="text-lg text-muted-foreground font-medium">/mo</span></div>
            <p className="text-sm text-muted-foreground mb-8">{description}</p>

            <div className="flex-1 space-y-4 mb-8">
                {features.map((feat: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">{feat}</span>
                    </div>
                ))}
            </div>

            <Link href={href} className="w-full">
                <Button className={`w-full h-12 rounded-full ${highlighted ? 'bg-purple-600 hover:bg-purple-700' : 'bg-white text-black hover:bg-gray-200'}`}>
                    {buttonText}
                </Button>
            </Link>
        </div>
    )
}
