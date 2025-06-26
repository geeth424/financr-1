
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Briefcase, 
  Home, 
  Users, 
  ArrowRight, 
  ArrowLeft, 
  Check,
  CreditCard,
  FileText,
  TrendingUp
} from 'lucide-react';

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const roles = [
    {
      id: 'freelancer',
      icon: <User className="w-8 h-8" />,
      title: 'Freelancer',
      description: 'Individual consultant, designer, developer, or creative professional',
      features: ['Project-based invoicing', 'Client management', 'Expense tracking']
    },
    {
      id: 'consultant',
      icon: <Briefcase className="w-8 h-8" />,
      title: 'Consultant',
      description: 'Business advisor, strategist, or professional service provider',
      features: ['Retainer tracking', 'Client relationships', 'Professional invoicing']
    },
    {
      id: 'landlord',
      icon: <Home className="w-8 h-8" />,
      title: 'Small Landlord',
      description: 'Property owner managing rental properties and tenant relationships',
      features: ['Rental income tracking', 'Property expenses', 'Tenant management']
    },
    {
      id: 'creator',
      icon: <Users className="w-8 h-8" />,
      title: 'Creator',
      description: 'Content creator, influencer, or digital entrepreneur',
      features: ['Multiple income streams', 'Brand partnerships', 'Creator expenses']
    }
  ];

  const features = [
    {
      id: 'invoicing',
      icon: <FileText className="w-6 h-6" />,
      title: 'Smart Invoicing',
      description: 'Create professional invoices and accept payments'
    },
    {
      id: 'expense-tracking',
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Expense Tracking',
      description: 'Categorize and track all business expenses'
    },
    {
      id: 'property-management',
      icon: <Home className="w-6 h-6" />,
      title: 'Property Management',
      description: 'Track rental income and property expenses'
    },
    {
      id: 'client-management',
      icon: <Users className="w-6 h-6" />,
      title: 'Client Management',
      description: 'Organize client information and payment history'
    },
    {
      id: 'tax-preparation',
      icon: <CreditCard className="w-6 h-6" />,
      title: 'Tax Preparation',
      description: 'Generate tax-ready reports and summaries'
    }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Financr!</h2>
              <p className="text-gray-600">Let's get you set up in just a few steps.</p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">What best describes you?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map((role) => (
                  <Card 
                    key={role.id}
                    className={`cursor-pointer transition-all border-2 ${
                      selectedRole === role.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-lg ${
                          selectedRole === role.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {role.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{role.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {role.features.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {selectedRole === role.id && (
                          <div className="text-blue-600">
                            <Check className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Features</h2>
              <p className="text-gray-600">Select the features you'd like to use (you can change these later).</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature) => (
                <Card 
                  key={feature.id}
                  className={`cursor-pointer transition-all border-2 ${
                    selectedFeatures.includes(feature.id) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleFeatureToggle(feature.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${
                        selectedFeatures.includes(feature.id) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                      {selectedFeatures.includes(feature.id) && (
                        <div className="text-blue-600">
                          <Check className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Payment Method</h2>
              <p className="text-gray-600">Add a payment method to accept payments from clients (optional).</p>
            </div>
            
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Stripe Integration</h3>
                <p className="text-gray-600 mb-6">
                  Connect your Stripe account to accept online payments and create professional invoices.
                </p>
                <div className="space-y-3">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Connect Stripe Account
                  </Button>
                  <Button variant="outline" className="w-full">
                    Skip for Now
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Secure & Trusted</p>
                  <p className="text-sm text-blue-700">
                    Your payment information is secured with bank-level encryption and processed by Stripe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">You're All Set!</h2>
              <p className="text-gray-600">Welcome to Financr. Let's start managing your finances.</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps:</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <span className="text-gray-700">Add your first income or expense</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <span className="text-gray-700">Create your first invoice</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <span className="text-gray-700">Explore your financial dashboard</span>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              onClick={() => console.log('Navigate to dashboard')}
            >
              Go to Dashboard
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Financr
          </h1>
          <div className="space-y-2">
            <div className="flex justify-center items-center space-x-2 text-sm text-gray-600">
              <span>Step {currentStep} of {totalSteps}</span>
            </div>
            <Progress value={progress} className="w-full h-2" />
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-2xl border-0">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={currentStep === 1 && !selectedRole}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
          >
            {currentStep === totalSteps ? 'Complete Setup' : 'Continue'}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
