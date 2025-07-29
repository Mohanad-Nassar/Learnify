'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Leaf, LogOut } from 'lucide-react';
import { allNavLinks, type NavLink } from '@/lib/nav-links';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from './ui/button';

export default function AppNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-primary bg-card">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
            <div className="flex items-center gap-6">
                <Link href="/dashboard" className="flex items-center space-x-2">
                    <Leaf className="h-6 w-6 text-primary" />
                    <span className="inline-block font-bold text-lg">Learnify</span>
                </Link>
                <nav className="hidden gap-6 md:flex">
                    {allNavLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        pathname === link.href ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        {link.label}
                    </Link>
                    ))}
                </nav>
            </div>

            <div className="flex flex-1 items-center justify-end space-x-4">
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                </Button>
                <Link href="/profile">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="https://placehold.co/100x100" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Link>
            </div>
        </div>
    </header>
  );
}
