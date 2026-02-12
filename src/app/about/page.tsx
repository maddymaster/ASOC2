import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
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
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-4">About DataFrontier</h1>
                <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 mb-8">
                    We are pioneering the future of sales intelligence. Our mission is to empower sales teams with AI-driven insights that turn cold leads into closed deals.
                </p>
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="border p-6 rounded-lg">
                        <h3 className="text-lg font-bold mb-2">Innovation</h3>
                        <p className="text-sm text-gray-500">Constantly pushing the boundaries of what's possible with AI.</p>
                    </div>
                    <div className="border p-6 rounded-lg">
                        <h3 className="text-lg font-bold mb-2">Integrity</h3>
                        <p className="text-sm text-gray-500">Data accuracy and ethical AI use are at our core.</p>
                    </div>
                    <div className="border p-6 rounded-lg">
                        <h3 className="text-lg font-bold mb-2">Impact</h3>
                        <p className="text-sm text-gray-500">Measuring success by the growth of our customers.</p>
                    </div>
                </div>
            </main>
            <footer className="py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 DataFrontier Inc. All rights reserved.</p>
            </footer>
        </div>
    );
}
