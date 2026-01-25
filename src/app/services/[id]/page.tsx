import { getServiceById } from '@/app/actions/admin';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, CheckCircle2, Info, Download } from 'lucide-react';
import Link from 'next/link';
import BackButton from '@/components/common/back-button';

export default async function ServicePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const service = await getServiceById(resolvedParams.id);

    if (!service) {
        notFound();
    }

    // @ts-ignore
    const categoryName = service.categories?.name || 'General';
    const customDetails = service.custom_details || {};

    return (
        <div className="flex flex-col min-h-screen bg-background font-sans">
            <Header variant="opaque" />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
                <BackButton />

                <div className="space-y-8">
                    {/* Header Section */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                {categoryName}
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">{service.name}</h1>
                        {service.description && (
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                {service.description}
                            </p>
                        )}
                        {service.file_url && (
                            <div className="pt-4">
                                <Button asChild size="lg" className="w-full md:w-auto">
                                    <a href={service.file_url} target="_blank" rel="noopener noreferrer">
                                        <Download className="w-5 h-5 mr-2" />
                                        Download Document
                                    </a>
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="grid gap-6">
                        {/* Custom Details - Dynamically Rendered */}
                        {Object.entries(customDetails).length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-4">
                                {Object.entries(customDetails).map(([key, value]) => (
                                    <Card key={key} className="bg-card border-border/50 shadow-sm">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                                <Info className="w-4 h-4" />
                                                {key.replace(/_/g, ' ')}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-lg font-medium whitespace-pre-wrap">
                                                {String(value)}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="bg-muted/50 border-dashed">
                                <CardContent className="py-8 text-center text-muted-foreground">
                                    No additional details available for this service.
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
