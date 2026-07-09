import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';

const SkeletonLoader = () => (
    <div className="space-y-6 animate-pulse p-4 sm:p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl">
        <div className="h-6 bg-zinc-800 rounded-md w-3/4"></div>
        <div className="space-y-3">
            <div className="h-4 bg-zinc-800/80 rounded w-full"></div>
            <div className="h-4 bg-zinc-800/80 rounded w-[95%]"></div>
            <div className="h-4 bg-zinc-800/80 rounded w-[90%]"></div>
            <div className="h-4 bg-zinc-800/80 rounded w-4/5"></div>
        </div>
        <div className="space-y-3 pt-4">
            <div className="h-5 bg-zinc-800 rounded-md w-1/3"></div>
            <div className="h-4 bg-zinc-800/80 rounded w-[98%]"></div>
            <div className="h-4 bg-zinc-800/80 rounded w-[92%]"></div>
        </div>
    </div>
);

const CopyButton = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`text-[10px] font-medium px-2 py-1 rounded transition-colors duration-200 uppercase tracking-wider ${copied ? 'text-green-400 bg-green-400/10' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
        >
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};

const ExplanationView = ({
    output,
    isLoading,
    levelLabel,
    theme,
    isFocusMode,
    setIsFocusMode,
    onCopyAll,
    copied,
    onClear,
    outputRef
}) => {
    if (!output && !isLoading) return null;

    return (
        <div className="mt-8 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white tracking-tight">Explanation</h3>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border bg-zinc-900/50 ${theme.border} ${theme.text} uppercase tracking-wider shadow-inner`}>
                        {levelLabel}
                    </span>
                </div>
                <div className="flex gap-2 bg-zinc-900/60 p-1 rounded-lg border border-zinc-800/80 backdrop-blur-md">
                    <button
                        onClick={() => setIsFocusMode(!isFocusMode)}
                        className={`px-3 py-1.5 text-xs font-medium transition-colors border rounded-md flex items-center gap-1.5 
                            ${isFocusMode ? `${theme.text} bg-zinc-800 shadow-inner border-zinc-700` : 'text-zinc-400 hover:text-white border-transparent hover:bg-zinc-800/50'}`}
                        title="Toggle Focus Mode"
                    >
                        {isFocusMode ? (
                            <><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" /></svg> Focus</>
                        ) : (
                            <><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8V5a2 2 0 0 1 2-2h3m13 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3m13-8v3a2 2 0 0 1-2 2h-3" /></svg> Focus</>
                        )}
                    </button>
                    <button
                        onClick={onCopyAll}
                        disabled={isLoading || !output}
                        className={`px-3 py-1.5 text-xs font-medium transition-all duration-300 border rounded-md flex items-center gap-1.5 ${copied ? 'text-green-400 border-green-700 bg-green-900/20' : 'text-zinc-400 hover:text-white border-transparent hover:bg-zinc-800/50'}`}
                        title="Ctrl+Shift+C"
                    >
                        {copied ? '✓ Copied' : '📋 Copy'}
                    </button>
                    <button
                        onClick={() => { onClear(); setIsFocusMode(false); }}
                        disabled={isLoading}
                        className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-rose-400 transition-colors border border-transparent hover:bg-zinc-800/50 rounded-md"
                        title="Escape"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {isLoading ? (
                <SkeletonLoader />
            ) : (
                <div
                    ref={outputRef}
                    id="output-display"
                    className={`markdown-content text-zinc-300 leading-relaxed text-[15px] space-y-4 border border-zinc-800/80 rounded-2xl p-5 sm:p-8 bg-zinc-950/60 backdrop-blur-md overflow-hidden shadow-2xl ${theme.border} transition-colors duration-500`}
                >
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex, rehypeRaw]}
                        components={{
                            code({ inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '')
                                const content = String(children).replace(/\n$/, '')
                                const isShort = content.length < 60 && !content.includes('\n')
                                const language = match ? match[1] : 'text'

                                if (inline || isShort) {
                                    return (
                                        <code className="bg-zinc-800/50 rounded px-1.5 py-0.5 text-sm font-mono text-zinc-300 break-words font-bold" {...props}>
                                            {children}
                                        </code>
                                    )
                                }

                                return (
                                    <div className="relative group my-6 border border-zinc-800 rounded-lg overflow-hidden">
                                        <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/80 border-b border-zinc-800">
                                            <span className="text-xs font-mono text-zinc-500 uppercase">{language}</span>
                                            <CopyButton text={content} />
                                        </div>
                                        <div className="text-sm overflow-x-auto">
                                            <SyntaxHighlighter
                                                style={atomDark}
                                                language={language}
                                                PreTag="div"
                                                customStyle={{ margin: 0, padding: '1.5rem', background: 'rgba(24, 24, 27, 0.5)' }}
                                                {...props}
                                            >
                                                {content}
                                            </SyntaxHighlighter>
                                        </div>
                                    </div>
                                )
                            },
                            table({ ...props }) {
                                return (
                                    <div className="overflow-x-auto my-6 border border-zinc-800 rounded-lg">
                                        <table className="w-full text-sm text-left border-collapse" {...props} />
                                    </div>
                                )
                            }
                        }}
                    >
                        {output
                            .replace(/\\\[/g, '$$$')
                            .replace(/\\\]/g, '$$$')
                            .replace(/\\\(/g, '$')
                            .replace(/\\\)/g, '$')
                        }
                    </ReactMarkdown>
                </div>
            )}
        </div>
    );
};

export default ExplanationView;
