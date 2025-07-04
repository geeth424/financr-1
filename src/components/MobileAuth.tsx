import React, { useState } from 'react';
import { Apple, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SplineViewer from './SplineViewer';

interface MobileAuthProps {
  onAuthSuccess: (isSignUp?: boolean) => void;
  onBack: () => void;
}

const MobileAuth = ({ onAuthSuccess, onBack }: MobileAuthProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              full_name: `${formData.firstName} ${formData.lastName}`.trim()
            }
          }
        });

        if (error) throw error;

        toast({
          title: "Success!",
          description: "Please check your email to verify your account.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully.",
        });
      }

      onAuthSuccess(isSignUp);
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: error.message || 'An error occurred during authentication.',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Failed to sign in with Google.',
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 font-sf-pro">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Financr</h1>
        <div className="w-10" />
      </div>

      {/* 3D Hero Section */}
      <div className="mx-6 mb-8 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 h-48">
        <SplineViewer 
          url="https://prod.spline.design/2N7aSkM8QZB6Y60l/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      {/* Auth Form */}
      <div className="px-6 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {isSignUp 
              ? 'Start managing your finances today' 
              : 'Sign in to your account'
            }
          </p>
        </div>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-white/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Input
                      type="text"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="h-12 text-base bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                      required={isSignUp}
                    />
                  </div>
                  <div>
                    <Input
                      type="text"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="h-12 text-base bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                      required={isSignUp}
                    />
                  </div>
                </div>
              )}

              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 text-base bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                  required
                />
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12 text-base bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>

              {isSignUp && (
                <div>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="h-12 text-base bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                    required={isSignUp}
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl"
                disabled={loading}
              >
                {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-base border-gray-300 dark:border-gray-600 rounded-xl"
                  onClick={handleGoogleAuth}
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-base border-gray-300 dark:border-gray-600 rounded-xl bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  onClick={() => toast({ title: "Coming Soon", description: "Apple Sign In will be available soon!" })}
                >
                  <Apple className="h-5 w-5 mr-2" />
                  Apple
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:text-blue-700"
          >
            {isSignUp 
              ? 'Already have an account? Sign In' 
              : "Don't have an account? Sign Up"
            }
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400 pb-6">
          By continuing, you agree to our{' '}
          <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default MobileAuth;