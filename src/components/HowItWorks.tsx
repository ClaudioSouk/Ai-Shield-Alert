import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
            How AI Shield Alert Works
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Our advanced AI system protects your organization in 4 simple steps
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground mb-4">
              1
            </div>
            <h3 className="text-xl font-bold mb-2">Integration</h3>
            <p className="text-muted-foreground">
              Quick setup with your email systems and web browsers with minimal configuration
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground mb-4">
              2
            </div>
            <h3 className="text-xl font-bold mb-2">Detection</h3>
            <p className="text-muted-foreground">
              Our AI continuously scans incoming communications for sophisticated attack patterns
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground mb-4">
              3
            </div>
            <h3 className="text-xl font-bold mb-2">Protection</h3>
            <p className="text-muted-foreground">
              Suspicious content is automatically blocked or flagged before reaching your team
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground mb-4">
              4
            </div>
            <h3 className="text-xl font-bold mb-2">Learning</h3>
            <p className="text-muted-foreground">
              The system continuously improves by learning from new attack patterns and your feedback
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
