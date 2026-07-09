import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const Auth = ({ onBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            if (isSignUp) {
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (signUpError) throw signUpError;
                setMessage('Check your email for the confirmation link!');
            } else {
                const { data, error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;
            }
        } catch (err) {
            setError(err.message || 'An error occurred during authentication.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 relative bg-zinc-950 text-white overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-indigo-500/10 via-zinc-950 to-zinc-950 opacity-40 blur-3xl -z-10" />

            <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">Nix</h1>
                    <p className="text-sm text-zinc-400">
                        {isSignUp ? 'Create your account' : 'Sign in to your account'}
                    </p>
                </div>

                {error && (
                    <div className="p-3 bg-red-900/30 border border-red-800/50 text-red-300 rounded-lg text-xs text-center">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="p-3 bg-emerald-900/30 border border-emerald-800/50 text-emerald-300 rounded-lg text-xs text-center">
                        {message}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 transition-all placeholder:text-zinc-600"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 transition-all placeholder:text-zinc-600"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 text-sm shadow-md"
                    >
                        {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                <div className="text-center pt-2 flex flex-col gap-2">
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError('');
                            setMessage('');
                        }}
                        className="text-xs text-zinc-400 hover:text-white transition-colors"
                    >
                        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                    </button>
                    {onBack && (
                        <button
                            type="button"
                            onClick={onBack}
                            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors mt-2"
                        >
                            ← Back to Home
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;
