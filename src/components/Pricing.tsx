
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

type PricingTier = {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};

const pricingTiers: PricingTier[] = [
  {
    name: 'Starter',
    price: '$9',
    description: 'Per user/month, billed annually',
    features: [
      'Basic AI phishing detection',
      'Email scanning',
      'Basic reporting',
      '9-5 support',
      'Up to 100 users'
    ]
  },
  {
    name: 'Business',
    price: '$19',
    description: 'Per user/month, billed annually',
    features: [
      'Advanced AI detection engine',
      'Email & URL scanning',
      'Real-time alerts',
      'Detailed analytics',
      '24/7 support',
      'Unlimited users'
    ],
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Contact us for enterprise pricing',
    features: [
      'Enterprise-grade AI protection',
      'Complete communication scanning',
      'Integration with existing security',
      'Custom reporting',
      'Dedicated support team',
      'Security consultations',
      'Employee training'
    ]
  }
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-16 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Transparent Pricing</h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Choose the right protection level for your organization
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <div 
              key={tier.name}
              className={`rounded-xl border bg-card text-card-foreground shadow overflow-hidden ${
                tier.highlighted 
                  ? 'border-primary ring-2 ring-primary ring-opacity-50' 
                  : 'border-muted'
              }`}
            >
              {tier.highlighted && (
                <div className="bg-primary px-4 py-1 text-center text-sm font-medium text-primary-foreground">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold">{tier.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
                  <span className="ml-1 text-sm font-medium text-muted-foreground">
                    {tier.description}
                  </span>
                </div>
                <ul className="mt-6 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-alert-green" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`mt-8 w-full ${tier.highlighted ? '' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                  variant={tier.highlighted ? 'default' : 'outline'}
                >
                  Get Started
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <p className="text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
