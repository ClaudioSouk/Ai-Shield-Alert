
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Check, Clipboard, RefreshCw } from 'lucide-react';

interface EmailCaptureProps {
  title?: string;
  description?: string;
  buttonText?: string;
  className?: string;
  onSuccess?: (email: string) => void;
}

const EmailCapture: React.FC<EmailCaptureProps> = ({ 
  title = "Get Free Email Security Assessment", 
  description = "Join thousands of security professionals enhancing their phishing protection",
  buttonText = "Start Free Assessment",
  className = "",
  onSuccess
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Google Sheets submission via a public form endpoint
      // In production, replace this with your actual form endpoint URL
      const sheetSubmissionEndpoint = "https://script.google.com/macros/s/AKfycbxLZTlgHBunzjDAyvzTFB0Jin9V0SmNVxJ4C8s_/exec";
      
      // For demo purposes, we're just logging and simulating success
      console.log("Submitting email to Google Sheets:", email);
      
      // Simulated API call (in production, uncomment the fetch code below)
      /*
      const response = await fetch(sheetSubmissionEndpoint, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          source: window.location.pathname,
          timestamp: new Date().toISOString()
        }),
      });
      */
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSuccess(true);
      setEmail('');
      
      if (onSuccess) {
        onSuccess(email);
      }
      
      toast({
        title: "Success!",
        description: "Thank you for your interest. We'll be in touch soon.",
      });
      
      // Reset success state after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting email:", error);
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setEmail('');
    setIsSuccess(false);
  };

  return (
    <div className={`p-6 border rounded-lg shadow-sm bg-muted/30 ${className}`}>
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Input
            type="email"
            placeholder="Your work email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-background pr-10"
            disabled={isSubmitting || isSuccess}
          />
          {email && (
            <button 
              type="button"
              onClick={handleReset}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting || isSuccess}
        >
          {isSuccess ? (
            <span className="flex items-center">
              <Check className="mr-2 h-4 w-4" /> 
              Submitted
            </span>
          ) : isSubmitting ? (
            <span className="flex items-center">
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </span>
          ) : (
            buttonText
          )}
        </Button>
      </form>

      <p className="mt-3 text-xs text-center text-muted-foreground">
        By submitting, you agree to our 
        <a href="/privacy-policy" className="underline hover:text-foreground mx-1">Privacy Policy</a>
        and
        <a href="/terms" className="underline hover:text-foreground mx-1">Terms of Service</a>
      </p>
    </div>
  );
};

export default EmailCapture;
