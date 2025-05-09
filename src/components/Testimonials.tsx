
import React from 'react';

type TestimonialProps = {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatarSrc?: string;
};

const TestimonialCard = ({ quote, author, role, company, avatarSrc }: TestimonialProps) => (
  <div className="bg-background rounded-xl p-6 shadow-md border border-border">
    <div className="space-y-4">
      <p className="italic text-muted-foreground">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
          {avatarSrc ? (
            <img src={avatarSrc} alt={author} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground font-semibold">
              {author.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h4 className="font-semibold">{author}</h4>
          <p className="text-sm text-muted-foreground">{role}, {company}</p>
        </div>
      </div>
    </div>
  </div>
);

export const Testimonials = () => {
  const testimonials: TestimonialProps[] = [
    {
      quote: "After deploying AI Shield Alert, we saw an 85% reduction in successful phishing attempts targeting our employees. It's been a game-changer for our security posture.",
      author: "Sarah Johnson",
      role: "CIO",
      company: "TechCorp Solutions",
      avatarSrc: "https://i.pravatar.cc/100?img=5"
    },
    {
      quote: "The AI detection is incredibly accurate. We were previously using a rule-based system that missed sophisticated attacks, but AI Shield catches them in real-time.",
      author: "Michael Chen",
      role: "CISO",
      company: "FinSecure Banking",
      avatarSrc: "https://i.pravatar.cc/100?img=12"
    },
    {
      quote: "Our small business was targeted by spear phishing repeatedly. Since implementing AI Shield, we've had peace of mind knowing our team is protected against these threats.",
      author: "Emily Rodriguez",
      role: "IT Director",
      company: "HealthTech Innovations",
      avatarSrc: "https://i.pravatar.cc/100?img=9"
    }
  ];

  return (
    <section id="testimonials" className="py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
            Trusted by Security Teams Worldwide
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            See how organizations are stopping phishing attacks with AI Shield Alert
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
