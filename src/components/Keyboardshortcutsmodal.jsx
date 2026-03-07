import React, { useEffect, useRef } from 'react';

const shortcuts = [
    {
        category: 'Core Actions',
        items: [
            { keys: ['Ctrl', 'Enter'], label: 'Explain topic' },
            { keys: ['Ctrl', 'Shift', 'C'], label: 'Copy explanation' },
            { keys: ['Escape'], label: 'Clear everything' },
        ]
    },
    {
        category: 'Navigation',
        items: [
            { keys: ['Ctrl', 'K'], label: 'Open command palette' },
            { keys: ['?'], label: 'Open this cheatsheet' },
        ]
    },
    {
        category: 'macOS Variants',
        items: [
            { keys: ['⌘', 'Enter'], label: 'Explain topic' },
            { keys: ['⌘', 'Shift', 'C'], label: 'Copy explanation' },
            { keys: ['⌘', 'K'], label: 'Open command palette' },
        ]
    }
];

const Kbd = ({ children }) => (
    <span className="inline-flex items-center justify-center min-w-[1.75rem] h-7 px-1.5 rounded-md text-[11px] font-mono font-semibold
        bg-zinc-800 text-zinc-300 border border-zinc-600 border-b-2
        shadow-[inset_0_-1px_0_rgba(0,0,0,0.4)]
        select-none leading-none">
        {children}
    </span>
);

const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
    const overlayRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    // Register '?' shortcut globally to open the modal
    useEffect(() => {
        const handleKey = (e) => {
            // Don't trigger when typing in input/textarea
            const tag = document.activeElement?.tagName?.toLowerCase();
            if (tag === 'input' || tag === 'textarea') return;
            if (e.key === '?') onClose(); // toggle handled by parent
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            onClick={(e) => e.target === overlayRef.current && onClose()}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800/80">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-zinc-800 rounded-lg border border-zinc-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300">
                                <rect width="20" height="16" x="2" y="4" rx="2" />
                                <path d="M6 8h.001" />
                                <path d="M10 8h.001" />
                                <path d="M14 8h.001" />
                                <path d="M18 8h.001" />
                                <path d="M8 12h.001" />
                                <path d="M12 12h.001" />
                                <path d="M16 12h.001" />
                                <path d="M7 16h10" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-white tracking-tight">Keyboard Shortcuts</h2>
                            <p className="text-[11px] text-zinc-500 mt-0.5">Press <Kbd>?</Kbd> anytime to toggle</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>

                {/* Shortcut Groups */}
                <div className="p-5 space-y-5">
                    {shortcuts.map((group) => (
                        <div key={group.category}>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                                {group.category}
                            </p>
                            <div className="space-y-1.5">
                                {group.items.map(({ keys, label }) => (
                                    <div
                                        key={label}
                                        className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60 hover:border-zinc-700/80 hover:bg-zinc-900 transition-colors group"
                                    >
                                        <span className="text-[13px] text-zinc-300 group-hover:text-white transition-colors">
                                            {label}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {keys.map((key, i) => (
                                                <React.Fragment key={i}>
                                                    <Kbd>{key}</Kbd>
                                                    {i < keys.length - 1 && (
                                                        <span className="text-zinc-600 text-[10px] font-mono mx-0.5">+</span>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-5 pb-5">
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/40">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 shrink-0">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4" /><path d="M12 8h.01" />
                        </svg>
                        <p className="text-[11px] text-zinc-500">
                            Shortcuts are disabled when typing in the input field.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KeyboardShortcutsModal;
