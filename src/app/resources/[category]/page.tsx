
import { createAdminClient } from '@/lib/supabase/admin';
import { getResourceCategories } from '@/app/actions/resources';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, ArrowLeft, Calendar, File, Folder } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import { getUserProfile } from '@/lib/auth-service';
import DashboardHeader from '@/components/common/dashboard-header';
import { logoutUser } from '@/app/actions/auth';

export const revalidate = 0; // Dynamic data

async function getCategoryBySlug(slug: string) {
    const supabase = createAdminClient();
    // Convert slug back to approximate name logic isn't ideal for primary lookup if we have the slug field in DB.
    // We should try to look up by slug first.

    // 1. Try exact match on slug
    const { data: slugData, error: slugError } = await supabase
        .from('resource_categories')
        .select('*')
        .eq('slug', slug)
        .single();

    if (slugData) return slugData;

    // 2. Fallback: Fuzzy match on name (for legacy or direct URL typing)
    const namePattern = slug.replace(/-/g, ' ');
    const { data: nameData } = await supabase
        .from('resource_categories')
        .select('*')
        .ilike('name', namePattern)
        .single();

    return nameData;
}

async function getResources(categoryId: string) {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false });

    if (error) return [];
    return data;
}

export default async function ResourcePage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const user = await getUserProfile();

    let userProfile = null;
    if (user) {
        userProfile = {
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
        };
    }

    // 1. Fetch Category
    const categoryData = await getCategoryBySlug(category);

    if (!categoryData) {
        // Option to show empty state or waiting for admin to create it
    }

    // 2. Fetch Resources & Subcategories
    const resources = categoryData ? await getResources(categoryData.id) : [];
    const subcategories = categoryData ? await getResourceCategories(categoryData.id) : [];

    const title = categoryData ? categoryData.name : category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
        <div className="flex flex-col min-h-screen bg-background font-sans">
            {userProfile ? (
                <DashboardHeader
                    user={userProfile}
                    logoutAction={logoutUser}
                    variant="opaque"
                />
            ) : (
                <Header variant="opaque" />
            )}

            <main className="flex-1 container mx-auto px-4 py-12 mt-20">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold mb-4">{title}</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Browse and download the latest {title.toLowerCase()} from the official sources.
                    </p>
                </div>

                {!categoryData ? (
                    <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                        <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-medium">Category Not Found</h3>
                        <p className="text-muted-foreground mt-2">
                            The category "{title}" hasn't been created in the system yet.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* 1. Folders Section */}
                        {subcategories.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Folder className="w-6 h-6 text-yellow-500" /> Folders
                                </h2>
                                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {subcategories.map((sub: any) => (
                                        <Link href={`/resources/${sub.slug}`} key={sub.id} className="block group">
                                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-3">
                                                <div className="bg-yellow-100 p-2 rounded-lg group-hover:bg-yellow-200 transition-colors">
                                                    <Folder className="w-6 h-6 text-yellow-600" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-gray-900 truncate">{sub.name}</h3>
                                                    <p className="text-xs text-gray-500">Open Folder</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 2. Resources Section */}
                        {(resources.length > 0 || subcategories.length === 0) && (
                            <section>
                                {subcategories.length > 0 && resources.length > 0 && (
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                        <FileText className="w-6 h-6 text-blue-500" /> Documents
                                    </h2>
                                )}

                                {resources.length === 0 ? (
                                    // Only show empty state if NO folders AND NO files
                                    subcategories.length === 0 && (
                                        <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                                            <File className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                            <h3 className="text-xl font-medium">No Resources Available</h3>
                                            <p className="text-muted-foreground mt-2">
                                                No documents have been uploaded for this category yet.
                                            </p>
                                        </div>
                                    )
                                ) : (
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {resources.map((res: any) => (
                                            <Card key={res.id} className="hover:shadow-md transition-shadow">
                                                <CardHeader>
                                                    <div className="flex justify-between items-start">
                                                        <div className="p-2 bg-blue-50 rounded-lg">
                                                            <FileText className="w-6 h-6 text-blue-600" />
                                                        </div>
                                                        {res.created_at && (
                                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {new Date(res.created_at).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <CardTitle className="mt-4 leading-tight">{res.title}</CardTitle>
                                                    <CardDescription className="line-clamp-2 mt-2">
                                                        {res.description}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    {res.custom_details && Object.keys(res.custom_details).length > 0 && (
                                                        <div className="mb-6 space-y-1">
                                                            {Object.entries(res.custom_details).slice(0, 3).map(([key, value]) => (
                                                                <div key={key} className="flex justify-between text-sm">
                                                                    <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}:</span>
                                                                    <span className="font-medium text-foreground truncate max-w-[50%]">{String(value)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {res.file_url ? (
                                                        <Button className="w-full" asChild>
                                                            <a href={res.file_url} target="_blank" rel="noopener noreferrer">
                                                                <Download className="w-4 h-4 mr-2" /> Download Document
                                                            </a>
                                                        </Button>
                                                    ) : (
                                                        <Button variant="outline" className="w-full" disabled>
                                                            No Document Available
                                                        </Button>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
