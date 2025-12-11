import { cn } from '@/lib/utils';

type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';

interface StatusBadgeProps {
  status: IssueStatus;
  className?: string;
}

const statusConfig = {
  OPEN: {
    label: 'Open',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  },
  RESOLVED: {
    label: 'Resolved',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
