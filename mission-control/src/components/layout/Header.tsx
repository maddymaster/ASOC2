'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Zap, BarChart3, Users, Shield, Globe, Cpu as Cpua } from 'lucide-react';

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const pathname = usePathname();

    // Hide header on dashboard and login/signup/admin pages if desired, but request says "across all pages".
    // Usually Dashboard has its own sidebar, so we might want to exclude it or adapt it.
    // User said "/pricing, /features, /contact, /about, /careers".
    // I will exclude /dashboard to avoid double nav, unless specifically asked.
    // The request says "Global Header... across all pages (/pricing, /features, /contact, /about, /careers)".
    // It doesn't explicitly say /dashboard, and usually app vs marketing site have different headers.
    if (pathname.startsWith('/dashboard')) return null;

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleDropdown = (name: string) => {
        setActiveDropdown(activeDropdown === name ? null : name);
    };

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${isScrolled || isMobileMenuOpen
                ? 'bg-black/80 backdrop-blur-xl border-white/10'
                : 'bg-transparent border-transparent'
                }`}
        >
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="font-display font-bold text-xl tracking-tight flex items-center gap-2 z-50">
                    <div className="h-8 w-8 bg-violet-600 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white fill-white" />
                    </div>
                    <span className="text-white">MissionControl</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <div className="relative group">
                        <button
                            className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white transition-colors py-2"
                            onMouseEnter={() => setActiveDropdown('features')}
                            onClick={() => toggleDropdown('features')}
                        >
                            Features <ChevronDown className="w-4 h-4" />
                        </button>

                        {/* Mega Menu - Features */}
                        <AnimatePresence>
                            {activeDropdown === 'features' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl p-6 grid grid-cols-2 gap-4"
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <MenuLink
                                        href="/#lead-gen"
                                        icon={<Globe className="w-5 h-5 text-blue-400" />}
                                        title="Global Lead Gen"
                                        desc="275M+ verified contacts at your fingertips."
                                    />
                                    <MenuLink
                                        href="/#voice-agents"
                                        icon={<MicIcon className="w-5 h-5 text-pink-400" />}
                                        title="Voice Agents"
                                        desc="Sub-800ms latency AI calling."
                                    />
                                    <MenuLink
                                        href="/#analytics"
                                        icon={<BarChart3 className="w-5 h-5 text-emerald-400" />}
                                        title="Deep Analytics"
                                        desc="Full funnel visibility and conversion tracking."
                                    />
                                    <MenuLink
                                        href="/#security"
                                        icon={<Shield className="w-5 h-5 text-amber-400" />}
                                        title="Enterprise Security"
                                        desc="SOC2 compliant data handling."
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="relative group">
                        <button
                            className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white transition-colors py-2"
                            onMouseEnter={() => setActiveDropdown('services')}
                            onClick={() => toggleDropdown('services')}
                        >
                            Services <ChevronDown className="w-4 h-4" />
                        </button>

                        <AnimatePresence>
                            {activeDropdown === 'services' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl p-6 grid grid-cols-2 gap-4"
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <MenuLink href="/contact?path=team" icon={<Users className="w-5 h-5 text-violet-400" />} title="Embedded Teams" desc="Deploy a full DataFrontier engineering unit." />
                                    <MenuLink href="/contact?path=audit" icon={<Shield className="w-5 h-5 text-red-400" />} title="Architecture Audit" desc="We break your system to find the leaks." />
                                    <MenuLink href="/contact?path=migration" icon={<Zap className="w-5 h-5 text-amber-400" />} title="Legacy Migration" desc="Move from Salesforce/Hubspot to MissionControl." />
                                    <MenuLink href="/careers" icon={<Cpua className="w-5 h-5 text-cyan-400" />} title="Join the Frontier" desc="We are hiring system builders." />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Link href="/about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">About</Link>
                    <Link href="/careers" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Careers</Link>
                    <Link href="/contact" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Contact</Link>
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Login
                    </Link>
                    <Link href="/dashboard" className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors">
                        Deploy Now
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden z-50 text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        className="fixed inset-0 bg-black z-40 md:hidden pt-24 px-6 flex flex-col gap-6"
                    >
                        <Link href="/#features" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-white">Features</Link>
                        <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-white">About</Link>
                        <Link href="/careers" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-white">Careers</Link>
                        <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-white">Contact</Link>
                        <div className="h-px bg-white/10 my-4" />
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-gray-400">Login</Link>
                        <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-violet-400">Deploy MissionControl</Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

function MenuLink({ href, icon, title, desc }: any) {
    return (
        <Link href={href} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
            <div className="mt-1 p-2 rounded-lg bg-black/50 border border-white/10 group-hover:border-violet-500/50 transition-colors">
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-white text-sm mb-1 group-hover:text-violet-300 transition-colors">{title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
        </Link>
    );
}

function MicIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
    )
}
