
import { getUserProfile } from '@/lib/auth-service';
import { redirect } from 'next/navigation';
import SettingsClient from './settings-client';

export default async function SettingsPage() {
    const user = await getUserProfile();


    if (!user) {
        redirect('/login');
    }

    return <SettingsClient user={user} />;
}
