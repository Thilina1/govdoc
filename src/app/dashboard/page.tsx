
import { getUserProfile } from '@/lib/auth-service';
import { redirect } from 'next/navigation';
import DashboardClient from './dashboard-client';

export default async function DashboardPage() {
    const user = await getUserProfile();


    if (!user) {
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
