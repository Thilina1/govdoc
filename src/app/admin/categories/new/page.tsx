import { getAdminProfile } from '@/lib/auth-service';
import { redirect } from 'next/navigation';
import CategoryForm from '@/components/admin/CategoryForm';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default async function NewCategoryPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams;
    const admin = await getAdminProfile();

    if (!admin) {
        redirect('/admin');
    }

    const adminProfile = {
        name: admin.name,
        email: admin.email
    };

    const parentId = typeof searchParams.parentId === 'string' ? searchParams.parentId : undefined;

    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <CategoryForm admin={adminProfile} parentId={parentId} />
        </Suspense>
    );
}
