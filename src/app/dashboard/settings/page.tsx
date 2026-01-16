
import { getUserProfile } from '@/lib/auth-service';
import { redirect } from 'next/navigation';
import SettingsClient from './settings-client';
import { cookies } from 'next/headers';

export default async function SettingsPage() {
    const user = await getUserProfile();

    if (!user) {
        // Clear cookie if invalid
        const cookieStore = await cookies();
        cookieStore.delete('session');
        redirect('/login');
    }

    return <SettingsClient user={user} />;
}
