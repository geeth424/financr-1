import React from 'react';
import { User } from '@supabase/supabase-js';
import Homepage from './Homepage';
import MobileAuth from './MobileAuth';
import OnboardingFlow from './OnboardingFlow';
import MobileDashboard from './MobileDashboard';
import PricingPlans from './PricingPlans';
import HelpCenter from './HelpCenter';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import SecurityPage from './SecurityPage';

interface MobileViewRendererProps {
  currentView: 'homepage' | 'auth' | 'onboarding' | 'dashboard' | 'pricing' | 'help' | 'privacy' | 'terms' | 'security';
  onGetStarted: () => void;
  onAuthSuccess: (isSignUp?: boolean) => void;
  onOnboardingComplete: () => void;
  onViewPricing: () => void;
  onViewHelp: () => void;
  onViewPrivacy: () => void;
  onViewTerms: () => void;
  onViewSecurity: () => void;
  onBackToHome: () => void;
  user: User | null;
  onSignOut: () => Promise<void>;
  isMobile: boolean;
}

const MobileViewRenderer = ({
  currentView,
  onGetStarted,
  onAuthSuccess,
  onOnboardingComplete,
  onViewPricing,
  onViewHelp,
  onViewPrivacy,
  onViewTerms,
  onViewSecurity,
  onBackToHome,
  user,
  onSignOut,
  isMobile,
}: MobileViewRendererProps) => {
  const handleSelectPlan = (plan: 'free' | 'premium' | 'enterprise') => {
    if (plan === 'free') {
      onGetStarted();
    } else {
      // For paid plans, could integrate with Stripe here
      alert(`Selected ${plan} plan. Payment integration would be implemented here.`);
    }
  };

  // If mobile, use mobile-specific components where available
  if (isMobile) {
    switch (currentView) {
      case 'homepage':
        return (
          <Homepage 
            onGetStarted={onGetStarted} 
            onViewPricing={onViewPricing}
            onViewHelp={onViewHelp}
            onViewSecurity={onViewSecurity}
          />
        );
      case 'auth':
        return <MobileAuth onAuthSuccess={onAuthSuccess} onBack={onBackToHome} />;
      case 'onboarding':
        return <OnboardingFlow onComplete={onOnboardingComplete} />;
      case 'dashboard':
        return <MobileDashboard user={user} onSignOut={onSignOut} />;
      case 'pricing':
        return <PricingPlans onSelectPlan={handleSelectPlan} />;
      case 'help':
        return <HelpCenter onBack={onBackToHome} />;
      case 'privacy':
        return <PrivacyPolicy onBack={onBackToHome} />;
      case 'terms':
        return <TermsOfService onBack={onBackToHome} />;
      case 'security':
        return <SecurityPage onBack={onBackToHome} />;
      default:
        return (
          <Homepage 
            onGetStarted={onGetStarted} 
            onViewPricing={onViewPricing}
            onViewHelp={onViewHelp}
            onViewSecurity={onViewSecurity}
          />
        );
    }
  }

  // Desktop fallback - use existing components
  switch (currentView) {
    case 'homepage':
      return (
        <Homepage 
          onGetStarted={onGetStarted} 
          onViewPricing={onViewPricing}
          onViewHelp={onViewHelp}
          onViewSecurity={onViewSecurity}
        />
      );
    case 'auth':
      return <MobileAuth onAuthSuccess={onAuthSuccess} onBack={onBackToHome} />;
    case 'onboarding':
      return <OnboardingFlow onComplete={onOnboardingComplete} />;
    case 'dashboard':
      return <MobileDashboard user={user} onSignOut={onSignOut} />;
    case 'pricing':
      return <PricingPlans onSelectPlan={handleSelectPlan} />;
    case 'help':
      return <HelpCenter onBack={onBackToHome} />;
    case 'privacy':
      return <PrivacyPolicy onBack={onBackToHome} />;
    case 'terms':
      return <TermsOfService onBack={onBackToHome} />;
    case 'security':
      return <SecurityPage onBack={onBackToHome} />;
    default:
      return (
        <Homepage 
          onGetStarted={onGetStarted} 
          onViewPricing={onViewPricing}
          onViewHelp={onViewHelp}
          onViewSecurity={onViewSecurity}
        />
      );
  }
};

export default MobileViewRenderer;