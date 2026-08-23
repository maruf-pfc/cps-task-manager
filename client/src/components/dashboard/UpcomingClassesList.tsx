import Link from 'next/link';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function UpcomingClassesList({ classes }: { classes: any[] }) {
  return (
    <Card className="h-full flex flex-col border-border/60">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-semibold">Upcoming Classes</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-1 flex flex-col justify-between space-y-3">
        {classes && classes.length > 0 ? (
          <ul className="divide-y divide-border/40 text-xs">
            {classes.map((cls) => (
              <li key={cls._id} className="py-2.5 space-y-1">
                <p className="font-medium text-foreground">{cls.title || cls.classTitle}</p>
                <div className="flex justify-between text-muted-foreground text-[11px]">
                  <span>With {cls.trainer?.name || 'Trainer'}</span>
                  <span>{cls.schedule ? format(new Date(cls.schedule), 'PP p') : '-'}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-muted-foreground italic py-4 text-center">No upcoming classes scheduled.</p>
        )}

        <div className="pt-2 border-t border-border/40">
          <Link
            href="/classes"
            className="text-xs text-primary hover:underline font-semibold"
          >
            View Full Schedule →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
