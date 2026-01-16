
import { getUserProfile } from '@/lib/auth-service';
import { redirect } from 'next/navigation';
import DashboardClient from './dashboard-client';
import { cookies } from 'next/headers';

export default async function DashboardPage() {
    const user = await getUserProfile();

    if (!user) {
        // Clear cookie if invalid to be safe
        const cookieStore = await cookies();
        cookieStore.delete('session');
        redirect('/login');
    }

    // Map DB user to UserProfile interface
    const userProfile = {
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
    };

    return <DashboardClient user={userProfile} />;
}
