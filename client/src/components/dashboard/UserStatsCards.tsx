import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, UserPlus, ShieldAlert, GraduationCap } from 'lucide-react';

export function UserStatsCards({ stats }: { stats: any }) {
  if (!stats) return null;

  const items = [
    {
      title: 'Total Users',
      value: stats.total || 0,
      icon: Users,
      color: 'text-primary',
    },
    {
      title: 'New This Month',
      value: stats.newThisMonth || 0,
      icon: UserPlus,
      color: 'text-emerald-500',
    },
    {
      title: 'Admins',
      value: stats.admins || 0,
      icon: ShieldAlert,
      color: 'text-indigo-500',
    },
    {
      title: 'Trainers',
      value: stats.trainers || 0,
      icon: GraduationCap,
      color: 'text-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="hover:shadow-sm transition-all border-border/60">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${item.color}`} />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
