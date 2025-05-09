
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ShieldAlert, ShieldCheck, Shield } from 'lucide-react';

interface SecurityScoreProps {
  score: number;
}

const SecurityScore: React.FC<SecurityScoreProps> = ({ score }) => {
  const getScoreColor = () => {
    if (score >= 75) return 'text-alert-green';
    if (score >= 50) return 'text-amber-500';
    return 'text-alert-red';
  };

  const getScoreIcon = () => {
    if (score >= 75) return <ShieldCheck className={`h-6 w-6 text-alert-green`} />;
    if (score >= 50) return <Shield className={`h-6 w-6 text-amber-500`} />;
    return <ShieldAlert className={`h-6 w-6 text-alert-red`} />;
  };

  const getScoreText = () => {
    if (score >= 75) return 'Excellent';
    if (score >= 50) return 'Moderate';
    return 'At Risk';
  };

  const getProgressColor = () => {
    if (score >= 75) return 'bg-alert-green';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-alert-red';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Organization Security Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {getScoreIcon()}
            <span className={`font-medium ${getScoreColor()}`}>{getScoreText()}</span>
          </div>
          <span className={`text-2xl font-bold ${getScoreColor()}`}>{score}/100</span>
        </div>
        <Progress value={score} className={`h-2 ${getProgressColor()}`} />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center p-2 bg-muted rounded">
            <div className="text-sm text-muted-foreground">Detection Rate</div>
            <div className="font-medium">98%</div>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <div className="text-sm text-muted-foreground">Response Time</div>
            <div className="font-medium">1.2s</div>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <div className="text-sm text-muted-foreground">Protected Users</div>
            <div className="font-medium">24/25</div>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <div className="text-sm text-muted-foreground">Threats Blocked</div>
            <div className="font-medium">132</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityScore;
