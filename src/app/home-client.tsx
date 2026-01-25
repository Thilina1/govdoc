'use client';

import { useRef, RefObject, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowRight, Search, Mic, Globe, DollarSign, Briefcase, FileText, ChevronDown, Check, Menu, X, ShieldAlert, MessageSquareX, CreditCard, BookOpen, Landmark, Apple, Smartphone, Plus, Lock, ShieldCheck, FolderLock, TabletSmartphone, Newspaper, FileClock, FileQuestion, ClipboardList, FileSpreadsheet, Book, Calendar, Trophy } from 'lucide-react';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import DashboardHeader from '@/components/common/dashboard-header';
import { logoutUser } from '@/app/actions/auth';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import CategoryIcon from '@/components/admin/CategoryIcon';

import { ScrollAnimationSection } from '@/components/home/ScrollAnimationSection';

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
}

interface HomeClientProps {
    user: UserProfile | null;
    categories?: any[];
}

export default function HomeClient({ user, categories = [] }: HomeClientProps) {
    const router = useRouter();
    const servicesRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const [isRecording, setIsRecording] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);
    const recognitionRef = useRef<any>(null);
    const [micLanguage, setMicLanguage] = useState({ code: 'en-US', name: 'English' });

    const translations = {
        'en-US': {
            placeholder: 'Ask anything',
            trendingSearches: 'Trending searches',
            nic: 'NIC',
            passport: 'Passport',
            drivingLicense: 'Driving license',
            birthCertificate: 'Birth certificate',
            policeClearance: 'Police clearance',
        },
        'si-LK': {
            placeholder: 'ඕනෑම දෙයක් අසන්න',
            trendingSearches: 'ප්‍රවණතා සෙවීම්',
            nic: 'ජාතික හැඳුනුම්පත',
            passport: 'විදේශ ගමන් බලපත්‍රය',
            drivingLicense: 'රියදුරු බලපත්‍රය',
            birthCertificate: 'උපන් සහතිකය',
            policeClearance: 'පොලිස් වාර්තාව',
        },
        'ta-LK': {
            placeholder: 'எதையும் கேளுங்கள்',
            trendingSearches: 'பிரபலமான தேடல்கள்',
            nic: 'தேசிய அடையாள அட்டை',
            passport: 'கடவுச்சீட்டு',
            drivingLicense: 'சாரதி බලபத்திரம',
            birthCertificate: 'பிறப்புச் சான்றிதழ்',
            policeClearance: 'பொலிஸ் அறிக்கை',
        },
    };

    const [currentTranslations, setCurrentTranslations] = useState(translations['en-US']);

    useEffect(() => {
        setCurrentTranslations(translations[micLanguage.code as keyof typeof translations] || translations['en-US']);
    }, [micLanguage]);


    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = async (event: any) => {
                let interimTranscript = '';
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                const transcript = finalTranscript + interimTranscript;
                setSearchQuery(transcript);

                // Auto-search on final result
                if (finalTranscript) {
                    handleSearch(finalTranscript);
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                    toast({
                        variant: 'destructive',
                        title: 'Microphone Access Denied',
                        description: 'Please enable microphone permissions in your browser settings.',
                    });
                }
                setIsRecording(false);
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };

        } else {
            // Handle browsers that do not support SpeechRecognition
        }
    }, [toast]);

    const handleMicClick = () => {
        if (!recognitionRef.current) {
            toast({
                variant: 'destructive',
                title: 'Unsupported Browser',
                description: 'Your browser does not support voice recognition.',
            });
            return;
        }

        if (isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
        } else {
            try {
                recognitionRef.current.lang = micLanguage.code;
                recognitionRef.current.start();
                setIsRecording(true);
            } catch (error) {
                setIsRecording(false);
                toast({
                    variant: 'destructive',
                    title: 'Voice Recognition Error',
                    description: 'Could not start voice recognition. Please check your microphone.',
                });
            }
        }
    };

    const handleSearch = async (query: string) => {
        if (!query.trim()) return;

        setIsSearching(true);
        setSearchResults(null);

        try {
            const res = await fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });

            if (!res.ok) throw new Error('Search failed');

            const data = await res.json();

            // Smart Navigation Logic: Auto-redirect if only one clear match is found AND query is short (implying lookup, not question)
            // If query is long (>50 chars), allow AI answer to be shown instead of redirecting
            if (searchQuery.length < 50) {
                if (data.directMatches.services.length === 1) {
                    router.push(`/services/${data.directMatches.services[0].id}`);
                    return;
                }
                if (data.directMatches.categories.length === 1 && data.directMatches.services.length === 0) {
                    const slug = data.directMatches.categories[0].name.toLowerCase().replace(/\s+/g, '-');
                    router.push(`/resources/${slug}`);
                    return;
                }
            }

            setSearchResults(data);
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Search Error",
                description: "Failed to perform search. Please try again."
            });
        } finally {
            setIsSearching(false);
        }
    };

    const blogImage1 = PlaceHolderImages.find(p => p.id === 'blog-1');
    const blogImage2 = PlaceHolderImages.find(p => p.id === 'blog-2');
    const blogImage3 = PlaceHolderImages.find(p => p.id === 'blog-3');

    return (
        <div className="flex flex-col min-h-screen bg-background font-sans">
            {user ? (
                <DashboardHeader
                    user={user}
                    logoutAction={async () => await logoutUser()}
                    variant="transparent"
                />
            ) : (
                <Header variant="transparent" />
            )}
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative text-white bg-red-600 -mt-20">
                    <Image
                        src="/Hero_landing_desktop.png"
                        alt="Hero background"
                        fill
                        className="object-cover absolute inset-0 z-0"
                        data-ai-hint="people using phone"
                    />
                    <div className="absolute inset-0 bg-black/50 z-0"></div>
                    <div className="container mx-auto px-4 relative z-10 flex items-center min-h-screen pt-20">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-6">
                                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                                    Sri Lankan Services, Simplified.
                                </h1>
                                <p className="text-lg md:text-xl text-white/90">
                                    Your central hub for navigating government and banking services. Find clear guides for NIC, passports, digital banking, and more.
                                </p>
                                <div className="flex space-x-4 pt-4">
                                    <div className="relative w-52 h-20 cursor-pointer hover:opacity-90 transition-opacity">
                                        <Image
                                            src="/icon/appStore.png"
                                            alt="Download on the App Store"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="relative w-52 h-20 cursor-pointer hover:opacity-90 transition-opacity">
                                        <Image
                                            src="/icon/playStore.png"
                                            alt="Get it on Google Play"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                {/* This div is intentionally left empty to allow the background image to show through on the right side */}
                            </div>
                        </div>
                    </div>
                </section>

                {/* AI Search Section */}
                <section className="bg-black text-white py-16 pb-12">
                    <div className="container mx-auto px-4 flex flex-col items-center text-center">
                        <h2 className="text-3xl font-bold mb-4">How can I help you today?</h2>
                        <div className="w-full max-w-2xl mt-4">
                            <div className="animated-border-wrapper p-[2px] rounded-[28px]">
                                <div className="relative flex items-center w-full bg-[#1F2123] rounded-[26px]">

                                    <Input
                                        type="text"
                                        placeholder={currentTranslations.placeholder}
                                        className="flex-1 bg-transparent border-none text-white placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-base h-auto py-5"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSearch(searchQuery);
                                            }
                                        }}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn("text-neutral-400 hover:text-white", isRecording && 'text-red-500 hover:text-red-400 animate-pulse')}
                                        onClick={handleMicClick}
                                    >
                                        <Mic />
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="text-neutral-400 hover:text-white hover:bg-transparent pr-4" suppressHydrationWarning>
                                                {micLanguage.name}
                                                <ChevronDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-[#1F2123] text-white border-neutral-700">
                                            <DropdownMenuItem onClick={() => setMicLanguage({ code: 'en-US', name: 'English' })} className="hover:!bg-neutral-700 focus:!bg-neutral-700 cursor-pointer">
                                                English
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setMicLanguage({ code: 'si-LK', name: 'සිංහල' })} className="hover:!bg-neutral-700 focus:!bg-neutral-700 cursor-pointer">
                                                සිංහල
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setMicLanguage({ code: 'ta-LK', name: 'தமிழ்' })} className="hover:!bg-neutral-700 focus:!bg-neutral-700 cursor-pointer">
                                                தமிழ்
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>

                        {/* Search Results Display */}
                        {(isSearching || searchResults) && (
                            <div className="w-full max-w-4xl mt-8 text-left space-y-6">
                                {isSearching && (
                                    <div className="text-center text-neutral-400 animate-pulse">
                                        Thinking...
                                    </div>
                                )}

                                {searchResults && (
                                    <>
                                        {/* AI Answer */}
                                        {searchResults.answer && (
                                            <Card className="bg-[#1F2123] border-neutral-800 text-white mb-6">
                                                <CardHeader>
                                                    <CardTitle className="text-lg flex items-center gap-2">
                                                        <div className="bg-blue-500/10 p-2 rounded-full">
                                                            <Smartphone className="w-4 h-4 text-blue-400" />
                                                        </div>
                                                        AI Answer
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="prose prose-invert max-w-none">
                                                        {searchResults.answer}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {/* Direct Matches */}
                                        {(searchResults.directMatches?.services?.length > 0 || searchResults.directMatches?.categories?.length > 0) && (
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold text-neutral-300">Related Services & Categories</h3>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {searchResults.directMatches.services.map((service: any) => (
                                                        <Link key={service.id} href={`/services/${service.id}`} className="block">
                                                            <Card className="bg-[#1F2123] border-neutral-800 hover:bg-neutral-800 transition-colors cursor-pointer">
                                                                <CardHeader className="p-4">
                                                                    <CardTitle className="text-base text-white flex items-center justify-between">
                                                                        {service.name}
                                                                        <ArrowRight className="w-4 h-4 text-neutral-400" />
                                                                    </CardTitle>
                                                                </CardHeader>
                                                            </Card>
                                                        </Link>
                                                    ))}
                                                    {searchResults.directMatches.categories.map((cat: any) => (
                                                        <Link key={cat.id} href={`/categories/${cat.id}`} className="block">
                                                            <Card className="bg-[#1F2123] border-neutral-800 hover:bg-neutral-800 transition-colors cursor-pointer">
                                                                <CardHeader className="p-4">
                                                                    <CardTitle className="text-base text-white flex items-center justify-between">
                                                                        {cat.name} (Category)
                                                                        <CategoryIcon iconName={cat.icon} className="w-4 h-4 text-neutral-400" />
                                                                    </CardTitle>
                                                                </CardHeader>
                                                            </Card>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}


                        <div className="mt-8">
                            <h3 className="text-base font-normal mb-4 text-neutral-300">{currentTranslations.trendingSearches}</h3>
                            <div className="flex flex-wrap justify-center gap-3">
                                <button onClick={() => { setSearchQuery(currentTranslations.nic); handleSearch(currentTranslations.nic); }} className="transition-transform duration-200 ease-in-out hover:scale-105">
                                    <div className="animated-border-wrapper p-[1px] rounded-full">
                                        <Badge variant="outline" className="px-4 py-2 text-base rounded-full bg-[#1F2123] border-transparent text-neutral-300 hover:bg-neutral-800/80 hover:text-white cursor-pointer shadow-sm">{currentTranslations.nic}</Badge>
                                    </div>
                                </button>
                                <button onClick={() => { setSearchQuery(currentTranslations.passport); handleSearch(currentTranslations.passport); }} className="transition-transform duration-200 ease-in-out hover:scale-105">
                                    <div className="animated-border-wrapper p-[1px] rounded-full">
                                        <Badge variant="outline" className="px-4 py-2 text-base rounded-full bg-[#1F2123] border-transparent text-neutral-300 hover:bg-neutral-800/80 hover:text-white cursor-pointer shadow-sm">{currentTranslations.passport}</Badge>
                                    </div>
                                </button>
                                <button onClick={() => { setSearchQuery(currentTranslations.drivingLicense); handleSearch(currentTranslations.drivingLicense); }} className="transition-transform duration-200 ease-in-out hover:scale-105">
                                    <div className="animated-border-wrapper p-[1px] rounded-full">
                                        <Badge variant="outline" className="px-4 py-2 text-base rounded-full bg-[#1F2123] border-transparent text-neutral-300 hover:bg-neutral-800/80 hover:text-white cursor-pointer shadow-sm">{currentTranslations.drivingLicense}</Badge>
                                    </div>
                                </button>
                                <button onClick={() => { setSearchQuery(currentTranslations.birthCertificate); handleSearch(currentTranslations.birthCertificate); }} className="transition-transform duration-200 ease-in-out hover:scale-105">
                                    <div className="animated-border-wrapper p-[1px] rounded-full">
                                        <Badge variant="outline" className="px-4 py-2 text-base rounded-full bg-[#1F2123] border-transparent text-neutral-300 hover:bg-neutral-800/80 hover:text-white cursor-pointer shadow-sm">{currentTranslations.birthCertificate}</Badge>
                                    </div>
                                </button>
                                <button onClick={() => { setSearchQuery(currentTranslations.policeClearance); handleSearch(currentTranslations.policeClearance); }} className="transition-transform duration-200 ease-in-out hover:scale-105">
                                    <div className="animated-border-wrapper p-[1px] rounded-full">
                                        <Badge variant="outline" className="px-4 py-2 text-base rounded-full bg-[#1F2123] border-transparent text-neutral-300 hover:bg-neutral-800/80 hover:text-white cursor-pointer shadow-sm">{currentTranslations.policeClearance}</Badge>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Parent Categories Section */}
                <section className="bg-white py-12 border-b">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold text-center mb-8 text-foreground">Browse by Category</h2>
                        <div className="flex flex-wrap justify-center gap-6">
                            {(categories || [])
                                .filter(c => !c.parent_id || c.parent_id === 'root')
                                .map((cat) => (
                                    <Link key={cat.id} href={`/categories/${cat.id}`} className="block w-full sm:w-[calc(50%-24px)] md:w-[calc(25%-24px)] lg:w-[calc(16.666%-24px)] min-w-[160px] max-w-[200px]">
                                        {/* Note: In a real app, /categories/[id] page should exist. 
                                            Currently linking to /services?parentId=... or similar might be safer 
                                            if /categories doesn't exist, but user asked for "parent categories (1st) level".
                                            Actually, I should verify if /categories/[id] page exists. 
                                            I'll use /services?parentId=${cat.id} for now as that's what Explorer works with, 
                                            or link to the explorer /admin/categories if it's for admins? 
                                            Wait, this is the public home page. 
                                            The Search results link to /categories/${cat.id}. 
                                            Let's use that pattern.
                                        */}
                                        <Card className="hover:shadow-md transition-all hover:-translate-y-1 h-full flex flex-col items-center justify-center p-6 text-center border-gray-100 bg-gray-50/50 hover:bg-white hover:border-blue-200">
                                            <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:bg-blue-50 transition-colors">
                                                <CategoryIcon iconName={cat.icon} className="w-8 h-8 text-blue-600" />
                                            </div>
                                            <span className="font-medium text-gray-900 line-clamp-2">{cat.name}</span>
                                        </Card>
                                    </Link>
                                ))
                            }
                            {(categories || []).filter(c => !c.parent_id || c.parent_id === 'root').length === 0 && (
                                <div className="w-full text-center text-muted-foreground">
                                    No categories found.
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Services Grid Section */}
                <section className="bg-gray-50 py-20">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap justify-center gap-6">
                            {[
                                { title: 'Gazette', desc: 'Sri Lanka Government Gazettes.', icon: Newspaper },
                                { title: 'Document', desc: 'Sri Lanka Government Documents.', icon: FileText },
                                { title: 'Past Papers', desc: 'Sri Lanka Exam Past Past Papers.', icon: FileClock },
                                { title: 'Model Papers', desc: 'Sri Lanka Exam Model Papers.', icon: FileQuestion },
                                { title: 'Syllabus', desc: 'Sri Lanka School Syllabus.', icon: ClipboardList },
                                { title: 'Teacher Guides', desc: 'Sri Lanka School Teacher Guides.', icon: BookOpen },
                                { title: 'Term Test Papers', desc: 'Sri Lanka School Term Test Papers.', icon: FileSpreadsheet },
                                { title: 'Text Books', desc: 'Sri Lanka School Text Books.', icon: Book },
                                { title: 'Exam Calendars', desc: 'Sri Lanka Government Exam Calendars.', icon: Calendar },
                                { title: 'Jobs', desc: 'Sri Lanka Government Jobs', icon: Briefcase },
                                { title: 'Results', desc: 'Sri Lanka Lottery Results', icon: Trophy },
                            ].map((item, index) => {
                                // Simple slugify: lowercase and replace spaces with hyphens
                                const slug = item.title.toLowerCase().replace(/\s+/g, '-');
                                return (
                                    <Link key={index} href={`/resources/${slug}`} className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                                        <Card className="flex items-center gap-5 p-6 h-full transition-all hover:shadow-lg hover:-translate-y-1 border-border/40 hover:border-blue-500/20 group cursor-pointer bg-white">
                                            <div className="border border-blue-100 bg-blue-50/50 p-3.5 rounded-xl group-hover:bg-blue-500 group-hover:border-blue-500 transition-colors">
                                                {(() => {
                                                    // Dynamic Icon Logic:
                                                    // 1. Try to find a matching category by name (case-insensitive)
                                                    // 2. If found and has icon, use CategoryIcon
                                                    // 3. Fallback to hardcoded item.icon
                                                    const matchingCat = categories?.find(c => c.name.toLowerCase() === item.title.toLowerCase());
                                                    if (matchingCat && matchingCat.icon) {
                                                        return <CategoryIcon iconName={matchingCat.icon} className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />;
                                                    }
                                                    return <item.icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" strokeWidth={1.5} />;
                                                })()}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{item.title}</h3>
                                                <p className="text-sm font-medium text-muted-foreground">{item.desc}</p>
                                            </div>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Promo Section */}
                <section className="bg-background text-foreground py-20" id="whats-new">
                    <div className="container mx-auto px-4 text-center">

                        <h3 className="text-2xl font-bold text-center text-foreground mb-12">
                            Digital Service Guides at Your Fingertips
                        </h3>


                        <h2 className="text-3xl md:text-4xl font-bold max-w-4xl mx-auto mb-16">
                            Guidance to access over 2,700 services by over 800 government agencies and businesses at your fingertips
                        </h2>


                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <Card className="border-0 shadow-none bg-transparent">
                                <CardHeader className="items-center">
                                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                        <CreditCard className="w-8 h-8 text-red-600" />
                                    </div>
                                    <CardTitle className="text-xl font-bold">National ID (NIC)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Get clear guidance on the 2026 Digital ID, ICAO photo standards, and application steps.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-none bg-transparent">
                                <CardHeader className="items-center">
                                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                        <BookOpen className="w-8 h-8 text-red-600" />
                                    </div>
                                    <CardTitle className="text-xl font-bold">Passport (K-35 A)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Find information on the online passport process and find regional biometric centers near you.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-none bg-transparent">
                                <CardHeader className="items-center">
                                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                        <Landmark className="w-8 h-8 text-red-600" />
                                    </div>
                                    <CardTitle className="text-xl font-bold">Banking Guides</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        We provide easy-to-follow guides for digital accounts, personal loans, and Video KYC.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                    </div>
                </section>

                {/* Scroll Animation Section */}
                <ScrollAnimationSection />


                {/* Features Section */}
                <section className="py-20 px-4 bg-white" id="features">
                    <div className="container mx-auto">
                        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
                            A Platform You Can Trust
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <Card className="bg-transparent border-0 shadow-none items-center">
                                <CardHeader className="items-center">
                                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                                        <Lock className="w-16 h-16 text-primary" />
                                    </div>
                                    <CardTitle className="text-xl">Step-by-Step Guides</CardTitle>
                                    <CardDescription>
                                        Clear, concise instructions to navigate complex application processes with ease.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            <Card className="bg-transparent border-0 shadow-none items-center">
                                <CardHeader className="items-center">
                                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                                        <ShieldCheck className="w-16 h-16 text-primary" />
                                    </div>
                                    <CardTitle>Document Checklists</CardTitle>
                                    <CardDescription>
                                        Never miss a document again with our comprehensive checklists for every service.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            <Card className="bg-transparent border-0 shadow-none items-center">
                                <CardHeader className="items-center">
                                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                                        <FolderLock className="w-16 h-16 text-primary" />
                                    </div>
                                    <CardTitle>e-Locker Ready</CardTitle>
                                    <CardDescription>
                                        Stay informed about the upcoming 2026 government digital document vault.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                </section>



                {/* Blog Section */}
                <section className="py-20 px-4 bg-white" id="blog">
                    <div className="container mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12 max-w-2xl mx-auto">
                            We blog about our design and development process
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <Card className="flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                {blogImage1 && <Image src={blogImage1.imageUrl} alt={blogImage1.description} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={blogImage1.imageHint} />}
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold">Designing for Digital Accessibility</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <CardDescription>
                                        How we're building an inclusive platform that empowers all Sri Lankans, including those with disabilities, to access digital services with ease.
                                    </CardDescription>
                                </CardContent>
                                <CardFooter>
                                    <Link href="#" className="flex items-center text-primary font-medium hover:underline">
                                        Read more <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </CardFooter>
                            </Card>
                            <Card className="flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                {blogImage2 && <Image src={blogImage2.imageUrl} alt={blogImage2.description} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={blogImage2.imageHint} />}
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold">The SL-ID: A Foundation for Trust</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <CardDescription>
                                        A look into the architecture of Sri Lanka's upcoming national digital identity and how our app will integrate with it to provide secure and seamless services.
                                    </CardDescription>
                                </CardContent>
                                <CardFooter>
                                    <Link href="#" className="flex items-center text-primary font-medium hover:underline">
                                        Read more <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </CardFooter>
                            </Card>
                            <Card className="flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                {blogImage3 && <Image src={blogImage3.imageUrl} alt={blogImage3.description} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={blogImage3.imageHint} />}
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold">Balancing Security and UX in FinTech</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <CardDescription>
                                        Our approach to DevSecOps and UX design for banking integrations, ensuring user data is protected without compromising on a smooth, intuitive experience.
                                    </CardDescription>
                                </CardContent>
                                <CardFooter>
                                    <Link href="#" className="flex items-center text-primary font-medium hover:underline">
                                        Read more <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Fight Scams Section */}
                <section className="py-20 px-4 bg-white">
                    <div className="container mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-foreground">Together, we can fight scams</h2>
                        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                            {/* Col 1 */}
                            <div className="flex flex-col items-center">
                                <div className="bg-gray-100 p-8 rounded-3xl mb-8 relative">
                                    <ShieldAlert className="w-24 h-24 text-gray-700" />
                                    <div className="absolute -bottom-4 -right-4 bg-red-600 text-white p-2 rounded-full">
                                        <Plus className="w-6 h-6 rotate-45" />
                                    </div>
                                </div>
                                <p className="text-xl font-medium max-w-xs text-foreground">Never share your GovDocs login, password, and OTPs with others</p>
                            </div>
                            {/* Col 2 */}
                            <div className="flex flex-col items-center">
                                <div className="bg-gray-100 p-8 rounded-3xl mb-8 relative">
                                    <Globe className="w-24 h-24 text-green-600" />
                                    <div className="absolute -bottom-4 right-1/2 translate-x-1/2 bg-black text-white px-3 py-1 rounded-md text-xs font-mono">
                                        https://...
                                    </div>
                                </div>
                                <p className="text-xl font-medium max-w-xs text-foreground">Check that you are on the official GovDocs LK platform at govdocs.lk</p>
                            </div>
                            {/* Col 3 */}
                            <div className="flex flex-col items-center">
                                <div className="bg-gray-100 p-8 rounded-3xl mb-8 relative">
                                    <div className="relative">
                                        <Smartphone className="w-24 h-24 text-gray-700" />
                                        <div className="absolute top-0 -right-2 bg-red-600 text-white p-1 rounded-full">
                                            <Plus className="w-4 h-4 rotate-45" />
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xl font-medium max-w-xs text-foreground">GovDocs never sends login links or QR codes via SMS or WhatsApp</p>
                            </div>
                        </div>
                        <div className="mt-16">
                            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-6 text-lg h-auto rounded-md">
                                Read more on GovDocs security
                            </Button>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}
