import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface Task {
  _id: string;
  title: string;
  createdAt: string;
  assignedTo?: {
    name: string;
  };
}

interface RecentTasksListProps {
  tasks: Task[];
  title?: string;
}

export function RecentTasksList({
  tasks,
  title = 'Recently Created Tasks',
}: RecentTasksListProps) {
  return (
    <Card className="h-full flex flex-col border-border/60">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-1 flex flex-col justify-between space-y-3">
        {tasks && tasks.length > 0 ? (
          <ul className="divide-y divide-border/40 text-xs">
            {tasks.map((task) => (
              <li key={task._id} className="py-2.5 flex items-center justify-between gap-2">
                <span className="font-medium text-foreground truncate">{task.title}</span>
                <span className="text-muted-foreground shrink-0 text-[11px]">
                  {task.createdAt ? formatDistanceToNow(new Date(task.createdAt), { addSuffix: true }) : ''}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-muted-foreground italic py-4 text-center">No recent tasks found.</p>
        )}

        <div className="pt-2 border-t border-border/40">
          <Link
            href="/general-tasks"
            className="text-xs text-primary hover:underline font-semibold"
          >
            View All Tasks →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
