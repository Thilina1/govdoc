
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

export async function createSession(userId: string | number, role: 'user' | 'admin' = 'user') {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await new SignJWT({ userId, role })
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
    nicNumber: z.string().min(1),
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

        const nic = getStr('nicNumber');

        if (!email || !password || !nic) {
            return { error: 'Email, password and NIC are required' };
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

export type LoginState = {
    error?: string | null;
    success?: boolean;
};

export async function loginUser(prevState: LoginState, formData: FormData): Promise<LoginState> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log(`[DEBUG] Login attempt for: ${email}`);

    if (!email || !password) {
        return { error: 'Email and password are required', success: false };
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
            return { error: 'Invalid email or password', success: false };
        }

        console.log(`[DEBUG] User found. ID: ${user.id}`);

        // 2. Verify password
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        console.log(`[DEBUG] Password match result: ${passwordMatch}`);

        if (!passwordMatch) {
            return { error: 'Invalid email or password', success: false };
        }

        // 3. Create Session
        await createSession(user.id, 'user');

        return { success: true, error: null };

    } catch (err) {
        console.error('[DEBUG] Unexpected Login error:', err);
        return { error: 'Authentication failed', success: false };
    }
}

export async function loginAdmin(prevState: LoginState, formData: FormData): Promise<LoginState> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log(`[DEBUG] Admin Login attempt for: ${email}`);

    if (!email || !password) {
        return { error: 'Email and password are required', success: false };
    }

    try {
        const supabase = createAdminClient();

        // 1. Check if admin exists in 'admin' table
        const { data: admin, error } = await supabase
            .from('admin')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !admin) {
            console.log("[DEBUG] Supabase error or Admin not found:", error);
            return { error: 'Invalid admin credentials', success: false };
        }

        // 2. Verify password
        const passwordMatch = await bcrypt.compare(password, admin.password_hash);
        if (!passwordMatch) {
            return { error: 'Invalid admin credentials', success: false };
        }

        // 3. Check if account is active
        // Assuming 'is_active' column exists.
        if (admin.is_active === false) {
            console.warn(`[AUTH] Inactive admin login attempt by ${email}`);
            return { error: 'Account is inactive. Please contact support.', success: false };
        }

        // 4. Create Session
        await createSession(admin.id, 'admin');

        return { success: true, error: null };

    } catch (err) {
        console.error('[DEBUG] Unexpected Admin Login error:', err);
        return { error: 'Authentication failed', success: false };
    }
}

export async function registerAdmin(prevState: LoginState, formData: FormData): Promise<LoginState> {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const mobile = formData.get('mobile') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!name || !email || !password || !confirmPassword) {
        return { error: 'Name, email, and password are required', success: false };
    }

    if (password !== confirmPassword) {
        return { error: 'Passwords do not match', success: false };
    }

    if (password.length < 8) {
        return { error: 'Password must be at least 8 characters', success: false };
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);

        const dbAdmin = {
            name,
            email,
            mobile: mobile || null,
            password_hash: passwordHash,
            is_active: true, // Default to active
        };

        const supabase = createAdminClient();

        const { error } = await supabase
            .from('admin')
            .insert([dbAdmin]);

        if (error) {
            console.error('Supabase Admin Register error:', error);
            if (error.code === '23505') {
                return { error: 'Email already exists', success: false };
            }
            return { error: 'Failed to create admin account: ' + error.message, success: false };
        }

        return { success: true, error: null };

    } catch (err) {
        console.error('Admin Registration error:', err);
        return { error: 'An unexpected error occurred', success: false };
    }
}

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
    redirect('/');
}

export type ActionState = {
    error?: string;
    success?: boolean;
    message?: string;
};

export async function changePassword(prevState: ActionState, formData: FormData): Promise<ActionState> {
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

export async function updateProfile(prevState: ActionState, formData: FormData): Promise<ActionState> {
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
