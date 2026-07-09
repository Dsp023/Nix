import React, { useState, useRef, useEffect, useCallback } from 'react';
import ApiKeySettings from './ApiKeySettings';
import { callAI, callAIStream, hasApiKey, isUsingDefaultKey } from '../utils/apiService';
import FlashcardViewer from './FlashcardViewer';
import LearningPathViewer from './LearningPathViewer';
import CommandPalette from './CommandPalette';
import KeyboardShortcutsModal from './Keyboardshortcutsmodal';

// Subcomponents
import Header from './Header';
import Footer from './Footer';
import HistorySidebar from './HistorySidebar';
import InputSection from './InputSection';
import ExplanationView from './ExplanationView';
import FollowUpSection from './FollowUpSection';

const levelThemes = {
    0: { gradient: 'from-pink-500/20 via-rose-500/10 to-orange-500/20', border: 'border-pink-500/30', glow: 'shadow-pink-500/20', text: 'text-pink-400' },
    1: { gradient: 'from-sky-500/20 via-blue-500/10 to-cyan-500/20', border: 'border-sky-500/30', glow: 'shadow-sky-500/20', text: 'text-sky-400' },
    2: { gradient: 'from-zinc-500/20 via-zinc-600/10 to-zinc-400/20', border: 'border-zinc-500/30', glow: 'shadow-zinc-500/20', text: 'text-zinc-400' },
    3: { gradient: 'from-indigo-500/20 via-violet-500/10 to-purple-500/20', border: 'border-indigo-500/30', glow: 'shadow-indigo-500/20', text: 'text-indigo-400' },
    4: { gradient: 'from-emerald-500/20 via-teal-500/10 to-cyan-500/20', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20', text: 'text-emerald-400' },
};

const levels = [
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
    const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

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
            const tag = document.activeElement?.tagName?.toLowerCase();
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsCommandPaletteOpen(true);
            }
            if (e.key === '?' && tag !== 'input' && tag !== 'textarea') {
                e.preventDefault();
                setIsShortcutsOpen(prev => !prev);
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

    const handleExplain = useCallback(async () => {
        const textToExplain = textareaRef.current?.value.trim();
        if (!textToExplain) {
            setError('Please enter some text to explain.');
            return;
        }

        setIsLoading(true);
        setError('');
        setFollowUpQuestions([]);
        setFlashcards([]);
        setOutput(''); // Clear previous output for fresh streaming feel

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

        let accumulatedExplanation = '';
        try {
            await callAIStream(
                [{ role: 'user', content: textToExplain }],
                systemPrompt,
                (chunk) => {
                    accumulatedExplanation += chunk;
                    
                    // Real-time parsing of follow-up questions to hide them from display
                    const questionSeparatorIndex = accumulatedExplanation.search(/---\s*\n\*\*Want to learn more\?\*\*/i);
                    if (questionSeparatorIndex !== -1) {
                        setOutput(accumulatedExplanation.substring(0, questionSeparatorIndex).trim());
                    } else {
                        const questionDirectIndex = accumulatedExplanation.search(/\*\*Want to learn more\?\*\*/i);
                        if (questionDirectIndex !== -1) {
                            setOutput(accumulatedExplanation.substring(0, questionDirectIndex).trim());
                        } else {
                            setOutput(accumulatedExplanation);
                        }
                    }
                }
            );

            // Parse follow-up questions from completed response
            const questionMatch = accumulatedExplanation.match(/\*\*Want to learn more\?\*\*([\s\S]*?)$/i);
            if (questionMatch) {
                const questionsText = questionMatch[1];
                const questions = questionsText
                    .split(/\n/)
                    .map(q => q.replace(/^\d+\.\s*\[?|\]?$/g, '').trim())
                    .filter(q => q.length > 10);
                setFollowUpQuestions(questions.slice(0, 3));
                setOutput(accumulatedExplanation.replace(/---\s*\n\*\*Want to learn more\?\*\*[\s\S]*$/i, '').trim());
            } else {
                setOutput(accumulatedExplanation);
            }

            addToHistory(textToExplain, accumulatedExplanation, level);
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
    }, [level]);

    const handleFollowUp = (question) => {
        if (textareaRef.current) {
            textareaRef.current.value = question;
        }
        handleExplain();
    };

    const handleClear = useCallback(() => {
        if (textareaRef.current) {
            textareaRef.current.value = '';
        }
        setOutput('');
        setError('');
        setFollowUpQuestions([]);
        setFlashcards([]);
        setLearningPath([]);
    }, []);

    const handleCopyAll = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }, [output]);

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

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                handleExplain();
            }
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                if (output) handleCopyAll();
            }
            if (e.key === 'Escape') {
                handleClear();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [output, handleExplain, handleCopyAll, handleClear]);

    const handleSelectPathStep = (stepTitle) => {
        if (textareaRef.current) {
            textareaRef.current.value = stepTitle;
        }
        handleExplain();
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
        <div className="w-full max-w-4xl mx-auto space-y-8 sm:space-y-12 relative px-4 sm:px-0 pb-20 transition-all duration-500">
            {/* Dynamic Background Glow */}
            <div className={`fixed inset-0 pointer-events-none transition-colors duration-1000 bg-gradient-to-b ${theme.gradient} opacity-40 blur-3xl -z-10`} />

            <CommandPalette
                isOpen={isCommandPaletteOpen}
                onClose={() => setIsCommandPaletteOpen(false)}
                commands={commandPaletteCommands}
            />
            <KeyboardShortcutsModal
                isOpen={isShortcutsOpen}
                onClose={() => setIsShortcutsOpen(false)}
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

            {/* Keyboard Shortcuts Button */}
            <button
                onClick={() => setIsShortcutsOpen(true)}
                className="fixed right-14 top-4 z-50 p-2 text-zinc-400 hover:text-white transition-colors bg-black/50 backdrop-blur-sm rounded-lg border border-zinc-800"
                title="Keyboard Shortcuts (?)"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="M6 8h.001" /><path d="M10 8h.001" /><path d="M14 8h.001" /><path d="M18 8h.001" />
                    <path d="M8 12h.001" /><path d="M12 12h.001" /><path d="M16 12h.001" />
                    <path d="M7 16h10" />
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
            <HistorySidebar
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                history={history}
                onLoadItem={loadHistoryItem}
                onDeleteItem={deleteHistoryItem}
                levels={levels}
            />

            <Header isFocusMode={isFocusMode} />

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

                <InputSection
                    textareaRef={textareaRef}
                    level={level}
                    setLevel={setLevel}
                    isLoading={isLoading}
                    levels={levels}
                    theme={theme}
                    isFocusMode={isFocusMode}
                    isGeneratingPath={isGeneratingPath}
                    onGenerateLearningPath={handleGenerateLearningPath}
                    onExplain={handleExplain}
                    output={output}
                />

                <ExplanationView
                    output={output}
                    isLoading={isLoading}
                    levelLabel={levels[level].label}
                    theme={theme}
                    isFocusMode={isFocusMode}
                    setIsFocusMode={setIsFocusMode}
                    onCopyAll={handleCopyAll}
                    copied={copied}
                    onClear={handleClear}
                    outputRef={outputRef}
                />

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

                <FollowUpSection
                    questions={followUpQuestions}
                    isLoading={isLoading}
                    onFollowUp={handleFollowUp}
                />

                {learningPath.length > 0 && !isLoading && (
                    <LearningPathViewer
                        path={learningPath}
                        onSelectStep={handleSelectPathStep}
                        currentTopic={textareaRef.current?.value || "Topic"}
                    />
                )}
            </main>

            <Footer />
        </div>
    );
};

export default ExplainEngine;
