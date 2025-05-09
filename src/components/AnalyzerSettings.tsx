
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, ShieldAlert, Zap, Settings, Shield } from 'lucide-react';
import { AlertRule, updateAlertRule } from '@/services/phishingService';
import { useToast } from '@/hooks/use-toast';

interface AnalyzerSettingsProps {
  rules: AlertRule[];
  onRulesUpdated?: (rules: AlertRule[]) => void;
}

const AnalyzerSettings = ({ rules, onRulesUpdated }: AnalyzerSettingsProps) => {
  const [localRules, setLocalRules] = useState<AlertRule[]>(rules);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      const updatedRule = await updateAlertRule(id, { enabled });
      
      // Update local state
      setLocalRules(prevRules => 
        prevRules.map(rule => 
          rule.id === id ? { ...rule, enabled } : rule
        )
      );
      
      // Call the callback if provided
      if (onRulesUpdated) {
        onRulesUpdated(localRules.map(rule => rule.id === id ? { ...rule, enabled } : rule));
      }
      
      toast({
        title: "Detection rule updated",
        description: `${enabled ? "Enabled" : "Disabled"} the ${updatedRule.name} detection rule.`
      });
    } catch (error) {
      console.error("Failed to update rule:", error);
      toast({
        title: "Update failed",
        description: "Could not update the detection rule. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSensitivityChange = async (id: string, sensitivity: string) => {
    try {
      const updatedRule = await updateAlertRule(id, { sensitivity });
      
      // Update local state
      setLocalRules(prevRules => 
        prevRules.map(rule => 
          rule.id === id ? { ...rule, sensitivity } : rule
        )
      );
      
      // Call the callback if provided
      if (onRulesUpdated) {
        onRulesUpdated(localRules.map(rule => rule.id === id ? { ...rule, sensitivity } : rule));
      }
      
      toast({
        title: "Sensitivity updated",
        description: `Set ${updatedRule.name} sensitivity to ${sensitivity}.`
      });
    } catch (error) {
      console.error("Failed to update sensitivity:", error);
      toast({
        title: "Update failed",
        description: "Could not update the sensitivity setting. Please try again.",
        variant: "destructive"
      });
    }
  };

  const aiRules = localRules.filter(rule => rule.rule_type === 'ai_content');
  const domainRules = localRules.filter(rule => rule.rule_type === 'domain_spoof');
  const urlRules = localRules.filter(rule => rule.rule_type === 'urls');
  const otherRules = localRules.filter(rule => 
    !['ai_content', 'domain_spoof', 'urls'].includes(rule.rule_type)
  );

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Analyzer Settings
        </CardTitle>
        <CardDescription>
          Customize how the AI analyzer detects phishing threats
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="ai" className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5" /> AI Detection
            </TabsTrigger>
            <TabsTrigger value="domains" className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" /> Domains
            </TabsTrigger>
            <TabsTrigger value="urls" className="flex items-center gap-1">
              <ShieldAlert className="h-3.5 w-3.5" /> URLs
            </TabsTrigger>
            <TabsTrigger value="other" className="flex items-center gap-1">
              <Info className="h-3.5 w-3.5" /> Other
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai">
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>About AI Detection</AlertTitle>
              <AlertDescription>
                These settings control how the system identifies AI-generated phishing attempts, 
                which can be more sophisticated and harder to detect.
              </AlertDescription>
            </Alert>
            
            {aiRules.map(rule => (
              <div key={rule.id} className="py-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{rule.name}</h4>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                  </div>
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={(checked) => handleToggle(rule.id, checked)}
                  />
                </div>
                {rule.enabled && (
                  <div className="mt-4">
                    <Label htmlFor={`sensitivity-${rule.id}`}>Detection Sensitivity</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Button 
                        variant={rule.sensitivity === 'low' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => handleSensitivityChange(rule.id, 'low')}
                        className="flex-1"
                      >
                        Low
                      </Button>
                      <Button 
                        variant={rule.sensitivity === 'medium' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => handleSensitivityChange(rule.id, 'medium')}
                        className="flex-1"
                      >
                        Medium
                      </Button>
                      <Button 
                        variant={rule.sensitivity === 'high' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => handleSensitivityChange(rule.id, 'high')}
                        className="flex-1"
                      >
                        High
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {rule.sensitivity === 'low' && "Lower sensitivity reduces false positives but might miss sophisticated threats"}
                      {rule.sensitivity === 'medium' && "Balanced detection for most environments"}
                      {rule.sensitivity === 'high' && "Higher sensitivity catches more threats but may increase false positives"}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="domains">
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>About Domain Detection</AlertTitle>
              <AlertDescription>
                These settings determine how we identify domain spoofing attempts like "anazon.com" or "paypa1.com".
              </AlertDescription>
            </Alert>
            
            {domainRules.map(rule => (
              <div key={rule.id} className="py-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{rule.name}</h4>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                  </div>
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={(checked) => handleToggle(rule.id, checked)}
                  />
                </div>
                {rule.enabled && (
                  <div className="mt-4">
                    <Label htmlFor={`sensitivity-${rule.id}`}>Detection Sensitivity</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Button 
                        variant={rule.sensitivity === 'low' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => handleSensitivityChange(rule.id, 'low')}
                        className="flex-1"
                      >
                        Low
                      </Button>
                      <Button 
                        variant={rule.sensitivity === 'medium' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => handleSensitivityChange(rule.id, 'medium')}
                        className="flex-1"
                      >
                        Medium
                      </Button>
                      <Button 
                        variant={rule.sensitivity === 'high' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => handleSensitivityChange(rule.id, 'high')}
                        className="flex-1"
                      >
                        High
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {rule.sensitivity === 'low' && "Only detect obvious domain spoofing"}
                      {rule.sensitivity === 'medium' && "Detect moderate domain manipulation attempts"}
                      {rule.sensitivity === 'high' && "Detect even subtle domain variations and homograph attacks"}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="urls">
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>About URL Analysis</AlertTitle>
              <AlertDescription>
                Control how the system analyzes links for phishing indicators, redirects, and malicious patterns.
              </AlertDescription>
            </Alert>
            
            {urlRules.map(rule => (
              <div key={rule.id} className="py-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{rule.name}</h4>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                  </div>
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={(checked) => handleToggle(rule.id, checked)}
                  />
                </div>
                {rule.enabled && (
                  <div className="mt-4">
                    <Label htmlFor={`sensitivity-${rule.id}`}>Detection Sensitivity</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Button 
                        variant={rule.sensitivity === 'low' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => handleSensitivityChange(rule.id, 'low')}
                        className="flex-1"
                      >
                        Low
                      </Button>
                      <Button 
                        variant={rule.sensitivity === 'medium' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => handleSensitivityChange(rule.id, 'medium')}
                        className="flex-1"
                      >
                        Medium
                      </Button>
                      <Button 
                        variant={rule.sensitivity === 'high' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => handleSensitivityChange(rule.id, 'high')}
                        className="flex-1"
                      >
                        High
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {rule.sensitivity === 'low' && "Only flag obviously suspicious URLs"}
                      {rule.sensitivity === 'medium' && "Balanced detection for most link types"}
                      {rule.sensitivity === 'high' && "Strict URL checking, including URL shorteners and uncommon TLDs"}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="other">
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>Additional Settings</AlertTitle>
              <AlertDescription>
                Configure other detection rules like attachment scanning, urgency detection, and impersonation.
              </AlertDescription>
            </Alert>
            
            {otherRules.map(rule => (
              <div key={rule.id} className="py-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{rule.name}</h4>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                  </div>
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={(checked) => handleToggle(rule.id, checked)}
                  />
                </div>
                {rule.enabled && (
                  <div className="mt-4">
                    <Label htmlFor={`sensitivity-${rule.id}`}>Detection Sensitivity</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Button 
                        variant={rule.sensitivity === 'low' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => handleSensitivityChange(rule.id, 'low')}
                        className="flex-1"
                      >
                        Low
                      </Button>
                      <Button 
                        variant={rule.sensitivity === 'medium' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => handleSensitivityChange(rule.id, 'medium')}
                        className="flex-1"
                      >
                        Medium
                      </Button>
                      <Button 
                        variant={rule.sensitivity === 'high' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => handleSensitivityChange(rule.id, 'high')}
                        className="flex-1"
                      >
                        High
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          Settings are saved automatically
        </div>
      </CardFooter>
    </Card>
  );
};

export default AnalyzerSettings;
