'use client';

import React from 'react';
import Link from 'next/link';
import { Twitter, Linkedin, Github, Zap } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Footer() {
    const pathname = usePathname();
    if (pathname.startsWith('/dashboard')) return null;

    return (
        <footer className="bg-black border-t border-white/10 pt-20 pb-10 text-sm">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="h-6 w-6 bg-violet-600 rounded-md flex items-center justify-center">
                                <Zap className="w-3 h-3 text-white fill-white" />
                            </div>
                            <span className="font-display font-bold text-lg text-white">MissionControl</span>
                        </Link>
                        <p className="text-gray-500 leading-relaxed mb-6">
                            The Agentic Sales Optimization Copilot closing the gap between raw data and revenue.
                        </p>
                        <div className="flex gap-4">
                            <SocialLink icon={<Twitter className="w-4 h-4" />} href="#" />
                            <SocialLink icon={<Linkedin className="w-4 h-4" />} href="#" />
                            <SocialLink icon={<Github className="w-4 h-4" />} href="#" />
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Product</h4>
                        <ul className="space-y-4 text-gray-500">
                            <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link href="/changelog" className="hover:text-white transition-colors">Changelog</Link></li>
                            <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Company</h4>
                        <ul className="space-y-4 text-gray-500">
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Legal</h4>
                        <ul className="space-y-4 text-gray-500">
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-600">
                        &copy; 2026 MissionControl by DataFrontier.
                    </p>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-xs text-gray-400">All Systems Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ icon, href }: any) {
    return (
        <Link href={href} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
            {icon}
        </Link>
    )
}
