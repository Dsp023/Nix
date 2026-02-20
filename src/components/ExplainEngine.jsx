import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import ApiKeySettings from './ApiKeySettings';
import { callAI, hasApiKey, isUsingDefaultKey } from '../utils/apiService';
import FlashcardViewer from './FlashcardViewer';
import LearningPathViewer from './LearningPathViewer';
import CommandPalette from './CommandPalette';

const levelThemes = {
    0: { gradient: 'from-pink-500/20 via-rose-500/10 to-orange-500/20', border: 'border-pink-500/30', glow: 'shadow-pink-500/20', text: 'text-pink-400' },
    1: { gradient: 'from-sky-500/20 via-blue-500/10 to-cyan-500/20', border: 'border-sky-500/30', glow: 'shadow-sky-500/20', text: 'text-sky-400' },
    2: { gradient: 'from-zinc-500/20 via-zinc-600/10 to-zinc-400/20', border: 'border-zinc-500/30', glow: 'shadow-zinc-500/20', text: 'text-zinc-400' },
    3: { gradient: 'from-indigo-500/20 via-violet-500/10 to-purple-500/20', border: 'border-indigo-500/30', glow: 'shadow-indigo-500/20', text: 'text-indigo-400' },
    4: { gradient: 'from-emerald-500/20 via-teal-500/10 to-cyan-500/20', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20', text: 'text-emerald-400' },
};

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
            className={`
                text-[10px] font-medium px-2 py-1 rounded transition-colors duration-200 uppercase tracking-wider
                \${copied ? 'text-green-400 bg-green-400/10' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}
            `}
        >
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};


