
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-muted-foreground mb-6">
              Last updated: May 3, 2025
            </p>
            
            <section className="mb-8">
              <h2>Agreement to Terms</h2>
              <p>
                These Terms of Service constitute a legally binding agreement made between you and AI Shield Alert, concerning your access to and use of our website and phishing detection services.
              </p>
              <p>
                By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>Description of Services</h2>
              <p>
                AI Shield Alert provides phishing detection and security awareness services that help organizations identify and prevent social engineering attacks. Our services include:
              </p>
              <ul>
                <li>AI-powered phishing email analysis</li>
                <li>URL safety verification</li>
                <li>Security dashboards and reporting</li>
                <li>Educational resources and training materials</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2>User Registration</h2>
              <p>
                To access certain features of our service, you may be required to register for an account. You agree to provide accurate information during the registration process and to keep your account information updated.
              </p>
              <p>
                You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. We encourage you to use strong passwords (e.g., a combination of uppercase and lowercase letters, numbers, and symbols) with your account.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>Fees and Payment</h2>
              <p>
                Some aspects of the Service may be provided for a fee. You will be required to select a payment plan and provide billing information during the registration process.
              </p>
              <p>
                By providing payment information, you represent and warrant that you are authorized to use the payment method and authorize us to charge the applicable fees.
              </p>
              <p>
                All fees are exclusive of taxes, which may be added by AI Shield Alert at the applicable rate.
              </p>
            </section>
            
            {/* Additional sections would go here in real terms of service */}
            
            <section className="mb-8">
              <h2>Contact Information</h2>
              <p>
                If you have questions or comments about these Terms of Service, please contact us at:
              </p>
              <p>
                AI Shield Alert<br />
                Email: legal@aishieldalert.com<br />
                Address: 123 Security Street, Cybertown, CA 94000
              </p>
            </section>
          </div>
          
          <div className="mt-8">
            <Link to="/" className="text-primary hover:underline">Back to Home</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
