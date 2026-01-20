'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useActionState, useEffect } from 'react';
import { loginAdmin, LoginState } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const initialState: LoginState = { error: undefined, success: undefined };
    const [state, formAction, isPending] = useActionState(loginAdmin, initialState);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            router.push('/admin/dashboard');
        }
    }, [state?.success, router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="mx-auto max-w-sm w-full shadow-lg rounded-xl border border-red-200">
                <CardHeader className="text-center space-y-4">
                    {/* Logo removed */}
                    <CardTitle className="text-2xl text-foreground">Admin Portal</CardTitle>
                    <CardDescription>
                        Restricted access for administrators only
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction}>
                        <div className="grid gap-4">
                            {state?.error && (
                                <div className="p-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">
                                    {state.error}
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Admin Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="admin@govdocs.lk"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" required />
                            </div>
                            <Button type="submit" disabled={isPending} className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full">
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Authenticating...
                                    </>
                                ) : (
                                    'Access Dashboard'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
