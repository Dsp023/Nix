import React, { useState, useEffect } from 'react';
import {
    getUserApiKey,
    setUserApiKey,
    getProvider,
    setProvider,
    getProviders,
    isUsingDefaultKey
} from '../utils/apiService';

const ApiKeySettings = ({ isOpen, onClose, onSave }) => {
    const [apiKey, setApiKeyState] = useState('');
    const [selectedProvider, setSelectedProvider] = useState('groq');
    const [showKey, setShowKey] = useState(false);
    const [saved, setSaved] = useState(false);
    const providers = getProviders();
    const usingBuiltIn = isUsingDefaultKey();

    useEffect(() => {
        if (isOpen) {
            setApiKeyState(getUserApiKey());
            setSelectedProvider(getProvider());
            setSaved(false);
        }
    }, [isOpen]);

    const handleSave = () => {
        setUserApiKey(apiKey);
        setProvider(selectedProvider);
        setSaved(true);
        setTimeout( () => {
            setSaved(false);
            if (onSave) onSave();
        }, 1000);
    };

    const handleClear = () => {
        setApiKeyState('');
        setUserApiKey('');
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-zinc-800">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
                            </svg>
                            API Key Settings
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1 text-zinc-400  hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-5">
                        {/* Status Box */}
                        {usingBuiltIn ? (
                            <div className=" p-4 rounded-xl bg-emerald-900/20 border border-emerald-700/50">
                                <p className="text-sm text-emerald-200">
                                    ✓ Using <strong>built-in Groq API</strong>. Add your own key below to use other providers or your own quota.
                                </p>
                            </div>
                        ) : (
                            <div className="p-4 rounded-xl bg-blue-900/20 border border-blue-700/50">
                                <p className="text-sm text-blue-200">
                                    🔑 Add your API key to use Nix. Get a free key from your preferred provider.
                                </p>
                            </div>
                        )}

                        {/* Provider Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Provider</label>
                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(providers).map(([key, provider]) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedProvider(key)}
                                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${selectedProvider === key
                                            ? 'bg-white text-black'
                                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                                            }`}
                                    >
                                        {provider.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* API Key Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">API Key</label>
                            <div className="relative">
                                <input
                                    type={showKey ? 'text' : 'password'}
                                    value={apiKey}
                                    onChange={(e) => setApiKeyState(e.target.value)}
                                    placeholder={`Enter your ${providers[selectedProvider].name} API key`}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 pr-10 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowKey(!showKey)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                                >
                                    {showKey ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-zinc-500">
                                Get your free key →{' '}
                                <a href={providers[selectedProvider].getKeyUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                    {providers[selectedProvider].getKeyUrl.replace('https://', '')}
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 p-5 pt-0">
                        <button
                            onClick={handleClear}
                            disabled={!apiKey}
                            className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          Clear Key
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!apiKey}
                            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${saved
                                ? 'bg-emerald-600 text-white'
                                : apiKey
                                    ? 'bg-white text-black hover:bg-zinc-200'
                                    : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                                }`}
                        >
                            {saved ? '✓ Saved!' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ApiKeySettings;
