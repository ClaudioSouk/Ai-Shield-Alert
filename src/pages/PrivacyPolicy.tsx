import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-muted-foreground mb-6">
              Last updated: May 3, 2025
            </p>
            
            <section className="mb-8">
              <h2>Overview</h2>
              <p>
                At AI Shield Alert, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our phishing detection services.
              </p>
              <p>
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>Information We Collect</h2>
              <h3>Personal Information</h3>
              <p>
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul>
                <li>Register for an account</li>
                <li>Sign up for our newsletter</li>
                <li>Submit phishing emails for analysis</li>
                <li>Contact our customer support</li>
                <li>Contact us</li>
                <li>Subscribe to our newsletter</li>
                <li>Create an account</li>
                <li>Use our services</li>
              </ul>
              <p>
                This information may include:
              </p>
              <ul>
                <li>Name</li>
                <li>Email address</li>
                <li>Company name</li>
                <li>Job title</li>
                <li>Phone number</li>
              </ul>
              
              <h3>Service Usage Data</h3>
              <p>
                When you use our phishing detection service, we collect information about:
              </p>
              <ul>
                <li>Emails submitted for analysis (metadata only, content is not stored)</li>
                <li>URLs checked for phishing indicators</li>
                <li>Detection results and feedback</li>
              </ul>
              
              <h3>Automatically Collected Information</h3>
              <p>
                We automatically collect certain information when you visit our website, including:
              </p>
              <ul>
                <li>IP address</li>
                <li>Browser type</li>
                <li>Device type</li>
                <li>Operating system</li>
                <li>Pages visited</li>
                <li>Time spent on pages</li>
                <li>Referring website</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2>How We Use Your Information</h2>
              <p>
                We may use the information we collect for various purposes, including:
              </p>
              <ul>
                <li>Providing and maintaining our services</li>
                <li>Improving our phishing detection algorithms</li>
                <li>Sending you service notifications</li>
                <li>Responding to your inquiries and support requests</li>
                <li>Sending marketing communications (with your consent)</li>
                <li>Monitoring service usage and analytics</li>
                <li>Detecting and preventing fraud or abuse</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>
            
            {/* Additional sections would go here in a real privacy policy */}
            
            <section className="mb-8">
              <h2>Contact Information</h2>
              <p>
                If you have questions or comments about this Privacy Policy, please contact us at:
              </p>
              <p>
                AI Shield Alert<br />
                Email: privacy@aishieldalert.com<br />
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

export default PrivacyPolicy;
