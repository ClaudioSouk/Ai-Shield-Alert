
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertRule, updateAlertRule } from '@/services/phishingService';
import { Loader2, AlertCircle } from 'lucide-react';
import { AlertRulesCardProps } from '@/types/dashboard';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AlertRulesCard: React.FC<AlertRulesCardProps> = ({ 
  rules = [], // Provide default empty array
  onRuleToggle,
  onSensitivityChange
}) => {
  const { toast } = useToast();
  const [updatingRules, setUpdatingRules] = useState<Record<string, boolean>>({});

  const handleRuleToggle = async (id: string, enabled: boolean) => {
    try {
      setUpdatingRules(prev => ({ ...prev, [id]: true }));
      await updateAlertRule(id, { enabled });
      onRuleToggle(id, enabled);
      toast({
        title: `Rule ${enabled ? 'enabled' : 'disabled'}`,
        description: `The rule has been ${enabled ? 'enabled' : 'disabled'}.`
      });
    } catch (error) {
      console.error("Error updating rule:", error);
      toast({
        title: "Update failed",
        description: "Could not update the rule. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUpdatingRules(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleSensitivityChange = async (id: string, sensitivity: string) => {
    try {
      setUpdatingRules(prev => ({ ...prev, [id]: true }));
      await updateAlertRule(id, { sensitivity });
      onSensitivityChange(id, sensitivity);
      toast({
        title: "Sensitivity updated",
        description: `The sensitivity has been updated to ${sensitivity}.`
      });
    } catch (error) {
      console.error("Error updating sensitivity:", error);
      toast({
        title: "Update failed",
        description: "Could not update the sensitivity. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUpdatingRules(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert Rules Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        {rules.length === 0 ? (
          <div className="text-center py-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No alert rules found. They may still be loading or need to be created.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    {updatingRules[rule.id] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Switch 
                        id={`rule-${rule.id}`}
                        checked={rule.enabled}
                        onCheckedChange={(checked) => handleRuleToggle(rule.id, checked)}
                      />
                    )}
                    <label 
                      htmlFor={`rule-${rule.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {rule.name}
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground">{rule.description}</p>
                </div>
                <Select 
                  value={rule.sensitivity} 
                  onValueChange={(value) => handleSensitivityChange(rule.id, value)}
                  disabled={!rule.enabled || updatingRules[rule.id]}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Sensitivity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertRulesCard;
