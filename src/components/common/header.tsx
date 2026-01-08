'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Header({ scrollTo, servicesRef }: { scrollTo: (ref: any) => void; servicesRef: React.RefObject<HTMLDivElement> }) {
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-lg text-primary">GovDocs LK</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <button onClick={() => scrollTo(servicesRef)} className="transition-colors hover:text-primary">
            Services
          </button>
          <Link href="#features" className="transition-colors hover:text-primary">
            Features
          </Link>
        </nav>
        <div className="flex items-center justify-end ml-auto space-x-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
