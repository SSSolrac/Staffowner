import { Badge } from './ui/badge';

export type OrderStatus = 'Pending' | 'Accepted' | 'Preparing' | 'Ready' | 'Completed' | 'Declined';
export type Priority = 'Normal' | 'Urgent';

interface StatusChipProps {
  status: OrderStatus;
}

export function StatusChip({ status }: StatusChipProps) {
  const statusConfig: Record<OrderStatus, { bg: string; text: string }> = {
    Pending: { bg: '#F59E0B', text: '#FFFFFF' },
    Accepted: { bg: '#3B82F6', text: '#FFFFFF' },
    Preparing: { bg: '#8B5CF6', text: '#FFFFFF' },
    Ready: { bg: '#22C55E', text: '#FFFFFF' },
    Completed: { bg: '#6B7280', text: '#FFFFFF' },
    Declined: { bg: '#EF4444', text: '#FFFFFF' },
  };

  const config = statusConfig[status];

  return (
    <Badge
      className="text-xs font-medium"
      style={{
        backgroundColor: config.bg,
        color: config.text,
      }}
    >
      {status}
    </Badge>
  );
}

interface PriorityTagProps {
  priority: Priority;
}

export function PriorityTag({ priority }: PriorityTagProps) {
  const isUrgent = priority === 'Urgent';

  return (
    <Badge
      variant={isUrgent ? 'destructive' : 'secondary'}
      className="text-xs"
      style={isUrgent ? { backgroundColor: '#FF4F8B' } : {}}
    >
      {priority}
    </Badge>
  );
}
