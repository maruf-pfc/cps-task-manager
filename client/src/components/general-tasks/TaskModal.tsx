'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { ITask } from './TaskBoard';
import { CommentSection } from './CommentSection';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, type TaskFormData } from '@/lib/validations';
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
  email: string;
  profileImage?: string;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: ITask | null;
  onTaskSave: () => void;
}

export default function TaskModal({
  isOpen,
  onClose,
  taskToEdit,
  onTaskSave,
}: TaskModalProps) {
  const [users, setUsers] = useState<User[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
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
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users');
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (taskToEdit) {
      reset({
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        status: taskToEdit.status,
        priority: taskToEdit.priority,
        assignedTo: taskToEdit.assignedTo?._id || '',
        reportedTo: taskToEdit.reportedTo?._id || '',
        startDate: taskToEdit.startDate
          ? new Date(taskToEdit.startDate).toISOString().slice(0, 10)
          : '',
        dueDate: taskToEdit.dueDate
          ? new Date(taskToEdit.dueDate).toISOString().slice(0, 10)
          : '',
        notes: taskToEdit.notes || '',
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
  }, [taskToEdit, users, reset]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      if (taskToEdit?._id) {
        await api.put(`/tasks/${taskToEdit._id}`, data);
        toast.success('Task updated successfully!');
      } else {
        await api.post('/tasks', data);
        toast.success('Task created successfully!');
      }
      onTaskSave();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save task');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {taskToEdit ? 'Edit Task' : 'Create General Task'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input id="title" {...register('title')} placeholder="Enter task title" />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter detailed task description..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select id="status" {...register('status')}>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="COMPLETED">Completed</option>
                <option value="BLOCKED">Blocked</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select id="priority" {...register('priority')}>
                <option value="NORMAL">Normal</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Select id="assignedTo" {...register('assignedTo')}>
                <option value="">Select assigned user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </Select>
              {errors.assignedTo && (
                <p className="text-xs text-destructive">{errors.assignedTo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reportedTo">Reported To</Label>
              <Select id="reportedTo" {...register('reportedTo')}>
                <option value="">Select reporting manager</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </Select>
              {errors.reportedTo && (
                <p className="text-xs text-destructive">{errors.reportedTo.message}</p>
              )}
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
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Additional comments or instructions..."
              rows={2}
            />
          </div>

          {taskToEdit && (
            <div className="pt-2 border-t">
              <CommentSection
                comments={taskToEdit.comments || []}
                taskId={taskToEdit._id}
                onUpdate={onTaskSave}
              />
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Saving...'
                : taskToEdit
                ? 'Update Task'
                : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
