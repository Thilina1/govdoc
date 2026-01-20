import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper';
import Explorer from '@/components/admin/Explorer';
import { getAdminProfile } from '@/lib/auth-service';
import { redirect } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

export default async function CategoryManagerPage() {
    const admin = await getAdminProfile();

    if (!admin) {
        redirect('/admin');
    }

    const adminProfile = {
        name: admin.name,
        email: admin.email
    };

    return (
        <AdminLayoutWrapper>
            <div className="container mx-auto px-6 py-6 space-y-8">
                <Suspense fallback={<div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
                    <Explorer admin={adminProfile} />
                </Suspense>
            </div>
        </AdminLayoutWrapper>
    );
}
