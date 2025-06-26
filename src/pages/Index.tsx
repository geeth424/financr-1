
import React, { useState } from 'react';
import Homepage from '../components/Homepage';
import AuthForm from '../components/AuthForm';
import OnboardingFlow from '../components/OnboardingFlow';
import Dashboard from '../components/Dashboard';

const Index = () => {
  const [currentView, setCurrentView] = useState<'homepage' | 'auth' | 'onboarding' | 'dashboard'>('homepage');

  // This is a simplified state management for the MVP demo
  // In a real app, this would be handled by proper authentication and routing
  const renderCurrentView = () => {
    switch (currentView) {
      case 'homepage':
        return <Homepage />;
      case 'auth':
        return <AuthForm />;
      case 'onboarding':
        return <OnboardingFlow />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <Homepage />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentView()}
      
      {/* Demo Navigation - Remove in production */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
