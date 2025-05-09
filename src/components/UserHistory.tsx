import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, FileSearch, RefreshCw, Trash2, AlertCircle } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fetchUserPhishingAnalyses, deletePhishingAnalysis } from '@/services/phishingService';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface HistoryItem {
  id: string;
  message: string;
  score: number;
  risk_level: 'low' | 'medium' | 'high';
  explanation: string;
  confidence_level: 'low' | 'medium' | 'high';
  created_at: string;
}

const UserHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching history data...");
      const data = await fetchUserPhishingAnalyses();
      console.log("History data received:", data?.length || 0, "items");
      setHistory(data || []);
    } catch (err: any) {
      console.error("Error fetching history:", err);
      setError(err.message || 'Failed to load history');
      toast({
        title: 'Error',
        description: 'Could not load your phishing detection history. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleRefresh = () => {
    fetchHistory();
    toast({
      title: 'Refreshed',
      description: 'Your history has been updated.',
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePhishingAnalysis(id);
      setHistory(history.filter(item => item.id !== id));
      toast({
        title: 'Deleted',
        description: 'The analysis has been removed from your history.',
      });
      setIsDeleteDialogOpen(false);
    } catch (err: any) {
      toast({
        title: 'Delete failed',
        description: err.message || 'Could not delete the analysis. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const showDeleteConfirm = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const showDetails = (item: HistoryItem) => {
    setSelectedItem(item);
    setIsDetailsDialogOpen(true);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Detection History</CardTitle>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <FileSearch className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg">No detection history</h3>
            <p className="text-muted-foreground">
              You haven't analyzed any content yet. Try the analyzer to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-auto max-h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead className="hidden md:table-cell">Content Preview</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(item.created_at), 'MMM d, yyyy')}
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(item.created_at), 'h:mm a')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.risk_level === 'high' ? (
                          <>
                            <ShieldAlert className="h-4 w-4 text-red-500" />
                            <Badge variant="destructive">High Risk</Badge>
                          </>
                        ) : item.risk_level === 'medium' ? (
                          <>
                            <ShieldAlert className="h-4 w-4 text-amber-500" />
                            <Badge variant="outline" className="border-amber-500 text-amber-700">
                              Medium
                            </Badge>
                          </>
                        ) : (
                          <>
                            <Shield className="h-4 w-4 text-green-500" />
                            <Badge variant="outline" className="border-green-500 text-green-700">
                              Low
                            </Badge>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={
                        item.risk_level === 'high' ? 'text-red-500 font-bold' :
                        item.risk_level === 'medium' ? 'text-amber-500 font-semibold' :
                        'text-green-500'
                      }>
                        {item.score}%
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="max-w-md truncate">
                        {item.message?.substring(0, 100)}
                        {item.message?.length > 100 ? '...' : ''}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.explanation?.substring(0, 120)}
                        {item.explanation?.length > 120 ? '...' : ''}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2" 
                        onClick={() => showDetails(item)}
                      >
                        View
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50" 
                        onClick={() => showDeleteConfirm(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this analysis from your history.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Analysis Details</DialogTitle>
            <DialogDescription>
              Analyzed on {selectedItem && format(new Date(selectedItem.created_at), 'MMMM d, yyyy h:mm a')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div className={`p-4 rounded-md ${
                selectedItem.risk_level === 'high' ? 'bg-red-50 border border-red-200' :
                selectedItem.risk_level === 'medium' ? 'bg-amber-50 border border-amber-200' :
                'bg-green-50 border border-green-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {selectedItem.risk_level === 'high' && <ShieldAlert className="h-5 w-5 text-red-500" />}
                  {selectedItem.risk_level === 'medium' && <ShieldAlert className="h-5 w-5 text-amber-500" />}
                  {selectedItem.risk_level === 'low' && <Shield className="h-5 w-5 text-green-500" />}
                  <h3 className="font-medium">
                    {selectedItem.risk_level === 'high' && 'High Risk - Likely Phishing'}
                    {selectedItem.risk_level === 'medium' && 'Medium Risk - Suspicious Content'}
                    {selectedItem.risk_level === 'low' && 'Low Risk - Likely Safe'}
                  </h3>
                </div>
                
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Risk Score</span>
                  <span className={`font-bold ${
                    selectedItem.risk_level === 'high' ? 'text-red-500' : 
                    selectedItem.risk_level === 'medium' ? 'text-amber-500' : 
                    'text-green-500'
                  }`}>
                    {selectedItem.score}%
                  </span>
                </div>
                
                <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full ${
                      selectedItem.risk_level === 'high' ? 'bg-red-500' : 
                      selectedItem.risk_level === 'medium' ? 'bg-amber-500' : 
                      'bg-green-500'
                    }`}
                    style={{ width: `${selectedItem.score}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Analysis</h4>
                  <div className="p-4 bg-muted/20 rounded-md">
                    <p>{selectedItem.explanation}</p>
                    
                    <div className="mt-3 flex items-center">
                      <span className="text-xs text-muted-foreground mr-2">Confidence:</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        selectedItem.confidence_level === 'high' ? 'bg-green-100 text-green-800' : 
                        selectedItem.confidence_level === 'medium' ? 'bg-amber-100 text-amber-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedItem.confidence_level.charAt(0).toUpperCase() + selectedItem.confidence_level.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Message Content</h4>
                  <div className="p-4 bg-muted/20 rounded-md max-h-[300px] overflow-auto">
                    <pre className="whitespace-pre-wrap break-words text-sm">{selectedItem.message}</pre>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                  Close
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    setIsDetailsDialogOpen(false);
                    showDeleteConfirm(selectedItem.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UserHistory;
