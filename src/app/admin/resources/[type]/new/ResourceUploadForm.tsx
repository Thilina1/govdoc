'use client';

import { useState, useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, Save, Trash2, Plus } from 'lucide-react';
import { uploadResourceFile } from '@/app/actions/admin';
import { createResource, ResourceState } from '@/app/actions/resources';
import { createBrowserClient } from '@supabase/ssr';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface ResourceUploadFormProps {
    categoryId: string;
    categoryName: string;
    resourceTypeSlug: string; // for redirect back
}

export default function ResourceUploadForm({ categoryId, categoryName, resourceTypeSlug }: ResourceUploadFormProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    const [fileUrl, setFileUrl] = useState('');
    const [customFields, setCustomFields] = useState<{ key: string, value: string }[]>([
        { key: 'Year', value: new Date().getFullYear().toString() }
    ]);



    const initialState: ResourceState = { error: undefined, success: undefined, message: undefined };
    const [state, formAction, isPending] = useActionState(createResource, initialState);

    useEffect(() => {
        if (state.success) {
            toast({
                title: "Success",
                description: state.message,
            });
            // Redirect handled by server action revalidation or manual navigation if needed, 
            // but for now relying on server action revalidatePath might not be enough for client-side transition if we used simple form.
            // Actually, we should redirect explicitly.
            router.push(redirectPath);
        } else if (state.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: state.error,
            });
        }
    }, [state, toast, router, resourceTypeSlug]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('categoryName', categoryName);

            const result = await uploadResourceFile(formData);

            if (result.error) throw new Error(result.error);
            if (!result.publicUrl) throw new Error('No public URL returned');

            setFileUrl(result.publicUrl);
            toast({ title: "File uploaded successfully" });
        } catch (error: any) {
            console.error('Upload error:', error);
            toast({
                variant: "destructive",
                title: "Upload failed",
                description: error.message,
            });
        } finally {
            setUploading(false);
        }
    };

    // Custom Fields Logic
    const addCustomField = () => setCustomFields([...customFields, { key: '', value: '' }]);
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

    const redirectPath = `/admin/resources/${resourceTypeSlug}${categoryId ? `?parentId=${categoryId}` : ''}`;

    return (
        <form action={formAction} className="max-w-2xl mx-auto">
            <input type="hidden" name="categoryId" value={categoryId} />
            <input type="hidden" name="customDetails" value={customDetailsJson} />
            <input type="hidden" name="fileUrl" value={fileUrl} />
            <input type="hidden" name="redirectPath" value={redirectPath} />

            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>Upload {categoryName}</CardTitle>
                    <CardDescription>Add a new document to {categoryName} collection.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* File Upload Section - Most Important */}
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${fileUrl ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                        <div className="flex flex-col items-center gap-2">
                            {fileUrl ? <FileText className="h-10 w-10 text-green-600" /> : <Upload className="h-10 w-10 text-gray-400" />}

                            <div className="relative">
                                {fileUrl ? (
                                    <div className="text-sm text-green-700 font-medium">
                                        Document Ready <br />
                                        <a href={fileUrl} target="_blank" className="underline text-xs">View Uploaded</a>
                                    </div>
                                ) : (
                                    <>
                                        <label htmlFor="file-upload" className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium">
                                            {uploading ? 'Uploading...' : 'Select PDF Document'}
                                        </label>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            className="hidden"
                                            onChange={handleFileUpload}
                                            disabled={uploading}
                                        />
                                        <p className="text-xs text-muted-foreground mt-2">PDF, DOC, DOCX up to 10MB</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" placeholder={`e.g. ${categoryName} 2024`} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" placeholder="Short description..." />
                        </div>

                        {/* Simplified Custom Fields */}
                        <div className="space-y-2">
                            <Label>Additional Details</Label>
                            {customFields.map((field, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder="Key (e.g. Year)"
                                        value={field.key}
                                        onChange={(e) => updateCustomField(index, 'key', e.target.value)}
                                        className="flex-1"
                                    />
                                    <Input
                                        placeholder="Value"
                                        value={field.value}
                                        onChange={(e) => updateCustomField(index, 'value', e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeCustomField(index)}>
                                        <Trash2 className="h-4 w-4 text-gray-400" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={addCustomField} className="w-full">
                                <Plus className="mr-2 h-4 w-4" /> Add Detail
                            </Button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={isPending || (uploading)} className="min-w-[120px]">
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}

// Helper icon
function FileText({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10 9H8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
        </svg>
    )
}
