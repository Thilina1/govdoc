'use client';

import { useState, useEffect, useActionState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Loader2, Plus, ArrowLeft, Save,
    Folder, FolderOpen, FolderArchive, FolderCheck,
    FolderClock, FolderHeart, FolderKey, FolderLock,
    FolderSearch, FolderCog,
    FileText, Files, ClipboardList, Building2, Landmark,
    Users, UserCheck, CreditCard, Wallet, Car, Bus,
    GraduationCap, Stethoscope, Briefcase, Globe,
    Shield, ShieldCheck, Plane, Scale, Gavel,
    Leaf, TreePine, Sprout, CloudRain, Sun, Zap, Trash2, Recycle,
    Home, Tent, Hotel, Key, MapPin, Navigation,
    Wifi, Laptop, Smartphone, Server, Cpu,
    BookOpen, Library, GraduationCap as Cap, Award,
    HeartPulse, Pill, Activity, Syringe, Ambulance,
    Siren, Flame, Construction, HardHat, Hammer,
    Baby, Accessibility, HandHelping, Utensils
} from 'lucide-react';
import { createCategory, updateCategory, getAllCategories, getCategoryPath, CategoryState } from '@/app/actions/admin';
import { useToast } from '@/hooks/use-toast';
import { AdminHeader } from '@/components/admin/AdminHeader';
import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper';

type Category = {
    id: string;
    name: string;
    parent_id: string | null;
    icon?: string;
};

interface AdminProfile {
    name: string;
    email: string;
}

interface CategoryFormProps {
    admin: AdminProfile;
    initialData?: Category;
    parentId?: string | null;
}

