'use client';

import { useState, useEffect, useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Trash2, Upload, Save } from 'lucide-react';
import { createService, updateService, getAllCategories, uploadResourceFile, ServiceState } from '@/app/actions/admin';
// import { createBrowserClient } from '@supabase/ssr'; // Removed as we use server action for upload
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper';

type Category = {
    id: string;
    name: string;
    parent_id: string | null;
};

type CustomField = {
    key: string;
    value: string;
};

type Reference = {
    label: string;
    url: string;
};

interface AdminProfile {
    name: string;
    email: string;
}

export interface ServiceData {
    id?: string;
    name: string;
    description?: string;
    category_id: string;
    custom_details?: Record<string, string>;
    references?: Reference[];
    file_url?: string | null;
}

interface ServiceFormProps {
    admin: AdminProfile;
    initialData?: ServiceData;
}

export default function ServiceForm({ admin, initialData }: ServiceFormProps) {
    const isEditMode = !!initialData;
    const [categories, setCategories] = useState<Category[]>([]);
    const [customFields, setCustomFields] = useState<CustomField[]>(
        initialData?.custom_details
            ? Object.entries(initialData.custom_details).map(([key, value]) => ({ key, value }))
            : [{ key: '', value: '' }]
    );
    const [images, setImages] = useState<{ file: File; label: string }[]>([]);
    const [references, setReferences] = useState<Reference[]>(initialData?.references || []);
    const [uploading, setUploading] = useState(false);
    const [fileUrl, setFileUrl] = useState(initialData?.file_url || '');
    const { toast } = useToast();
    const router = useRouter();

    // const supabase = createBrowserClient(
    //     process.env.NEXT_PUBLIC_SUPABASE_URL!,
    //     process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
    // );

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('categoryName', 'service_doc');

        try {
            const result = await uploadResourceFile(formData);

            if (result.error) {
                throw new Error(result.error);
            }

            setFileUrl(result.publicUrl || '');
            toast({
                title: "File uploaded",
                description: "Document ready to be saved with the service.",
            });
        } catch (error: any) {
            console.error('Upload error:', error);
            toast({
                variant: "destructive",
                title: "Upload failed",
                description: error.message || "Failed to upload file",
            });
        } finally {
            setUploading(false);
        }
    };

    const [parentSelection, setParentSelection] = useState<string[]>([]);
    const [finalCategoryId, setFinalCategoryId] = useState(initialData?.category_id || '');

    const initialState: ServiceState = { error: undefined, success: undefined, message: undefined };
    const actionToUse = isEditMode ? updateService : createService;
    const [state, formAction, isPending] = useActionState(actionToUse, initialState);

    useEffect(() => {
        const fetchCats = async () => {
            const data = await getAllCategories();
            setCategories(data);
        };
        fetchCats();
    }, []);

    useEffect(() => {
        if (initialData?.category_id && categories.length > 0 && parentSelection.length === 0) {
            const path: string[] = [];
            let current = categories.find(c => String(c.id) === String(initialData.category_id));

            while (current) {
                path.unshift(String(current.id));
                if (current.parent_id) {
                    // eslint-disable-next-line no-loop-func
                    current = categories.find(c => String(c.id) === String(current?.parent_id));
                } else {
                    current = undefined;
                }
            }
            // Only set if we found a path
            if (path.length > 0) {
                setParentSelection(path);
                setFinalCategoryId(initialData.category_id);
            }
        }
    }, [categories, initialData, parentSelection.length]);

    useEffect(() => {
        if (state.success) {
            toast({
                title: "Success",
                description: state.message,
            });
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

        if (newSelection.length > 0) {
            setFinalCategoryId(newSelection[newSelection.length - 1]);
        } else {
            setFinalCategoryId('');
        }
    };

    const addCustomField = () => {
        setCustomFields([...customFields, { key: '', value: '' }]);
    };

    const removeCustomField = (index: number) => {
        const newFields = [...customFields];
        newFields.splice(index, 1);
        setCustomFields(newFields);
    };

    const updateCustomField = (index: number, field: 'key' | 'value', newValue: string) => {
        const newFields = [...customFields];
        newFields[index][field] = newValue;
        setCustomFields(newFields);
    };

    const customDetailsJson = JSON.stringify(
        customFields.reduce((acc, curr) => {
            if (curr.key) acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>)
    );

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newImages = Array.from(e.target.files).map(file => ({ file, label: '' }));
            setImages([...images, ...newImages]);
        }
    };

    const updateImageLabel = (index: number, label: string) => {
        const newImages = [...images];
        newImages[index].label = label;
        setImages(newImages);
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const addReference = () => {
        setReferences([...references, { label: '', url: '' }]);
    };

    const removeReference = (index: number) => {
        const newRefs = [...references];
        newRefs.splice(index, 1);
        setReferences(newRefs);
    };

    const updateReference = (index: number, field: 'label' | 'url', value: string) => {
        const newRefs = [...references];
        newRefs[index][field] = value;
        setReferences(newRefs);
    };

    const referencesJson = JSON.stringify(references);

    return (
        <AdminLayoutWrapper>
            <div className="container mx-auto px-6 py-6 space-y-8">
                <AdminHeader title={isEditMode ? "Edit Service" : "Create New Service"} admin={admin} />

                <div className="max-w-4xl">
                    <form action={formAction}>
                        {isEditMode && <input type="hidden" name="id" value={initialData.id} />}

                        <div className="space-y-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic Information</CardTitle>
                                    <CardDescription>Enter the core details of the service.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Category Selection</Label>
                                            <CardDescription className="mb-2">
                                                Selected Category: <span className="font-bold text-foreground">{finalCategoryId ? categories.find(c => String(c.id) === String(finalCategoryId))?.name : 'None'}</span>
                                            </CardDescription>

                                            <div className="p-4 bg-muted/30 rounded-lg space-y-4 border">
                                                <CategoryLevel
                                                    categories={categories}
                                                    parentId={null}
                                                    level={0}
                                                    selection={parentSelection}
                                                    onSelect={handleLevelChange}
                                                />
                                            </div>
                                            <input type="hidden" name="categoryId" value={finalCategoryId} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Service Name</Label>
                                            <Input id="name" name="name" placeholder="e.g. KYC Update" required defaultValue={initialData?.name} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea id="description" name="description" placeholder="Detailed description of the service..." className="min-h-[100px]" defaultValue={initialData?.description} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Custom Service Details</CardTitle>
                                    <CardDescription>Add specific attributes like 'Processing Time', 'Requirements', etc.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {customFields.map((field, index) => (
                                        <div key={index} className="flex gap-4 items-end">
                                            <div className="flex-1 space-y-2">
                                                <Label className="text-xs text-muted-foreground">Field Name (Key)</Label>
                                                <Input
                                                    placeholder="e.g. processing_time"
                                                    value={field.key}
                                                    onChange={(e) => updateCustomField(index, 'key', e.target.value)}
                                                />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <Label className="text-xs text-muted-foreground">Value</Label>
                                                <Input
                                                    placeholder="e.g. Instant"
                                                    value={field.value}
                                                    onChange={(e) => updateCustomField(index, 'value', e.target.value)}
                                                />
                                            </div>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeCustomField(index)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" onClick={addCustomField} className="w-full border-dashed">
                                        <Plus className="mr-2 h-4 w-4" /> Add Field
                                    </Button>
                                    <input type="hidden" name="customDetails" value={customDetailsJson} />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>References</CardTitle>
                                    <CardDescription>Add relevant links for this service.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {references.map((ref, index) => (
                                        <div key={index} className="flex gap-4 items-end">
                                            <div className="flex-1 space-y-2">
                                                <Label className="text-xs text-muted-foreground">Label</Label>
                                                <Input
                                                    placeholder="e.g. Official Website"
                                                    value={ref.label}
                                                    onChange={(e) => updateReference(index, 'label', e.target.value)}
                                                />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <Label className="text-xs text-muted-foreground">URL</Label>
                                                <Input
                                                    placeholder="https://example.com"
                                                    value={ref.url}
                                                    onChange={(e) => updateReference(index, 'url', e.target.value)}
                                                />
                                            </div>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeReference(index)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" onClick={addReference} className="w-full border-dashed">
                                        <Plus className="mr-2 h-4 w-4" /> Add Reference
                                    </Button>
                                    <input type="hidden" name="references" value={referencesJson} />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Media Gallery</CardTitle>
                                    <CardDescription>Upload images related to this service.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-accent/50 transition-colors cursor-pointer relative">
                                        <Input type="file" multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageChange} />
                                        <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                                        <p className="text-sm font-medium">Drag and drop images here, or click to select files</p>
                                        <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG</p>
                                    </div>

                                    {images.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                            {images.map((img, index) => (
                                                <div key={index} className="flex items-center gap-4 p-3 border rounded-md bg-card">
                                                    <div className="h-16 w-16 bg-muted rounded overflow-hidden flex-shrink-0">
                                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-xs text-gray-400">Preview</div>
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <p className="text-sm font-medium truncate max-w-[150px]">{img.file.name}</p>
                                                        <Input
                                                            placeholder="Image Label (e.g. Front View)"
                                                            value={img.label}
                                                            onChange={(e) => updateImageLabel(index, e.target.value)}
                                                            className="h-8 text-xs"
                                                        />
                                                    </div>
                                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeImage(index)} className="text-red-500">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {images.length > 0 && <p className="text-xs text-yellow-600 mt-2">Note: Image file upload integration requires storage bucket configuration.</p>}
                                </CardContent>
                            </Card>

                            <Card className="border-blue-200 bg-blue-50/20">
                                <CardHeader>
                                    <CardTitle className="text-blue-800">Resource Document (PDF)</CardTitle>
                                    <CardDescription>Upload the main document (Gazette, Past Paper, etc.) for this service.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <Input
                                                id="file-upload"
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={handleFileUpload}
                                                disabled={uploading}
                                                className="cursor-pointer file:cursor-pointer file:text-blue-600 file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:rounded-full file:mr-4 file:font-semibold hover:file:bg-blue-100 transition-all"
                                            />
                                            {uploading && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                                        </div>

                                        {fileUrl && (
                                            <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-md flex items-center gap-2 text-sm">
                                                <span className="font-semibold">✓ Ready to save:</span>
                                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="underline truncate max-w-[300px] block">
                                                    {fileUrl.split('/').pop() || 'Document Uploaded'}
                                                </a>
                                            </div>
                                        )}
                                        <input type="hidden" name="fileUrl" value={fileUrl} />
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                                <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 min-w-[150px]">
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" /> {isEditMode ? 'Update Service' : 'Save Service'}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayoutWrapper>
    );
}

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
            <div className={`space-y-2 ${level > 0 ? 'ml-4 border-l pl-4 mt-2' : ''}`}>
                <Label>Sub-categories</Label>
                <Select disabled>
                    <SelectTrigger>
                        <span className="text-muted-foreground">No sub-categories defined</span>
                    </SelectTrigger>
                </Select>
            </div>
        );
    }

    const currentValue = selection[level] || undefined;

    return (
        <div className={`space-y-2 ${level > 0 ? 'ml-4 border-l pl-4 mt-2' : ''}`}>
            <Label>{level === 0 ? 'Main Category' : `Sub-categories`}</Label>
            <Select
                value={currentValue}
                onValueChange={(val) => onSelect(level, val)}
            >
                <SelectTrigger>
                    <SelectValue placeholder={`Select ${level === 0 ? 'Main' : 'Sub'} Category`} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="root_placeholder">-- Select Category --</SelectItem>
                    {children.map(cat => (
                        <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {currentValue && (
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
