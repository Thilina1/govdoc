'use client';

import { useRef, RefObject } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { CreditCard, FileText, Banknote, ShieldCheck, Lock, FolderLock, Apple, TabletSmartphone, Smartphone, ArrowRight } from 'lucide-react';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const servicesRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const blogImage1 = PlaceHolderImages.find(p => p.id === 'blog-1');
  const blogImage2 = PlaceHolderImages.find(p => p.id === 'blog-2');
  const blogImage3 = PlaceHolderImages.find(p => p.id === 'blog-3');

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <Header scrollTo={scrollTo} servicesRef={servicesRef} />
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
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Sri Lankan Services, Simplified.
                </h1>
                <p className="text-lg md:text-xl text-white/90">
                  Your central hub for navigating government and banking services. Find clear guides for NIC, passports, digital banking, and more.
                </p>
                <div className="flex space-x-4 pt-4">
                  <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-black">
                     <Apple className="mr-2 h-5 w-5" /> Download on the App Store
                  </Button>
                   <Button variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-black">
                     <Smartphone className="mr-2 h-5 w-5" /> GET IT ON Google Play
                  </Button>
                </div>
              </div>
              <div>
                {/* This div is intentionally left empty to allow the background image to show through on the right side */}
              </div>
            </div>
          </div>
        </section>

        {/* Promo Section */}
        <section className="bg-black text-white py-24 md:py-40">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold max-w-4xl mx-auto">
              Access over 2,700 services by over 800 government agencies and businesses at your fingertips
            </h2>
          </div>
        </section>

        {/* Services Section */}
        <section ref={servicesRef} className="py-20 px-4 bg-white" id="services">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Digital Services at Your Fingertips
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <Card className="border-0 shadow-none">
                <CardHeader className="items-center">
                  <CreditCard className="w-16 h-16 text-primary mb-4" />
                  <CardTitle className="text-xl">National ID (NIC)</CardTitle>
                  <CardDescription>
                    Guides on the 2026 Digital ID, ICAO photo requirements, and application processes.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 shadow-none">
                <CardHeader className="items-center">
                  <FileText className="w-16 h-16 text-primary mb-4" />
                  <CardTitle>Passport (K-35 A)</CardTitle>
                  <CardDescription>
                    Information on the online passport application and biometric centers.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 shadow-none">
                <CardHeader className="items-center">
                  <Banknote className="w-16 h-16 text-primary mb-4" />
                  <CardTitle>Banking Guides</CardTitle>
                  <CardDescription>
                    Learn about digital account opening, personal loans, and Video KYC procedures.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-background" id="features">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              A Platform You Can Trust
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <Card className="bg-transparent border-0 shadow-none items-center">
                <CardHeader className="items-center">
                  <Lock className="w-16 h-16 text-primary mb-4" />
                  <CardTitle className="text-xl">Step-by-Step Guides</CardTitle>
                  <CardDescription>
                    Clear, concise instructions to navigate complex application processes with ease.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-transparent border-0 shadow-none items-center">
                <CardHeader className="items-center">
                  <ShieldCheck className="w-16 h-16 text-primary mb-4" />
                  <CardTitle>Document Checklists</CardTitle>
                  <CardDescription>
                    Never miss a document again with our comprehensive checklists for every service.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-transparent border-0 shadow-none items-center">
                <CardHeader className="items-center">
                  <FolderLock className="w-16 h-16 text-primary mb-4" />
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
        <section className="py-20 px-4 bg-background" id="blog">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12 max-w-2xl mx-auto">
              We blog about our design and development process
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                {blogImage1 && <Image src={blogImage1.imageUrl} alt={blogImage1.description} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={blogImage1.imageHint}/>}
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Making digital services more accessible for all — Part 1</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>
                    Technology is supposed to make life easier, but it may create more problems for us to solve. For example, we need to continuously safeguard our personal data and manage more user IDs.
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Link href="#" className="flex items-center text-primary font-medium hover:underline">
                    Go to article <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
              <Card className="flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                {blogImage2 && <Image src={blogImage2.imageUrl} alt={blogImage2.description} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={blogImage2.imageHint}/>}
                <CardHeader>
                  <CardTitle className="text-lg font-bold">To The Clouds — National Digital Identity</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>
                    "We need to do better," I was thinking to myself while surrounded by chaos. It was hard to believe that just the night before we were celebrating the launch of a new system. At that point, it was an...
                  </CardDescription>
                </CardContent>
                <CardFooter>
                   <Link href="#" className="flex items-center text-primary font-medium hover:underline">
                    Go to article <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
              <Card className="flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                {blogImage3 && <Image src={blogImage3.imageUrl} alt={blogImage3.description} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={blogImage3.imageHint}/>}
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Critical controls for a DevSecOps practice — Part 1</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>
                    Almost everyone is familiar with Fast and Furious – You'd better build that app fast, or your boss will be furious. We image ourselves building a street racing car, with one mission -- be the first to cross
                  </CardDescription>
                </CardContent>
                <CardFooter>
                   <Link href="#" className="flex items-center text-primary font-medium hover:underline">
                    Go to article <ArrowRight className="ml-2 h-4 w-4" />
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
