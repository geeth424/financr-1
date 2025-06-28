
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Eye, Server, FileCheck, Users } from 'lucide-react';

interface SecurityPageProps {
  onBack: () => void;
}

const SecurityPage = ({ onBack }: SecurityPageProps) => {
  const securityFeatures = [
    {
      icon: <Lock className="w-8 h-8 text-blue-600" />,
      title: "End-to-End Encryption",
      description: "All your financial data is encrypted using industry-standard AES-256 encryption both in transit and at rest."
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Multi-Factor Authentication",
      description: "Secure your account with two-factor authentication using SMS, email, or authenticator apps."
    },
    {
      icon: <Server className="w-8 h-8 text-purple-600" />,
      title: "Secure Infrastructure",
      description: "Our servers are hosted on enterprise-grade cloud infrastructure with 99.9% uptime guarantee."
    },
    {
      icon: <Eye className="w-8 h-8 text-orange-600" />,
      title: "Privacy by Design",
      description: "We follow privacy-by-design principles and never sell or share your personal information with third parties."
    },
    {
      icon: <FileCheck className="w-8 h-8 text-red-600" />,
      title: "Regular Security Audits",
      description: "We conduct regular security audits and penetration testing to ensure your data remains secure."
    },
    {
      icon: <Users className="w-8 h-8 text-indigo-600" />,
      title: "Role-Based Access",
      description: "Control who has access to what data with granular permission controls and user management."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Security & Privacy</h1>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Shield className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your financial data is safe with us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We take security seriously. Financr is built with enterprise-grade security measures 
            to protect your sensitive financial information at every level.
          </p>
        </div>

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {securityFeatures.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
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

        {/* Detailed Security Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-5 h-5 mr-2 text-blue-600" />
                Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Encryption Standards</h4>
                <p className="text-gray-600">
                  All data is encrypted using AES-256 encryption, the same standard used by banks and government agencies.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Secure Transmission</h4>
                <p className="text-gray-600">
                  All communications between your browser and our servers use TLS 1.3 encryption.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Data Backup</h4>
                <p className="text-gray-600">
                  Your data is automatically backed up with multiple redundancies across different geographic locations.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="w-5 h-5 mr-2 text-green-600" />
                Infrastructure Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Cloud Security</h4>
                <p className="text-gray-600">
                  Hosted on enterprise-grade cloud infrastructure with 24/7 monitoring and automated threat detection.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Access Controls</h4>
                <p className="text-gray-600">
                  Strict access controls and monitoring ensure only authorized personnel can access our systems.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Compliance</h4>
                <p className="text-gray-600">
                  We adhere to industry-standard compliance frameworks including SOC 2 and GDPR.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust & Compliance Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Trust & Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FileCheck className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">SOC 2 Compliant</h4>
                <p className="text-gray-600">
                  Independently audited for security, availability, and confidentiality.
                </p>
              </div>
              <div>
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">GDPR Compliant</h4>
                <p className="text-gray-600">
                  Full compliance with European data protection regulations.
                </p>
              </div>
              <div>
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">ISO 27001</h4>
                <p className="text-gray-600">
                  Certified information security management system.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card>
          <CardHeader>
            <CardTitle>Security Questions?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              If you have any questions about our security practices or would like to report a security issue, 
              please don't hesitate to contact our security team.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Security Team:</strong> security@financr.com<br />
                <strong>Bug Bounty:</strong> security-bugs@financr.com<br />
                <strong>Response Time:</strong> We respond to security inquiries within 24 hours
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityPage;
