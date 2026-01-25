'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
    const router = useRouter();

    return (
        <Button
            variant="ghost"
            className="pl-0 hover:bg-transparent hover:text-foreground text-muted-foreground mb-6"
            onClick={() => router.back()}
        >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
        </Button>
    );
}
