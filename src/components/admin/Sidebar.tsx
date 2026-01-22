'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, ListTree, Settings, Shield, Users, Files } from 'lucide-react';

export function AdminSidebar() {
    const pathname = usePathname();

    const links = [
        {
            href: '/admin/dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            exact: true
        },
        {
            href: '/admin/resources',
            label: 'Resources',
            icon: Files,
            exact: false
        },
        {
            href: '/admin/categories',
            label: 'Services & Categories',
            icon: ListTree,
            exact: false
        },
        {
            href: '/admin/users',
            label: 'Users',
            icon: Users,
            exact: false
        },
        // {
        //     href: '/admin/settings',
        //     label: 'Settings',
        //     icon: Settings,
        //     exact: false
        // }
    ];

    return (
        <div className="w-64 border-r bg-card min-h-screen flex flex-col">
            <div className="p-6 border-b flex items-center gap-2">
                <Shield className="h-6 w-6 text-red-600" />
                <span className="font-bold text-xl">GovDocs Admin</span>
            </div>
            <div className="flex-1 py-6 px-4 space-y-2">
                {links.map((link) => {
                    const isActive = link.exact
                        ? pathname === link.href
                        : pathname.startsWith(link.href);

                    return (
                        <Button
                            key={link.href}
                            variant={isActive ? 'secondary' : 'ghost'}
                            className={cn("w-full justify-start gap-2", isActive && "bg-secondary font-medium")}
                            asChild
                        >
                            <Link href={link.href}>
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        </Button>
                    );
                })}
            </div>
            <div className="p-4 border-t text-xs text-muted-foreground text-center">
                v1.0.0 Admin Portal
            </div>
        </div>
    );
}
