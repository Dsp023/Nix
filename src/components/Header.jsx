import React from 'react';
import { getProvider, getProviders } from '../utils/apiService';

const Header = ({ isFocusMode, onOpenSettings }) => {
    if (isFocusMode) return null;
    const providerKey = getProvider();
    const providers = getProviders();
    const activeProvider = providers[providerKey] || providers.groq;

    return (
        <header className="text-center space-y-3 pt-6 animate-in fade-in slide-in-from-top-4 duration-700">
            {/* Logo Mark + Title */}
            <div className="inline-flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 p-[1.5px] shadow-lg shadow-indigo-500/20">
                    <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                        <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-400 text-xl font-mono">
                            N
                        </span>
                    </div>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-zinc-400">
                    Nix
                </h1>
            </div>

            <p className="text-base sm:text-lg text-zinc-400 max-w-md mx-auto leading-relaxed">
                Adaptive explanation engine for complex topics.
            </p>

            {/* Provider Status Pill */}
            <div className="pt-1">
                <button
                    onClick={onOpenSettings}
                    type="button"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800/80 rounded-full text-xs text-zinc-300 transition-all hover:border-zinc-700 hover:scale-[1.02] shadow-sm group cursor-pointer"
                    title="Click to configure AI engine or API key"
                >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                    <span>Engine: <strong className="text-white font-medium">{activeProvider.name}</strong></span>
                    <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300">({activeProvider.defaultModel})</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 group-hover:text-zinc-300 transition-transform group-hover:translate-x-0.5">
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                </button>
            </div>
        </header>
    );
};

export default Header;
