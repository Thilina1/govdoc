'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';


export default function RegisterPage() {
    const [date, setDate] = useState<Date>();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background py-12">
      <Card className="mx-auto max-w-2xl w-full shadow-lg rounded-xl border">
        <CardHeader className="text-center space-y-4">
          <Image src="/logo.png" alt="GovDocs LK Logo" width={60} height={60} className="mx-auto" data-ai-hint="logo" />
          <CardTitle className="text-2xl text-foreground">Create an Account</CardTitle>
          <CardDescription>
            Join GovDocs LK to streamline your document processes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="grid gap-2">
                    <Label htmlFor="gender">Title</Label>
                    <Select>
                        <SelectTrigger id="gender">
                            <SelectValue placeholder="Select your title" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="mr">Mr.</SelectItem>
                            <SelectItem value="ms">Ms.</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <div className="grid grid-cols-3 gap-2">
                        <Select>
                            <SelectTrigger id="dob-day">
                                <SelectValue placeholder="Day" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                    <SelectItem key={day} value={String(day)}>{day}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger id="dob-month">
                                <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 12 }, (_, i) => i).map(month => (
                                     <SelectItem key={month} value={String(month + 1)}>{new Date(0, month).toLocaleString('default', { month: 'long' })}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger id="dob-year">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 101 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                    <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input id="first-name" placeholder="John" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input id="last-name" placeholder="Doe" required />
              </div>
               <div className="grid gap-2">
                    <Label htmlFor="province">Province</Label>
                    <Select>
                        <SelectTrigger id="province">
                            <SelectValue placeholder="Select your province" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="western">Western</SelectItem>
                            <SelectItem value="central">Central</SelectItem>
                            <SelectItem value="southern">Southern</SelectItem>
                            <SelectItem value="northern">Northern</SelectItem>
                            <SelectItem value="eastern">Eastern</SelectItem>
                            <SelectItem value="north-western">North Western</SelectItem>
                            <SelectItem value="north-central">North Central</SelectItem>
                            <SelectItem value="uva">Uva</SelectItem>
                            <SelectItem value="sabaragamuwa">Sabaragamuwa</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="district">District</Label>
                    <Select>
                        <SelectTrigger id="district">
                            <SelectValue placeholder="Select your district" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="colombo">Colombo</SelectItem>
                            <SelectItem value="gampaha">Gampaha</SelectItem>
                            <SelectItem value="kalutara">Kalutara</SelectItem>
                            <SelectItem value="kandy">Kandy</SelectItem>
                            <SelectItem value="matale">Matale</SelectItem>
                             {/* Add other districts as needed */}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="nic">NIC Number (Optional)</Label>
                    <Input id="nic" placeholder="e.g. 901234567V or 200012345678" />
                </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
              Create Account
            </Button>
          </div>
          <div className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline text-primary font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
