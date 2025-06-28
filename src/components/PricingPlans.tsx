
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from 'lucide-react';

interface PricingPlansProps {
  onSelectPlan: (plan: 'free' | 'premium' | 'enterprise') => void;
}

const PricingPlans = ({ onSelectPlan }: PricingPlansProps) => {
  const plans = [
    {
      id: 'free' as const,
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        'Up to 5 clients',
        'Basic income tracking',
        'Simple invoicing',
        'Email support',
        'Basic reporting'
      ],
      popular: false,
      buttonText: 'Purchase'
    },
    {
      id: 'premium' as const,
      name: 'Premium',
      price: '$19',
      period: '/month',
      description: 'Best for growing businesses',
      features: [
        'Unlimited clients',
        'Advanced income tracking',
        'Professional invoicing',
        'Property management',
        'Tax preparation tools',
        'Priority support',
        'Advanced reporting',
        'Payment processing'
      ],
      popular: true,
      buttonText: 'Purchase'
    },
    {
      id: 'enterprise' as const,
      name: 'Enterprise',
      price: '$49',
      period: '/month',
      description: 'For large organizations',
      features: [
        'Everything in Premium',
        'Multi-user accounts',
        'Custom integrations',
        'Dedicated support',
        'White-label options',
        'Advanced analytics',
        'API access',
        'Custom workflows'
      ],
      popular: false,
      buttonText: 'Purchase'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your financial management needs. 
            Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'border-blue-500 shadow-lg scale-105' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => onSelectPlan(plan.id)}
                  className={`w-full py-3 text-lg font-semibold ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">All plans include a 14-day free trial</p>
          <p className="text-sm text-gray-500">
            No setup fees • Cancel anytime • Secure payments
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
