
import React from 'react';
import { User } from '@supabase/supabase-js';

interface DemoNavigationProps {
  currentView: 'homepage' | 'auth' | 'onboarding' | 'dashboard';
  setCurrentView: (view: 'homepage' | 'auth' | 'onboarding' | 'dashboard') => void;
  user: User | null;
  onSignOut: () => Promise<void>;
}

const DemoNavigation = ({ currentView, setCurrentView, user, onSignOut }: DemoNavigationProps) => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
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
              onClick={onSignOut}
              className="text-xs px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
            >
              Sign Out
            </button>
          )}
        </div>
        {user && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              Logged in as: {user.email}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoNavigation;
