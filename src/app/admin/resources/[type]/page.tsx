import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { getAdminProfile } from '@/lib/auth-service';
import {
    getResourceCategoryBySlug,
    getResourcesByCategory,
    getResourceCategories,
    getResourceCategoryById,
    getCategoryAncestors,
    createResourceCategory // We'll need a client form for this
} from '@/app/actions/resources';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, FileText, Download, Folder, ChevronRight, CornerLeftUp } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import CreateFolderDialog from './create-folder-dialog';

export default async function ResourceListPage({
    params,
    searchParams
}: {
    params: Promise<{ type: string }>,
    searchParams: Promise<{ parentId?: string }>
}) {
    const { type } = await params;
    const { parentId } = await searchParams;
    const admin = await getAdminProfile();

    if (!admin) {
        redirect('/admin');
    }

    // 1. Determine Context
    // If parentId is present, we are deep in the hierarchy.
    // If not, we are at the "Root" of this resource type (e.g. Gazette Root).

    let currentCategory;
    let rootCategory;

    // Resolve Root
    rootCategory = await getResourceCategoryBySlug(type);
    if (!rootCategory) {
        return (
            <AdminLayoutWrapper>
                <div className="p-8 text-red-600">
                    Root category "{type}" not found. Please run migrations.
                </div>
            </AdminLayoutWrapper>
        );
    }

    // Resolve Current View
    if (parentId) {
        currentCategory = await getResourceCategoryById(parentId);
    } else {
        currentCategory = rootCategory;
    }

    if (!currentCategory) {
        return <div>Folder not found</div>;
    }

    // 2. Fetch Content
    const subCategories = await getResourceCategories(currentCategory.id);
    const resources = await getResourcesByCategory(currentCategory.id);
    const ancestors = await getCategoryAncestors(currentCategory.id);

    // 3. Breadcrumbs
    // Ancestors usually come Root -> Child -> Grandchild. 
    // We want to link them properly.

    return (
        <AdminLayoutWrapper>
            <div className="container mx-auto px-6 py-6 space-y-6">
                <AdminHeader title={`${currentCategory.name} Manager`} admin={admin} />

                {/* Breadcrumb / Navigation Bar */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white p-3 rounded-md shadow-sm border">
                    <Link href={`/admin/resources/${type}`} className="hover:text-primary font-medium">
                        {rootCategory.name}
                    </Link>
                    {ancestors.map((anc) => (
                        anc.id !== rootCategory.id && (
                            <div key={anc.id} className="flex items-center gap-2">
                                <ChevronRight className="h-4 w-4" />
                                <Link
                                    href={`/admin/resources/${type}?parentId=${anc.id}`}
                                    className={anc.id === currentCategory.id ? "text-foreground font-semibold" : "hover:text-primary"}
                                >
                                    {anc.name}
                                </Link>
                            </div>
                        )
                    ))}
                </div>

                {/* Actions Bar */}
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        {parentId && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={currentCategory.parent_id === rootCategory.id ? `/admin/resources/${type}` : `/admin/resources/${type}?parentId=${currentCategory.parent_id || ''}`}>
                                    <CornerLeftUp className="mr-2 h-4 w-4" /> Up One Level
                                </Link>
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <CreateFolderDialog parentId={currentCategory.id} parentName={currentCategory.name} />
                        <Button asChild>
                            <Link href={`/admin/resources/${type}/new?categoryId=${currentCategory.id}`}>
                                <Plus className="mr-2 h-4 w-4" /> Upload File
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="space-y-6">
                    {/* Folders Section */}
                    {subCategories.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Folders</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {subCategories.map((folder) => (
                                    <Link key={folder.id} href={`/admin/resources/${type}?parentId=${folder.id}`}>
                                        <Card className="hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer border-dashed">
                                            <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2 h-32">
                                                <Folder className="h-10 w-10 text-blue-400 fill-blue-100" />
                                                <span className="font-medium text-sm truncate w-full" title={folder.name}>
                                                    {folder.name}
                                                </span>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Files Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Files</h3>
                        {resources.length === 0 ? (
                            <div className="text-center py-10 border rounded-lg bg-gray-50 text-muted-foreground">
                                {subCategories.length === 0 ? "Empty folder. Create a folder or upload a file." : "No files in this folder."}
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {resources.map((resource) => (
                                    <Card key={resource.id} className="hover:shadow-sm">
                                        <CardContent className="p-3 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-red-50 rounded text-red-600">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-sm">{resource.title}</h4>
                                                    <p className="text-xs text-muted-foreground">{resource.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {resource.file_url && (
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayoutWrapper>
    );
}
