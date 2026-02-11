import Link from "next/link";
import { ArrowRight, Brain, Globe, Database, Cpu, Activity, ShieldCheck, Zap } from "lucide-react";
import { GapVisualization } from "@/components/landing/GapVisualization";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-violet-500/30 font-sans">

      {/* Navbar overlay */}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-48 pb-24 overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] -z-10" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 -z-10" />

          <div className="container mx-auto px-6 text-center z-10 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              Agentic Sales Optimization Copilot v2.0
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
              From Scattered Data to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                Operational Intelligence.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              The ASOC platform that closes the gap between raw data and revenue decisions.
              Deploy autonomous agents to mine, engage, and close.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="px-8 py-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-violet-600/20">
                Deploy MissionControl
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="https://datafrontier.com" target="_blank" className="px-8 py-4 rounded-lg bg-transparent border border-white/10 hover:bg-white/5 text-gray-300 font-medium transition-colors">
                View DataFrontier Services
              </Link>
            </div>
          </div>
        </section>

        {/* Gap Visualization */}
        <GapVisualization />

        {/* Feature Bento Grid */}
        <section className="py-24 bg-black relative">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-display font-bold mb-4">Command Center Capabilities</h2>
              <p className="text-gray-400">A unified suite of agentic tools designed for high-velocity sales.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[600px]">

              {/* 1. AI Lead Gen (Large) */}
              <div className="md:col-span-2 md:row-span-2 rounded-2xl border border-white/10 bg-neutral-900/50 p-8 flex flex-col relative overflow-hidden group hover:border-violet-500/30 transition-colors">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl group-hover:bg-violet-500/20 transition-all" />
                <div className="mb-auto z-10">
                  <div className="h-10 w-10 bg-violet-500/20 rounded-lg flex items-center justify-center mb-6">
                    <Globe className="w-5 h-5 text-violet-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">AI Lead Gen</h3>
                  <p className="text-gray-400 mb-6">Autonomous scraping and enrichment. Your agents treat the web as a database, identifying high-intent prospects in real-time.</p>
                </div>
                {/* Visual element placeholder */}
                <div className="h-48 w-full bg-black/40 rounded-xl border border-white/5 overflow-hidden relative">
                  <div className="absolute top-4 left-4 right-4 h-2 bg-white/10 rounded-full" />
                  <div className="absolute top-8 left-4 right-12 h-2 bg-white/5 rounded-full" />
                  <div className="absolute top-12 left-4 right-8 h-2 bg-white/5 rounded-full" />
                </div>
              </div>

              {/* 2. Inbound/Outbound Voice */}
              <div className="md:col-span-1 md:row-span-1 rounded-2xl border border-white/10 bg-neutral-900/50 p-6 flex flex-col group hover:border-emerald-500/30 transition-colors">
                <div className="h-8 w-8 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold mb-1">Voice Agents</h3>
                <p className="text-sm text-gray-400">Retell AI powered conversations with sub-800ms latency.</p>
              </div>

              {/* 3. Post-Call Mining */}
              <div className="md:col-span-1 md:row-span-1 rounded-2xl border border-white/10 bg-neutral-900/50 p-6 flex flex-col group hover:border-amber-500/30 transition-colors">
                <div className="h-8 w-8 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Cpu className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold mb-1">Post-Call Mining</h3>
                <p className="text-sm text-gray-400">Extracting intent, sentiment, and objections automatically.</p>
              </div>

              {/* 4. Mission Control Memory (wide) */}
              <div className="md:col-span-2 lg:col-span-2 md:row-span-1 rounded-2xl border border-white/10 bg-neutral-900/50 p-6 flex flex-row items-center gap-6 group hover:border-blue-500/30 transition-colors">
                <div className="flex-1">
                  <div className="h-8 w-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Brain className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-1">Mission Control Memory</h3>
                  <p className="text-sm text-gray-400">Persistent context across all interactions. Your agents never forget a deal breaker.</p>
                </div>
                <div className="hidden sm:block w-32 h-full bg-blue-500/5 rounded-lg border border-blue-500/10 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Database className="w-8 h-8 text-blue-500/40" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Footer */}
      </main>
    </div>
  );
}
