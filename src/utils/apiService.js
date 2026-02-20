/**
 * API Service for Nix - Handles multi-provider AI calls
 * Built-in Groq API key works by default, users can add their own key for other providers
 */

const STORAGE_KEYS = {
    USER_API_KEY: 'nix_user_api_key',
    PROVIDER: 'nix_provider'
};

// Built-in default API key (from .env for local dev, works on deployed version)
const DEFAULT_GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY || 'gsk_YOUR_GROQ_API_KEY_HERE';

// Provider configurations
const PROVIDERS = {
    groq: {
        name: 'Groq',
        endpoint: 'https://api.groq.com/openai/v1/chat/completions',
        defaultModel: 'llama-3.3-70b-versatile',
        keyPrefix: 'gsk_',
        getKeyUrl: 'https://console.groq.com/keys'
    },
    gemini: {
        name: 'Google Gemini',
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
        defaultModel: 'gemini-2.0-flash',
        keyPrefix: 'AIza',
        getKeyUrl: 'https://aistudio.google.com/apikey'
    },
    openai: {
        name: 'OpenAI',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        defaultModel: 'gpt-4o-mini',
        keyPrefix: 'sk-',
        getKeyUrl: 'https://platform.openai.com/api-keys'
    }
};

// API Key management
export const getUserApiKey = () => {
    return localStorage.getItem(STORAGE_KEYS.USER_API_KEY) || '';
};

export const setUserApiKey = (key) => {
    if (key) {
        localStorage.setItem(STORAGE_KEYS.USER_API_KEY, key);
    } else {
        localStorage.removeItem(STORAGE_KEYS.USER_API_KEY);
    }
};

export const getProvider = () => {
    return localStorage.getItem(STORAGE_KEYS.PROVIDER) || 'groq';
};

export const setProvider = (provider) => {
    localStorage.setItem(STORAGE_KEYS.PROVIDER, provider);
};

export const hasApiKey = () => {
    return !!getUserApiKey() || !!DEFAULT_GROQ_KEY;
};

export const isUsingDefaultKey = () => {
    return !getUserApiKey() && !!DEFAULT_GROQ_KEY;
};

export const getProviders = () => PROVIDERS;

// Unified AI caller
export const callAI = async (messages, systemPrompt) => {
    const userKey = getUserApiKey();
    const provider = getProvider();

    // Use user's key if set, otherwise fall back to built-in Groq key
    const apiKey = userKey || DEFAULT_GROQ_KEY;
    const effectiveProvider = userKey ? provider : 'groq'; // Default key only works with Groq

    if (!apiKey) {
        throw new Error('NO_API_KEY');
    }

    let response;

    if (effectiveProvider === 'gemini') {
        response = await callGemini(apiKey, messages, systemPrompt);
    } else {
        // OpenAI-compatible format (Groq, OpenAI)
        const endpoint = PROVIDERS[effectiveProvider].endpoint;
        const model = PROVIDERS[effectiveProvider].defaultModel;
        response = await callOpenAICompatible(endpoint, apiKey, model, messages, systemPrompt);
    }

    return response;
};

const callOpenAICompatible = async (endpoint, apiKey, model, messages, systemPrompt) => {
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model,
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 4096
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'No response generated.';
};

const callGemini = async (apiKey, messages, systemPrompt) => {
    const model = PROVIDERS.gemini.defaultModel;
    const endpoint = PROVIDERS.gemini.endpoint.replace('{model}', model) + `?key=${apiKey}`;

    // Convert messages to Gemini format
    const contents = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
    }));

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents,
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 4096
            }
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
};
