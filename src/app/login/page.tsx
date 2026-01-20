'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useActionState, useEffect } from 'react';
import { loginUser, LoginState } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const initialState: LoginState = { error: undefined, success: undefined };
  const [state, formAction, isPending] = useActionState(loginUser, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push('/dashboard');
    }
  }, [state?.success, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full shadow-lg rounded-xl border">
        <CardHeader className="text-center space-y-4">
          {/* Logo removed */}
          <CardTitle className="text-2xl text-foreground">Login to GovDocs LK</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" disabled={isPending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <Button variant="outline" type="button" className="w-full rounded-full">
                <Mail className="mr-2 h-4 w-4" /> Continue with Email
              </Button>
            </div>
          </form>
          <div className="mt-6 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="underline text-primary font-medium">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
