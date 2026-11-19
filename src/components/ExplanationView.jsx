import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import { exportExplanationToPDF } from '../utils/pdfGenerator';

const SkeletonLoader = () => (
    <div className="space-y-6 animate-pulse p-6 bg-zinc-950/40 border border-zinc-800/80 rounded-2xl">
        <div className="h-6 bg-zinc-800/80 rounded-lg w-2/5"></div>
        <div className="space-y-3 pt-2">
            <div className="h-4 bg-zinc-800/60 rounded-md w-full"></div>
            <div className="h-4 bg-zinc-800/60 rounded-md w-[94%]"></div>
            <div className="h-4 bg-zinc-800/60 rounded-md w-[88%]"></div>
            <div className="h-4 bg-zinc-800/60 rounded-md w-4/5"></div>
        </div>
        <div className="space-y-3 pt-4">
            <div className="h-5 bg-zinc-800/70 rounded-md w-1/3"></div>
            <div className="h-4 bg-zinc-800/50 rounded-md w-[96%]"></div>
            <div className="h-4 bg-zinc-800/50 rounded-md w-[90%]"></div>
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
            className={`text-[10px] font-mono px-2 py-1 rounded transition-colors duration-200 uppercase tracking-wider cursor-pointer ${copied ? 'text-emerald-400 bg-emerald-950/50 border border-emerald-800/50' : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800'}`}
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
    outputRef,
    topic
}) => {
    const [isExportingPDF, setIsExportingPDF] = useState(false);

    if (!output && !isLoading) return null;

    const wordCount = output ? output.trim().split(/\s+/).filter(Boolean).length : 0;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const handleExportPDF = async () => {
        if (!outputRef.current || isExportingPDF) return;
        setIsExportingPDF(true);
        try {
            await exportExplanationToPDF(outputRef.current, topic || 'Explanation');
        } catch (err) {
            console.error('Failed to export PDF:', err);
        } finally {
            setIsExportingPDF(false);
        }
    };

    return (
        <div className="mt-8 pt-2 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header controls bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-xl font-bold text-white tracking-tight">Explanation</h3>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border bg-zinc-900/60 ${theme.border} ${theme.text} uppercase tracking-wider shadow-inner`}>
                        {levelLabel}
                    </span>
                    {wordCount > 0 && !isLoading && (
                        <span className="text-[11px] font-mono text-zinc-500 bg-zinc-900/60 px-2.5 py-1 rounded-full border border-zinc-800/80">
                            ⏱ ~{readingTime} min read · {wordCount} words
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-auto bg-zinc-900/70 p-1 rounded-xl border border-zinc-800/80 backdrop-blur-md shadow-sm">
                    <button
                        onClick={() => setIsFocusMode(!isFocusMode)}
                        className={`px-3 py-1.5 text-xs font-medium transition-colors rounded-lg flex items-center gap-1.5 cursor-pointer
                            ${isFocusMode ? `${theme.text} bg-zinc-800 shadow-inner border border-zinc-700` : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'}`}
                        title="Toggle Focus Mode"
                    >
                        {isFocusMode ? (
                            <><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" /></svg> Exit Focus</>
                        ) : (
                            <><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8V5a2 2 0 0 1 2-2h3m13 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3m13-8v3a2 2 0 0 1-2 2h-3" /></svg> Focus</>
                        )}
                    </button>
                    <button
                        onClick={handleExportPDF}
                        disabled={isLoading || !output || isExportingPDF}
                        className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                        title="Export explanation as styled PDF"
                    >
                        <span>{isExportingPDF ? 'Exporting...' : '📄 PDF'}</span>
                    </button>
                    <button
                        onClick={onCopyAll}
                        disabled={isLoading || !output}
                        className={`px-3 py-1.5 text-xs font-medium transition-all duration-300 rounded-lg flex items-center gap-1.5 cursor-pointer ${copied ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/60' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'}`}
                        title="Copy Markdown (Ctrl+Shift+C)"
                    >
                        {copied ? '✓ Copied' : '📋 Copy'}
                    </button>
                    <button
                        onClick={() => { onClear(); setIsFocusMode(false); }}
                        disabled={isLoading}
                        className="px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
                        title="Clear output (Esc)"
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
                    className={`markdown-content text-zinc-300 leading-relaxed text-[15px] space-y-4 border border-zinc-800/80 rounded-2xl p-6 sm:p-9 bg-zinc-950/70 backdrop-blur-md overflow-hidden shadow-2xl ${theme.border} transition-colors duration-500`}
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
                                        <code className="bg-zinc-800/60 border border-zinc-700/50 rounded-md px-1.5 py-0.5 text-sm font-mono text-zinc-200 break-words font-semibold" {...props}>
                                            {children}
                                        </code>
                                    )
                                }

                                return (
                                    <div className="relative group my-6 border border-zinc-800 rounded-xl overflow-hidden shadow-lg">
                                        <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/90 border-b border-zinc-800">
                                            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">{language}</span>
                                            <CopyButton text={content} />
                                        </div>
                                        <div className="text-sm overflow-x-auto">
                                            <SyntaxHighlighter
                                                style={atomDark}
                                                language={language}
                                                PreTag="div"
                                                customStyle={{ margin: 0, padding: '1.25rem', background: 'rgba(18, 18, 22, 0.7)' }}
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
                                    <div className="overflow-x-auto my-6 border border-zinc-800/80 rounded-xl shadow-md">
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
