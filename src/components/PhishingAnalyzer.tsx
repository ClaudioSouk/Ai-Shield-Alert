
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PhishingAnalyzerForm from './PhishingAnalyzerForm';
import Navbar from './Navbar';
import Footer from './Footer';

export const PhishingAnalyzer = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Email Phishing Analyzer</h1>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Analyze suspicious emails for potential phishing threats using our advanced AI-powered detection system.
          </p>
          <PhishingAnalyzerForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PhishingAnalyzer;
