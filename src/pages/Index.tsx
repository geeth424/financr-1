
import React from 'react';
import { useAuthState } from '../hooks/useAuthState';
import LoadingSpinner from '../components/LoadingSpinner';
import ViewRenderer from '../components/ViewRenderer';
import DemoNavigation from '../components/DemoNavigation';

const Index = () => {
  const {
    currentView,
    setCurrentView,
    user,
    loading,
    handleAuthSuccess,
    handleOnboardingComplete,
    handleSignOut,
  } = useAuthState();

  const [navigationView, setNavigationView] = React.useState<'homepage' | 'auth' | 'onboarding' | 'dashboard' | 'pricing' | 'help' | 'privacy' | 'terms'>('homepage');

  // Use the auth state view if user is authenticated, otherwise use navigation view
  const activeView = user ? currentView : navigationView;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen">
      <ViewRenderer
        currentView={activeView}
        onGetStarted={() => {
          if (user) {
            setCurrentView('auth');
          } else {
            setNavigationView('auth');
          }
        }}
        onAuthSuccess={handleAuthSuccess}
        onOnboardingComplete={handleOnboardingComplete}
        onViewPricing={() => setNavigationView('pricing')}
        onViewHelp={() => setNavigationView('help')}
        onViewPrivacy={() => setNavigationView('privacy')}
        onViewTerms={() => setNavigationView('terms')}
        onBackToHome={() => setNavigationView('homepage')}
        user={user}
        onSignOut={handleSignOut}
      />
      
      <DemoNavigation
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={user}
        onSignOut={handleSignOut}
      />
    </div>
  );
};

export default Index;
