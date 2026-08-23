import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { IPayment } from '@/app/(dashboard)/payments/page';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

type TrainerWithProfile = {
  _id: string;
  name: string;
  profileImage?: string;
};

interface PaymentWithTrainerProfile extends Omit<IPayment, 'trainer'> {
  trainer: TrainerWithProfile;
}

type PaymentTableProps = {
  payments: PaymentWithTrainerProfile[];
  onEdit: (payment: PaymentWithTrainerProfile) => void;
  onUpdate: () => void;
};

export function PaymentTable({
  payments,
  onEdit,
  onUpdate,
}: PaymentTableProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [paymentToDeleteId, setPaymentToDeleteId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setPaymentToDeleteId(id);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!paymentToDeleteId) return;

    try {
      await api.delete(`/payments/${paymentToDeleteId}`);
      toast.success('Payment record deleted successfully!');
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete payment record.');
    } finally {
      setShowConfirmDialog(false);
      setPaymentToDeleteId(null);
    }
  };

  return (
    <>
      <div className="rounded-md border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trainer</TableHead>
              <TableHead>Class Title</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Course / Batch</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  No payment records found.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((p) => (
                <TableRow key={p._id}>
                  <TableCell className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={p.trainer?.profileImage} alt={p.trainer?.name} />
                      <AvatarFallback className="text-xs font-semibold">
                        {p.trainer?.name ? p.trainer.name.charAt(0).toUpperCase() : 'T'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{p.trainer?.name || 'Unassigned'}</span>
                  </TableCell>
                  <TableCell className="font-semibold">{p.classTitle}</TableCell>
                  <TableCell className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    ${p.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={p.status === 'Paid' ? 'success' : 'warning'}>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={p.priority === 'HIGH' ? 'destructive' : 'outline'}>
                      {p.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {p.details?.courseName ? `${p.details.courseName} (${p.details.batchNo || '-'})` : '-'}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {p.dueDate ? format(new Date(p.dueDate), 'PP') : '-'}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(p)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => p._id && handleDeleteClick(p._id)}
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
            <DialogTitle>Confirm Payment Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this payment record? This action cannot be undone.
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
