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
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const servicesRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
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
        <section className="bg-black text-white py-24 md:py-32 lg:py-40">
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
        
        {/* Trending Searches Section */}
        <section className="py-12 bg-background" id="trending">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center text-foreground mb-8">
              Trending searches
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              <Link href="#">
                <Badge variant="outline" className="px-4 py-2 text-base rounded-full hover:bg-accent cursor-pointer">NIC</Badge>
              </Link>
              <Link href="#">
                <Badge variant="outline" className="px-4 py-2 text-base rounded-full hover:bg-accent cursor-pointer">Passport</Badge>
              </Link>
              <Link href="#">
                <Badge variant="outline" className="px-4 py-2 text-base rounded-full hover:bg-accent cursor-pointer">Driving license</Badge>
              </Link>
              <Link href="#">
                <Badge variant="outline" className="px-4 py-2 text-base rounded-full hover:bg-accent cursor-pointer">Birth certificate</Badge>
              </Link>
               <Link href="#">
                <Badge variant="outline" className="px-4 py-2 text-base rounded-full hover:bg-accent cursor-pointer">Police clearance</Badge>
              </Link>
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

        {/* Testimonials Section */}
        <section className="py-20 bg-background" id="testimonials">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12 max-w-2xl mx-auto">
              Hear from our users
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 bg-background">
              <div className="relative aspect-w-1 aspect-h-1">
                {testimonial1 && (
                  <Image src={testimonial1.imageUrl} alt={testimonial1.description} layout="fill" objectFit="cover" data-ai-hint={testimonial1.imageHint}/>
                )}
              </div>
              <div className="bg-black text-white flex items-center p-8 relative">
                <div className="relative">
                  <p className="text-lg relative z-10">"We also want to be independent and be able to do things by ourselves. Fortunately, the GovDocs app considered many of those accessibility features that the visually-impaired community has mentioned."</p>
                  <p className="mt-4 font-bold relative z-10">- Dennis Teo</p>
                  <div className="absolute top-1/2 -translate-y-1/2 -left-12 w-0 h-0 border-t-[20px] border-t-transparent border-b-[20px] border-b-transparent border-r-[25px] border-r-black"></div>
                </div>
              </div>
              <div className="bg-[#E53935] text-white flex items-center p-8 relative">
                <div className="relative">
                  <p className="text-lg relative z-10">"With the GovDocs app, I can easily log in to any government website when I want. No need to remember passwords anymore!"</p>
                  <p className="mt-4 font-bold relative z-10">- Brigitte Chan</p>
                  <div className="absolute top-1/2 -translate-y-1/2 -right-12 w-0 h-0 border-t-[20px] border-t-transparent border-b-[20px] border-b-transparent border-l-[25px] border-l-[#E53935]"></div>
                </div>
              </div>
              <div className="relative aspect-w-1 aspect-h-1">
                {testimonial3 && (
                  <Image src={testimonial3.imageUrl} alt={testimonial3.description} layout="fill" objectFit="cover" data-ai-hint={testimonial3.imageHint}/>
                )}
              </div>
              <div className="relative aspect-w-1 aspect-h-1">
                {testimonial2 && (
                  <Image src={testimonial2.imageUrl} alt={testimonial2.description} layout="fill" objectFit="cover" data-ai-hint={testimonial2.imageHint}/>
                )}
              </div>
              <div className="bg-[#B71C1C] text-white flex items-center p-8 relative">
                <div className="relative">
                  <p className="text-lg relative z-10">"The GovDocs app is very convenient and handy with its features! It makes finding any personal details I would need much quicker."</p>
                  <p className="mt-4 font-bold relative z-10">- Nikita Choudhary</p>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[25px] border-b-[#B71C1C]"></div>
                </div>
              </div>
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
                {blogImage1 && <Image src={blogImage1.imageUrl} alt={blogImage1.description} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={blogImage1.imageHint}/>}
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
                {blogImage2 && <Image src={blogImage2.imageUrl} alt={blogImage2.description} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={blogImage2.imageHint}/>}
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
                {blogImage3 && <Image src={blogImage3.imageUrl} alt={blogImage3.description} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={blogImage3.imageHint}/>}
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

    