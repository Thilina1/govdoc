'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { logoutUser } from '@/app/actions/auth';
import { Users, FileText, Settings, Shield, Database, Loader2 } from 'lucide-react';
import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper';
import Link from 'next/link';
import { indexAllContent } from '@/app/actions/ai';

interface AdminProfile {
    name: string;
    email: string;
}

export default function AdminDashboardClient({ admin, userCount }: { admin: AdminProfile, userCount: number }) {
    return (
        <AdminLayoutWrapper>
            <div className="container mx-auto px-6 py-6 space-y-8">
                {/* Top Bar for User Profile (could be moved to common layout later) */}
                <div className="flex justify-between items-center bg-card p-4 rounded-lg border shadow-sm">
                    <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium">{admin.name}</p>
                            <p className="text-xs text-muted-foreground">{admin.email}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => logoutUser()}>Logout</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Registered Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{userCount}</div>
                            <Button variant="link" asChild className="px-0 mt-2 h-auto text-xs text-muted-foreground">
                                <Link href="/admin/users">View all users</Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">15</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">System Status</CardTitle>
                            <Settings className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-2">
                                <div className="text-2xl font-bold text-green-600">Healthy</div>
                                <form action={async () => {
                                    await indexAllContent();
                                }}>
                                    <SubmitButton />
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Shortcuts */}
                <div className="flex gap-4">
                    <Button asChild>
                        <Link href="/admin/categories">Browse Categories & Services</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/admin/services/new">Add New Service</Link>
                    </Button>
                </div>
            </div>
        </AdminLayoutWrapper>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button variant="outline" size="sm" type="submit" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Indexing...
                </>
            ) : (
                <>
                    <Database className="mr-2 h-3 w-3" />
                    Refresh Index
                </>
            )}
        </Button>
    );
}
