import React, { useState, useEffect } from 'react';
import ExplainEngine from './components/ExplainEngine';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import { supabase } from './utils/supabaseClient';
import './index.css';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guestView, setGuestView] = useState('landing'); // 'landing' or 'auth'

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
      </div>
    );
  }

  if (!session) {
    if (guestView === 'auth') {
      return <Auth onBack={() => setGuestView('landing')} />;
    }
    return <LandingPage onGetStarted={() => setGuestView('auth')} onSignIn={() => setGuestView('auth')} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-6 sm:py-12 sm:px-6 lg:px-8">
      <ExplainEngine session={session} />
    </div>
  );
}

export default App;
