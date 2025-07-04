
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, TrendingUp, FileText, Home, Users, Calendar, Shield } from 'lucide-react';
import SplineViewer from './SplineViewer';

interface HomepageProps {
  onGetStarted: () => void;
  onViewPricing: () => void;
  onViewHelp: () => void;
  onViewSecurity: () => void;
}

const Homepage = ({ onGetStarted, onViewPricing, onViewHelp, onViewSecurity }: HomepageProps) => {
  const features = [
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
      title: "Income Tracking",
      description: "Monitor all revenue streams from freelance work, consulting, and rental properties in one unified dashboard."
    },
    {
      icon: <FileText className="w-8 h-8 text-green-600" />,
      title: "Smart Invoicing",
      description: "Create professional invoices, accept payments, and automate follow-ups with integrated payment processing."
    },
    {
      icon: <Home className="w-8 h-8 text-purple-600" />,
      title: "Property Management",
      description: "Track rental income, expenses, and maintenance costs for multiple properties with detailed reporting."
    },
    {
      icon: <Users className="w-8 h-8 text-orange-600" />,
      title: "Client & Tenant Management",
      description: "Organize client information, track payment history, and manage tenant relationships efficiently."
    },
    {
      icon: <Calendar className="w-8 h-8 text-red-600" />,
      title: "Subscription Tracking",
      description: "Never miss a renewal with automated alerts for recurring subscriptions and business expenses."
    },
    {
      icon: <Shield className="w-8 h-8 text-indigo-600" />,
      title: "Tax Preparation",
      description: "Generate tax-ready reports and export data in formats your accountant will love."
    }
  ];

  const handleDownloadPrivacyPolicy = () => {
    // Create a mock PDF download
    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVGl0bGUgKFByaXZhY3kgUG9saWN5KQovQ3JlYXRvciAoRmluYW5jcikKL1Byb2R1Y2VyIChGaW5hbmNyKQovQ3JlYXRpb25EYXRlIChEOjIwMjUwMTAyMTIwMDAwWikKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDMgMCBSCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbNCAwIFJdCi9Db3VudCAxCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMyAwIFIKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KPj4KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMTI1IDAwMDAwIG4gCjAwMDAwMDAxNzIgMDAwMDAgbiAKMDAwMDAwMDIyOSAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDUKL1Jvb3QgMiAwIFIKPj4Kc3RhcnR4cmVmCjMxNApFT0Y=');
    element.setAttribute('download', 'privacy-policy.pdf');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadTermsOfService = () => {
    // Create a mock PDF download
    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVGl0bGUgKFRlcm1zIG9mIFNlcnZpY2UpCi9DcmVhdG9yIChGaW5hbmNyKQovUHJvZHVjZXIgKEZpbmFuY3IpCi9DcmVhdGlvbkRhdGUgKEQ6MjAyNTAxMDIxMjAwMDBaKQo+PgplbmRvYmoKMiAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMyAwIFIKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFs0IDAgUl0KL0NvdW50IDEKPT4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAzIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQo+PgplbmRvYmoKeHJlZgowIDUKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAxMjUgMDAwMDAgbiAKMDAwMDAwMDE3MiAwMDAwMCBuIAowMDAwMDAwMjI5IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNQovUm9vdCAyIDAgUgo+PgpzdGFydHhyZWYKMzE0CkVPRg==');
    element.setAttribute('download', 'terms-of-service.pdf');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Financr
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900" onClick={onViewPricing}>
                Pricing
              </Button>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900" onClick={onViewSecurity}>
                Security
              </Button>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900" onClick={onViewHelp}>
                Help
              </Button>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900" onClick={onGetStarted}>
                Sign In
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onViewPricing}>
                Start Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Financial operations,
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}simplified
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                The all-in-one platform for freelancers, consultants, and small landlords to manage income, 
                expenses, invoicing, and tax preparation with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg" onClick={onViewPricing}>
                  Start for Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-3 text-lg">
                  Watch Demo
                </Button>
              </div>
            </div>
            
            {/* 3D Spline Viewer */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 aspect-square">
                <SplineViewer 
                  url="https://prod.spline.design/2N7aSkM8QZB6Y60l/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to stay organized
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Replace scattered spreadsheets and disconnected tools with one comprehensive platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-8 text-center">
                  <div className="mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to take control of your finances?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust Financr to manage their financial operations.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 text-lg font-semibold" onClick={onViewPricing}>
            Start Your Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Financr
              </h3>
              <p className="text-gray-400">
                Simplifying financial operations for modern professionals.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><button onClick={onViewPricing} className="hover:text-white transition-colors text-left">Pricing</button></li>
                <li><button onClick={onViewSecurity} className="hover:text-white transition-colors text-left">Security</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={onViewHelp} className="hover:text-white transition-colors text-left">Help Center</button></li>
                <li><button onClick={onViewHelp} className="hover:text-white transition-colors text-left">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={handleDownloadPrivacyPolicy} className="hover:text-white transition-colors text-left">Privacy Policy</button></li>
                <li><button onClick={handleDownloadTermsOfService} className="hover:text-white transition-colors text-left">Terms of Service</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Financr. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
