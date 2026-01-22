'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getResourceCategories, getResourcesByCategory, getCategoryAncestors } from '@/app/actions/resources';
import { ArrowLeft, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { AdminSearch } from './AdminSearchInput';
import { AdminHeader, AdminProfile } from './AdminHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronRight, Folder, FileText } from 'lucide-react';

type Category = {
    id: string;
    name: string;
    parent_id: string | null;
};

type Service = {
    id: string;
    title: string;
    category_id: string;
    description?: string;
    slug?: string;
};

export default function Explorer({ admin }: { admin: AdminProfile }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentId = searchParams.get('parentId');

    const [isPending, startTransition] = useTransition();

    const [categories, setCategories] = useState<Category[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [parents, setParents] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [cats, servs, path] = await Promise.all([
                    getResourceCategories(currentId),
                    getResourcesByCategory(currentId || ''),
                    currentId ? getCategoryAncestors(currentId) : []
                ]);
                setCategories(cats);
                setServices(servs);
                setParents(path);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentId]);


    return (
        <div className="space-y-6">
            <AdminHeader
                title={currentId ? (parents.length > 0 ? parents[parents.length - 1].name : 'Loading...') : "Services & Categories"}
                admin={admin}
            >
                {currentId && (
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                )}
            </AdminHeader>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <AdminSearch />
                <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                        {/* 
                            For now, linking to a generic 'resource' type. 
                            If currentId exists, we can pass it as categoryId.
                            The [type] param in /admin/resources/[type]/new is required.
                            We'll use 'general' or derive it from the parent if possible, but 'upload' is safe.
                        */}
                        <Link href={`/admin/resources/upload/new${currentId ? `?categoryId=${currentId}` : ''}`}>
                            <FileText className="mr-2 h-4 w-4" /> Add Resource
                        </Link>
                    </Button>
                    <Button asChild size="sm">
                        <Link href={`/admin/categories/new${currentId ? `?parentId=${currentId}` : ''}`}>
                            <Plus className="mr-2 h-4 w-4" /> Add Category
                        </Link>
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Categories */}
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/admin/categories?parentId=${cat.id}`}
                            className="block"
                        >
                            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <div className="flex items-center gap-2">
                                        <Folder className="h-4 w-4 text-blue-500" />
                                        <CardTitle className="text-sm font-medium">{cat.name}</CardTitle>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xs text-muted-foreground">Category</div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}

                    {/* Services */}
                    {services.map((service) => (
                        <Card key={service.id} className="h-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-green-500" />
                                    <CardTitle className="text-sm font-medium">{service.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xs text-muted-foreground line-clamp-2">
                                    {service.description || 'No description'}
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {categories.length === 0 && services.length === 0 && (
                        <div className="col-span-full text-center py-10 text-muted-foreground">
                            No items found in this category.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
