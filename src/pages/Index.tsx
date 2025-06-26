
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import Homepage from '../components/Homepage';
import AuthForm from '../components/AuthForm';
import OnboardingFlow from '../components/OnboardingFlow';
import Dashboard from '../components/Dashboard';

const Index = () => {
  const [currentView, setCurrentView] = useState<'homepage' | 'auth' | 'onboarding' | 'dashboard'>('homepage');
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle navigation based on auth state
        if (session?.user) {
          // Check if user needs onboarding
          checkUserProfile(session.user.id);
        } else {
          setCurrentView('homepage');
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      // If no profile exists or profile is incomplete, show onboarding
      if (!profile || !profile.business_name || !profile.business_type) {
        setCurrentView('onboarding');
      } else {
        setCurrentView('dashboard');
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      setCurrentView('onboarding');
    }
  };

  const handleAuthSuccess = () => {
    // This will be handled by the auth state change listener
  };

  const handleOnboardingComplete = () => {
    setCurrentView('dashboard');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentView('homepage');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'homepage':
        return <Homepage onGetStarted={() => setCurrentView('auth')} />;
      case 'auth':
        return <AuthForm onAuthSuccess={handleAuthSuccess} />;
      case 'onboarding':
        return <OnboardingFlow onComplete={handleOnboardingComplete} />;
      case 'dashboard':
        return <Dashboard user={user} onSignOut={handleSignOut} />;
      default:
        return <Homepage onGetStarted={() => setCurrentView('auth')} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentView()}
      
      {/* Demo Navigation - Only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-900 mb-2">Demo Navigation:</p>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => setCurrentView('homepage')}
                className={`text-xs px-3 py-1 rounded ${
                  currentView === 'homepage' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Homepage
              </button>
              <button
                onClick={() => setCurrentView('auth')}
                className={`text-xs px-3 py-1 rounded ${
                  currentView === 'auth' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Auth
              </button>
              <button
                onClick={() => setCurrentView('onboarding')}
                className={`text-xs px-3 py-1 rounded ${
                  currentView === 'onboarding' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Onboarding
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`text-xs px-3 py-1 rounded ${
                  currentView === 'dashboard' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Dashboard
              </button>
              {user && (
                <button
                  onClick={handleSignOut}
                  className="text-xs px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
