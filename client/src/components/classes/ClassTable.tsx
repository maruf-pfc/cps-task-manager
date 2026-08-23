import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export interface IClass {
  _id?: string;
  courseName: 'CPC' | 'JIPC' | 'Bootcamp' | 'Others';
  batchNo: number;
  classNo: number;
  classTitle: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'BLOCKED';
  priority: 'NORMAL' | 'MEDIUM' | 'HIGH';
  assignedTo: { _id: string; name: string; profileImage?: string };
  reportedTo: { _id: string; name: string; profileImage?: string };
  startDate?: string;
  dueDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

type ClassTableProps = {
  classes: IClass[];
  onEdit: (classItem: IClass) => void;
  onUpdate: () => void;
};

export function ClassTable({ classes, onEdit, onUpdate }: ClassTableProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [classToDeleteId, setClassToDeleteId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setClassToDeleteId(id);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!classToDeleteId) return;

    try {
      await api.delete(`/classes/${classToDeleteId}`);
      toast.success('Class deleted successfully!');
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete class. Please try again.');
    } finally {
      setShowConfirmDialog(false);
      setClassToDeleteId(null);
    }
  };

  const getStatusBadge = (status: IClass['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="success">Completed</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="info">In Progress</Badge>;
      case 'IN_REVIEW':
        return <Badge variant="warning">In Review</Badge>;
      case 'BLOCKED':
        return <Badge variant="destructive">Blocked</Badge>;
      default:
        return <Badge variant="secondary">TODO</Badge>;
    }
  };

  const getPriorityBadge = (priority: IClass['priority']) => {
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
      <div className="rounded-md border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class Title</TableHead>
              <TableHead>Course & Batch</TableHead>
              <TableHead>Class #</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Reported To</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                  No classes found. Create one to get started!
                </TableCell>
              </TableRow>
            ) : (
              classes.map((cls) => (
                <TableRow key={cls._id}>
                  <TableCell className="font-semibold">{cls.classTitle}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {cls.courseName} - Batch {cls.batchNo}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">#{cls.classNo}</TableCell>
                  <TableCell>{getStatusBadge(cls.status)}</TableCell>
                  <TableCell>{getPriorityBadge(cls.priority)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {cls.assignedTo?.name || '-'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {cls.reportedTo?.name || '-'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {cls.dueDate ? format(new Date(cls.dueDate), 'PP') : '-'}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(cls)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => cls._id && handleDeleteClick(cls._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this class task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
