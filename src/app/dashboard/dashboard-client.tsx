
'use client';

import { useRef, RefObject, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { CreditCard, FileText, Banknote, ShieldCheck, Lock, FolderLock, Apple, TabletSmartphone, Smartphone, ArrowRight, Plus, Mic, ChevronDown, Files, GraduationCap, BookOpen, Book, ClipboardList, Library, Calendar, Briefcase, Trophy } from 'lucide-react';
import DashboardHeader from '@/components/common/dashboard-header';
import Footer from '@/components/common/footer';
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
import { logoutUser } from '@/app/actions/auth';

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
}

// interface UserProfile { ... } (already defined)

export default function DashboardClient({ user }: { user: UserProfile }) {
    const router = useRouter();
    const servicesRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const [isRecording, setIsRecording] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const recognitionRef = useRef<any>(null);
    const [micLanguage, setMicLanguage] = useState({ code: 'en-US', name: 'English' });
    const [currentDate, setCurrentDate] = useState<Date | null>(null);

    useEffect(() => {
        setCurrentDate(new Date());
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000); // Update every second to keep time accurate
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);
    };

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
            drivingLicense: 'சாரதி බලපත්‍රය',
            birthCertificate: 'பிறப்புச் சான்றிதழ்',
            policeClearance: 'பொலிஸ் அறிக்கை',
        },
    };

    const [currentTranslations, setCurrentTranslations] = useState(translations['en-US']);

    useEffect(() => {
        setCurrentTranslations(translations[micLanguage.code as keyof typeof translations] || translations['en-US']);
    }, [micLanguage]);


    const [searchResults, setSearchResults] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event: any) => {
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

    const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const blogImage1 = PlaceHolderImages.find(p => p.id === 'blog-1');
    const blogImage2 = PlaceHolderImages.find(p => p.id === 'blog-2');
    const blogImage3 = PlaceHolderImages.find(p => p.id === 'blog-3');
    const testimonial1 = PlaceHolderImages.find(p => p.id === 'testimonial-1');
    const testimonial2 = PlaceHolderImages.find(p => p.id === 'testimonial-2');
    const testimonial3 = PlaceHolderImages.find(p => p.id === 'testimonial-3');


    return (
        <div className="flex flex-col min-h-screen bg-background font-sans">
            <DashboardHeader
                scrollTo={scrollTo}
                servicesRef={servicesRef}
                user={user}
                logoutAction={async () => await logoutUser()}
            />
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
                                <div>
                                    <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                                        Welcome back, {user.firstName}.
                                    </h1>
                                    {currentDate && (
                                        <p className="text-lg text-white/90 mt-2 font-medium">
                                            {formatDate(currentDate)}
                                        </p>
                                    )}
                                </div>
                                <p className="text-lg md:text-xl text-white/90">
                                    Your central hub to manage your applications and explore new services.
                                </p>
                                <div className="flex space-x-4 pt-4">
                                    <Button className="bg-white text-black hover:bg-neutral-200" onClick={() => scrollTo(searchRef)}>
                                        Search what you want
                                    </Button>
                                </div>
                            </div>
                            <div>
                                {/* Empty div for layout */}
                            </div>
                        </div>
                    </div>
                </section>

                {/* AI Search Section */}
                <section ref={searchRef} className="bg-black text-white py-16 pb-12">
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
                                            <Button variant="ghost" className="text-neutral-400 hover:text-white hover:bg-transparent pr-4">
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
                                                                        <FolderLock className="w-4 h-4 text-neutral-400" />
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





                {/* Features Section - Moved here */}
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

                {/* Resources Grid Section */}
                <section className="bg-gray-50 py-12 border-b">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Government Resources</h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            {[
                                { title: 'Gazette', slug: 'gazette', bg: 'bg-blue-100', icon: FileText, color: 'text-blue-600', description: 'Government Gazettes' },
                                { title: 'Document', slug: 'document', bg: 'bg-indigo-100', icon: Files, color: 'text-indigo-600', description: 'Government Documents' },
                                { title: 'Past Papers', slug: 'past-papers', bg: 'bg-purple-100', icon: GraduationCap, color: 'text-purple-600', description: 'Exam Past Papers' },
                                { title: 'Model Papers', slug: 'model-papers', bg: 'bg-pink-100', icon: BookOpen, color: 'text-pink-600', description: 'Exam Model Papers' },
                                { title: 'Syllabus', slug: 'syllabus', bg: 'bg-rose-100', icon: Book, color: 'text-rose-600', description: 'School Syllabus' },
                                { title: 'Teacher Guides', slug: 'teacher-guides', bg: 'bg-orange-100', icon: Book, color: 'text-orange-600', description: 'Teacher Guides' },
                                { title: 'Term Test Papers', slug: 'term-test-papers', bg: 'bg-amber-100', icon: ClipboardList, color: 'text-amber-600', description: 'Term Test Papers' },
                                { title: 'Text Books', slug: 'text-books', bg: 'bg-yellow-100', icon: Library, color: 'text-yellow-600', description: 'School Text Books' },
                                { title: 'Exam Calendars', slug: 'exam-calendars', bg: 'bg-lime-100', icon: Calendar, color: 'text-lime-600', description: 'Exam Calendars' },
                                { title: 'Jobs', slug: 'jobs', bg: 'bg-green-100', icon: Briefcase, color: 'text-green-600', description: 'Government Jobs' },
                                { title: 'Results', slug: 'results', bg: 'bg-emerald-100', icon: Trophy, color: 'text-emerald-600', description: 'Lottery Results' },
                            ].map((item, index) => (
                                <Link
                                    href={`/resources/${item.slug}`}
                                    key={index}
                                    className="block group w-[calc(50%-0.5rem)] md:w-[calc(25%-0.75rem)] lg:w-[calc(16.666%-0.85rem)]"
                                >
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all h-full text-center flex flex-col items-center">
                                        <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                            <item.icon className={`w-6 h-6 ${item.color}`} />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h3>
                                        <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                                    </div>
                                </Link>
                            ))}
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

            </main>
            <Footer />
        </div>
    );
}
