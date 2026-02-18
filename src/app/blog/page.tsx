"use client";

import Link from "next/link";
import { useState } from "react";
import { BLOG_POSTS, BlogPost } from "@/lib/blog-content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Clock, Calendar, Mail } from "lucide-react";

export default function BlogPage() {
    const categories = ["All", ...Array.from(new Set(BLOG_POSTS.map(p => p.category)))];
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredPosts = activeCategory === "All"
        ? BLOG_POSTS
        : BLOG_POSTS.filter(post => post.category === activeCategory);

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
            <Header />

            <main className="pt-32 pb-24 container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        The <span className="text-blue-500">Mission</span> Log
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Insights on AI agents, latency optimization, and the future of automated sales.
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="mb-12 flex justify-center">
                    <Tabs defaultValue="All" className="w-full max-w-3xl" onValueChange={setActiveCategory}>
                        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-slate-900 border border-slate-800">
                            {categories.map(cat => (
                                <TabsTrigger key={cat} value={cat} className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400 hover:text-white transition-all">
                                    {cat}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>

                {/* Blog Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                    {filteredPosts.map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} className="group h-full">
                            <Card className="h-full bg-slate-900/50 border-slate-800 hover:border-blue-500/50 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10">
                                <CardHeader className="space-y-4">
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <Badge variant="outline" className="border-blue-900/30 text-blue-400 bg-blue-900/10 capitalize">
                                            {post.category}
                                        </Badge>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> {post.readTime}
                                        </div>
                                    </div>
                                    <CardTitle className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">
                                        {post.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-slate-400 line-clamp-3 leading-relaxed">
                                        {post.description}
                                    </p>
                                </CardContent>
                                <CardFooter className="border-t border-slate-800/50 pt-6 mt-auto flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-slate-800 overflow-hidden relative">
                                            {/* Avatar Placeholder */}
                                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 opacity-80" />
                                            <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-white">
                                                {post.author.name.charAt(0)}
                                            </div>
                                        </div>
                                        <div className="text-xs">
                                            <div className="text-slate-200 font-medium">{post.author.name}</div>
                                            <div className="text-slate-500">{post.date}</div>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-slate-500 group-hover:translate-x-1 group-hover:text-blue-400 transition-all" />
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Newsletter Signup */}
                <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/20 p-8 md:p-16 text-center">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full pointer-events-none" />

                    <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400 mb-4">
                            <Mail className="h-8 w-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">Join the High-Velocity Archives</h2>
                        <p className="text-slate-400 text-lg">
                            Get weekly tactics on agentic sales, infrastructure optimization, and the death of cold calling.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                            <Input
                                placeholder="engineer@startup.com"
                                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-600 h-12"
                            />
                            <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-500 font-semibold text-white shadow-lg shadow-blue-900/20">
                                Subscribe
                            </Button>
                        </form>
                        <p className="text-xs text-slate-600">
                            Zero spam. Unsubscribe at any time.
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
