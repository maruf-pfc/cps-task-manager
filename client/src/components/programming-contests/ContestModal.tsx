'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { contestSchema, type ContestFormData } from '@/lib/validations';
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

export interface Contest {
  _id?: string;
  courseName: 'CPC' | 'JIPC' | 'Bootcamp' | 'Others';
  batchNo: number;
  contestName: string;
  onlineJudge: 'Leetcode' | 'Vjudge';
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'BLOCKED';
  priority: 'LOW' | 'NORMAL' | 'HIGH';
  assignedTo: User;
  reportedTo: User;
  startDate?: string;
  dueDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ContestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contest: Contest) => void;
  users: User[];
  contestItem: Contest | null;
}

export default function ContestModal({
  isOpen,
  onClose,
  onSave,
  users,
  contestItem,
}: ContestModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContestFormData>({
    resolver: zodResolver(contestSchema),
    defaultValues: {
      courseName: 'CPC',
      batchNo: 1,
      contestName: '',
      onlineJudge: 'Vjudge',
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
    if (contestItem) {
      reset({
        courseName: contestItem.courseName,
        batchNo: contestItem.batchNo,
        contestName: contestItem.contestName,
        onlineJudge: contestItem.onlineJudge,
        status: contestItem.status,
        priority: contestItem.priority === 'LOW' ? 'NORMAL' : contestItem.priority,
        assignedTo: contestItem.assignedTo?._id || '',
        reportedTo: contestItem.reportedTo?._id || '',
        startDate: contestItem.startDate
          ? new Date(contestItem.startDate).toISOString().slice(0, 10)
          : '',
        dueDate: contestItem.dueDate
          ? new Date(contestItem.dueDate).toISOString().slice(0, 10)
          : '',
        notes: contestItem.notes || '',
      });
    } else {
      reset({
        courseName: 'CPC',
        batchNo: 1,
        contestName: '',
        onlineJudge: 'Vjudge',
        status: 'TODO',
        priority: 'NORMAL',
        assignedTo: users[0]?._id || '',
        reportedTo: users[0]?._id || '',
        startDate: '',
        dueDate: '',
        notes: '',
      });
    }
  }, [contestItem, users, reset]);

  const onSubmit = (data: ContestFormData) => {
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
        ...contestItem,
        ...data,
        priority: data.priority as any,
        assignedTo: assignedUser,
        reportedTo: reportedUser,
      } as Contest);
      onClose();
    } catch (error) {
      toast.error('Error saving contest task');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {contestItem ? 'Edit Contest Task' : 'New Contest Task'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="contestName">Contest Title</Label>
            <Input id="contestName" {...register('contestName')} placeholder="e.g. Dynamic Programming Warmup #1" />
            {errors.contestName && (
              <p className="text-xs text-destructive">{errors.contestName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="onlineJudge">Online Judge</Label>
              <Select id="onlineJudge" {...register('onlineJudge')}>
                <option value="Vjudge">Vjudge</option>
                <option value="Leetcode">Leetcode</option>
              </Select>
            </div>
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
              <Label htmlFor="assignedTo">Assigned To</Label>
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
            <Textarea id="notes" {...register('notes')} placeholder="Contest link & problemset details..." />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : contestItem ? 'Update Contest' : 'Create Contest'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
