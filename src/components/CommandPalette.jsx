import React, { useState, useEffect, useRef } from 'react';

const CommandPalette = ({ isOpen, onClose, commands }) => {
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);

    // Filter commands based on search
    const filteredCommands = commands.filter(cmd =>
        cmd.label.toLowerCase().includes(search.toLowerCase()) ||
        cmd.description?.toLowerCase().includes(search.toLowerCase())
    );

    // Reset selection when search changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [search]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 50);
            setSearch('');
        }
    }, [isOpen]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    filteredCommands[selectedIndex].action();
                    onClose();
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filteredCommands, selectedIndex, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="flex items-center px-4 py-3 border-b border-zinc-800">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 mr-3"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input
                        ref={inputRef}
                        type="text"
                        className="flex-1 bg-transparent text-white outline-none placeholder:text-zinc-500 text-base"
                        placeholder="Type a command or search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-zinc-500 bg-zinc-900 border border-zinc-800 rounded">ESC</kbd>
                </div>

                {/* Command List */}
                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {filteredCommands.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-zinc-500">
                            No commands found.
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {/* Grouping can be added here if commands have 'groups' */}
                            <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                Suggestions
                            </div>
                            {filteredCommands.map((cmd, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => { cmd.action(); onClose(); }}
                                    className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-left transition-colors duration-150
                                        ${idx === selectedIndex ? 'bg-indigo-600/20 text-white' : 'text-zinc-300 hover:bg-zinc-800/50'}`}
                                    onMouseEnter={() => setSelectedIndex(idx)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-md ${idx === selectedIndex ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-800 text-zinc-400'}`}>
                                            {cmd.icon || <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>}
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">{cmd.label}</div>
                                            {cmd.description && <div className="text-xs text-zinc-500 mt-0.5">{cmd.description}</div>}
                                        </div>
                                    </div>
                                    {cmd.shortcut && (
                                        <div className="flex items-center gap-1 opacity-60">
                                            {cmd.shortcut.map(key => (
                                                <kbd key={key} className="px-2 py-1 text-[10px] font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 rounded">{key}</kbd>
                                            ))}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
