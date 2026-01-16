
'use client';

import { useState, useEffect, RefObject } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/language-switcher';
import { Menu, User, LogOut, Settings } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
}

export default function DashboardHeader({
    scrollTo,
    servicesRef,
    user,
    logoutAction
}: {
    scrollTo?: (ref: any) => void;
    servicesRef?: RefObject<HTMLDivElement | null>;
    user: UserProfile;
    logoutAction: () => void;
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

    return (
        <header className={cn("fixed top-0 z-50 w-full transition-all duration-300", isScrolled ? 'bg-background/95 shadow-md backdrop-blur-sm' : 'bg-transparent')}>
            <div className={cn("container flex h-20 items-center", isScrolled ? 'text-foreground' : 'text-white')}>
                <div className="flex items-center">
                    <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
                        {/* Logo Image removed as per user request */}
                        <span className={cn("font-bold text-xl", isScrolled ? 'text-foreground' : 'text-white')}>GovDocs LK</span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-auto">
                    {scrollTo && servicesRef ? (
                        <button onClick={() => scrollTo(servicesRef)} className={cn("transition-colors", isScrolled ? "text-foreground/80 hover:text-primary" : "text-white/80 hover:text-white")}>
                            Services
                        </button>
                    ) : (
                        <Link href="/dashboard#services" className={cn("transition-colors", isScrolled ? "text-foreground/80 hover:text-primary" : "text-white/80 hover:text-white")}>
                            Services
                        </Link>
                    )}

                    <Link href="/dashboard#features" className={cn("transition-colors", isScrolled ? "text-foreground/80 hover:text-primary" : "text-white/80 hover:text-white")}>
                        Features
                    </Link>
                    <LanguageSwitcher />

                    {/* User Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className={cn("relative h-8 w-8 rounded-full", isScrolled ? "" : "hover:bg-white/20")}>
                                <Avatar className="h-9 w-9 border-2 border-white/20">
                                    <AvatarImage src="" alt={user.firstName} />
                                    <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Link href="/dashboard/settings">
                                <DropdownMenuItem className="cursor-pointer">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logoutAction} className="text-red-600 focus:text-red-600 cursor-pointer">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
                                <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                                    <Avatar>
                                        <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-bold">{user.firstName} {user.lastName}</span>
                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                    </div>
                                </div>

                                <Link href="/dashboard" className="font-bold text-lg">Home</Link>
                                <Link href="/dashboard/settings" className="font-bold text-lg flex items-center">
                                    Settings
                                </Link>
                                {scrollTo && servicesRef ? (
                                    <button onClick={() => scrollTo(servicesRef)} className="font-bold text-lg text-left">
                                        Services
                                    </button>
                                ) : (
                                    <Link href="/dashboard#services" className="font-bold text-lg">Services</Link>
                                )}
                                <Link href="#features" className="font-bold text-lg">Features</Link>

                                <div className='flex flex-col gap-2 pt-4 mt-auto'>
                                    <Button variant="destructive" onClick={logoutAction} className="w-full justify-start">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Log out
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
