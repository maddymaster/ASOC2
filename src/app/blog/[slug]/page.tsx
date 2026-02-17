import { getPostBySlug } from "@/lib/blog-content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User, Share2, Linkedin, Twitter } from "lucide-react";

// Simple Custom Markdown Renderer
function MarkdownRenderer({ content }: { content: string }) {
    const lines = content.split('\n');

    return (
        <div className="space-y-6 text-slate-300 leading-relaxed font-light">
            {lines.map((line, idx) => {
                // Headers
                if (line.startsWith('# ')) {
                    return <h1 key={idx} className="text-3xl font-bold text-white mt-8 mb-4">{line.replace('# ', '')}</h1>;
                }
                if (line.startsWith('## ')) {
                    return <h2 key={idx} className="text-2xl font-semibold text-white mt-8 mb-4">{line.replace('## ', '')}</h2>;
                }
                if (line.startsWith('### ')) {
                    return <h3 key={idx} className="text-xl font-medium text-blue-200 mt-6 mb-3">{line.replace('### ', '')}</h3>;
                }

                // List Items
                if (line.trim().startsWith('* ')) {
                    return (
                        <div key={idx} className="flex gap-3 pl-4">
                            <span className="text-blue-500 mt-1.5">•</span>
                            <span>
                                {line.replace('* ', '').split('**').map((part, i) =>
                                    i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part
                                )}
                            </span>
                        </div>
                    );
                }

                if (line.trim().startsWith('1. ')) {
                    return (
                        <div key={idx} className="flex gap-3 pl-4">
                            <span className="text-blue-500 font-mono text-sm mt-1">{line.trim().split('.')[0]}.</span>
                            <span>
                                {line.replace(/^\d+\.\s/, '').split('**').map((part, i) =>
                                    i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part
                                )}
                            </span>
                        </div>
                    );
                }

                // Code Blocks (Mermaid / Code)
                if (line.startsWith('```')) {
                    // Just a placeholder style for now, simpler than full parsing state machine
                    return null;
                    // Note: A real parser would need state to handle multi-line blocks. 
                    // For this simple implementation, we'll strip the fences and style the logic in the content if possible.
                    // Instead, let's just handle specific known blocks if needed or generic styling.
                    // Given the constraints, I'll rely on the text content being readable.
                }

                // Table Rows (Simple pipe detection)
                if (line.includes('|')) {
                    const cols = line.split('|').filter(c => c.trim());
                    if (line.includes('---')) return null; // Skip separator
                    return (
                        <div key={idx} className="grid grid-cols-3 gap-4 p-3 border-b border-slate-800 hover:bg-slate-800/30">
                            {cols.map((col, i) => (
                                <div key={i} className="text-sm">{col}</div>
                            ))}
                        </div>
                    )
                }

                // Paragraphs with Bold support
                if (line.trim().length > 0) {
                    return (
                        <p key={idx} className="mb-4">
                            {line.split('**').map((part, i) =>
                                i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part
                            ).map((part, i) => {
                                // Handle Links [Text](Url) - simple regex
                                if (typeof part === 'string') {
                                    // simplified link rendering could go here
                                    return part;
                                }
                                return part;
                            })}
                        </p>
                    )
                }

                return null;
            })}
        </div>
    )
}

// Separate component to handle param unwrapping
function BlogPostContent({ params }: { params: { slug: string } }) {
    const post = getPostBySlug(params.slug);

    if (!post) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-400">
                Post not found
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30">
            <Header />

            <article className="pt-32 pb-20 px-4">
                {/* Post Header */}
                <div className="max-w-3xl mx-auto mb-12">
                    <Link href="/blog" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-400 transition-colors mb-8">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Intelligence
                    </Link>

                    <div className="flex gap-3 mb-6">
                        <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/5">
                            {post.category}
                        </Badge>
                        <span className="flex items-center text-sm text-slate-500">
                            <Clock className="w-3 h-3 mr-1.5" /> {post.readTime}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-between border-b border-slate-800/50 pb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                <User className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-white">{post.author.name}</div>
                                <div className="text-xs text-slate-500">{post.author.role} • {post.date}</div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800">
                                <Linkedin className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800">
                                <Twitter className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800">
                                <Share2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Post Content */}
                <div className="max-w-3xl mx-auto">
                    <MarkdownRenderer content={post.content} />

                    {/* CTA Box */}
                    <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 text-center">
                        <h3 className="text-2xl font-bold text-white mb-3">Ready to deploy this infrastructure?</h3>
                        <p className="text-slate-400 mb-6 max-w-lg mx-auto">
                            Stop paying the "SDR Tax". Build your own Agentic Sales Operation Centre today.
                        </p>
                        <Link href="/signup">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20">
                                Start Your Transformation
                            </Button>
                        </Link>
                    </div>
                </div>
            </article>

            <Footer />
        </div>
    );
}

// Main page component
export default function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
    // In Next.js 15+, params is a Promise. We need to unwrap it.
    // However, since this is a server component we can use 'use' or just await if it was async.
    // But to keep it simple and compatible, usually we just assume it's passed or layout handles it.
    // wait, NextJS 15 changes: params is async.

    // Let's wrapping in a small Async Wrapper Pattern to be safe
    return <PageWrapper params={props.params} />;
}

async function PageWrapper({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    return <BlogPostContent params={resolvedParams} />;
}
