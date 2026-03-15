import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
    comparison: string;
  };
  alert?: {
    message: string;
    type: 'warning' | 'danger';
  };
  sparklineData?: number[];
  icon?: React.ReactNode;
}

export function KPICard({ title, value, trend, alert, sparklineData, icon }: KPICardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {value}
        </div>
        
        {trend && (
          <div className="flex items-center gap-2 mt-2">
            <Badge 
              variant={trend.isPositive ? "default" : "destructive"}
              className="flex items-center gap-1 text-xs"
              style={{
                backgroundColor: trend.isPositive ? '#22C55E' : '#EF4444',
              }}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(trend.value)}%
            </Badge>
            <span className="text-xs text-muted-foreground">{trend.comparison}</span>
          </div>
        )}

        {alert && (
          <div 
            className={`flex items-center gap-2 mt-2 p-2 rounded-md text-xs ${
              alert.type === 'warning' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'
            }`}
          >
            <AlertCircle className="h-3 w-3" />
            <span>{alert.message}</span>
          </div>
        )}

        {sparklineData && sparklineData.length > 0 && (
          <div className="mt-4 h-12 flex items-end gap-1">
            {sparklineData.map((value, index) => (
              <div
                key={index}
                className="flex-1 bg-primary/20 rounded-t-sm"
                style={{
                  height: `${(value / Math.max(...sparklineData)) * 100}%`,
                }}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
