'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, Folder, FileText, ArrowRight, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DashboardHeader from '@/components/common/dashboard-header';
import Footer from '@/components/common/footer';
import { logoutUser } from '@/app/actions/auth';
import Header from '@/components/common/header';

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
}

interface ServicesClientProps {
    user: UserProfile | null;
    categories: any[];
    services: any[];
}

export default function ServicesClient({ user, categories = [], services = [] }: ServicesClientProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);

    // --- Search Logic Overrides Hierarchy ---
    const isSearching = searchTerm.trim().length > 0;

    // --- Hierarchical Data Processing ---

    // 1. Get current path for breadcrumbs
    const getBreadcrumbs = (id: string | null) => {
        if (!id) return [];
        const path = [];
        let curr = categories.find(c => c.id === id);
        while (curr) {
            path.unshift(curr);
            curr = categories.find(c => c.id === curr.parent_id);
        }
        return path;
    };
    const breadcrumbs = getBreadcrumbs(currentCategoryId);

    // 2. Filter Categories
    // If searching: show all matching categories regardless of hierarchy
    // If browsing: show only direct children of currentCategoryId
    const filteredCategories = categories.filter(cat => {
        if (isSearching) {
            return cat.name.toLowerCase().includes(searchTerm.toLowerCase());
        }
        // Hierarchy mode: match parent_id. 
        // Note: parent_id can be null (root) or a string.
        return cat.parent_id === currentCategoryId;
    });

    // 3. Filter Services
    // If searching: show all matching services
    // If browsing: show services belonging to currentCategoryId (direct membership)
    // Optional: Could recursively show all services under this branch? For now, sticky to direct parent match as per typical file system logic.
    const filteredServices = services.filter(service => {
        if (isSearching) {
            return service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return service.category_id === currentCategoryId;
    });

    return (
        <div className="flex flex-col min-h-screen bg-background font-sans">
            {user ? (
                <DashboardHeader
                    user={user}
                    logoutAction={async () => await logoutUser()}
                    variant="opaque"
                />
            ) : (
                <Header variant="opaque" />
            )}

            <main className="flex-1 py-12 bg-gray-50/50">
                <div className="container mx-auto px-4 mt-16">
                    <div className="text-center max-w-2xl mx-auto mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">All Services</h1>
                        <p className="text-gray-600 mb-8 text-lg">
                            Access a comprehensive directory of all government services, documents, and resources available on our platform.
                        </p>

                        <div className="relative shadow-lg rounded-xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                            <Input
                                type="text"
                                placeholder="Search for services, documents, or categories..."
                                className="pl-12 py-7 text-lg bg-white border-gray-200 rounded-xl focus-visible:ring-primary/20"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Breadcrumbs (Only show when not searching and drilled down) */}
                    {!isSearching && currentCategoryId && (
                        <nav className="flex items-center text-sm text-gray-500 mb-8">
                            <button
                                onClick={() => setCurrentCategoryId(null)}
                                className="hover:text-primary transition-colors flex items-center"
                            >
                                <Folder className="w-4 h-4 mr-1" />
                                All Categories
                            </button>
                            {breadcrumbs.map((crumb) => (
                                <div key={crumb.id} className="flex items-center">
                                    <span className="mx-2">/</span>
                                    <button
                                        onClick={() => setCurrentCategoryId(crumb.id)}
                                        className={`hover:text-primary transition-colors ${crumb.id === currentCategoryId ? 'font-semibold text-gray-800' : ''}`}
                                    >
                                        {crumb.name}
                                    </button>
                                </div>
                            ))}
                        </nav>
                    )}

                    {/* Title change based on search/browse */}
                    <div className="mb-8">
                        {isSearching ? (
                            <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>
                        ) : (
                            currentCategoryId ? null : null
                        )}
                    </div>

                    {/* Display Categories */}
                    {filteredCategories.length > 0 && (
                        <div className="mb-16">
                            {!currentCategoryId && !isSearching ? null : (
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800 border-b pb-2">
                                    <Folder className="w-6 h-6 text-yellow-500" /> {isSearching ? 'Matching Categories' : 'Subcategories'}
                                </h3>
                            )}
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {filteredCategories.map((cat) => (
                                    <div
                                        key={cat.id}
                                        onClick={() => {
                                            setSearchTerm(''); // Clear search on click to drill down
                                            setCurrentCategoryId(cat.id);
                                        }}
                                        className="cursor-pointer group bg-white p-5 rounded-xl border border-gray-200 hover:border-primary/50 hover:shadow-md transition-all h-full flex flex-col justify-between"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="bg-yellow-50 p-2 rounded-lg group-hover:bg-yellow-100 transition-colors">
                                                <Folder className="w-6 h-6 text-yellow-600" />
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary -translate-x-1 group-hover:translate-x-0 transition-transform" />
                                        </div>
                                        <span className="font-semibold text-gray-800 group-hover:text-primary leading-tight">{cat.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Display Services */}
                    {filteredServices.length > 0 && (
                        <div>
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800 border-b pb-2">
                                <FileText className="w-6 h-6 text-blue-500" /> Services & Documents
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredServices.map((service) => (
                                    <Card key={service.id} className="hover:shadow-lg transition-all duration-300 border-gray-200 group">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <Badge variant="secondary" className="mb-3 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100">
                                                    {service.categories?.name || 'Service'}
                                                </Badge>
                                                {service.file_url && <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />}
                                            </div>
                                            <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors">{service.name}</CardTitle>
                                            <CardDescription className="line-clamp-2 mt-2">
                                                {service.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Button size="sm" variant="outline" className="w-full group-hover:border-primary/50 group-hover:bg-primary/5" asChild>
                                                {service.file_url ? (
                                                    <a href={service.file_url} target="_blank" rel="noopener noreferrer">
                                                        View Document
                                                    </a>
                                                ) : (
                                                    <span className="text-muted-foreground">No Preview</span>
                                                )}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {filteredCategories.length === 0 && filteredServices.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                            <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <p className="text-xl font-medium text-gray-600">
                                {isSearching ? `No matches found for "${searchTerm}"` : 'This category is empty.'}
                            </p>
                            <p className="text-gray-500 mt-2">
                                {isSearching ? 'Try adjusting your search terms.' : 'Navigate back to explore other categories.'}
                            </p>
                            {isSearching ? (
                                <Button variant="link" onClick={() => setSearchTerm('')} className="mt-4">Clear Search</Button>
                            ) : (
                                <Button variant="link" onClick={() => setCurrentCategoryId(null)} className="mt-4">Go to All Categories</Button>
                            )}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
