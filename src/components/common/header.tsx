'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Header({ scrollTo }: { scrollTo: (ref: any) => void }) {
  // A bit of a hack to get the refs from the parent component
  const servicesRef = (globalThis as any).document?.querySelector('header')?.servicesRef;
  const featuresRef = (globalThis as any).document?.querySelector('header')?.featuresRef;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">GovDoc</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <button onClick={() => scrollTo(servicesRef)} className="transition-colors hover:text-foreground/80">
            Services
          </button>
          <button onClick={() => scrollTo(featuresRef)} className="transition-colors hover:text-foreground/80">
            Features
          </button>
        </nav>
        <div className="flex items-center justify-end ml-auto">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
