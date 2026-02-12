"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SignupPage() {
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

            // Auto-redirect
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
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-[350px] w-full space-y-8">
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
                        <p className="text-muted-foreground">Enter your email below to create your account</p>
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
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up with Email"}
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
                                <h3 className="text-xl font-bold">Account created!</h3>
                                <p className="text-sm text-muted-foreground mt-2">We're redirecting you to your new workspace.</p>
                                <Loader2 className="h-4 w-4 animate-spin mx-auto mt-4 text-purple-500" />
                            </div>
                        </motion.div>
                    )}

                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account? <Link href="/login" className="underline hover:text-white">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
