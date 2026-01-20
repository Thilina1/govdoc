
import { createAdminClient } from '@/lib/supabase/admin';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const secretKey = process.env.SESSION_SECRET || 'generated_secret_key_change_me';
const key = new TextEncoder().encode(secretKey);

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    if (!session) return null;
    try {
        const { payload } = await jwtVerify(session, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

export async function getUserProfile() {
    const session = await getSession();
    if (!session) return null;

    const adminSupabase = createAdminClient();
    const { data: user, error } = await adminSupabase
        .from('users')
        .select('*')
        .eq('id', session.userId)
        .single();

    if (error || !user) return null;

    return user;
}

export async function getAdminProfile() {
    const session = await getSession();
    if (!session || session.role !== 'admin') return null;

    const adminSupabase = createAdminClient();
    const { data: admin, error } = await adminSupabase
        .from('admin')
        .select('*')
        .eq('id', session.userId)
        .single();

    if (error || !admin) return null;

    return admin;
}
