
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FAQItem = {
  question: string;
  answer: string;
};

export const FAQ = () => {
  const faqs: FAQItem[] = [
    {
      question: "How does AI Shield Alert detect AI-generated phishing attempts?",
      answer: "Our system uses advanced machine learning algorithms to analyze multiple indicators including language patterns, sender reputation, email metadata, and link destinations. It's specifically trained to recognize the subtle patterns of AI-generated content that traditional security tools miss."
    },
    {
      question: "Can AI Shield Alert integrate with our existing email provider?",
      answer: "Yes! We offer seamless integration with Gmail, Microsoft 365/Outlook, and most major email providers through secure API connections. For enterprise customers, we also support custom integrations with on-premise email systems."
    },
    {
      question: "How quickly does the system detect and block threats?",
      answer: "AI Shield Alert works in real-time, analyzing emails and links as they arrive. Detection typically happens within seconds, and suspicious content is flagged or quarantined based on your organization's security policies."
    },
    {
      question: "Do you support mobile protection for SMS and WhatsApp phishing?",
      answer: "Yes, our mobile app provides protection across SMS, WhatsApp, and other messaging platforms by analyzing links before they're opened and providing real-time alerts for suspicious messages."
    },
    {
      question: "How do you handle false positives?",
      answer: "Our system is designed to minimize false positives through continuous learning. Users can report false positives through a simple feedback mechanism, which helps train the AI. Additionally, admins can adjust sensitivity levels and whitelist trusted senders."
    },
    {
      question: "Is AI Shield Alert compliant with privacy regulations like GDPR?",
      answer: "Absolutely. We're fully compliant with GDPR, CCPA, and other privacy regulations. We use end-to-end encryption, minimize data retention, and provide data processing agreements (DPAs) for all customers."
    }
  ];

  return (
    <section id="faq" className="py-16">
      <div className="container px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Everything you need to know about AI Shield Alert
          </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Have more questions? <a href="#" className="text-primary underline">Contact our team</a> for personalized assistance.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
