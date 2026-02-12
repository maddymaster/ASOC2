import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Bot, Zap } from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="px-4 lg:px-6 h-14 flex items-center border-b sticky top-0 bg-background/95 backdrop-blur z-50">
                <Link className="flex items-center justify-center font-bold text-xl" href="/">
                    DataFrontier
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/about">About</Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/pricing">Pricing</Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/contact">Contact</Link>
                    <Link href="/login">
                        <Button size="sm" variant="outline">Login</Button>
                    </Link>
                </nav>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black text-white">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                                    AI-Driven Sales Intelligence
                                </h1>
                                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                                    Turn cold leads into closed deals with autonomous agents, deep research, and real-time coaching.
                                </p>
                            </div>
                            <div className="space-x-4">
                                <Link href="/dashboard">
                                    <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                                        Book Demo
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
                            <div className="flex flex-col space-y-4">
                                <div className="p-3 bg-black rounded-full w-fit text-white">
                                    <Bot className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold">Autonomous Agents</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Our agents research prospects, draft hyper-personalized emails, and even handle initial outreach calls.
                                </p>
                            </div>
                            <div className="flex flex-col space-y-4">
                                <div className="p-3 bg-black rounded-full w-fit text-white">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold">Instant Enrichment</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Get real-time data on any company or contact. No more stale databases.
                                </p>
                            </div>
                            <div className="flex flex-col space-y-4">
                                <div className="p-3 bg-black rounded-full w-fit text-white">
                                    <BarChart3 className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold">Live Coaching</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Real-time sentiment analysis and objection handling suggestions during your calls.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 DataFrontier Inc. All rights reserved.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-xs hover:underline underline-offset-4" href="#">Terms of Service</Link>
                    <Link className="text-xs hover:underline underline-offset-4" href="#">Privacy</Link>
                </nav>
            </footer>
        </div>
    );
}
