import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="bg-muted/50 py-24 md:py-32">
      <div className="container px-4 md:px-6 text-center">
        <div className="flex justify-center mb-8">
          <ShieldAlert className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl max-w-3xl mx-auto">
          Protect Your Organization from AI-Generated Phishing Attacks
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground mt-6 md:text-xl">
          AI Shield Alert uses advanced machine learning to detect sophisticated phishing attempts in real-time. Our platform analyzes emails and messages to identify threats before they can do damage.
        </p>
        <div className="mx-auto mt-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/auth?action=signup">
            <Button size="lg" className="w-full sm:w-auto">
              Get Protected Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
        <div className="mt-8 text-sm text-muted-foreground">
          <p>Already using AI Shield Alert? <Link to="/auth" className="underline font-medium">Sign in here</Link></p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
