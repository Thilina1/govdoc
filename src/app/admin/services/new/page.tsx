import { getAdminProfile } from '@/lib/auth-service';
import { redirect } from 'next/navigation';
import CreateServiceForm from './CreateServiceForm';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default async function CreateServicePage() {
    const admin = await getAdminProfile();

    if (!admin) {
        redirect('/admin');
    }

    const adminProfile = {
        name: admin.name,
        email: admin.email
    };

    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <CreateServiceForm admin={adminProfile} />
        </Suspense>
    );
}
