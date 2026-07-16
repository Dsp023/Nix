import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        "Supabase credentials are missing! Please ensure you have set the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables in your deployment dashboard."
    );
    
    // Create a mock object to prevent the application from crashing on load
    supabaseInstance = {
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            signInWithPassword: async () => { 
                throw new Error("Supabase is not configured. Please set the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables in your hosting settings."); 
            },
            signUp: async () => { 
                throw new Error("Supabase is not configured. Please set the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables in your hosting settings."); 
            },
            signOut: async () => { 
                throw new Error("Supabase is not configured. Please set the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables in your hosting settings."); 
            },
        },
        from: () => ({
            select: () => ({
                eq: () => ({
                    order: () => ({
                        limit: () => Promise.resolve({ data: null, error: new Error("Supabase is not configured.") })
                    })
                })
            }),
            insert: () => ({
                select: () => Promise.resolve({ data: null, error: new Error("Supabase is not configured.") })
            }),
            delete: () => ({
                eq: () => ({
                    eq: () => Promise.resolve({ data: null, error: new Error("Supabase is not configured.") })
                })
            })
        })
    };
} else {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabaseInstance as supabase };

