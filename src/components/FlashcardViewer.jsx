import React, { useState } from 'react';

const FlashcardViewer = ({ cards, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    if (!cards || cards.length === 0) return null;

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % cards.length);
        }, 150); // Small delay to let flip animation reset
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
        }, 150);
    };

    const currentCard = cards[currentIndex];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[85vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
                    <h3 className="text-lg font-semibold text-white">
                        Flashcards <span className="text-zinc-500 text-sm ml-2">({currentIndex + 1} of {cards.length})</span>
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-zinc-400 hover:text-white transition-colors hover:bg-zinc-800 rounded-lg"
                        title="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Flip Card Container */}
                <div className="flex-1 p-6 sm:p-12 relative perspective-1000 flex items-center justify-center">
                    <div
                        className={`w-full h-full relative transition-transform duration-500 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        {/* Front - Question */}
                        <div className="absolute inset-0 backface-hidden bg-zinc-900 border border-zinc-700/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-inner group transition-all hover:border-zinc-600">
                            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6 py-1 px-3 bg-zinc-800/50 rounded-full border border-zinc-700/50">Question</div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                                {currentCard.q}
                            </h2>
                            <p className="mt-8 text-sm text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 2v6h6"></path></svg>
                                Click to flip
                            </p>
                        </div>

                        {/* Back - Answer */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-emerald-950/20 border border-emerald-900/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-inner group transition-all hover:border-emerald-800/50">
                            <div className="text-xs font-semibold text-emerald-500 uppercase tracking-widest mb-6 py-1 px-3 bg-emerald-900/30 rounded-full border border-emerald-800/50">Answer</div>
                            <p className="text-lg sm:text-xl text-zinc-200 leading-relaxed max-h-[80%] overflow-y-auto custom-scrollbar">
                                {currentCard.a}
                            </p>
                            <p className="mt-8 text-sm text-emerald-500/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 2v6h6"></path></svg>
                                Click to flip back
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
                    <button
                        onClick={handlePrev}
                        className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        Previous
                    </button>

                    {/* Progress indicators */}
                    <div className="flex gap-1.5">
                        {cards.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-zinc-700'}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        className="px-6 py-3 bg-white hover:bg-zinc-200 text-black rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                    >
                        Next
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>
            </div>

            <style jsx>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default FlashcardViewer;
