import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  ListTodo,
  Calendar,
  BookText,
  Target,
  User,
} from 'lucide-react';

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const mainNavLinks: NavLink[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: ListTodo },
  { href: '/planner', label: 'Study Planner', icon: Calendar },
  { href: '/notes', label: 'Note Keeper', icon: BookText },
  { href: '/habits', label: 'Habit Tracker', icon: Target },
];

export const userNavLink: NavLink = { 
  href: '/profile', 
  label: 'Profile', 
  icon: User 
};
