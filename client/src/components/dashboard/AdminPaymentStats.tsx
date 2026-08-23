import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign, AlertCircle, CheckCircle } from 'lucide-react';

export function AdminPaymentStats({ stats }: { stats: any }) {
  if (!stats) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold tracking-tight">Payment Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/60">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Pending Payments
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {stats.pendingCount || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Pending Amount
            </CardTitle>
            <DollarSign className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              ${(stats.pendingAmount || 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Paid Amount
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              ${(stats.paidAmount || 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
