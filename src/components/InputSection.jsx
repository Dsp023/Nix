import React, { useState, useEffect } from 'react';

const SUGGESTED_TOPICS = [
    { label: "Quantum Entanglement", level: 3 },
    { label: "Transformer Neural Networks", level: 2 },
    { label: "Black Holes & Event Horizons", level: 1 },
    { label: "How Compilers Work", level: 2 },
    { label: "Photosynthesis", level: 0 },
];

const LEVEL_ACCENTS = {
    0: 'bg-pink-500/15 text-pink-300 border-pink-500/40 ring-1 ring-pink-500/30 shadow-sm shadow-pink-500/10',
    1: 'bg-sky-500/15 text-sky-300 border-sky-500/40 ring-1 ring-sky-500/30 shadow-sm shadow-sky-500/10',
    2: 'bg-zinc-800 text-white border-zinc-600 ring-1 ring-zinc-500/30 shadow-sm',
    3: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40 ring-1 ring-indigo-500/30 shadow-sm shadow-indigo-500/10',
    4: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/30 shadow-sm shadow-emerald-500/10',
};

const InputSection = ({ 
    textareaRef, 
    level, 
    setLevel, 
    isLoading, 
    levels, 
    theme, 
    isFocusMode,
    isGeneratingPath,
    onGenerateLearningPath,
    onExplain,
    output
}) => {
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);

    // Sync counts if textareaRef value changes externally (e.g. from history load)
    useEffect(() => {
        if (textareaRef.current) {
            const val = textareaRef.current.value || '';
            setCharCount(val.length);
            setWordCount(val.trim() ? val.trim().split(/\s+/).length : 0);
        }
    }, [textareaRef, output]);

    if (isFocusMode) return null;

    const handleTextChange = (e) => {
        const val = e.target.value;
        setCharCount(val.length);
        setWordCount(val.trim() ? val.trim().split(/\s+/).length : 0);
    };

    const handleClearText = () => {
        if (textareaRef.current) {
            textareaRef.current.value = '';
            setCharCount(0);
            setWordCount(0);
            textareaRef.current.focus();
        }
    };

    const handleSelectTopic = (topic) => {
        if (textareaRef.current) {
            textareaRef.current.value = topic.label;
            setCharCount(topic.label.length);
            setWordCount(topic.label.trim().split(/\s+/).length);
            textareaRef.current.focus();
        }
        if (setLevel) {
            setLevel(topic.level);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 delay-150 fill-mode-both">
            {/* Input Card */}
            <div className="space-y-3">
                <div className="relative group">
                    <textarea
                        ref={textareaRef}
                        id="text-input"
                        onChange={handleTextChange}
                        className="w-full bg-zinc-950/60 backdrop-blur-md text-foreground border border-zinc-800/80 rounded-2xl p-5 pb-10 text-base focus:ring-1 focus:ring-zinc-600 outline-none transition-all placeholder:text-zinc-600 h-36 resize-y shadow-2xl focus:border-zinc-600"
                        placeholder="What do you want to learn today? Enter a concept, question, or formula..."
                        disabled={isLoading}
                    />

                    {/* Textarea Bottom Tools: Word Count & Clear Button */}
                    <div className="absolute right-3 bottom-3 flex items-center gap-2 select-none pointer-events-auto">
                        {charCount > 0 && (
                            <>
                                <span className="text-[11px] font-mono text-zinc-500 bg-zinc-900/80 px-2 py-0.5 rounded-md border border-zinc-800/60">
                                    {wordCount} {wordCount === 1 ? 'word' : 'words'}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleClearText}
                                    disabled={isLoading}
                                    className="p-1 text-zinc-500 hover:text-zinc-200 bg-zinc-900/80 hover:bg-zinc-800 rounded-md border border-zinc-800/60 transition-colors"
                                    title="Clear input"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 6 6 18" />
                                        <path d="m6 6 12 12" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Quick Topic Chips */}
                <div className="flex items-center gap-1.5 flex-wrap px-1 text-xs text-zinc-500">
                    <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                        <span className="text-zinc-400">✨</span> Ideas:
                    </span>
                    {SUGGESTED_TOPICS.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => handleSelectTopic(item)}
                            disabled={isLoading}
                            className="px-2.5 py-1 rounded-full bg-zinc-900/70 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 hover:border-zinc-700 transition-all text-[11px] active:scale-95 cursor-pointer"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Complexity Level Selector */}
            <div className="space-y-3 bg-zinc-900/40 p-4 sm:p-5 rounded-2xl border border-zinc-800/80 backdrop-blur-md shadow-xl">
                <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        Complexity Level
                    </span>
                    <span className={`font-bold transition-colors duration-300 ${theme.text}`}>
                        {levels[level].label} Depth
                    </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {levels.map((lvl) => {
                        const isSelected = level === lvl.value;
                        const activeAccent = LEVEL_ACCENTS[lvl.value] || LEVEL_ACCENTS[2];
                        return (
                            <button
                                key={lvl.value}
                                onClick={() => setLevel(lvl.value)}
                                disabled={isLoading}
                                className={[
                                    'py-3 px-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 border cursor-pointer',
                                    isSelected
                                        ? activeAccent
                                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 bg-zinc-950/40 border-zinc-800/60',
                                    'disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'
                                ].join(' ')}
                            >
                                <div className="flex flex-col items-center gap-1">
                                    <span className="font-semibold">{lvl.label}</span>
                                    {isSelected && (
                                        <div className={`w-5 h-0.5 rounded-full ${theme.border} border-t-2 opacity-90 shadow-[0_0_8px_currentColor]`} />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
                <p className="text-xs text-zinc-400/80 min-h-[1.25rem] text-center italic pt-1">
                    "{levels[level].description}"
                </p>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-between items-center flex-wrap gap-4 pt-1">
                <button
                    onClick={onGenerateLearningPath}
                    disabled={isLoading || isGeneratingPath || (!textareaRef.current?.value && !output)}
                    className="py-2.5 px-5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-300 hover:text-white flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed backdrop-blur-sm active:scale-95 shadow-sm"
                    title="Generate a 5-step roadmap"
                >
                    <span>{isGeneratingPath ? 'Generating...' : '🗺️ Learning Path'}</span>
                </button>

                <button
                    id="explain-button"
                    onClick={onExplain}
                    disabled={isLoading}
                    className={`py-2.5 px-8 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white shadow-xl active:scale-[0.98] flex items-center gap-2 cursor-pointer
                        ${isLoading
                            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                            : 'bg-white text-black hover:bg-zinc-100 hover:shadow-2xl hover:shadow-white/10'}`}
                >
                    <span>{isLoading ? 'Thinking...' : 'Explain'}</span>
                    {!isLoading && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/10 text-black/70 font-bold hidden sm:inline">
                            ↵
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default InputSection;
