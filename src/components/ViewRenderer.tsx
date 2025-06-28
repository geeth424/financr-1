
import React from 'react';
import { User } from '@supabase/supabase-js';
import Homepage from './Homepage';
import EnhancedAuthForm from './EnhancedAuthForm';
import OnboardingFlow from './OnboardingFlow';
import Dashboard from './Dashboard';
import PricingPlans from './PricingPlans';
import HelpCenter from './HelpCenter';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';

interface ViewRendererProps {
  currentView: 'homepage' | 'auth' | 'onboarding' | 'dashboard' | 'pricing' | 'help' | 'privacy' | 'terms';
  onGetStarted: () => void;
  onAuthSuccess: () => void;
  onOnboardingComplete: () => void;
  onViewPricing: () => void;
  onViewHelp: () => void;
  onViewPrivacy: () => void;
  onViewTerms: () => void;
  onBackToHome: () => void;
  user: User | null;
  onSignOut: () => Promise<void>;
}

const ViewRenderer = ({
  currentView,
  onGetStarted,
  onAuthSuccess,
  onOnboardingComplete,
  onViewPricing,
  onViewHelp,
  onViewPrivacy,
  onViewTerms,
  onBackToHome,
  user,
  onSignOut,
}: ViewRendererProps) => {
  const handleSelectPlan = (plan: 'free' | 'premium' | 'enterprise') => {
    if (plan === 'free') {
      onGetStarted();
    } else {
      // For paid plans, could integrate with Stripe here
      alert(`Selected ${plan} plan. Payment integration would be implemented here.`);
    }
  };

  switch (currentView) {
    case 'homepage':
      return (
        <Homepage 
          onGetStarted={onGetStarted} 
          onViewPricing={onViewPricing}
          onViewHelp={onViewHelp}
        />
      );
    case 'auth':
      return <EnhancedAuthForm onAuthSuccess={onAuthSuccess} onBack={onBackToHome} />;
    case 'onboarding':
      return <OnboardingFlow onComplete={onOnboardingComplete} />;
    case 'dashboard':
      return <Dashboard user={user} onSignOut={onSignOut} />;
    case 'pricing':
      return <PricingPlans onSelectPlan={handleSelectPlan} />;
    case 'help':
      return <HelpCenter onBack={onBackToHome} />;
    case 'privacy':
      return <PrivacyPolicy onBack={onBackToHome} />;
    case 'terms':
      return <TermsOfService onBack={onBackToHome} />;
    default:
      return (
        <Homepage 
          onGetStarted={onGetStarted} 
          onViewPricing={onViewPricing}
          onViewHelp={onViewHelp}
        />
      );
  }
};

export default ViewRenderer;
