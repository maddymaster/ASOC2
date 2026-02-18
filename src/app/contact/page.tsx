"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/layout/Header"; // Assuming these exist from previous analysis
import { Footer } from "@/components/layout/Footer"; // Assuming these exist from previous analysis
import { ArrowRight, CheckCircle2, MessageSquare, ShieldCheck, Zap } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <Header />

            <div className="flex-1 flex flex-col lg:flex-row mt-16 lg:mt-0">
                {/* Left Pane: Visual & Social Proof */}
                <div className="lg:w-1/2 relative bg-slate-900 overflow-hidden flex flex-col justify-center p-8 lg:p-20 order-2 lg:order-1">
                    {/* Background Effects */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 blur-[100px] rounded-full" />

                    <div className="relative z-10 max-w-lg mx-auto lg:mx-0 space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                            <Zap className="h-4 w-4" />
                            <span>High-Velocity Sales Engines</span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                            Ready to replace your <br />
                            <span className="text-slate-500">busy work?</span>
                        </h1>

                        <div className="space-y-4">
                            {[
                                "Deploy autonomous SDRs in minutes",
                                "Scale to 10,000+ personalized calls/day",
                                "Reduce CAC by up to 60%"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-slate-300">
                                    <CheckCircle2 className="h-5 w-5 text-blue-500" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>

                        {/* Testimonial Card */}
                        <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((_, i) => (
                                    <Zap key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                                ))}
                            </div>
                            <p className="text-lg text-slate-200 italic mb-4">
                                "Mission Control didn't just automate our calls. It gave us a predictable revenue engine that we can scale up or down with a single click."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white">
                                    JD
                                </div>
                                <div>
                                    <div className="font-semibold text-white">James Dalton</div>
                                    <div className="text-sm text-slate-400">CRO, TechFlow Inc.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Pane: Form */}
                <div className="lg:w-1/2 bg-slate-950 flex flex-col justify-center p-8 lg:p-20 order-1 lg:order-2 border-l border-slate-900">
                    <div className="max-w-md mx-auto w-full space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Get a Personalized Demo</h2>
                            <p className="text-slate-400">
                                Tell us about your sales volume, and we'll show you exactly how much you can save.
                            </p>
                        </div>

                        <form className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">First Name</label>
                                    <Input placeholder="Sarah" className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:border-blue-500 transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Last Name</label>
                                    <Input placeholder="Connor" className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:border-blue-500 transition-colors" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Work Email</label>
                                <Input type="email" placeholder="sarah@skynet.com" className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:border-blue-500 transition-colors" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Company Size</label>
                                <select className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white ring-offset-background placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-800/50 transition-colors">
                                    <option value="" disabled selected>Select employees...</option>
                                    <option value="1-10">1-10 Employees</option>
                                    <option value="11-50">11-50 Employees</option>
                                    <option value="51-200">51-200 Employees</option>
                                    <option value="201-1000">201-1000 Employees</option>
                                    <option value="1000+">1000+ Employees</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">How can we help?</label>
                                <Textarea placeholder="I'm interested in automating outbound for my SDR team..." className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:border-blue-500 transition-colors min-h-[120px]" />
                            </div>

                            <Button className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02]">
                                Request Access
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>

                            <p className="text-xs text-center text-slate-500">
                                By submitting this form, you agree to our <Link href="/terms" className="underline hover:text-slate-400">Terms</Link> and <Link href="/privacy" className="underline hover:text-slate-400">Privacy Policy</Link>.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
