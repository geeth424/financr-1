
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen">
      <ViewRenderer
        currentView={currentView}
        onGetStarted={() => setCurrentView('auth')}
        onAuthSuccess={handleAuthSuccess}
        onOnboardingComplete={handleOnboardingComplete}
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
