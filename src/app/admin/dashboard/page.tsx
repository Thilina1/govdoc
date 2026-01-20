import { getAdminProfile } from '@/lib/auth-service';
import { getUserCount } from '@/app/actions/admin';
import { redirect } from 'next/navigation';
import AdminDashboardClient from './admin-dashboard-client';

export default async function AdminDashboard() {
    const admin = await getAdminProfile();
    const userCount = await getUserCount();

    if (!admin) {
        redirect('/admin');
    }

    // Ensure we only pass serializable data if necessary, though direct db result is slightly risky if it has dates/buffers usually okay but let's be safe
    const adminProfile = {
        name: admin.name,
        email: admin.email
    };

    return <AdminDashboardClient admin={adminProfile} userCount={userCount} />;
}
