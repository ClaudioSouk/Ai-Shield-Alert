import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import PhishingAnalyzerForm from '@/components/PhishingAnalyzerForm';
import Footer from '@/components/Footer';
import SecurityScore from '@/components/SecurityScore';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        {isAuthenticated && (
          <div className="py-16 bg-muted/20">
            <div className="container px-4 md:px-6 max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold tracking-tighter">Your Security Status</h2>
                <p className="text-muted-foreground mt-2">Real-time security insights for your organization</p>
              </div>
              <SecurityScore score={78} />
            </div>
          </div>
        )}
        <PhishingAnalyzerForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
