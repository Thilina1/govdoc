
'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/auth-service';

const secretKey = process.env.SESSION_SECRET || 'generated_secret_key_change_me';
const key = new TextEncoder().encode(secretKey);

export async function createSession(userId: number) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await new SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(key);

    const cookieStore = await cookies();
    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });
}

// Define the schema here to ensure server-side validation matches client-side
// We'll relax it slightly to accept strings and parse dates/numbers if needed
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    title: z.string().optional(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    date_of_birth: z.string().optional().nullable(),
    gender: z.string().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    province: z.string().optional(),
    district: z.string().optional(),
    nicNumber: z.string().optional(),
    mobileNumber: z.string().min(1),
});

export type RegisterState = {
    error?: string;
    success?: boolean;
};

export async function registerUser(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
    const rawData = Object.fromEntries(formData.entries());

    // Helper to get string or undefined
    const getStr = (key: string) => {
        const val = formData.get(key);
        return typeof val === 'string' && val.length > 0 ? val : undefined;
    };

    try {
        const email = getStr('email');
        const password = getStr('password');

        if (!email || !password) {
            return { error: 'Email and password are required' };
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Prepare DB object
        const dbUser = {
            title: getStr('title'),
            first_name: getStr('firstName'),
            last_name: getStr('lastName'),
            date_of_birth: getStr('dateOfBirth'), // Expecting YYYY-MM-DD
            gender: getStr('gender'),
            address_line_1: getStr('addressLine1'),
            address_line_2: getStr('addressLine2'),
            city: getStr('city'),
            postal_code: getStr('postalCode'),
            province: getStr('province'),
            district: getStr('district'),
            nic_number: getStr('nicNumber'),
            mobile_number: getStr('mobileNumber'),
            email: email,
            password_hash: passwordHash,
        };

        const supabase = await createClient();

        const { error } = await supabase
            .from('users')
            .insert([dbUser]);

        if (error) {
            console.error('Supabase error:', error);
            if (error.code === '23505') { // Unique violation for email
                return { error: 'Email already exists' };
            }
            return { error: 'Failed to create account: ' + error.message };
        }

        return { success: true };

    } catch (err) {
        console.error('Registration error:', err);
        return { error: 'An unexpected error occurred' };
    }
}

export async function loginUser(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log(`[DEBUG] Login attempt for: ${email}`);

    if (!email || !password) {
        return { error: 'Email and password are required' };
    }

    try {
        // USE ADMIN CLIENT FOR LOGIN TO BYPASS RLS
        const supabase = createAdminClient();

        // 1. Check if user exists
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            console.log("[DEBUG] Supabase error or User not found:", error);
            return { error: 'Invalid email or password' };
        }

        console.log(`[DEBUG] User found. ID: ${user.id}`);

        // 2. Verify password
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        console.log(`[DEBUG] Password match result: ${passwordMatch}`);

        if (!passwordMatch) {
            return { error: 'Invalid email or password' };
        }

        // 3. Create Session
        await createSession(user.id);

        return { success: true };

    } catch (err) {
        console.error('[DEBUG] Unexpected Login error:', err);
        return { error: 'Authentication failed' };
    }
}

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
    redirect('/');
}

export async function changePassword(prevState: any, formData: FormData) {
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return { error: 'All fields are required' };
    }

    if (newPassword !== confirmPassword) {
        return { error: 'New passwords do not match' };
    }

    if (newPassword.length < 8) {
        return { error: 'New password must be at least 8 characters long' };
    }

    const user = await getUserProfile();
    if (!user) {
        return { error: 'Unauthorized' };
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!passwordMatch) {
        return { error: 'Incorrect current password' };
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    const supabase = createAdminClient();
    const { error } = await supabase
        .from('users')
        .update({ password_hash: newPasswordHash })
        .eq('id', user.id);

    if (error) {
        console.error('Password update error:', error);
        return { error: 'Failed to update password' };
    }

    return { success: true, message: 'Password updated successfully' };
}

export async function updateProfile(prevState: any, formData: FormData) {
    const user = await getUserProfile();
    if (!user) {
        return { error: 'Unauthorized' };
    }

    // Helper to get string or null (for DB update)
    const getStr = (key: string) => {
        const val = formData.get(key);
        return typeof val === 'string' && val.length > 0 ? val : null;
    };

    const updates = {
        title: getStr('title'),
        first_name: getStr('first_name'),
        last_name: getStr('last_name'),
        date_of_birth: getStr('date_of_birth'),
        gender: getStr('gender'),
        nic_number: getStr('nic_number'),
        mobile_number: getStr('mobile_number'),
        address_line_1: getStr('address_line_1'),
        address_line_2: getStr('address_line_2'),
        city: getStr('city'),
        district: getStr('district'),
        province: getStr('province'),
        postal_code: getStr('postal_code'),
    };

    const supabase = createAdminClient();
    const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

    if (error) {
        console.error('Profile update error:', error);
        return { error: 'Failed to update profile' };
    }

    return { success: true, message: 'Profile updated successfully' };
}
