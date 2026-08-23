import { ITask } from './TaskBoard';
import { TaskCard } from './TaskCard';
import { Clock, TrendingUp, Eye, CheckCircle2, AlertOctagon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type TaskColumnProps = {
  status: ITask['status'];
  tasks: ITask[];
  onTaskUpdate: () => void;
};

const statusConfig: Record<
  ITask['status'],
  { name: string; badgeVariant: 'secondary' | 'info' | 'warning' | 'success' | 'destructive'; icon: React.ElementType }
> = {
  TODO: {
    name: 'To Do',
    badgeVariant: 'secondary',
    icon: Clock,
  },
  IN_PROGRESS: {
    name: 'In Progress',
    badgeVariant: 'info',
    icon: TrendingUp,
  },
  IN_REVIEW: {
    name: 'In Review',
    badgeVariant: 'warning',
    icon: Eye,
  },
  COMPLETED: {
    name: 'Completed',
    badgeVariant: 'success',
    icon: CheckCircle2,
  },
  BLOCKED: {
    name: 'Blocked',
    badgeVariant: 'destructive',
    icon: AlertOctagon,
  },
};

export function TaskColumn({ status, tasks, onTaskUpdate }: TaskColumnProps) {
  const { name, badgeVariant, icon: StatusIcon } = statusConfig[status];

  return (
    <div className="bg-muted/40 rounded-lg p-3 flex flex-col h-full border border-border/50 min-h-[500px]">
      <div className="flex items-center justify-between pb-3 border-b mb-3">
        <div className="flex items-center gap-2">
          <StatusIcon className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">{name}</h3>
        </div>
        <Badge variant={badgeVariant} className="rounded-full text-[11px] px-2 py-0">
          {tasks.length}
        </Badge>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 pr-0.5">
        {tasks.length === 0 ? (
          <div className="h-32 flex items-center justify-center border border-dashed rounded-md text-xs text-muted-foreground">
            No tasks in {name}
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task._id} task={task} onTaskUpdate={onTaskUpdate} />
          ))
        )}
      </div>
    </div>
  );
}
