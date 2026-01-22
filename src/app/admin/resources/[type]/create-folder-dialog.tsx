'use client';
// Dialog component for creating a new folder

import { useState, useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FolderPlus, Loader2 } from 'lucide-react';
import { createResourceCategory } from '@/app/actions/resources';
import { useToast } from '@/hooks/use-toast';

export default function CreateFolderDialog({ parentId, parentName }: { parentId: string, parentName: string }) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const [state, formAction, isPending] = useActionState(createResourceCategory, {});

    useEffect(() => {
        if (state?.success) {
            setOpen(false);
            toast({ title: "Folder created" });
        } else if (state?.error) {
            toast({ variant: "destructive", title: "Error", description: state.error });
        }
    }, [state, toast]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary">
                    <FolderPlus className="mr-2 h-4 w-4" /> New Folder
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form action={formAction}>
                    <input type="hidden" name="parentId" value={parentId} />
                    <DialogHeader>
                        <DialogTitle>Create New Folder</DialogTitle>
                        <DialogDescription>
                            Create a sub-folder inside <strong>{parentName}</strong>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g. 2024 or January"
                                className="col-span-3"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
