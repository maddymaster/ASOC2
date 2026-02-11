"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSent(true);

            // Auto-redirect for demo convenience
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
        }, 1500);
    };

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
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-[350px] w-full space-y-8">
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
                        <p className="text-muted-foreground">Enter your email to sign in to your account</p>
                    </div>

                    {!sent ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    className="bg-white/5 border-white/10 h-10"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In with Email"}
                            </Button>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-4 py-8 bg-white/5 rounded-xl border border-white/10"
                        >
                            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                            <div>
                                <h3 className="text-xl font-bold">Check your email</h3>
                                <p className="text-sm text-muted-foreground mt-2">We sent you a login link.</p>
                                <p className="text-xs text-muted-foreground mt-4 animate-pulse">Redirecting to Dashboard...</p>
                            </div>
                        </motion.div>
                    )}

                    <div className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account? <Link href="/signup" className="underline hover:text-white">Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
