
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  color?: 'default' | 'amber' | 'red' | 'green';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend,
  color = 'default'
}) => {
  const getColorClass = () => {
    switch (color) {
      case 'amber': return 'text-amber-500';
      case 'red': return 'text-red-500';
      case 'green': return 'text-green-500';
      default: return 'text-primary';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className={`text-2xl font-bold ${getColorClass()}`}>{value}</p>
              {trend && (
                <span className={`text-xs font-medium ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
                  {trend.positive ? '+' : ''}{trend.value}%
                </span>
              )}
            </div>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          {icon && <div className={`${getColorClass()}`}>{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
