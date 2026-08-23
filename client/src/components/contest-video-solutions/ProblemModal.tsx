import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { problemSchema, type ProblemFormData } from '@/lib/validations';
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

export interface ContestVideoSolution {
  _id?: string;
  courseName: 'CPC' | 'JIPC' | 'Bootcamp' | 'Others';
  batchNo: string;
  contestName: string;
  onlineJudge: 'Leetcode' | 'Vjudge';
  platform: 'Google Classroom' | 'Website';
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

interface ProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contestVideoSolution: ContestVideoSolution) => void;
  users: User[];
  problem: ContestVideoSolution | null;
}

export default function ProblemModal({
  isOpen,
  onClose,
  onSave,
  users,
  problem,
}: ProblemModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProblemFormData>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      courseName: 'CPC',
      batchNo: '1',
      contestName: '',
      onlineJudge: 'Vjudge',
      platform: 'Website',
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
    if (problem) {
      reset({
        courseName: problem.courseName,
        batchNo: problem.batchNo,
        contestName: problem.contestName,
        onlineJudge: problem.onlineJudge,
        platform: problem.platform,
        status: problem.status,
        priority: problem.priority,
        assignedTo: problem.assignedTo?._id || '',
        reportedTo: problem.reportedTo?._id || '',
        startDate: problem.startDate
          ? new Date(problem.startDate).toISOString().slice(0, 10)
          : '',
        dueDate: problem.dueDate
          ? new Date(problem.dueDate).toISOString().slice(0, 10)
          : '',
        notes: problem.notes || '',
      });
    } else {
      reset({
        courseName: 'CPC',
        batchNo: '1',
        contestName: '',
        onlineJudge: 'Vjudge',
        platform: 'Website',
        status: 'TODO',
        priority: 'NORMAL',
        assignedTo: users[0]?._id || '',
        reportedTo: users[0]?._id || '',
        startDate: '',
        dueDate: '',
        notes: '',
      });
    }
  }, [problem, users, reset]);

  const onSubmit = (data: ProblemFormData) => {
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
        ...problem,
        ...data,
        assignedTo: assignedUser,
        reportedTo: reportedUser,
      } as ContestVideoSolution);
      onClose();
    } catch (error) {
      toast.error('Error saving video solution task');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {problem ? 'Edit Video Solution Task' : 'New Video Solution Task'}
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
              <Input id="batchNo" {...register('batchNo')} placeholder="e.g. Batch 05" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contestName">Contest / Problem Name</Label>
            <Input id="contestName" {...register('contestName')} placeholder="e.g. Weekly Contest 12 Solution" />
            {errors.contestName && (
              <p className="text-xs text-destructive">{errors.contestName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="onlineJudge">Online Judge</Label>
              <Select id="onlineJudge" {...register('onlineJudge')}>
                <option value="Vjudge">Vjudge</option>
                <option value="Leetcode">Leetcode</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select id="platform" {...register('platform')}>
                <option value="Website">Website</option>
                <option value="Google Classroom">Google Classroom</option>
              </Select>
            </div>
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
            <Textarea id="notes" {...register('notes')} placeholder="Video links & solution notes..." />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : problem ? 'Update Solution' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
