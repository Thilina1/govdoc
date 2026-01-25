import { getAdminProfile } from '@/lib/auth-service';
import { redirect } from 'next/navigation';
import CategoryForm from '@/components/admin/CategoryForm';
import { getCategoryById } from '@/app/actions/admin';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default async function EditCategoryPage(props: {
    params: Promise<{ id: string }>
}) {
    const params = await props.params;
    const admin = await getAdminProfile();

    if (!admin) {
        redirect('/admin');
    }

    const category = await getCategoryById(params.id);

    if (!category) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                Category not found.
            </div>
        );
    }

    const adminProfile = {
        name: admin.name,
        email: admin.email
    };

    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <CategoryForm admin={adminProfile} initialData={category} />
        </Suspense>
    );
}
