
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Files, FileSpreadsheet, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface ExportReportButtonProps {
  className?: string;
}

const ExportReportButton: React.FC<ExportReportButtonProps> = ({ className }) => {
  const { toast } = useToast();
  const [exporting, setExporting] = useState<string | null>(null);
  
  const handleExport = (format: string) => {
    setExporting(format);
    
    // Simulate export process
    setTimeout(() => {
      setExporting(null);
      
      toast({
        title: `Report exported as ${format}`,
        description: `Your security report has been exported successfully as ${format}.`,
      });
    }, 1500);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`flex items-center gap-2 ${className}`}
          disabled={!!exporting}
        >
          {exporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Exporting {exporting}...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="text-xs font-medium px-2 py-1.5 text-muted-foreground">
          Export Security Report
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport('PDF')} disabled={!!exporting} className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span>Export as PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('CSV')} disabled={!!exporting} className="flex items-center gap-2">
          <Files className="h-4 w-4 text-muted-foreground" />
          <span>Export as CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('Excel')} disabled={!!exporting} className="flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          <span>Export as Excel</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportReportButton;
