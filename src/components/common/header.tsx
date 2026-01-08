'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/language-switcher';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export default function Header({ scrollTo, servicesRef }: { scrollTo: (ref: any) => void; servicesRef: React.RefObject<HTMLDivElement> }) {
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

  return (
    <header className={cn("sticky top-0 z-50 w-full transition-all duration-300", isScrolled ? 'bg-background/95 shadow-md backdrop-blur-sm' : 'bg-transparent')}>
      <div className={cn("container flex h-20 items-center", isScrolled ? 'text-foreground' : 'text-white')}>
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src="/logo.png" alt="GovDocs LK Logo" width={40} height={40} data-ai-hint="logo" />
            <span className={cn("font-bold text-xl", isScrolled ? 'text-foreground' : 'text-white')}>GovDocs LK</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-auto">
          <button onClick={() => scrollTo(servicesRef)} className={cn("transition-colors", isScrolled ? "text-foreground/80 hover:text-primary" : "text-white/80 hover:text-white")}>
            Services
          </button>
          <Link href="#features" className={cn("transition-colors", isScrolled ? "text-foreground/80 hover:text-primary" : "text-white/80 hover:text-white")}>
            Features
          </Link>
          <LanguageSwitcher />
           <Button asChild className={cn(isScrolled ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-white/20 hover:bg-white/30 text-white')} >
              <Link href="/login">Login</Link>
            </Button>
            <Button variant="outline" asChild className={cn(isScrolled ? 'border-primary text-primary hover:bg-primary/10' : 'border-white text-white hover:bg-white hover:text-primary')}>
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
                    <nav className="flex flex-col gap-4 mt-8">
                         <Link href="/" className="font-bold text-lg">Home</Link>
                         <button onClick={() => scrollTo(servicesRef)} className="font-bold text-lg text-left">
                            Services
                        </button>
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