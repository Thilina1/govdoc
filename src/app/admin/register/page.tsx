'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useActionState, useEffect } from 'react';
import { registerAdmin, LoginState } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';

export default function AdminRegisterPage() {
    const initialState: LoginState = { error: undefined, success: undefined }; // Reusing LoginState as it has the same structure { error?, success? }
    const [state, formAction, isPending] = useActionState(registerAdmin, initialState);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            router.push('/admin?registered=true');
        }
    }, [state?.success, router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="mx-auto max-w-sm w-full shadow-lg rounded-xl border border-red-200">
                <CardHeader className="text-center space-y-4">
                    {/* Logo removed */}
                    <CardTitle className="text-2xl text-foreground">Admin Registration</CardTitle>
                    <CardDescription>
                        Create a new administrator account
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
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" placeholder="Admin Name" required />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="admin@govdocs.lk" required />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="mobile">Mobile Number (Optional)</Label>
                                <Input id="mobile" name="mobile" type="tel" placeholder="07XXXXXXXX" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" required />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input id="confirmPassword" name="confirmPassword" type="password" required />
                            </div>

                            <Button type="submit" disabled={isPending} className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full">
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    'Register Admin'
                                )}
                            </Button>
                        </div>
                    </form>
                    <div className="mt-6 text-center text-sm">
                        Already have an admin account?{' '}
                        <Link href="/admin" className="underline text-red-600 font-medium">
                            Login here
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
