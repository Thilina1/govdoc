import { getUserProfile } from '@/lib/auth-service';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getAllCategories, getAllServices } from '@/app/actions/admin';
import ServicesClient from './services-client';

export default async function ServicesPage() {
    const user = await getUserProfile();

    // Map DB user to UserProfile interface if user exists
    let userProfile = null;
    if (user) {
        userProfile = {
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
        };
    }

    const [categories, services] = await Promise.all([
        getAllCategories(),
        getAllServices()
    ]);

    return <ServicesClient user={userProfile} categories={categories} services={services} />;
}
