
'use client';

import { useRef, RefObject, useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { CreditCard, FileText, Banknote, ShieldCheck, Lock, FolderLock, Apple, TabletSmartphone, Smartphone, ArrowRight, Plus, Mic, ChevronDown } from 'lucide-react';
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

export default function DashboardClient({ user }: { user: UserProfile }) {
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
                setSearchQuery(finalTranscript + interimTranscript);
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
                        src="/Hero_landing_desktop.webp"
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
                        <div className="mt-8">
                            <h3 className="text-base font-normal mb-4 text-neutral-300">{currentTranslations.trendingSearches}</h3>
                            <div className="flex flex-wrap justify-center gap-3">
                                <button onClick={() => setSearchQuery(currentTranslations.nic)} className="transition-transform duration-200 ease-in-out hover:scale-105">
                                    <div className="animated-border-wrapper p-[1px] rounded-full">
                                        <Badge variant="outline" className="px-4 py-2 text-base rounded-full bg-[#1F2123] border-transparent text-neutral-300 hover:bg-neutral-800/80 hover:text-white cursor-pointer shadow-sm">{currentTranslations.nic}</Badge>
                                    </div>
                                </button>
                                <button onClick={() => setSearchQuery(currentTranslations.passport)} className="transition-transform duration-200 ease-in-out hover:scale-105">
                                    <div className="animated-border-wrapper p-[1px] rounded-full">
                                        <Badge variant="outline" className="px-4 py-2 text-base rounded-full bg-[#1F2123] border-transparent text-neutral-300 hover:bg-neutral-800/80 hover:text-white cursor-pointer shadow-sm">{currentTranslations.passport}</Badge>
                                    </div>
                                </button>
                                <button onClick={() => setSearchQuery(currentTranslations.drivingLicense)} className="transition-transform duration-200 ease-in-out hover:scale-105">
                                    <div className="animated-border-wrapper p-[1px] rounded-full">
                                        <Badge variant="outline" className="px-4 py-2 text-base rounded-full bg-[#1F2123] border-transparent text-neutral-300 hover:bg-neutral-800/80 hover:text-white cursor-pointer shadow-sm">{currentTranslations.drivingLicense}</Badge>
                                    </div>
                                </button>
                                <button onClick={() => setSearchQuery(currentTranslations.birthCertificate)} className="transition-transform duration-200 ease-in-out hover:scale-105">
                                    <div className="animated-border-wrapper p-[1px] rounded-full">
                                        <Badge variant="outline" className="px-4 py-2 text-base rounded-full bg-[#1F2123] border-transparent text-neutral-300 hover:bg-neutral-800/80 hover:text-white cursor-pointer shadow-sm">{currentTranslations.birthCertificate}</Badge>
                                    </div>
                                </button>
                                <button onClick={() => setSearchQuery(currentTranslations.policeClearance)} className="transition-transform duration-200 ease-in-out hover:scale-105">
                                    <div className="animated-border-wrapper p-[1px] rounded-full">
                                        <Badge variant="outline" className="px-4 py-2 text-base rounded-full bg-[#1F2123] border-transparent text-neutral-300 hover:bg-neutral-800/80 hover:text-white cursor-pointer shadow-sm">{currentTranslations.policeClearance}</Badge>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Promo Section */}
                <section className="bg-background text-foreground py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold max-w-4xl mx-auto">
                            Guidance to access over 2,700 services by over 800 government agencies and businesses at your fingertips
                        </h2>
                    </div>
                </section>

                {/* Services Section */}
                <section ref={servicesRef} className="py-20 px-4 bg-white" id="services">
                    <div className="container mx-auto">
                        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
                            Digital Service Guides at Your Fingertips
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <Card className="border-0 shadow-none">
                                <CardHeader className="items-center">
                                    <CreditCard className="w-16 h-16 text-primary mb-4" />
                                    <CardTitle className="text-xl">National ID (NIC)</CardTitle>
                                    <CardDescription>
                                        Get clear guidance on the 2026 Digital ID, ICAO photo standards, and application steps.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            <Card className="border-0 shadow-none">
                                <CardHeader className="items-center">
                                    <FileText className="w-16 h-16 text-primary mb-4" />
                                    <CardTitle>Passport (K-35 A)</CardTitle>
                                    <CardDescription>
                                        Find information on the online passport process and find regional biometric centers near you.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            <Card className="border-0 shadow-none">
                                <CardHeader className="items-center">
                                    <Banknote className="w-16 h-16 text-primary mb-4" />
                                    <CardTitle>Banking Guides</CardTitle>
                                    <CardDescription>
                                        We provide easy-to-follow guides for digital accounts, personal loans, and Video KYC.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                </section>

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

            </main>
            <Footer />
        </div>
    );
}
