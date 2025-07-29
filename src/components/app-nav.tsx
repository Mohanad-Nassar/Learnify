'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Leaf } from 'lucide-react';
import { allNavLinks } from '@/lib/nav-links';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from 'lucide-react';


export default function AppNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="font-bold">Learnify</span>
        </Link>
        
        <nav className="hidden items-center gap-6 md:flex">
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

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Bell className="h-5 w-5" />
          </Button>
          <Link href="/profile" className="hidden md:block">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/profile.png" alt="User" data-ai-hint="palestinian girl" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </Link>
           <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="md:hidden"
                size="icon"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <nav className="grid gap-4 text-lg font-medium">
                <Link href="/dashboard" className="flex items-center gap-2 border-b pb-4">
                  <Leaf className="h-6 w-6 text-primary" />
                  <span className="font-bold">Learnify</span>
                </Link>
                {allNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-4 px-2.5",
                      pathname === link.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                ))}
                 <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-4 px-2.5",
                      pathname === "/profile" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Avatar className="h-5 w-5">
                        <AvatarImage src="/profile.png" alt="User" data-ai-hint="palestinian girl" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    Profile
                  </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
