import {
  UsersIcon,
  UserPlusIcon,
  UserGroupIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const StatCard = (
  { title, value, icon: Icon, colorClass }: any, // Re-using the card component logic
) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    className="bg-white p-6 rounded-lg shadow-md flex items-center"
  >
    <div className={`p-3 rounded-full mr-4 ${colorClass}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </motion.div>
);

export function UserStatsCards({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
      <StatCard
        title="Total Users"
        value={stats.total}
        icon={UsersIcon}
        colorClass="bg-teal-500"
      />
      <StatCard
        title="New This Month"
        value={stats.newThisMonth}
        icon={UserPlusIcon}
        colorClass="bg-sky-500"
      />
      <StatCard
        title="Managers"
        value={stats.managers}
        icon={UserGroupIcon}
        colorClass="bg-indigo-500"
      />
      <StatCard
        title="Trainers"
        value={stats.trainers}
        icon={AcademicCapIcon}
        colorClass="bg-orange-500"
      />
    </div>
  );
}
