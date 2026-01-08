'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function Header({ scrollTo, servicesRef }: { scrollTo: (ref: any) => void; servicesRef: React.RefObject<HTMLDivElement> }) {
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-20 items-center">
        <div className="mr-auto flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src="/logo.png" alt="GovDocs LK Logo" width={40} height={40} data-ai-hint="logo" />
            <span className="font-bold text-xl text-foreground">GovDocs LK</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <button onClick={() => scrollTo(servicesRef)} className="transition-colors hover:text-primary text-foreground/80">
            Services
          </button>
          <Link href="#features" className="transition-colors hover:text-primary text-foreground/80">
            Features
          </Link>
        </nav>
        <div className="flex items-center justify-end ml-auto space-x-4">
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6">
            <Link href="/login">Login</Link>
          </Button>
           <Button variant="outline" asChild className="rounded-full px-6 border-primary text-primary hover:bg-primary/10 hover:text-primary">
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
