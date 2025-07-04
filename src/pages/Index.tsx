import React from 'react';
import { useAuthState } from '../hooks/useAuthState';
import { useMobile } from '../hooks/useMobile';
import LoadingSpinner from '../components/LoadingSpinner';
import ViewRenderer from '../components/ViewRenderer';
import MobileViewRenderer from '../components/MobileViewRenderer';
import DemoNavigation from '../components/DemoNavigation';

const Index = () => {
  const isMobile = useMobile();
  const {
    currentView,
    setCurrentView,
    user,
    loading,
    handleAuthSuccess,
    handleOnboardingComplete,
    handleSignOut,
  } = useAuthState();

  const [navigationView, setNavigationView] = React.useState<'homepage' | 'auth' | 'onboarding' | 'dashboard' | 'pricing' | 'help' | 'privacy' | 'terms' | 'security'>('homepage');

  // Use the auth state view if user is authenticated, otherwise use navigation view
  const activeView = user ? currentView : navigationView;

  if (loading) {
    return <LoadingSpinner />;
  }

  const handleAuthSuccessWithFlow = (isSignUp?: boolean) => {
    if (isSignUp) {
      // Sign up flow - go to onboarding
      handleAuthSuccess();
    } else {
      // Sign in flow - go directly to dashboard
      setCurrentView('dashboard');
    }
  };

  return (
    <div className="min-h-screen">
      {isMobile ? (
        <MobileViewRenderer
          currentView={activeView}
          onGetStarted={() => {
            if (user) {
              setCurrentView('auth');
            } else {
              setNavigationView('auth');
            }
          }}
          onAuthSuccess={handleAuthSuccessWithFlow}
          onOnboardingComplete={handleOnboardingComplete}
          onViewPricing={() => setNavigationView('pricing')}
          onViewHelp={() => setNavigationView('help')}
          onViewPrivacy={() => setNavigationView('privacy')}
          onViewTerms={() => setNavigationView('terms')}
          onViewSecurity={() => setNavigationView('security')}
          onBackToHome={() => setNavigationView('homepage')}
          user={user}
          onSignOut={handleSignOut}
          isMobile={isMobile}
        />
      ) : (
        <ViewRenderer
          currentView={activeView}
          onGetStarted={() => {
            if (user) {
              setCurrentView('auth');
            } else {
              setNavigationView('auth');
            }
          }}
          onAuthSuccess={handleAuthSuccessWithFlow}
          onOnboardingComplete={handleOnboardingComplete}
          onViewPricing={() => setNavigationView('pricing')}
          onViewHelp={() => setNavigationView('help')}
          onViewPrivacy={() => setNavigationView('privacy')}
          onViewTerms={() => setNavigationView('terms')}
          onViewSecurity={() => setNavigationView('security')}
          onBackToHome={() => setNavigationView('homepage')}
          user={user}
          onSignOut={handleSignOut}
        />
      )}
      
      {!isMobile && (
        <DemoNavigation
          currentView={currentView}
          setCurrentView={setCurrentView}
          user={user}
          onSignOut={handleSignOut}
        />
      )}
    </div>
  );
};

export default Index;