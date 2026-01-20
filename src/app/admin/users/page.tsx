import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper';
import { getUsers } from '@/app/actions/admin';
import { getAdminProfile } from '@/lib/auth-service';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { redirect } from 'next/navigation';

export default async function UsersPage() {
    const users = await getUsers();
    const admin = await getAdminProfile();

    if (!admin) {
        redirect('/admin');
    }

    // Transform to simple object for Client Component prop (avoid non-serializable data issues if any, though strings are fine)
    const adminProfile = {
        name: admin.name,
        email: admin.email
    };

    return (
        <AdminLayoutWrapper>
            <div className="container mx-auto px-6 py-6 space-y-8">
                <AdminHeader title="Registered Users" admin={adminProfile}>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/dashboard">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                </AdminHeader>

                <Card>
                    <CardHeader>
                        <CardTitle>User List</CardTitle>
                        <CardDescription>A list of all users registered on the platform.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead>Last Sign In</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                No users found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.map((user: any) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={user.avatar_url || user.image} />
                                                        <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">
                                                            {user.first_name || user.last_name
                                                                ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                                                                : 'N/A'}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground md:hidden">{user.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                                                <TableCell>
                                                    <span title={new Date(user.created_at).toLocaleString()}>
                                                        {user.created_at ? formatDistanceToNow(new Date(user.created_at), { addSuffix: true }) : 'N/A'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {user.last_sign_in_at ? (
                                                        <span title={new Date(user.last_sign_in_at).toLocaleString()}>
                                                            {formatDistanceToNow(new Date(user.last_sign_in_at), { addSuffix: true })}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {/* Assuming 'status' field or similar exists, else defaulting to Active if present in list */}
                                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayoutWrapper>
    );
}
