'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, Loader2, FileText, Folder } from 'lucide-react';
import { searchGlobal, getCategoryPath } from '@/app/actions/admin';

export function AdminSearch() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ categories: any[], services: any[] } | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Simple Debounce
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                setIsLoading(true);
                try {
                    const data = await searchGlobal(query);
                    setResults(data);
                    setIsOpen(true);
                } catch (e) {
                    console.error(e);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults(null);
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Click outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSelect = (type: 'category' | 'service', id: string, parentId?: string) => {
        setIsOpen(false);
        setQuery('');
        if (type === 'category') {
            // Go to explorer with this parentId? No, if we select a category, we want to SEE INSIDE it.
            // So parentId = id.
            router.push(`/admin/categories?parentId=${id}`);
            // Note: I am assuming /admin/categories will be the MAIN explorer page.
            // Or maybe I should make a new /admin/explorer page?
            // The user said "move to the section", so using the Categories page as the explorer seems right.
        } else {
            // Service: Go to parent category? Or detail page?
            // "display cards display 1st layer categories when click... display cards... display"
            // If search directly, display but path need to display...
            // Implementation: We can go to the explorer view with the service's parent category active.
            // But ideally service detail. For now, let's go to parent category (Explorer view).
            if (parentId) {
                router.push(`/admin/categories?parentId=${parentId}`);
            }
        }
    };

    return (
        <div className="relative w-full max-w-sm" ref={wrapperRef}>
            <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-8 w-full bg-background"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => { if (results) setIsOpen(true); }}
                />
                {isLoading && (
                    <div className="absolute right-2.5 top-2.5">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                )}
            </div>

            {isOpen && results && (
                <div className="absolute top-full mt-2 w-full bg-popover text-popover-foreground rounded-md border shadow-md z-50 max-h-[300px] overflow-y-auto">
                    {results.categories.length === 0 && results.services.length === 0 ? (
                        <div className="p-4 text-sm text-center text-muted-foreground">No results found.</div>
                    ) : (
                        <>
                            {results.categories.length > 0 && (
                                <div className="py-2">
                                    <h4 className="px-3 text-xs font-semibold text-muted-foreground mb-1">Categories</h4>
                                    {results.categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-accent flex items-center"
                                            onClick={() => handleSelect('category', cat.id)}
                                        >
                                            <Folder className="h-3 w-3 mr-2 text-blue-500" />
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {results.services.length > 0 && (
                                <div className="py-2 border-t">
                                    <h4 className="px-3 text-xs font-semibold text-muted-foreground mb-1">Services</h4>
                                    {results.services.map((svc) => (
                                        <button
                                            key={svc.id}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-accent flex items-center"
                                            onClick={() => handleSelect('service', svc.id, svc.category_id)}
                                        >
                                            <FileText className="h-3 w-3 mr-2 text-green-500" />
                                            {svc.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
