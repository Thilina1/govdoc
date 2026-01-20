import { getAdminProfile } from '@/lib/auth-service';
import { redirect } from 'next/navigation';
import NewCategoryForm from './NewCategoryForm';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default async function NewCategoryPage() {
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
            <NewCategoryForm admin={adminProfile} />
        </Suspense>
    );
}
