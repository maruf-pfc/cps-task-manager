import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
  marketingTaskSchema,
  type MarketingTaskFormData,
} from '@/lib/validations';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface User {
  _id: string;
  name: string;
  profileImage?: string;
}

interface MarketingTask {
  _id?: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'BLOCKED';
  priority: 'NORMAL' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  assignedTo?: User;
  reportedTo?: User;
  type?: string;
  startDate?: string;
  notes?: string;
}

interface MarketingTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<MarketingTask, '_id'>) => void;
  users: User[];
  task: MarketingTask | null;
}

export default function MarketingTaskModal({
  isOpen,
  onClose,
  onSave,
  users,
  task,
}: MarketingTaskModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MarketingTaskFormData>({
    resolver: zodResolver(marketingTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'TODO',
      priority: 'NORMAL',
      assignedTo: '',
      reportedTo: '',
      startDate: '',
      dueDate: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo?._id || '',
        reportedTo: task.reportedTo?._id || '',
        startDate: task.startDate
          ? new Date(task.startDate).toISOString().slice(0, 10)
          : '',
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().slice(0, 10)
          : '',
        notes: task.notes || '',
      });
    } else {
      reset({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'NORMAL',
        assignedTo: users[0]?._id || '',
        reportedTo: users[0]?._id || '',
        startDate: '',
        dueDate: '',
        notes: '',
      });
    }
  }, [task, users, reset]);

  const onSubmit = (data: MarketingTaskFormData) => {
    try {
      const assignedUser = users.find((u) => u._id === data.assignedTo);
      const reportedUser = users.find((u) => u._id === data.reportedTo);

      onSave({
        ...task,
        ...data,
        assignedTo: assignedUser,
        reportedTo: reportedUser,
      } as MarketingTask);
      onClose();
    } catch (error) {
      toast.error('Error saving marketing task');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {task ? 'Edit Marketing Task' : 'New Email Marketing Campaign'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Campaign / Task Title</Label>
            <Input id="title" {...register('title')} placeholder="e.g. Batch 12 Orientation Newsletter" />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} placeholder="Target audience, objectives..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select id="status" {...register('status')}>
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="IN_REVIEW">IN_REVIEW</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="BLOCKED">BLOCKED</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select id="priority" {...register('priority')}>
                <option value="NORMAL">NORMAL</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned Member</Label>
              <Select id="assignedTo" {...register('assignedTo')}>
                <option value="">Select assigned user</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reportedTo">Reported To</Label>
              <Select id="reportedTo" {...register('reportedTo')}>
                <option value="">Select manager</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" {...register('startDate')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" {...register('dueDate')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...register('notes')} placeholder="Campaign notes & metrics..." />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
