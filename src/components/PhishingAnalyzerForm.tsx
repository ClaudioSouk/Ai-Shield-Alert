import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { analyzePhishingMessage } from '@/services/phishingService';
import { Loader2, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AnalysisFeedback from './AnalysisFeedback';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const PhishingAnalyzerForm: React.FC = () => {
  const [message, setMessage] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    riskLevel: 'low' | 'medium' | 'high';
    explanation: string;
    confidenceLevel: 'low' | 'medium' | 'high';
    id?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleAnalyze = async () => {
    if (!message.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message to analyze",
        variant: "destructive"
      });
      return;
    }

    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }

    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzePhishingMessage(message);
      setResult(analysisResult);
    } catch (err: any) {
      setError(err.message || "Failed to analyze message");
      toast({
        title: "Analysis failed",
        description: err.message || "There was a problem analyzing the message",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getRiskIcon = (riskLevel?: 'low' | 'medium' | 'high') => {
    switch (riskLevel) {
      case 'high':
        return <ShieldAlert className="h-8 w-8 text-red-500" />;
      case 'medium':
        return <Shield className="h-8 w-8 text-amber-500" />;
      case 'low':
        return <ShieldCheck className="h-8 w-8 text-green-500" />;
      default:
        return <Shield className="h-8 w-8 text-gray-400" />;
    }
  };

  const getRiskColor = (riskLevel?: 'low' | 'medium' | 'high') => {
    switch (riskLevel) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'medium':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'low':
        return 'bg-green-50 border-green-200 text-green-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Phishing Email Analyzer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Paste the suspicious email or message content here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[200px]"
              disabled={analyzing}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={handleAnalyze}
            disabled={analyzing || !message.trim()}
            className="w-full sm:w-auto"
          >
            {analyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {analyzing ? 'Analyzing...' : 'Analyze Message'}
          </Button>
        </CardFooter>
      </Card>

      {/* Login Required Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>You need to be logged in first</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {result && (
        <Card className="mt-8">
          <CardHeader className={`${getRiskColor(result.riskLevel)} border-b`}>
            <div className="flex items-center gap-4">
              {getRiskIcon(result.riskLevel)}
              <div>
                <CardTitle>
                  {result.riskLevel === 'high' && 'High Risk - Likely Phishing'}
                  {result.riskLevel === 'medium' && 'Medium Risk - Suspicious Content'}
                  {result.riskLevel === 'low' && 'Low Risk - Likely Safe'}
                </CardTitle>
                <p className="text-sm opacity-80 mt-1">
                  Risk score: {result.score}% | Confidence: {result.confidenceLevel.toUpperCase()}
                </p>
              </div>

              {/* Add the feedback component */}
              <div className="ml-auto">
                {result.id && (
                  <AnalysisFeedback
                    analysisId={result.id}
                    riskLevel={result.riskLevel}
                    score={result.score}
                  />
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2">Analysis Explanation:</h3>
            <div className="whitespace-pre-wrap text-gray-700">
              {result.explanation.split('\n').map((line, i) => (
                <p key={i} className="mb-2">
                  {line}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="mt-8 border-red-200">
          <CardContent className="pt-6">
            <div className="text-red-600">
              <h3 className="font-medium mb-2">Error:</h3>
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PhishingAnalyzerForm;
