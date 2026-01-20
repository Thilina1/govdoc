'use client';

import { useState, useEffect, RefObject } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/language-switcher';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export default function Header({
  scrollTo,
  servicesRef,
  variant = 'transparent'
}: {
  scrollTo?: (ref: any) => void;
  servicesRef?: RefObject<HTMLDivElement | null>;
  variant?: 'transparent' | 'opaque';
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const showSolid = isScrolled || variant === 'opaque';

  return (
    <header className={cn("sticky top-0 z-50 w-full transition-all duration-300", showSolid ? 'bg-background/95 shadow-md backdrop-blur-sm' : 'bg-transparent')}>
      <div className={cn("container flex h-20 items-center", showSolid ? 'text-foreground' : 'text-white')}>
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            {/* Logo removed */}
            <span className={cn("font-bold text-xl", showSolid ? 'text-foreground' : 'text-white')}>GovDocs LK</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-auto">
          {scrollTo && servicesRef ? (
            <button onClick={() => scrollTo(servicesRef)} className={cn("transition-colors", showSolid ? "text-foreground/80 hover:text-primary" : "text-white/80 hover:text-white")}>
              Services
            </button>
          ) : (
            <Link href="/#services" className={cn("transition-colors", showSolid ? "text-foreground/80 hover:text-primary" : "text-white/80 hover:text-white")}>
              Services
            </Link>
          )}
          <Link href="#features" className={cn("transition-colors", showSolid ? "text-foreground/80 hover:text-primary" : "text-white/80 hover:text-white")}>
            Features
          </Link>
          <LanguageSwitcher />
          <Button asChild className={cn(showSolid ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-white/20 hover:bg-white/30 text-white')} >
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className={cn(showSolid ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-white/10 border-white/20 hover:bg-white/20 text-white')}>
            <Link href="/register">Register</Link>
          </Button>
        </nav>

        <div className="flex items-center ml-auto md:hidden">
          <LanguageSwitcher />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background text-foreground">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="font-bold text-lg">Home</Link>
                {scrollTo && servicesRef ? (
                  <button onClick={() => scrollTo(servicesRef)} className="font-bold text-lg text-left">
                    Services
                  </button>
                ) : (
                  <Link href="/#services" className="font-bold text-lg">
                    Services
                  </Link>
                )}
                <Link href="#features" className="font-bold text-lg">Features</Link>
                <div className='flex flex-col gap-2 pt-4'>
                  <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary/10">
                    <Link href="/register">Register</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
