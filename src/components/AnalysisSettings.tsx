
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertCircle, Check, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface ThresholdSettings {
  minConfidenceRequired: number;
  autoReportHighRisk: boolean;
  showDetailedIndicators: boolean;
  falsePositiveProtection: boolean;
}

const AnalysisSettings = () => {
  const [settings, setSettings] = useState<ThresholdSettings>({
    minConfidenceRequired: 70,
    autoReportHighRisk: true,
    showDetailedIndicators: true,
    falsePositiveProtection: true
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setSettings({
            minConfidenceRequired: data.min_confidence_threshold || 70,
            autoReportHighRisk: data.auto_report_high_risk || true,
            showDetailedIndicators: data.show_detailed_indicators || true,
            falsePositiveProtection: data.false_positive_protection || true
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [user]);

  const saveSettings = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          min_confidence_threshold: settings.minConfidenceRequired,
          auto_report_high_risk: settings.autoReportHighRisk,
          show_detailed_indicators: settings.showDetailedIndicators,
          false_positive_protection: settings.falsePositiveProtection,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      toast({
        title: "Settings saved",
        description: "Your analysis settings have been updated.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Settings not saved",
        description: "There was a problem saving your settings.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Settings</CardTitle>
        <CardDescription>
          Adjust how the AI analyzes content to reduce false positives and customize your experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="confidence-threshold" className="font-medium">
                Minimum Confidence Threshold
              </Label>
              <span className="text-sm font-medium">{settings.minConfidenceRequired}%</span>
            </div>
            <Slider
              id="confidence-threshold"
              min={50}
              max={95}
              step={5}
              value={[settings.minConfidenceRequired]}
              onValueChange={(values) => setSettings({...settings, minConfidenceRequired: values[0]})}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
              <Info className="h-3 w-3 mr-1" />
              Higher values reduce false positives but might miss some threats
            </p>
          </div>

          <div className="flex items-center justify-between space-x-2 pt-2">
            <div className="space-y-0.5">
              <Label htmlFor="false-positive">False Positive Protection</Label>
              <p className="text-xs text-muted-foreground">
                Apply additional verification for borderline cases
              </p>
            </div>
            <Switch
              id="false-positive"
              checked={settings.falsePositiveProtection}
              onCheckedChange={(checked) => setSettings({...settings, falsePositiveProtection: checked})}
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between space-x-2 pt-2">
            <div className="space-y-0.5">
              <Label htmlFor="auto-report">Auto-Report High Risk</Label>
              <p className="text-xs text-muted-foreground">
                Automatically send reports for high-risk detections
              </p>
            </div>
            <Switch
              id="auto-report"
              checked={settings.autoReportHighRisk}
              onCheckedChange={(checked) => setSettings({...settings, autoReportHighRisk: checked})}
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between space-x-2 pt-2">
            <div className="space-y-0.5">
              <Label htmlFor="detailed-indicators">Detailed Indicators</Label>
              <p className="text-xs text-muted-foreground">
                Show detailed breakdown of detected indicators
              </p>
            </div>
            <Switch
              id="detailed-indicators"
              checked={settings.showDetailedIndicators}
              onCheckedChange={(checked) => setSettings({...settings, showDetailedIndicators: checked})}
              disabled={loading}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <div className="flex items-center text-xs text-muted-foreground">
          <AlertCircle className="h-3 w-3 mr-1" />
          Settings affect future analyses only
        </div>
        <Button onClick={saveSettings} disabled={saving || loading}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AnalysisSettings;
