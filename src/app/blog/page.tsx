import { BLOG_POSTS } from "@/lib/blog-content";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function BlogIndex() {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30">
            <Header />

            <main className="pt-32 pb-20 px-4">
                {/* Hero */}
                <div className="max-w-7xl mx-auto mb-16 text-center">
                    <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1">
                        MissionControl Blog
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-300 mb-6 tracking-tight">
                        Strategic Intelligence
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Insights on AI infrastructure, agentic workflows, and the economics of automated sales.
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {BLOG_POSTS.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group relative flex flex-col bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
                        >
                            {/* Hover Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="p-8 flex-1 flex flex-col relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs">
                                        {post.category}
                                    </Badge>
                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {post.readTime}
                                    </span>
                                </div>

                                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                                    {post.title}
                                </h2>

                                <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                                    {post.description}
                                </p>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                            <User className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium text-slate-300">{post.author.name}</span>
                                            <span className="text-[10px] text-slate-500">{post.date}</span>
                                        </div>
                                    </div>

                                    <div className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors">
                                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
