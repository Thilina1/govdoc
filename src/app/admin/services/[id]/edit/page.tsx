import { getAdminProfile } from '@/lib/auth-service';
import { getServiceById } from '@/app/actions/admin';
import { redirect, notFound } from 'next/navigation';
import ServiceForm, { ServiceData } from '@/components/admin/ServiceForm';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [admin, service] = await Promise.all([
        getAdminProfile(),
        getServiceById(id)
    ]);

    if (!admin) {
        redirect('/admin');
    }

    if (!service) {
        notFound();
    }

    const adminProfile = {
        name: admin.name,
        email: admin.email
    };

    const serviceData: ServiceData = {
        id: service.id,
        name: service.name,
        description: service.description,
        category_id: service.category_id,
        custom_details: service.custom_details as Record<string, string>,
        file_url: service.file_url
    };

    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <ServiceForm admin={adminProfile} initialData={serviceData} />
        </Suspense>
    );
}
