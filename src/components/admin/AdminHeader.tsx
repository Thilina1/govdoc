'use client';

import { Button } from '@/components/ui/button';
import { logoutUser } from '@/app/actions/auth';
import { ReactNode } from 'react';

export interface AdminProfile {
    name: string;
    email: string;
}

interface AdminHeaderProps {
    title: string;
    admin?: AdminProfile | null;
    children?: ReactNode;
    actions?: ReactNode;
}

export function AdminHeader({ title, admin, children, actions }: AdminHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-4 rounded-lg border shadow-sm">
            <div className="flex items-center gap-2">
                {children}
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            </div>
            <div className="flex items-center gap-4">
                {actions}
                {admin && (
                    <div className="flex items-center gap-4 pl-4 border-l">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium">{admin.name}</p>
                            <p className="text-xs text-muted-foreground">{admin.email}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => logoutUser()}>Logout</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
