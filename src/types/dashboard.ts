
import { AlertRule } from '@/services/phishingService';

export interface AlertRulesCardProps {
  rules: AlertRule[];
  onRuleToggle: (id: string, enabled: boolean) => void;
  onSensitivityChange: (id: string, sensitivity: string) => void;
}
