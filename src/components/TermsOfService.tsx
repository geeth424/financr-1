
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
}

const TermsOfService = ({ onBack }: TermsOfServiceProps) => {
  const handleDownloadPDF = () => {
    // This would typically generate and download a PDF
    alert('PDF download functionality would be implemented here');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Terms of Service</h1>
          </div>
          <Button onClick={handleDownloadPDF} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Terms of Service for Financr</CardTitle>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h3>
                <p className="text-gray-700">
                  By accessing and using Financr ("the Service"), you accept and agree to be bound by the 
                  terms and provision of this agreement. If you do not agree to abide by the above, please 
                  do not use this service.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">2. Description of Service</h3>
                <p className="text-gray-700">
                  Financr is a financial management platform that helps freelancers, consultants, and small 
                  landlords manage their income, expenses, invoicing, and tax preparation. The service is 
                  provided "as is" and we reserve the right to modify or discontinue the service at any time.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">3. User Account and Security</h3>
                <p className="text-gray-700 mb-4">
                  To use certain features of the service, you must create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Provide accurate and complete registration information</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                  <li>Be responsible for all activities that occur under your account</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">4. Acceptable Use</h3>
                <p className="text-gray-700 mb-4">You agree not to use the service to:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on the rights of others</li>
                  <li>Transmit harmful or malicious code</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use the service for any illegal or unauthorized purpose</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">5. Payment Terms</h3>
                <p className="text-gray-700 mb-4">
                  For paid services, you agree to pay all applicable fees as described on our pricing page. 
                  Fees are non-refundable except as required by law. We reserve the right to change our 
                  pricing at any time with reasonable notice.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">6. Intellectual Property</h3>
                <p className="text-gray-700">
                  The service and its original content, features, and functionality are owned by Financr and 
                  are protected by international copyright, trademark, patent, trade secret, and other 
                  intellectual property laws.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">7. Privacy and Data Protection</h3>
                <p className="text-gray-700">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your 
                  use of the service, to understand our practices regarding the collection and use of your 
                  personal information.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">8. Limitation of Liability</h3>
                <p className="text-gray-700">
                  In no event shall Financr be liable for any indirect, incidental, special, consequential, 
                  or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
                  or other intangible losses resulting from your use of the service.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">9. Termination</h3>
                <p className="text-gray-700">
                  We may terminate or suspend your account and bar access to the service immediately, without 
                  prior notice or liability, under our sole discretion, for any reason whatsoever including 
                  without limitation if you breach the Terms.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">10. Changes to Terms</h3>
                <p className="text-gray-700">
                  We reserve the right to modify or replace these terms at any time. If a revision is material, 
                  we will provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">11. Contact Information</h3>
                <p className="text-gray-700">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Email:</strong> legal@financr.com<br />
                    <strong>Address:</strong> 123 Financial St, Suite 100, Business City, BC 12345<br />
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
