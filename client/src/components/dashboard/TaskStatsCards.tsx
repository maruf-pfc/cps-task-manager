import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Clock, CheckCircle2, AlertOctagon, Eye, TrendingUp } from 'lucide-react';

export function TaskStatsCards({ stats }: { stats: any }) {
  if (!stats) return null;

  const cards = [
    {
      title: 'To Do',
      value: stats.todo || 0,
      icon: Clock,
      color: 'text-muted-foreground',
    },
    {
      title: 'In Progress',
      value: stats.inprogress || 0,
      icon: TrendingUp,
      color: 'text-blue-500',
    },
    {
      title: 'In Review',
      value: stats.inreview || 0,
      icon: Eye,
      color: 'text-amber-500',
    },
    {
      title: 'Completed',
      value: stats.completed || 0,
      icon: CheckCircle2,
      color: 'text-emerald-500',
    },
    {
      title: 'Blocked',
      value: stats.blocked || 0,
      icon: AlertOctagon,
      color: 'text-destructive',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.title} className="hover:shadow-sm transition-all border-border/60">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {c.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${c.color}`} />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">{c.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
