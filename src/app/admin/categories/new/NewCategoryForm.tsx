'use client';

import { useState, useEffect, useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, ArrowLeft } from 'lucide-react';
import { createResourceCategory, getAllResourceCategories, getCategoryAncestors, ResourceState } from '@/app/actions/resources';
import { useToast } from '@/hooks/use-toast';
import { AdminHeader } from '@/components/admin/AdminHeader';

type Category = {
    id: string;
    name: string;
    parent_id: string | null;
};

interface AdminProfile {
    name: string;
    email: string;
}

export default function NewCategoryForm({ admin }: { admin: AdminProfile }) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const initialParentId = searchParams.get('parentId');

    // parentSelection tracks the path of selected category IDs.
    const [parentSelection, setParentSelection] = useState<string[]>([]);
    const finalParentId = parentSelection.length > 0 ? parentSelection[parentSelection.length - 1] : 'root';

    const initialState: ResourceState = { error: undefined, success: undefined, message: undefined };
    const [state, formAction, isPending] = useActionState(createResourceCategory, initialState);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const data = await getAllResourceCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            await fetchCategories();
            if (initialParentId) {
                try {
                    const path = await getCategoryAncestors(initialParentId);
                    if (path && path.length > 0) {
                        setParentSelection(path.map(c => String(c.id)));
                    }
                } catch (e) {
                    console.error("Failed to load path for pre-selection", e);
                }
            }
        };
        init();
    }, [initialParentId]);

    useEffect(() => {
        if (state.success) {
            toast({
                title: "Success",
                description: state.message,
            });
            fetchCategories();
        } else if (state.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: state.error,
            });
        }
    }, [state, toast]);

    const handleLevelChange = (level: number, value: string) => {
        const newSelection = parentSelection.slice(0, level);
        if (value && value !== 'root_placeholder') {
            newSelection.push(value);
        }
        setParentSelection(newSelection);
    };

    return (
        <AdminLayoutWrapper>
            <div className="container mx-auto px-6 py-6 space-y-8">
                <AdminHeader title="Add New Category" admin={admin}>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/categories${initialParentId ? `?parentId=${initialParentId}` : ''}`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                </AdminHeader>

                <div className="max-w-2xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Category Details</CardTitle>
                            <CardDescription>Create a new category. Select a parent to nest it.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={formAction} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Category Name</Label>
                                    <Input id="name" name="name" placeholder="e.g. Policies, Resources" required />
                                </div>

                                <div className="p-4 bg-muted/50 rounded-lg space-y-4 border">
                                    <Label className="text-base font-semibold">Parent Hierarchy</Label>
                                    <CardDescription className="mb-2">
                                        New category will be created inside: <span className="font-bold text-foreground block mt-1">{finalParentId === 'root' ? 'Top Level (Root)' : categories.find(c => String(c.id) === String(finalParentId))?.name || 'Loading...'}</span>
                                    </CardDescription>

                                    {isLoading ? (
                                        <div className="flex justify-center py-4">
                                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <CategoryLevel
                                                categories={categories}
                                                parentId={null}
                                                level={0}
                                                selection={parentSelection}
                                                onSelect={handleLevelChange}
                                            />
                                        </div>
                                    )}

                                    <input type="hidden" name="parentId" value={finalParentId} />
                                </div>

                                <Button type="submit" disabled={isPending} className="w-full">
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="mr-2 h-4 w-4" /> Create Category
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayoutWrapper>
    );
}

// Recursive Component for Dropdowns
function CategoryLevel({
    categories,
    parentId,
    level,
    selection,
    onSelect
}: {
    categories: Category[],
    parentId: string | null,
    level: number,
    selection: string[],
    onSelect: (l: number, v: string) => void
}) {
    const children = categories.filter(c => parentId === null ? (c.parent_id === null || c.parent_id === 'root') : String(c.parent_id) === String(parentId));

    if (children.length === 0 && parentId !== null) {
        return (
            <div className={`space-y-2 ${level > 0 ? 'ml-4 border-l pl-4' : ''}`}>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">{`Level ${level + 1}`}</Label>
                <Select disabled>
                    <SelectTrigger className="bg-muted/50">
                        <SelectValue placeholder="No sub-categories defined" />
                    </SelectTrigger>
                </Select>
            </div>
        );
    }

    const currentValue = selection[level] || undefined;
    const controlledValue = currentValue !== undefined ? currentValue : '';

    return (
        <div className={`space-y-2 ${level > 0 ? 'ml-4 border-l pl-4' : ''}`}>
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">{level === 0 ? 'Root Level' : `Level ${level + 1}`}</Label>
            <Select
                value={controlledValue}
                onValueChange={(val) => onSelect(level, val)}
            >
                <SelectTrigger className="bg-background">
                    <SelectValue placeholder={`Select Category...`} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="root_placeholder">-- Select Category --</SelectItem>
                    {children.map(cat => (
                        <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {currentValue && currentValue !== 'root_placeholder' && (
                <CategoryLevel
                    key={currentValue}
                    categories={categories}
                    parentId={currentValue}
                    level={level + 1}
                    selection={selection}
                    onSelect={onSelect}
                />
            )}
        </div>
    );
}
