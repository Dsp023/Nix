import React from 'react';

const FollowUpSection = ({ questions, isLoading, onFollowUp }) => {
    if (questions.length === 0 || isLoading) return null;

    return (
        <div className="mt-6 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <h4 className="text-sm font-medium text-zinc-400 mb-3">🧩 Want to learn more?</h4>
            <div className="flex flex-wrap gap-2">
                {questions.map((question, idx) => (
                    <button
                        key={idx}
                        onClick={() => onFollowUp(question)}
                        className="px-3 py-2 text-sm text-left text-zinc-300 bg-zinc-800/50 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-500 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                    >
                        {question}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FollowUpSection;
