
'use client';

import { useState, useActionState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Shield, Key, Loader2, Save, Edit2, X } from 'lucide-react';
import DashboardHeader from '@/components/common/dashboard-header';
import Footer from '@/components/common/footer';
import { ActionState, changePassword, logoutUser, updateProfile } from '@/app/actions/auth';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const initialState: ActionState = {
    message: '',
    error: '',
    success: false,
};

// Sri Lanka Data
const provinces = [
    'Western', 'Central', 'Southern', 'Northern', 'Eastern',
    'North Western', 'North Central', 'Uva', 'Sabaragamuwa'
];

const districtsByProvince: { [key: string]: string[] } = {
    'Western': ['Colombo', 'Gampaha', 'Kalutara'],
    'Central': ['Kandy', 'Matale', 'Nuwara Eliya'],
    'Southern': ['Galle', 'Matara', 'Hambantota'],
    'Northern': ['Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu'],
    'Eastern': ['Batticaloa', 'Ampara', 'Trincomalee'],
    'North Western': ['Kurunegala', 'Puttalam'],
    'North Central': ['Anuradhapura', 'Polonnaruwa'],
    'Uva': ['Badulla', 'Monaragala'],
    'Sabaragamuwa': ['Ratnapura', 'Kegalle']
};

export default function SettingsClient({ user }: { user: any }) {
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);

    // Controlled state for inputs
    const [title, setTitle] = useState(user.title || '');
    const [gender, setGender] = useState(user.gender || '');
    const [province, setProvince] = useState(user.province || '');
    const [district, setDistrict] = useState(user.district || '');

    // Normalize case if needed, but assume DB has Title Case for now or exact matches.
    // If DB has 'mr' and option is 'Mr', it won't select. 
    // We can try to match loosely if needed, but let's stick to standard controlled first.

    // Password Form State
    const [pwdState, pwdAction, pwdPending] = useActionState(changePassword, initialState);

    // Profile Form State
    const [profileState, profileAction, profilePending] = useActionState(updateProfile, initialState);

    useEffect(() => {
        if (pwdState?.success) {
            toast({
                title: "Security Update",
                description: pwdState.message,
                className: "bg-green-600 text-white border-none",
            });
            const form = document.getElementById('pwdForm') as HTMLFormElement;
            if (form) form.reset();
        } else if (pwdState?.error) {
            toast({
                variant: 'destructive',
                title: "Security Update Failed",
                description: pwdState.error,
            });
        }
    }, [pwdState, toast]);

    useEffect(() => {
        if (profileState?.success) {
            toast({
                title: "Profile Updated",
                description: profileState.message,
                className: "bg-green-600 text-white border-none",
            });
            setIsEditing(false); // Exit edit mode on success
        } else if (profileState?.error) {
            toast({
                variant: 'destructive',
                title: "Profile Update Failed",
                description: profileState.error,
            });
        }
    }, [profileState, toast]);

    // Simplified user object for header
    const headerUser = {
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        // Reset local state to initial user value on cancel
        setTitle(user.title || '');
        setGender(user.gender || '');
        setProvince(user.province || '');
        setDistrict(user.district || '');
    };

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newProvince = e.target.value;
        setProvince(newProvince);
        // Reset district if province changes, unless it's the initial load which handled by state init
        setDistrict('');
    };

    // Helper simple select style
    const selectClass = "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    return (
        <div className="flex flex-col min-h-screen bg-background font-sans">
            <DashboardHeader user={headerUser} logoutAction={async () => await logoutUser()} variant="opaque" />

            <main className="flex-1 container mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column: Profile Summary */}
                    <div className="md:col-span-1 space-y-6">
                        <Card>
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-4">
                                    <Avatar className="h-24 w-24">
                                        <AvatarFallback className="text-xl bg-primary text-primary-foreground">{user.first_name[0]}{user.last_name[0]}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <CardTitle>{user.title} {user.first_name} {user.last_name}</CardTitle>
                                <CardDescription>{user.email}</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>

                    {/* Right Column: Details & Forms */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Profile Information Form */}
                        <form action={profileAction}>
                            <Card className="mb-8 relative user-select-none">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <User className="h-5 w-5 text-primary" />
                                        <div>
                                            <CardTitle>Personal Information</CardTitle>
                                            <CardDescription>Update your personal details here.</CardDescription>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant={isEditing ? "ghost" : "outline"}
                                        size="sm"
                                        onClick={isEditing ? handleCancelEdit : () => setIsEditing(true)}
                                    >
                                        {isEditing ? <><X className="mr-2 h-4 w-4" /> Cancel</> : <><Edit2 className="mr-2 h-4 w-4" /> Edit Profile</>}
                                    </Button>
                                </CardHeader>
                                <CardContent className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="title">Title</Label>
                                        <select
                                            name="title"
                                            id="title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            disabled={!isEditing}
                                            className={selectClass}
                                        >
                                            <option value="">Select Title</option>
                                            <option value="Mr">Mr</option>
                                            <option value="Mrs">Mrs</option>
                                            <option value="Miss">Miss</option>
                                            <option value="Ms">Ms</option>
                                            <option value="Dr">Dr</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        {/* Empty for alignment or add something else */}
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="first_name">First Name</Label>
                                        <Input id="first_name" name="first_name" defaultValue={user.first_name} required disabled={!isEditing} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="last_name">Last Name</Label>
                                        <Input id="last_name" name="last_name" defaultValue={user.last_name} required disabled={!isEditing} />
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="date_of_birth">Date of Birth</Label>
                                        <Input id="date_of_birth" name="date_of_birth" type="date" defaultValue={user.date_of_birth || ''} disabled={!isEditing} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="gender">Gender</Label>
                                        <select
                                            name="gender"
                                            id="gender"
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            disabled={!isEditing}
                                            className={selectClass}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="nic_number">NIC Number</Label>
                                        <Input id="nic_number" name="nic_number" defaultValue={user.nic_number || ''} disabled={!isEditing} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="mobile_number">Mobile Number</Label>
                                        <Input id="mobile_number" name="mobile_number" defaultValue={user.mobile_number || ''} disabled={!isEditing} />
                                    </div>
                                </CardContent>

                                <div className="px-6 pb-2">
                                    <Separator />
                                </div>

                                <CardHeader>
                                    <div className="flex items-center space-x-2">
                                        <Mail className="h-5 w-5 text-primary" />
                                        <CardTitle>Address Information</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-1 md:col-span-2">
                                        <Label htmlFor="address_line_1">Address Line 1</Label>
                                        <Input id="address_line_1" name="address_line_1" defaultValue={user.address_line_1 || ''} disabled={!isEditing} />
                                    </div>
                                    <div className="space-y-1 md:col-span-2">
                                        <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
                                        <Input id="address_line_2" name="address_line_2" defaultValue={user.address_line_2 || ''} disabled={!isEditing} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" name="city" defaultValue={user.city || ''} disabled={!isEditing} />
                                    </div>

                                    {/* Province Dropdown */}
                                    <div className="space-y-1">
                                        <Label htmlFor="province">Province</Label>
                                        <select
                                            name="province"
                                            id="province"
                                            value={province}
                                            onChange={handleProvinceChange}
                                            disabled={!isEditing}
                                            className={selectClass}
                                        >
                                            <option value="">Select Province</option>
                                            {provinces.map((p) => (
                                                <option key={p} value={p}>{p}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* District Dropdown */}
                                    <div className="space-y-1">
                                        <Label htmlFor="district">District</Label>
                                        <select
                                            name="district"
                                            id="district"
                                            value={district}
                                            onChange={(e) => setDistrict(e.target.value)}
                                            disabled={!isEditing}
                                            className={selectClass}
                                        >
                                            <option value="">Select District</option>
                                            {province && districtsByProvince[province]?.map((d) => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                            {/* Fallback to show current user district if it doesn't match the list (e.g. legacy data) */}
                                            {(!province || (province && !districtsByProvince[province]?.includes(district))) && district && (
                                                <option value={district}>{district}</option>
                                            )}
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="postal_code">Postal Code</Label>
                                        <Input id="postal_code" name="postal_code" defaultValue={user.postal_code || ''} disabled={!isEditing} />
                                    </div>
                                </CardContent>
                                {isEditing && (
                                    <CardFooter className="flex justify-end bg-muted/50 py-4 mt-2">
                                        <Button type="submit" disabled={profilePending}>
                                            {profilePending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Changes...</> : <><Save className="mr-2 h-4 w-4" /> Save Profile Changes</>}
                                        </Button>
                                    </CardFooter>
                                )}
                            </Card>
                        </form>

                        {/* Security Settings (Change Password) */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <Shield className="h-5 w-5 text-primary" />
                                    <CardTitle>Security</CardTitle>
                                </div>
                                <CardDescription>Manage your password and security phases.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form id="pwdForm" action={pwdAction} className="space-y-4 max-w-md">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">Current Password</Label>
                                        <div className="relative">
                                            <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input id="currentPassword" name="currentPassword" type="password" className="pl-9" placeholder="Enter current password" required />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <div className="relative">
                                            <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input id="newPassword" name="newPassword" type="password" className="pl-9" placeholder="Enter new password (min 8 chars)" required minLength={8} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                        <div className="relative">
                                            <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input id="confirmPassword" name="confirmPassword" type="password" className="pl-9" placeholder="Confirm new password" required />
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <Button type="submit" disabled={pwdPending}>
                                            {pwdPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Change Password</>}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
