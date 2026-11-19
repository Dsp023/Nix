import React from 'react';

const FollowUpSection = ({ questions, isLoading, onFollowUp }) => {
    if (questions.length === 0 || isLoading) return null;

    return (
        <div className="mt-8 p-5 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl backdrop-blur-md shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <span className="text-indigo-400">✨</span>
                <span>Dive Deeper</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
                {questions.map((question, idx) => (
                    <button
                        key={idx}
                        onClick={() => onFollowUp(question)}
                        className="group px-3.5 py-2 text-xs sm:text-sm text-left text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                        <span>{question}</span>
                        <span className="text-zinc-500 group-hover:text-indigo-300 transition-transform group-hover:translate-x-0.5">→</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FollowUpSection;
