
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  FileUp, 
  Mail, 
  ClipboardCheck, 
  AlertCircle, 
  CheckCircle,
  RefreshCw,
  ExternalLink,
  Settings,
  BellOff
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { getEmailIntegrationInstructions } from '@/services/phishingService';

const UserGuide = () => {
  const emailIntegrations = getEmailIntegrationInstructions();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle>AI Shield Alert User Guide</CardTitle>
          </div>
          <CardDescription>
            Learn how to use AI Shield Alert to protect yourself from AI-generated phishing attacks
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="analyze" className="space-y-4">
        <TabsList className="grid grid-cols-3 md:w-auto md:inline-grid md:grid-cols-none">
          <TabsTrigger value="analyze">How to Analyze</TabsTrigger>
          <TabsTrigger value="understanding">Understanding Results</TabsTrigger>
          <TabsTrigger value="integrations">Email Integrations</TabsTrigger>
          <TabsTrigger value="safety">Safety Tips</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analyze" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>How to Analyze Suspicious Content</CardTitle>
              <CardDescription>
                There are multiple ways to analyze potentially malicious content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                  Method 1: Paste Email Content
                </h3>
                <ol className="list-decimal ml-5 space-y-2 text-sm">
                  <li>Navigate to the <strong>Analyzer</strong> tab in your dashboard</li>
                  <li>Paste the complete email text into the analyzer text box</li>
                  <li>Click the <strong>Analyze Content</strong> button</li>
                  <li>Wait for the AI analysis to complete</li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <FileUp className="h-5 w-5 text-primary" />
                  Method 2: Upload Email File
                </h3>
                <ol className="list-decimal ml-5 space-y-2 text-sm">
                  <li>Save the suspicious email as an .eml or .txt file</li>
                  <li>Navigate to the <strong>Analyzer</strong> tab in your dashboard</li>
                  <li>Click <strong>Upload Email File</strong> and select your saved file</li>
                  <li>The system will automatically extract and analyze the content</li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Method 3: Forward Email
                </h3>
                <ol className="list-decimal ml-5 space-y-2 text-sm">
                  <li>Forward the suspicious email to <strong>scan@aishieldalert.com</strong></li>
                  <li>Important: Forward from your registered email address</li>
                  <li>Our system will automatically analyze the forwarded content</li>
                  <li>Results will be emailed back to you and available in your dashboard</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="understanding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Understanding Analysis Results</CardTitle>
              <CardDescription>
                Learn how to interpret the threat analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Badge className="text-white bg-red-500">High Risk</Badge>
                  High Risk (70-100%)
                </h3>
                <p className="text-sm">
                  Content shows strong indicators of a phishing attempt. Take immediate action by reporting 
                  it and do not engage with links, attachments, or requests in the message.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Badge className="bg-amber-500 text-white">Suspicious</Badge>
                  Suspicious (30-69%)
                </h3>
                <p className="text-sm">
                  Content has some concerning elements that suggest potential risk. Exercise caution and 
                  verify through official channels before taking any requested actions.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Badge className="bg-green-500 text-white">Likely Safe</Badge>
                  Likely Safe (0-29%)
                </h3>
                <p className="text-sm">
                  Content appears legitimate with minimal risk indicators. Always remain vigilant, but 
                  this content is likely safe based on our analysis.
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <h3 className="text-md font-medium mb-2">Threat Indicators</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span>Spoofed Domain</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span>Urgent Language</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span>AI Generated</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span>Suspicious Links</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span>Grammar/Spelling Issues</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span>Impersonation Attempt</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Provider Integrations</CardTitle>
              <CardDescription>
                Connect your email accounts for continuous protection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!emailIntegrations.isAvailable && (
                <Alert className="mb-6">
                  <RefreshCw className="h-4 w-4" />
                  <AlertTitle>Coming Soon</AlertTitle>
                  <AlertDescription>
                    Direct email provider integrations are coming in our next update. Currently, you can analyze emails 
                    manually or by forwarding them to scan@aishieldalert.com.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Gmail Integration
                </h3>
                <div className="ml-5 space-y-2 text-sm bg-muted/50 p-4 rounded-md">
                  {emailIntegrations.gmail}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Microsoft Outlook Integration
                </h3>
                <div className="ml-5 space-y-2 text-sm bg-muted/50 p-4 rounded-md">
                  {emailIntegrations.outlook}
                </div>
              </div>
              
              <div className="space-y-2 mt-6">
                <h3 className="text-lg font-medium">Current Methods</h3>
                <ul className="list-disc ml-5 space-y-2 text-sm">
                  <li>Forward suspicious emails to <strong>scan@aishieldalert.com</strong> from your registered email</li>
                  <li>Manually analyze emails using our Analyzer tab</li>
                  <li>Upload email files (.eml or .msg) for analysis</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="safety" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Safety Tips</CardTitle>
              <CardDescription>
                Best practices to avoid falling victim to phishing attacks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-md font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Verify the Sender
                </h3>
                <p className="text-sm">
                  Always check the actual email address, not just the display name. Hover over or click to view 
                  the full email address and verify it's from an official domain.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-md font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Be Suspicious of Urgency
                </h3>
                <p className="text-sm">
                  Phishing emails often create false urgency to rush you into action. Take time to verify 
                  communication through official channels before responding.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-md font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Hover Before You Click
                </h3>
                <p className="text-sm">
                  Always hover over links to see where they actually lead before clicking. Look for subtle 
                  misspellings or unusual domains.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-md font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Watch for Grammar and Spelling Errors
                </h3>
                <p className="text-sm">
                  Professional organizations typically proofread their communications. Multiple grammar or 
                  spelling errors can be a sign of a phishing attempt.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-md font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Use AI Shield Alert Regularly
                </h3>
                <p className="text-sm">
                  When in doubt, analyze suspicious emails with AI Shield Alert before taking any action. 
                  Our AI can detect subtle patterns that humans might miss.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Common questions about using AI Shield Alert
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">How do I scan emails in real-time?</h3>
                <p className="text-sm">
                  Currently, you can forward suspicious emails to scan@aishieldalert.com for immediate analysis. 
                  Automatic real-time scanning through direct email provider integration is coming in our next update.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Can I connect my Gmail or Outlook account?</h3>
                <p className="text-sm">
                  This feature is coming soon. In the next major update, you'll be able to connect your email 
                  providers for automatic scanning of all incoming messages.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">How accurate is the AI detection?</h3>
                <p className="text-sm">
                  Our AI system is trained on millions of phishing examples and achieves over 95% accuracy in detecting 
                  sophisticated phishing attempts, including those generated by AI. Each analysis includes a confidence 
                  level to help you understand the reliability of the result.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Is my email content secure when analyzed?</h3>
                <p className="text-sm">
                  Yes. All email content is encrypted in transit and at rest. We only store the minimum information 
                  needed for analysis, and you can delete your analysis history at any time from the History tab.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">How do I get alerts for new threats?</h3>
                <p className="text-sm">
                  You can configure notification preferences in the Settings tab. By default, you'll receive 
                  email alerts for high-risk threats detected in your messages.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserGuide;
