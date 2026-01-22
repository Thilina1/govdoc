import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { getResourceCategoryBySlug, getResourceCategoryById } from '@/app/actions/resources';
import { getAdminProfile } from '@/lib/auth-service';
import { redirect } from 'next/navigation';
import ResourceUploadForm from './ResourceUploadForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function NewResourcePage({
    params,
    searchParams
}: {
    params: Promise<{ type: string }>,
    searchParams: Promise<{ categoryId?: string }>
}) {
    const { type } = await params;
    const { categoryId } = await searchParams;
    const admin = await getAdminProfile();

    if (!admin) {
        redirect('/admin');
    }

    let targetCategory;

    // 1. Try to get category from query param (Deep nesting)
    if (categoryId) {
        targetCategory = await getResourceCategoryById(categoryId);
    }

    // 2. Fallback to Root Type if no specific folder selected
    if (!targetCategory) {
        targetCategory = await getResourceCategoryBySlug(type);
    }

    // Determine back link
    const backLink = targetCategory?.parent_id
        ? `/admin/resources/${type}?parentId=${targetCategory.parent_id}`
        : `/admin/resources/${type}`;

    return (
        <AdminLayoutWrapper>
            <div className="container mx-auto px-6 py-6 space-y-8">
                <AdminHeader title={`New Resource Upload`} admin={admin} />

                <div className="max-w-4xl mx-auto">
                    <Button variant="ghost" size="sm" asChild className="mb-4">
                        <Link href={backLink}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Link>
                    </Button>

                    {!targetCategory ? (
                        <div className="p-8 border border-red-200 bg-red-50 rounded-lg text-center text-red-800">
                            <h3 className="font-bold text-lg mb-2">Category Not Found</h3>
                            <p>Target folder/category could not be identified.</p>
                        </div>
                    ) : (
                        <div>
                            <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-md text-sm border border-blue-100">
                                Uploading to: <strong>{targetCategory.name}</strong>
                            </div>
                            <ResourceUploadForm
                                categoryId={targetCategory.id}
                                categoryName={targetCategory.name}
                                resourceTypeSlug={type}
                            />
                        </div>
                    )}
                </div>
            </div>
        </AdminLayoutWrapper>
    );
}
