
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export const useAuthState = () => {
  const [currentView, setCurrentView] = useState<'homepage' | 'auth' | 'onboarding' | 'dashboard'>('homepage');
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configure Supabase client for proper session handling
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkUserProfile(session.user.id);
      } else {
        setCurrentView('homepage');
      }
      setLoading(false);
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle navigation based on auth state
        if (session?.user) {
          // Check if user needs onboarding
          setTimeout(() => {
            checkUserProfile(session.user.id);
          }, 0);
        } else {
          setCurrentView('homepage');
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkUserProfile = async (userId: string) => {
    try {
      console.log('Checking user profile for:', userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        setCurrentView('onboarding');
        return;
      }

      // If no profile exists or profile is incomplete, show onboarding
      if (!profile || !profile.business_name) {
        console.log('Profile incomplete, showing onboarding');
        setCurrentView('onboarding');
      } else {
        console.log('Profile complete, showing dashboard');
        setCurrentView('dashboard');
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      setCurrentView('onboarding');
    }
  };

  const handleAuthSuccess = () => {
    console.log('Auth success - will be handled by auth state change listener');
  };

  const handleOnboardingComplete = () => {
    setCurrentView('dashboard');
  };

  const handleSignOut = async () => {
    try {
      console.log('Signing out...');
      
      // Clear any cached data
      setUser(null);
      setSession(null);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('Error signing out:', error);
      }
      
      // Force navigation to homepage
      setCurrentView('homepage');
      
      // Optionally reload the page for a clean state
      // window.location.href = '/';
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      // Force navigation even if there's an error
      setCurrentView('homepage');
    }
  };

  return {
    currentView,
    setCurrentView,
    user,
    session,
    loading,
    handleAuthSuccess,
    handleOnboardingComplete,
    handleSignOut,
  };
};
