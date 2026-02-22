"use client";

import { Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex bg-black text-white selection:bg-purple-500/30">

            {/* Left Side - Branding */}
            <div className="hidden lg:flex w-1/2 bg-black border-r border-white/10 relative overflow-hidden flex-col justify-between p-12">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 blur-[100px] rounded-full" />

                <Link href="/" className="z-10 flex items-center gap-2">
                    <Zap className="h-6 w-6 text-purple-500 fill-purple-500" />
                    <span className="font-bold text-xl tracking-tight">Mission Control</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="z-10 relative"
                >
                    <blockquote className="space-y-6">
                        <p className="text-2xl font-medium leading-relaxed">
                            &ldquo;Mission Control has completely transformed our outbound strategy. We're booking 3x more meetings with half the effort. The AI voice agents sound indistinguishable from humans.&rdquo;
                        </p>
                        <footer className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">AS</div>
                            <div>
                                <div className="font-semibold">Alex Smith</div>
                                <div className="text-sm text-muted-foreground">VP of Sales, TechFlow</div>
                            </div>
                        </footer>
                    </blockquote>
                </motion.div>
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
                    <SignIn
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