const ExplainEngine = () => {
    const [level, setLevel] = useState(2); // Default to "Detailed"
    const [isLoading, setIsLoading] = useState(false);
    const [output, setOutput] = useState('');
    const [followUpQuestions, setFollowUpQuestions] = useState([]);
    const [error, setError] = useState('');
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [copied, setCopied] = useState(false);

    // Feature States
    const [flashcards, setFlashcards] = useState([]);
    const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);
    const [learningPath, setLearningPath] = useState([]);
    const [isGeneratingPath, setIsGeneratingPath] = useState(false);

    // UI States
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

    const textareaRef = useRef(null);
    const outputRef = useRef(null);

    // Load history from local storage on mount
    useEffect(() => {
        const savedHistory = localStorage.getItem('nix_history');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, []);

    // Save history to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('nix_history', JSON.stringify(history));
    }, [history]);

    // Command Palette Keyboard Shortcut
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsCommandPaletteOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const addToHistory = (query, response, lvl) => {
        const newEntry = {
            id: Date.now(),
            query,
            response,
            level: lvl,
            timestamp: new Date().toISOString()
        };
        setHistory(prev => [newEntry, ...prev].slice(0, 10)); // Keep last 10 items
    };

    const loadHistoryItem = (item) => {
        if (textareaRef.current) {
            textareaRef.current.value = item.query;
        }
        setOutput(item.response);
        setLevel(item.level);
        setShowHistory(false);
    };

    const deleteHistoryItem = (e, id) => {
        e.stopPropagation();
        setHistory(prev => prev.filter(item => item.id !== id));
    };

    const levels = [
        // ... levels array (no change)
        {
            value: 0,
            label: "Child",
            description: "Simple words, fun analogies, and short sentences. Focus on the magic of the concept.",
            prompt: "Explain this topic as if you are teaching a 5-year-old. Use very simple words, fun analogies, and short sentences. Avoid big words completely. Focus on the 'magic' or 'story' of the concept."
        },
        {
            value: 1,
            label: "Simple",
            description: "Clear and simple explanation for a general audience using everyday examples.",
            prompt: "Explain this clearly and simply, suitable for a general audience. Avoid jargon where possible, or clearly explain it if necessary. Use everyday examples to make the concept relatable and easy to grasp."
        },
        {
            value: 2,
            label: "Detailed",
            description: "Comprehensive breakdown with clear headings, bullet points, and practical examples.",
            prompt: "Provide a comprehensive and structured explanation. Break down the concept into key components using clear headings, bullet points, and practical examples. Cover the 'what', 'why', and 'how' in depth."
        },
        {
            value: 3,
            label: "Academic",
            description: "Rigorous explanation with precise terminology, definitions, and theoretical context.",
            prompt: "Provide a rigorous academic explanation suitable for an undergraduate student. Use precise terminology, define key concepts formally, and discuss theoretical underpinnings. Use LaTeX math equations ($...$) for all mathematical expressions and provide derivations where relevant."
        },
        {
            value: 4,
            label: "Expert",
            description: "Highly technical analysis suitable for professionals, covering edge cases and advanced theory.",
            prompt: "Provide a highly technical, expert-level analysis suitable for a PhD researcher or industry professional. deep dive into nuances, edge cases, and advanced theoretical frameworks. particular focus on mathematical rigor using LaTeX ($...$), state-of-the-art context, and complex relationships within the topic."
        }
    ];

    const handleExplain = async () => {
        const textToExplain = textareaRef.current?.value.trim();
        if (!textToExplain) {
            setError('Please enter some text to explain.');
            return;
        }

        setIsLoading(true);
        setError('');
        setFollowUpQuestions([]);
        setFlashcards([]);
        // We do NOT clear the learning path, so they can keep following the roadmap

        const systemPrompt = `You are a helpful AI assistant that explains complex topics in simple terms. ${levels[level].prompt} 
                            
            **FORMATTING RULES:**
            1. **Markdown**: Use standard Markdown formatting.
            2. **Math**: STRICTLY use '$' for inline math (e.g. $E=mc^2$) and '$$' for block math (e.g. $$a^2+b^2=c^2$$). Do NOT use \\( \\) or \\[ \\].
            3. **Emphasis**: Use **bold** for technical terms, variable names in text, and key concepts. Do NOT use inline code ticks (\`) for single words or short terms. Only use code ticks for actual code syntax or file paths.
            4. **Tables**: Create clear, structured Markdown tables where appropriate. Use **bold** for headers and key terms within cells.
            
            **IMPORTANT**: At the END of your explanation, suggest 3 follow-up questions the user might want to explore. Format them EXACTLY like this:
            
            ---
            **Want to learn more?**
            1. [First follow-up question]
            2. [Second follow-up question]
            3. [Third follow-up question]`;

        try {
            const explanation = await callAI(
                [{ role: 'user', content: textToExplain }],
                systemPrompt
            );

            // Parse follow-up questions from response
            const questionMatch = explanation.match(/\*\*Want to learn more\?\*\*([\s\S]*?)$/i);
            if (questionMatch) {
                const questionsText = questionMatch[1];
                const questions = questionsText
                    .split(/\n/)
                    .map(q => q.replace(/^\d+\.\s*\[?|\]?$/g, '').trim())
                    .filter(q => q.length > 10);
                setFollowUpQuestions(questions.slice(0, 3));
                // Remove the follow-up section from main output
                setOutput(explanation.replace(/---\s*\n\*\*Want to learn more\?\*\*[\s\S]*$/i, '').trim());
            } else {
                setOutput(explanation);
            }

            addToHistory(textToExplain, explanation, level);
        } catch (err) {
            console.error('Error:', err);
            if (err.message === 'NO_API_KEY') {
                setError('NO_API_KEY');
            } else {
                setError(`Error: ${err.message}. Please try again.`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Handle follow-up question click
    const handleFollowUp = (question) => {
        if (textareaRef.current) {
            textareaRef.current.value = question;
        }
        handleExplain();
    };

    const handleClear = () => {
        if (textareaRef.current) {
            textareaRef.current.value = '';
        }
        setOutput('');
        setError('');
        setFollowUpQuestions([]);
        setFlashcards([]);
        setLearningPath([]);
    };

    const handleGenerateFlashcards = async () => {
        if (!output) return;
        setIsGeneratingFlashcards(true);
        setError('');

        const systemPrompt = `You are an expert AI tutor. Extract the 5 most important core concepts from the user's text and convert them into flashcards. 
        
        **FORMAT RULES:**
        Return strictly a valid JSON array matching this format:
        [{"q": "Question here?", "a": "Answer here"}]
        
        Do NOT wrap the JSON in markdown code blocks (\`\`\`json). Do NOT add ANY conversational text. Return ONLY the JSON array.`;

        try {
            const result = await callAI([{ role: 'user', content: output }], systemPrompt);
            try {
                const cleanedResult = result.replace(/```json/i, '').replace(/```/g, '').trim();
                const cards = JSON.parse(cleanedResult);
                setFlashcards(cards);
            } catch (e) {
                console.error('Failed to parse flashcards JSON', e);
                setError('Failed to generate flashcards. AI returned invalid format.');
            }
        } catch (err) {
            setError(`Error: ${err.message}`);
        } finally {
            setIsGeneratingFlashcards(false);
        }
    };

    const handleGenerateLearningPath = async () => {
        const textToExplain = textareaRef.current?.value.trim() || output;
        if (!textToExplain) {
            setError('Please enter a topic first.');
            return;
        }

        setIsGeneratingPath(true);
        setError('');

        const systemPrompt = `You are an expert AI tutor creating learning roadmaps. 
        Create a 5-step logical learning path based on the user's topic. Determine what prerequisites they need or what logical sequence of concepts follows.
        Adapt the text complexity to this level: "${levels[level].label}".
        
        **FORMAT RULES:**
        Return strictly a valid JSON array matching this format:
        [{"title": "Topic Name", "description": "Short explanation of what is learned here"}]
        
        Do NOT wrap the JSON in markdown code blocks (\`\`\`json). Do NOT add ANY conversational text. Return ONLY the JSON array.`;

        try {
            const result = await callAI([{ role: 'user', content: textToExplain }], systemPrompt);
            try {
                const cleanedResult = result.replace(/```json/i, '').replace(/```/g, '').trim();
                const path = JSON.parse(cleanedResult);
                setLearningPath(path);
            } catch (e) {
                console.error('Failed to parse learning path JSON', e);
                setError('Failed to generate learning path. AI returned invalid format.');
            }
        } catch (err) {
            setError(`Error: ${err.message}`);
        } finally {
            setIsGeneratingPath(false);
        }
    };

    // One-Click Copy entire explanation
    const handleCopyAll = async () => {
        try {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl/Cmd + Enter = Explain
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                handleExplain();
            }
            // Ctrl/Cmd + Shift + C = Copy All
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                if (output) handleCopyAll();
            }
            // Escape = Clear
            if (e.key === 'Escape') {
                handleClear();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [output]);

    const handleSelectPathStep = (stepTitle) => {
        if (textareaRef.current) {
            textareaRef.current.value = stepTitle;
        }
        handleExplain();
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const commandPaletteCommands = [
        { label: 'Set Level: Child', description: 'Simple words, fun analogies (Level 0)', action: () => setLevel(0) },
        { label: 'Set Level: Simple', description: 'Clear and simple explanation (Level 1)', action: () => setLevel(1) },
        { label: 'Set Level: Detailed', description: 'Comprehensive breakdown (Level 2)', action: () => setLevel(2) },
        { label: 'Set Level: Academic', description: 'Rigorous explanation (Level 3)', action: () => setLevel(3) },
        { label: 'Set Level: Expert', description: 'Highly technical analysis (Level 4)', action: () => setLevel(4) },
        { label: 'Toggle History', description: 'Show or hide past explanations', action: () => setShowHistory(prev => !prev) },
        { label: 'Clear Input', description: 'Erase current text and output', action: () => handleClear() },
        { label: 'API Settings', description: 'Manage your API keys', action: () => setShowSettings(true) },
        ...(output ? [
            { label: 'Generate Flashcards', description: 'Create study cards from current explanation', action: handleGenerateFlashcards },
            { label: 'Toggle Focus Mode', description: 'Hide UI for distraction-free reading', action: () => setIsFocusMode(prev => !prev) }
        ] : []),
        ...(textareaRef.current?.value || output ? [
            { label: 'Generate Learning Path', description: 'Create a 5-step roadmap for this topic', action: handleGenerateLearningPath }
        ] : [])
    ];

    const theme = levelThemes[level] || levelThemes[2];

    return (
        <div className={`w-full max-w-4xl mx-auto space-y-8 sm:space-y-12 relative px-4 sm:px-0 pb-20 transition-all duration-500`}>
            {/* Dynamic Background Glow */}
            <div className={`fixed inset-0 pointer-events-none transition-colors duration-1000 bg-gradient-to-b ${theme.gradient} opacity-40 blur-3xl -z-10`} />

            <CommandPalette
                isOpen={isCommandPaletteOpen}
                onClose={() => setIsCommandPaletteOpen(false)}
                commands={commandPaletteCommands}
            />
            {flashcards.length > 0 && (
                <FlashcardViewer
                    cards={flashcards}
                    onClose={() => setFlashcards([])}
                />
            )}

            {/* History Sidebar Toggle */}
            <button
                onClick={() => setShowHistory(!showHistory)}
                className="fixed left-4 top-4 z-50 p-2 text-zinc-400 hover:text-white transition-colors bg-black/50 backdrop-blur-sm rounded-lg border border-zinc-800"
                title="History"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v5h5" />
                    <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
                </svg>
            </button>

            {/* Settings Button */}
            <button
                onClick={() => setShowSettings(true)}
                className="fixed right-4 top-4 z-50 p-2 text-zinc-400 hover:text-white transition-colors bg-black/50 backdrop-blur-sm rounded-lg border border-zinc-800"
                title="API Settings"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            </button>

            {/* API Settings Modal */}
            <ApiKeySettings isOpen={showSettings} onClose={() => setShowSettings(false)} />

            {/* History Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-[85vw] sm:w-80 bg-zinc-950/90 backdrop-blur-xl border-r border-zinc-800/80 transform transition-transform duration-300 z-40 p-6 overflow-y-auto ${showHistory ? 'translate-x-0 shadow-2xl shadow-black' : '-translate-x-full'}`}>
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
                                onClick={() => loadHistoryItem(item)}
                                className="group relative p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 cursor-pointer transition-all"
                            >
                                <p className="text-sm font-medium text-zinc-200 line-clamp-2 mb-2">{item.query}</p>
                                <div className="flex justify-between items-center text-xs text-zinc-500">
                                    <span>{levels[item.level].label}</span>
                                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                                </div>
                                <button
                                    onClick={(e) => deleteHistoryItem(e, item.id)}
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

            {/* Overlay for mobile/desktop to close sidebar */}
            {showHistory && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 backdrop-blur-sm transition-opacity"
                    onClick={() => setShowHistory(false)}
                />
            )}

            {!isFocusMode && (
                <header className="text-center space-y-2 pt-8 animate-in fade-in slide-in-from-top-4 duration-700">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Nix</h1>
                    <p className="text-lg text-muted-foreground">Adaptive explanation engine for complex topics.</p>
                    {isUsingDefaultKey() && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-900/30 border border-emerald-700/50 rounded-full text-xs">
                            <span className="text-emerald-400">✓ Using built-in Groq API</span>
                        </div>
                    )}
                </header>
            )}

            <main className={`space-y-8 transition-all duration-500 ${isFocusMode ? 'pt-12' : ''}`}>
                {/* API Key Required Prompt */}
                {!hasApiKey() && (
                    <div className="p-5 bg-blue-900/20 border border-blue-700/50 rounded-xl">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                                    <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-blue-200 font-semibold mb-1">API Key Required</h4>
                                <p className="text-blue-200/70 text-sm mb-3">Add your free API key from Groq, Gemini, or OpenAI to start using Nix.</p>
                                <button
                                    onClick={() => setShowSettings(true)}
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-colors"
                                >
                                    Add API Key
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {error && error !== 'NO_API_KEY' && (
                    <div className="p-4 bg-red-900/20 border border-red-900/50 text-red-200 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {!isFocusMode && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 delay-150 fill-mode-both">
                        <div className="space-y-4">
                            <textarea
                                ref={textareaRef}
                                id="text-input"
                                className={`w-full bg-zinc-950/50 backdrop-blur-sm text-foreground border border-zinc-800 rounded-xl p-5 text-base focus:ring-1 outline-none transition-all placeholder:text-muted-foreground/50 h-36 resize-y shadow-inner focus:border-zinc-500`}
                                placeholder="What do you want to learn today?"
                                disabled={isLoading}
                            ></textarea>
                        </div>

                        <div className="space-y-3 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/80 backdrop-blur-md">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block flex items-center justify-between">
                                <span>Complexity Level</span>
                                <span className={`font-bold transition-colors duration-300 ${theme.text}`}>{levels[level].label}</span>
                            </label>

                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                {levels.map((lvl) => (
                                    <button
                                        key={lvl.value}
                                        onClick={() => setLevel(lvl.value)}
                                        disabled={isLoading}
                                        className={[
                                            'py-2.5 px-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300',
                                            level === lvl.value
                                                ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700'
                                                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 bg-zinc-900/50',
                                            'disabled:opacity-50 disabled:cursor-not-allowed'
                                        ].join(' ')}
                                    >
                                        <div className="flex flex-col items-center gap-1">
                                            <span>{lvl.label}</span>
                                            {level === lvl.value && <div className={`w-4 h-0.5 rounded-full ${theme.border} border-t-2 opacity-80 shadow-[0_0_8px_currentColor]`} />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground/70 min-h-[1.25rem] text-center italic pt-1">
                                {levels[level].description}
                            </p>
                        </div>
                    </div>
                )}

                {!isFocusMode && (
                    <div className="flex justify-between items-center flex-wrap gap-4 pt-2">
                        <button
                            onClick={handleGenerateLearningPath}
                            disabled={isLoading || isGeneratingPath || (!textareaRef.current?.value && !output)}
                            className={`py-2.5 px-6 rounded-full text-sm font-semibold transition-all duration-200 border border-zinc-700/50 hover:bg-zinc-800/50 text-zinc-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:text-white backdrop-blur-sm`}
                        >
                            {isGeneratingPath ? 'Generating...' : '🗺️ Learning Path'}
                        </button>
                        <button
                            id="explain-button"
                            onClick={handleExplain}
                            disabled={isLoading}
                            className={`py-2.5 px-8 rounded-full text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white shadow-lg active:scale-[0.98]
                                ${isLoading
                                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                    : 'bg-white text-black hover:bg-zinc-200 hover:shadow-xl hover:shadow-white/10'}`}
                        >
                            {isLoading ? 'Thinking...' : 'Explain'}
                        </button>
                    </div>
                )}

                {(output || isLoading) && (
                    <div className="mt-8 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-white tracking-tight">Explanation</h3>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border bg-zinc-900/50 ${theme.border} ${theme.text} uppercase tracking-wider shadow-inner`}>
                                    {levels[level].label}
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
                                    onClick={handleCopyAll}
                                    disabled={isLoading || !output}
                                    className={`px-3 py-1.5 text-xs font-medium transition-all duration-300 border rounded-md flex items-center gap-1.5 ${copied ? 'text-green-400 border-green-700 bg-green-900/20' : 'text-zinc-400 hover:text-white border-transparent hover:bg-zinc-800/50'}`}
                                    title="Ctrl+Shift+C"
                                >
                                    {copied ? '✓ Copied' : '📋 Copy'}
                                </button>
                                <button
                                    onClick={() => { handleClear(); setIsFocusMode(false); }}
                                    disabled={isLoading}
                                    className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-rose-400 transition-colors border border-transparent hover:bg-zinc-800/50 rounded-md"
                                    title="Escape"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        {/* Output Container with Border and Overflow Handling */}
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
                                        code({ node, inline, className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || '')
                                            const content = String(children).replace(/\n$/, '')
                                            const isShort = content.length < 60 && !content.includes('\n')
                                            const language = match ? match[1] : 'text'

                                            // Inline or short content
                                            if (inline || isShort) {
                                                return (
                                                    <code className="bg-zinc-800/50 rounded px-1.5 py-0.5 text-sm font-mono text-zinc-300 break-words font-bold" {...props}>
                                                        {children}
                                                    </code>
                                                )
                                            }

                                            // Block content with syntax highlighting and copy button
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
                                        table({ node, ...props }) {
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

                        {/* Interactive Tools */}
                        {!isLoading && output && (
                            <div className="mt-6 flex flex-wrap gap-3">
                                <button
                                    onClick={handleGenerateFlashcards}
                                    disabled={isGeneratingFlashcards}
                                    className="px-4 py-2 text-sm font-semibold text-emerald-400 bg-emerald-950/30 hover:bg-emerald-900/50 border border-emerald-900/50 rounded-lg shadow-sm transition-all duration-200 flex items-center gap-2 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isGeneratingFlashcards ? '⏳ Generating cards...' : '🧠 Make Flashcards'}
                                </button>
                            </div>
                        )}

                        {/* Follow-up Questions */}
                        {followUpQuestions.length > 0 && !isLoading && (
                            <div className="mt-6 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                                <h4 className="text-sm font-medium text-zinc-400 mb-3">🧩 Want to learn more?</h4>
                                <div className="flex flex-wrap gap-2">
                                    {followUpQuestions.map((question, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleFollowUp(question)}
                                            className="px-3 py-2 text-sm text-left text-zinc-300 bg-zinc-800/50 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-500 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Learning Path Output */}
                        {learningPath.length > 0 && !isLoading && (
                            <LearningPathViewer
                                path={learningPath}
                                onSelectStep={handleSelectPathStep}
                                currentTopic={textareaRef.current?.value || "Topic"}
                            />
                        )}
                    </div>
                )}
            </main>

            <footer className="text-center pt-12 pb-8 text-xs text-zinc-600 flex items-center justify-center gap-2">
                <span>Created by Nakka Devi Sri Prasad</span>
                <a href="https://github.com/Dsp023/Nix" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors" aria-label="GitHub Profile">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                </a>
            </footer>
        </div>
    );
}

export default ExplainEngine;
