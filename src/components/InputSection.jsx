import React from 'react';

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
    if (isFocusMode) return null;

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 delay-150 fill-mode-both">
            <div className="space-y-4">
                <textarea
                    ref={textareaRef}
                    id="text-input"
                    className="w-full bg-zinc-950/50 backdrop-blur-sm text-foreground border border-zinc-800 rounded-xl p-5 text-base focus:ring-1 outline-none transition-all placeholder:text-muted-foreground/50 h-36 resize-y shadow-inner focus:border-zinc-500"
                    placeholder="What do you want to learn today?"
                    disabled={isLoading}
                ></textarea>
            </div>

            <div className="space-y-3 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/80 backdrop-blur-md">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block flex items-center justify-between">
                    <span>Complexity Level</span>
                    <span className={`font-bold transition-colors duration-300 ${theme.text}`}>{levels[level].label}</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {levels.map((lvl) => (
                        <button
                            key={lvl.value}
                            onClick={() => setLevel(lvl.value)}
                            disabled={isLoading}
                            className={[
                                'py-2.5 px-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300',
                                level === lvl.value
                                    ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700'
                                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 bg-zinc-900/50',
                                'disabled:opacity-50 disabled:cursor-not-allowed'
                            ].join(' ')}
                        >
                            <div className="flex flex-col items-center gap-1">
                                <span>{lvl.label}</span>
                                {level === lvl.value && <div className={`w-4 h-0.5 rounded-full ${theme.border} border-t-2 opacity-80 shadow-[0_0_8px_currentColor]`} />}
                            </div>
                        </button>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground/70 min-h-[1.25rem] text-center italic pt-1">
                    {levels[level].description}
                </p>
            </div>

            <div className="flex justify-between items-center flex-wrap gap-4 pt-2">
                <button
                    onClick={onGenerateLearningPath}
                    disabled={isLoading || isGeneratingPath || (!textareaRef.current?.value && !output)}
                    className="py-2.5 px-6 rounded-full text-sm font-semibold transition-all duration-200 border border-zinc-700/50 hover:bg-zinc-800/50 text-zinc-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:text-white backdrop-blur-sm"
                >
                    {isGeneratingPath ? 'Generating...' : '🗺️ Learning Path'}
                </button>
                <button
                    id="explain-button"
                    onClick={onExplain}
                    disabled={isLoading}
                    className={`py-2.5 px-8 rounded-full text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white shadow-lg active:scale-[0.98]
                        ${isLoading
                            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                            : 'bg-white text-black hover:bg-zinc-200 hover:shadow-xl hover:shadow-white/10'}`}
                >
                    {isLoading ? 'Thinking...' : 'Explain'}
                </button>
            </div>
        </div>
    );
};

export default InputSection;
