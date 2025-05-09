
import React from 'react';
import { format, parseISO } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { DetectedEmail } from '@/lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from 'react';

interface DetectionTableProps {
  detections: DetectedEmail[];
  onMarkSafe: (id: string) => void;
  onReport: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const DetectionTable: React.FC<DetectionTableProps> = ({
  detections,
  onMarkSafe,
  onReport,
  onViewDetails
}) => {
  const [selectedDetection, setSelectedDetection] = useState<DetectedEmail | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const getRiskBadge = (risk: 'low' | 'medium' | 'high') => {
    const baseClasses = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";
    
    switch (risk) {
      case 'high':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <ShieldAlert className="w-3 h-3 mr-1" /> High
          </span>
        );
      case 'medium':
        return (
          <span className={`${baseClasses} bg-amber-100 text-amber-800`}>
            <Shield className="w-3 h-3 mr-1" /> Medium
          </span>
        );
      case 'low':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <ShieldCheck className="w-3 h-3 mr-1" /> Low
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'new':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>New</span>;
      case 'reviewed':
        return <span className={`${baseClasses} bg-purple-100 text-purple-800`}>Reviewed</span>;
      case 'safe':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Safe</span>;
      case 'reported':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Reported</span>;
    }
  };

  const handleViewDetails = (detection: DetectedEmail) => {
    setSelectedDetection(detection);
    setDetailsOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Detections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risk</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Indicators</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detections.map((detection) => (
                <TableRow key={detection.id}>
                  <TableCell>
                    {getRiskBadge(detection.riskLevel)}
                    <div className="mt-1 text-xs text-muted-foreground">{detection.riskScore}%</div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {detection.subject}
                    <div className="mt-1 text-xs text-muted-foreground line-clamp-1">
                      {detection.excerpt}
                    </div>
                  </TableCell>
                  <TableCell>{detection.sender}</TableCell>
                  <TableCell>{format(parseISO(detection.receivedAt), 'MMM d, h:mm a')}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {detection.indicators.map((indicator, i) => (
                        <span 
                          key={i}
                          className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100"
                        >
                          {indicator}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(detection.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewDetails(detection)}
                      >
                        Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onMarkSafe(detection.id)}
                        disabled={detection.status === 'safe'}
                      >
                        Safe
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => onReport(detection.id)}
                        disabled={detection.status === 'reported'}
                      >
                        Report
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Detection Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-3xl">
            {selectedDetection && (
              <>
                <DialogHeader>
                  <DialogTitle>Detection Details</DialogTitle>
                  <DialogDescription>
                    Analyzed on {format(parseISO(selectedDetection.receivedAt), 'MMMM d, yyyy h:mm a')}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className={`p-4 rounded-md ${
                    selectedDetection.riskLevel === 'high' ? 'bg-red-50 border border-red-200' :
                    selectedDetection.riskLevel === 'medium' ? 'bg-amber-50 border border-amber-200' :
                    'bg-green-50 border border-green-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {selectedDetection.riskLevel === 'high' && <ShieldAlert className="h-5 w-5 text-red-500" />}
                      {selectedDetection.riskLevel === 'medium' && <ShieldAlert className="h-5 w-5 text-amber-500" />}
                      {selectedDetection.riskLevel === 'low' && <ShieldCheck className="h-5 w-5 text-green-500" />}
                      <h3 className="font-medium">
                        {selectedDetection.riskLevel === 'high' && 'High Risk - Likely Phishing'}
                        {selectedDetection.riskLevel === 'medium' && 'Medium Risk - Suspicious Content'}
                        {selectedDetection.riskLevel === 'low' && 'Low Risk - Likely Safe'}
                      </h3>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Risk Score</span>
                      <span className={`font-bold ${
                        selectedDetection.riskLevel === 'high' ? 'text-red-500' : 
                        selectedDetection.riskLevel === 'medium' ? 'text-amber-500' : 
                        'text-green-500'
                      }`}>
                        {selectedDetection.riskScore}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full ${
                          selectedDetection.riskLevel === 'high' ? 'bg-red-500' : 
                          selectedDetection.riskLevel === 'medium' ? 'bg-amber-500' : 
                          'bg-green-500'
                        }`}
                        style={{ width: `${selectedDetection.riskScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/20 rounded-md">
                    <h4 className="font-medium mb-2">From: {selectedDetection.sender}</h4>
                    <h4 className="font-medium mb-2">Subject: {selectedDetection.subject}</h4>
                    <div className="max-h-[300px] overflow-auto p-3 bg-muted/10 rounded border border-muted/20 mt-3">
                      <p className="whitespace-pre-wrap">{selectedDetection.excerpt}</p>
                    </div>
                  </div>

                  {selectedDetection.indicators.length > 0 && (
                    <div className="p-4 bg-muted/20 rounded-md">
                      <h4 className="font-medium mb-2">Detected Indicators:</h4>
                      <ul className="space-y-1">
                        {selectedDetection.indicators.map((indicator, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600">
                              <ShieldAlert className="h-3 w-3" />
                            </span>
                            {indicator}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="p-4 bg-muted/20 rounded-md">
                    <h4 className="font-medium mb-2">Status: {getStatusBadge(selectedDetection.status)}</h4>
                  </div>
                </div>
                <DialogFooter className="flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setDetailsOpen(false)}
                  >
                    Close
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        onMarkSafe(selectedDetection.id);
                        setDetailsOpen(false);
                      }}
                      disabled={selectedDetection.status === 'safe'}
                    >
                      Mark as Safe
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        onReport(selectedDetection.id);
                        setDetailsOpen(false);
                      }}
                      disabled={selectedDetection.status === 'reported'}
                    >
                      Report as Phishing
                    </Button>
                  </div>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DetectionTable;
