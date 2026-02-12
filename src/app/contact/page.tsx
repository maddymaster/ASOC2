import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
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
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-4 text-center">Contact Us</h1>
                    <p className="text-gray-500 md:text-xl dark:text-gray-400 mb-8 text-center">
                        Have questions? We'd love to hear from you.
                    </p>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">First name</label>
                                <Input placeholder="John" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Last name</label>
                                <Input placeholder="Doe" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input placeholder="john@example.com" type="email" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Message</label>
                            <Textarea placeholder="How can we help you?" />
                        </div>
                        <Button className="w-full">Send Message</Button>
                    </div>
                </div>
            </main>
            <footer className="py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 DataFrontier Inc. All rights reserved.</p>
            </footer>
        </div>
    );
}
