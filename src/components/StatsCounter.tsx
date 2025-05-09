
import React from 'react';

export const StatsCounter = () => {
  return (
    <section className="py-16 bg-shield-dark text-white">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">10M+</div>
            <div className="text-sm opacity-80">Phishing Attempts Blocked</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">2,500+</div>
            <div className="text-sm opacity-80">Protected Organizations</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">99.8%</div>
            <div className="text-sm opacity-80">Detection Accuracy</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">85%</div>
            <div className="text-sm opacity-80">Reduction in Incidents</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
