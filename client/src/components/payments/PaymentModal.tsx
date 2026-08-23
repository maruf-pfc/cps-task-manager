'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { IPayment } from '@/app/(dashboard)/payments/page';
import { paymentSchema, type PaymentFormData } from '@/lib/validations';
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
}

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  paymentToEdit?: IPayment | null;
};

export function PaymentModal({
  isOpen,
  onClose,
  onUpdate,
  paymentToEdit,
}: PaymentModalProps) {
  const [users, setUsers] = useState<User[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: 0,
      status: 'Pending',
      trainer: '',
      name: '',
      details: {
        courseName: undefined,
        batchNo: '',
        classNo: '',
      },
      classTitle: '',
      priority: 'NORMAL',
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
        console.error('Failed to fetch users:', error);
      }
    };

    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (paymentToEdit) {
      reset({
        amount: paymentToEdit.amount,
        status: paymentToEdit.status,
        trainer: paymentToEdit.trainer._id,
        name: paymentToEdit.name,
        classTitle: paymentToEdit.classTitle,
        priority: paymentToEdit.priority || 'NORMAL',
        startDate: paymentToEdit.startDate
          ? new Date(paymentToEdit.startDate).toISOString().slice(0, 10)
          : '',
        dueDate: paymentToEdit.dueDate
          ? new Date(paymentToEdit.dueDate).toISOString().slice(0, 10)
          : '',
        notes: paymentToEdit.notes || '',
        details: {
          courseName: paymentToEdit.details?.courseName,
          batchNo: paymentToEdit.details?.batchNo || '',
          classNo: paymentToEdit.details?.classNo || '',
        },
      });
    } else {
      reset({
        amount: 0,
        status: 'Pending',
        trainer: users[0]?._id || '',
        name: '',
        classTitle: '',
        priority: 'NORMAL',
        startDate: '',
        dueDate: '',
        notes: '',
        details: {
          courseName: undefined,
          batchNo: '',
          classNo: '',
        },
      });
    }
  }, [paymentToEdit, users, reset]);

  const onSubmit = async (data: PaymentFormData) => {
    try {
      if (paymentToEdit?._id) {
        await api.put(`/payments/${paymentToEdit._id}`, data);
        toast.success('Payment updated successfully!');
      } else {
        await api.post('/payments', data);
        toast.success('Payment created successfully!');
      }
      onUpdate();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save payment');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {paymentToEdit ? 'Edit Payment Record' : 'New Payment Record'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trainer">Trainer</Label>
              <Select id="trainer" {...register('trainer')}>
                <option value="">Select Trainer</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </Select>
              {errors.trainer && (
                <p className="text-xs text-destructive">{errors.trainer.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Recipient / Record Name</Label>
              <Input id="name" {...register('name')} placeholder="e.g. Monthly Honorarium" />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="classTitle">Class / Event Title</Label>
              <Input id="classTitle" {...register('classTitle')} placeholder="e.g. Graph Algorithms" />
              {errors.classTitle && (
                <p className="text-xs text-destructive">{errors.classTitle.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="any"
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-xs text-destructive">{errors.amount.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select id="status" {...register('status')}>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="courseName">Course (Optional)</Label>
              <Select id="courseName" {...register('details.courseName')}>
                <option value="">None</option>
                <option value="CPC">CPC</option>
                <option value="JIPC">JIPC</option>
                <option value="Bootcamp">Bootcamp</option>
                <option value="Others">Others</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="batchNo">Batch #</Label>
              <Input id="batchNo" {...register('details.batchNo')} placeholder="Batch 01" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classNo">Class #</Label>
              <Input id="classNo" {...register('details.classNo')} placeholder="Class 05" />
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
            <Textarea id="notes" {...register('notes')} placeholder="Additional payment details..." />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : paymentToEdit ? 'Update Payment' : 'Create Payment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
