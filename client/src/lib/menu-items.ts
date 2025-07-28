import {
  LayoutDashboard,
  ClipboardList,
  School,
  Video,
  Trophy,
  Mail,
  Users,
  CreditCard,
} from 'lucide-react';

export const mainMenuItems = [
  { title: 'Dashboard', url: 'dashboard', icon: LayoutDashboard },
  { title: 'General Tasks', url: 'general-tasks', icon: ClipboardList },
  { title: 'Classes', url: 'classes', icon: School },
  {
    title: 'Contest Video Solutions',
    url: 'contest-video-solutions',
    icon: Video,
  },
  { title: 'Programming Contests', url: 'programming-contests', icon: Trophy },
  { title: 'Email Marketing', url: 'email-marketing', icon: Mail },
  { title: 'Users', url: 'users', icon: Users },
  { title: 'Payments', url: 'payments', icon: CreditCard },
];
