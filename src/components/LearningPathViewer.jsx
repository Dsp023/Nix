import React from 'react';

const LearningPathViewer = ({ path, onSelectStep, currentTopic }) => {
    if (!path || path.length === 0) return null;

    return (
        <div className="w-full bg-zinc-950/50 border border-indigo-900/30 rounded-2xl overflow-hidden mt-8 shadow-inner relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />

            <div className="p-5 sm:p-6 border-b border-zinc-800/50 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-xl">🗺️</span>
                        Learning Path
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1">Recommended progression for "{currentTopic}"</p>
                </div>
            </div>

            <div className="p-6 relative">
                {/* Vertical Line Connection */}
                <div className="absolute left-10 top-10 bottom-10 w-px bg-zinc-800/50 group-hover:bg-indigo-900/50 transition-colors duration-500"></div>

                <div className="space-y-6">
                    {path.map((step, idx) => (
                        <div
                            key={idx}
                            onClick={() => onSelectStep(step.title)}
                            className="relative flex items-start gap-5 p-4 rounded-xl hover:bg-zinc-800/40 border border-transparent hover:border-zinc-700/50 cursor-pointer transition-all duration-200 group/step"
                        >
                            {/* Number Bubble */}
                            <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-sm font-bold text-zinc-300 group-hover/step:bg-indigo-600 group-hover/step:text-white group-hover/step:border-indigo-500 transition-colors duration-300 shadow-sm">
                                {idx + 1}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-1.5">
                                <h4 className="text-base font-semibold text-zinc-100 group-hover/step:text-indigo-300 transition-colors flex items-center gap-2">
                                    {step.title}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover/step:opacity-100 -translate-x-2 group-hover/step:translate-x-0 transition-all text-indigo-400"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                                </h4>
                                <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-zinc-900/30 border-t border-zinc-800/50 text-center">
                <p className="text-xs text-zinc-500 flex items-center justify-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                    Click on any step to instantly request a tailored explanation.
                </p>
            </div>
        </div>
    );
};

export default LearningPathViewer;
