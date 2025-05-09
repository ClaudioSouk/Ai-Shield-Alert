
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Shield, AlertTriangle, Mail, Search, Info } from 'lucide-react';

export const Features = () => {
  return (
    <section id="features" className="py-16 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
            Advanced Protection Features
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Comprehensive defense against modern phishing and social engineering attacks
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border border-border bg-background">
            <CardHeader className="pb-2">
              <ShieldCheck className="h-10 w-10 text-primary mb-2" />
              <CardTitle>AI-Powered Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our advanced machine learning algorithms identify sophisticated phishing attempts that traditional filters miss.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-border bg-background">
            <CardHeader className="pb-2">
              <Mail className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Email Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Scans incoming emails for suspicious content, social engineering tactics, and impersonation attempts.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-border bg-background">
            <CardHeader className="pb-2">
              <Search className="h-10 w-10 text-primary mb-2" />
              <CardTitle>URL Scanning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Real-time analysis of links to detect malicious websites, spoofing, and credential harvesting pages.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-border bg-background">
            <CardHeader className="pb-2">
              <AlertTriangle className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Assigns threat levels to detected attacks, helping your team prioritize and respond appropriately.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-border bg-background">
            <CardHeader className="pb-2">
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Real-time Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Immediate alerts and blocking of malicious content before it reaches your employees' inboxes.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-border bg-background">
            <CardHeader className="pb-2">
              <Info className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Detailed Reporting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Comprehensive analytics and insights about attack patterns, vulnerable employees, and security trends.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Features;
