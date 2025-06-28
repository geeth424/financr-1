
import React from 'react';
import { User } from '@supabase/supabase-js';
import Homepage from './Homepage';
import AuthForm from './AuthForm';
import OnboardingFlow from './OnboardingFlow';
import Dashboard from './Dashboard';

interface ViewRendererProps {
  currentView: 'homepage' | 'auth' | 'onboarding' | 'dashboard';
  onGetStarted: () => void;
  onAuthSuccess: () => void;
  onOnboardingComplete: () => void;
  user: User | null;
  onSignOut: () => Promise<void>;
}

const ViewRenderer = ({
  currentView,
  onGetStarted,
  onAuthSuccess,
  onOnboardingComplete,
  user,
  onSignOut,
}: ViewRendererProps) => {
  switch (currentView) {
    case 'homepage':
      return <Homepage onGetStarted={onGetStarted} />;
    case 'auth':
      return <AuthForm onAuthSuccess={onAuthSuccess} />;
    case 'onboarding':
      return <OnboardingFlow />;
    case 'dashboard':
      return <Dashboard user={user} onSignOut={onSignOut} />;
    default:
      return <Homepage onGetStarted={onGetStarted} />;
  }
};

export default ViewRenderer;
