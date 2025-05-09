
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Check, ThumbsDown, ThumbsUp, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AnalysisFeedbackProps {
  analysisId: string;
  riskLevel: 'low' | 'medium' | 'high';
  score: number;
}

const AnalysisFeedback: React.FC<AnalysisFeedbackProps> = ({ analysisId, riskLevel, score }) => {
  const [feedback, setFeedback] = useState<'accurate' | 'inaccurate' | null>(null);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!feedback) return;

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('analysis_feedback')
        .insert({
          analysis_id: analysisId,
          feedback_type: feedback,
          comments: comments,
          created_at: new Date().toISOString()
        });
        
      if (error) throw error;

      toast({
        title: "Feedback submitted",
        description: "Thank you for helping us improve our detection system.",
      });

      setIsOpen(false);
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your feedback.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <ThumbsUp className="h-3.5 w-3.5" />
          Give Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Was this analysis accurate?</DialogTitle>
          <DialogDescription>
            Your feedback helps improve our detection system and reduce false positives.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="flex justify-center gap-4">
            <Button 
              variant={feedback === 'accurate' ? 'default' : 'outline'} 
              className="flex-1 gap-2"
              onClick={() => setFeedback('accurate')}
            >
              <ThumbsUp className="h-4 w-4" />
              Accurate
            </Button>
            <Button 
              variant={feedback === 'inaccurate' ? 'default' : 'outline'} 
              className="flex-1 gap-2"
              onClick={() => setFeedback('inaccurate')}
            >
              <ThumbsDown className="h-4 w-4" />
              Inaccurate
            </Button>
          </div>

          <div>
            <Badge className={
              riskLevel === 'high' ? 'bg-red-500' :
              riskLevel === 'medium' ? 'bg-amber-500' : 
              'bg-green-500'
            }>
              {riskLevel.toUpperCase()} RISK ({score}%)
            </Badge>
          </div>
          
          {feedback === 'inaccurate' && (
            <div className="space-y-2">
              <label htmlFor="comments" className="text-sm font-medium">
                How could this analysis be improved?
              </label>
              <Textarea
                id="comments"
                placeholder="Please explain why you think this analysis was inaccurate..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="h-20"
              />
            </div>
          )}

          {feedback === 'accurate' && (
            <div className="space-y-2">
              <label htmlFor="comments" className="text-sm font-medium">
                Any additional comments? (Optional)
              </label>
              <Textarea
                id="comments"
                placeholder="Share any additional feedback..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="h-20"
              />
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between items-center sm:justify-between">
          <Button variant="outline" size="sm" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!feedback || isSubmitting}>
            <Check className="h-4 w-4 mr-1" /> {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisFeedback;
