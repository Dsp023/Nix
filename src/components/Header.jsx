import React from 'react';
import { isUsingDefaultKey } from '../utils/apiService';

const Header = ({ isFocusMode }) => {
    if (isFocusMode) return null;
    return (
        <header className="text-center space-y-2 pt-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Nix</h1>
            <p className="text-lg text-muted-foreground">Adaptive explanation engine for complex topics.</p>
            {isUsingDefaultKey() && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-900/30 border border-emerald-700/50 rounded-full text-xs">
                    <span className="text-emerald-400">✓ Using built-in Groq API</span>
                </div>
            )}
        </header>
    );
};

export default Header;
