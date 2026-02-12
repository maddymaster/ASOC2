import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function PricingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="px-4 lg:px-6 h-14 flex items-center border-b">
                <Link className="flex items-center justify-center font-bold text-xl" href="/">
                    DataFrontier
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/about">About</Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/pricing">Pricing</Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/contact">Contact</Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">Login</Link>
                </nav>
            </header>
            <main className="flex-1 container px-4 md:px-6 py-12 md:py-24">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-4">Simple, Transparent Pricing</h1>
                    <p className="text-gray-500 md:text-xl dark:text-gray-400">Choose the plan that fits your growth stage.</p>
                </div>
                <div className="grid gap-6 lg:grid-cols-3 max-w-5xl mx-auto">
                    {/* Starter */}
                    <div className="border p-6 rounded-xl flex flex-col">
                        <h3 className="text-xl font-bold">Starter</h3>
                        <div className="text-3xl font-bold my-4">$49<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                        <ul className="space-y-2 mb-6 flex-1">
                            <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-500" /> 500 Leads/mo</li>
                            <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-500" /> Basic Email Drafts</li>
                            <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-500" /> 1 User Seat</li>
                        </ul>
                        <Button className="w-full">Get Started</Button>
                    </div>
                    {/* Pro */}
                    <div className="border p-6 rounded-xl flex flex-col bg-slate-900 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-purple-600 text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                        <h3 className="text-xl font-bold">Professional</h3>
                        <div className="text-3xl font-bold my-4">$149<span className="text-sm font-normal text-gray-400">/mo</span></div>
                        <ul className="space-y-2 mb-6 flex-1">
                            <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-purple-400" /> 2,500 Leads/mo</li>
                            <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-purple-400" /> Advanced AI Personalization</li>
                            <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-purple-400" /> 5 User Seats</li>
                            <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-purple-400" /> CRM Integration</li>
                        </ul>
                        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white border-0">Start Free Trial</Button>
                    </div>
                    {/* Enterprise */}
                    <div className="border p-6 rounded-xl flex flex-col">
                        <h3 className="text-xl font-bold">Enterprise</h3>
                        <div className="text-3xl font-bold my-4">Custom</div>
                        <ul className="space-y-2 mb-6 flex-1">
                            <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-500" /> Unlimited Leads</li>
                            <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-500" /> Custom AI Models</li>
                            <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-500" /> Dedicated Success Manager</li>
                            <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-500" /> SSO & Audit Logs</li>
                        </ul>
                        <Button variant="outline" className="w-full">Contact Sales</Button>
                    </div>
                </div>
            </main>
            <footer className="py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 DataFrontier Inc. All rights reserved.</p>
            </footer>
        </div>
    );
}
