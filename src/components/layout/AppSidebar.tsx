
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import Logo from '@/components/icons/Logo';
import {
  LayoutDashboard,
  ListChecks,
  Users,
  PlusCircle,
  Settings,
  LogOut,
  Brain,
  BarChart3,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: ('Developer' | 'Manager')[];
  exact?: boolean;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Developer', 'Manager'], exact: true },
  { href: '/dashboard/my-tasks', label: 'My Tasks', icon: ListChecks, roles: ['Developer'] },
  { href: '/dashboard/all-tasks', label: 'All Tasks', icon: ListChecks, roles: ['Manager'] },
  { href: '/dashboard/create-task', label: 'Create Task', icon: PlusCircle, roles: ['Manager'] },
  { href: '/dashboard/ai-assign', label: 'AI Assign', icon: Brain, roles: ['Manager'] },
  { href: '/dashboard/reports', label: 'Reports', icon: BarChart3, roles: ['Manager'] },
  { href: '/dashboard/user-management', label: 'User Management', icon: Users, roles: ['Manager'] },
];

export default function AppSidebar() {
  const { currentUser, logout } = useAuth();
  const pathname = usePathname();

  if (!currentUser) return null;

  const userNavItems = navItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon" className="border-r">
      <SidebarHeader className="items-center justify-center p-4">
         <Link href="/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
            <Logo size={36} />
            <span className="text-2xl font-bold font-headline text-sidebar-foreground">TaskFlow</span>
        </Link>
         <Link href="/dashboard" className="items-center gap-2 hidden group-data-[collapsible=icon]:flex">
            <Logo size={30} />
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {userNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={item.exact ? pathname === item.href : pathname.startsWith(item.href)}
                tooltip={{ children: item.label, className: "font-body" }}
                className="justify-start"
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span className="font-body">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={{ children: "Settings", className: "font-body" }} className="justify-start">
                <Link href="/dashboard/settings">
                    <Settings className="h-5 w-5" />
                    <span className="font-body">Settings</span>
                </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} variant="default" tooltip={{ children: "Log Out", className: "font-body text-destructive" }} className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="h-5 w-5" />
              <span className="font-body">Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
