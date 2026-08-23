import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { classSchema, type ClassFormData } from '@/lib/validations';
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

export interface Class {
  _id?: string;
  courseName: 'CPC' | 'JIPC' | 'Bootcamp' | 'Others';
  batchNo: number;
  classNo: number;
  classTitle: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'BLOCKED';
  priority: 'NORMAL' | 'MEDIUM' | 'HIGH';
  assignedTo: User;
  reportedTo: User;
  startDate?: string;
  dueDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (classItem: Class) => void;
  users: User[];
  classItem: Class | null;
}

export default function ClassModal({
  isOpen,
  onClose,
  onSave,
  users,
  classItem,
}: ClassModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      courseName: 'CPC',
      batchNo: 1,
      classNo: 1,
      classTitle: '',
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
    if (classItem) {
      reset({
        courseName: classItem.courseName,
        batchNo: classItem.batchNo,
        classNo: classItem.classNo,
        classTitle: classItem.classTitle,
        description: classItem.description || '',
        status: classItem.status,
        priority: classItem.priority,
        assignedTo: classItem.assignedTo?._id || '',
        reportedTo: classItem.reportedTo?._id || '',
        startDate: classItem.startDate
          ? new Date(classItem.startDate).toISOString().slice(0, 10)
          : '',
        dueDate: classItem.dueDate
          ? new Date(classItem.dueDate).toISOString().slice(0, 10)
          : '',
        notes: classItem.notes || '',
      });
    } else {
      reset({
        courseName: 'CPC',
        batchNo: 1,
        classNo: 1,
        classTitle: '',
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
  }, [classItem, users, reset]);

  const onSubmit = (data: ClassFormData) => {
    try {
      const assignedUser = users.find((u) => u._id === data.assignedTo) || {
        _id: data.assignedTo,
        name: 'Unknown',
      };
      const reportedUser = users.find((u) => u._id === data.reportedTo) || {
        _id: data.reportedTo,
        name: 'Unknown',
      };

      onSave({
        ...classItem,
        ...data,
        assignedTo: assignedUser,
        reportedTo: reportedUser,
      } as Class);
      onClose();
    } catch (error) {
      toast.error('Error saving class');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {classItem ? 'Edit Class' : 'Create Class Task'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="courseName">Course</Label>
              <Select id="courseName" {...register('courseName')}>
                <option value="CPC">CPC</option>
                <option value="JIPC">JIPC</option>
                <option value="Bootcamp">Bootcamp</option>
                <option value="Others">Others</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="batchNo">Batch No.</Label>
              <Input
                id="batchNo"
                type="number"
                {...register('batchNo', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classNo">Class No.</Label>
              <Input
                id="classNo"
                type="number"
                {...register('classNo', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="classTitle">Class Title</Label>
            <Input id="classTitle" {...register('classTitle')} placeholder="e.g. Graph Algorithms - BFS & DFS" />
            {errors.classTitle && (
              <p className="text-xs text-destructive">{errors.classTitle.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} placeholder="Class overview and topic details" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned Trainer</Label>
              <Select id="assignedTo" {...register('assignedTo')}>
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
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Textarea id="notes" {...register('notes')} placeholder="Additional instructions..." />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : classItem ? 'Update Class' : 'Create Class'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
