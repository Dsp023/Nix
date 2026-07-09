import React from 'react';

const LandingPage = ({ onGetStarted, onSignIn }) => {
    const features = [
        {
            title: "5 Complexity Levels",
            description: "From 'Child' (simple analogies) to 'Expert' (PhD-level derivations with LaTeX), pick the depth that fits your context.",
            icon: (
                <svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        },
        {
            title: "Real-Time Streaming",
            description: "Watch complex explanations generate token-by-token. No long waiting times, just instant learning.",
            icon: (
                <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )
        },
        {
            title: "Dynamic Learning Paths",
            description: "Automatically generate a structured, 5-step roadmap to master any concept sequentially.",
            icon: (
                <svg className="w-6 h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
            )
        },
        {
            title: "3D Study Flashcards",
            description: "Generate flippable 3D cards from key terms in any explanation to lock in your understanding.",
            icon: (
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500/30 overflow-hidden relative">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-sky-500/10 blur-[180px] pointer-events-none" />

            {/* Navigation Bar */}
            <nav className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between border-b border-zinc-900">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-400 flex items-center justify-center font-bold text-black text-lg shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                        N
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                        Nix
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={onSignIn}
                        className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={onGetStarted}
                        className="px-4 py-2 text-sm font-semibold bg-white text-black hover:bg-zinc-200 rounded-full transition-all shadow-md active:scale-95"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center space-y-8 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-400">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                    Adaptive AI Explanation Engine
                </div>

                <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
                    Learn anything,<br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">
                        at any depth.
                    </span>
                </h1>

                <p className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-400 leading-relaxed">
                    Nix explains complex topics tailored specifically to where you are. Choose a level from a 5-year-old child to a PhD expert, and master concepts instantly.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <button
                        onClick={onGetStarted}
                        className="w-full sm:w-auto px-8 py-4 text-base font-bold bg-white text-black hover:bg-zinc-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] rounded-full transition-all active:scale-[0.98]"
                    >
                        Start Learning for Free
                    </button>
                    <button
                        onClick={onSignIn}
                        className="w-full sm:w-auto px-8 py-4 text-base font-bold bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800/80 rounded-full transition-all"
                    >
                        Sign In to Dashboard
                    </button>
                </div>
            </header>

            {/* Interactive Preview Mockup Card */}
            <section className="max-w-5xl mx-auto px-6 pb-24 relative z-10">
                <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950/40 p-1.5 shadow-[0_0_50px_rgba(99,102,241,0.1)] backdrop-blur-md overflow-hidden">
                    {/* Visual Interface Mockup Header */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-900 bg-zinc-900/40 text-xs text-zinc-500">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/40" />
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
                        </div>
                        <span className="font-mono bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900 text-zinc-600">nix_engine_v1</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px] p-6 gap-6 font-sans">
                        {/* Sidebar Mockup */}
                        <div className="md:col-span-4 space-y-4 border-r border-zinc-900 pr-0 md:pr-6 hidden md:block">
                            <div className="h-6 w-24 bg-zinc-900 rounded-md" />
                            <div className="space-y-2 pt-2">
                                <div className="h-10 bg-zinc-900/60 border border-zinc-800/50 rounded-lg p-2.5 flex items-center justify-between">
                                    <div className="h-3 w-32 bg-zinc-800 rounded" />
                                    <span className="text-[10px] text-zinc-600">Expert</span>
                                </div>
                                <div className="h-10 bg-zinc-900/30 rounded-lg p-2.5 flex items-center justify-between">
                                    <div className="h-3 w-24 bg-zinc-800/60 rounded" />
                                    <span className="text-[10px] text-zinc-600">Child</span>
                                </div>
                                <div className="h-10 bg-zinc-900/30 rounded-lg p-2.5 flex items-center justify-between">
                                    <div className="h-3 w-40 bg-zinc-800/60 rounded" />
                                    <span className="text-[10px] text-zinc-600">Detailed</span>
                                </div>
                            </div>
                        </div>

                        {/* Explanation Content Mockup */}
                        <div className="md:col-span-8 space-y-4 flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="h-6 w-16 bg-zinc-900 rounded flex items-center justify-center text-[10px] border border-zinc-800 text-zinc-400 font-semibold">CONCEPT</span>
                                    <h4 className="font-bold text-white text-sm">Quantum Entanglement</h4>
                                </div>
                                <div className="space-y-2 pt-2 text-zinc-400 text-xs leading-relaxed">
                                    <p>At the <strong className="text-zinc-200">Expert</strong> complexity level, quantum entanglement is mathematically represented by composite Hilbert spaces. Consider a bipartite system in the state:</p>
                                    <div className="my-3 py-2 bg-zinc-900/50 border border-zinc-900 rounded-lg text-center text-sky-400 font-mono text-[11px]">
                                        {"|ψ⟩ = 1/√2 (|00⟩ + |11⟩)"}
                                    </div>
                                    <p>This Einstein-Podolsky-Rosen (EPR) pair represents a maximally entangled state. Its density matrix cannot be factored into product states of individual systems, indicating non-local correlations.</p>
                                </div>
                            </div>

                            {/* Suggestion tags */}
                            <div className="flex items-center gap-2 flex-wrap pt-4 border-t border-zinc-900">
                                <span className="text-[10px] text-zinc-500">Related Roadmaps:</span>
                                <span className="text-[10px] bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 px-2 py-1 rounded text-zinc-400">Bell's Theorem</span>
                                <span className="text-[10px] bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 px-2 py-1 rounded text-zinc-400">Superposition</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-6xl mx-auto px-6 py-20 border-t border-zinc-900 relative z-10">
                <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                        Built for adaptive learning.
                    </h2>
                    <p className="text-zinc-400 text-sm sm:text-base">
                        Nix replaces passive reading with an interface designed to accommodate your current level of expertise.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="p-6 rounded-xl border border-zinc-900 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-zinc-800/80 transition-all group">
                            <div className="w-12 h-12 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-4xl mx-auto px-6 py-20 text-center relative z-10">
                <div className="p-8 sm:p-12 rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/50 to-zinc-950/20 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-0 left-[50%] translate-x-[-50%] w-[80%] h-[30%] bg-indigo-500/10 blur-[50px]" />
                    
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
                        Ready to change how you learn?
                    </h2>
                    <p className="text-zinc-400 text-sm max-w-lg mx-auto mb-8">
                        Sign up for a free account, sync your API keys, and start exploring topics at the level that matches your mind.
                    </p>
                    <button
                        onClick={onGetStarted}
                        className="px-8 py-4 font-bold bg-white text-black hover:bg-zinc-200 rounded-full transition-all active:scale-[0.98] shadow-md shadow-white/5"
                    >
                        Get Started Instantly
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full border-t border-zinc-900 py-8 text-center text-xs text-zinc-600">
                <p>© 2026 Nix Adaptive AI. Created by Nakka Devi Sri Prasad.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
