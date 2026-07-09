import React from 'react';

const HistorySidebar = ({ isOpen, onClose, history, onLoadItem, onDeleteItem, levels }) => {
    return (
        <>
            <div className={`fixed inset-y-0 left-0 w-[85vw] sm:w-80 bg-zinc-950/90 backdrop-blur-xl border-r border-zinc-800/80 transform transition-transform duration-300 z-40 p-6 overflow-y-auto ${isOpen ? 'translate-x-0 shadow-2xl shadow-black' : '-translate-x-full'}`}>
                <div className="flex justify-between items-center mb-8 pt-12">
                    <h2 className="text-xl font-bold text-white">History</h2>
                </div>
                <div className="space-y-4">
                    {history.length === 0 ? (
                        <p className="text-sm text-zinc-500 italic">No recent explanations.</p>
                    ) : (
                        history.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => onLoadItem(item)}
                                className="group relative p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 cursor-pointer transition-all"
                            >
                                <p className="text-sm font-medium text-zinc-200 line-clamp-2 mb-2">{item.query}</p>
                                <div className="flex justify-between items-center text-xs text-zinc-500">
                                    <span>{levels[item.level].label}</span>
                                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                                </div>
                                <button
                                    onClick={(e) => onDeleteItem(e, item.id)}
                                    className="absolute top-2 right-2 p-1 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 6h18" />
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}
        </>
    );
};

export default HistorySidebar;
