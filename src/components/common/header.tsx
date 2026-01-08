'use client';

import Link from 'next/link';
import { Menu, ShieldEllipsis } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary shadow-sm text-primary-foreground">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <ShieldEllipsis className="h-8 w-8" />
            <span className="text-xl font-bold">GovDocs.lk</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="#"
            className="transition-colors hover:text-primary-foreground/80"
          >
            Services
          </Link>
          <Link
            href="#"
            className="transition-colors hover:text-primary-foreground/80"
          >
            About
          </Link>
          <Link
            href="#"
            className="transition-colors hover:text-primary-foreground/80"
          >
            Support
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="#">Register</Link>
            </Button>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2 text-primary">
                    <ShieldEllipsis className="h-8 w-8" />
                    <span className="text-xl font-bold">GovDocs.lk</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-4">
                <Link
                  href="#"
                  className="text-lg font-medium"
                >
                  Services
                </Link>
                <Link
                  href="#"
                  className="text-lg font-medium"
                >
                  About
                </Link>
                <Link
                  href="#"
                  className="text-lg font-medium"
                >
                  Support
                </Link>
                <div className="mt-4 flex flex-col gap-2">
                  <Button variant="ghost" className="w-full justify-start text-lg">
                    Login
                  </Button>
                  <Button asChild className="w-full justify-start text-lg bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href="#">Register</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
