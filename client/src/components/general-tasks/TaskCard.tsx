import { useState } from 'react';
import { ITask } from './TaskBoard';
import TaskModal from './TaskModal';
import { Clock, MessageSquare, AlignmentLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type TaskCardProps = {
  task: ITask;
  onTaskUpdate: () => void;
};

export function TaskCard({ task, onTaskUpdate }: TaskCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getPriorityBadge = (priority: ITask['priority']) => {
    switch (priority) {
      case 'HIGH':
        return <Badge variant="destructive">High</Badge>;
      case 'MEDIUM':
        return <Badge variant="warning">Medium</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  return (
    <>
      <Card
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer hover:shadow-md transition-all duration-200 border-border/60 hover:border-primary/40 group"
      >
        <CardHeader className="p-4 pb-2 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors line-clamp-2">
              {task.title}
            </CardTitle>
            {getPriorityBadge(task.priority)}
          </div>
        </CardHeader>

        {task.description && (
          <CardContent className="px-4 py-1 text-sm text-muted-foreground line-clamp-2 flex items-start gap-1.5">
            <AlignmentLeft className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground/70" />
            <span>{task.description}</span>
          </CardContent>
        )}

        <CardFooter className="p-4 pt-3 flex items-center justify-between border-t border-border/40 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.assignedTo?.profileImage} alt={task.assignedTo?.name} />
              <AvatarFallback className="text-[10px] bg-primary/10">
                {task.assignedTo?.name ? task.assignedTo.name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="truncate max-w-[100px] font-medium">{task.assignedTo?.name || 'Unassigned'}</span>
          </div>

          <div className="flex items-center gap-3">
            {task.comments && task.comments.length > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>{task.comments.length}</span>
              </div>
            )}
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}</span>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskToEdit={task}
        onTaskSave={onTaskUpdate}
      />
    </>
  );
}
