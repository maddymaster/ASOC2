"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Shield, Globe, Lock, Code, Headphones } from "lucide-react";

export default function EnterprisePage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">

            {/* Navbar */}
            <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Zap className="h-6 w-6 text-purple-500 fill-purple-500" />
                        <span className="font-bold text-xl tracking-tight">Mission Control</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                        <Link href="/features" className="hover:text-white transition-colors">Features</Link>
                        <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                        <Link href="/enterprise" className="text-white transition-colors">Enterprise</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link href="/signup">
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6">
                                Talk to Sales
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-20">
                <section className="container mx-auto px-6 text-center mb-24 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full opacity-50 pointer-events-none" />

                    <h1 className="text-5xl md:text-7xl font-bold mb-8 relative z-10">
                        Security, Scale, and <br /><span className="text-blue-500">Total Control</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 relative z-10">
                        Mission Control Enterprise is built for teams that need uncompromising security, infinite scalability, and dedicated support.
                    </p>
                    <Link href="/contact" className="relative z-10">
                        <Button size="lg" className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-lg">
                            Contact Sales
                        </Button>
                    </Link>
                </section>

                <section className="container mx-auto px-6 grid md:grid-cols-2 gap-12 mb-32">
                    <div className="space-y-8">
                        <FeatureRow
                            icon={<Lock className="h-6 w-6 text-blue-500" />}
                            title="Enterprise-Grade Security"
                            description="SOC2 Type II compliant. End-to-end encryption for all voice and text data. Private cloud deployments available."
                        />
                        <FeatureRow
                            icon={<Globe className="h-6 w-6 text-blue-500" />}
                            title="Global Infrastructure"
                            description="Low-latency voice agents deployed across 15 regions globally. Ensure crystal clear calls anywhere."
                        />
                        <FeatureRow
                            icon={<Code className="h-6 w-6 text-blue-500" />}
                            title="Custom API Integrations"
                            description="Full access to our API. Connect Mission Control to your custom CRM, ERP, or internal tools."
                        />
                        <FeatureRow
                            icon={<Headphones className="h-6 w-6 text-blue-500" />}
                            title="24/7 Dedicated Support"
                            description="Your own Technical Account Manager and Slack channel with our engineering team."
                        />
                    </div>
                    <div className="bg-white/5 rounded-2xl border border-white/10 p-8 flex items-center justify-center">
                        <div className="text-center space-y-4">
                            <Shield className="h-24 w-24 text-blue-500 mx-auto opacity-80" />
                            <h3 className="text-2xl font-bold">SOC2 Certified</h3>
                            <p className="text-muted-foreground">We exceed verify industry standards.</p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 py-12 bg-black text-center text-muted-foreground text-sm">
                © 2024 Mission Control AI. All rights reserved.
            </footer>
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
