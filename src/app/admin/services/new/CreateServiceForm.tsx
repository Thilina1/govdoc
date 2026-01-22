'use client';

import { useState, useEffect, useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Trash2, Upload, Save } from 'lucide-react';
import { createService, getAllCategories, ServiceState } from '@/app/actions/admin';
import { createBrowserClient } from '@supabase/ssr'; // Ensure you have this or use standard supabase-js if preferred, assuming ssr package is installed based on package.json
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

interface AdminProfile {
    name: string;
    email: string;
}

export default function CreateServiceForm({ admin }: { admin: AdminProfile }) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [customFields, setCustomFields] = useState<CustomField[]>([{ key: '', value: '' }]);
    const [images, setImages] = useState<{ file: File; label: string }[]>([]);
    const [uploading, setUploading] = useState(false);
    const [fileUrl, setFileUrl] = useState('');
    const { toast } = useToast();
    const router = useRouter();

    // Initialize Supabase Client for client-side uploads
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
    );

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('documents')
                .getPublicUrl(filePath);

            setFileUrl(publicUrl);
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

    // Cascading Category Selection State
    const [parentSelection, setParentSelection] = useState<string[]>([]);
    // The final selected category is the last one in the selection chain
    const finalCategoryId = parentSelection.length > 0 ? parentSelection[parentSelection.length - 1] : '';

    const initialState: ServiceState = { error: undefined, success: undefined, message: undefined };
    const [state, formAction, isPending] = useActionState(createService, initialState);

    useEffect(() => {
        const fetchCats = async () => {
            const data = await getAllCategories();
            setCategories(data);
        };
        fetchCats();
    }, []);

    useEffect(() => {
        if (state.success) {
            toast({
                title: "Success",
                description: state.message,
            });
            // Optionally redirect
            // router.push('/admin/dashboard'); 
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

    // Handle Dynamic Fields
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

    // Prepare JSON for hidden input
    const customDetailsJson = JSON.stringify(
        customFields.reduce((acc, curr) => {
            if (curr.key) acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>)
    );

    // Handle Image Upload (UI Only for now)
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


    return (
        <AdminLayoutWrapper>
            <div className="container mx-auto px-6 py-6 space-y-8">
                <AdminHeader title="Create New Service" admin={admin} />

                <div className="max-w-4xl">
                    <form action={formAction}>
                        {/* ... form content ... */}
                        <div className="space-y-8">
                            {/* Basic Details */}
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

                                            {/* Recursive Cascading Dropdowns */}
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
                                            <Input id="name" name="name" placeholder="e.g. KYC Update" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea id="description" name="description" placeholder="Detailed description of the service..." className="min-h-[100px]" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Dynamic Details */}
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

                            {/* Media Gallery */}
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
                                                        {/* Preview not implemented for file object in SSR context easily without URL.createObjectURL which needs client cleanup. Using icon placeholder. */}
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
                                    {/* Note: Image upload logic is separated as per request, actual file upload handling needs Supabase Storage integration */}
                                    {images.length > 0 && <p className="text-xs text-yellow-600 mt-2">Note: Image file upload integration requires storage bucket configuration.</p>}
                                </CardContent>
                            </Card>

                            {/* Resource Document Upload */}
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
                                                    Document Uploaded
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
                                            <Save className="mr-2 h-4 w-4" /> Save Service
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
    // 1. Get children for this level (Use String conversion to handle number/string ID mismatch logic)
    const children = categories.filter(c => parentId === null ? (c.parent_id === null || c.parent_id === 'root') : String(c.parent_id) === String(parentId));

    // 2. Base case: If no children and we are not at root, show empty state (Disabled Dropdown)
    // This provides the visual "end of chain" indicator the user requested.
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

    // 3. Determine current selected value for this level from the selection array
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

            {/* 4. Recursion: If a value is selected, try to render the NEXT level (children of selection) */}
            {currentValue && (
                <CategoryLevel
                    key={currentValue} // Force re-render when parent changes
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
