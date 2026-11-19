import React from 'react';

const HistorySidebar = ({ isOpen, onClose, history, onLoadItem, onDeleteItem, onClearAll, levels }) => {
    return (
        <>
            <div className={`fixed inset-y-0 left-0 w-[85vw] sm:w-80 bg-zinc-950/95 backdrop-blur-2xl border-r border-zinc-800/80 transform transition-transform duration-300 z-50 p-6 flex flex-col justify-between overflow-hidden shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Header */}
                <div>
                    <div className="flex justify-between items-center mb-6 pt-2 pb-4 border-b border-zinc-800/80">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
                                <path d="M3 3v5h5" />
                                <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
                            </svg>
                            <h2 className="text-lg font-bold text-white tracking-tight">History</h2>
                            {history.length > 0 && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                                    {history.length}
                                </span>
                            )}
                        </div>

                        <button
                            onClick={onClose}
                            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                            title="Close sidebar"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* History Items List */}
                    <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
                        {history.length === 0 ? (
                            <div className="text-center py-12 px-4 space-y-3">
                                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 14 14" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-zinc-400">No explanations yet</p>
                                <p className="text-xs text-zinc-600">Past searches and explanations will appear here.</p>
                            </div>
                        ) : (
                            history.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => onLoadItem(item)}
                                    className="group relative p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-800/60 hover:border-zinc-700/80 cursor-pointer transition-all shadow-sm"
                                >
                                    <p className="text-sm font-medium text-zinc-200 line-clamp-2 mb-2 pr-6">{item.query}</p>
                                    <div className="flex justify-between items-center text-xs text-zinc-500">
                                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
                                            {levels[item.level]?.label || 'Detailed'}
                                        </span>
                                        <span className="text-[10px]">{new Date(item.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <button
                                        onClick={(e) => onDeleteItem(e, item.id)}
                                        className="absolute top-3 right-3 p-1 text-zinc-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity rounded hover:bg-zinc-800"
                                        title="Delete this entry"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

                {/* Footer of Sidebar */}
                {history.length > 0 && onClearAll && (
                    <div className="pt-4 border-t border-zinc-800/80">
                        <button
                            onClick={onClearAll}
                            className="w-full py-2 px-3 text-xs text-zinc-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors border border-transparent hover:border-rose-900/30"
                        >
                            Clear All History
                        </button>
                    </div>
                )}
            </div>

            {/* Backdrop Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}
        </>
    );
};

export default HistorySidebar;
