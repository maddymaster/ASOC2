"use client";

import { Zap, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
    return (
        <div className="min-h-screen flex bg-black text-white selection:bg-purple-500/30">

            {/* Left Side - Branding */}
            <div className="hidden lg:flex w-1/2 bg-black border-r border-white/10 relative overflow-hidden flex-col justify-between p-12">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

                <Link href="/" className="z-10 flex items-center gap-2">
                    <Zap className="h-6 w-6 text-purple-500 fill-purple-500" />
                    <span className="font-bold text-xl tracking-tight">Mission Control</span>
                </Link>

                <div className="z-10 relative space-y-6">
                    <h2 className="text-4xl font-bold">Join the future of sales.</h2>
                    <ul className="space-y-4 text-lg text-muted-foreground">
                        <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-purple-500" /> 14-day free trial</li>
                        <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-purple-500" /> No credit card required</li>
                        <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-purple-500" /> Cancel anytime</li>
                    </ul>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <div className="absolute top-8 right-8">
                    <Link href="/">
                        <Button variant="ghost" className="text-slate-400 hover:text-white">
                            Back to Home
                        </Button>
                    </Link>
                </div>
                <div className="max-w-[400px] w-full flex flex-col items-center justify-center">
                    <SignUp
                        appearance={{
                            elements: {
                                card: "bg-transparent shadow-none w-full",
                                headerTitle: "text-white text-2xl font-bold",
                                headerSubtitle: "text-slate-400",
                                socialButtonsBlockButton: "text-white border-white/10 hover:bg-white/5",
                                socialButtonsBlockButtonText: "text-white font-medium",
                                dividerText: "text-slate-500",
                                dividerLine: "bg-white/10",
                                formFieldLabel: "text-slate-300",
                                formFieldInput: "bg-white/5 border-white/10 text-white placeholder:text-slate-500",
                                formButtonPrimary: "bg-purple-600 hover:bg-purple-700 text-white shadow-none",
                                footerActionText: "text-slate-400",
                                footerActionLink: "text-purple-400 hover:text-purple-300",
                                identityPreviewText: "text-white",
                                identityPreviewEditButton: "text-purple-400"
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