export default function CategoryForm({ admin, initialData, parentId }: CategoryFormProps) {
    const isEditMode = !!initialData;
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    // If editing, use existing parent. If creating, use parentId from props.
    const startParentId = isEditMode ? initialData.parent_id : parentId;

    // parentSelection tracks the path of selected category IDs.
    const [parentSelection, setParentSelection] = useState<string[]>([]);
    const finalParentId = parentSelection.length > 0 ? parentSelection[parentSelection.length - 1] : (startParentId || 'root');

    const initialState: CategoryState = { error: undefined, success: undefined, message: undefined };
    const actionToUse = isEditMode ? updateCategory : createCategory;
    const [state, formAction, isPending] = useActionState(actionToUse, initialState);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const data = await getAllCategories();
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

            // Reconstruct path for parent selection
            const targetParentId = startParentId;
            if (targetParentId && targetParentId !== 'root') {
                try {
                    const path = await getCategoryPath(targetParentId);
                    if (path && path.length > 0) {
                        setParentSelection(path.map(c => String(c.id)));
                    }
                } catch (e) {
                    console.error("Failed to load path for pre-selection", e);
                }
            }
        };
        init();
    }, [startParentId]);

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
                <AdminHeader title={isEditMode ? "Edit Category" : "Add New Category"} admin={admin}>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/categories${parentId ? `?parentId=${parentId}` : ''}`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                </AdminHeader>

                <div className="max-w-2xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Category Details</CardTitle>
                            <CardDescription>{isEditMode ? "Update category details." : "Create a new category. Select a parent to nest it."}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={formAction} className="space-y-6">
                                {isEditMode && <input type="hidden" name="id" value={initialData.id} />}

                                <div className="space-y-2">
                                    <Label htmlFor="name">Category Name</Label>
                                    <Input id="name" name="name" placeholder="e.g. Policies, Resources" required defaultValue={initialData?.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="icon">Category Icon</Label>
                                    <Select name="icon" defaultValue={initialData?.icon || "Folder"}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Icon" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[300px]">
                                            <SelectItem value="Folder"><div className="flex items-center gap-2"><Folder className="h-4 w-4" /> Default Folder</div></SelectItem>

                                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Special Folders</div>
                                            <SelectItem value="FolderOpen"><div className="flex items-center gap-2"><FolderOpen className="h-4 w-4" /> Open</div></SelectItem>
                                            <SelectItem value="FolderArchive"><div className="flex items-center gap-2"><FolderArchive className="h-4 w-4" /> Archive</div></SelectItem>
                                            <SelectItem value="FolderCheck"><div className="flex items-center gap-2"><FolderCheck className="h-4 w-4" /> Verified</div></SelectItem>
                                            <SelectItem value="FolderClock"><div className="flex items-center gap-2"><FolderClock className="h-4 w-4" /> History/Pending</div></SelectItem>
                                            <SelectItem value="FolderLock"><div className="flex items-center gap-2"><FolderLock className="h-4 w-4" /> Secured</div></SelectItem>
                                            <SelectItem value="FolderSearch"><div className="flex items-center gap-2"><FolderSearch className="h-4 w-4" /> Research</div></SelectItem>
                                            <SelectItem value="FolderCog"><div className="flex items-center gap-2"><FolderCog className="h-4 w-4" /> Configurations</div></SelectItem>

                                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Documents & Data</div>
                                            <SelectItem value="FileText"><div className="flex items-center gap-2"><FileText className="h-4 w-4" /> Document</div></SelectItem>
                                            <SelectItem value="Files"><div className="flex items-center gap-2"><Files className="h-4 w-4" /> Multiple Files</div></SelectItem>
                                            <SelectItem value="ClipboardList"><div className="flex items-center gap-2"><ClipboardList className="h-4 w-4" /> Checklist/Forms</div></SelectItem>

                                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Institutions & People</div>
                                            <SelectItem value="Building2"><div className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Department/Office</div></SelectItem>
                                            <SelectItem value="Landmark"><div className="flex items-center gap-2"><Landmark className="h-4 w-4" /> Bank/Gov Body</div></SelectItem>
                                            <SelectItem value="Users"><div className="flex items-center gap-2"><Users className="h-4 w-4" /> Public/Citizens</div></SelectItem>
                                            <SelectItem value="UserCheck"><div className="flex items-center gap-2"><UserCheck className="h-4 w-4" /> Identity/KYC</div></SelectItem>

                                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Services & Sectors</div>
                                            <SelectItem value="CreditCard"><div className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> Payments/Tax</div></SelectItem>
                                            <SelectItem value="Wallet"><div className="flex items-center gap-2"><Wallet className="h-4 w-4" /> Finance</div></SelectItem>
                                            <SelectItem value="Car"><div className="flex items-center gap-2"><Car className="h-4 w-4" /> Transport/Vehicle</div></SelectItem>
                                            <SelectItem value="Bus"><div className="flex items-center gap-2"><Bus className="h-4 w-4" /> Public Transit</div></SelectItem>
                                            <SelectItem value="GraduationCap"><div className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Education</div></SelectItem>
                                            <SelectItem value="Stethoscope"><div className="flex items-center gap-2"><Stethoscope className="h-4 w-4" /> Health</div></SelectItem>
                                            <SelectItem value="Briefcase"><div className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> Employment/Business</div></SelectItem>
                                            <SelectItem value="Globe"><div className="flex items-center gap-2"><Globe className="h-4 w-4" /> Foreign Affairs/Online</div></SelectItem>
                                            <SelectItem value="Shield"><div className="flex items-center gap-2"><Shield className="h-4 w-4" /> Security/Defense</div></SelectItem>
                                            <SelectItem value="Scale"><div className="flex items-center gap-2"><Scale className="h-4 w-4" /> Legal/Justice</div></SelectItem>
                                            <SelectItem value="Gavel"><div className="flex items-center gap-2"><Gavel className="h-4 w-4" /> Court/Law</div></SelectItem>

                                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Environment & Nature</div>
                                            <SelectItem value="Leaf"><div className="flex items-center gap-2"><Leaf className="h-4 w-4" /> Environment</div></SelectItem>
                                            <SelectItem value="TreePine"><div className="flex items-center gap-2"><TreePine className="h-4 w-4" /> Forest/Parks</div></SelectItem>
                                            <SelectItem value="Sprout"><div className="flex items-center gap-2"><Sprout className="h-4 w-4" /> Agriculture</div></SelectItem>
                                            <SelectItem value="CloudRain"><div className="flex items-center gap-2"><CloudRain className="h-4 w-4" /> Water/Irrigation</div></SelectItem>
                                            <SelectItem value="Sun"><div className="flex items-center gap-2"><Sun className="h-4 w-4" /> Energy/Solar</div></SelectItem>
                                            <SelectItem value="Zap"><div className="flex items-center gap-2"><Zap className="h-4 w-4" /> Power/Electricity</div></SelectItem>
                                            <SelectItem value="Recycle"><div className="flex items-center gap-2"><Recycle className="h-4 w-4" /> Waste Mgmt</div></SelectItem>

                                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Housing & Infrastructure</div>
                                            <SelectItem value="Home"><div className="flex items-center gap-2"><Home className="h-4 w-4" /> Housing</div></SelectItem>
                                            <SelectItem value="Construction"><div className="flex items-center gap-2"><Construction className="h-4 w-4" /> Construction/Roads</div></SelectItem>
                                            <SelectItem value="MapPin"><div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Location/Zone</div></SelectItem>
                                            <SelectItem value="Wifi"><div className="flex items-center gap-2"><Wifi className="h-4 w-4" /> Telecom</div></SelectItem>

                                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Health & Safety</div>
                                            <SelectItem value="Ambulance"><div className="flex items-center gap-2"><Ambulance className="h-4 w-4" /> Emergency</div></SelectItem>
                                            <SelectItem value="Siren"><div className="flex items-center gap-2"><Siren className="h-4 w-4" /> Police/Alert</div></SelectItem>
                                            <SelectItem value="Flame"><div className="flex items-center gap-2"><Flame className="h-4 w-4" /> Fire Dept</div></SelectItem>
                                            <SelectItem value="HeartPulse"><div className="flex items-center gap-2"><HeartPulse className="h-4 w-4" /> Healthcare</div></SelectItem>

                                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Social & Education</div>
                                            <SelectItem value="BookOpen"><div className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> Library/Archive</div></SelectItem>
                                            <SelectItem value="Baby"><div className="flex items-center gap-2"><Baby className="h-4 w-4" /> Child Care</div></SelectItem>
                                            <SelectItem value="Accessibility"><div className="flex items-center gap-2"><Accessibility className="h-4 w-4" /> Accessibility</div></SelectItem>
                                            <SelectItem value="HandHelping"><div className="flex items-center gap-2"><HandHelping className="h-4 w-4" /> Social Welfare</div></SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="p-4 bg-muted/50 rounded-lg space-y-4 border">
                                    <Label className="text-base font-semibold">Parent Hierarchy</Label>
                                    <CardDescription className="mb-2">
                                        {isEditMode ? 'Move category inside:' : 'New category will be created inside:'} <span className="font-bold text-foreground block mt-1">{finalParentId === 'root' ? 'Top Level (Root)' : categories.find(c => String(c.id) === String(finalParentId))?.name || 'Loading...'}</span>
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
                                                currentId={initialData?.id} // Pass current ID to avoid self-nesting
                                            />
                                        </div>
                                    )}

                                    <input type="hidden" name="parentId" value={finalParentId} />
                                </div>

                                <Button type="submit" disabled={isPending} className="w-full">
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {isEditMode ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        <>
                                            {isEditMode ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                                            {isEditMode ? 'Update Category' : 'Create Category'}
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
    onSelect,
    currentId
}: {
    categories: Category[],
    parentId: string | null,
    level: number,
    selection: string[],
    onSelect: (l: number, v: string) => void,
    currentId?: string
}) {
    // Filter out children of current category to prevent cycles if we are editing
    const validCategories = currentId
        ? categories.filter(c => c.id !== currentId) // Basic check, better would be recursive descendant check
        : categories;

    const children = validCategories.filter(c => parentId === null ? (c.parent_id === null || c.parent_id === 'root') : String(c.parent_id) === String(parentId));

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
                    currentId={currentId}
                />
            )}
        </div>
    );
}
